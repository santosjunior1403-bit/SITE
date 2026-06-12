import { supabase } from './supabase';

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  // Helper to convert file to base64 Data URL
  const toBase64 = (f: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  if (!supabase) {
    console.warn('[STORAGE fallback] No Supabase client found. Falling back to Base64 image encoding.');
    return toBase64(file);
  }

  // Proactively attempt to make sure 'site-assets' bucket exists
  try {
    const { error: bucketError } = await supabase.storage.createBucket('site-assets', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });
    if (!bucketError) {
      console.log('[STORAGE] Public bucket "site-assets" verified or created successfully.');
    }
  } catch (bucketCatch) {
    // Silently ignore create bucket permissions or already-exists warnings
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file);

    if (error) {
      console.warn('[STORAGE warning] Supabase upload failed. Falling back to Base64 data URL. Error:', error.message);
      return toBase64(file);
    }

    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err: any) {
    console.warn('[STORAGE exception] Storage upload error, falling back to Base64:', err?.message || err);
    return toBase64(file);
  }
};

