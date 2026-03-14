"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export default function MiniSparkline({
  data,
  color,
  height = 40,
}: MiniSparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }));
  const trend = data[data.length - 1] >= data[0];
  const lineColor = color || (trend ? "#22c55e" : "#ef4444");

  return (
    <div style={{ width: 120, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
