import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Play, Pause, RotateCcw } from "lucide-react";
import {
  simonEncrypt,
  type SimonVariant,
  type EncryptionStep,
} from "@/lib/simon-cipher";

export function SimonCipherVisualizer() {
  const [variant, setVariant] = useState<SimonVariant>("64/128");
  const [plaintext, setPlaintext] = useState("0123456789abcdef");
  const [key, setKey] = useState("0f0e0d0c0b0a09080706050403020100");
  const [steps, setSteps] = useState<EncryptionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const variants: SimonVariant[] = [
    "32/64",
    "48/96",
    "64/128",
    "96/144",
    "128/256",
  ];

  const generateRandomKey = () => {
    const keySize = Number.parseInt(variant.split("/")[1]);
    const hexLength = keySize / 4;
    const randomHex = Array.from({ length: hexLength }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
    setKey(randomHex);
  };

  const handleEncrypt = () => {
    try {
      const result = simonEncrypt(plaintext, key, variant);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (error) {
      console.error("[v0] Encryption error:", error);
      alert(error instanceof Error ? error.message : "Encryption failed");
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Input Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Ingrese sus parametros de encripción
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="variant">Variante Simon</Label>
              <Select
                value={variant}
                onValueChange={(v) => setVariant(v as SimonVariant)}
              >
                <SelectTrigger id="variant">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v) => (
                    <SelectItem key={v} value={v}>
                      Simon {v} (Bloque/Clave en bits)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plaintext">Texto Plano (Hex)</Label>
              <Input
                id="plaintext"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter hex plaintext"
                className="font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Clave (Hex)</Label>
            <div className="flex gap-2">
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter hex key"
                className="font-mono flex-1"
              />
              <Button onClick={generateRandomKey} variant="outline" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={handleEncrypt} className="w-full" size="lg">
            Cifrar
          </Button>
        </CardContent>
      </Card>

      {/* Visualization */}
      {steps.length > 0 && (
        <>
          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant="default"
                    size="sm"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Reproducir
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Paso {currentStep + 1} / {steps.length}
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max={steps.length - 1}
                  value={currentStep}
                  onChange={(e) => {
                    setCurrentStep(Number.parseInt(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Step Details */}
          <Tabs defaultValue="round" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="round">Detalles de Ronda</TabsTrigger>
              <TabsTrigger value="keys">Esquema de Claves</TabsTrigger>
              <TabsTrigger value="result">Resultado Final</TabsTrigger>
            </TabsList>

            <TabsContent value="round" className="space-y-4">
              {currentStepData && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Ronda {currentStepData.round}</span>
                        <Badge>{currentStepData.description}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Salida Palabra Izquierda (x)
                          </Label>
                          <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                            {currentStepData.leftWord}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Salida Palabra Derecha (y)
                          </Label>
                          <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                            {currentStepData.rightWord}
                          </div>
                        </div>
                      </div>

                      {currentStepData.operations && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Operaciones
                          </Label>
                          <div className="p-4 bg-secondary/50 rounded-md space-y-2">
                            {currentStepData.operations.map((op, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm font-mono"
                              >
                                <Badge variant="outline" className="shrink-0">
                                  {op.operation}
                                </Badge>
                                <span className="text-muted-foreground">=</span>
                                <span className="break-all">{op.result}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentStepData.roundKey && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Clave de Ronda
                          </Label>
                          <div className="p-3 bg-accent/10 rounded-md font-mono text-sm break-all">
                            {currentStepData.roundKey}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="keys" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Esquema de Claves</CardTitle>
                  <CardDescription>Claves de ronda generadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {steps
                      .filter((step) => step.roundKey)
                      .map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className={`p-3 rounded-md font-mono text-sm break-all transition-colors ${
                              step.round === currentStepData?.round
                                ? "bg-accent/20 border-2 border-accent"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">
                                Ronda {step.round}
                              </span>
                            </div>
                            {step.roundKey}
                          </div>
                          {step.round === currentStepData?.round && (
                            <div
                              className={`p-3 rounded-md font-mono text-sm break-all transition-colors ${
                                step.round === currentStepData?.round
                                  ? "bg-accent/20 border-2 border-accent"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  Generación de Clave k[{step.round}]
                                </span>
                              </div>

                              {/* Initial keys from master key */}
                              {(() => {
                                const config = {
                                  "32/64": {
                                    keyWords: 4,
                                    wordSize: 16,
                                    zSeq: 2,
                                  },
                                  "48/96": {
                                    keyWords: 4,
                                    wordSize: 24,
                                    zSeq: 2,
                                  },
                                  "64/128": {
                                    keyWords: 4,
                                    wordSize: 32,
                                    zSeq: 2,
                                  },
                                  "96/144": {
                                    keyWords: 3,
                                    wordSize: 48,
                                    zSeq: 3,
                                  },
                                  "128/256": {
                                    keyWords: 4,
                                    wordSize: 64,
                                    zSeq: 2,
                                  },
                                }[variant];

                                const { keyWords, wordSize, zSeq } = config;

                                return step.round < keyWords + 1 ? (
                                  <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded mb-2">
                                      Las primeras {keyWords} claves se extraen
                                      directamente de la clave maestra
                                    </div>
                                    <div className="bg-white p-2 rounded border border-blue-200">
                                      <div className="text-xs text-muted-foreground mb-1">
                                        Clave Maestra:
                                      </div>
                                      <div className="flex flex-row w-full">
                                        <div className="text-muted-foreground opacity-50">
                                          {key.split(step.roundKey!)[0]}
                                        </div>
                                        <div className="text-blue-700 font-bold bg-blue-100 px-1">
                                          {step.roundKey}
                                        </div>
                                        <div className="text-muted-foreground opacity-50">
                                          {key.split(step.roundKey!)[1]}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Generated keys - calculate actual intermediate values */
                                  (() => {
                                    const m = keyWords;
                                    const mask = (1n << BigInt(wordSize)) - 1n;

                                    // Get previous round keys as BigInt
                                    const k_i_minus_1_hex =
                                      steps[step.round - 1]?.roundKey || "0";
                                    const k_i_minus_1 = BigInt(
                                      "0x" + k_i_minus_1_hex,
                                    );

                                    const k_i_minus_3_hex =
                                      keyWords === 4 && steps[step.round - 3]
                                        ? steps[step.round - 3].roundKey
                                        : null;
                                    const k_i_minus_3 = k_i_minus_3_hex
                                      ? BigInt("0x" + k_i_minus_3_hex)
                                      : null;

                                    const k_i_minus_m_hex =
                                      steps[step.round - m]?.roundKey || "0";
                                    const k_i_minus_m = BigInt(
                                      "0x" + k_i_minus_m_hex,
                                    );

                                    // Z sequences
                                    const Z_SEQUENCES = [
                                      0b11111010001001010110000111001101111101000100101011000011100110n,
                                      0b10001110111110010011000010110101000111011111001001100001011010n,
                                      0b10101111011100000011010010011000101000010001111110010110110011n,
                                      0b11011011101011000110010111100000010010001010011100110100001111n,
                                      0b11010001111001101011011000100000010111000011001010010011101111n,
                                    ];

                                    const zSequence = Z_SEQUENCES[zSeq];
                                    const zIndex = (step.round - m) % 62;
                                    const zBit =
                                      (zSequence >> BigInt(zIndex)) & 1n;

                                    // CALCULATE tmp step by step
                                    // Step 1a: S³(k[i-1])
                                    const s3_result =
                                      ((k_i_minus_1 >> 3n) |
                                        (k_i_minus_1 << BigInt(wordSize - 3))) &
                                      mask;
                                    const s3_hex = s3_result
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    // Step 1b: XOR with k[i-3] if m=4
                                    let tmp_partial = s3_result;
                                    let tmp_partial_hex = s3_hex;
                                    if (
                                      keyWords === 4 &&
                                      k_i_minus_3 !== null
                                    ) {
                                      tmp_partial =
                                        (s3_result ^ k_i_minus_3) & mask;
                                      tmp_partial_hex = tmp_partial
                                        .toString(16)
                                        .padStart(wordSize / 4, "0");
                                    }

                                    // Step 1c: XOR with S¹(tmp_partial)
                                    const s1_tmp =
                                      ((tmp_partial >> 1n) |
                                        (tmp_partial << BigInt(wordSize - 1))) &
                                      mask;
                                    const s1_tmp_hex = s1_tmp
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    const tmp_final =
                                      (tmp_partial ^ s1_tmp) & mask;
                                    const tmp_final_hex = tmp_final
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    // CALCULATE k[i] step by step
                                    // Step 2a: NOT k[i-m]
                                    const not_k_old = ~k_i_minus_m & mask;
                                    const not_k_old_hex = not_k_old
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    // Step 2b: XOR with tmp
                                    const after_tmp =
                                      (not_k_old ^ tmp_final) & mask;
                                    const after_tmp_hex = after_tmp
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    // Step 2c: XOR with z bit
                                    const after_z = (after_tmp ^ zBit) & mask;
                                    const after_z_hex = after_z
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    // Step 2d: XOR with constant 3
                                    const final_key = (after_z ^ 3n) & mask;
                                    const final_key_hex = final_key
                                      .toString(16)
                                      .padStart(wordSize / 4, "0");

                                    return (
                                      <div className="space-y-3">
                                        {/* Formula */}
                                        <div className="bg-slate-100 p-2 rounded border-l-4 border-blue-500 mb-3">
                                          <div className="text-xs text-muted-foreground mb-1">
                                            Fórmula:
                                          </div>
                                          <div className="font-bold text-blue-700">
                                            k[{step.round}] = NOT(k[
                                            {step.round - m}]) ⊕ tmp ⊕ z[
                                            {zIndex}] ⊕ 3
                                          </div>
                                        </div>

                                        {/* PHASE 1: Calculate tmp */}
                                        <div className="bg-purple-50 p-3 rounded border border-purple-200">
                                          <div className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                                            <span className="bg-purple-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                              1
                                            </span>
                                            Fase 1: Calcular tmp
                                          </div>

                                          <div className="space-y-2 ml-6 text-xs">
                                            {/* Step 1a */}
                                            <div className="bg-white p-2 rounded border border-purple-100">
                                              <div className="font-semibold text-muted-foreground mb-1">
                                                1a) Rotar k[{step.round - 1}]
                                                tres bits a la derecha
                                              </div>
                                              <div className="space-y-1">
                                                <div>
                                                  <span className="text-muted-foreground">
                                                    k[{step.round - 1}] ={" "}
                                                  </span>
                                                  <span className="text-red-600 font-semibold">
                                                    {k_i_minus_1_hex}
                                                  </span>
                                                </div>
                                                <div className="bg-blue-50 p-1 rounded">
                                                  <span className="text-muted-foreground">
                                                    S³(k[{step.round - 1}])
                                                    ={" "}
                                                  </span>
                                                  <span className="text-blue-700 font-semibold">
                                                    {s3_hex}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Step 1b - only for m=4 */}
                                            {keyWords === 4 &&
                                              k_i_minus_3_hex && (
                                                <div className="bg-white p-2 rounded border border-purple-100">
                                                  <div className="font-semibold text-muted-foreground mb-1">
                                                    1b) XOR con k[
                                                    {step.round - 3}]
                                                  </div>
                                                  <div className="space-y-1">
                                                    <div>
                                                      <span className="text-muted-foreground">
                                                        k[{step.round - 3}]
                                                        ={" "}
                                                      </span>
                                                      <span className="text-red-600 font-semibold">
                                                        {k_i_minus_3_hex}
                                                      </span>
                                                    </div>
                                                    <div className="bg-blue-50 p-1 rounded">
                                                      <span className="text-blue-700">
                                                        {s3_hex}
                                                      </span>
                                                      <span className="text-muted-foreground">
                                                        {" "}
                                                        ⊕{" "}
                                                      </span>
                                                      <span className="text-red-600">
                                                        {k_i_minus_3_hex}
                                                      </span>
                                                      <span className="text-muted-foreground">
                                                        {" "}
                                                        ={" "}
                                                      </span>
                                                      <span className="text-green-600 font-semibold">
                                                        {tmp_partial_hex}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}

                                            {/* Step 1c */}
                                            <div className="bg-white p-2 rounded border border-purple-100">
                                              <div className="font-semibold text-muted-foreground mb-1">
                                                1c) Rotar 1 bit a la derecha y
                                                hacer XOR
                                              </div>
                                              <div className="space-y-1">
                                                <div className="bg-gray-50 p-1 rounded">
                                                  <span className="text-muted-foreground">
                                                    S¹(
                                                    <span className="text-green-600 font-semibold">
                                                      {tmp_partial_hex}
                                                    </span>
                                                    ) ={" "}
                                                  </span>
                                                  <span className="text-blue-600 font-semibold">
                                                    {s1_tmp_hex}
                                                  </span>
                                                </div>
                                                <div className="bg-purple-100 p-2 rounded border-2 border-purple-400">
                                                  <div>
                                                    <span className="text-green-600">
                                                      {tmp_partial_hex}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                      {" "}
                                                      ⊕{" "}
                                                    </span>
                                                    <span className="text-blue-600">
                                                      {s1_tmp_hex}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                      {" "}
                                                      ={" "}
                                                    </span>
                                                  </div>
                                                  <div className="text-purple-700 font-bold mt-1">
                                                    tmp = {tmp_final_hex}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* PHASE 2: Calculate k[i] */}
                                        <div className="bg-green-50 p-3 rounded border border-green-200">
                                          <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                                            <span className="bg-green-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                              2
                                            </span>
                                            Fase 2: Calcular k[{step.round}]
                                          </div>

                                          <div className="space-y-2 ml-6 text-xs">
                                            {/* Step 2a: NOT */}
                                            <div className="bg-white p-2 rounded border border-green-100">
                                              <div className="font-semibold text-muted-foreground mb-1">
                                                2a) Invertir bits de k[
                                                {step.round - m}] (NOT)
                                              </div>
                                              <div className="bg-gray-100 p-1 rounded mb-1 text-xs">
                                                <span className="text-muted-foreground">
                                                  NOT invierte: 0→1, 1→0
                                                </span>
                                              </div>
                                              <div className="space-y-1">
                                                <div>
                                                  <span className="text-muted-foreground">
                                                    k[{step.round - m}] ={" "}
                                                  </span>
                                                  <span className="text-red-600 font-semibold">
                                                    {k_i_minus_m_hex}
                                                  </span>
                                                </div>
                                                <div className="bg-blue-50 p-1 rounded">
                                                  <span className="text-muted-foreground">
                                                    NOT(k[{step.round - m}])
                                                    ={" "}
                                                  </span>
                                                  <span className="text-blue-700 font-semibold">
                                                    {not_k_old_hex}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Step 2b: XOR tmp */}
                                            <div className="bg-white p-2 rounded border border-green-100">
                                              <div className="font-semibold text-muted-foreground mb-1">
                                                2b) XOR con tmp
                                              </div>
                                              <div className="bg-blue-50 p-1 rounded">
                                                <span className="text-blue-700">
                                                  {not_k_old_hex}
                                                </span>
                                                <span className="text-muted-foreground">
                                                  {" "}
                                                  ⊕{" "}
                                                </span>
                                                <span className="text-purple-700">
                                                  {tmp_final_hex}
                                                </span>
                                                <span className="text-muted-foreground">
                                                  {" "}
                                                  ={" "}
                                                </span>
                                                <span className="text-green-600 font-semibold">
                                                  {after_tmp_hex}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Step 2c: XOR z bit */}
                                            <div className="bg-white p-2 rounded border border-green-100">
                                              <div className="font-semibold text-muted-foreground mb-1">
                                                2c) XOR con bit de secuencia Z
                                              </div>
                                              <div className="space-y-1">
                                                <div className="bg-orange-50 p-1 rounded">
                                                  <span className="text-muted-foreground">
                                                    z[{zIndex}] ={" "}
                                                  </span>
                                                  <span className="text-orange-600 font-semibold">
                                                    {zBit.toString()}
                                                  </span>
                                                </div>
                                                <div className="bg-blue-50 p-1 rounded">
                                                  <span className="text-green-600">
                                                    {after_tmp_hex}
                                                  </span>
                                                  <span className="text-muted-foreground">
                                                    {" "}
                                                    ⊕{" "}
                                                  </span>
                                                  <span className="text-orange-600 font-semibold">
                                                    {zBit.toString()}
                                                  </span>
                                                  <span className="text-muted-foreground">
                                                    {" "}
                                                    ={" "}
                                                  </span>
                                                  <span className="text-green-600 font-semibold">
                                                    {after_z_hex}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Step 2d: XOR constant */}
                                            <div className="bg-white p-2 rounded border border-green-100">
                                              <div className="font-semibold text-muted-foreground mb-1">
                                                2d) XOR con constante 3
                                              </div>
                                              <div className="bg-blue-50 p-1 rounded">
                                                <span className="text-green-600">
                                                  {after_z_hex}
                                                </span>
                                                <span className="text-muted-foreground">
                                                  {" "}
                                                  ⊕{" "}
                                                </span>
                                                <span className="text-orange-600 font-semibold">
                                                  3
                                                </span>
                                                <span className="text-muted-foreground">
                                                  {" "}
                                                  ={" "}
                                                </span>
                                                <span className="text-blue-700 font-bold">
                                                  {final_key_hex}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* FINAL RESULT */}
                                        <div className="bg-blue-100 p-3 rounded border-2 border-blue-500">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xl">✓</span>
                                            <div>
                                              <div className="text-xs text-blue-700 font-semibold">
                                                Clave de Ronda:
                                              </div>
                                              <div className="font-mono font-bold text-blue-900">
                                                k[{step.round}] ={" "}
                                                {step.roundKey}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()
                                );
                              })()}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="result" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado del Cifrado</CardTitle>
                  <CardDescription>Resultado final del cifrado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Texto Plano</Label>
                    <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
                      {plaintext}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Clave</Label>
                    <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
                      {key}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Texto Cifrado</Label>
                    <div className="p-4 bg-accent/20 rounded-md font-mono text-lg font-bold break-all">
                      {steps[steps.length - 1]?.leftWord}
                      {steps[steps.length - 1]?.rightWord}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Variante
                      </Label>
                      <p className="font-mono">Simon {variant}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Rondas Totales
                      </Label>
                      <p className="font-mono">
                        {steps[steps.length - 1]?.round}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
