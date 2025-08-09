import React, { useEffect, useMemo, useState } from 'react';
import OrderReportCards from './storeDashboardComponents/OrderReportCards';
import OrderTable from './storeDashboardComponents/OrderTable';
import OrderFilters from './storeDashboardComponents/OrderFilters';
import { AreaLineChart, DonutChart } from './storeDashboardComponents/Charts';

const StoreDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [exporting, setExporting] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await import('../../data/sampleStoreDashboard.json');
        const data = res?.default || res;
        setKpis(data.kpis);
        setSalesTrend(data.salesLast14Days);
        setDistribution(data.orderStatusDistribution);
        setOrders(data.recentOrders);
        setError('');
      } catch (e) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reportData = useMemo(() => ({
    completedOrders: kpis?.completedOrders || { value: 0, trend: 0, trendDirection: 'up' },
    pendingOrders: kpis?.pendingOrders || { value: 0, trend: 0, trendDirection: 'down' },
    totalRevenue: kpis?.totalRevenue || { value: 0, trend: 0, trendDirection: 'up' },
    cancelledOrders: kpis?.cancelledOrders || { value: 0, trend: 0, trendDirection: 'down' }
  }), [kpis]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') {
      list = list.filter(o => o.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    if (selectedPaymentMethod !== 'all') {
      list = list.filter(o => o.paymentMethod.toLowerCase() === selectedPaymentMethod.toLowerCase());
    }
    switch (selectedSort) {
      case 'oldest':
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'total_high':
        list.sort((a, b) => b.total - a.total);
        break;
      case 'total_low':
        list.sort((a, b) => a.total - b.total);
        break;
      default:
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return list;
  }, [orders, searchQuery, selectedStatus, selectedPaymentMethod, selectedSort]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const { exportOrdersToExcel } = await import('../../utils/OrderExportService');
      await exportOrdersToExcel(filteredOrders);
    } catch (_) {
      // noop
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your store performance</p>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse h-28" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200 text-red-600">
          {error}
        </div>
      ) : (
        <>
          <OrderReportCards reportData={reportData} />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Sales (last 14 days)</h2>
                <span className="text-xs text-gray-500">BDT</span>
              </div>
              <AreaLineChart dataPoints={salesTrend} />
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders by status</h2>
              <div className="flex items-center gap-4">
                <div className="w-40 sm:w-48">
                  <DonutChart segments={distribution} />
                </div>
                <div className="flex-1 space-y-2">
                  {distribution.map((seg, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
                        <span className="text-sm text-gray-700">{seg.label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{seg.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <OrderFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            onExport={handleExport}
            exporting={exporting}
            hasOrders={filteredOrders.length > 0}
          />

          <OrderTable
            orders={filteredOrders}
            loading={false}
            error={''}
            searchQuery={searchQuery}
            onViewOrder={() => {}}
            onEditOrder={() => {}}
          />
        </>
      )}
    </div>
  );
};

export default StoreDashboard;