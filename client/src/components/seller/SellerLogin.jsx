import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            const { data } = await axios.post('/api/seller/login', { email, password })
            if (data.success) {
                setIsSeller(true)
                toast.success("Login successful!");
                navigate('/seller')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isSeller) {
            navigate("/seller")
        }
    }, [isSeller])

    return !isSeller && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-indigo-600 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <img src={assets.box_icon} alt="Logo" className="h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Seller <span className="text-indigo-200">Portal</span>
                        </h2>
                        <p className="text-indigo-100 mt-1">Access your seller dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seller@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Sign in to your account
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 text-center">
                        <p className="text-xs text-gray-500">
                            Don't have an account?{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Contact admin
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerLogin