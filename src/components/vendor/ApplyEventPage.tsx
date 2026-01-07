import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import { 
  ArrowLeft, Store, MessageSquare, Image as ImageIcon, Plus, 
  Trash2, Loader2, Send, ToolCase} from 'lucide-react';
import { UserAuth } from '@/context/AuthContext';

const ApplyEventPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { session } = UserAuth();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    business_description: '',
    products_offered: '',
    booth_requirements: '',
    special_requests: '',
    portfolio_images: [] as string[]
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  async function fetchEventDetails() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, host:hosts(organization_name)')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/vendor/dashboard');
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files || []);
      if (files.length + formData.portfolio_images.length > 5) {
        alert("Maximum 5 images allowed");
        return;
      }

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `applications/${session?.user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('application-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('application-images').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData({ ...formData, portfolio_images: [...formData.portfolio_images, ...urls] });
    } catch (error) {
      console.error(error);
      alert("Error uploading images");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setSubmitting(true);
    try {
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

      alert("Application submitted successfully!");
      navigate('/vendor/dashboard'); // TODO: Or to an 'Applications' list page
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={48} /></div>;

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
                onChange={e => setFormData({...formData, business_description: e.target.value})}
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
                onChange={e => setFormData({...formData, products_offered: e.target.value})}
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
                onChange={e => setFormData({...formData, booth_requirements: e.target.value})}
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
                  <img src={url} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, portfolio_images: formData.portfolio_images.filter((_, idx) => idx !== i)})}
                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black"
                  >
                    <Trash2 size={12}/>
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
              onChange={e => setFormData({...formData, special_requests: e.target.value})}
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
      </div>
    </div>
  );
};

export default ApplyEventPage;