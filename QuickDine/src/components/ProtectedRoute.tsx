import { useAppContext } from "../context/AppContext";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import Loader from "./Loader";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("user" | "owner")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, loading, setAuthModalOpen } = useAppContext();

    if (loading) {
        return <Loader text="Loading Panel Access..." />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white border border-outline-variant/20 p-10 ambient-shadow rounded-lg flex flex-col items-center">
                    <ShieldAlert size={40} className="text-primary mb-6" />
                    <h2 className="font-display text-2xl text-primary mb-3">Login to Continue</h2>
                    <p className="text-sm text-black/55 mb-8 leading-relaxed">
                        Dashboard access is reserved exclusively for registered Restaurant Owners and Managers.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="w-full bg-primary hover:bg-neutral-800 text-white py-3.5 px-4 text-xs font-medium tracking-widest uppercase focus:outline-none transition-colors cursor-pointer"
                        >
                            AUTHENTICATE
                        </button>
                        <AuthModal />
                    </div>
                </div>
            </div>
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white border border-outline-variant/20 p-10 ambient-shadow rounded-lg flex flex-col items-center">
                    <ShieldAlert size={40} className="text-error mb-6" />
                    <h2 className="font-display text-2xl text-primary mb-3">Access Denied</h2>
                    <p className="text-sm text-black/55 mb-6 leading-relaxed">
                        Dashboard access is reserved exclusively for Restaurant Owners & Managers. Standard user accounts cannot access the dashboard.
                    </p>
                    <Link
                        to="/"
                        className="w-full bg-primary hover:bg-neutral-800 text-white py-3 px-4 text-xs font-medium tracking-widest uppercase text-center transition-colors cursor-pointer"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
