import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, MapPin, DollarSign, Users, Info, 
  CheckCircle2, Image as ImageIcon, Loader2, Plus, Trash2 
} from 'lucide-react';
import type { PopUpEvent } from '@/types';

const CATEGORIES = ['MARKET', 'FESTIVAL', 'CONFERENCE', 'EXPO', 'OTHER'];
const AMENITY_OPTIONS = ['WiFi', 'Electricity', 'Tables Provided', 'Chairs Provided', 'Indoor', 'Parking', 'Security'];

const CreateEventPage = () => {
  const { id } = useParams(); // For Edit mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<PopUpEvent>>({
    title: '',
    description: '',
    category: CATEGORIES[0],
    start_date: '',
    end_date: '',
    location_address: '',
    booth_price: 0,
    price_negotiable: false,
    spots_available: 1,
    application_deadline: '',
    booth_specifications: '',
    amenities: [],
    images: [],
    status: 'DRAFT'
  });

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  async function fetchEvent() {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (data) setFormData(data);
  }

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities || [];
    setFormData({
      ...formData,
      amenities: current.includes(amenity) 
        ? current.filter(a => a !== amenity) 
        : [...current, amenity]
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files || []);
      if (files.length + (formData.images?.length || 0) > 5) {
        alert("Maximum 5 images allowed");
        return;
      }

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `events/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('event-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('event-images').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData({ ...formData, images: [...(formData.images || []), ...urls] });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const payload = { ...formData, host_id: user?.id };
    
    const { error } = id 
      ? await supabase.from('events').update(payload).eq('id', id)
      : await supabase.from('events').insert([payload]);

    if (!error) navigate('/host/dashboard');
    else alert(error.message);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">{id ? 'Edit Event' : 'Create New Event'}</h1>
          <div className="flex gap-3">
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="rounded-lg border-slate-300 text-sm font-medium"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {id ? 'Update Event' : 'Publish Event'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Info size={20} className="text-rose-500"/> General Info</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 border rounded-lg" placeholder="e.g. Summer Artisan Market" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border rounded-lg">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Application Deadline</label>
                  <input type="date" value={formData.application_deadline} onChange={e => setFormData({...formData, application_deadline: e.target.value})} className="w-full p-2.5 border rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border rounded-lg" placeholder="Describe your event and what kind of vendors you're looking for..." />
              </div>
            </div>

            {/* Logistics */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} className="text-rose-500"/> Dates & Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Start Date</label>
                  <input required type="datetime-local" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full p-2.5 border rounded-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">End Date</label>
                  <input required type="datetime-local" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full p-2.5 border rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><MapPin size={16}/> Location Address</label>
                <input required type="text" value={formData.location_address} onChange={e => setFormData({...formData, location_address: e.target.value})} className="w-full p-2.5 border rounded-lg" placeholder="Full street address" />
              </div>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Users size={20} className="text-rose-500"/> Vendor Specs</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Available Spots</label>
                <input type="number" value={formData.spots_available} onChange={e => setFormData({...formData, spots_available: parseInt(e.target.value)})} className="w-full p-2.5 border rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={16}/> Booth Price ($)</label>
                <input type="number" value={formData.booth_price} onChange={e => setFormData({...formData, booth_price: parseInt(e.target.value)})} className="w-full p-2.5 border rounded-lg" />
                <label className="flex items-center gap-2 text-sm pt-2">
                  <input type="checkbox" checked={formData.price_negotiable} onChange={e => setFormData({...formData, price_negotiable: e.target.checked})} className="rounded text-rose-600" />
                  Price is negotiable
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Booth Dimensions</label>
                <input type="text" value={formData.booth_specifications} onChange={e => setFormData({...formData, booth_specifications: e.target.value})} className="w-full p-2.5 border rounded-lg" placeholder="e.g. 10x10ft" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      formData.amenities?.includes(amenity)
                      ? 'bg-rose-100 border-rose-300 text-rose-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><ImageIcon size={20} className="text-rose-500"/> Images (Max 5)</h2>
              <div className="grid grid-cols-3 gap-2">
                {formData.images?.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, images: formData.images?.filter((_, idx) => idx !== i)})}
                      className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black"
                    >
                      <Trash2 size={12}/>
                    </button>
                  </div>
                ))}
                {(formData.images?.length || 0) < 5 && (
                  <label className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <Plus className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Add</span>
                    <input type="file" hidden accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;