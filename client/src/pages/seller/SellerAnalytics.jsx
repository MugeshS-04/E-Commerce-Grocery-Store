import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const SellerAnalytics = () => {
  const { axios } = useAppContext();
  const [analyticsData, setAnalyticsData] = useState({
    orders: [],
    products: [],
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders data
        const ordersRes = await axios.get('/api/order/seller');
        const productsRes = await axios.get('/api/product/list');
        
        if (ordersRes.data.success && productsRes.data.success) {
          setAnalyticsData({
            orders: ordersRes.data.orders,
            products: productsRes.data.products,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalyticsData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [axios]);

  // Process data for charts
  const processData = () => {
    const { orders, products } = analyticsData;
    
    // 1. Order Status Distribution
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // 2. Monthly Sales
    const monthlySales = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).getMonth();
      acc[month] = (acc[month] || 0) + order.amount;
      return acc;
    }, {});

    // 3. Product Stock Status
    const stockStatus = products.reduce((acc, product) => {
      if (product.inStock) acc.inStock = (acc.inStock || 0) + 1;
      else acc.outOfStock = (acc.outOfStock || 0) + 1;
      return acc;
    }, {});

    // 4. Payment Method Distribution
    const paymentMethods = orders.reduce((acc, order) => {
      acc[order.paymentType] = (acc[order.paymentType] || 0) + 1;
      return acc;
    }, {});

    // 5. Recent Orders (last 7 days)
    const recentOrders = orders.filter(order => {
      return new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    });

    return {
      statusCount,
      monthlySales,
      stockStatus,
      paymentMethods,
      recentOrders
    };
  };

  const chartData = processData();

  if (analyticsData.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full">
      <h1 className="text-2xl font-bold mb-6">Seller Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{analyticsData.orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{analyticsData.products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">In Stock</h3>
          <p className="text-2xl font-bold text-green-600">{chartData.stockStatus.inStock || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{chartData.stockStatus.outOfStock || 0}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <Pie
            data={{
              labels: Object.keys(chartData.statusCount),
              datasets: [{
                data: Object.values(chartData.statusCount),
                backgroundColor: [
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(255, 99, 132, 0.5)'
                ],
                borderWidth: 1
              }]
            }}
          />
        </div>

        {/* Monthly Sales */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Sales Amount',
                data: Object.values(chartData.monthlySales),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }]
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <Pie
            data={{
              labels: Object.keys(chartData.paymentMethods),
              datasets: [{
                data: Object.values(chartData.paymentMethods),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)'
                ],
                borderWidth: 1
              }]
            }}
          />
        </div>

        {/* Recent Orders Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders (Last 7 Days)</h2>
          <Line
            data={{
              labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
              datasets: [{
                label: 'Orders',
                data: Array(7).fill(0).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  return chartData.recentOrders.filter(order => 
                    new Date(order.createdAt).toDateString() === date.toDateString()
                  ).length;
                }),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3
              }]
            }}
          />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.orders.slice(0, 5).map(order => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{order._id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Placed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Out for Delivery' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;








// import React, { useEffect, useState } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// } from 'chart.js';
// import { Bar, Pie, Line } from 'react-chartjs-2';
// import { useAppContext } from '../../context/AppContext';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// const SellerAnalytics = () => {
//   const { axios } = useAppContext();
//   const [analyticsData, setAnalyticsData] = useState({
//     orders: [],
//     products: [],
//     loading: true
//   });
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [filteredData, setFilteredData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch orders data
//         const ordersRes = await axios.get('/api/order/seller');
//         const productsRes = await axios.get('/api/product/list');
        
//         if (ordersRes.data.success && productsRes.data.success) {
//           setAnalyticsData({
//             orders: ordersRes.data.orders,
//             products: productsRes.data.products,
//             loading: false
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching analytics:', error);
//         setAnalyticsData(prev => ({ ...prev, loading: false }));
//       }
//     };

//     fetchData();
//   }, [axios]);

//   useEffect(() => {
//     if (analyticsData.orders.length > 0) {
//       applyMonthFilter();
//     }
//   }, [selectedMonth, analyticsData]);

//   const applyMonthFilter = () => {
//     const { orders, products } = analyticsData;
//     const year = selectedMonth.getFullYear();
//     const month = selectedMonth.getMonth();

//     // Filter orders by selected month
//     const filteredOrders = orders.filter(order => {
//       const orderDate = new Date(order.createdAt);
//       return orderDate.getFullYear() === year && orderDate.getMonth() === month;
//     });

//     // Process data for the filtered month
//     const processedData = processFilteredData(filteredOrders, products);
//     setFilteredData(processedData);
//   };

//   const processFilteredData = (orders, products) => {
//     // 1. Order Status Distribution
//     const statusCount = orders.reduce((acc, order) => {
//       acc[order.status] = (acc[order.status] || 0) + 1;
//       return acc;
//     }, {});

//     // 2. Weekly Sales Breakdown
//     const weeklySales = Array(5).fill(0).map((_, week) => {
//       const weekStart = week * 7;
//       const weekEnd = weekStart + 6;
//       return orders.filter(order => {
//         const day = new Date(order.createdAt).getDate();
//         return day >= weekStart && day <= weekEnd;
//       }).reduce((sum, order) => sum + order.amount, 0);
//     });

//     // 3. Product Sales and Categories
//     const productSales = {};
//     const categorySales = {};
    
//     orders.forEach(order => {
//       order.items.forEach(item => {
//         const product = products.find(p => p._id === item.product);
//         if (product) {
//           // Product sales
//           if (!productSales[product.name]) {
//             productSales[product.name] = 0;
//           }
//           productSales[product.name] += product.offerPrice * item.quantity;

//           // Category sales
//           if (!categorySales[product.category]) {
//             categorySales[product.category] = 0;
//           }
//           categorySales[product.category] += product.offerPrice * item.quantity;
//         }
//       });
//     });

//     // Convert to arrays for charts
//     const topProducts = Object.entries(productSales)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 5);

//     const topCategories = Object.entries(categorySales)
//       .sort((a, b) => b[1] - a[1]);

//     // 4. Payment Method Distribution
//     const paymentMethods = orders.reduce((acc, order) => {
//       acc[order.paymentType] = (acc[order.paymentType] || 0) + 1;
//       return acc;
//     }, {});

//     return {
//       statusCount,
//       weeklySales,
//       topProducts,
//       topCategories,
//       paymentMethods,
//       filteredOrders:orders,
//       totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
//       totalOrders: orders.length
//     };
//   };

//   if (analyticsData.loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Seller Analytics Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <label className="text-gray-600">Select Month:</label>
//           <DatePicker
//             selected={selectedMonth}
//             onChange={date => setSelectedMonth(date)}
//             dateFormat="MM/yyyy"
//             showMonthYearPicker
//             className="border rounded-md px-3 py-1"
//           />
//         </div>
//       </div>

//       {filteredData && (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-gray-500">Total Orders</h3>
//               <p className="text-2xl font-bold">{filteredData.totalOrders}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-gray-500">Total Revenue</h3>
//               <p className="text-2xl font-bold">₹{filteredData.totalRevenue.toLocaleString()}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-gray-500">Total Products Sold</h3>
//               <p className="text-2xl font-bold">
//                 {filteredData.topProducts.reduce((sum, product) => sum + product[1], 0)}
//               </p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-gray-500">Categories</h3>
//               <p className="text-2xl font-bold">{filteredData.topCategories.length}</p>
//             </div>
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             {/* Weekly Sales Breakdown */}
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">Weekly Sales Breakdown</h2>
//               <Bar
//                 data={{
//                   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
//                   datasets: [{
//                     label: 'Sales Amount (₹)',
//                     data: filteredData.weeklySales,
//                     backgroundColor: 'rgba(54, 162, 235, 0.5)',
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     borderWidth: 1
//                   }]
//                 }}
//                 options={{
//                   scales: {
//                     y: {
//                       beginAtZero: true
//                     }
//                   }
//                 }}
//               />
//             </div>

//             {/* Order Status Distribution */}
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
//               <Pie
//                 data={{
//                   labels: Object.keys(filteredData.statusCount),
//                   datasets: [{
//                     data: Object.values(filteredData.statusCount),
//                     backgroundColor: [
//                       'rgba(54, 162, 235, 0.5)',
//                       'rgba(255, 206, 86, 0.5)',
//                       'rgba(75, 192, 192, 0.5)',
//                       'rgba(255, 99, 132, 0.5)'
//                     ],
//                     borderWidth: 1
//                   }]
//                 }}
//               />
//             </div>
//           </div>

//           {/* Product and Category Breakdown */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             {/* Top Selling Products */}
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
//               <Bar
//                 data={{
//                   labels: filteredData.topProducts.map(item => item[0]),
//                   datasets: [{
//                     label: 'Revenue (₹)',
//                     data: filteredData.topProducts.map(item => item[1]),
//                     backgroundColor: 'rgba(153, 102, 255, 0.5)',
//                     borderColor: 'rgba(153, 102, 255, 1)',
//                     borderWidth: 1
//                   }]
//                 }}
//                 options={{
//                   indexAxis: 'y',
//                   responsive: true,
//                   scales: {
//                     x: {
//                       beginAtZero: true
//                     }
//                   }
//                 }}
//               />
//             </div>

//             {/* Revenue by Category */}
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">Revenue by Category</h2>
//               <Pie
//                 data={{
//                   labels: filteredData.topCategories.map(item => item[0]),
//                   datasets: [{
//                     data: filteredData.topCategories.map(item => item[1]),
//                     backgroundColor: [
//                       'rgba(255, 99, 132, 0.5)',
//                       'rgba(54, 162, 235, 0.5)',
//                       'rgba(255, 206, 86, 0.5)',
//                       'rgba(75, 192, 192, 0.5)',
//                       'rgba(153, 102, 255, 0.5)'
//                     ],
//                     borderWidth: 1
//                   }]
//                 }}
//               />
//             </div>
//           </div>

//           {/* Payment Methods */}
//           <div className="bg-white p-4 rounded-lg shadow mb-6">
//             <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
//             <div className="max-w-md mx-auto">
//               <Pie
//                 data={{
//                   labels: Object.keys(filteredData.paymentMethods),
//                   datasets: [{
//                     data: Object.values(filteredData.paymentMethods),
//                     backgroundColor: [
//                       'rgba(255, 99, 132, 0.5)',
//                       'rgba(54, 162, 235, 0.5)'
//                     ],
//                     borderWidth: 1
//                   }]
//                 }}
//               />
//             </div>
//           </div>

//           {/* Detailed Product Sales Table */}
//           <div className="bg-white p-4 rounded-lg shadow mt-6">
//             <h2 className="text-lg font-semibold mb-4">Detailed Product Sales</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredData.topProducts.map(([productName, revenue]) => {
//                     // Find product details
//                     const product = analyticsData.products.find(p => p.name === productName);
//                     // Calculate quantity sold
//                     const quantity = filteredData.filteredOrders.reduce((sum, order) => {
//                       const item = order.items.find(i => {
//                         const p = analyticsData.products.find(prod => prod._id === i.product);
//                         return p && p.name === productName;
//                       });
//                       return sum + (item ? item.quantity : 0);
//                     }, 0);

//                     return (
//                       <tr key={productName}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {productName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {product?.category || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {quantity}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           ₹{revenue.toLocaleString()}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SellerAnalytics;