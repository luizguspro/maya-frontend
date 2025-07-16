// frontend/src/pages/LeadsPipeline.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Phone, Mail, MessageSquare,
  Clock, Calendar, User, Building2, Tag, DollarSign, Star,
  ChevronDown, ArrowRight, Activity, FileText, Send, Paperclip,
  Check, X, AlertCircle, TrendingUp, Zap, Instagram, Facebook,
  MessageCircle, ListTodo, Trash2, Edit, RefreshCw, Users,
  Target, BarChart3, Settings, Download, Upload, ChevronRight,
  Eye, EyeOff, Briefcase, MapPin, Hash, CalendarDays, Timer
} from 'lucide-react';
import { pipelineService, contactsService } from '../services/api';

// CSS para scrollbar customizada
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const LeadsPipeline = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [draggedLead, setDraggedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [hoveredLead, setHoveredLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStageForNew, setSelectedStageForNew] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Pipeline com dados reais
  const [pipeline, setPipeline] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  // Formulário de novo negócio
  const [newDeal, setNewDeal] = useState({
    contato_id: '',
    titulo: '',
    valor: '',
    origem: 'manual'
  });

  // Buscar dados do pipeline
  const fetchPipeline = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await pipelineService.getDeals();
      setPipeline(response.data);
      
    } catch (err) {
      console.error('Erro ao buscar pipeline:', err);
      setError('Erro ao carregar pipeline');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar contatos para o modal de criar negócio
  const fetchContacts = async () => {
    try {
      const response = await contactsService.getAll({ limit: 100 });
      setContacts(response.data.data || []);
    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
    }
  };

  useEffect(() => {
    fetchPipeline();
    fetchContacts();
  }, []);

  // Ícone do canal
  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'messenger': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'email': return <Mail className="w-4 h-4 text-gray-600" />;
      case 'phone': return <Phone className="w-4 h-4 text-gray-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  // Cor do score
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Drag & Drop
  const handleDragStart = (e, lead, stageId) => {
    setDraggedLead({ lead, stageId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStageId) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stageId !== targetStageId) {
      try {
        await pipelineService.moveDeal(draggedLead.lead.id, targetStageId);
        
        // Atualizar o estado local
        const newPipeline = pipeline.map(stage => {
          if (stage.id === draggedLead.stageId) {
            return {
              ...stage,
              leads: stage.leads.filter(lead => lead.id !== draggedLead.lead.id)
            };
          }
          if (stage.id === targetStageId) {
            return {
              ...stage,
              leads: [...stage.leads, draggedLead.lead]
            };
          }
          return stage;
        });
        setPipeline(newPipeline);
      } catch (error) {
        console.error('Erro ao mover negócio:', error);
        fetchPipeline();
      }
      setDraggedLead(null);
    }
  };

  // Criar novo negócio
  const handleCreateDeal = async () => {
    try {
      if (!newDeal.contato_id) {
        alert('Selecione um contato');
        return;
      }

      await pipelineService.createDeal({
        ...newDeal,
        etapa_id: selectedStageForNew,
        valor: parseFloat(newDeal.valor) || 0
      });

      setShowCreateModal(false);
      setNewDeal({
        contato_id: '',
        titulo: '',
        valor: '',
        origem: 'manual'
      });
      setSelectedStageForNew(null);
      fetchPipeline();
    } catch (err) {
      alert('Erro ao criar negócio: ' + (err.response?.data?.error || err.message));
    }
  };

  // Adicionar nota
  const addNote = () => {
    if (newNote.trim() && selectedLead) {
      // TODO: Implementar API para adicionar notas
      console.log('Adicionar nota:', newNote);
      setNewNote('');
    }
  };

  // Calcular métricas
  const calculateMetrics = () => {
    let totalValue = 0;
    let totalDeals = 0;
    let avgValue = 0;
    let conversionRate = 0;

    pipeline.forEach(stage => {
      totalDeals += stage.leads.length;
      stage.leads.forEach(lead => {
        totalValue += lead.value || 0;
      });
    });

    if (totalDeals > 0) {
      avgValue = totalValue / totalDeals;
      const wonStage = pipeline.find(s => s.title === 'Ganhos');
      if (wonStage) {
        conversionRate = (wonStage.leads.length / totalDeals) * 100;
      }
    }

    return { totalValue, totalDeals, avgValue, conversionRate };
  };

  const metrics = calculateMetrics();

  // Filtrar leads
  const getFilteredPipeline = () => {
    if (!searchTerm && filterStage === 'all') return pipeline;

    return pipeline.map(stage => ({
      ...stage,
      leads: stage.leads.filter(lead => {
        const matchesSearch = !searchTerm || 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStage = filterStage === 'all' || stage.id === filterStage;
        
        return matchesSearch && matchesStage;
      })
    }));
  };

  const filteredPipeline = getFilteredPipeline();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Pipeline View */}
        <div className={`flex-1 overflow-hidden ${selectedLead ? 'lg:mr-96' : ''}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
                <p className="text-sm text-gray-500">
                  Gerencie seus negócios através do funil de vendas
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchPipeline}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Atualizar"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Filtros"
                >
                  <Filter size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Download size={20} />
                </button>
                <button
                  onClick={() => {
                    setSelectedStageForNew(pipeline[0]?.id);
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Novo Negócio</span>
                </button>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total em Negócios</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(metrics.totalValue)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Negócios Ativos</p>
                    <p className="text-xl font-bold text-gray-900">{metrics.totalDeals}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Ticket Médio</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(metrics.avgValue)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Taxa de Conversão</p>
                    <p className="text-xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Barra de pesquisa e filtros */}
            {showFilters && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, contato ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as etapas</option>
                  {pipeline.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pipeline Stages */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
              <div className="flex space-x-4 h-full" style={{ minWidth: `${filteredPipeline.length * 320 + (filteredPipeline.length - 1) * 16}px` }}>
                {filteredPipeline.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex-shrink-0 w-80 h-[calc(100vh-280px)]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
                      {/* Stage Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {stage.leads.length}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedStageForNew(stage.id);
                              setShowCreateModal(true);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{stage.description}</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                              notation: 'compact',
                              maximumFractionDigits: 1
                            }).format(
                              stage.leads.reduce((sum, lead) => sum + lead.value, 0)
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Leads */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar" style={{ maxHeight: 'calc(100% - 120px)' }}>
                        {stage.leads.length > 0 ? (
                          stage.leads.map((lead) => (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead, stage.id)}
                              onClick={() => setSelectedLead(lead)}
                              onMouseEnter={() => setHoveredLead(lead.id)}
                              onMouseLeave={() => setHoveredLead(null)}
                              className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-all hover:shadow-md border border-gray-200 relative group"
                            >
                              {/* Card Content */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 text-sm truncate">
                                    {lead.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate">{lead.contact}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(lead.score)}`}>
                                  {lead.score}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="font-medium text-gray-900">
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                  }).format(lead.value)}
                                </span>
                                <div className="flex items-center text-gray-500">
                                  {getChannelIcon(lead.lastChannel)}
                                  <span className="ml-1">{lead.lastContact}</span>
                                </div>
                              </div>

                              {lead.tags && lead.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {lead.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {lead.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{lead.tags.length - 2}</span>
                                  )}
                                </div>
                              )}

                              {/* Ações rápidas no hover */}
                              <div className={`absolute top-2 right-2 flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1 transition-opacity ${
                                hoveredLead === lead.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                              }`}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `tel:${lead.phone}`;
                                  }}
                                  className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                  title="Ligar"
                                >
                                  <Phone size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `https://wa.me/${lead.phone.replace(/\D/g, '')}`;
                                  }}
                                  className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implementar ação
                                  }}
                                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Adicionar tarefa"
                                >
                                  <ListTodo size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum negócio nesta etapa</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Detalhes do Lead */}
        {selectedLead && (
          <div className="w-96 bg-white border-l border-gray-200 shadow-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Detalhes do Negócio</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {['details', 'activity', 'tasks', 'notes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'details' && 'Detalhes'}
                    {tab === 'activity' && 'Atividade'}
                    {tab === 'tasks' && 'Tarefas'}
                    {tab === 'notes' && 'Notas'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'details' && (
                <div className="p-6 space-y-6">
                  {/* Informações do Lead */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedLead.name}</h3>
                    <p className="text-sm text-gray-500">{selectedLead.contact}</p>
                  </div>

                  {/* Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Score do Lead</span>
                      <span className={`text-sm font-bold ${getScoreColor(selectedLead.score)}`}>
                        {selectedLead.score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${selectedLead.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Valor do Negócio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(selectedLead.value)}
                    </p>
                  </div>

                  {/* Informações de Contato */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Informações de Contato</h4>
                    
                    {selectedLead.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {selectedLead.email}
                        </a>
                      </div>
                    )}

                    {selectedLead.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {selectedLead.phone}
                        </a>
                      </div>
                    )}

                    {selectedLead.source && (
                      <div className="flex items-center space-x-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Origem: {selectedLead.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {selectedLead.tags && selectedLead.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="space-y-2 pt-4">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <MessageCircle size={18} />
                      <span>Iniciar Conversa</span>
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <Calendar size={18} />
                      <span>Agendar Reunião</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-400">
                      <Activity className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma atividade registrada</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="p-6">
                  <button className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center space-x-2 text-gray-600">
                    <Plus size={18} />
                    <span>Adicionar Tarefa</span>
                  </button>
                  <div className="mt-4 text-center py-8 text-gray-400">
                    <ListTodo className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Nenhuma tarefa pendente</p>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addNote()}
                        placeholder="Adicionar uma nota..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={addNote}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma nota adicionada</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal - Criar Novo Negócio */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Novo Negócio</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contato *
                  </label>
                  <select
                    value={newDeal.contato_id}
                    onChange={(e) => setNewDeal({...newDeal, contato_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um contato</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} - {contact.company || 'Sem empresa'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título do Negócio
                  </label>
                  <input
                    type="text"
                    value={newDeal.titulo}
                    onChange={(e) => setNewDeal({...newDeal, titulo: e.target.value})}
                    placeholder="Ex: Proposta de Software"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={newDeal.valor}
                    onChange={(e) => setNewDeal({...newDeal, valor: e.target.value})}
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origem
                  </label>
                  <select
                    value={newDeal.origem}
                    onChange={(e) => setNewDeal({...newDeal, origem: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="manual">Manual</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="website">Website</option>
                    <option value="indicacao">Indicação</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Etapa
                  </label>
                  <select
                    value={selectedStageForNew}
                    onChange={(e) => setSelectedStageForNew(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {pipeline.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateDeal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Negócio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeadsPipeline;