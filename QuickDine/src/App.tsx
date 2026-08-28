import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import About from "./pages/About";
import RestaurantDetail from "./pages/RestaurantDetail";
import BookingConfirmation from "./pages/BookingConfirmation";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1a1c1c",
                        color: "#ffffff",
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                        borderRadius: "4px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
                <Route
                    path="/booking/:slug"
                    element={
                        <ProtectedRoute>
                            <BookingConfirmation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["user", "owner"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/owner/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

