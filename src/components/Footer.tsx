import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div><h3 className="text-white font-bold text-lg mb-4">NEXO Dedetizadora</h3><p className="text-sm">Proteção contra pragas urbanas.</p></div>
        <div><h4 className="text-white font-semibold mb-4">Links Institucionais</h4><ul className="space-y-2"><li><a href="#inicio">Início</a></li><li><a href="#servicos">Serviços</a></li></ul></div>
        <div/>
        <div className="text-sm">
          <Link to="/admin" className="text-gray-500 hover:text-white transition">Área de Membros</Link>
        </div>
      </div>
    </footer>
  );
}
