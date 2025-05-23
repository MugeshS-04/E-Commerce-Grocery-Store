import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {

    const { axios, navigate } = useAppContext();


    const sidebarLinks = [
        { name: "Add Category", path: "/seller/category",},
        { name: "Add Product", path: "/seller",},
        { name: "Product List", path: "/seller/product-list", },
        { name: "Orders", path: "/seller/orders",},
        { name: "Analytics", path: "/seller/analytics",},
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
        <div className="flex flex-col h-screen bg-gray-50">

  {/* Top Navbar */}
  <header className="sticky top-0 z-30 bg-white shadow border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
    <Link to="/" className="flex items-center gap-3">
      <img className="h-10" src={assets.box_icon} alt="logo" />
      <h1 className="text-xl sm:text-2xl font-semibold text-indigo-600">Nellai Stores</h1>
    </Link>
    
    <div className="flex items-center gap-3 text-gray-600 text-sm">
      <span className="font-medium text-gray-700">Hi, Admin</span>
      <button 
        onClick={logout} 
        className="px-4 py-1.5 border border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 rounded-full text-sm transition duration-200"
      >
        Logout
      </button>
    </div>
  </header>

  {/* Body: Sidebar + Content */}
  <div className="flex flex-1 overflow-hidden">

    {/* Sidebar */}
    <aside className="w-20 sm:w-60 bg-white border-r border-gray-200 shadow-md flex flex-col py-6 px-2 sm:px-4">
      <nav className="space-y-2">
        {sidebarLinks.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.name}
            end={item.path === "/seller"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive 
                ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
                : "hover:bg-gray-100 text-gray-600"}`
            }
          >
            <span className="hidden sm:inline">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
      <Outlet />
    </main>
  </div>
</div>
    );
};

export default SellerLayout;