import React, { useState, useEffect, useRef } from "react";
import "./report.css";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ResponsiveContainer
} from "recharts";
import { format } from 'date-fns';
import { 
  fetchCheckIn,
  fetchInternationalGuest,
  fetchRoomTypeStats,
  fetchServiceStats,
  fetchRevenueStats,} from "../../API/ReportAPI";
  import html2canvas from "html2canvas";


export default function Report() {

  const [pieChartData, setPieChartData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [checkInCount, setCheckInCount] = useState(0);
  const [intlGuestCount, setIntlGuestCount] = useState(0);
  

const handleExport = async () => {
    const chartNode = document.querySelector(".report-page"); // <-- Class phần cần chụp
    if (!chartNode) {
      alert("Không tìm thấy phần biểu đồ!");
      return;
    }
    const canvas = await html2canvas(chartNode, {
  scale: 0.5, // hoặc 0.3 tùy thử
});
    const chartBase64 = canvas.toDataURL("image/png");
    const response = await fetch("http://localhost:4000/api/report/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chartBase64 }),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};

  useEffect(() => {
    const loadData = async () => {
      try {
        const checkInData = await fetchCheckIn();
        const intlData = await fetchInternationalGuest();


        setCheckInCount(checkInData.total_bookings || '0');
        setIntlGuestCount(intlData.international_guests || '0');
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu báo cáo:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
  const loadRoomTypeData = async () => {
    try {
      const data = await fetchRoomTypeStats(); // [{ room_type_id, total_checked_out }, ...]
      console.log(data);
      const total = data.reduce((sum, item) => sum + item.total_checked_out, 0);

      const sorted = [...data].sort((a, b) => b.total_checked_out - a.total_checked_out);

      const top5 = sorted.slice(0, 5).map(item => ({
        name: item.room_type_id,
        value: (item.total_checked_out / total) * 100,
      }));

      const othersValue = sorted
        .slice(5)
        .reduce((sum, item) => sum + item.total_checked_out, 0);

      if (othersValue > 0) {
        top5.push({
          name: "Others",
          value: (othersValue / total) * 100,
        });
      }

      setPieChartData(top5);
    } catch (err) {
      console.error("Failed to load pie chart data", err);
    }
  };
  console.log(pieChartData);
  loadRoomTypeData();
}, []);


const currentMonth = format(new Date(), 'MMM');

const defaultColors = [
  "#FFA3B5", // hồng nhạt
  "#90CDF4", // xanh dương nhạt
  "#FFE082", // vàng nhạt
  "#A0E7E5", // xanh ngọc nhạt
  "#C6B8FF", // tím nhạt
  "#FFBC8B", // cam nhạt
  ];

const coloredPieData = pieChartData.map((item, index) => ({
  ...item,
  color: defaultColors[index % defaultColors.length], // Lặp lại nếu >5
}));

const renderCustomLegend = () => {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {coloredPieData.map((entry, index) => (
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

 useEffect(() => {
    const loadStats = async () => {
      try {
        const rawData = await fetchServiceStats();
        const formattedData = rawData.map((item) => ({
          name: item.service_id, // hoặc dùng service_name nếu backend có
          value: item.total_confirmed_requests,
        }));
        setServiceData(formattedData);
      } catch (err) {
        console.error("Failed to fetch service stats", err);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
  const loadRevenue = async () => {
    try {
      const data = await fetchRevenueStats();
      // Chuyển về dạng { name: 'Jan', revenue: 1234 }
      console.log(data);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const transformed = data.map((item) => ({
        name: monthNames[item.month - 1],
        revenue: item.total_revenue/1,
      }));
      setRevenueData(transformed);
    } catch (error) {
      console.error("Failed to fetch revenue:", error);
    }
  };
  loadRevenue();
}, []);

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
          <p className="content">{checkInCount}</p>

          <div>
            <div className="tittle">
              <p className="label1">This month's</p>
              <p className="label2">International Guest</p>
            </div>
          </div>
          <p className="content">{intlGuestCount}</p>
        </div>
      </div>

      <section className="stat-section">
        <div className="chartcard">
          <p className="cardname" style={{ marginLeft: 8 }}>Room Type</p>
          <div className="data" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <ResponsiveContainer width={200} height={170}>
              <PieChart>
                <Pie
                  data={coloredPieData}
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
                  {coloredPieData.map((entry, index) => (
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
                  <Cell
                    key={`bar-${index}`}
                    fill="#0077B6"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="stat-section">
        <div className="chartcard full-width">
          <p className="cardname" style={{ marginLeft: 8 }}>Yearly revenue</p>
          <ResponsiveContainer width="100%" height={180} style={{ marginTop: 8 }}>
           <LineChart data={revenueData}>
  <XAxis dataKey="name" axisLine={false} tickLine={false} />
  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M` } />
  <Tooltip />
  <CartesianGrid vertical={false} stroke="#F7F9FC" />
  <Line
    type="monotone"
    dataKey="revenue"
    stroke="#0077B6"
    strokeWidth={2}
    dot={({ cx, cy, payload }) => {
      const isCurrent = payload.name === currentMonth;
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={isCurrent ? "#0077B6" : "white"}
          stroke="#0077B6"
          strokeWidth={2}
        />
      );
    }}
    activeDot={{ r: 8 }}
  />
</LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="export-button">
        <button onClick={handleExport}>Export PDF</button>
      </div>
    </div>
  );
}
