import React, { useState } from "react";
import { Calendar, Plus, CheckCircle2 } from "lucide-react";

const TaskChart = ({ tasks }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate data for the last 7 days
  const getChartData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const createdCount = tasks.filter((t) => {
        const time = new Date(t.createdAt).getTime();
        return time >= dayStart && time < dayEnd;
      }).length;
      
      const completedCount = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const time = new Date(t.completedAt).getTime();
        return time >= dayStart && time < dayEnd;
      }).length;
      
      const label = d.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });
      const weekday = d.toLocaleDateString("vi-VN", { weekday: "short" });
      
      data.push({
        dateStr: label,
        dayName: weekday,
        created: createdCount,
        completed: completedCount,
      });
    }
    return data;
  };

  const chartData = getChartData();
  
  // Calculate max value to scale the chart
  const maxTasks = Math.max(
    ...chartData.map((d) => Math.max(d.created, d.completed)),
    4 // Default minimum max value to keep a nice scale
  );

  // Chart dimensions
  const width = 800;
  const height = 280;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barSpacing = chartWidth / 7;
  const barWidth = 18;

  // Grid lines
  const gridLines = [];
  const step = Math.ceil(maxTasks / 4);
  for (let i = 0; i <= 4; i++) {
    gridLines.push(Math.round(i * step));
  }
  const actualMax = gridLines[gridLines.length - 1];

  return (
    <div className="w-full bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-md border border-slate-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="size-4.5 text-indigo-600" />
            <span>Phân tích hoạt động 7 ngày qua</span>
          </h3>
          <p className="text-xs text-slate-400">
            Số lượng công việc được tạo mới và hoàn thành theo từng ngày.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-indigo-500 block" />
            <span className="text-slate-500">Tạo mới</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-emerald-500 block" />
            <span className="text-slate-500">Đã hoàn thành</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto select-none">
        <div className="min-w-[600px] w-full">
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
            {/* Gradients */}
            <defs>
              <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {gridLines.map((val, idx) => {
              const y = chartHeight - (val / actualMax) * chartHeight + paddingTop;
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray={idx === 0 ? "0" : "4 4"}
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-semibold fill-slate-400"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Bars and Columns */}
            {chartData.map((d, i) => {
              const groupCenterX = paddingLeft + i * barSpacing + barSpacing / 2;
              
              // Created bar height and coordinate
              const createdHeight = (d.created / actualMax) * chartHeight;
              const createdY = chartHeight - createdHeight + paddingTop;
              const createdX = groupCenterX - barWidth - 3;

              // Completed bar height and coordinate
              const completedHeight = (d.completed / actualMax) * chartHeight;
              const completedY = chartHeight - completedHeight + paddingTop;
              const completedX = groupCenterX + 3;

              return (
                <g 
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible broad rect for easier hover targeting */}
                  <rect
                    x={paddingLeft + i * barSpacing + 5}
                    y={paddingTop}
                    width={barSpacing - 10}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Created Bar */}
                  {d.created > 0 && (
                    <rect
                      x={createdX}
                      y={createdY}
                      width={barWidth}
                      height={createdHeight}
                      fill="url(#createdGrad)"
                      rx="4"
                      className="transition-all duration-300 hover:brightness-105"
                    />
                  )}

                  {/* Completed Bar */}
                  {d.completed > 0 && (
                    <rect
                      x={completedX}
                      y={completedY}
                      width={barWidth}
                      height={completedHeight}
                      fill="url(#completedGrad)"
                      rx="4"
                      className="transition-all duration-300 hover:brightness-105"
                    />
                  )}

                  {/* X Axis Label */}
                  <text
                    x={groupCenterX}
                    y={height - paddingBottom + 18}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-600"
                  >
                    {d.dayName}
                  </text>
                  <text
                    x={groupCenterX}
                    y={height - paddingBottom + 32}
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-slate-400"
                  >
                    {d.dateStr}
                  </text>

                  {/* Highlight column background on hover */}
                  {hoveredIndex === i && (
                    <rect
                      x={paddingLeft + i * barSpacing + 4}
                      y={paddingTop - 10}
                      width={barSpacing - 8}
                      height={chartHeight + 20}
                      fill="rgba(99, 102, 241, 0.04)"
                      rx="8"
                      className="pointer-events-none"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Overlay */}
          {hoveredIndex !== null && (
            <div
              className="absolute bg-slate-900/90 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700/50 backdrop-blur-xs pointer-events-none transition-all duration-150 z-20 space-y-1.5"
              style={{
                left: `${paddingLeft + hoveredIndex * barSpacing + barSpacing / 2}px`,
                top: "10px",
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-bold border-b border-slate-700 pb-1 text-center text-[10px] text-slate-300">
                {chartData[hoveredIndex].dayName} ({chartData[hoveredIndex].dateStr})
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Plus className="size-3" /> Tạo mới:
                </span>
                <span className="font-extrabold">{chartData[hoveredIndex].created}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="size-3" /> Hoàn thành:
                </span>
                <span className="font-extrabold">{chartData[hoveredIndex].completed}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskChart;
