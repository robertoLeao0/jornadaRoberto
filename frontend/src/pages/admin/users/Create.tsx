import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { useQueryClient } from '@tanstack/react-query'; // <--- NOVA IMPORTAÇÃO

export default function AdminCreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SERVIDOR');
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // <--- NOVO HOOK

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', {
        name,
        email,
        password,
        role,
      });
      
      toast.success('Usuário cadastrado com sucesso!'); 
      
      // 1. Invalida o cache da lista de usuários para garantir que o novo apareça
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      
      // 2. REDIRECIONA para a lista, e não para o painel principal
      navigate('/dashboard/admin/users'); 

    } catch (error) {
      console.error(error);
      toast.error('Erro ao cadastrar. Verifique os dados ou permissões.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Cadastrar Novo Usuário</h1>
      
      {/* ... (o restante do formulário é o mesmo) ... */}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
          <input 
            className="w-full border rounded px-3 py-2 mt-1"
            value={name} onChange={e => setName(e.target.value)} required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">E-mail</label>
          <input 
            type="email" className="w-full border rounded px-3 py-2 mt-1"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Senha Inicial</label>
          <input 
            type="password" className="w-full border rounded px-3 py-2 mt-1"
            value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Perfil de Acesso</label>
          <select 
            className="w-full border rounded px-3 py-2 mt-1 bg-white"
            value={role} onChange={e => setRole(e.target.value)}
          >
            <option value="SERVIDOR">Servidor (Padrão)</option>
            <option value="GESTOR_MUNICIPIO">Gestor de Município</option>
            <option value="ADMIN_PLENO">Admin Pleno</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-medium"
        >
          Criar Usuário
        </button>
        
        <button 
          type="button"
          onClick={() => navigate('/dashboard/admin/users')} // Ajustado para voltar para a lista
          className="w-full text-slate-500 py-2 text-sm hover:underline"
        >
          Cancelar e Voltar
        </button>
      </form>
    </div>
  );
} 