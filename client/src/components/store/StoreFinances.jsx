import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useCurrencySymbol } from '../../utils/currencyUtils';

// Simple Line Chart Component that accepts dynamic labels and values
const RevenueChart = ({ labels, values, currencySymbol, periodLabel }) => {
  const maxValue = Math.max(...values, 1);
  const chartHeight = 220;
  const chartWidth = 640;
  const padding = 40;

  const points = values
    .map((val, index) => {
      const x = (index / (values.length - 1 || 1)) * (chartWidth - 2 * padding) + padding;
      const y = chartHeight - padding - (val / maxValue) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>{periodLabel}</span>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (chartHeight - 2 * padding)) / 4}
              x2={chartWidth - padding}
              y2={padding + (i * (chartHeight - 2 * padding)) / 4}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          <polyline fill="none" stroke="#10b981" strokeWidth="3" points={points} />

          {values.map((val, index) => {
            const x = (index / (values.length - 1 || 1)) * (chartWidth - 2 * padding) + padding;
            const y = chartHeight - padding - (val / maxValue) * (chartHeight - 2 * padding);
            return <circle key={index} cx={x} cy={y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />;
          })}

          {labels.map((label, index) => {
            const x = (index / (labels.length - 1 || 1)) * (chartWidth - 2 * padding) + padding;
            return (
              <text key={index} x={x} y={chartHeight - 10} textAnchor="middle" className="text-xs fill-gray-500">
                {label}
              </text>
            );
          })}

          {[0, 1, 2, 3, 4].map((i) => {
            const value = Math.round((maxValue * (4 - i)) / 4);
            const y = padding + (i * (chartHeight - 2 * padding)) / 4;
            return (
              <text key={i} x={padding - 10} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
                {currencySymbol} {value.toLocaleString()}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Simple Pie Chart Component
const CommissionPieChart = ({ data, currencySymbol }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0) || 1;
  let currentAngle = 0;

  const colors = ['#ef4444', '#f97316', '#10b981'];

  const segments = data.map((item, index) => {
    const percentage = (item.amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [`M ${centerX} ${centerY}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');

    return { pathData, percentage, color: colors[index], label: item.label };
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Commission Breakdown</h3>

      <div className="flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {segments.map((segment, index) => (
            <path key={index} d={segment.pathData} fill={segment.color} stroke="white" strokeWidth="2" />
          ))}
          <circle cx="100" cy="100" r="30" fill="white" />
          <text x="100" y="105" textAnchor="middle" className="text-sm font-medium fill-gray-700">
            {currencySymbol} {total.toLocaleString()}
          </text>
        </svg>
      </div>

      <div className="mt-6 space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
              <span className="text-sm text-gray-700">{segment.label}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">{currencySymbol} {data[index].amount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{segment.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StoreFinances = () => {
  const currencySymbol = useCurrencySymbol();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  // Mock financial data by period - replace with API calls later
  const mockFinancialData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      revenueSeries: [8500, 12000, 9800, 15000, 18000, 22000, 16000],
      totalRevenue: 101300,
      netProfit: 70910,
      pendingPayouts: 15000,
      totalOrders: 34,
      completedOrders: 30,
      pendingOrders: 3,
      cancelledOrders: 1,
      averageOrderValue: 780,
      commissionRate: 30,
      commissionAmount: 30390,
      deliveryFees: 0,
      trends: {
        revenue: { value: 5.2, direction: 'up' },
        orders: { value: 3.1, direction: 'up' },
        profit: { value: 5.0, direction: 'up' },
        averageOrder: { value: 1.9, direction: 'up' }
      }
    },
    month: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      revenueSeries: [26000, 28000, 31000, 40000],
      totalRevenue: 125000,
      netProfit: 87500,
      pendingPayouts: 25000,
      totalOrders: 156,
      completedOrders: 142,
      pendingOrders: 8,
      cancelledOrders: 6,
      averageOrderValue: 801,
      commissionRate: 30,
      commissionAmount: 37500,
      deliveryFees: 0,
      trends: {
        revenue: { value: 27.6, direction: 'up' },
        orders: { value: 21.9, direction: 'up' },
        profit: { value: 27.5, direction: 'up' },
        averageOrder: { value: 4.7, direction: 'up' }
      }
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      revenueSeries: [80000, 92000, 101000, 115000, 120000, 130000, 140000, 138000, 132000, 125000, 118000, 110000],
      totalRevenue: 1450000,
      netProfit: 1015000,
      pendingPayouts: 120000,
      totalOrders: 1980,
      completedOrders: 1820,
      pendingOrders: 110,
      cancelledOrders: 50,
      averageOrderValue: 732,
      commissionRate: 30,
      commissionAmount: 435000,
      deliveryFees: 0,
      trends: {
        revenue: { value: 18.4, direction: 'up' },
        orders: { value: 14.2, direction: 'up' },
        profit: { value: 18.7, direction: 'up' },
        averageOrder: { value: 3.1, direction: 'up' }
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const periodData = useMemo(() => mockFinancialData[selectedPeriod], [selectedPeriod]);

  const commissionBreakdown = useMemo(() => [
    { label: 'Platform Commission', amount: periodData.commissionAmount, percentage: periodData.commissionRate, color: 'text-red-600' },
    { label: 'Delivery Fees', amount: periodData.deliveryFees, percentage: 0, color: 'text-orange-600' },
    { label: 'Net Earnings', amount: periodData.netProfit, percentage: 100 - periodData.commissionRate, color: 'text-green-600', isTotal: true }
  ], [periodData]);

  const summaryCards = useMemo(() => [
    {
      title: 'Total Revenue',
      value: `${currencySymbol} ${periodData.totalRevenue.toLocaleString()}`,
      trend: periodData.trends.revenue.value,
      trendDirection: periodData.trends.revenue.direction,
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      period: selectedPeriod
    },
    {
      title: 'Net Profit',
      value: `${currencySymbol} ${periodData.netProfit.toLocaleString()}`,
      trend: periodData.trends.profit.value,
      trendDirection: periodData.trends.profit.direction,
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      period: selectedPeriod
    },
    {
      title: 'Pending Payouts',
      value: `${currencySymbol} ${periodData.pendingPayouts.toLocaleString()}`,
      trend: 0,
      trendDirection: 'neutral',
      icon: Wallet,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      period: 'ready for withdrawal'
    },
    {
      title: 'Total Orders',
      value: periodData.totalOrders,
      trend: periodData.trends.orders.value,
      trendDirection: periodData.trends.orders.direction,
      icon: BarChart3,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      period: selectedPeriod
    }
  ], [currencySymbol, periodData, selectedPeriod]);

  const orderStatusCards = useMemo(() => [
    {
      title: 'Completed Orders',
      value: periodData.completedOrders,
      icon: CheckCircle2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      percentage: periodData.totalOrders ? Math.round((periodData.completedOrders / periodData.totalOrders) * 100) : 0
    },
    {
      title: 'Pending Orders',
      value: periodData.pendingOrders,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      percentage: periodData.totalOrders ? Math.round((periodData.pendingOrders / periodData.totalOrders) * 100) : 0
    },
    {
      title: 'Cancelled Orders',
      value: periodData.cancelledOrders,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      percentage: periodData.totalOrders ? Math.round((periodData.cancelledOrders / periodData.totalOrders) * 100) : 0
    }
  ], [periodData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Store Finances</h1>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const periodLabelMap = { week: 'This Week', month: 'This Month', year: 'This Year' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Finances</h1>
          <p className="text-gray-600 mt-1">Track your earnings, payouts, and financial performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 ${card.iconBg} rounded-full flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 sm:w-6 sm:h-6 ${card.iconColor}`} />
                </div>
                {card.trendDirection !== 'neutral' && (
                  <div className="flex items-center gap-1">
                    {card.trendDirection === 'up' ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${card.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.trend}%
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg sm:text-2xl">{card.value}</p>
                <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
                <p className="text-xs text-gray-400 mt-1">{periodLabelMap[card.period] || card.period}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart labels={periodData.labels} values={periodData.revenueSeries} currencySymbol={currencySymbol} periodLabel={periodLabelMap[selectedPeriod]} />
        <CommissionPieChart data={commissionBreakdown} currencySymbol={currencySymbol} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          <div className="space-y-4">
            {orderStatusCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${card.iconBg} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{card.title}</p>
                      <p className="text-xs text-gray-500">{card.percentage}% of total</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{card.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Breakdown</h3>
          <div className="space-y-4">
            {commissionBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.percentage}%</p>
                </div>
                <span className={`text-lg font-bold ${item.color}`}>
                  {item.isTotal ? '+' : '-'} {currencySymbol} {item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Avg Order Value</p>
                  <p className="text-xs text-gray-500">per order</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-800">{currencySymbol} {periodData.averageOrderValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Growth Rate</p>
                  <p className="text-xs text-gray-500">vs last period</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${periodData.trends.revenue.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {periodData.trends.revenue.direction === 'up' ? '+' : '-'}{periodData.trends.revenue.value}%
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreFinances;