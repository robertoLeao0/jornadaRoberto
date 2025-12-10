import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type Project = {
  id: string;
  name?: string;
  nome?: string; // alguns endpoints usam nome/nome locale
};

export default function CreateTask() {
  const navigate = useNavigate();

  // form state
  const [title, setTitle] = useState(''); // nome da tarefa
  const [description, setDescription] = useState(''); // texto que será enviado (messageText)
  const [date, setDate] = useState(''); // yyyy-mm-dd
  const [time, setTime] = useState('12:00'); // HH:MM
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProjects() {
    setLoadingProjects(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/projects', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const body = await res.json().catch(() => null);
      if (res.ok && Array.isArray(body)) {
        setProjects(body);
        if (body.length > 0) {
          // usa o primeiro como default se nenhum selecionado
          setSelectedProjectId((prev) => prev || body[0].id);
        }
      } else {
        console.error('Erro ao buscar projetos', body);
        toast.warn('Não foi possível carregar projetos. Verifique seu token.');
      }
    } catch (err) {
      console.error('Erro ao buscar projetos', err);
      toast.error('Erro ao buscar projetos.');
    } finally {
      setLoadingProjects(false);
    }
  }

  function buildScheduledISO(dateStr: string, timeStr: string) {
    // dateStr: "YYYY-MM-DD"
    // timeStr: "HH:MM"
    if (!dateStr) return null;
    // combine and produce ISO string in local timezone
    const combined = `${dateStr}T${timeStr}:00`;
    const d = new Date(combined);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId) {
      toast.error('Selecione um projeto antes de criar a tarefa.');
      return;
    }

    if (!date) {
      toast.error('Escolha a data prevista.');
      return;
    }

    setLoading(true);

    const scheduledFor = buildScheduledISO(date, time);
    if (!scheduledFor) {
      toast.error('Data ou hora inválida.');
      setLoading(false);
      return;
    }

    const payload = {
      projectId: selectedProjectId,
      title: title || 'Sem título',
      messageText: description || '',
      scheduledFor, // ISO datetime
      active: !!active,
    };

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/scheduled-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const resBody = await res.text().catch(() => '');
      let parsedBody: any = resBody;
      try {
        parsedBody = JSON.parse(resBody);
      } catch {}

      if (res.ok) {
        toast.success('Mensagem agendada com sucesso!');
        // opcional: navegar para lista de projetos ou para página de integrações
        navigate('/dashboard/admin/projects');
      } else {
        console.error('Erro agendar mensagem', res.status, parsedBody);
        // tenta exibir mensagem detalhada
        const msg = parsedBody?.message || parsedBody?.error || JSON.stringify(parsedBody);
        toast.error('Erro ao agendar mensagem: ' + (msg || res.status));
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Nova Tarefa / Mensagem Agendada</h2>
        <p className="text-gray-500 mt-1">
          Crie uma nova tarefa que será enviada como mensagem no ManyChat na data/hora selecionada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Projeto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Projeto (Jornada)</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loadingProjects}
          >
            <option value="">Selecione um projeto...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.nome || `Projeto #${p.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Nome / Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Tarefa</label>
          <input
            type="text"
            required
            placeholder="Ex: Mensagem Dia 1 - Boas vindas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Descrição / Texto da mensagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Texto da Mensagem</label>
          <textarea
            rows={4}
            placeholder="Aqui você escreve a mensagem que será enviada via ManyChat..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">{active ? 'Ativo' : 'Inativo'}</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 bg-white font-medium"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Salvando...' : 'Criar Tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
}
