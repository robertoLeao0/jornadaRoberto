import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaCheckCircle, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;       // Nome
  description: string; // Descrição
  date: string;        // Data
  isActive: boolean;   // Ativo ou Não
}

export default function ProjectTasks() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  // MOCK DE DADOS (Simulando o Banco de Dados)
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Boas Vindas', 
      description: 'Vídeo de apresentação da jornada.', 
      date: '2025-02-27', 
      isActive: true 
    },
    { 
      id: '2', 
      title: 'Desafio do Espelho', 
      description: 'Tirar uma foto no espelho e postar.', 
      date: '2025-02-28', 
      isActive: false 
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // ESTADO DO FORMULÁRIO COM OS CAMPOS QUE VOCÊ PEDIU
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isActive: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.description) {
      toast.error('Preencha todos os campos!');
      return;
    }

    // AQUI ENTRARIA O POST PARA O BANCO DE DADOS
    // api.post(`/projects/${projectId}/tasks`, formData)...

    const newTask: Task = {
      id: Math.random().toString(), // ID provisório
      ...formData
    };
    
    setTasks([...tasks, newTask]);
    setIsFormOpen(false);
    setFormData({ title: '', description: '', date: '', isActive: true }); // Limpa
    toast.success('Tarefa criada e salva no banco!');
  };

  // Filtra as listas baseada na aba selecionada
  const displayedTasks = tasks.filter(t => activeTab === 'active' ? t.isActive : !t.isActive);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/admin/projects" className="p-2 hover:bg-slate-200 rounded-full transition">
            <FaArrowLeft className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gerenciar Tarefas</h1>
            <p className="text-slate-500 text-sm">Defina o que o usuário vai receber em cada dia.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition font-medium"
        >
          <FaPlus /> Nova Tarefa
        </button>
      </div>

      {/* FORMULÁRIO DE CRIAÇÃO (Aparece ao clicar no botão) */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-indigo-100 mb-8 animate-fade-in-down">
          <h2 className="font-bold text-lg mb-4 text-slate-700 border-b pb-2">Nova Tarefa</h2>
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* 1. NOME */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Tarefa</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Assistir Aula 1"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2. DATA */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Data de Execução</label>
                <input 
                  type="date" 
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              {/* 4. ATIVO OU NÃO (Toggle) */}
              <div className="flex items-end pb-2">
                <div 
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer w-full border ${formData.isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                >
                   <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isActive ? 'bg-green-500 border-green-600' : 'bg-white border-slate-300'}`}>
                      {formData.isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                   </div>
                   <span className={`font-bold text-sm ${formData.isActive ? 'text-green-700' : 'text-red-700'}`}>
                      {formData.isActive ? 'Esta tarefa está ATIVA' : 'Esta tarefa está INATIVA (Rascunho)'}
                   </span>
                </div>
              </div>
            </div>

            {/* 3. DESCRIÇÃO */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Descrição (O que o usuário vai ler)</label>
              <textarea 
                className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={4}
                placeholder="Descreva detalhadamente a missão do dia..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-bold">Salvar Tarefa</button>
            </div>
          </form>
        </div>
      )}

      {/* ABAS DE NAVEGAÇÃO (ATIVOS vs INATIVOS) */}
      <div className="mb-4 border-b border-slate-200 flex gap-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-2 flex items-center gap-2 font-medium transition-all ${
            activeTab === 'active' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FaCheckCircle /> Ativos ({tasks.filter(t => t.isActive).length})
        </button>
        <button 
          onClick={() => setActiveTab('inactive')}
          className={`pb-3 px-2 flex items-center gap-2 font-medium transition-all ${
            activeTab === 'inactive' 
              ? 'border-b-2 border-red-500 text-red-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FaBan /> Inativos ({tasks.filter(t => !t.isActive).length})
        </button>
      </div>

      {/* LISTA DE TAREFAS */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome & Descrição</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap w-32 align-top">
                  <div className="flex flex-col items-center justify-center bg-slate-100 rounded p-2 text-slate-600 font-bold border border-slate-200">
                    <span className="text-xs uppercase">{new Date(task.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                    <span className="text-xl">{new Date(task.date).getDate() + 1}</span> {/* Ajuste de fuso simples */}
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="text-lg font-bold text-slate-800">{task.title}</div>
                  <p className="text-slate-500 text-sm mt-1 whitespace-pre-wrap">{task.description}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3 p-2 hover:bg-indigo-50 rounded"><FaEdit size={16}/></button>
                  <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"><FaTrash size={16}/></button>
                </td>
              </tr>
            ))}
            {displayedTasks.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                  Nenhuma tarefa {activeTab === 'active' ? 'ativa' : 'inativa'} encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}