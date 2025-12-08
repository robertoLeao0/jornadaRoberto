import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

type Project = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function AdminProjectsList() {
  // Busca todos os projetos, filtrando por município (opcionalmente) e ativos
  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ['projects-list'],
    queryFn: async () => {
      // O endpoint /projects aceita filtros e é protegido (ADMIN_PLENO)
      const { data } = await api.get('/projects'); 
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Carregando projetos e tarefas...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Erro ao carregar a lista de projetos.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Gerenciamento de Projetos e Tarefas</h1>
          <p className="text-slate-500">Crie, ative e defina as microações (dias) das jornadas.</p>
        </div>
        <Link 
          to="/dashboard/admin/projects/create" // Rota futura para criação
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition font-medium text-sm"
        >
          + Novo Projeto
        </Link>
      </header>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 bg-slate-50 border-b">
              <th className="py-3 px-4">Nome do Projeto</th>
              <th className="py-3 px-4">Período</th>
              <th className="py-3 px-4">Dias Totais</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((project) => (
              <tr key={project.id} className="border-b hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">{project.name}</td>
                <td className="py-3 px-4 text-slate-600">
                    {new Date(project.startDate).toLocaleDateString()} a {new Date(project.endDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-slate-600">
                    {/* Placeholder para totalDays, que o Project model tem */}
                    21 dias
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {project.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                    <Link to={`/dashboard/admin/projects/${project.id}/days`} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                        Ver Tarefas
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(projects?.length === 0) && (
             <p className="p-4 text-slate-500">Nenhum projeto cadastrado.</p>
        )}
      </div>
    </div>
  );
}