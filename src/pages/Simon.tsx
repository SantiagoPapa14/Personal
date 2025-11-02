import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimonCipherVisualizer } from "@/components/SimonVisualizer";
import { IoTSimulator } from "@/components/SimonSimulator";
import { CryptanalysisSimulator } from "@/components/SimonCryptoanalysis";

const Simon = () => {
  return (
    <main className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-4xl mx-auto space-y-16 pt-8">
        {/* Hero Section */}
        <Tabs defaultValue="tutorial" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tutorial">Demo</TabsTrigger>
            <TabsTrigger value="simulator">Simulador</TabsTrigger>
            <TabsTrigger value="attack">Analisis</TabsTrigger>
          </TabsList>
          <TabsContent value="tutorial">
            <SimonCipherVisualizer />
          </TabsContent>
          <TabsContent value="simulator">
            <IoTSimulator />
          </TabsContent>
          <TabsContent value="attack">
            <CryptanalysisSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Simon;
