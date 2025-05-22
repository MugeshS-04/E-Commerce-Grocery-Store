import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {

    const { axios, navigate } = useAppContext();


    const sidebarLinks = [
        { name: "Add Category", path: "/seller/category", icon: assets.add_icon },
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
        { name: "Analytics", path: "/seller/analytics", icon: assets.order_icon },
    ];

    const logout = async ()=>{
        try {
            const { data } = await axios.get('/api/seller/logout');
            if(data.success){
                toast.success(data.message)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-50">

  {/* Top Navbar */}
  <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm px-6 md:px-10 py-4 flex items-center justify-between rounded-4xl">
    <Link to='/'>
      <div className="flex items-center gap-2">
        <img className="h-12" src={assets.box_icon} alt="logo" />
        <h1 className="text-indigo-600 text-2xl font-bold">Nellai Stores</h1>
      </div>
    </Link>

    <div className="flex items-center gap-4 text-gray-600 text-sm">
      <span className="font-medium text-gray-700">Hi! Admin</span>
      <button 
        onClick={logout} 
        className="px-4 py-1.5 border border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 rounded-full text-sm transition"
      >
        Logout
      </button>
    </div>
  </div>

  {/* Main Layout */}
  <div className="flex flex-1 overflow-hidden">

    {/* Sidebar */}
    <aside className="md:w-64 w-20 bg-white border-r border-gray-200 px-2 pt-6 pb-4 shadow-sm rounded-tr-3xl rounded-br-3xl">
      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.name} 
            end={item.path === "/seller"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-sm
              ${isActive 
                ? "bg-indigo-100 text-indigo-700 font-medium ring-2 ring-indigo-300"
                : "hover:bg-gray-100 text-gray-600"}`
            }
          >
            <img src={item.icon} alt={item.name} className="w-6 h-6" />
            <span className="hidden md:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Main Content Area */}
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>

  </div>
</div>

             
        </>
    );
};

export default SellerLayout;