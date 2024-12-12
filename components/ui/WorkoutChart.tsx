import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  height?: number;
  color?: string;
  tooltipFormatter?: (value: number) => string;
}

const WorkoutChart: React.FC<ChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'date',
  height = 250,
  color = '#2563eb',
  tooltipFormatter
}) => {
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey={xAxisKey} 
            className="text-sm text-muted-foreground"
          />
          <YAxis 
            className="text-sm text-muted-foreground"
          />
          <Tooltip 
            formatter={tooltipFormatter}
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            itemStyle={{
              color: 'var(--foreground)'
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutChart;