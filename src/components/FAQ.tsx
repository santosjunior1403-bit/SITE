import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Quanto tempo preciso ficar fora de casa após o serviço de dedetização?',
    answer: 'Para a maioria dos serviços de desinsetização líquida, recomendamos que pessoas e animais de estimação fiquem afastados do imóvel por um período de 4 a 6 horas após a aplicação. No caso de gestantes, bebês, idosos ou pessoas com problemas respiratórios graves, o ideal é estender esse período para 12 a 24 horas. Para serviços com aplicação exclusiva em gel (baratas e formigas), não há necessidade de desocupar o imóvel.'
  },
  {
    question: 'Os produtos utilizados são seguros para crianças e animais de estimação?',
    answer: 'Sim! A NEXO Dedetizadora utiliza exclusivamente produtos domissanitários de laboratórios líderes mundiais, devidamente registrados no Ministério da Saúde e na ANVISA. Quando secos, os produtos pulverizados são de baixíssima toxicidade e extremamente seguros. Além disso, as nossas aplicações em locais compartilhados por crianças ou pets usam formulações em gel ou iscas em porta-iscas lacrados e fixados, impedindo qualquer tipo de acesso acidental.'
  },
  {
    question: 'Com que frequência deve ser feita a dedetização preventiva?',
    answer: 'Para residências e apartamentos comuns, recomendamos a realização do preventivo a cada 6 meses. Parcerias comerciais, restaurantes, condomínios ou setores industriais com manipulação de alimentos necessitam de cronogramas mais frequentes, que podem variar de mensais a trimestrais de acordo com as normas da vigilância sanitária local.'
  },
  {
    question: 'Qual a garantia oferecida pela NEXO Dedetizadora?',
    answer: 'Oferecemos garantia plena e por escrito para todos os serviços executados. O período de garantia varia de 3 a 6 meses a depender da praga controlada (por exemplo, 3 meses para desinsetização geral de insetos rasteiros e até 1 ano para determinados tratamentos de descupinização). Caso ocorra reaparecimento da praga sob garantia, enviamos nossa equipe de assistência técnica no menor tempo possível sem qualquer custo adicional para você.'
  },
  {
    question: 'Como funciona a limpeza de caixas d\'água?',
    answer: 'A nossa equipe esvazia o reservatório, realiza a escovação mecânica das paredes internas e do fundo para remover lodo e impurezas, enxágua e aplica uma desinfecção profunda com base em cloro ativo para eliminar microrganismos. Em seguida, orientamos sobre o reabastecimento. Emitimos um certificado de higienização válido por 6 meses com laudo de potabilidade assinado por responsável técnico.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white text-gray-900 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#081A3A]/5 text-[#081A3A] rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#00C853]" /> Dúvidas Frequentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081A3A] tracking-tight mb-4">
            Perguntas <span className="text-[#00C853]">Frequentes</span>
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Tem alguma dúvida sobre produtos, segurança ou garantias de dedetização? Confira as dúvidas mais comuns dos nossos clientes.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-[#00C853] bg-white shadow-lg shadow-gray-100' 
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group cursor-pointer"
                >
                  <span className={`font-bold text-base sm:text-lg transition-colors duration-200 ${isOpen ? 'text-[#081A3A]' : 'text-gray-800'}`}>
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#081A3A] shrink-0 transition-transform duration-300 ease-in-out ${
                      isOpen ? 'transform rotate-180 text-[#00C853]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100/80 pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
