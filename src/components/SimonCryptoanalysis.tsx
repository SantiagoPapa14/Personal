import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { simonEncrypt, type SimonVariant } from "@/lib/simon-cipher";
import {
  AlertTriangle,
  Play,
  StopCircle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Target,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BruteForceResult {
  attempt: number;
  key: string;
  plaintext: string;
  success: boolean;
}

interface WeakParameter {
  parameter: string;
  value: string;
  severity: "high" | "medium" | "low";
  description: string;
}

export function CryptanalysisSimulator() {
  // Brute Force State
  const [bfPlaintext, setBfPlaintext] = useState<string>("48656c6c");
  const [bfCiphertext, setBfCiphertext] = useState<string>("");
  const [bfVariant, setBfVariant] = useState<SimonVariant>("32/64");
  const [bfActualKey, setBfActualKey] = useState<string>("0f0e0d0c0b0a0908");
  const [bfRunning, setBfRunning] = useState(false);
  const [bfProgress, setBfProgress] = useState(0);
  const [bfStartAttempts, setBfStartAttempts] = useState(50000);
  const [bfAttempts, setBfAttempts] = useState(0);
  const [bfResult, setBfResult] = useState<BruteForceResult | null>(null);

  // Weak Parameters State
  const [wpVariant, setWpVariant] = useState<SimonVariant>("32/64");
  const [wpRounds, setWpRounds] = useState<number>(5);
  const [wpKeySize, setWpKeySize] = useState<number>(32);
  const [weaknesses, setWeaknesses] = useState<WeakParameter[]>([]);

  // Differential Cryptanalysis State
  const [dcVariant, setDcVariant] = useState<SimonVariant>("32/64");
  const [dcPlaintext1, setDcPlaintext1] = useState<string>("00000000");
  const [dcPlaintext2, setDcPlaintext2] = useState<string>("00000001");
  const [dcKey, setDcKey] = useState<string>("0f0e0d0c0b0a0908");
  const [dcResults, setDcResults] = useState<{
    diff: string;
    probability: number;
  } | null>(null);

  const generateCiphertext = () => {
    try {
      const { ciphertext } = simonEncrypt(bfPlaintext, bfActualKey, bfVariant);
      setBfCiphertext(ciphertext);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falló el cifrado");
    }
  };

  const startBruteForce = (type: "random" | "sequential") => {
    if (!bfCiphertext) {
      alert("Por favor genere el texto cifrado primero");
      return;
    }
    setBfRunning(true);
    setBfProgress(0);
    setBfAttempts(0);
    setBfResult(null);

    const keyLength = bfVariant === "32/64" ? 16 : 32;
    const maxAttempts = Math.min(bfStartAttempts, Math.pow(16, keyLength));
    let attempts = 0;
    let currentKeyNum = BigInt(0); // For sequential

    const testBatch = () => {
      const batchSize = 100; // Test 100 keys per batch

      for (let i = 0; i < batchSize && attempts < maxAttempts; i++) {
        let proposedKey: string;

        if (type === "random") {
          proposedKey = Array.from({ length: keyLength }, () =>
            Math.floor(Math.random() * 16).toString(16),
          ).join("");
        } else {
          // Sequential: properly pad with leading zeros
          proposedKey = currentKeyNum.toString(16).padStart(keyLength, "0");
          currentKeyNum++;
        }

        attempts++;

        try {
          const { ciphertext } = simonEncrypt(
            bfPlaintext,
            proposedKey,
            bfVariant,
          );
          if (ciphertext === bfCiphertext) {
            setBfResult({
              attempt: attempts,
              key: proposedKey,
              plaintext: bfPlaintext,
              success: true,
            });
            setBfRunning(false);
            setBfProgress(100);
            setBfAttempts(attempts);
            return true; // Found it!
          }
        } catch {
          // Invalid key, continue
        }
      }

      setBfAttempts(attempts);
      setBfProgress((attempts / maxAttempts) * 100);

      if (attempts >= maxAttempts) {
        setBfResult({
          attempt: attempts,
          key: "",
          plaintext: "",
          success: false,
        });
        setBfRunning(false);
        return true; // Finished without finding
      }

      return false; // Continue
    };

    const interval = setInterval(() => {
      if (testBatch()) {
        clearInterval(interval);
      }
    }, 10);
  };

  const stopBruteForce = () => {
    setBfRunning(false);
  };

  const analyzeWeakParameters = () => {
    const vulnerabilities: WeakParameter[] = [];

    if (wpRounds < 16) {
      vulnerabilities.push({
        parameter: "Número de Rondas",
        value: wpRounds.toString(),
        severity: "high",
        description: `Solo ${wpRounds} rondas es altamente vulnerable. Simon requiere al menos 32 rondas para seguridad.`,
      });
    } else if (wpRounds < 32) {
      vulnerabilities.push({
        parameter: "Número de Rondas",
        value: wpRounds.toString(),
        severity: "medium",
        description: `${wpRounds} rondas proporciona seguridad reducida. Simon completo usa 32-72 rondas dependiendo de la variante.`,
      });
    }

    if (wpKeySize < 64) {
      vulnerabilities.push({
        parameter: "Tamaño de Clave",
        value: `${wpKeySize} bits`,
        severity: "high",
        description:
          "Un tamaño de clave menor a 64 bits es vulnerable a ataques de fuerza bruta con poder computacional moderno.",
      });
    } else if (wpKeySize < 128) {
      vulnerabilities.push({
        parameter: "Tamaño de Clave",
        value: `${wpKeySize} bits`,
        severity: "medium",
        description:
          "Un tamaño de clave menor a 128 bits puede ser vulnerable a futuros ataques a medida que aumenta el poder computacional.",
      });
    }

    const blockSize =
      wpVariant === "32/64" ? 32 : wpVariant === "48/96" ? 48 : 64;

    if (blockSize < 64) {
      vulnerabilities.push({
        parameter: "Tamaño de Bloque",
        value: `${blockSize} bits`,
        severity: "medium",
        description:
          "Los tamaños de bloque más pequeños son más susceptibles a ataques de cumpleaños y vulnerabilidades de colisión.",
      });
    }

    if (vulnerabilities.length === 0) {
      vulnerabilities.push({
        parameter: "Seguridad General",
        value: "Fuerte",
        severity: "low",
        description:
          "Los parámetros actuales proporcionan seguridad adecuada para la mayoría de las aplicaciones.",
      });
    }

    setWeaknesses(vulnerabilities);
  };

  const performDifferentialAnalysis = () => {
    try {
      const { ciphertext: c1 } = simonEncrypt(dcPlaintext1, dcKey, dcVariant);
      const { ciphertext: c2 } = simonEncrypt(dcPlaintext2, dcKey, dcVariant);

      const ct1 = BigInt("0x" + c1);
      const ct2 = BigInt("0x" + c2);

      const outputDiff = ct1 ^ ct2;

      const hammingWeight = outputDiff.toString(2).split("1").length - 1;
      const totalBits =
        dcVariant === "32/64" ? 32 : dcVariant === "48/96" ? 48 : 64;
      const probability = 1 - hammingWeight / totalBits;

      setDcResults({
        diff: outputDiff.toString(16).padStart(totalBits / 4, "0"),
        probability: probability,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falló el análisis");
    }
  };

  return (
    <Tabs defaultValue="weak" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="weak" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Parámetros Débiles
        </TabsTrigger>
        <TabsTrigger value="brute" className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Fuerza Bruta
        </TabsTrigger>
        <TabsTrigger value="differential" className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Análisis Diferencial
        </TabsTrigger>
      </TabsList>

      {/* Weak Parameters Tab */}
      <TabsContent value="weak" className="space-y-6 mt-6">
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Análisis de Parámetros Débiles
              </h2>
              <p className="text-sm text-muted-foreground">
                Analiza cómo las rondas y tamaños de clave reducidos afectan la
                seguridad del cifrado Simon
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Variante de Simon</Label>
                <Select
                  value={wpVariant}
                  onValueChange={(v) => setWpVariant(v as SimonVariant)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32/64">Simon 32/64</SelectItem>
                    <SelectItem value="48/96">Simon 48/96</SelectItem>
                    <SelectItem value="64/128">Simon 64/128</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">
                  Número de Rondas (Estándar: 32-44)
                </Label>
                <Input
                  type="number"
                  value={wpRounds}
                  onChange={(e) =>
                    setWpRounds(Number.parseInt(e.target.value) || 5)
                  }
                  min={1}
                  max={72}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Prueba valores como 5, 10 o 16 para ver vulnerabilidades
                </p>
              </div>

              <div>
                <Label className="mb-2">Tamaño de Clave (bits)</Label>
                <Input
                  type="number"
                  value={wpKeySize}
                  onChange={(e) =>
                    setWpKeySize(Number.parseInt(e.target.value) || 32)
                  }
                  min={16}
                  max={256}
                  step={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Estándar: 64-256 bits
                </p>
              </div>

              <Button onClick={analyzeWeakParameters} className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Analizar Seguridad
              </Button>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">
                Evaluación de Vulnerabilidades
              </h3>
              {weaknesses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Haz clic en "Analizar Seguridad" para evaluar
                    vulnerabilidades
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weaknesses.map((weakness, idx) => (
                    <Alert
                      key={idx}
                      className={`flex items-start ${
                        weakness.severity === "high"
                          ? "border-red-500/50 bg-red-500/10"
                          : weakness.severity === "medium"
                            ? "border-orange-500/50 bg-orange-500/10"
                            : "border-green-500/50 bg-green-500/10"
                      }`}
                    >
                      <div className="flex gap-3 w-full">
                        {weakness.severity === "high" ? (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        ) : weakness.severity === "medium" ? (
                          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">
                            {weakness.parameter}: {weakness.value}
                          </div>
                          <AlertDescription className="text-xs">
                            {weakness.description}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </div>{" "}
          </div>
        </Card>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Notas Educativas
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Rondas Reducidas:</strong> Cada ronda en Simon proporciona
              difusión y confusión. Menos rondas significan que los patrones en
              el texto plano aún pueden ser visibles en el texto cifrado,
              facilitando el criptoanálisis.
            </p>
            <p>
              <strong>Tamaños de Clave Pequeños:</strong> Las claves de menos de
              80 bits pueden ser forzadas con hardware moderno. Las claves de
              128 bits se consideran el mínimo para seguridad a largo plazo.
            </p>
            <p>
              <strong>Tamaño de Bloque:</strong> Los bloques más pequeños son
              vulnerables a ataques de libro de códigos al cifrar grandes
              cantidades de datos.
            </p>
          </div>
        </Card>
      </TabsContent>

      {/* Brute Force Tab */}
      <TabsContent value="brute" className="space-y-6 mt-6">
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Simulación de Ataque de Fuerza Bruta
              </h2>
              <p className="text-sm text-muted-foreground">
                Intenta recuperar la clave de cifrado probando todas las
                combinaciones posibles
              </p>
            </div>
          </div>

          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-sm">
              Esta simulación está limitada para demostrar el concepto. Los
              ataques de fuerza bruta reales en Simon de máxima potencia
              tomarían miles de millones de años con la tecnología actual.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-row">
                <div>
                  <Label className="mb-2">Variante de Simon</Label>
                  <Select
                    value={bfVariant}
                    onValueChange={(v) => setBfVariant(v as SimonVariant)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="32/64">
                        Simon 32/64 (Más fácil)
                      </SelectItem>
                      <SelectItem value="64/128">
                        Simon 64/128 (Más difícil)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-4">
                  <Label className="mb-2">Intentos</Label>
                  <Input
                    type="number"
                    value={bfStartAttempts}
                    onChange={(e) => setBfStartAttempts(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2">Texto Plano Conocido (Hex)</Label>
                <Input
                  value={bfPlaintext}
                  onChange={(e) => setBfPlaintext(e.target.value)}
                  placeholder="Ingresa el texto plano"
                  className="font-mono"
                />
              </div>

              <div>
                <Label className="mb-2">Clave Real (Hex)</Label>
                <Input
                  value={bfActualKey}
                  onChange={(e) => setBfActualKey(e.target.value)}
                  placeholder="Ingresa la clave"
                  className="font-mono"
                />
              </div>

              <Button
                onClick={generateCiphertext}
                variant="outline"
                className="w-full bg-transparent"
              >
                Generar Texto Cifrado
              </Button>

              {bfCiphertext && (
                <div>
                  <Label>Texto Cifrado a Atacar</Label>
                  <div className="text-xs font-mono bg-muted px-3 py-2 rounded break-all">
                    {bfCiphertext}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => startBruteForce("random")}
                  disabled={bfRunning || !bfCiphertext}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Aleatorio
                </Button>
                <Button
                  onClick={() => startBruteForce("sequential")}
                  disabled={bfRunning || !bfCiphertext}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Secuencial
                </Button>
                <Button
                  onClick={stopBruteForce}
                  disabled={!bfRunning}
                  variant="destructive"
                >
                  <StopCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Progreso del Ataque</Label>
                  <span className="text-xs text-muted-foreground">
                    {bfProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={bfProgress} className="h-2" />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intentos:</span>
                  <span className="font-mono font-semibold">
                    {bfAttempts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <span
                    className={
                      bfRunning
                        ? "text-blue-600 font-semibold"
                        : "text-muted-foreground"
                    }
                  >
                    {bfRunning ? "Ejecutando..." : "Inactivo"}
                  </span>
                </div>
              </div>

              {bfResult && (
                <Alert
                  className={`flex items-start ${
                    bfResult.success
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-red-500/50 bg-red-500/10"
                  }`}
                >
                  <div className="flex gap-3 w-full">
                    {bfResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-2">
                        {bfResult.success
                          ? "¡Clave Encontrada!"
                          : "Ataque Fallido"}
                      </div>
                      {bfResult.success ? (
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Clave Recuperada:
                            </span>
                            <code className="ml-2 bg-background px-2 py-0.5 rounded">
                              {bfResult.key}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Después de:
                            </span>
                            <span className="ml-2 font-semibold">
                              {bfResult.attempt.toLocaleString()} intentos
                            </span>
                          </div>
                        </div>
                      ) : (
                        <AlertDescription className="text-xs">
                          Clave no encontrada después de{" "}
                          {bfResult.attempt.toLocaleString()} intentos. Esto
                          demuestra por qué los espacios de claves más grandes
                          son seguros.
                        </AlertDescription>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold mb-3">
            Por Qué Falla la Fuerza Bruta en Simon de Máxima Potencia
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Tamaño del Espacio de Claves:</strong> Simon 64/128 tiene
              2^128 claves posibles (340 undecillones). Incluso probando 1
              billón de claves por segundo tomaría más que la edad del universo.
            </p>
            <p>
              <strong>Límites Computacionales:</strong> No hay suficiente
              energía en el universo observable para invertir todos los bits
              necesarios para contar a través de un espacio de claves de 128
              bits.
            </p>
            <p>
              <strong>Esta Simulación:</strong> Limitamos el espacio de búsqueda
              para hacer el concepto demostrable en un tiempo razonable.
            </p>
          </div>
        </Card>
      </TabsContent>

      {/* Differential Cryptanalysis Tab */}
      <TabsContent value="differential" className="space-y-6 mt-6">
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Criptoanálisis Diferencial
              </h2>
              <p className="text-sm text-muted-foreground">
                Analiza cómo las diferencias en el texto plano se propagan a
                través del cifrado
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Variante de Simon</Label>
                <Select
                  value={dcVariant}
                  onValueChange={(v) => setDcVariant(v as SimonVariant)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32/64">Simon 32/64</SelectItem>
                    <SelectItem value="48/96">Simon 48/96</SelectItem>
                    <SelectItem value="64/128">Simon 64/128</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Texto Plano 1 (Hex)</Label>
                <Input
                  value={dcPlaintext1}
                  onChange={(e) => setDcPlaintext1(e.target.value)}
                  placeholder="Primer texto plano"
                  className="font-mono"
                />
              </div>

              <div>
                <Label className="mb-2">Texto Plano 2 (Hex)</Label>
                <Input
                  value={dcPlaintext2}
                  onChange={(e) => setDcPlaintext2(e.target.value)}
                  placeholder="Segundo texto plano"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Prueba textos planos con pequeñas diferencias (1-2 bits)
                </p>
              </div>

              <div>
                <Label className="mb-2">Clave de Cifrado (Hex)</Label>
                <Input
                  value={dcKey}
                  onChange={(e) => setDcKey(e.target.value)}
                  placeholder="Ingresa la clave"
                  className="font-mono"
                />
              </div>

              <Button onClick={performDifferentialAnalysis} className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Analizar Diferencial
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Resultados del Análisis</h3>
              {dcResults ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <div>
                      <Label className="text-xs">
                        Diferencia de Entrada (XOR)
                      </Label>
                      <div className="text-xs font-mono bg-background px-3 py-2 rounded mt-1 break-all">
                        {(
                          BigInt("0x" + dcPlaintext1) ^
                          BigInt("0x" + dcPlaintext2)
                        )
                          .toString(16)
                          .padStart(dcPlaintext1.length, "0")}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">
                        Diferencia de Salida (XOR)
                      </Label>
                      <div className="text-xs font-mono bg-background px-3 py-2 rounded mt-1 break-all">
                        {dcResults.diff}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Efecto Avalancha</Label>
                      <Progress
                        value={dcResults.probability * 100}
                        className="h-2 mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(dcResults.probability * 100).toFixed(1)}% de bits
                        cambiados
                      </p>
                    </div>
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <AlertDescription className="text-xs">
                      <strong>Buena Difusión:</strong> Un cifrado fuerte debe
                      cambiar aproximadamente el 50% de los bits de salida
                      cuando un solo bit de entrada cambia. Simon logra esto a
                      través de múltiples rondas de mezcla.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Realiza el análisis para ver la propagación diferencial
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-muted/30">
          <h3 className="font-semibold mb-3">
            Entendiendo el Criptoanálisis Diferencial
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>El Ataque:</strong> El criptoanálisis diferencial estudia
              cómo las diferencias en pares de texto plano se propagan a través
              de las rondas de cifrado para encontrar patrones que revelen
              información de la clave.
            </p>
            <p>
              <strong>Defensa de Simon:</strong> El cifrado usa múltiples rondas
              con operaciones no lineales (AND, XOR, rotaciones) para asegurar
              que pequeñas diferencias de entrada creen diferencias de salida
              impredecibles.
            </p>
            <p>
              <strong>Efecto Avalancha:</strong> Un buen cifrado debe cambiar
              aproximadamente el 50% de los bits de salida cuando un bit de
              entrada cambia. Esta "avalancha" hace que los ataques
              diferenciales sean imprácticos.
            </p>
            <p>
              <strong>Rondas Reducidas:</strong> Con menos rondas, pueden surgir
              patrones que los atacantes pueden explotar. Simon completo usa
              suficientes rondas para resistir ataques diferenciales conocidos.
            </p>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
