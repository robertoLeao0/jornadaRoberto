import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(true);

  // 1. Carregar dados ao abrir
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar');
        const data = await response.json();
        
        setNome(data.nome);
        setDescricao(data.descricao || '');
        if(data.dataPrevista) {
            setDataPrevista(data.dataPrevista.split('T')[0]);
        }
        setAtivo(data.ativo);
      } catch (error) {
        toast.error('Tarefa não encontrada.');
        navigate('/dashboard/admin/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  // 2. Salvar Edição
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      nome,
      descricao,
      dataPrevista: new Date(dataPrevista).toISOString(),
      ativo
    };

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // --- MENSAGEM BONITA AQUI ---
        toast.success('Tarefa atualizada com sucesso!');
        navigate('/dashboard/admin/projects');
      } else {
        toast.error('Erro ao salvar edição.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor.');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Carregando dados...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Editar Tarefa</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
            <input
              type="date"
              required
              value={dataPrevista}
              onChange={(e) => setDataPrevista(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Switch Ativo/Inativo */}
          <div className="flex flex-col justify-end">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">{ativo ? 'Ativo' : 'Inativo'}</span>
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end pt-6 border-t space-x-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
}