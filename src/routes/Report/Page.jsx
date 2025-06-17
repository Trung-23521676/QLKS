import React from "react";
import "./report.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { format } from 'date-fns';

const pieData = [
  { name: "A2", value: 52.1, color: "#A5D8FF" },
  { name: "A3", value: 22.8, color: "#FFC9C9" },
  { name: "C1", value: 13.9, color: "#FFD43B" },
  { name: "Other", value: 11.2, color: "#D3F9D8" },
];

const serviceData = [
  { name: "F&B", value: 15000, color: "#FFF3BF" },
  { name: "F&B", value: 28000, color: "#D3F9D8" },
  { name: "F&B", value: 22000, color: "#FFE8CC" },
  { name: "F&B", value: 31000, color: "#A5D8FF" },
  { name: "F&B", value: 14000, color: "#FCC419" },
  { name: "F&B", value: 25000, color: "#69DB7C" },
  { name: "F&B", value: 26000, color: "#FAB005" },
  { name: "F&B", value: 26000, color: "#228BE6" },
];

const occupancyData = [
  { name: "Jan", percent: 96 },
  { name: "Feb", percent: 97 },
  { name: "Mar", percent: 85 },
  { name: "Apr", percent: 78 },
  { name: "May", percent: 95 },
  { name: "Jun", percent: 70 },
  { name: "Jul", percent: 92 },
  { name: "Aug", percent: 48 },
  { name: "Sep", percent: 100 },
  { name: "Oct", percent: 89 },
  { name: "Nov", percent: 87 },
  { name: "Dec", percent: 88 },
];

const renderCustomLegend = () => {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {pieData.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 8,
            fontSize: 14,
            color: '#000',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: entry.color,
              marginRight: 8,
            }}
          />
          <span style={{ flex: 1 }}>{entry.name}</span>
          <span style={{ marginLeft: 50 }}>{entry.value.toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  );
};

const currentMonth = format(new Date(), 'MMM');

export default function Report() {
  return (
    <div className="report-page">
      <p className="name">Report</p>
      <p className="labeldash">__________</p>

      <div className="overview-section">
        <p className="cardname">Overview</p>
        <div className="data">
          <div className="group">
            <div className="tittle">
              <p className="label1">This month's</p>
              <p className="label2">Booking</p>
            </div>
          </div>
          <p className="content">23</p>

          <div>
            <div className="tittle">
              <p className="label1">This month's</p>
              <p className="label2">International Guest</p>
            </div>
          </div>
          <p className="content">23</p>
        </div>
      </div>

      <section className="stat-section">
        <div className="chartcard">
          <p className="cardname" style={{ marginLeft: 8 }}>Room Type</p>
          <div className="data" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <ResponsiveContainer width={200} height={170}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={35}
                  cornerRadius={5}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-360}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginLeft: 0 }}>{renderCustomLegend()}</div>
          </div>
        </div>

        <div className="chartcard">
          <p className="cardname" style={{ marginLeft: 8 }}>Service Request</p>
          <ResponsiveContainer width="100%" height={170} style={{ marginTop: 8 }}>
            <BarChart data={serviceData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={10} barSize={32}>
                {serviceData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="stat-section">
        <div className="chartcard full-width">
          <p className="cardname" style={{ marginLeft: 8 }}>Occupancy</p>
          <ResponsiveContainer width="100%" height={180} style={{ marginTop: 8 }}>
            <BarChart data={occupancyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <CartesianGrid vertical={false} stroke="#F7F9FC" />
              <Bar dataKey="percent" radius={10} barSize={32}>
                {occupancyData.map((entry, index) => {
                  const isCurrent = entry.name === currentMonth;
                  return (
                    <Cell
                      key={`bar-${index}`}
                      fill={isCurrent ? "#0077B6" : "transparent"}
                      stroke={isCurrent ? "none" : "#0077B6"}
                      strokeWidth={1}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="export-button">
        <button>Export PDF</button>
      </div>
    </div>
  );
}
