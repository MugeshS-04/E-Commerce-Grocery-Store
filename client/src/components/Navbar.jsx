import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios} = useAppContext();

    const logout = async ()=>{
      try {
        const { data } = await axios.get('/api/user/logout')
        if(data.success){
          toast.success(data.message)
          setUser(null);
          navigate('/')
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    useEffect(()=>{
      if(searchQuery.length > 0){
        navigate("/products")
      }
    },[searchQuery])

  return (
    <>
      {/* Spacer to push content down (same height as navbar + margin) */}
      <div className="h-20"></div>
      
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 md:px-8 lg:px-10 py-3 bg-white rounded-full shadow-lg z-50 w-[95%] max-w-6xl border border-gray-200 transition-all">

        <NavLink to='/' onClick={()=> setOpen(false)}>
          <div className="flex gap-2 items-center justify-center whitespace-nowrap">
            <img className="h-10" src={assets.box_icon} alt="logo" />
            <h1 className="text-indigo-600 text-2xl font-bold hidden sm:block">Nellai Stores</h1>
          </div>
        </NavLink>

        <div className="hidden sm:flex items-center gap-6">
          <NavLink 
            to='/' 
            className={({isActive}) => `px-3 py-1.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Home
          </NavLink>
          <NavLink 
            to='/products' 
            className={({isActive}) => `px-3 py-1.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Products
          </NavLink>
          <NavLink 
            to='/contact' 
            className={({isActive}) => `px-3 py-1.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Contact
          </NavLink>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input 
              onChange={(e)=> setSearchQuery(e.target.value)} 
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
              type="text" 
              placeholder="Search products" 
            />
            <img src={assets.search_icon} alt='search' className='w-4 h-4'/>
          </div>

          <div onClick={()=> navigate("/cart")} className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100">
            <img src={assets.nav_cart_icon} alt='cart' className='w-5 opacity-80'/>
            <button className="absolute -top-1 -right-1 text-xs text-white bg-indigo-600 w-4 h-4 rounded-full flex items-center justify-center">
              {getCartCount()}
            </button>
          </div>

          {!user ? ( 
            <button 
              onClick={()=> setShowUserLogin(true)} 
              className="cursor-pointer px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium"
            >
              Login
            </button>
          ) : (
            <div className='relative group'>
              <div className='p-1 rounded-full hover:bg-gray-100 cursor-pointer'>
                <img src={assets.profile_icon} className='w-8' alt="" />
              </div>
              <ul className='hidden group-hover:block absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2 w-40 rounded-xl text-sm z-40'>
                <li 
                  onClick={()=> {
                    navigate("my-orders");
                    setOpen(false);
                  }} 
                  className='px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700 hover:text-indigo-700'
                >
                  My Orders
                </li>
                <li 
                  onClick={logout} 
                  className='px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700 hover:text-indigo-700'
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className='flex items-center gap-4 sm:hidden'>
          <div onClick={()=> navigate("/cart")} className="relative cursor-pointer p-1.5 rounded-full hover:bg-gray-100">
            <img src={assets.nav_cart_icon} alt='cart' className='w-5 opacity-80'/>
            <button className="absolute -top-1 -right-1 text-[10px] text-white bg-indigo-600 w-4 h-4 rounded-full flex items-center justify-center">
              {getCartCount()}
            </button>
          </div>
          <button 
            onClick={() => open ? setOpen(false) : setOpen(true)} 
            aria-label="Menu" 
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            {!open ? <img src={assets.menu_icon} alt='menu' className='w-5'/> : <img src={assets.cancel} className='w-5' alt='cancel'/>}
          </button>
        </div>
        
        {open && (
          <div className={`${open ? 'flex' : 'hidden'} absolute top-14 right-4 bg-white shadow-xl py-3 flex-col items-start gap-1 px-4 text-sm rounded-xl z-20 w-48`}>
            <NavLink 
              to="/" 
              onClick={()=> setOpen(false)}
              className={({isActive}) => `w-full px-4 py-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/products" 
              onClick={()=> setOpen(false)}
              className={({isActive}) => `w-full px-4 py-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
            >
              Products
            </NavLink>
            {user && 
              <NavLink 
                to="/my-orders" 
                onClick={()=> setOpen(false)}
                className={({isActive}) => `w-full px-4 py-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              >
                My Orders
              </NavLink>
            }
            <NavLink 
              to="/contact" 
              onClick={()=> setOpen(false)}
              className={({isActive}) => `w-full px-4 py-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
            >
              Contact
            </NavLink>

            {!user ? (
              <button 
                onClick={()=>{
                  setOpen(false);
                  setShowUserLogin(true);
                }} 
                className="w-full mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg text-sm"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={logout} 
                className="w-full mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg text-sm"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar