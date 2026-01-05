import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, MoreVertical, Edit2, Copy, Trash2, 
  Users, Calendar, MapPin, Loader2, ExternalLink,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import type { PopUpEvent } from '@/types';
import { format } from 'date-fns'; 

const HostEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PopUpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          applications:applications(count)
        `)
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDuplicate = async (event: PopUpEvent) => {
    const { id, spots_filled, ...eventData } = event;
    const { error } = await supabase.from('events').insert([{
      ...eventData,
      title: `${eventData.title} (Copy)`,
      status: 'DRAFT',
      spots_filled: 0
    }]);

    if (!error) fetchEvents();
    else alert("Failed to duplicate event");
  };

  const handleDelete = async (event: PopUpEvent) => {
    if (event.spots_filled > 0) {
      alert("Cannot delete event with confirmed vendors. Close the event instead.");
      return;
    }

    if (confirm("Are you sure you want to delete this event? This cannot be undone.")) {
      const { error } = await supabase.from('events').delete().eq('id', event.id);
      if (!error) fetchEvents();
    }
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

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p className="text-2xl font-bold text-slate-900">{events.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Spots</p>
          <p className="text-2xl font-bold text-green-600">
            {events.reduce((acc, e) => acc + (e.spots_available - e.spots_filled), 0)}
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
              {filteredEvents.length > 0 ? filteredEvents.map((event: any) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {event.images?.[0] ? (
                          <img src={event.images[0]} className="h-full w-full object-cover" />
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
                            <MapPin size={12} /> {event.location_address.split(',')[0]}
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
                      to={`/host/events/${event.id}/applications`} 
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
    </div>
  );
};

export default HostEventsPage;