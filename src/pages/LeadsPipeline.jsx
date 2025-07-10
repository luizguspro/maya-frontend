// src/pages/LeadsPipeline.jsx
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Phone, Mail, MessageSquare,
  Clock, Calendar, User, Building2, Tag, DollarSign, Star,
  ChevronDown, ArrowRight, Activity, FileText, Send, Paperclip,
  Check, X, AlertCircle, TrendingUp, Zap, Instagram, Facebook,
  MessageCircle, ListTodo, Trash2, Edit
} from 'lucide-react';
import { pipelineStages } from '../data/mockData';

const LeadsPipeline = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('activity');
  const [draggedLead, setDraggedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [hoveredLead, setHoveredLead] = useState(null);

  // Pipeline inicial com dados mockados
  const [pipeline, setPipeline] = useState([
    {
      ...pipelineStages[0],
      leads: [
        {
          id: 1,
          name: 'Tech Startup Inc',
          contact: 'João Silva',
          value: 45000,
          score: 92,
          tags: ['SaaS', 'B2B', 'Enterprise'],
          lastContact: '2 horas atrás',
          lastChannel: 'whatsapp',
          phone: '+55 11 98765-4321',
          email: 'joao@techstartup.com',
          source: 'Website',
          notes: [
            { id: 1, text: 'Interessado em plano Enterprise. Quer agendar demo.', time: '2 horas atrás', user: 'Ana Silva' }
          ]
        },
        {
          id: 2,
          name: 'E-commerce Fashion',
          contact: 'Maria Santos',
          value: 25000,
          score: 78,
          tags: ['E-commerce', 'Varejo'],
          lastContact: '5 horas atrás',
          lastChannel: 'instagram',
          phone: '+55 11 91234-5678',
          email: 'maria@fashionstore.com',
          source: 'Instagram'
        }
      ]
    },
    {
      ...pipelineStages[1],
      leads: [
        {
          id: 3,
          name: 'Consultoria Alpha',
          contact: 'Carlos Mendes',
          value: 80000,
          score: 85,
          tags: ['Consultoria', 'Premium'],
          lastContact: '1 dia atrás',
          lastChannel: 'email',
          phone: '+55 11 93456-7890',
          email: 'carlos@alpha.com',
          source: 'Indicação'
        }
      ]
    },
    {
      ...pipelineStages[2],
      leads: [
        {
          id: 4,
          name: 'Marketing Agency Pro',
          contact: 'Beatriz Costa',
          value: 35000,
          score: 90,
          tags: ['Agência', 'Marketing Digital'],
          lastContact: '3 horas atrás',
          lastChannel: 'messenger',
          phone: '+55 11 94567-8901',
          email: 'beatriz@marketingpro.com',
          source: 'Facebook Ads'
        }
      ]
    },
    {
      ...pipelineStages[3],
      leads: [
        {
          id: 5,
          name: 'Global Tech Solutions',
          contact: 'Ricardo Lima',
          value: 120000,
          score: 95,
          tags: ['Enterprise', 'Internacional'],
          lastContact: '6 horas atrás',
          lastChannel: 'phone',
          phone: '+55 11 95678-9012',
          email: 'ricardo@globaltech.com',
          source: 'Evento'
        }
      ]
    },
    {
      ...pipelineStages[4],
      leads: []
    },
    {
      ...pipelineStages[5],
      leads: []
    }
  ]);

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

  const handleDragStart = (e, lead, stageId) => {
    setDraggedLead({ lead, stageId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    if (draggedLead) {
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
      setDraggedLead(null);
    }
  };

  const addNote = () => {
    if (newNote.trim() && selectedLead) {
      const newNoteObj = {
        id: Date.now(),
        text: newNote,
        time: 'Agora',
        user: 'Ana Silva'
      };
      
      const updatedPipeline = pipeline.map(stage => ({
        ...stage,
        leads: stage.leads.map(lead => 
          lead.id === selectedLead.id 
            ? { ...lead, notes: [...(lead.notes || []), newNoteObj] }
            : lead
        )
      }));
      
      setPipeline(updatedPipeline);
      setNewNote('');
      
      setSelectedLead({
        ...selectedLead,
        notes: [...(selectedLead.notes || []), newNoteObj]
      });
    }
  };

  const totalValue = pipeline.reduce((sum, stage) => 
    sum + stage.leads.reduce((stageSum, lead) => stageSum + lead.value, 0), 0
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Pipeline View */}
      <div className={`flex-1 overflow-hidden ${selectedLead ? 'lg:mr-96' : ''}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
              <p className="text-sm text-gray-500">
                Valor total: R$ {totalValue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={18} />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus size={18} />
                <span>Novo Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Kanban */}
        <div className="flex overflow-x-auto p-6 space-x-4" style={{ height: 'calc(100vh - 88px)' }}>
          {pipeline.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                {/* Stage Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                    <span className="text-sm text-gray-500">{stage.leads.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-full h-1 ${stage.color} rounded-full`}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stage.description}</p>
                </div>

                {/* Leads */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {stage.leads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead, stage.id)}
                      onClick={() => setSelectedLead(lead)}
                      onMouseEnter={() => setHoveredLead(lead.id)}
                      onMouseLeave={() => setHoveredLead(null)}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 relative group"
                    >
                      {/* Ações Rápidas - aparecem no hover */}
                      {hoveredLead === lead.id && (
                        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1 z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Adicionar tarefa para: ' + lead.name);
                            }}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Adicionar Tarefa"
                          >
                            <ListTodo size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Agendar reunião com: ' + lead.name);
                            }}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Agendar Reunião"
                          >
                            <Calendar size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Editar: ' + lead.name);
                            }}
                            className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm('Remover ' + lead.name + ' do pipeline?')) {
                                // Remover lead
                              }
                            }}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{lead.name}</h4>
                          <p className="text-sm text-gray-500 flex items-center">
                            <User size={14} className="mr-1" />
                            {lead.contact}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          R$ {lead.value.toLocaleString('pt-BR')}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{lead.score}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {lead.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          {getChannelIcon(lead.lastChannel)}
                          <span className="ml-1">{lead.lastContact}</span>
                        </span>
                        <span className="text-gray-400">{lead.source}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Indicador de mais cards */}
                  {stage.leads.length > 5 && (
                    <div className="text-center py-2 text-sm text-gray-500">
                      <p className="flex items-center justify-center space-x-1">
                        <ChevronDown size={16} className="animate-bounce" />
                        <span>{stage.leads.length} leads nesta etapa</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Lead Button */}
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span className="text-sm">Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Details Panel */}
      {selectedLead && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-40">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                <p className="text-sm text-gray-500">{selectedLead.contact}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lead Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={18} />
                <span className="text-gray-700">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-gray-700">{selectedLead.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="text-gray-400" size={18} />
                <span className="text-lg font-semibold text-gray-900">
                  R$ {selectedLead.value.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="text-gray-400" size={18} />
                <span className="text-gray-700">Origem: {selectedLead.source}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {selectedLead.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {['activity', 'tasks', 'info'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'activity' && 'Conversas'}
                  {tab === 'tasks' && 'Tarefas'}
                  {tab === 'info' && 'Informações'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'activity' && (
              <div className="p-4">
                {/* Activity Feed */}
                <div className="space-y-4 mb-4">
                  {selectedLead.notes?.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900">{note.user}</span>
                        <span className="text-xs text-gray-500">{note.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{note.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Adicionar nota..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Paperclip size={18} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Calendar size={18} />
                          </button>
                        </div>
                        <button
                          onClick={addNote}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Send size={16} />
                          <span className="text-sm">Enviar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="text-yellow-600" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">Enviar proposta</p>
                        <p className="text-sm text-gray-500">Vence amanhã</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Check size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Phone className="text-blue-600" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">Ligar para follow-up</p>
                        <p className="text-sm text-gray-500">Em 2 dias</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Score do Lead</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            selectedLead.score >= 80 ? 'bg-green-500' : 
                            selectedLead.score >= 60 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedLead.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{selectedLead.score}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Último contato</label>
                    <p className="text-gray-900 flex items-center mt-1">
                      {getChannelIcon(selectedLead.lastChannel)}
                      <span className="ml-2">{selectedLead.lastContact}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Canais conectados</label>
                    <div className="flex items-center space-x-3 mt-2">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                      <Instagram className="w-6 h-6 text-pink-600" />
                      <Facebook className="w-6 h-6 text-blue-600" />
                      <Mail className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPipeline;