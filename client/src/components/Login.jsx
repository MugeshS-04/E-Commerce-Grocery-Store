import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const {setShowUserLogin, setUser, axios, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            
            const {data} = await axios.post(`/api/user/${state}`, {
                name, email, password
            });
            
            if (data.success) {
                navigate('/')
                setUser(data.user)
                setShowUserLogin(false)
                toast.success(`Welcome ${data.user.name || ''}!`, {
                    icon: '👋',
                });
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
            <form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className="flex flex-col gap-5 w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl border border-indigo-100 bg-white"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-indigo-600">
                        {state === "login" ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {state === "login" ? "Login to continue" : "Join us today"}
                    </p>
                </div>

                {state === "register" && (
                    <div className="w-full space-y-1">
                        <label className="text-gray-700 font-medium">Full Name</label>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="John Doe" 
                            className="border border-indigo-100 rounded-lg w-full p-3 mt-1 outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                            type="text" 
                            required 
                        />
                    </div>
                )}

                <div className="w-full space-y-1">
                    <label className="text-gray-700 font-medium">Email Address</label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="your@email.com" 
                        className="border border-indigo-100 rounded-lg w-full p-3 mt-1 outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                        type="email" 
                        required 
                    />
                </div>

                <div className="w-full space-y-1">
                    <label className="text-gray-700 font-medium">Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="••••••••" 
                        className="border border-indigo-100 rounded-lg w-full p-3 mt-1 outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                        type="password" 
                        required 
                        minLength="6"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className={`mt-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-lg font-medium cursor-pointer transition-all flex items-center justify-center ${isLoading ? 'opacity-80' : ''}`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        state === "register" ? "Sign Up" : "Login"
                    )}
                </button>

                <div className="text-center text-sm text-gray-500 mt-2">
                    {state === "register" ? (
                        <p>
                            Already have an account?{' '}
                            <button 
                                type="button"
                                onClick={() => setState("login")} 
                                className="text-indigo-600 font-medium hover:underline focus:outline-none"
                            >
                                Login here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{' '}
                            <button 
                                type="button"
                                onClick={() => setState("register")} 
                                className="text-indigo-600 font-medium hover:underline focus:outline-none"
                            >
                                Sign up
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Login