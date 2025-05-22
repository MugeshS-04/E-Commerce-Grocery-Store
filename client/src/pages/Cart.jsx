import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const { products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems } = useAppContext();
    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            if (product) {
                tempArray.push({
                    ...product,
                    quantity: cartItems[key]
                });
            }
        }
        setCartArray(tempArray);
    };

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please select an address");
            }

            const orderData = {
                userId: user?._id,
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id
            };

            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/order/cod', orderData);
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post('/api/order/stripe', orderData);
                if (data.success) {
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user]);

    if (!products.length || !cartItems) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items Section */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Your Cart <span className="text-indigo-600 text-sm font-medium">({getCartCount()} items)</span>
                            </h1>
                            <button 
                                onClick={() => { navigate("/products"); window.scrollTo(0, 0); }} 
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"
                            >
                                Continue Shopping
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="divide-y divide-gray-200">
                            {cartArray.map((product) => (
                                <div key={product._id} className="py-4 flex flex-col sm:flex-row gap-4">
                                    <div 
                                        onClick={() => {
                                            navigate(`/products/${product.category?.toLowerCase()}/${product._id}`); 
                                            window.scrollTo(0, 0);
                                        }} 
                                        className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                                    >
                                        <img 
                                            className="w-full h-full object-contain" 
                                            src={product.image?.[0] || assets.placeholder} 
                                            alt={product.name} 
                                        />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Weight: {product.weight || "N/A"}</p>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(product._id)} 
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">Qty:</span>
                                                <select 
                                                    onChange={e => updateCartItem(product._id, Number(e.target.value))}  
                                                    value={cartItems[product._id]} 
                                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <p className="text-lg font-semibold text-indigo-600">
                                                {currency}{(product.offerPrice || product.price) * (product.quantity || 1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                        
                        {/* Delivery Address */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Delivery Address</h3>
                                <button 
                                    onClick={() => setShowAddress(!showAddress)} 
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    Change
                                </button>
                            </div>
                            
                            <div className="relative">
                                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                    {selectedAddress ? (
                                        <p className="text-sm text-gray-700">
                                            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">No address selected</p>
                                    )}
                                </div>
                                
                                {showAddress && (
                                    <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                                        {addresses.map((address) => (
                                            <div 
                                                key={address._id}
                                                onClick={() => {
                                                    setSelectedAddress(address); 
                                                    setShowAddress(false);
                                                }} 
                                                className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                <p className="text-sm text-gray-700">
                                                    {address.street}, {address.city}, {address.state}, {address.country}
                                                </p>
                                            </div>
                                        ))}
                                        <div 
                                            onClick={() => navigate("/add-address")} 
                                            className="p-3 text-center text-indigo-600 hover:bg-indigo-50 cursor-pointer font-medium text-sm"
                                        >
                                            + Add new address
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Payment Method</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="COD" 
                                        checked={paymentOption === "COD"}
                                        onChange={() => setPaymentOption("COD")}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Cash on Delivery</p>
                                        <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="Online" 
                                        checked={paymentOption === "Online"}
                                        onChange={() => setPaymentOption("Online")}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Online Payment</p>
                                        <p className="text-xs text-gray-500">Pay with credit/debit card</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{currency}{getCartAmount()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (2%)</span>
                                    <span className="font-medium">{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-3">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-indigo-600">
                                    {currency}{(getCartAmount() + (getCartAmount() * 0.02)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button 
                            onClick={placeOrder} 
                            disabled={!selectedAddress}
                            className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors ${!selectedAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                        >
                            {paymentOption === "COD" ? "Place Order" : "Proceed to Payment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;