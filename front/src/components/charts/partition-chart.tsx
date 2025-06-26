"use client";

import { PortfolioPartition } from "@/services/GraphService";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    data,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={cx}
        y={cy + outerRadius + 40}
        textAnchor="middle"
        fill="#333"
      >{`${payload.fundName}`}</text>
      <text x={cx} y={cy + outerRadius + 60} textAnchor="middle" fill="#999">
        {`(Valeur ${payload.value.toFixed(2)}€)`}
      </text>
    </g>
  );
};

export default function PartitionChart(data: PortfolioPartition[]) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Allocations</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={730} height={730}>
            <Pie
              activeShape={renderActiveShape}
              data={data.data}
              dataKey="percentage"
              cx="50%"
              cy="40%"
              innerRadius={50}
              outerRadius={100}
              fill="#8884d8"
            >
              {data.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip active={false} allowEscapeViewBox={{ x: true }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
