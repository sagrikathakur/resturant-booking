import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
    const { user, logout, setAuthModalOpen } = useAppContext();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu and dropdowns when location changes
    useEffect(() => {
        (() => setMobileMenuOpen(false))();
        (() => setDropdownOpen(false))();
    }, [location]);

    const handleDashboardClick = () => {
        if (!user) {
            setAuthModalOpen(true);
        } else if (user.role === "owner") {
            navigate("/owner/dashboard");
        } else {
            navigate("/dashboard");
        }
    };

    // Determine if transparent navbar applies (Home page and About page when top of page)
    const isDarkHeroPage = location.pathname === "/" || location.pathname === "/about";
    const isTransparent = isDarkHeroPage && !scrolled;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isTransparent
                    ? "bg-transparent h-20 border-b border-white/10"
                    : "bg-white/95 backdrop-blur-md h-16 shadow-sm border-b border-outline-variant/10"
            }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-6 md:px-10">
                {/* Logo */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className={`h-8.5 transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
                        />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex gap-8 items-center">
                        <Link
                            to="/"
                            className={`text-xs font-medium tracking-wider uppercase transition-colors pb-1 border-b-2 cursor-pointer ${
                                location.pathname === "/"
                                    ? isTransparent
                                        ? "text-white border-white font-semibold"
                                        : "text-primary border-primary font-semibold"
                                    : isTransparent
                                    ? "text-white/80 hover:text-white border-transparent"
                                    : "text-black/60 hover:text-primary border-transparent"
                            }`}
                        >
                            Discover
                        </Link>
                        <Link
                            to="/search"
                            className={`text-xs font-medium tracking-wider uppercase transition-colors pb-1 border-b-2 cursor-pointer ${
                                location.pathname.startsWith("/search")
                                    ? isTransparent
                                        ? "text-white border-white font-semibold"
                                        : "text-primary border-primary font-semibold"
                                    : isTransparent
                                    ? "text-white/80 hover:text-white border-transparent"
                                    : "text-black/60 hover:text-primary border-transparent"
                            }`}
                        >
                            Restaurants
                        </Link>
                        <Link
                            to="/about"
                            className={`text-xs font-medium tracking-wider uppercase transition-colors pb-1 border-b-2 cursor-pointer ${
                                location.pathname === "/about"
                                    ? isTransparent
                                        ? "text-white border-white font-semibold"
                                        : "text-primary border-primary font-semibold"
                                    : isTransparent
                                    ? "text-white/80 hover:text-white border-transparent"
                                    : "text-black/60 hover:text-primary border-transparent"
                            }`}
                        >
                            About Us
                        </Link>

                        {user && (
                            <button
                                onClick={handleDashboardClick}
                                className={`text-xs font-medium tracking-wider uppercase transition-colors pb-1 border-b-2 cursor-pointer text-left ${
                                    location.pathname.includes("dashboard")
                                        ? isTransparent
                                            ? "text-white border-white font-semibold"
                                            : "text-primary border-primary font-semibold"
                                        : isTransparent
                                        ? "text-white/80 hover:text-white border-transparent"
                                        : "text-black/60 hover:text-primary border-transparent"
                                }`}
                            >
                                Dashboard
                            </button>
                        )}
                    </div>
                </div>

                {/* Auth Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center gap-2.5 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                                    isTransparent ? "text-white" : "text-primary"
                                }`}
                            >
                                <span
                                    className={`size-8 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-colors ${
                                        isTransparent
                                            ? "bg-white/20 text-white border border-white/30"
                                            : "bg-black/5 text-primary border border-black/10"
                                    }`}
                                >
                                    {user.name.charAt(0)}
                                </span>
                                <span className="max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-outline-variant/30 ambient-shadow rounded-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2.5 border-b border-outline-variant/10">
                                        <p className="text-xs font-semibold text-primary truncate">{user.name}</p>
                                        <p className="text-[11px] text-black/55 truncate">{user.email}</p>
                                        <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 mt-1 bg-surface rounded text-primary">
                                            Role: {user.role}
                                        </span>
                                    </div>

                                    {user && (
                                        <button
                                            onClick={handleDashboardClick}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-black/60 hover:text-primary hover:bg-surface transition-colors cursor-pointer text-left"
                                        >
                                            <LayoutDashboard size={14} />
                                            Dashboard
                                        </button>
                                    )}

                                    {user.role === "owner" && (
                                        <Link
                                            to="/owner/dashboard"
                                            className="flex items-center gap-3 px-4 py-2.5 text-xs text-black/60 hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                                        >
                                            <ShieldCheck size={14} />
                                            Owner Panel
                                        </Link>
                                    )}

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-error hover:bg-error-container/20 transition-colors border-t border-outline-variant/10 text-left cursor-pointer"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className={`text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                                    isTransparent ? "text-white/90 hover:text-white" : "text-black/60 hover:text-primary"
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className={`text-xs font-medium tracking-wider uppercase px-5 py-2.5 transition-all duration-300 cursor-pointer rounded-sm ${
                                    isTransparent
                                        ? "bg-white/10 backdrop-blur-md text-white border border-white/40 hover:bg-white hover:text-black"
                                        : "bg-primary text-white hover:bg-neutral-800"
                                }`}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 transition-colors cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-outline-variant/20 py-6 px-6 z-50 ambient-shadow flex flex-col gap-5 animate-in slide-in-from-top duration-300">
                    <Link to="/" className="text-base text-on-surface hover:text-primary">
                        Discover
                    </Link>
                    <Link to="/search" className="text-base text-on-surface hover:text-primary">
                        Restaurants
                    </Link>
                    <Link to="/about" className="text-base text-on-surface hover:text-primary">
                        About Us
                    </Link>
                    {user && (
                        <button
                            onClick={handleDashboardClick}
                            className="text-base text-on-surface hover:text-primary text-left cursor-pointer"
                        >
                            Dashboard
                        </button>
                    )}

                    <div className="border-t border-outline-variant/10 my-2"></div>

                    {user ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-primary text-sm font-semibold uppercase">
                                    {user.name.charAt(0)}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-primary">{user.name}</p>
                                    <p className="text-xs text-black/55">{user.email}</p>
                                    <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 mt-0.5 bg-surface rounded text-primary">
                                        Role: {user.role}
                                    </span>
                                </div>
                            </div>
                            {user.role === "owner" && (
                                <Link to="/owner/dashboard" className="text-sm font-medium text-black/60 hover:text-primary">
                                    Owner Portal
                                </Link>
                            )}
                            <button onClick={logout} className="text-sm font-medium text-error text-left cursor-pointer">
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="w-full border border-outline-variant/50 text-center py-3 text-sm font-medium hover:border-primary cursor-pointer"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="w-full bg-primary text-white text-center py-3 text-xs font-medium tracking-widest uppercase hover:bg-neutral-800 cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
