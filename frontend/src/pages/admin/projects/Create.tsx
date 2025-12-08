import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Importante: Importar o Toast

export default function AdminProjectCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    // AQUI ENTRARIA O POST PARA API
    // await api.post('/projects', formData);
    
    // ✅ MUDANÇA AQUI: Usando o Toast em vez de alert
    toast.success('Projeto criado com sucesso!');
    
    // Redireciona de volta para a lista
    navigate('/dashboard/admin/projects'); 
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/admin/projects" className="p-2 hover:bg-slate-200 rounded-full transition">
          <FaArrowLeft className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nova Jornada / Projeto</h1>
          <p className="text-slate-500 text-sm">Crie a "pasta" onde ficarão as tarefas diárias.</p>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="bg-white rounded-lg shadow p-6 border border-slate-100 animate-fade-in-down">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Jornada</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Desafio 21 Dias - Edição 2026"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início do Evento</label>
              <input 
                type="date" 
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Encerramento</label>
              <input 
                type="date" 
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isActive"
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
            />
            <label htmlFor="isActive" className="text-sm text-slate-700 select-none">
              Jornada Ativa (Visível para os participantes entrarem)
            </label>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              to="/dashboard/admin/projects"
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition"
            >
              Cancelar
            </Link>
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm font-medium"
            >
              <FaSave /> Criar Jornada
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}