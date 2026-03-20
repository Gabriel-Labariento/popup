import React, { useEffect, useState, useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase/client/supabase';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Edit2, Copy, Trash2,
  Users, Calendar, MapPin, Loader2,
  Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { PopUpEvent } from '@/types';
import { format } from 'date-fns';

const HostEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Partial<PopUpEvent>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [eventToDelete, setEventToDelete] = useState<PopUpEvent | null>(null);
  const PAGE_SIZE = 10;

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('events')
        .select(`
          id, title, start_date, location_address, status, spots_filled, spots_available, images, created_at,
          applications:applications(count)
        `, { count: 'exact' })
        .eq('host_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, count, error } = await query;

      if (error) throw error;
      setEvents(data || []);
      setTotalCount(count || 0);
    } catch (_error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [page, searchQuery, fetchEvents]);

  const handleDuplicate = async (event: Partial<PopUpEvent>) => {
    if (!event.id) return;

    // Fetch full event details since list view only has partial data
    const { data: fullEvent, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event.id)
      .single();

    if (fetchError || !fullEvent) {
      toast.error("Failed to fetch event details for duplication");
      return;
    }

    const { id: _id, spots_filled: _spots_filled, created_at: _created_at, ...eventData } = fullEvent;
    const { error } = await supabase.from('events').insert([{
      ...eventData,
      title: `${eventData.title} (Copy)`,
      status: 'DRAFT',
      spots_filled: 0
    }]);

    if (!error) {
      toast.success("Event duplicated successfully");
      fetchEvents();
    } else {
      toast.error("Failed to duplicate event");
    }
  };

  const handleDelete = async (event: PopUpEvent) => {
    if (event.spots_filled > 0) {
      toast.error("Cannot delete event with confirmed vendors. Close the event instead.");
      return;
    }

    setEventToDelete(event);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    const { error } = await supabase.from('events').delete().eq('id', eventToDelete.id);
    if (!error) {
      toast.success("Event deleted successfully");
      fetchEvents();
    } else {
      toast.error(error.message);
    }
    setEventToDelete(null);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-700 border-green-200';
      case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'CLOSED': return 'bg-red-100 text-red-700 border-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-rose-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Events</h1>
          <p className="text-slate-500">Manage your event listings and vendor applications</p>
        </div>
        <Link
          to="/host/events/create"
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
        >
          <Plus size={20} />
          Create New Event
        </Link>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Events</p>
          <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Spots</p>
          <p className="text-2xl font-bold text-green-600">
            {events.reduce((acc, e) => acc + ((e.spots_available || 0) - (e.spots_filled || 0)), 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Applications</p>
          <p className="text-2xl font-bold text-rose-600">
            {/* Note: This requires a join count which we added in fetchEvents */}
            {events.reduce((acc, e: any) => acc + (e.applications?.[0]?.count || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search events by name..."
            className="w-full pl-10 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Events Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Event Detail</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Spots</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Applications</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.length > 0 ? events.map((event: any) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {event.images?.[0] ? (
                          <img src={event.images![0]} className="h-full w-full object-cover" loading="lazy" alt={event.title || "Event"} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <Calendar size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{event.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {format(new Date(event.start_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {event.location_address?.split(',')[0] || 'No location'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-700">{event.spots_filled} / {event.spots_available}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${(event.spots_filled / event.spots_available) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/host/events/${event.id}/review`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                    >
                      <Users size={14} />
                      {event.applications?.[0]?.count || 0} New
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => navigate(`/host/events/edit/${event.id}`)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Edit Event"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(event)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Duplicate Event"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Event"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar size={48} className="text-slate-200" />
                      <p className="text-slate-500 font-medium">No events found matching your search.</p>
                      <Link to="/host/events/create" className="text-rose-600 font-bold hover:underline">
                        Post your first event now
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalCount > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{events.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}</span> to <span className="font-medium">{Math.min(page * PAGE_SIZE, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              "{eventToDelete?.title}" and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HostEventsPage;