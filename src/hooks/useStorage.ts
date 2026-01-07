import { useState } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';

export const useStorage = (bucket: string) => {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: File[], userId: string): Promise<string[]> => {
    setUploading(true);
    const publicUrls: string[] = [];

    try {
      for (const file of files) {
        // Validate size (e.g., 2MB limit)
        if (file.size > 2 * 1024 * 1024) throw new Error(`${file.name} is too large (Max 2MB)`);

        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        publicUrls.push(data.publicUrl);
      }
      return publicUrls;
    } catch (error: any) {
      alert(error.message);
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
};