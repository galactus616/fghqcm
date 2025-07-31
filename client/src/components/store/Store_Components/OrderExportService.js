// Order Export Service - Handles Excel/CSV export functionality
export const exportOrdersToExcel = (orders) => {
  try {
    // Prepare data for export
    const exportData = orders.map(order => ({
      'Order ID': order.orderId,
      'Customer Name': order.customer.name,
      'Customer Email': order.customer.email,
      'Order Date': formatDate(order.date),
      'Status': order.status,
      'Payment Method': order.paymentMethod,
      'Total Amount (৳)': order.total.toFixed(2),
      'Items Count': order.items.length,
      'Items': order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')
    }));

    // Create CSV content
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create filename with timestamp
    const fileName = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      count: exportData.length,
      fileName: fileName,
      message: `Successfully exported ${exportData.length} orders to Excel file!`
    };
  } catch (error) {
    console.error('Export failed:', error);
    return {
      success: false,
      error: 'Failed to export orders. Please try again.',
      details: error.message
    };
  }
};

// Helper function to format date for export
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}; 