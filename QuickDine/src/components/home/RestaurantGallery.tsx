import { useState } from "react";
import { Camera, Eye, MapPin, Sparkles } from "lucide-react";
import { assets } from "../../assets/assets";

export default function RestaurantGallery() {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const restaurantPhotos = [
        {
            id: 1,
            title: "L'Essence Fine Dining",
            cuisine: "French Haute Cuisine",
            location: "Greenwich St, Manhattan",
            src: "/restaurant_5.png",
            alt: "L'Essence Candlelit Dining Chamber"
        },
        {
            id: 2,
            title: "Terraza Cielo Rooftop",
            cuisine: "Italian & Botanical Cocktails",
            location: "Fifth Ave Rooftop, NY",
            src: "/restaurant_3.jpg",
            alt: "Terraza Cielo Rooftop Oasis"
        },
        {
            id: 3,
            title: "Kuro Omakase Bar",
            cuisine: "Japanese Sushi Omakase",
            location: "Orchard St, Manhattan",
            src: "/restaurant_2.jpg",
            alt: "Kuro Omakase Basalt Counter"
        },
        {
            id: 4,
            title: "Flora Garden Glasshouse",
            cuisine: "Organic Plant-Based",
            location: "Grand St, NY",
            src: "/restaurant_6.png",
            alt: "Flora Garden Conservatory"
        },
        {
            id: 5,
            title: "Ember Grille Steakhouse",
            cuisine: "Dry-Aged Wood-Fired Cut",
            location: "Bowery, Manhattan",
            src: "/restaurant_1.png",
            alt: "Ember Grille Steakhouse Room"
        },
        {
            id: 6,
            title: "L'Artiste Tasting Room",
            cuisine: "Modern Michelin French",
            location: "Mercer St, NY",
            src: "/restaurant_4.png",
            alt: "L'Artiste Avant-Garde Room"
        },
        {
            id: 7,
            title: "DimSum Signature Ambience",
            cuisine: "Luxury Dining Suite",
            location: "Manhattan Central",
            src: assets.default_restaurant_img,
            alt: "Default Premium Restaurant Setting"
        },
        {
            id: 8,
            title: "La Riviera Lounge",
            cuisine: "Mediterranean Coastal",
            location: "Hudson Yards, NY",
            src: "/restaurant_7.png",
            alt: "La Riviera Lounge Space"
        }
    ];

    return (
        <section className="py-20 bg-white border-t border-outline-variant/10">
            <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
                {/* Eyebrow & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/10 pb-8">
                    <div className="space-y-2 text-left">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary tracking-widest uppercase bg-secondary/10 px-3 py-1 rounded-full">
                            <Camera size={14} /> RESTAURANT PHOTO GALLERY
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary">
                            Explore Available Venue Photography
                        </h2>
                        <p className="text-xs text-black/55 max-w-xl">
                            Visual previews of our hand-picked restaurant partners, featuring dark velvet dining chambers, rooftop skyline gardens, and omakase counters.
                        </p>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {restaurantPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            onClick={() => setSelectedPhoto(photo.src)}
                            className="group relative bg-surface border border-outline-variant/20 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-72"
                        >
                            {/* Photo Image */}
                            <div className="relative flex-1 overflow-hidden">
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = assets.default_restaurant_img;
                                    }}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                {/* Eye Preview Hover Badge */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                                    <span className="inline-flex items-center gap-1.5 text-white bg-primary/90 px-3.5 py-2 text-xs font-medium tracking-wider uppercase rounded-sm shadow-md">
                                        <Eye size={14} /> Preview Photo
                                    </span>
                                </div>
                            </div>

                            {/* Caption Footer */}
                            <div className="p-4 bg-white border-t border-outline-variant/10 text-left space-y-1">
                                <h3 className="font-display text-sm font-semibold text-primary truncate group-hover:text-secondary transition-colors">
                                    {photo.title}
                                </h3>
                                <div className="flex justify-between items-center text-[10px] text-black/55">
                                    <span className="font-medium text-secondary">{photo.cuisine}</span>
                                    <span className="flex items-center gap-1"><MapPin size={10} /> {photo.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Lightbox for Full Photo Preview */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative max-w-4xl w-full bg-black rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/60 p-2 rounded-full cursor-pointer z-10"
                        >
                            ✕
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="Full View"
                            className="w-full max-h-[80vh] object-contain mx-auto"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
