import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Tag, PhilippinePeso,
  Users, Loader2, ArrowRight, Info
} from 'lucide-react';
import { format } from 'date-fns';
import { SearchFilterBar, FilterState } from './SearchFilterBar';
import type { PopUpEvent } from '@/types';

export function VendorDashboard() {
  const [events, setEvents] = useState<PopUpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: 'all',
    dateRange: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublishedEvents();
  }, [filters, searchQuery]);

  async function fetchPublishedEvents() {
    try {
      setLoading(true);
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'PUBLISHED')
        .order('start_date', { ascending: true });

      // Apply Search
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location_address.ilike.%${searchQuery}%`);
      }

      // Apply Category
      if (filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      // Apply Price Range
      if (filters.priceRange !== 'all') {
        switch (filters.priceRange) {
          case 'free':
            query = query.eq('booth_price', 0);
            break;
          case 'under_1000':
            query = query.lt('booth_price', 1000); // Changed to lt 1000
            break;
          case '1000_5000':
            query = query.gte('booth_price', 1000).lte('booth_price', 5000);
            break;
          case 'above_5000':
            query = query.gt('booth_price', 5000);
            break;
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Discover Events</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Find the perfect pop-up opportunity for your business.
        </p>
      </div>

      <SearchFilterBar
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
        filters={filters}
      />

      {events.length === 0 ? (
        /* Empty State */
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
            <Calendar className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No events found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            There are currently no published events. Check back soon for new opportunities!
          </p>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {event.images?.[0] ? (
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                    <Calendar size={48} />
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm border border-white/20">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Calendar size={16} className="text-rose-500" />
                    <span>{format(new Date(event.start_date), 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin size={16} className="text-rose-500" />
                    <span className="truncate">{event.location_address.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                      <PhilippinePeso size={16} className="text-green-600" />
                      <span>{event.booth_price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <Users size={16} className="text-blue-500" />
                      <span>{event.spots_available - event.spots_filled} spots left</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <Link
                    to={`/vendor/events/${event.id}`}
                    className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors group/link"
                  >
                    View Details
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                  <Link
                    to={`/vendor/events/${event.id}/apply`}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}