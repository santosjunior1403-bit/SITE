export default function PartnersSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        <h2 className="text-3xl font-bold text-blue-900 mb-8">Empresas Parceiras</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-gray-500">Logo Parceiro 1</div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-gray-500">Logo Parceiro 2</div>
        </div>

        <h2 className="text-3xl font-bold text-blue-900 mb-8">Clientes Atendidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-gray-500">Logo Cliente 1</div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-gray-500">Logo Cliente 2</div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-gray-500">Logo Cliente 3</div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center text-gray-500">Logo Cliente 4</div>
        </div>
        
      </div>
    </section>
  );
}
