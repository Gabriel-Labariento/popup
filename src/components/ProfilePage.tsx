import React, { useEffect, useState, useRef } from 'react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase/client/supabase';
import { UserRole } from '../types';
import { Store, Building2, Globe, Phone, Save, Loader2, Camera, Instagram } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"
import { useProfile } from '@/context/ProfileContext';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any>({}); // Initialize as empty object
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Get refetch from context to update global state after save
  const { refetch: refetchGlobalProfile } = useProfile();

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
      const urlColumn = 'avatar_url'; // simplified, both have avatar_url or logo_url. Let's check schema.
      // Hosts: avatar_url, Vendors: logo_url. 
      // Actually, let's just dynamic check.

      const { data: profileData } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle to not throw error if null

      if (profileData) {
        setProfile(profileData);
        setAvatarUrl(userData?.role === 'HOST' ? profileData.avatar_url : profileData.logo_url);
      } else {
        // Initialize empty profile structure based on role
        if (userData?.role === 'HOST') {
          setProfile({
            organization_name: '',
            contact_phone: '',
            bio: '',
            avatar_url: ''
          });
        } else {
          setProfile({
            business_name: '',
            business_description: '',
            website_url: '',
            social_links: { instagram: '' },
            logo_url: ''
          });
        }
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
        toast.error("File is too large. Please upload an image under 2MB.");
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

      const urlField = role === 'HOST' ? 'avatar_url' : 'logo_url';
      setProfile({ ...profile, [urlField]: finalUrl });

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("User not found");
      setSaving(false);
      return;
    }

    const table = role === 'HOST' ? 'hosts' : 'vendors';

    // Prepare payload. IMPORTANT: Add user_id!
    const payload = {
      ...profile,
      user_id: user.id
    };

    // Use upsert to handle both insert (new profile) and update (existing)
    const { error } = await supabase
      .from(table)
      .upsert(payload)
      .select();

    if (error) {
      console.error("Profile update error:", error);
      toast.error(error.message);
    } else {
      toast.success('Profile updated!');
      // Trigger global context refetch so the guard knows we are complete
      await refetchGlobalProfile();
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-24 md:pb-10">
      {/* Cover Image Header */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-rose-500 via-orange-400 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden ring-1 ring-slate-900/5">
            <div className="p-6 md:p-8">
              {/* Header Section with Avatar */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
                {/* Avatar Upload */}
                <div className="relative group shrink-0">
                  <div
                    className="relative h-32 w-32 rounded-2xl md:rounded-3xl shadow-lg ring-4 ring-white cursor-pointer overflow-hidden bg-white flex items-center justify-center text-slate-300 transition-transform group-hover:scale-[1.02]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      role === 'HOST' ? <Building2 size={48} strokeWidth={1.5} /> : <Store size={48} strokeWidth={1.5} />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {uploading ? (
                        <Loader2 className="text-white animate-spin" size={24} />
                      ) : (
                        <Camera className="text-white" size={24} />
                      )}
                    </div>
                  </div>
                  {/* Floating Edit Icon */}
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-slate-100 text-slate-600 group-hover:text-primary transition-colors pointer-events-none">
                    <Camera size={16} />
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="text-center md:text-left flex-1 space-y-1 pb-2">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {role === 'HOST' ? profile?.organization_name || 'Organization Name' : profile?.business_name || 'Business Name'}
                  </h1>
                  <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider font-bold text-slate-600 border border-slate-200">
                      {role}
                    </span>
                    {profile?.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                        <Globe size={12} /> Website
                      </a>
                    )}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-600 font-semibold">
                        {role === 'HOST' ? 'Organization Name' : 'Business Name'}
                      </Label>
                      <Input
                        id="name"
                        value={role === 'HOST' ? (profile.organization_name || '') : (profile.business_name || '')}
                        onChange={(e) => setProfile({ ...profile, [role === 'HOST' ? 'organization_name' : 'business_name']: e.target.value })}
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                        placeholder={role === 'HOST' ? "e.g. Acme Events" : "e.g. Joe's Food Truck"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-slate-600 font-semibold">
                        {role === 'HOST' ? 'About Organization' : 'Business Description'}
                      </Label>
                      <Textarea
                        id="bio"
                        rows={5}
                        value={role === 'HOST' ? (profile.bio || '') : (profile.business_description || '')}
                        onChange={(e) => setProfile({ ...profile, [role === 'HOST' ? 'bio' : 'business_description']: e.target.value })}
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-all resize-none"
                        placeholder={role === 'HOST' ? "Tell us about your organization..." : "Tell us about your business..."}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {role === 'HOST' && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-600 font-semibold">Contact Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                          <Input
                            id="phone"
                            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                            value={profile.contact_phone || ''}
                            onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                            placeholder="+63 900 000 0000"
                          />
                        </div>
                      </div>
                    )}

                    {role === 'VENDOR' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-slate-600 font-semibold">Website URL</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                            <Input
                              id="website"
                              type="url"
                              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                              value={profile.website_url || ''}
                              onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <Label className="text-slate-900 font-bold mb-4 block text-base">Social Media</Label>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="instagram" className="text-xs text-slate-500 uppercase tracking-wide">Instagram</Label>
                              <div className="relative">
                                <Instagram className="absolute left-3 top-3 text-pink-500" size={18} />
                                <Input
                                  id="instagram"
                                  placeholder="@username"
                                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                                  value={profile.social_links?.instagram || ''}
                                  onChange={(e) => setProfile({
                                    ...profile,
                                    social_links: { ...profile.social_links, instagram: e.target.value }
                                  })}
                                />
                              </div>
                            </div>
                            {/* Future Layout for more socials */}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Desktop Save Button (Hidden on Mobile) */}
                <div className="hidden md:flex justify-end pt-6 border-t border-slate-100">
                  <Button
                    onClick={handleUpdate}
                    disabled={saving || uploading}
                    className="min-w-[150px] shadow-lg shadow-rose-500/20"
                    size="lg"
                  >
                    {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Mobile Floating Action Button / Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-50 safe-area-bottom">
        <Button
          onClick={handleUpdate}
          disabled={saving || uploading}
          className="w-full shadow-lg h-12 text-lg font-semibold"
        >
          {saving ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;