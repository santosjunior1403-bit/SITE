import { supabase } from './supabase';

export const uploadImage = async (file: File, folder: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('site-assets')
    .getPublicUrl(fileName);

  return data.publicUrl;
};
