import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  ExternalLink, MessageSquare, Loader2, User 
} from 'lucide-react';
import { format } from 'date-fns';

const ReviewApplicationsPage = () => {
  const { id: eventId } = useParams();
  const [applications, setApplications] = useState<any[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [eventId]);

  async function fetchApplications() {
    try {
      setLoading(true);
      // Fetch applications + nested vendor profile data
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          vendor:vendors (
            business_name,
            logo_url,
            website_url
          )
        `)
        .eq('event_id', eventId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);

      // Also fetch the event title for the header
      const { data: eventData } = await supabase
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single();
      
      if (eventData) setEventTitle(eventData.title);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (applicationId: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING') => {
    try {
      setUpdatingId(applicationId);
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state to reflect the change immediately
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={40} /></div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Link to="/host/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Review Applications</h1>
        <p className="text-slate-500">Event: <span className="font-semibold text-slate-700">{eventTitle}</span></p>
      </div>

      <div className="space-y-6">
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Clock className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No applications received yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              
              {/* Vendor Info Sidebar */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 md:w-64 bg-slate-50/50">
                <div className="flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-full bg-white border border-slate-200 overflow-hidden mb-4 shadow-sm">
                    {app.vendor?.logo_url ? (
                      <img src={app.vendor.logo_url} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300"><User size={32}/></div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900">{app.vendor?.business_name || 'Unknown Business'}</h3>
                  {app.vendor?.website_url && (
                    <a href={app.vendor.website_url} target="_blank" className="text-rose-600 text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                      View Website <ExternalLink size={12} />
                    </a>
                  )}
                  
                  <div className="mt-6 w-full">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border block text-center ${
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 border-green-200' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="p-6 flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Business Pitch</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{app.business_description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Products</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{app.products_offered}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Portfolio</h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {app.portfolio_images?.map((img: string, idx: number) => (
                      <img key={idx} src={img} className="h-20 w-20 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Applied on {format(new Date(app.applied_at), 'MMM dd, yyyy')}</p>
                  
                  <div className="flex gap-3">
                    {app.status === 'PENDING' ? (
                      <>
                        <button 
                          onClick={() => updateStatus(app.id, 'REJECTED')}
                          disabled={!!updatingId}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                        <button 
                          onClick={() => updateStatus(app.id, 'ACCEPTED')}
                          disabled={!!updatingId}
                          className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
                        >
                          {updatingId === app.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                          Accept Vendor
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => updateStatus(app.id, 'PENDING')}
                        className="text-xs text-slate-400 hover:underline"
                      >
                        Reset to Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewApplicationsPage;