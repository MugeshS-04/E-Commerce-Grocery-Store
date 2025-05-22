import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input 
        className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
)

const AddAddress = () => {
    const { axios, user, navigate } = useAppContext();

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/address/add', { address });
            if (data.success) {
                toast.success(data.message)
                navigate('/cart')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/cart')
        }
    }, [])

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md'>
                <div className='bg-white rounded-xl shadow-md p-8 border border-gray-100'>
                    <div className='text-center mb-8'>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Add <span className='text-indigo-600'>Shipping Address</span>
                        </h1>
                        <div className='w-16 h-1 bg-indigo-600 rounded-full mx-auto mt-3'></div>
                    </div>

                    <form onSubmit={onSubmitHandler} className='space-y-4'>
                        <div className='grid grid-cols-1 gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
                                    <InputField 
                                        handleChange={handleChange} 
                                        address={address} 
                                        name='firstName' 
                                        type="text" 
                                        placeholder="John" 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
                                    <InputField 
                                        handleChange={handleChange} 
                                        address={address} 
                                        name='lastName' 
                                        type="text" 
                                        placeholder="Doe" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <InputField 
                                    handleChange={handleChange} 
                                    address={address} 
                                    name='email' 
                                    type="email" 
                                    placeholder="your@email.com" 
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Street Address</label>
                                <InputField 
                                    handleChange={handleChange} 
                                    address={address} 
                                    name='street' 
                                    type="text" 
                                    placeholder="123 Main St" 
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                                    <InputField 
                                        handleChange={handleChange} 
                                        address={address} 
                                        name='city' 
                                        type="text" 
                                        placeholder="New York" 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                                    <InputField 
                                        handleChange={handleChange} 
                                        address={address} 
                                        name='state' 
                                        type="text" 
                                        placeholder="NY" 
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Zip Code</label>
                                    <InputField 
                                        handleChange={handleChange} 
                                        address={address} 
                                        name='zipcode' 
                                        type="number" 
                                        placeholder="10001" 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Country</label>
                                    <InputField 
                                        handleChange={handleChange} 
                                        address={address} 
                                        name='country' 
                                        type="text" 
                                        placeholder="United States" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                                <InputField 
                                    handleChange={handleChange} 
                                    address={address} 
                                    name='phone' 
                                    type="tel" 
                                    placeholder="+1 234 567 8900" 
                                />
                            </div>

                            <button 
                                type="submit"
                                className='w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow hover:shadow-md transition-all'
                            >
                                Save Address
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddAddress