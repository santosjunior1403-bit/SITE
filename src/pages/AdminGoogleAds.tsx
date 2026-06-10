import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleAdsSettings } from '../types';

export default function AdminGoogleAds() {
  const [settings, setSettings] = useState<GoogleAdsSettings | null>(null);
  const [form, setForm] = useState<Partial<GoogleAdsSettings>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('google_ads_settings').select('*').single();
    if (data) { setSettings(data); setForm(data); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = settings 
      ? await supabase.from('google_ads_settings').update(form).eq('id', settings.id)
      : await supabase.from('google_ads_settings').insert(form);
    
    if (error) alert("Erro ao salvar: " + error.message);
    else { alert("Configurações salvas com sucesso!"); fetchSettings(); }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Google Ads e Rastreamento</h2>
      <p className="mb-6 text-gray-400 italic">“Cole aqui os códigos fornecidos pelo Google Ads, Google Analytics ou Google Tag Manager. Para rastrear conversões, configure os IDs e labels correspondentes.”</p>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl border border-gray-700 grid md:grid-cols-2 gap-4">
        <input className="bg-gray-700 p-3 rounded text-white" value={form.gtm_id || ''} onChange={e => setForm({...form, gtm_id: e.target.value})} placeholder="GTM ID (GTM-XXXXXXX)" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.ga4_measurement_id || ''} onChange={e => setForm({...form, ga4_measurement_id: e.target.value})} placeholder="GA4 ID (G-XXXXXXXXXX)" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.google_ads_conversion_id || ''} onChange={e => setForm({...form, google_ads_conversion_id: e.target.value})} placeholder="Ads Conversion ID (AW-XXXXXXX)" />
        
        <input className="bg-gray-700 p-3 rounded text-white" value={form.conversion_label_whatsapp || ''} onChange={e => setForm({...form, conversion_label_whatsapp: e.target.value})} placeholder="Label WhatsApp" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.conversion_label_phone || ''} onChange={e => setForm({...form, conversion_label_phone: e.target.value})} placeholder="Label Telefone" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.conversion_label_form || ''} onChange={e => setForm({...form, conversion_label_form: e.target.value})} placeholder="Label Formulário" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.conversion_label_quote || ''} onChange={e => setForm({...form, conversion_label_quote: e.target.value})} placeholder="Label Orçamento" />

        <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={!!form.active} onChange={e => setForm({...form, active: e.target.checked})} /> Ativo
        </label>
        
        <textarea className="col-span-2 bg-gray-700 p-3 rounded text-white" value={form.custom_head_code || ''} onChange={e => setForm({...form, custom_head_code: e.target.value})} placeholder="Código extra no HEAD" />
        <textarea className="col-span-2 bg-gray-700 p-3 rounded text-white" value={form.custom_body_code || ''} onChange={e => setForm({...form, custom_body_code: e.target.value})} placeholder="Código extra antes do BODY" />
        
        <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 p-3 rounded text-white font-bold">{loading ? 'Salvando...' : 'Salvar Configurações'}</button>
      </form>
    </div>
  );
}
