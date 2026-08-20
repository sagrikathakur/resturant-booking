/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { dummyUser, dummyRestaurant, dummyMyBookingsData } from "../assets/assets.ts";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api";

export interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "owner";
}

export interface BookingType {
    _id: string;
    bookingId: string;
    user: any;
    restaurant: any;
    date: string;
    time: string;
    guests: number;
    occasion?: string;
    specialRequests?: string;
    status: "confirmed" | "cancelled" | "completed";
    createdAt?: string;
}

interface AppContextType {
    user: UserType | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, password: string) => Promise<UserType | null>;
    register: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<UserType | null>;
    logout: () => void;
    myBookings: BookingType[];
    addBooking: (bookingData: any) => Promise<boolean>;
    cancelBooking: (bookingId: string) => Promise<boolean>;
    restaurants: any[];
    fetchOwnerStats: (restaurantId: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
    const [myBookings, setMyBookings] = useState<BookingType[]>(dummyMyBookingsData as any);
    const [restaurants, setRestaurants] = useState<any[]>(dummyRestaurant);

    // Synchronize Auth User
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    // Fallback to local storage / dummy user if offline
                    setUser(dummyUser as any);
                }
            } catch {
                // Backend server offline - standard fallback to demo mode
                setUser(dummyUser as any);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Load Restaurants & My Bookings
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Restaurants
                const resRes = await fetch(`${API_BASE_URL}/restaurants`);
                if (resRes.ok) {
                    const resData = await resRes.json();
                    if (resData.length > 0) {
                        setRestaurants(resData);
                    }
                }
            } catch {
                // Use default dummy restaurant list
            }

            if (token) {
                try {
                    const resBookings = await fetch(`${API_BASE_URL}/bookings/my`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (resBookings.ok) {
                        const bookingData = await resBookings.json();
                        setMyBookings(bookingData);
                    }
                } catch {
                    // Keep dummy bookings
                }
            }
        };

        fetchInitialData();
    }, [token]);

    const login = async (email: string, password: string): Promise<UserType | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const userObj: UserType = {
                    _id: data._id || data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role || "user",
                };
                setToken(data.token);
                setUser(userObj);
                localStorage.setItem("token", data.token);
                toast.success(`Welcome back, ${userObj.name}!`);
                return userObj;
            } else {
                const err = await response.json();
                toast.error(err.message || "Failed to login");
            }
        } catch {
            // Fallback for offline local demo run
            const demoUserObj: UserType = {
                _id: dummyUser._id,
                name: dummyUser.name,
                email: dummyUser.email,
                phone: dummyUser.phone,
                role: (dummyUser.role as any) || "user",
            };
            setToken(dummyUser.token);
            setUser(demoUserObj);
            localStorage.setItem("token", dummyUser.token);
            toast.success(`Logged in as ${demoUserObj.name} (Demo Mode)`);
            return demoUserObj;
        }
        return null;
    };

    const register = async (name: string, email: string, password: string, phone?: string, role?: string): Promise<UserType | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone, role }),
            });

            if (response.ok) {
                const data = await response.json();
                const userObj: UserType = {
                    _id: data._id || data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role || (role as any) || "user",
                };
                setToken(data.token);
                setUser(userObj);
                localStorage.setItem("token", data.token);
                toast.success("Account created successfully!");
                return userObj;
            } else {
                const err = await response.json();
                toast.error(err.message || "Registration failed");
            }
        } catch {
            const userObj: UserType = {
                _id: dummyUser._id,
                name: name,
                email: email,
                phone: phone,
                role: (role as any) || "user",
            };
            setToken(dummyUser.token);
            setUser(userObj);
            localStorage.setItem("token", dummyUser.token);
            toast.success("Account created successfully! (Demo Mode)");
            return userObj;
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully");
        window.location.href = "/";
    };

    const addBooking = async (bookingData: any): Promise<boolean> => {
        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/bookings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    const newBooking = await response.json();
                    setMyBookings((prev) => [newBooking, ...prev]);
                    toast.success("Reservation confirmed!");
                    return true;
                }
            } catch {
                // Local state fallback
            }
        }

        // Demo fallback
        const newDummyBooking: BookingType = {
            _id: Date.now().toString(),
            bookingId: "GR-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
            user: user?._id || dummyUser._id,
            restaurant: bookingData.restaurantObj || {
                name: "L'Essence",
                location: "Manhattan, NY",
                address: "115 Greenwich St, New York, NY 10006",
                image: "/restaurant_5.png",
            },
            date: bookingData.date,
            time: bookingData.time,
            guests: bookingData.guests,
            occasion: bookingData.occasion || "",
            specialRequests: bookingData.specialRequests || "",
            status: "confirmed",
            createdAt: new Date().toISOString(),
        };

        setMyBookings((prev) => [newDummyBooking, ...prev]);
        toast.success("Reservation confirmed! (Demo Mode)");
        return true;
    };

    const cancelBooking = async (bookingId: string): Promise<boolean> => {
        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setMyBookings((prev) =>
                        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
                    );
                    toast.success("Reservation cancelled");
                    return true;
                }
            } catch {
                // Local state update
            }
        }

        setMyBookings((prev) =>
            prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
        );
        toast.success("Reservation cancelled");
        return true;
    };

    const fetchOwnerStats = async (restaurantId: string): Promise<any> => {
        try {
            const res = await fetch(`${API_BASE_URL}/stats/owner/${restaurantId}`);
            if (res.ok) {
                return await res.json();
            }
        } catch {
            // Fallback to dummy stats
        }
        return null;
    };

    const value: AppContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
        myBookings,
        addBooking,
        cancelBooking,
        restaurants,
        fetchOwnerStats,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};
