// src/pages/Contacts.jsx
import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, Download, Upload, MoreVertical,
  Phone, Mail, MessageCircle, Calendar, Tag, MapPin, Building2,
  Edit2, Trash2, X, Check, ChevronDown, Settings, FileSpreadsheet,
  PlusCircle, Save, Eye, EyeOff, Hash, Type, DollarSign, CalendarDays,
  ToggleLeft, Link2, List
} from 'lucide-react';

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Contatos mockados com campos customizados
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'João Pereira',
      email: 'joao@techstartup.com',
      phone: '+55 11 98765-4321',
      company: 'Tech Startup Inc',
      tags: ['Cliente VIP', 'Tecnologia', 'São Paulo'],
      lastContact: '2 horas atrás',
      score: 92,
      customFields: {
        'CPF/CNPJ': '123.456.789-00',
        'Data de Nascimento': '15/03/1985',
        'Orçamento Disponível': 'R$ 50.000',
        'Preferência de Contato': 'WhatsApp',
        'Observações': 'Prefere reuniões pela manhã'
      }
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@fashionstore.com',
      phone: '+55 11 91234-5678',
      company: 'E-commerce Fashion',
      tags: ['E-commerce', 'Varejo', 'Rio de Janeiro'],
      lastContact: '1 dia atrás',
      score: 78,
      customFields: {
        'CPF/CNPJ': '234.567.890/0001-00',
        'Segmento': 'Moda Feminina',
        'Faturamento Mensal': 'R$ 150.000',
        'Número de Funcionários': '25',
        'Usa ERP': 'Sim'
      }
    },
    {
      id: 3,
      name: 'Carlos Mendes',
      email: 'carlos@consultoria.com',
      phone: '+55 11 93456-7890',
      company: 'Consultoria Alpha',
      tags: ['B2B', 'Consultoria', 'Premium'],
      lastContact: '3 dias atrás',
      score: 85,
      customFields: {
        'CPF/CNPJ': '345.678.901-00',
        'Cargo': 'Diretor de TI',
        'Tamanho da Empresa': 'Grande (500+ funcionários)',
        'Budget Anual': 'R$ 2.000.000',
        'Decisor': 'Sim'
      }
    }
  ]);

  // Campos customizados disponíveis
  const [customFieldsSchema, setCustomFieldsSchema] = useState([
    { id: 1, name: 'CPF/CNPJ', type: 'text', icon: Hash, required: true },
    { id: 2, name: 'Data de Nascimento', type: 'date', icon: CalendarDays, required: false },
    { id: 3, name: 'Orçamento Disponível', type: 'currency', icon: DollarSign, required: false },
    { id: 4, name: 'Segmento', type: 'select', icon: List, options: ['Tecnologia', 'Varejo', 'Serviços', 'Indústria'], required: false },
    { id: 5, name: 'Observações', type: 'textarea', icon: Type, required: false }
  ]);

  // Tags disponíveis
  const availableTags = ['Cliente VIP', 'Prospect', 'Lead Frio', 'Em Negociação', 'Tecnologia', 'Varejo', 'Serviços', 'B2B', 'B2C', 'São Paulo', 'Rio de Janeiro', 'Premium'];

  // Tipos de campo disponíveis para campos customizados
  const fieldTypes = [
    { value: 'text', label: 'Texto', icon: Type },
    { value: 'number', label: 'Número', icon: Hash },
    { value: 'currency', label: 'Moeda', icon: DollarSign },
    { value: 'date', label: 'Data', icon: CalendarDays },
    { value: 'select', label: 'Lista', icon: List },
    { value: 'textarea', label: 'Texto Longo', icon: Type },
    { value: 'boolean', label: 'Sim/Não', icon: ToggleLeft },
    { value: 'url', label: 'Link', icon: Link2 }
  ];

  const handleExport = () => {
    // Simular exportação
    alert('Exportando contatos para Excel...');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simular importação
      alert(`Importando arquivo: ${file.name}`);
      setShowImportModal(false);
    }
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      type: 'text',
      icon: Type,
      required: false,
      options: []
    };
    setCustomFieldsSchema([...customFieldsSchema, newField]);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => contact.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
              <p className="text-sm text-gray-500">{filteredContacts.length} contatos encontrados</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFieldsModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Gerenciar campos"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus size={18} />
                <span>Novo Contato</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email ou empresa..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {availableTags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                <Filter size={16} />
                <span>Mais filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Contatos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Contato
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                              +{contact.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 max-w-[100px]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">{contact.score}</span>
                              <span className="text-xs text-gray-500">Score</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  contact.score >= 80 ? 'bg-green-500' : 
                                  contact.score >= 60 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${contact.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {contact.lastContact}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                            <Phone size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                            <Mail size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                            <MessageCircle size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detalhes do Contato */}
          {selectedContact ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-gray-500">{selectedContact.company}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Informações básicas */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="text-gray-400" size={16} />
                  <span className="text-gray-700">{selectedContact.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="text-gray-400" size={16} />
                  <span className="text-gray-700">{selectedContact.phone}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 text-sm rounded-full hover:border-gray-400 hover:text-gray-600 transition-colors">
                    <Plus size={14} className="inline" />
                  </button>
                </div>
              </div>

              {/* Campos Customizados */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Informações Adicionais</h3>
                <div className="space-y-3">
                  {Object.entries(selectedContact.customFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">{key}:</span>
                      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <Mail size={16} />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Selecione um contato para ver os detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Importar Contatos</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Faça upload de um arquivo CSV ou Excel com seus contatos. 
                O arquivo deve conter colunas para Nome, Email, Telefone e Empresa.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Clique para selecionar
                  </span>
                  <span className="text-gray-600"> ou arraste o arquivo aqui</span>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">CSV, XLS ou XLSX (máx. 10MB)</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Baixar modelo
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Campos Customizados */}
      {showFieldsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gerenciar Campos Customizados</h2>
                <button
                  onClick={() => setShowFieldsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {customFieldsSchema.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <field.icon className="text-gray-400" size={20} />
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => {
                        const updated = [...customFieldsSchema];
                        updated[index].name = e.target.value;
                        setCustomFieldsSchema(updated);
                      }}
                      placeholder="Nome do campo"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const updated = [...customFieldsSchema];
                        updated[index].type = e.target.value;
                        const selectedType = fieldTypes.find(t => t.value === e.target.value);
                        updated[index].icon = selectedType.icon;
                        setCustomFieldsSchema(updated);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const updated = [...customFieldsSchema];
                          updated[index].required = e.target.checked;
                          setCustomFieldsSchema(updated);
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-600">Obrigatório</span>
                    </label>
                    <button
                      onClick={() => {
                        setCustomFieldsSchema(customFieldsSchema.filter(f => f.id !== field.id));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addCustomField}
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <PlusCircle size={20} />
                <span>Adicionar novo campo</span>
              </button>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowFieldsModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Campos salvos com sucesso!');
                  setShowFieldsModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Salvar Campos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;