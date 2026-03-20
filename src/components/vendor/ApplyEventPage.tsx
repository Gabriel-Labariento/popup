import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import {
  ArrowLeft, Store, MessageSquare, Image as ImageIcon, Plus,
  Trash2, Loader2, Send, ToolCase
} from 'lucide-react';
import { UserAuth } from '@/context/AuthContext';
import { useStorage } from '@/hooks/useStorage';

const ApplyEventPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { session } = UserAuth();
  const { uploadImages, uploading } = useStorage('event-images');

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    business_description: '',
    products_offered: '',
    booth_requirements: '',
    special_requests: '',
    portfolio_images: [] as string[]
  });

  const fetchEventDetails = useCallback(async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      const { data: hostData, error: hostError } = await supabase
        .from('hosts')
        .select('organization_name, user_id')
        .eq('user_id', eventData.host_id)
        .single();

      if (hostError && hostError.code !== 'PGRST116') throw hostError;

      setEvent({ ...eventData, host: hostData });
    } catch (_error) {
      navigate('/vendor/dashboard');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId, fetchEventDetails]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!session?.user) return;

    const files = Array.from(e.target.files || []);
    if (files.length + formData.portfolio_images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const urls = await uploadImages(files, session.user.id);
    if (urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        portfolio_images: [...prev.portfolio_images, ...urls]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setSubmitting(true);
    try {
      // Check for duplicate application
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('vendor_id', session.user.id);

      if (count && count > 0) {
        toast.error("You have already applied to this event");
        navigate('/vendor/applications');
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert([{
          event_id: eventId,
          vendor_id: session.user.id,
          business_description: formData.business_description,
          products_offered: formData.products_offered,
          booth_requirements: formData.booth_requirements,
          special_requests: formData.special_requests,
          portfolio_images: formData.portfolio_images,
          status: 'PENDING'
        }]);

      if (error) throw error;

      toast.success("Application submitted successfully!");
      navigate('/vendor/applications');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={48} /></div>;

  const isDeadlinePassed = event?.application_deadline && new Date(event.application_deadline) < new Date();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to={`/vendor/dashboard`} className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Discover
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Event Header Summary */}
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <p className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">Applying for</p>
          <h1 className="text-2xl font-bold text-slate-900">{event?.title}</h1>
          <p className="text-slate-500 text-sm">Hosted by {event?.host?.organization_name}</p>
        </div>

        {isDeadlinePassed ? (
          <div className="p-10 text-center">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store size={32} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Applications Closed</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              The application deadline for this event was on <span className="font-semibold text-slate-700">{new Date(event.application_deadline).toLocaleDateString()}</span>.
              You can no longer submit an application.
            </p>
            <Link to="/vendor/dashboard" className="inline-block mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Browse Other Events
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-8">

            {/* Section 1: Business Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Store size={20} className="text-rose-500" /> Business Pitch
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tell us about your business</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="What makes your business unique?"
                  value={formData.business_description}
                  onChange={e => setFormData({ ...formData, business_description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">What will you be selling/offering?</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="List your main products or services..."
                  value={formData.products_offered}
                  onChange={e => setFormData({ ...formData, products_offered: e.target.value })}
                />
              </div>
            </div>

            {/* Section 2: Logistics */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <ToolCase size={20} className="text-rose-500" /> Booth & Logistics
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Booth Requirements</label>
                <textarea
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="Do you need specific space, power, or layout? (e.g. 2x2m corner)"
                  value={formData.booth_requirements}
                  onChange={e => setFormData({ ...formData, booth_requirements: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Portfolio Images */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <ImageIcon size={20} className="text-rose-500" /> Portfolio (Max 5)
              </h2>
              <p className="text-xs text-slate-500">Upload photos of your products or previous booth setups.</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {formData.portfolio_images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={url} className="w-full h-full object-cover" alt="Portfolio image" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, portfolio_images: formData.portfolio_images.filter((_, idx) => idx !== i) })}
                      className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {formData.portfolio_images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <Plus className="text-slate-400" />
                    <input type="file" hidden accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
              {uploading && <p className="text-xs text-rose-600 animate-pulse">Uploading images...</p>}
            </div>

            {/* Section 4: Extra */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <MessageSquare size={20} className="text-rose-500" /> Special Requests
              </h2>
              <textarea
                rows={2}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="Any other details the host should know?"
                value={formData.special_requests}
                onChange={e => setFormData({ ...formData, special_requests: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Submit Application
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyEventPage;