import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { HostProfile, VendorProfile, UserRole } from '../types';
import { User, Store, Building2, Globe, Phone, Save, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // 1. Get User Role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      setRole(userData?.role);

      // 2. Get Profile Data based on role
      const table = userData?.role === 'HOST' ? 'hosts' : 'vendors';
      const { data: profileData, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              {role === 'HOST' ? <Building2 size={32} /> : <Store size={32} />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-sm text-slate-500 font-medium">Account Type: {role}</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Common Field: Business/Org Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {role === 'HOST' ? 'Organization Name' : 'Business Name'}
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={role === 'HOST' ? profile.organization_name : profile.business_name}
                onChange={(e) => setProfile({ ...profile, [role === 'HOST' ? 'organization_name' : 'business_name']: e.target.value })}
              />
            </div>

            {/* Host Only: Phone */}
            {role === 'HOST' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone size={14} /> Contact Phone
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.contact_phone || ''}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                />
              </div>
            )}

            {/* Vendor Only: Website */}
            {role === 'VENDOR' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Globe size={14} /> Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourstore.com"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.website_url || ''}
                  onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Bio / Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              {role === 'HOST' ? 'Host Bio' : 'Business Description'}
            </label>
            <textarea
              rows={4}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={role === 'HOST' ? profile.bio : profile.business_description}
              onChange={(e) => setProfile({ ...profile, [role === 'HOST' ? 'bio' : 'business_description']: e.target.value })}
            />
          </div>

          {/* Social Links (Vendor Specific) */}
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