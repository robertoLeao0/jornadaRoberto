import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa'; // <--- NOVAS IMPORTAÇÕES
import api from '../../../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN_PLENO' | 'GESTOR_MUNICIPIO' | 'SERVIDOR'; 
};

const roleLabels: Record<User['role'], string> = {
  ADMIN_PLENO: 'Admin Pleno',
  GESTOR_MUNICIPIO: 'Gestor Municipal',
  SERVIDOR: 'Servidor',
};

export default function AdminUsersList() {
  const queryClient = useQueryClient();
  
  // 1. Query para buscar usuários
  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ['users-list'],
    queryFn: async () => {
      const { data } = await api.get('/users'); 
      return data;
    },
  });
  
  // 2. Mutation para apagar usuário (Soft Delete)
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => api.delete(`/users/${userId}`),
    onSuccess: () => {
      toast.success('Usuário desativado (soft delete)!');
      queryClient.invalidateQueries({ queryKey: ['users-list'] }); // Recarrega a lista
    },
    onError: () => {
      toast.error('Erro ao desativar usuário. Verifique as permissões.');
    }
  });

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Tem certeza que deseja desativar o usuário ${userName}?`)) {
      deleteMutation.mutate(userId);
    }
  };


  if (isLoading) {
    return <div className="p-6">Carregando lista de usuários...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Erro ao carregar a lista de usuários.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Gerenciamento de Usuários</h1>
          <p className="text-slate-500">Lista completa de todos os usuários do sistema.</p>
        </div>
        <Link 
          to="/dashboard/admin/users/create" 
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition font-medium text-sm"
        >
          + Novo Usuário
        </Link>
      </header>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 bg-slate-50 border-b">
              <th className="py-3 px-4">Nome</th>
              <th className="py-3 px-4">E-mail</th>
              <th className="py-3 px-4">Perfil</th>
              <th className="py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((user) => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">{user.name}</td>
                <td className="py-3 px-4 text-slate-600">{user.email}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN_PLENO' ? 'bg-red-100 text-red-800' :
                    user.role === 'GESTOR_MUNICIPIO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-1">
                  {/* Botão de Edição (Lápis) */}
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition"
                    title="Editar Usuário"
                    // onClick={() => navigate(`/dashboard/admin/users/edit/${user.id}`)} 
                  >
                    <FaPencilAlt size={14} /> 
                  </button>
                  {/* Botão de Apagar (Lixeira) */}
                  <button 
                    onClick={() => handleDelete(user.id, user.name)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                    disabled={user.role === 'ADMIN_PLENO'} // Não permite apagar o Admin Pleno
                    title="Apagar Usuário"
                  >
                    <FaTrashAlt size={14} /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(users?.length === 0) && (
             <p className="p-4 text-slate-500">Nenhum usuário cadastrado.</p>
        )}
      </div>
    </div>
  );
}