import { useState, useEffect } from "react";
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
import { simonEncrypt, type SimonVariant } from "@/lib/simon-cipher";
import {
  Thermometer,
  Lock,
  Unlock,
  Lightbulb,
  Camera,
  Smartphone,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: "sensor" | "controller" | "actuator" | "gateway";
  icon: typeof Thermometer;
  position: { x: number; y: number };
  color: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  plaintext: string;
  ciphertext: string;
  key: string;
  variant: SimonVariant;
  timestamp: number;
  status: "encrypting" | "transmitting" | "decrypting" | "complete";
}

const devices: Device[] = [
  {
    id: "temp-sensor",
    name: "Sensor de Temperatura",
    type: "sensor",
    icon: Thermometer,
    position: { x: 10, y: 40 },
    color: "text-blue-500",
  },
  {
    id: "gateway",
    name: "Gateway IoT",
    type: "gateway",
    icon: Smartphone,
    position: { x: 50, y: 70 },
    color: "text-purple-500",
  },
  {
    id: "light",
    name: "Luz Inteligente",
    type: "actuator",
    icon: Lightbulb,
    position: { x: 90, y: 40 },
    color: "text-yellow-500",
  },
  {
    id: "camera",
    name: "Cámara de Seguridad",
    type: "sensor",
    icon: Camera,
    position: { x: 50, y: 20 },
    color: "text-red-500",
  },
];

