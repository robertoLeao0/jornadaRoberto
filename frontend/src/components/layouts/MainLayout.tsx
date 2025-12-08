import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUserFriends, FaSignOutAlt, FaCog, FaChartBar, FaBars, 
  FaCheckSquare, FaTrophy, FaHeadset, FaProjectDiagram 
} from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
  userRole: 'ADMIN_PLENO' | 'GESTOR_MUNICIPIO' | 'SERVIDOR';
}

interface NavLink {
  path: string;
  icon: React.ElementType;
  label: string;
}

// Links do Admin
const adminNav: NavLink[] = [
  { path: '/dashboard/admin', icon: FaChartBar, label: 'Painel Principal' },
  { path: '/dashboard/admin/users', icon: FaUserFriends, label: 'Usuários' },
  { path: '/dashboard/admin/projects', icon: FaProjectDiagram, label: 'Projetos' },
];

// Links do Servidor
const servidorNav: NavLink[] = [
  { path: '/dashboard/servidor', icon: FaCheckSquare, label: 'Tarefas' },
  { path: '/dashboard/servidor/ranking', icon: FaTrophy, label: 'Ranking' },
  { path: '/dashboard/servidor/settings', icon: FaCog, label: 'Configurações' },
  { path: '/dashboard/servidor/support', icon: FaHeadset, label: 'Suporte' },
];

const handleLogout = () => {
  localStorage.removeItem('accessToken');
  window.location.href = '/login';
};

export default function MainLayout({ children, userRole }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const location = useLocation();

  let navLinks: NavLink[] = [];

  switch (userRole) {
    case 'ADMIN_PLENO': navLinks = adminNav; break;
    case 'GESTOR_MUNICIPIO': navLinks = []; break;
    case 'SERVIDOR': navLinks = servidorNav; break;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* MENU LATERAL */}
      <aside 
        className={`bg-slate-900 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col justify-between fixed h-full z-20 shadow-xl`}
      >
        <div>
          {/* TOPO DO MENU */}
          <div className={`flex items-center h-16 border-b border-slate-700 mb-6 ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
            {isSidebarOpen && <h1 className="text-lg font-bold tracking-wide">Jornada</h1>}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              <FaBars size={18} />
            </button>
          </div>
          
          {/* LISTA DE LINKS */}
          <nav className="px-2 space-y-1">
            {navLinks.map((link) => {
              
              // --- CORREÇÃO DA LÓGICA DE ATIVAÇÃO ---
              // 1. Verifica se é um link "Raiz" (Dashboard principal)
              const isRootDashboard = link.path === '/dashboard/admin' || link.path === '/dashboard/servidor' || link.path === '/dashboard/gestor';
              
              // 2. Se for Raiz, a comparação deve ser EXATA (===).
              // 3. Se for outro link (ex: Projetos), usamos STARTSWITH para manter aceso nas sub-páginas (/create, /tasks).
              const isActive = isRootDashboard 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center rounded-md transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  } ${isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
                  title={link.label}
                >
                  <link.icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* RODAPÉ DO MENU (LOGOUT) */}
        <div className="border-t border-slate-700 p-2">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-md hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition duration-150 w-full ${
                isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'
            }`}
          >
            <FaSignOutAlt size={20} />
            <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-0`}>
        {children}
      </main>
    </div>
  );
}