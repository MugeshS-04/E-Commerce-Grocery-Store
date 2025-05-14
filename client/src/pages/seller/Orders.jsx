import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get('/api/order/seller');
            if (data.success) {
                setOrders(data.orders || []);
            } else {
                toast.error(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load orders');
            console.error('Order fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelOrderByAdmin = async (orderId) => {
        const confirm = window.confirm("Are you sure you want to cancel this order?");
        if (!confirm) return;

        try {
            const { data } = await axios.put(`/api/order/cancel/seller/${orderId}`);
            if (data.success) {
                toast.success("Order cancelled successfully!");
                fetchOrders();
            } else {
                toast.error(data.message || 'Failed to cancel order');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
            console.error('Cancel order error:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`/api/order/update-status/${orderId}`, {
                status: newStatus
            });
            
            if (data.success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrders();
            } else {
                toast.error(data.message || 'Failed to update order status');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order status");
            console.error('Update status error:', error);
        }
    };

    const markAsDelivered = async (orderId) => {
        try {
            const { data } = await axios.put(`/api/order/deliver/${orderId}`);
            if (data.success) {
                toast.success("Order marked as delivered!");
                fetchOrders();
            } else {
                toast.error(data.message || 'Failed to mark as delivered');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to mark as delivered");
            console.error('Deliver error:', error);
        }
    };

    const processOnlinePayment = async (order) => {
        if (!order) {
            toast.error('Order information is missing');
            return;
        }

        setProcessingPayment(true);
        try {
            const { data } = await axios.post('/api/order/process-payment', {
                orderId: order._id,
                amount: order.amount
            });

            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || 'Payment processing failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment processing error');
            console.error('Payment error:', error);
        } finally {
            setProcessingPayment(false);
        }
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const statusColors = {
        'Placed': 'bg-blue-100 text-blue-800',
        'Out for Delivery': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    return (
        <div className='flex-1 h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
            <div className="md:p-8 p-4">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold mb-6 text-gray-800"
                >
                    Orders Management
                </motion.h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-64 text-gray-500"
                    >
                        <img src={assets.empty_icon} alt="No orders" className="w-24 h-24 mb-4" />
                        <p className="text-lg">No orders found</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {orders.map((order) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
                                >
                                    <div 
                                        className="flex flex-col md:flex-row md:items-center p-5 cursor-pointer"
                                        onClick={() => toggleOrderExpand(order._id)}
                                    >
                                        <div className="flex items-center space-x-4 md:w-1/4">
                                            <div className="relative">
                                                <img 
                                                    className="w-14 h-14 object-cover rounded-lg bg-gray-100 p-2"
                                                    src={assets.box_icon} 
                                                    alt="Order" 
                                                />
                                                <span className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Order #{order._id.substring(0, 8).toUpperCase()}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="md:w-1/4 mt-4 md:mt-0">
                                            <p className="font-medium text-gray-700">
                                                {order.address.firstName} {order.address.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {order.address.city}, {order.address.state}
                                            </p>
                                        </div>

                                        <div className="md:w-1/4 mt-4 md:mt-0">
                                            <p className="text-sm">
                                                <span className="font-medium">Items:</span> {order.items.length}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Payment:</span> 
                                                <span className={`ml-1 ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {order.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="md:w-1/4 mt-4 md:mt-0 text-right">
                                            <p className="text-lg font-bold text-purple-600">
                                                {currency}{order.amount}
                                            </p>
                                            <div className="flex justify-end mt-2">
                                                <motion.div
                                                    animate={{ rotate: expandedOrder === order._id ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <svg 
                                                        className="w-5 h-5 text-gray-500"
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24" 
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedOrder === order._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-5 pb-5"
                                            >
                                                <div className="border-t pt-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h3 className="font-medium text-gray-700 mb-3">Order Items</h3>
                                                            <div className="space-y-3">
                                                                {order.items.map((item, index) => (
                                                                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                                                        <img 
                                                                            src={item.product.image?.[0] || assets.placeholder} 
                                                                            alt={item.product.name}
                                                                            className="w-12 h-12 object-cover rounded-md"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <p className="font-medium">{item.product.name}</p>
                                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                                        </div>
                                                                        <p className="font-medium">
                                                                            {currency}{item.product.offerPrice * item.quantity}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className="font-medium text-gray-700 mb-3">Order Details</h3>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                                                    <div className="relative mt-1 block w-full rounded-md p-[2px] bg-gradient-to-r from-green-300 to-green-600">
                                                                        <div className="block w-full pl-3 pr-10 py-2 text-base bg-white border-none focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                                                                            <select
                                                                                value={order.status}
                                                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                                                className="mt-1 block w-full h-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                                                                            >
                                                                                <option value="Placed">Placed</option>
                                                                                <option value="Out for Delivery">Out for Delivery</option>
                                                                                <option value="Delivered">Delivered</option>
                                                                                <option value="Cancelled">Cancelled</option>
                                                                            </select> 
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                                                                    <p className="mt-1 text-sm text-gray-900">
                                                                        {order.paymentType} ({order.isPaid ? 'Paid' : 'Pending'})
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-500">Shipping Address</label>
                                                                    <p className="mt-1 text-sm text-gray-900">
                                                                        {order.address.street}, {order.address.city}<br />
                                                                        {order.address.state}, {order.address.zipcode}<br />
                                                                        {order.address.country}<br />
                                                                        Phone: {order.address.phone}
                                                                    </p>
                                                                </div>

                                                                <div className="flex space-x-3">
                                                                    {order.status === 'Out for Delivery' && (
                                                                        <button
                                                                            onClick={() => markAsDelivered(order._id)}
                                                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                                                        >
                                                                            Mark as Delivered
                                                                        </button>
                                                                    )}
                                                                    
                                                                    {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                                                        <button
                                                                            onClick={() => cancelOrderByAdmin(order._id)}
                                                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                                                                        >
                                                                            Cancel Order
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders;