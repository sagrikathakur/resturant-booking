/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import Hero from "../components/home/Hero";
import CuisineBrowse from "../components/home/CuisineBrowse";
import TrendingRow from "../components/home/TrendingRow";
import RestaurantGallery from "../components/home/RestaurantGallery";
import MembershipSection from "../components/home/MembershipSection";
import NewsletterCTA from "../components/home/NewsletterCTA";
import { dummyFeaturedRestaurants } from "../assets/assets.ts";

export default function Home() {
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            setTrending(dummyFeaturedRestaurants);
            setLoading(false);
        };
        fetchTrending();
    }, []);

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-0">
            <Navbar />
            <AuthModal />
            <main className="flex-1">
                <Hero />
                <CuisineBrowse />
                <TrendingRow trending={trending} loading={loading} />
                <RestaurantGallery />
                <MembershipSection />
                <NewsletterCTA />
            </main>
            <Footer />
        </div>
    );
}
