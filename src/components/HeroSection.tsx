export default function HeroSection() {
  return (
    <div id="inicio" className="bg-blue-900 text-white min-h-[600px] flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Elimine pragas com segurança, rapidez e garantia
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Atendimento especializado para residências, empresas e condomínios. Controle de baratas, ratos, cupins, formigas, escorpiões e limpeza de caixa d’água.
          </p>
          <div className="flex gap-4">
            <a href="#contato" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50">Solicitar orçamento</a>
            <a href="#contato" className="border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/10">Falar no WhatsApp</a>
          </div>
        </div>
        <div className="hidden md:block">
            <div className="bg-blue-800 rounded-2xl h-80 flex items-center justify-center border-4 border-blue-700">
                <span className="text-blue-300">Imagem do Técnico aqui</span>
            </div>
        </div>
      </div>
    </div>
  );
}
