import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function ServidorDashboard() {
  const { data: progress } = useQuery({
    queryKey: ['my-progress'],
    queryFn: async () => {
      const { data } = await api.get('/projects/sample/my-progress');
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Meu progresso</h1>
        <p className="text-slate-500">Microações do dia e acompanhamento de pontos.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(21)].map((_, idx) => (
          <div key={idx} className="border rounded p-3 bg-white shadow-sm">
            <p className="text-sm text-slate-500">Dia {idx + 1}</p>
            <button className="mt-2 text-sm text-indigo-600 underline">Marcar como concluída</button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold text-slate-700">Resumo</h2>
        <p className="text-slate-500 text-sm">Total de registros: {progress?.length ?? 0}</p>
      </div>
    </div>
  );
}
