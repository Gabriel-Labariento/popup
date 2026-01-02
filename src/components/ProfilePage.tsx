import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { UserRole } from '../types';
import { Store, Building2, Globe, Phone, Save, Loader2, Camera } from 'lucide-react';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Create a ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      setRole(userData?.role);

      const table = userData?.role === 'HOST' ? 'hosts' : 'vendors';
      const urlColumn = userData?.role === 'HOST' ? 'avatar_url' : 'avatar_url';

      const { data: profileData } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setAvatarUrl(profileData[urlColumn]); // Set the specific image URL based on role
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Image Upload Logic
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const file = e.target.files?.[0]
      if (!file) return;
      
      // 1. Limit file size (e.g., 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please upload an image under 2MB.");
        return;
      }


       const { data: { user } } = await supabase.auth.getUser();
       if (!user) {
          throw Error("Could not find user")
       }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`; // Consistent name

      // 2. Upload with UPSERT
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 3. Add timestamp to force browser to refresh image
    const finalUrl = `${publicUrl}?t=${Date.now()}`;
    
    setAvatarUrl(finalUrl);
    setProfile({ ...profile, [role === 'HOST' ? 'avatar_url' : 'logo_url']: finalUrl });

    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const table = role === 'HOST' ? 'hosts' : 'vendors';

    const { error } = await supabase
      .from(table)
      .update(profile)
      .eq('user_id', user?.id);

    if (error) alert(error.message);
    else alert('Profile updated!');
    setSaving(false);
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-rose-700" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            
            {/* CLICKABLE IMAGE SECTION */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-20 w-20 rounded-full flex items-center justify-center text-rose-600 overflow-hidden border-2 border-white shadow-sm transition-all group-hover:border-rose-400">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  role === 'HOST' ? <Building2 size={32} /> : <Store size={32} />
                )}
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <Loader2 className="text-white animate-spin" size={20} />
                ) : (
                  <Camera className="text-white" size={20} />
                )}
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-sm text-slate-500 font-medium">Account Type: {role}</p>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {role === 'HOST' ? 'Organization Name' : 'Business Name'}
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={role === 'HOST' ? profile.organization_name : profile.business_name}
                onChange={(e) => setProfile({ ...profile, [role === 'HOST' ? 'organization_name' : 'business_name']: e.target.value })}
              />
            </div>

            {role === 'HOST' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone size={14} /> Contact Phone
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  value={profile.contact_phone || ''}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                />
              </div>
            )}

            {role === 'VENDOR' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Globe size={14} /> Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourstore.com"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  value={profile.website_url || ''}
                  onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              {role === 'HOST' ? 'Host Bio' : 'Business Description'}
            </label>
            <textarea
              rows={4}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              value={role === 'HOST' ? profile.bio : profile.business_description}
              onChange={(e) => setProfile({ ...profile, [role === 'HOST' ? 'bio' : 'business_description']: e.target.value })}
            />
          </div>

          {role === 'VENDOR' && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">@</span>
                  <input
                    type="text"
                    placeholder="Instagram handle"
                    className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm"
                    value={profile.social_links?.instagram || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, instagram: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;