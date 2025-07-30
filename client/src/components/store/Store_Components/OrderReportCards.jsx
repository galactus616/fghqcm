import React from 'react';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const OrderReportCards = ({ reportData }) => {
  const cards = [
    {
      title: 'Completed Orders',
      value: reportData.completedOrders.value,
      trend: reportData.completedOrders.trend,
      trendDirection: reportData.completedOrders.trendDirection,
      icon: CheckCircle2,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      period: 'from last week'
    },
    {
      title: 'Pending Orders',
      value: reportData.pendingOrders.value,
      trend: reportData.pendingOrders.trend,
      trendDirection: reportData.pendingOrders.trendDirection,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      period: 'from last week'
    },
    {
      title: 'Total Revenue',
      value: `৳ ${reportData.totalRevenue.value.toLocaleString()}`,
      trend: reportData.totalRevenue.trend,
      trendDirection: reportData.totalRevenue.trendDirection,
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      period: 'from last month',
      isRevenue: true
    },
    {
      title: 'Cancelled Orders',
      value: reportData.cancelledOrders.value,
      trend: reportData.cancelledOrders.trend,
      trendDirection: reportData.cancelledOrders.trendDirection,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      period: 'from last week'
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="flex items-center gap-1">
                {card.trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  card.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend}%
                </span>
              </div>
            </div>
            <div>
              <p className={`font-bold text-gray-800 ${card.isRevenue ? 'text-2xl' : 'text-2xl'}`}>
                {card.value}
              </p>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xs text-gray-400 mt-1">{card.period}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default OrderReportCards; 