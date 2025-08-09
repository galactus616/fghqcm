import React, { useMemo } from 'react';

export const AreaLineChart = ({ dataPoints = [], height = 220, stroke = '#0a614d', fill = 'rgba(10, 97, 77, 0.12)' }) => {
  const width = 600;
  const padding = 24;

  const { pathD, areaD, xTicks, yMax } = useMemo(() => {
    if (!dataPoints.length) {
      return { pathD: '', areaD: '', xTicks: [], yMax: 0 };
    }
    const maxVal = Math.max(...dataPoints);
    const minVal = Math.min(...dataPoints);
    const yRange = Math.max(maxVal - minVal, 1);
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const stepX = chartW / Math.max(dataPoints.length - 1, 1);

    const toX = (i) => padding + i * stepX;
    const toY = (v) => padding + chartH - ((v - minVal) / yRange) * chartH;

    let d = '';
    dataPoints.forEach((v, i) => {
      const x = toX(i);
      const y = toY(v);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });

    const firstX = toX(0);
    const lastX = toX(dataPoints.length - 1);
    const baseY = toY(minVal);
    const area = `${d} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;

    const ticks = Array.from({ length: Math.min(6, dataPoints.length) }, (_, i) => Math.round((i * (dataPoints.length - 1)) / Math.max(5, dataPoints.length - 1)));
    return { pathD: d, areaD: area, xTicks: ticks, yMax: maxVal };
  }, [dataPoints, height]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="white" />
      <path d={areaD} fill="url(#areaFill)" />
      <path d={pathD} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {xTicks.map((i) => {
        const x = 24 + (i * (width - 48)) / Math.max(dataPoints.length - 1, 1);
        return <line key={i} x1={x} y1={height - 24} x2={x} y2={height - 20} stroke="#9ca3af" />;
      })}
      <text x={width - 8} y={16} textAnchor="end" fontSize="10" fill="#6b7280">Max: {yMax}</text>
    </svg>
  );
};

export const DonutChart = ({ segments = [], size = 180, thickness = 22 }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} fill="none" stroke="#e5e7eb" strokeWidth={thickness} />
        {segments.map((seg, idx) => {
          const length = (seg.value / total) * circumference;
          const circle = (
            <circle
              key={idx}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += length;
          return circle;
        })}
        <text x="0" y="4" textAnchor="middle" className="fill-gray-800" fontSize="16" fontWeight="700">
          {Math.round(total)}
        </text>
      </g>
    </svg>
  );
};

export default { AreaLineChart, DonutChart };


