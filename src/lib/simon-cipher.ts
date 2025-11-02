export type SimonVariant = "32/64" | "48/96" | "64/128" | "96/144" | "128/256";

export interface Operation {
  operation: string;
  result: string;
}

export interface EncryptionStep {
  round: number;
  leftWord: string;
  rightWord: string;
  roundKey?: string;
  operations?: Operation[];
  description: string;
}

interface SimonConfig {
  blockSize: number;
  keySize: number;
  wordSize: number;
  rounds: number;
  keyWords: number;
}

const SIMON_CONFIGS: Record<SimonVariant, SimonConfig> = {
  "32/64": {
    blockSize: 32,
    keySize: 64,
    wordSize: 16,
    rounds: 32,
    keyWords: 4,
  },
  "48/96": {
    blockSize: 48,
    keySize: 96,
    wordSize: 24,
    rounds: 36,
    keyWords: 4,
  },
  "64/128": {
    blockSize: 64,
    keySize: 128,
    wordSize: 32,
    rounds: 44,
    keyWords: 4,
  },
  "96/144": {
    blockSize: 96,
    keySize: 144,
    wordSize: 48,
    rounds: 52,
    keyWords: 3,
  },
  "128/256": {
    blockSize: 128,
    keySize: 256,
    wordSize: 64,
    rounds: 72,
    keyWords: 4,
  },
};

export function rotateLeft(
  value: bigint,
  shift: number,
  wordSize: number,
): bigint {
  const mask = (1n << BigInt(wordSize)) - 1n;
  return (
    ((value << BigInt(shift)) | (value >> BigInt(wordSize - shift))) & mask
  );
}

export function rotateRight(
  value: bigint,
  shift: number,
  wordSize: number,
): bigint {
  const mask = (1n << BigInt(wordSize)) - 1n;
  return (
    ((value >> BigInt(shift)) | (value << BigInt(wordSize - shift))) & mask
  );
}

function hexToBigInt(hex: string): bigint {
  return BigInt("0x" + hex);
}

function bigIntToHex(value: bigint, wordSize: number): string {
  const hexLength = Math.ceil(wordSize / 4);
  return value.toString(16).padStart(hexLength, "0");
}

function generateKeySchedule(key: bigint[], config: SimonConfig): bigint[] {
  const { rounds, keyWords, wordSize } = config;
  const roundKeys: bigint[] = [...key];
  const mask = (1n << BigInt(wordSize)) - 1n;

  const z = [
    0b11111010001001010110000111001101111101000100101011000011100110n,
    0b10001110111110010011000010110101000111011111001001100001011010n,
    0b10101111011100000011010010011000101000010001111110010110110011n,
    0b11011011101011000110010111100000010010001010011100110100001111n,
    0b11010001111001101011011000100000010111000011001010010011101111n,
  ];

  const zSeq = keyWords === 4 ? z[2] : z[3];

  for (let i = keyWords; i < rounds; i++) {
    let tmp = rotateRight(roundKeys[i - 1], 3, wordSize);
    if (keyWords === 4) {
      tmp ^= roundKeys[i - 3];
    }
    tmp ^= rotateRight(tmp, 1, wordSize);

    const zBit = (zSeq >> BigInt((i - keyWords) % 62)) & 1n;
    roundKeys[i] = (~roundKeys[i - keyWords] ^ tmp ^ zBit ^ 3n) & mask;
  }

  return roundKeys;
}

export function simonEncrypt(
  plaintextHex: string,
  keyHex: string,
  variant: SimonVariant,
): { ciphertext: string; steps: EncryptionStep[] } {
  const config = SIMON_CONFIGS[variant];
  const { wordSize, rounds, keyWords } = config;

  // Validate input lengths
  const expectedPlaintextLength = config.blockSize / 4;
  const expectedKeyLength = config.keySize / 4;

  if (plaintextHex.length !== expectedPlaintextLength) {
    throw new Error(
      `El texto plano debe tener ${expectedPlaintextLength} caracteres hex ${variant}`,
    );
  }
  if (keyHex.length !== expectedKeyLength) {
    throw new Error(
      `La clave debe tener ${expectedKeyLength} caracteres hex para ${variant}`,
    );
  }

  // Parse plaintext
  const wordHexLength = wordSize / 4;
  const leftHex = plaintextHex.slice(0, wordHexLength);
  const rightHex = plaintextHex.slice(wordHexLength);

  let x = hexToBigInt(leftHex);
  let y = hexToBigInt(rightHex);

  // Parse key
  const keyArray: bigint[] = [];
  for (let i = 0; i < keyWords; i++) {
    const start = i * wordHexLength;
    const end = start + wordHexLength;
    keyArray.unshift(hexToBigInt(keyHex.slice(start, end)));
  }

  // Generate key schedule
  const roundKeys = generateKeySchedule(keyArray, config);

  const steps: EncryptionStep[] = [];
  const mask = (1n << BigInt(wordSize)) - 1n;

  // Initial state
  steps.push({
    round: 0,
    leftWord: bigIntToHex(x, wordSize),
    rightWord: bigIntToHex(y, wordSize),
    description: "Estado Inicial",
  });

  // Encryption rounds
  for (let i = 0; i < rounds; i++) {
    const s1 = rotateLeft(x, 1, wordSize);
    const s8 = rotateLeft(x, 8, wordSize);
    const s2 = rotateLeft(x, 2, wordSize);

    const f = ((s1 & s8) ^ s2) & mask;
    const tmp = y;
    y = x;
    x = (f ^ tmp ^ roundKeys[i]) & mask;

    steps.push({
      round: i + 1,
      leftWord: bigIntToHex(x, wordSize),
      rightWord: bigIntToHex(y, wordSize),
      roundKey: bigIntToHex(roundKeys[i], wordSize),
      operations: [
        { operation: "S¹(x)", result: bigIntToHex(s1, wordSize) },
        { operation: "S⁸(x)", result: bigIntToHex(s8, wordSize) },
        { operation: "S²(x)", result: bigIntToHex(s2, wordSize) },
        { operation: "f(x)", result: bigIntToHex(f, wordSize) },
      ],
      description: `Ronda ${i + 1}`,
    });
  }

  const ciphertext = bigIntToHex(x, wordSize) + bigIntToHex(y, wordSize);

  return { ciphertext, steps };
}
