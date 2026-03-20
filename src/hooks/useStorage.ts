import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase/client/supabase';
import { toast } from 'sonner';

export const useStorage = (bucket: string) => {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: File[], userId: string): Promise<string[]> => {
    setUploading(true);
    const publicUrls: string[] = [];

    try {
      for (const file of files) {
        // Limit input size to 5MB (to prevent massive files), but compress to <1MB
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is too large (Max 5MB Input)`);

        let fileToUpload = file;

        // Compress image using browser-image-compression
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          };
          fileToUpload = await imageCompression(file, options);
        } catch (_compressError) {
          // Fallback to original file if compression fails
        }

        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, fileToUpload);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        publicUrls.push(data.publicUrl);
      }
      return publicUrls;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
};