import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

export default function GestorDashboard() {
  const { data: ranking } = useQuery({
    queryKey: ['ranking-full'],
    queryFn: async () => {
      const { data } = await api.get('/projects/sample/ranking/full');
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Visão do gestor</h1>
        <p className="text-slate-500">Acompanhe adesão e ranking do município.</p>
      </header>
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold text-slate-700 mb-2">Ranking municipal</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">#</th>
                <th>Servidor</th>
                <th>Pontos</th>
                <th>Dias</th>
                <th>Conclusão</th>
              </tr>
            </thead>
            <tbody>
              {(ranking ?? []).map((row: any, index: number) => (
                <tr key={row.userId} className="border-t">
                  <td className="py-2">{index + 1}</td>
                  <td>{row.user?.name}</td>
                  <td>{row.totalPoints}</td>
                  <td>{row.completedDays}</td>
                  <td>{row.completionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
