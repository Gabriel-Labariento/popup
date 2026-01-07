import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { Link } from 'react-router-dom';
import { 
  Clock, CheckCircle2, XCircle, MapPin, 
  Calendar, ArrowRight, Loader2, Inbox,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { UserAuth } from '@/context/AuthContext';

export default function VendorApplicationsPage() {
  const { session } = UserAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user.id) {
      fetchMyApplications();
    }
  }, [session]);

  async function fetchMyApplications() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          event:events (
            id,
            title,
            start_date,
            location_address,
            host:hosts (
              organization_name
            )
          )
        `)
        .eq('vendor_id', session?.user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          icon: <CheckCircle2 className="text-green-500" size={18} />,
          text: 'Accepted',
          classes: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="text-red-500" size={18} />,
          text: 'Declined',
          classes: 'bg-red-50 text-red-700 border-red-200'
        };
      default:
        return {
          icon: <Clock className="text-amber-500" size={18} />,
          text: 'Pending Review',
          classes: 'bg-amber-50 text-amber-700 border-amber-200'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-2">Track the status of your event pitches and upcoming bookings.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
            <Inbox className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No applications yet</h3>
          <p className="text-slate-500 mt-2 mb-6">You haven't applied to any events yet. Ready to grow your business?</p>
          <Link 
            to="/vendor/dashboard" 
            className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
          >
            Find Events to Join
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const status = getStatusDisplay(app.status);
            return (
              <div 
                key={app.id} 
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-rose-200 transition-all overflow-hidden"
              >
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Event Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                       <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${status.classes}`}>
                        {status.icon}
                        {status.text}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Applied {format(new Date(app.applied_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{app.event.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Building2 size={14} className="text-slate-400" />
                          {app.event.host.organization_name}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Calendar size={14} className="text-slate-400" />
                          {format(new Date(app.event.start_date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin size={14} className="text-slate-400" />
                          {app.event.location_address.split(',')[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                    <Link 
                      to={`/vendor/events/${app.event.id}`}
                      className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                    >
                      View Event
                    </Link>
                    
                    {app.status === 'ACCEPTED' && (
                      <Link 
                        to={`/vendor/messages/${app.id}`}
                        className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/10 flex items-center justify-center gap-2"
                      >
                        Message Host
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}