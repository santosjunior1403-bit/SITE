export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Dicas e informações</h2>
        <p className="text-gray-600 mb-12">Aprenda como proteger sua casa, empresa ou condomínio.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
             <h3 className="font-bold text-lg text-blue-900">Você sabia o que o cupim pode causar?</h3>
             <p className="text-gray-600 mt-2 text-sm">Os cupins podem causar grandes prejuízos em móveis...</p>
          </div>
          {/* Outros posts serão carregados via Supabase */}
        </div>
      </div>
    </section>
  );
}
