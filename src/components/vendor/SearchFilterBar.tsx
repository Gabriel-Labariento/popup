import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFilterBarProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: FilterState) => void;
    filters: FilterState;
}

export interface FilterState {
    category: string;
    priceRange: string;
    dateRange: string;
}

import { EVENT_CATEGORIES } from '@/constants/categories';

export const CATEGORIES = [
    "All", ...EVENT_CATEGORIES
];

export const PRICE_RANGES = [
    { label: "Any Price", value: "all" },
    { label: "Free", value: "free" },
    { label: "Under ₱1,000", value: "under_1000" },
    { label: "₱1,000 - ₱5,000", value: "1000_5000" },
    { label: "Above ₱5,000", value: "above_5000" },
];

export function SearchFilterBar({ onSearch, onFilterChange, filters }: SearchFilterBarProps) {
    const [showFilters, setShowFilters] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        onSearch(searchTerm);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(searchTerm);
        }
    };

    const handleFilterUpdate = (key: keyof FilterState, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({ category: 'All', priceRange: 'all', dateRange: 'all' });
        setSearchTerm('');
        onSearch('');
    };

    const activeFilterCount = (filters.category !== 'All' ? 1 : 0) + (filters.priceRange !== 'all' ? 1 : 0);

    return (
        <div className="w-full space-y-4 mb-8">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search events..." // shortened placeholder to save space
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <button
                    onClick={handleSearchClick}
                    className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-sm"
                >
                    Search
                </button>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl border font-medium flex items-center gap-2 transition-colors ${showFilters || activeFilterCount > 0
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    <SlidersHorizontal size={20} />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-rose-600 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full ml-1">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Filter Events</h3>
                        <button onClick={clearFilters} className="text-xs text-rose-600 font-bold hover:underline">
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterUpdate('category', e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === "All" ? cat : cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price Range</label>
                            <select
                                value={filters.priceRange}
                                onChange={(e) => handleFilterUpdate('priceRange', e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                            >
                                {PRICE_RANGES.map(range => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
