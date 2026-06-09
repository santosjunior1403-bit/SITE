export default function Footer() {
  return (
    <footer className="bg-[#081A3A] text-gray-300 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-2xl mb-4">NEXO <span className="text-[#00C853]">Dedetizadora</span></h3>
            <p className="text-sm leading-relaxed max-w-sm">Soluções completas em dedetização e controle de pragas urbanas. Segurança, eficiência e garantia total de qualidade para sua residência ou empresa.</p>
        </div>
        <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Links Rápidos</h4>
            <ul className="space-y-3">
                <li><a href="#inicio" className="hover:text-[#00C853] transition-colors">Início</a></li>
                <li><a href="#servicos" className="hover:text-[#00C853] transition-colors">Serviços</a></li>
                <li><a href="#contato" className="hover:text-[#00C853] transition-colors">Agendar</a></li>
            </ul>
        </div>
        <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contato</h4>
            <ul className="space-y-3">
                <li>WhatsApp: (11) 99999-9999</li>
                <li>contato@nexodedetizadora.com.br</li>
            </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
        © 2026 NEXO Dedetizadora. Todos os direitos reservados.
      </div>
    </footer>
  );
}
