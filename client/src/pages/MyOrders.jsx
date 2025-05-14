import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const { currency, axios, user } = useAppContext();

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user');
            if (data.success) {
                setMyOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const { data } = await axios.put(`/api/order/cancel/user/${orderId}`, {
                userId: user._id,
            });
            if (data.success) {
                toast.success("Order Cancelled");
                fetchMyOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-end mb-8">
                <h2 className="text-2xl font-medium uppercase">My Orders</h2>
                <div className="w-16 h-1 bg-purple-600 rounded-full"></div>
            </div>

            {myOrders.length === 0 && (
                <p className="text-center text-gray-500">No Orders Found</p>
            )}

            {myOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-700">
                            Order #{order._id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-purple-700 mb-4">Order Summary</h4>
                            
                            {order.items.map((item) => (
                                <div key={item.product._id} className="mb-6">
                                    <div className="grid grid-cols-12 gap-4 items-center mb-2">
                                        <div className="col-span-2">
                                            <img
                                                src={item.product.image[0]}
                                                alt={item.product.name}
                                                className="w-full h-24 object-contain"
                                            />
                                        </div>
                                        <div className="col-span-3 text-center">{item.product.name}</div>
                                        <div className="col-span-2 text-center text-gray-600">{item.product.color || 'N/A'}</div>
                                        <div className="col-span-2 text-center text-gray-600">{item.product.storage || 'N/A'}</div>
                                        <div className="col-span-1 text-center text-gray-600">Qty: {item.quantity}</div>
                                        <div className="col-span-2 text-center font-medium">
                                            {currency}{item.product.offerPrice * item.quantity}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600 w-24">Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full" 
                                                style={{ 
                                                    width: `${order.status === 'Placed' ? '33%' : order.status === 'Out for Delivery' ? '66%' : '100%'}` 
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                                            <span>Placed</span>
                                            <span>Out for Delivery</span>
                                            <span>Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Payment Details</h5>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm">
                                        <span className="font-medium">Method:</span> {order.paymentType} 
                                        {order.status === 'Delivered' 
                                            ? ' (Paid)' 
                                            : order.paymentType === 'COD' 
                                                ? ' (Pay on Delivery)' 
                                                : ` (${order.isPaid ? 'Paid' : 'Processing'})`}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Delivery Address</h5>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm">
                                        {order.address.addressLine1},<br />
                                        {order.address.city}, {order.address.state} - {order.address.pincode}
                                    </p>
                                    <p className="text-sm mt-2">
                                        <span className="font-medium">Contact:</span> {order.address.mobile}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">{currency}{order.amount}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-medium">{currency}0.00</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Tax (18%):</span>
                                <span className="font-medium">{currency}{(order.amount * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t">
                                <span>Total:</span>
                                <span>{currency}{(order.amount * 1.18).toFixed(2)}</span>
                            </div>
                        </div>

                        {order.status === 'Placed' && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => cancelOrder(order._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={`px-6 py-4 ${order.status === 'Cancelled' ? 'bg-red-600' : 'bg-purple-600'} text-white`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm">Receipt Voucher</p>
                                <p className="font-medium">{order._id.substring(0, 8).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm">
                                    {order.status === 'Delivered' ? 'Amount Paid' : 'Total Amount'}
                                </p>
                                <p className="text-2xl font-bold">{currency}{(order.amount * 1.18).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;