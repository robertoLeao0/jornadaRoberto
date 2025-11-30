export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Administração plena</h1>
        <p className="text-slate-500">Configure municípios, projetos e templates de microações.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700">Municípios</h2>
          <p className="text-slate-500 text-sm">Gerencie cidades e status de participação.</p>
        </div>
        <div className="bg-white border rounded p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700">Projetos</h2>
          <p className="text-slate-500 text-sm">Defina datas, dias e associações por município.</p>
        </div>
        <div className="bg-white border rounded p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700">Relatórios</h2>
          <p className="text-slate-500 text-sm">Exporte CSV para acompanhamento executivo.</p>
        </div>
      </div>
    </div>
  );
}
