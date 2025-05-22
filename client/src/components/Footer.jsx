import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <div className="mt-24 mb-12 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="bg-indigo-50 rounded-2xl shadow-sm">
                {/* Main Footer Content */}
                <div className="px-8 py-12 md:px-12 lg:px-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Brand Logo and Tagline */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-3">
                                <img className="h-10" src={assets.box_icon} alt="logo" />
                                <h1 className="text-2xl font-bold text-indigo-800">Nellai Stores</h1>
                            </div>
                            <p className="mt-4 text-center md:text-left max-w-md text-indigo-600">
                                Fresh groceries delivered to your doorstep with care.
                            </p>
                        </div>

                        {/* Simple Links */}
                        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
                            <div>
                                <h3 className="font-semibold text-indigo-800 mb-3">Quick Links</h3>
                                <ul className="space-y-2 text-indigo-600">
                                    <li><a href="/" className="hover:underline hover:text-indigo-800">Home</a></li>
                                    <li><a href="/products" className="hover:underline hover:text-indigo-800">Products</a></li>
                                    <li><a href="/contact" className="hover:underline hover:text-indigo-800">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-indigo-800 mb-3">Help</h3>
                                <ul className="space-y-2 text-indigo-600">
                                    <li><a href="/faq" className="hover:underline hover:text-indigo-800">FAQs</a></li>
                                    <li><a href="/shipping" className="hover:underline hover:text-indigo-800">Shipping</a></li>
                                    <li><a href="/returns" className="hover:underline hover:text-indigo-800">Returns</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="bg-indigo-100 rounded-b-2xl py-4 px-8">
                    <p className="text-center text-sm text-indigo-600">
                        © {new Date().getFullYear()} Nellai Stores. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;