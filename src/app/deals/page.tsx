"use client"
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');

  // Sample phone deals data
  const deals = [
    {
      id: 1,
      title: "iPhone 15 Pro",
      brand: "Apple",
      originalPrice: 999,
      discountedPrice: 899,
      discountPercentage: 10,
      specs: {
        storage: "256GB",
        color: "Natural Titanium"
      },
      promoEnds: "2025-02-20",
      image: "https://res.cloudinary.com/dak07ttxh/image/upload/v1738159988/product_image/atji1tcrxe23mu0nvy4p.jpg"
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      originalPrice: 1299,
      discountedPrice: 1099,
      discountPercentage: 15,
      specs: {
        storage: "512GB",
        color: "Titanium Gray"
      },
      promoEnds: "2025-02-15",
      image: "https://res.cloudinary.com/dak07ttxh/image/upload/v1738160379/product_image/an70rqh1kcwwcdcaqwjw.jpg"
    },
    {
      id: 3,
      title: "Google Pixel 8 Pro",
      brand: "Google",
      originalPrice: 999,
      discountedPrice: 799,
      discountPercentage: 20,
      specs: {
        storage: "256GB",
        color: "Bay Blue"
      },
      promoEnds: "2025-02-18",
      image: "https://res.cloudinary.com/dak07ttxh/image/upload/v1739175514/14419d3b-d37a-4e16-813b-c4d20c0ee2a8_nh2tuh.jpg"
    }
  ];

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        deal.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filterBrand === 'all' || deal.brand.toLowerCase() === filterBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-neutral-950 py-12">
      <div className="container mx-auto px-4 mt-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 mb-4">
            Featured Phone Deals
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Discover amazing discounts on premium smartphones from top brands
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search phones..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer"
          >
            <option value="all">All Brands</option>
            <option value="apple">Apple</option>
            <option value="samsung">Samsung</option>
            <option value="google">Google</option>
            <option value="xiaomi">Xiaomi</option>
            <option value="oneplus">OnePlus</option>
          </select>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Glass background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content container */}
              <div className="relative p-6">
                {/* Image Container */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-neutral-900">
                  <img 
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/90 rounded-md">
                    <span className="text-sm font-medium text-white">
                      Save ${(deal.originalPrice - deal.discountedPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Deal details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                    {deal.title}
                  </h3>

                  <div className="text-sm text-neutral-400">
                    {deal.specs.storage} • {deal.specs.color}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-green-400">
                      ${deal.discountedPrice}
                    </span>
                    <span className="text-sm text-neutral-500 line-through">
                      ${deal.originalPrice}
                    </span>
                    <span className="text-sm text-red-400">
                      -{deal.discountPercentage}%
                    </span>
                  </div>

                  {/* Promo end date */}
                  <div className="text-sm text-neutral-500">
                    Offer ends {new Date(deal.promoEnds).toLocaleDateString()}
                  </div>

                  {/* Buy Now Button */}
                  <div className="pt-4">
                    <div className="relative group/btn inline-flex">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300" />
                      <button className="relative flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-lg leading-none">
                        <span className="text-sm text-neutral-300">
                          Buy Now
                        </span>
                        <svg
                          className="w-4 h-4 stroke-neutral-300 transform transition-transform duration-300 group-hover/btn:translate-x-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 5l7 7-7 7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}