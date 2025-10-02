import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";

interface PhReading {
  timestamp: Date;
  ph: number;
}

// Función para ajustar el timestamp según los minutos
const adjustTimestamp = (timestamp: Date): Date => {
  const minutes = timestamp.getMinutes();
  const adjusted = new Date(timestamp);
  
  if (minutes < 30) {
    // Primera mitad: ajustar a la hora anterior
    adjusted.setMinutes(0, 0, 0);
  } else {
    // Segunda mitad: ajustar a la hora siguiente
    adjusted.setHours(adjusted.getHours() + 1);
    adjusted.setMinutes(0, 0, 0);
  }
  
  return adjusted;
};

// Generar datos de ejemplo para 3 días
const generateSampleData = (): PhReading[] => {
  const data: PhReading[] = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 2);
  startDate.setHours(0, 0, 0, 0);

  // Generar lecturas cada hora con algunos minutos aleatorios
  for (let i = 0; i < 72; i++) {
    const timestamp = new Date(startDate);
    timestamp.setHours(timestamp.getHours() + i);
    timestamp.setMinutes(Math.floor(Math.random() * 60)); // Minutos aleatorios
    
    // pH oscila entre 6.5 y 8.5 con variaciones realistas
    const basePh = 7.2;
    const variation = Math.sin(i / 6) * 0.8 + (Math.random() - 0.5) * 0.4;
    const ph = Math.max(6.5, Math.min(8.5, basePh + variation));
    
    data.push({
      timestamp,
      ph: parseFloat(ph.toFixed(2))
    });
  }
  
  return data;
};

const PhChart = () => {
  const rawData = generateSampleData();
  
  // Procesar datos: ajustar timestamps y preparar para el gráfico
  const chartData = rawData.map(reading => {
    const adjustedTime = adjustTimestamp(reading.timestamp);
    return {
      timestamp: adjustedTime.getTime(),
      displayTime: `${adjustedTime.getHours().toString().padStart(2, '0')}:00`,
      displayDate: adjustedTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      ph: reading.ph,
      isMidnight: adjustedTime.getHours() === 0
    };
  });

  // Encontrar puntos de medianoche para las líneas verticales
  const midnightPoints = chartData.filter(d => d.isMidnight).map(d => d.timestamp);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-card-foreground">
            {data.displayDate} - {data.displayTime}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            pH: <span className="font-bold text-chart-1">{data.ph}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Monitor de pH</CardTitle>
            <CardDescription className="mt-1">
              Lecturas del sensor cada hora - Últimos 3 días
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis
              dataKey="displayTime"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ 
                value: 'Hora del día', 
                position: 'insideBottom', 
                offset: -15,
                fill: 'hsl(var(--foreground))'
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              domain={[6, 9]}
              label={{ 
                value: 'Nivel de pH', 
                angle: -90, 
                position: 'insideLeft',
                fill: 'hsl(var(--foreground))'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Líneas verticales para marcar medianoche (00:00) */}
            {midnightPoints.map((timestamp, index) => (
              <ReferenceLine
                key={`midnight-${index}`}
                x={timestamp}
                stroke="hsl(var(--chart-day-separator))"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: 'Nuevo día',
                  position: 'top',
                  fill: 'hsl(var(--chart-day-separator))',
                  fontSize: 12
                }}
              />
            ))}
            
            {/* Líneas de referencia para pH neutro y rangos */}
            <ReferenceLine
              y={7}
              stroke="hsl(var(--accent))"
              strokeDasharray="3 3"
              label={{
                value: 'pH Neutro',
                position: 'right',
                fill: 'hsl(var(--accent))',
                fontSize: 11
              }}
            />
            
            <Line
              type="monotone"
              dataKey="ph"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--chart-2))' }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">pH Promedio</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {(chartData.reduce((acc, d) => acc + d.ph, 0) / chartData.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">pH Mínimo</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {Math.min(...chartData.map(d => d.ph)).toFixed(2)}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">pH Máximo</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {Math.max(...chartData.map(d => d.ph)).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhChart;
