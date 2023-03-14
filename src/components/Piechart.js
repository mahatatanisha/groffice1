import React from 'react';
import { PieChart, Pie,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const piedata=[
  { name: 'Full', value: 402 },
  { name: 'Remaining', value:110 },
];

function Piechart() {
  return (
    <>
      <h1 className="chart-heading">Storage</h1>
      <ResponsiveContainer width="100%" aspect={3}>
        <PieChart
          width={500}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Pie  dataKey="value" data={piedata} cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8"/>
          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default Piechart;