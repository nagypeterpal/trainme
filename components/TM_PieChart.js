import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const TM_PieChart = ({ data }) => {
  const COLORS = ["#0088FE", ""];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart width={420} height={210} data={data}>
      <Pie
        data={data}
        cx="50%"
        cy="100%"
        labelLine={false}
        label={renderCustomizedLabel}
        innerRadius={170}
        outerRadius={200}
        fill="#000000"
        dataKey="value"
        startAngle={180}
        endAngle={0}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
          //<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default TM_PieChart;
