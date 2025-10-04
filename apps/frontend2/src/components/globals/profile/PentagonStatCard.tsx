import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

function PentagonStatCard() {
  // Example stat values (0-100 scale)
  const [data] = useState([
    { stat: "Rush", value: 75, fullMark: 100 },
    { stat: "Setup", value: 60, fullMark: 100 },
    { stat: "Risk", value: 85, fullMark: 100 },
    { stat: "Forcer", value: 45, fullMark: 100 },
    { stat: "Spender", value: 70, fullMark: 100 },
  ]);

  return (
    <Card className="bg-gray-800/70 backdrop-blur border-gray-700">
      <CardContent className="p-2">
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          MOST RECENT 20 GAME(S)
        </h3>
        <div className="aspect-square relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="rgba(100, 116, 139, 0.3)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: "#d1d5db", fontSize: 12 }}
              />
              {/* <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              /> */}
              <Radar
                name="Stats"
                dataKey="value"
                stroke="rgba(251, 146, 60, 0.9)"
                fill="rgba(251, 146, 60, 0.3)"
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with values */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-gray-400">{item.stat}</span>
              <span className="text-orange-400 font-semibold">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PentagonStatCard;
