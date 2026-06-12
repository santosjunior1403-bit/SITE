import { supabase } from './supabase';

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  if (!supabase || !supabase.storage) {
    throw new Error('Cliente Supabase não está configurado ou não pôde ser iniciado.');
  }

  // Proactively attempt to make sure 'site-assets' bucket exists or is verified
  try {
    const { error: bucketError } = await supabase.storage.createBucket('site-assets', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });
    if (!bucketError) {
      console.log('[STORAGE] Public bucket "site-assets" verified or created.');
    }
  } catch (bucketCatch) {
    // Silently continue, as creation might require admin privileges but bucket might already exist
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(fileName, file);

  if (error) {
    console.error('[STORAGE] Supabase upload failed:', error);
    if (error.message && error.message.includes('Bucket not found')) {
      throw new Error('O bucket "site-assets" não foi encontrado no seu Supabase. Por favor, crie o bucket público chamado "site-assets" no painel do Supabase Storage.');
    }
    throw new Error(`Erro ao enviar arquivo para o Supabase Storage: ${error.message || 'Verifique as políticas de RLS ou se o bucket existe.'}`);
  }

  const { data } = supabase.storage
    .from('site-assets')
    .getPublicUrl(fileName);

  if (!data || !data.publicUrl) {
    throw new Error('Não foi possível gerar a URL pública para a imagem enviada.');
  }

  return data.publicUrl;
};
