import React, { useState } from "react";
import { Calendar, Plus, CheckCircle2 } from "lucide-react";

const TaskChart = ({ tasks }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate data for the last 12 months (1 year)
  const getChartData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      // Calculate target month and year
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      
      const monthStart = new Date(year, month, 1).getTime();
      const monthEnd = new Date(year, month + 1, 1).getTime();
      
      // Filter tasks created in this month
      const createdCount = tasks.filter((t) => {
        const time = new Date(t.createdAt).getTime();
        return time >= monthStart && time < monthEnd;
      }).length;
      
      // Filter tasks completed in this month (robust fallback to updatedAt/createdAt)
      const completedCount = tasks.filter((t) => {
        const isCompleted = t.status === "completed" || t.status === "complete";
        if (!isCompleted) return false;
        
        const compDate = t.completedAt || t.updatedAt || t.createdAt;
        if (!compDate) return false;
        
        const time = new Date(compDate).getTime();
        return time >= monthStart && time < monthEnd;
      }).length;
      
      const label = `Thg ${month + 1}`;
      const yearLabel = `'${String(year).slice(-2)}`;
      
      data.push({
        dateStr: `Tháng ${month + 1}, ${year}`,
        dayName: label,
        yearStr: yearLabel,
        created: createdCount,
        completed: completedCount,
      });
    }
    return data;
  };

  const chartData = getChartData();
  
  // Calculate max value to scale the chart dynamically
  const maxTasks = Math.max(
    ...chartData.map((d) => Math.max(d.created, d.completed)),
    4 // Keep a nice minimum scale
  );

  // Chart dimensions
  const width = 800;
  const height = 280;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barSpacing = chartWidth / 12; // 12 columns for 12 months
  const barWidth = 11; // Dual bars of size 11px each

  // Grid lines calculation
  const gridLines = [];
  const step = Math.max(1, Math.ceil(maxTasks / 4));
  for (let i = 0; i <= 4; i++) {
    gridLines.push(i * step);
  }
  const actualMax = gridLines[gridLines.length - 1];

  return (
    <div className="w-full bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-md border border-slate-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="size-4.5 text-indigo-600" />
            <span>Phân tích hoạt động 1 năm qua</span>
          </h3>
          <p className="text-xs text-slate-400">
            Số lượng công việc được tạo mới và hoàn thành theo từng tháng.
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
        <div className="min-w-[650px] w-full">
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
            {/* Gradients */}
            <defs>
              <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
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
                    className="text-[10px] font-bold fill-slate-400"
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
              const createdX = groupCenterX - barWidth - 2;

              // Completed bar height and coordinate
              const completedHeight = (d.completed / actualMax) * chartHeight;
              const completedY = chartHeight - completedHeight + paddingTop;
              const completedX = groupCenterX + 2;

              return (
                <g 
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Broad transparent overlay for easier hovering */}
                  <rect
                    x={paddingLeft + i * barSpacing + 2}
                    y={paddingTop}
                    width={barSpacing - 4}
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
                      fill="#6366f1"
                      rx="3"
                      className="transition-all duration-300 hover:opacity-90"
                    />
                  )}

                  {/* Completed Bar */}
                  {d.completed > 0 && (
                    <rect
                      x={completedX}
                      y={completedY}
                      width={barWidth}
                      height={completedHeight}
                      fill="#10b981"
                      rx="3"
                      className="transition-all duration-300 hover:opacity-90"
                    />
                  )}

                  {/* X Axis Label */}
                  <text
                    x={groupCenterX}
                    y={height - paddingBottom + 18}
                    textAnchor="middle"
                    className="text-[10.5px] font-bold fill-slate-600"
                  >
                    {d.dayName}
                  </text>
                  <text
                    x={groupCenterX}
                    y={height - paddingBottom + 30}
                    textAnchor="middle"
                    className="text-[9px] font-semibold fill-slate-400"
                  >
                    {d.yearStr}
                  </text>

                  {/* Column Highlight on Hover */}
                  {hoveredIndex === i && (
                    <rect
                      x={paddingLeft + i * barSpacing + 2}
                      y={paddingTop - 10}
                      width={barSpacing - 4}
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
                {chartData[hoveredIndex].dateStr}
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
