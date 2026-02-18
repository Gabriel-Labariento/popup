import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase/client/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Info,
  Image as ImageIcon, Loader2, Plus, Trash2,
  PhilippinePeso
} from 'lucide-react';
import type { PopUpEvent } from '@/types';
import LocationPicker from '../LocationPicker';
import { useStorage } from '@/hooks/useStorage';
import { MultiImagePicker } from '../ui/multi-image-picker';
import { UserAuth } from '@/context/AuthContext';


import { EVENT_CATEGORIES } from '@/constants/categories';

const AMENITY_OPTIONS = ['WiFi', 'Electricity', 'Tables Provided', 'Chairs Provided', 'Indoor', 'Parking', 'Security'];

const CreateEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { uploadImages, uploading } = useStorage('event-images')
  const { session } = UserAuth()

  const [formData, setFormData] = useState<Partial<PopUpEvent>>({
    title: '',
    description: '',
    category: EVENT_CATEGORIES[0],
    start_date: '',
    end_date: '',
    location_address: '',
    location_lat: 0,
    location_lng: 0,
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
    const { data } = await supabase.from('events').select('*').eq('id', id).single();
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

  const handleFileChange = async (files: FileList) => {
    if (!session?.user.id) return;

    const urls = await uploadImages(Array.from(files), session.user.id);

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...urls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images && prev.images.filter((_, i) => i !== index)
    }));
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
    else toast.error(error.message);
    setLoading(false);
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      location_address: address,
      location_lat: lat,
      location_lng: lng,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
      <form onSubmit={handleSubmit} className="space-y-6 sm:y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {id ? 'Edit Event' : 'Create New Event'}
          </h1>
          <div className="flex w-full sm:w-auto gap-3">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="flex-1 sm:flex-none rounded-lg border-slate-300 text-sm font-medium"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none bg-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {id ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* LEFT COLUMN: Main Information (2/3 width on Desktop) */}
          <div className="lg:col-span-2 space-y-6">

            {/* General Info Card */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Info size={20} className="text-rose-500" /> General Info
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="e.g. Summer Artisan Market" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as PopUpEvent['category'] })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none">
                    {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Application Deadline</label>
                  <input type="date" value={formData.application_deadline} onChange={e => setFormData({ ...formData, application_deadline: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Describe your event and what kind of vendors you're looking for..." />
              </div>
            </div>

            {/* Logistics & Location Card */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} className="text-rose-500" /> Dates & Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Start Date & Time</label>
                  <input required type="datetime-local" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">End Date & Time</label>
                  <input required type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <MapPin size={16} /> Event Location
                </label>
                <div className="z-0 relative">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    defaultAddress={formData.location_address}
                  />
                </div>
                {formData.location_lat !== 0 && (
                  <p className="text-[10px] text-slate-400">
                    Coordinates: {formData.location_lat?.toFixed(4)}, {formData.location_lng?.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (1/3 width on Desktop) */}
          <div className="space-y-6">

            {/* Vendor Specs Card */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users size={20} className="text-rose-500" /> Vendor Specs
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Available Spots</label>
                <input type="number" min="1" value={formData.spots_available} onChange={e => setFormData({ ...formData, spots_available: parseInt(e.target.value) })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <PhilippinePeso size={16} /> Booth Price (PHP)
                </label>
                <input type="number" min="0" value={formData.booth_price} onChange={e => setFormData({ ...formData, booth_price: parseInt(e.target.value) })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                <label className="flex items-center gap-2 text-sm pt-1 cursor-pointer select-none">
                  <input type="checkbox" checked={formData.price_negotiable} onChange={e => setFormData({ ...formData, price_negotiable: e.target.checked })} className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4" />
                  <span className="text-slate-600">Price is negotiable</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Booth Dimensions</label>
                <input type="text" value={formData.booth_specifications} onChange={e => setFormData({ ...formData, booth_specifications: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="e.g. 2x2m" />
              </div>
            </div>

            {/* Amenities Card */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${formData.amenities?.includes(amenity)
                      ? 'bg-rose-100 border-rose-300 text-rose-700 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon size={20} className="text-rose-500" /> Images (Max 5)
              </h2>
              <MultiImagePicker
                images={formData.images || []}
                onUpload={handleFileChange}
                onRemove={(index) => {
                  // Shared remove logic
                  const key = 'images'
                  setFormData({
                    ...formData,
                    [key]: formData[key] && formData[key].filter((_, i) => i !== index)
                  });
                }}
                uploading={uploading}
              />
              {uploading && <p className="text-xs text-rose-600 animate-pulse font-medium">Uploading images...</p>}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;