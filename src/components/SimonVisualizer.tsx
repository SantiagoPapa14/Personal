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
                            Palabra Izquierda (x)
                          </Label>
                          <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                            {currentStepData.leftWord}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Palabra Derecha (y)
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
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                  Cálculo k[{step.round}]
                                </span>
                              </div>
                              {step.round < 5 ? (
                                <div className="flex flex-row w-full">
                                  <div className="text-muted-foreground">
                                    {key.split(step.roundKey!)[0]}
                                  </div>
                                  <div className="text-blue-700">
                                    {step.roundKey}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {key.split(step.roundKey!)[1]}
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2 text-sm">
                                  <div className="font-mono text-xs">
                                    <div className="text-muted-foreground mb-2 font-semibold">
                                      k[{step.round}] = ~k[{step.round - 4}] ⊕
                                      tmp ⊕ z[{(step.round - 4) % 62}] ⊕ 3
                                    </div>
                                    <div className="space-y-1.5 pl-3 border-l-2 border-blue-400">
                                      {(() => {
                                        const config = {
                                          "32/64": 4,
                                          "48/96": 4,
                                          "64/128": 4,
                                          "96/144": 3,
                                          "128/256": 4,
                                        }[variant];
                                        const keyWords = config;

                                        // CORRECTED: Get the correct previous round keys
                                        const k_i_minus_1 =
                                          steps[step.round - 1]?.roundKey ||
                                          "0";
                                        const k_i_minus_3 =
                                          keyWords === 4 &&
                                          steps[step.round - 3]
                                            ? steps[step.round - 3].roundKey
                                            : null;
                                        const k_i_minus_4 =
                                          steps[step.round - 4]?.roundKey ||
                                          "0";

                                        // Determine which Z sequence to use
                                        const zSequence =
                                          keyWords === 4
                                            ? 0b10101111011100000011010010011000101000010001111110010110110011n
                                            : 0b11011011101011000110010111100000010010001010011100110100001111n;

                                        const zBit = (
                                          (zSequence >>
                                            BigInt((step.round - 4) % 62)) &
                                          1n
                                        ).toString();

                                        return (
                                          <>
                                            <div className="text-muted-foreground">
                                              <span className="font-semibold">
                                                Paso 1: Calcular tmp
                                              </span>
                                            </div>
                                            <div className="pl-2 space-y-1">
                                              <div>
                                                <span className="text-muted-foreground">
                                                  tmp = S³(k[{step.round - 1}])
                                                </span>
                                              </div>
                                              <div className="pl-4">
                                                <span className="text-muted-foreground">
                                                  = S³(
                                                </span>
                                                <span className="text-red-600">
                                                  {k_i_minus_1}
                                                </span>
                                                <span className="text-muted-foreground">
                                                  )
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                  (rotar 3 bits a la derecha)
                                                </span>
                                              </div>
                                              {keyWords === 4 &&
                                                k_i_minus_3 && (
                                                  <div className="pl-4">
                                                    <span className="text-muted-foreground">
                                                      ⊕ k[{step.round - 3}] =
                                                    </span>
                                                    <span className="text-red-600 ml-1">
                                                      {k_i_minus_3}
                                                    </span>
                                                  </div>
                                                )}
                                              <div className="pl-4">
                                                <span className="text-muted-foreground">
                                                  ⊕ S¹(tmp)
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                  (rotar resultado 1 bit a la
                                                  derecha)
                                                </span>
                                              </div>
                                            </div>

                                            <div className="text-muted-foreground mt-2">
                                              <span className="font-semibold">
                                                Paso 2: Calcular k[{step.round}]
                                              </span>
                                            </div>
                                            <div className="pl-2 space-y-1">
                                              <div>
                                                <span className="text-muted-foreground">
                                                  k[{step.round}] = ~k[
                                                  {step.round - 4}]
                                                </span>
                                              </div>
                                              <div className="pl-4">
                                                <span className="text-muted-foreground">
                                                  = ~
                                                </span>
                                                <span className="text-red-600">
                                                  {k_i_minus_4}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                  (NOT, bit a bit)
                                                </span>
                                              </div>
                                              <div className="pl-4">
                                                <span className="text-muted-foreground">
                                                  ⊕ tmp
                                                </span>
                                              </div>
                                              <div className="pl-4">
                                                <span className="text-muted-foreground">
                                                  ⊕ z[{(step.round - 4) % 62}] =
                                                </span>
                                                <span className="text-red-600 ml-1">
                                                  {zBit}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                  (bit de la secuencia z)
                                                </span>
                                              </div>
                                              <div className="pl-4">
                                                <span className="text-muted-foreground">
                                                  ⊕{" "}
                                                </span>
                                                <span className="text-red-600">
                                                  3
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                  (constante)
                                                </span>
                                              </div>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-muted">
                                              <span className="text-muted-foreground">
                                                Resultado:
                                              </span>
                                              <span className="text-blue-700 font-semibold ml-2">
                                                k[{step.round}] ={" "}
                                                {step.roundKey}
                                              </span>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}
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
