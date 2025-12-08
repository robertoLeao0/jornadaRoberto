import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    // O p-6 aqui adiciona o espaçamento interno, já que o Layout cuida apenas do espaçamento lateral.
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Bem-vindo(a) à Administração Plena</h1>
      <p className="text-slate-600">Use o menu lateral para gerenciar as funcionalidades: Usuários, Municípios, Projetos e Relatórios.</p>
      
      {/* Exemplo de cards de resumo para o futuro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
          <h2 className="text-xl font-semibold text-slate-700">Total de Usuários</h2>
          <p className="text-3xl text-indigo-600 mt-2">...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
          <h2 className="text-xl font-semibold text-slate-700">Projetos Ativos</h2>
          <p className="text-3xl text-teal-600 mt-2">...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-slate-700">Municípios Ativos</h2>
          <p className="text-3xl text-green-600 mt-2">...</p>
        </div>
      </div>

    </div>
  );
}