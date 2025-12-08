import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const MAX_DAYS = 21; 

export default function ServidorDashboard() {
  const { data: progress, isLoading } = useQuery({
    queryKey: ['my-progress'],
    queryFn: async () => {
      const { data } = await api.get('/projects/sample/my-progress');
      return data; // Array de ActionLog
    },
  });

  // Mapeia os dias concluídos para fácil lookup
  const completedDays = new Set(progress?.map((log: any) => log.dayNumber) ?? []);

  if (isLoading) {
    return <div className="p-6">Carregando Tarefas Diárias...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      
      {/* HEADER (Tarefas Diárias) */}
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Tarefas Diárias</h1>
        <p className="text-slate-500">Microações do dia e acompanhamento de pontos da jornada.</p>
      </header>
      
      {/* GRID RESPONSIVO DE DIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(MAX_DAYS)].map((_, idx) => {
          const dayNumber = idx + 1;
          const isCompleted = completedDays.has(dayNumber);
          
          return (
            <div 
              key={dayNumber} 
              // Classes para responsividade: 1 coluna no mobile (default), 2 no md, 3 no lg.
              className={`border rounded-lg p-5 shadow-lg transition-shadow 
                ${isCompleted ? 'bg-green-50 border-green-200 shadow-green-100' : 'bg-white border-slate-200 hover:shadow-lg'}`}
            >
              <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
                <span>Dia {dayNumber}</span>
                {isCompleted && (
                    <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">CONCLUÍDO</span>
                )}
              </h2>

              <p className="text-sm text-slate-600 mb-4">
                  Exemplo de microação de 10 minutos para o dia {dayNumber}.
              </p>

              <button 
                className={`mt-2 text-sm font-medium py-2 px-4 rounded transition w-full 
                  ${isCompleted ? 'bg-green-600 text-white cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                disabled={isCompleted}
              >
                {isCompleted ? 'Tarefa Completa' : 'Marcar como concluída'}
              </button>
            </div>
          );
        })}
      </div>
      
      {/* RESUMO (Parte Inferior) */}
      <div className="bg-white rounded-lg shadow-xl p-6 border-l-4 border-indigo-500">
        <h2 className="font-bold text-xl text-slate-700">Resumo da Jornada</h2>
        <p className="text-slate-500 text-sm mt-1">Dias Concluídos: {progress?.length ?? 0} de {MAX_DAYS}</p>
      </div>
    </div>
  );
}