import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    // Fetch Seller Status
    const fetchSeller = async () => {
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            setIsSeller(data.success);
        } catch (error) {
            setIsSeller(false);
            console.error("Seller auth error:", error.message);
        }
    };

    // Fetch User Auth Status, User Data and Cart Items
    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            }
        } catch (error) {
            setUser(null);
            console.error("User auth error:", error.message);
        }
    };

    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const {data} = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load products");
            console.error("Products fetch error:", error.message);
        }
    };

    // Add Product to Cart
    const addToCart = (itemId) => {
        setCartItems(prev => {
            const newCart = {...prev};
            newCart[itemId] = (newCart[itemId] || 0) + 1;
            return newCart;
        });
        toast.success("Added to Cart");
    };

    // Update Cart Item Quantity
    const updateCartItem = (itemId, quantity) => {
    // Ensure quantity is at least 1
    const newQuantity = Math.max(1, quantity);
    setCartItems(prev => {
        const newCart = {...prev};
        newCart[itemId] = newQuantity;
        return newCart;
    });
    toast.success("Cart Updated");
};

    // Remove Product from Cart
    const removeFromCart = (itemId) => {
        setCartItems(prev => {
            const newCart = {...prev};
            delete newCart[itemId];
            return newCart;
        });
        toast.success("Removed from Cart");
    };

    // Get Cart Item Count
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, count) => total + count, 0);
    };

    // Get Cart Total Amount
     const getCartAmount = () => {
        return parseFloat(Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const product = products.find(p => p._id === itemId);
            if (product && quantity > 0) {
                const price = product.offerPrice ?? product.price ?? 0;
                return total + (price * quantity);
            }
            return total;
        }, 0));
    };

    // Update Database Cart Items
    useEffect(() => {
        const updateCart = async () => {
            try {
                if (user && Object.keys(cartItems).length > 0) {
                    await axios.post('/api/cart/update', {cartItems});
                }
            } catch (error) {
                console.error("Cart update error:", error.message);
            }
        };
        updateCart();
    }, [cartItems, user]);

    // Initial data fetching
    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
    }, []);

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        fetchProducts
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);