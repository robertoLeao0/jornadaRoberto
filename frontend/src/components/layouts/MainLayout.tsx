import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Importação dos ícones do React Icons
import { 
  FaUserFriends, FaSignOutAlt, FaCog, FaChartBar, FaBars, 
  FaCheckSquare, FaTrophy, FaHeadset, FaProjectDiagram, FaPlug 
} from 'react-icons/fa';

// --- DEFINIÇÃO DE TIPOS ---
interface LayoutProps {
  children: ReactNode; // O conteúdo da página (Dashboard, Listas, Forms, etc.)
  userRole: 'ADMIN_PLENO' | 'GESTOR_MUNICIPIO' | 'SERVIDOR'; // Quem está logado
}

interface NavLink {
  path: string; // URL do link
  icon: React.ElementType; // Ícone que vai aparecer
  label: string; // Texto do link
}

// --- LINKS DO MENU ---

// 1. Links visíveis apenas para ADMINISTRADORES
const adminNav: NavLink[] = [
  { path: '/dashboard/admin', icon: FaChartBar, label: 'Painel Principal' },
  { path: '/dashboard/admin/users', icon: FaUserFriends, label: 'Usuários' },
  { path: '/dashboard/admin/projects', icon: FaProjectDiagram, label: 'Projetos' },
  { path: '/dashboard/admin/integrations', icon: FaPlug, label: 'Integrações' }, // <--- Novo Link
];

// 2. Links visíveis apenas para SERVIDORES
const servidorNav: NavLink[] = [
  { path: '/dashboard/servidor', icon: FaCheckSquare, label: 'Tarefas' }, // <--- Alterado de "Tarefas" para "Jornada" se preferir
  { path: '/dashboard/servidor/ranking', icon: FaTrophy, label: 'Ranking' },
  { path: '/dashboard/servidor/settings', icon: FaCog, label: 'Configurações' },
  { path: '/dashboard/servidor/support', icon: FaHeadset, label: 'Suporte' },
];

// --- FUNÇÃO DE LOGOUT ---
const handleLogout = () => {
  localStorage.removeItem('accessToken'); // Remove o token
  window.location.href = '/login'; // Força redirecionamento e reload
};

export default function MainLayout({ children, userRole }: LayoutProps) {
  // Controle de abertura/fechamento do menu lateral
  // Começa aberto se a tela for grande (> 768px), fechado em mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  
  // Hook para saber em qual página o usuário está agora
  const location = useLocation();

  // Define quais links mostrar baseado no perfil do usuário
  let navLinks: NavLink[] = [];

  switch (userRole) {
    case 'ADMIN_PLENO': 
      navLinks = adminNav; 
      break;
    case 'GESTOR_MUNICIPIO': 
      // Por enquanto vazio, mas você pode criar uma const gestorNav
      navLinks = []; 
      break;
    case 'SERVIDOR': 
      navLinks = servidorNav; 
      break;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* --- MENU LATERAL (SIDEBAR) --- */}
      <aside 
        className={`bg-slate-900 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col justify-between fixed h-full z-20 shadow-xl`}
      >
        <div>
          {/* 1. TOPO DO MENU (Título e Botão Hambúrguer) */}
          <div className={`flex items-center h-16 border-b border-slate-700 mb-6 ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
            {/* Título só aparece se aberto */}
            {isSidebarOpen && <h1 className="text-lg font-bold tracking-wide">Jornada</h1>}
            
            {/* Botão para abrir/fechar menu */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <FaBars size={18} />
            </button>
          </div>
          
          {/* 2. LISTA DE LINKS DE NAVEGAÇÃO */}
          <nav className="px-2 space-y-1">
            {navLinks.map((link) => {
              
              // --- LÓGICA PARA DESTACAR O LINK ATIVO ---
              
              // A. Identifica se é o link do Dashboard Principal ("/")
              const isRootDashboard = link.path === '/dashboard/admin' || link.path === '/dashboard/servidor' || link.path === '/dashboard/gestor';
              
              // B. Se for Dashboard Principal, a URL tem que ser IDÊNTICA.
              // C. Se for outro (ex: /admin/projects), usamos "startsWith" para que 
              //    páginas internas (/projects/create) mantenham o menu aceso.
              const isActive = isRootDashboard 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center rounded-md transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' // Estilo quando ATIVO
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white' // Estilo padrão
                  } ${isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
                  title={link.label} // Tooltip nativo
                >
                  {/* Ícone */}
                  <link.icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  
                  {/* Texto do Link (só aparece se menu aberto) */}
                  <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* 3. RODAPÉ DO MENU (Botão Sair) */}
        <div className="border-t border-slate-700 p-2">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-md hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition duration-150 w-full ${
                isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'
            }`}
            title="Sair do sistema"
          >
            <FaSignOutAlt size={20} />
            <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      {/* --- ÁREA DE CONTEÚDO PRINCIPAL --- */}
      {/* O 'ml-64' ou 'ml-20' empurra o conteúdo para não ficar embaixo do menu fixo */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-0`}>
        {children}
      </main>
    </div>
  );
}