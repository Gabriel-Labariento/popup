import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import {
  Calendar, MapPin, Users, PhilippinePeso,
  Info, Box, CheckCircle2, ArrowLeft,
  Loader2, Building2, Clock, Globe, ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { UserAuth } from '@/context/AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ReportButton } from '@/components/ui/ReportButton';

export default function EventDetailsPage() {
  const { id: eventId } = useParams();
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId, session]);

  async function fetchEventDetails() {
    try {
      setLoading(true);

      // 1. Fetch Event + Host Data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // 2. Fetch Host Data separately (no direct FK)
      const { data: hostData, error: hostError } = await supabase
        .from('hosts')
        .select('*')
        .eq('user_id', eventData.host_id)
        .single();

      if (hostError && hostError.code !== 'PGRST116') throw hostError; // pg error for no rows

      setEvent({ ...eventData, host: hostData });

      // 2. Check if this vendor has already applied
      if (session?.user.id) {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('vendor_id', session.user.id);

        setHasApplied(count !== null && count > 0);
      }
    } catch (err) {
      console.error(err);
      navigate('/vendor/dashboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={48} /></div>;

  const isDeadlinePassed = new Date(event.application_deadline) < new Date();
  const isFull = event.spots_filled >= event.spots_available;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-6 transition-colors font-medium">
        <ArrowLeft size={18} /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Media & Description */}
        <div className="lg:col-span-2 space-y-8">

          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
              {event.images?.[activeImage] ? (
                <img src={event.images[activeImage]} className="w-full h-full object-cover" alt="Event" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300"><Box size={64} /></div>
              )}
            </div>
            {event.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {event.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-32 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === i ? 'border-rose-500 scale-95' : 'border-transparent'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Stats Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {event.category}
              </span>
              {isFull && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Fully Booked</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">{event.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                  <PhilippinePeso size={18} className="text-green-600" /> {event.booth_price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spots Left</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                  <Users size={18} className="text-blue-500" /> {event.spots_available - event.spots_filled}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-1 text-sm sm:text-lg">
                  <Calendar size={18} className="text-rose-500" /> {format(new Date(event.start_date), 'MMM dd')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deadline</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-1 text-sm sm:text-lg">
                  <Clock size={18} className="text-amber-500" /> {format(new Date(event.application_deadline), 'MMM dd')}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">About this Event</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Amenities & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><ShieldCheck size={20} className="text-rose-500" /> Included Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {event.amenities?.map((a: string) => (
                  <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                    <CheckCircle2 size={14} className="text-green-500" /> {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Box size={20} className="text-rose-500" /> Booth Specs</h3>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-600 leading-relaxed">{event.booth_specifications || "Details provided upon acceptance."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action & Host Profile */}
        <div className="space-y-6">

          {/* Application Sidebar Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg sticky top-24">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500">Booth Rental</span>
                <span className="text-xl text-slate-900">₱{event.booth_price.toLocaleString()}</span>
              </div>

              {hasApplied ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="mx-auto" />
                  <p className="font-bold">Already Applied</p>
                  <Link to="/vendor/applications" className="text-xs underline block">Track status</Link>
                </div>
              ) : isDeadlinePassed ? (
                <div className="bg-slate-100 text-slate-500 p-4 rounded-2xl text-center font-bold">
                  Applications Closed
                </div>
              ) : (
                <Link
                  to={`/vendor/events/${event.id}/apply`}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-600/20"
                >
                  Apply to Booth
                </Link>
              )}

              <p className="text-[10px] text-center text-slate-400">
                You won't be charged until the host accepts your application.
              </p>
            </div>

            {/* Host Preview */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organized By</p>
                <ReportButton
                  type="host"
                  id={event.host?.user_id || event.host?.id}
                  name={event.host?.organization_name}
                  variant="ghost"
                  size="sm"
                  label="Report Host"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden border">
                  {event.host?.avatar_url ? <img src={event.host.avatar_url} className="w-full h-full object-cover" /> : <Building2 size={24} className="m-auto text-slate-300 h-full w-full p-2" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{event.host?.organization_name}</h4>
                  <p className="text-xs text-slate-500">Member since {format(new Date(event.host?.created_at || Date.now()), 'yyyy')}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <ReportButton
                type="event"
                id={event.id}
                name={event.title}
                variant="ghost"
                size="sm"
                label="Report Event"
                className="text-xs text-slate-400"
              />
            </div>

            {/* Map Preview */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={16} className="text-rose-500" /> Location
                </h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">{event.location_address}</p>
              <div className="h-40 rounded-2xl overflow-hidden border z-0">
                <MapContainer center={[event.location_lat, event.location_lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[event.location_lat, event.location_lng]} />
                </MapContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}