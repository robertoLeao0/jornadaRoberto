import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Função auxiliar para chamadas API (se você já tiver um api.ts configurado com axios, pode usar ele)
const API = async (path: string, opts: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken'); // Ou como você salva o token
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string,string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Ajuste a URL base se necessário (ex: http://localhost:3000)
  // Se você configurou proxy no vite, pode deixar assim. 
  // Se não, coloque a URL completa: `http://localhost:3000${path}`
  const baseUrl = 'http://localhost:3000'; 
  const res = await fetch(`${baseUrl}${path}`, { headers, ...opts });
  
  const text = await res.text().catch(() => '');
  let body: any = text;
  try { body = JSON.parse(text); } catch {}
  return { ok: res.ok, status: res.status, body };
};

export default function AdminIntegrations() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [setting, setSetting] = useState<any>(null);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [webhookSecret, setWebhookSecret] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testResult, setTestResult] = useState<any>(null);

  // Caminho relativo do webhook
  const webhookPath = '/api/integrations/manychat/webhook';

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  async function fetchProjects() {
    setLoading(true);
    // Ajuste a rota se seu controller de projetos for diferente
    const res = await API('/api/projects'); 
    
    if (res.ok && Array.isArray(res.body)) {
      setProjects(res.body);
      // Se tiver projetos e nenhum selecionado, seleciona o primeiro
      if (res.body.length && !selectedProjectId) setSelectedProjectId(res.body[0].id);
    }
    setLoading(false);
    // Busca configs logo em seguida (ou usa useEffect dependente do selectedProjectId)
    if(res.body.length > 0) fetchSetting(res.body[0].id);
  }

  async function fetchSetting(projId = selectedProjectId) {
    // Se não tiver projeto selecionado, não busca
    if(!projId) return;

    setLoading(true);
    const query = `?projectId=${encodeURIComponent(projId)}`;
    const res = await API(`/api/integrations/settings/manychat${query}`);
    
    if (res.ok && res.body) {
      setSetting(res.body);
      setEnabled(Boolean(res.body.enabled));
      setWebhookSecret(res.body.webhookSecret ?? '');
    } else {
      setSetting(null);
      setEnabled(false);
      setWebhookSecret('');
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      name: 'manychat', // Nome fixo do provider
      projectId: selectedProjectId || null,

      enabled,
      webhookSecret,
      configJson: {}, // Futuro: guardar tokens, etc.
    };
    
    const res = await API('/api/integrations/settings/upsert', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    setSaving(false);
    if (res.ok) {
      toast.success('Configuração salva com sucesso!');
      fetchSetting();
    } else {
      toast.error('Erro ao salvar: ' + JSON.stringify(res.body));
    }
  }

  function buildWebhookUrl() {
    // Retorna URL completa para copiar
    // Ajuste se seu backend rodar em porta diferente do front em produção
    // Para dev local, geralmente usamos o localhost:3000 do back
    return `http://localhost:3000${webhookPath}`;
  }

  function copyWebhookUrl() {
    const url = buildWebhookUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast.info('URL copiada para a área de transferência!');
    }).catch(() => {
      toast.error('Falha ao copiar URL.');
    });
  }

  async function handleTestWebhook() {
    setTesting(true);
    setTestResult(null);

    const payload = {
      // Simula payload do ManyChat
      subscriber: { id: `test_user_${Date.now()}`, phone: '5511999999999', name: 'Usuário Teste' },
      message: { text: 'Teste via Painel Admin', attachments: [] },
      // Envia metadata para simular o contexto
      meta: { 
        projectId: selectedProjectId, 
        dayNumber: Number(dayNumber || 1) 
      },
    };

    // Atenção: Esta rota de teste deve existir no backend ou você chama a rota real
    const res = await API('/api/integrations/manychat/webhook/test', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setTesting(false);
    setTestResult(res);
    
    if (res.ok) {
      toast.success('Teste enviado! Verifique o resultado abaixo.');
    } else {
      toast.error('O teste falhou. Verifique o console.');
    }
  }

  // Monitora mudança de select para carregar configs
  useEffect(() => {
    if(selectedProjectId) {
        fetchSetting(selectedProjectId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Integrações</h1>
        <p className="text-gray-500 mt-2">Configure o webhook do ManyChat e teste a recepção de mensagens.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Configuração ManyChat</h2>
        
        {/* Seleção de Projeto */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Projeto (Jornada)</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            <option value="">Selecione um projeto...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.nome || `Projeto #${p.id}`}</option>
            ))}
          </select>
        </div>

        {/* Ativar/Desativar */}
        <div className="mb-4 flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">Integração Ativa</span>
            </label>
        </div>

        {/* Webhook Secret */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret (Segurança)</label>
          <div className="flex gap-2">
            <input
                type="text"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="Ex: secret_12345"
            />
            <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
                {saving ? 'Salvando...' : 'Salvar Configuração'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Essa chave deve ser configurada no Header do ManyChat como <code>x-webhook-secret</code>.</p>
        </div>

        {/* URL do Webhook */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sua URL de Webhook</label>
            <div className="flex items-center justify-between">
                <code className="text-sm text-indigo-700 break-all">{buildWebhookUrl()}</code>
                <button 
                    onClick={copyWebhookUrl}
                    className="ml-4 text-sm text-gray-600 hover:text-indigo-600 font-medium underline"
                >
                    Copiar
                </button>
            </div>
        </div>
      </div>

      {/* Área de Teste */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Simulador de Teste</h2>
        <p className="text-sm text-gray-600 mb-4">Simule o envio de uma mensagem do ManyChat para este projeto.</p>

        <div className="flex items-end gap-4 mb-4">
            <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia da Jornada</label>
                <input 
                    type="number" 
                    min="1"
                    value={dayNumber} 
                    onChange={e => setDayNumber(Number(e.target.value))} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>
            <button 
                onClick={handleTestWebhook} 
                disabled={testing}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-50"
            >
                {testing ? 'Enviando...' : 'Disparar Webhook de Teste'}
            </button>
        </div>

        {/* Resultado do Teste */}
        {testResult && (
            <div className={`mt-4 p-4 rounded-md border ${testResult.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-bold ${testResult.ok ? 'text-green-800' : 'text-red-800'}`}>
                    Status: {testResult.status} {testResult.ok ? 'SUCCESS' : 'ERROR'}
                </h4>
                <div className="mt-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">Resposta do Servidor:</p>
                    <pre className="text-xs mt-1 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                        {JSON.stringify(testResult.body, null, 2)}
                    </pre>
                </div>
            </div>
        )}
      </div>

    </div>
  );
}