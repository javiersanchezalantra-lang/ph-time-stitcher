import PhChart from "@/components/PhChart";
import { Beaker } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Beaker className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Sistema de Monitoreo de pH
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualización en tiempo real de las mediciones del sensor de pH con ajuste automático por hora
          </p>
        </header>
        
        <main className="max-w-7xl mx-auto">
          <PhChart />
        </main>
      </div>
    </div>
  );
};

export default Index;