export function IoTSimulator() {
  const [selectedFrom, setSelectedFrom] = useState<string>("temp-sensor");
  const [selectedTo, setSelectedTo] = useState<string>("gateway");
  const [message, setMessage] = useState<string>("48656c6c6f");
  const [sharedKey, setSharedKey] = useState<string>(
    "0f0e0d0c0b0a09080706050403020100",
  );
  const [variant, setVariant] = useState<SimonVariant>("64/128");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);

  const generateRandomKey = () => {
    const keyLength =
      variant === "32/64"
        ? 16
        : variant === "48/96"
          ? 24
          : variant === "64/128"
            ? 32
            : variant === "96/144"
              ? 36
              : 64;
    const key = Array.from({ length: keyLength }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
    setSharedKey(key);
  };

  const sendMessage = () => {
    try {
      const { ciphertext } = simonEncrypt(message, sharedKey, variant);

      const newMessage: Message = {
        id: Date.now().toString(),
        from: selectedFrom,
        to: selectedTo,
        plaintext: message,
        ciphertext,
        key: sharedKey,
        variant,
        timestamp: Date.now(),
        status: "encrypting",
      };

      setMessages((prev) => [newMessage, ...prev]);
      setActiveMessage(newMessage);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Cifrado falló");
    }
  };

  useEffect(() => {
    if (activeMessage && activeMessage.status !== "complete") {
      const timer = setTimeout(() => {
        setActiveMessage((prev) => {
          if (!prev) return null;
          const nextStatus =
            prev.status === "encrypting"
              ? "transmitting"
              : prev.status === "transmitting"
                ? "decrypting"
                : "complete";

          const updated = { ...prev, status: nextStatus };

          setMessages((msgs) =>
            msgs.map((m) => (m.id === prev.id ? updated : m)),
          );

          return nextStatus === "complete" ? null : updated;
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [activeMessage]);

  const resetSimulation = () => {
    setMessages([]);
    setActiveMessage(null);
  };

  const fromDevice = devices.find((d) => d.id === selectedFrom);
  const toDevice = devices.find((d) => d.id === selectedTo);

  return (
    <div className="space-y-6">
      {/* Network Diagram */}
      <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Topología de Red IoT
        </h2>
        <div className="relative h-[400px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
          {/* Devices */}
          {devices.map((device) => {
            const Icon = device.icon;
            const isActive =
              device.id === selectedFrom || device.id === selectedTo;
            const isSending = activeMessage && device.id === selectedFrom;
            const isReceiving = activeMessage && device.id === selectedTo;

            return (
              <div
                key={device.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isActive ? "scale-110" : "scale-100 opacity-60"
                }`}
                style={{
                  left: `${device.position.x}%`,
                  top: `${device.position.y}%`,
                }}
              >
                <div
                  className={`flex flex-col items-center gap-2 ${isActive ? "animate-pulse" : ""}`}
                >
                  <div
                    className={`p-4 rounded-full bg-background border-2 shadow-lg ${
                      isSending
                        ? "border-green-500 shadow-green-500/50"
                        : isReceiving
                          ? "border-blue-500 shadow-blue-500/50"
                          : isActive
                            ? "border-primary"
                            : "border-muted-foreground/30"
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${device.color}`} />
                  </div>
                  <span className="text-xs font-medium text-center max-w-[100px]">
                    {device.name}
                  </span>
                  {isSending && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Lock className="w-3 h-3" />
                      Cifrando
                    </div>
                  )}
                  {isReceiving && activeMessage?.status === "decrypting" && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Unlock className="w-3 h-3" />
                      Descifrando
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Connection Lines */}
          {fromDevice && toDevice && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill={
                      activeMessage
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))"
                    }
                  />
                </marker>
                {activeMessage && (
                  <linearGradient
                    id="messageGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity="0"
                    />
                    <stop
                      offset="50%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity="1"
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity="0"
                    />
                  </linearGradient>
                )}
              </defs>
              <line
                x1={`${fromDevice.position.x}%`}
                y1={`${fromDevice.position.y}%`}
                x2={`${toDevice.position.x}%`}
                y2={`${toDevice.position.y}%`}
                stroke={
                  activeMessage
                    ? "url(#messageGradient)"
                    : "hsl(var(--muted-foreground))"
                }
                strokeWidth={activeMessage ? "3" : "2"}
                strokeDasharray={activeMessage ? "0" : "5,5"}
                markerEnd={activeMessage ? "url(#arrowhead)" : ""}
              />

              {/* Animated message packet */}
              {activeMessage && activeMessage.status === "transmitting" && (
                <g>
                  <circle
                    cx={`${fromDevice.position.x + (toDevice.position.x - fromDevice.position.x) * 0.5}%`}
                    cy={`${fromDevice.position.y + (toDevice.position.y - fromDevice.position.y) * 0.5}%`}
                    r="8"
                    fill="hsl(var(--primary))"
                    className="animate-pulse"
                  >
                    <animateMotion
                      dur="1.5s"
                      repeatCount="1"
                      path={`M ${fromDevice.position.x},${fromDevice.position.y} L ${toDevice.position.x},${toDevice.position.y}`}
                      calcMode="linear"
                    />
                  </circle>
                </g>
              )}
            </svg>
          )}
        </div>

        {/* Status Indicator */}
        {activeMessage && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-medium">
                  {activeMessage.status === "encrypting" &&
                    "Cifrando mensaje con cifrado Simon..."}
                  {activeMessage.status === "transmitting" &&
                    "Transmitiendo datos cifrados..."}
                  {activeMessage.status === "decrypting" &&
                    "Descifrando mensaje en destino..."}
                  {activeMessage.status === "complete" &&
                    "¡Mensaje entregado exitosamente!"}
                </span>
              </div>
              {activeMessage.status === "complete" && (
                <span className="text-green-600 font-semibold">✓ Completo</span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Control Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Configuración del Mensaje
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="mb-2">Desde Dispositivo</Label>
              <Select value={selectedFrom} onValueChange={setSelectedFrom}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Hacia Dispositivo</Label>
              <Select value={selectedTo} onValueChange={setSelectedTo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {devices
                    .filter((d) => d.id !== selectedFrom)
                    .map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Variante Simon</Label>
              <Select
                value={variant}
                onValueChange={(v) => setVariant(v as SimonVariant)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="32/64">Simon 32/64</SelectItem>
                  <SelectItem value="48/96">Simon 48/96</SelectItem>
                  <SelectItem value="64/128">Simon 64/128</SelectItem>
                  <SelectItem value="96/144">Simon 96/144</SelectItem>
                  <SelectItem value="128/256">Simon 128/256</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Mensaje (Hex)</Label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ingrese mensaje hexadecimal"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ejemplo: "48656c6c6f" (Hello)
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Clave Compartida (Hex)</span>
              </Label>
              <Input
                value={sharedKey}
                onChange={(e) => setSharedKey(e.target.value)}
                placeholder="Ingrese clave hexadecimal"
                className="font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateRandomKey}
                className="h-auto py-1 px-2 text-xs"
              >
                Generar Aleatoria
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={sendMessage}
                className="flex-1"
                disabled={!!activeMessage}
              >
                <Play className="w-4 h-4 mr-2" />
                Enviar Mensaje Cifrado
              </Button>
              <Button
                onClick={resetSimulation}
                variant="outline"
                disabled={messages.length === 0}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Detalles del Cifrado</h2>
          {activeMessage || messages[0] ? (
            <Tabs defaultValue="flow" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flow">Flujo del Mensaje</TabsTrigger>
                <TabsTrigger value="crypto">Criptografía</TabsTrigger>
              </TabsList>

              <TabsContent value="flow" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">
                        1
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Texto Plano en Emisor
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block break-all">
                        {(activeMessage || messages[0])?.plaintext}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Cifrado (Simon {(activeMessage || messages[0])?.variant}
                        )
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Usando clave secreta compartida para cifrar mensaje
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Transmisión de Texto Cifrado
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block break-all">
                        {(activeMessage || messages[0])?.ciphertext}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Unlock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Descifrado en Receptor
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Usando la misma clave compartida para descifrar mensaje
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">
                        ✓
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Texto Plano Recuperado
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block break-all">
                        {(activeMessage || messages[0])?.plaintext}
                      </code>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Algoritmo</Label>
                    <div className="text-sm font-mono bg-muted px-3 py-2 rounded">
                      Simon {(activeMessage || messages[0])?.variant}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Clave Secreta Compartida</Label>
                    <div className="text-xs font-mono bg-muted px-3 py-2 rounded break-all">
                      {(activeMessage || messages[0])?.key}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Texto Plano</Label>
                    <div className="text-xs font-mono bg-muted px-3 py-2 rounded break-all">
                      {(activeMessage || messages[0])?.plaintext}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Texto Cifrado</Label>
                    <div className="text-xs font-mono bg-muted px-3 py-2 rounded break-all">
                      {(activeMessage || messages[0])?.ciphertext}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      <p className="mb-2">
                        <strong>Seguridad:</strong> Ambos dispositivos comparten
                        la misma clave secreta establecida a través de un
                        protocolo seguro de intercambio de claves.
                      </p>
                      <p>
                        <strong>Eficiencia:</strong> El cifrado Simon está
                        optimizado para dispositivos IoT con recursos
                        computacionales limitados.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Envíe un mensaje para ver los detalles del cifrado</p>
            </div>
          )}
        </Card>
      </div>

      {/* Message History */}
      {messages.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Historial de Mensajes</h2>
          <div className="space-y-2">
            {messages.map((msg) => {
              const from = devices.find((d) => d.id === msg.from);
              const to = devices.find((d) => d.id === msg.to);
              return (
                <div
                  key={msg.id}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">{from?.name}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{to?.name}</span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {msg.plaintext.slice(0, 8)}...
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      msg.status === "complete"
                        ? "bg-green-500/20 text-green-600"
                        : "bg-blue-500/20 text-blue-600"
                    }`}
                  >
                    {msg.status === "encrypting"
                      ? "cifrando"
                      : msg.status === "transmitting"
                        ? "transmitiendo"
                        : msg.status === "decrypting"
                          ? "descifrando"
                          : "enviado"}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
