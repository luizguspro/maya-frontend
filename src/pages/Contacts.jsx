// frontend/src/pages/Contacts.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Download, Upload, MoreVertical,
  Phone, Mail, MessageCircle, Calendar, Tag, MapPin, Building2,
  Edit2, Trash2, X, Check, ChevronDown, Settings, FileSpreadsheet,
  PlusCircle, Save, Eye, EyeOff, Hash, Type, DollarSign, CalendarDays,
  ToggleLeft, Link2, List, RefreshCw, AlertCircle
} from 'lucide-react';
import { contactsService } from '../services/api';

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Contatos reais do banco
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Formulário de novo contato
  const [newContact, setNewContact] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    empresa: '',
    cpf_cnpj: '',
    cargo: ''
  });

  // Buscar contatos
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await contactsService.getAll({
        search: searchTerm,
        page: currentPage
      });

      console.log('Resposta da API:', response.data);

      // Corrigir o mapeamento dos dados
      if (response.data && response.data.data) {
        setContacts(response.data.data);
        setTotalContacts(response.data.pagination?.total || 0);
      } else {
        setContacts([]);
        setTotalContacts(0);
      }

    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
      setError('Erro ao carregar contatos');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [searchTerm, currentPage]);

  // Tags disponíveis
  const availableTags = ['Cliente VIP', 'Prospect', 'Lead Frio', 'Em Negociação', 'Quente', 'WhatsApp', 'Instagram'];

  // Criar novo contato
  const handleCreateContact = async () => {
    try {
      if (!newContact.nome) {
        alert('Nome é obrigatório');
        return;
      }

      await contactsService.create(newContact);
      
      setShowCreateModal(false);
      setNewContact({
        nome: '',
        email: '',
        telefone: '',
        whatsapp: '',
        empresa: '',
        cpf_cnpj: '',
        cargo: ''
      });
      
      fetchContacts();
      
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar contato');
    }
  };

  // Excluir contato
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) return;
    
    try {
      await contactsService.delete(id);
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      fetchContacts();
    } catch (err) {
      alert('Erro ao excluir contato');
    }
  };

  // Exportar contatos
  const handleExport = async () => {
    try {
      const response = await contactsService.export();
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
    } catch (err) {
      alert('Erro ao exportar contatos');
    }
  };

  // Formatar telefone
  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '')
      .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'quente': return 'bg-red-100 text-red-800';
      case 'morno': return 'bg-yellow-100 text-yellow-800';
      case 'frio': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando contatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
              <p className="text-sm text-gray-500">
                {totalContacts > 0 
                  ? `${totalContacts} contatos cadastrados`
                  : 'Nenhum contato ainda'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>Importar</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download size={18} />
                <span>Exportar</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Novo Contato</span>
              </button>
            </div>
          </div>

          {/* Barra de pesquisa */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        {/* Lista de contatos */}
        <div className="flex-1 p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-600">{error}</span>
            </div>
          )}

          {contacts.length === 0 && !isLoading ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum contato encontrado</h3>
              <p className="text-gray-500 mb-4">
                Comece importando uma lista ou criando manualmente
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Upload size={18} />
                  <span>Importar CSV</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Criar Contato</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contatos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Interação
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contact.company || '-'}</div>
                        <div className="text-sm text-gray-500">{contact.role || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {contact.phone && (
                            <button className="text-gray-400 hover:text-gray-600">
                              <Phone size={16} />
                            </button>
                          )}
                          {contact.email && (
                            <button className="text-gray-400 hover:text-gray-600">
                              <Mail size={16} />
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <MessageCircle size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.value > 0 
                          ? new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(contact.value)
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.lastContact || 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.id);
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {totalContacts > 20 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * 20) + 1} a {Math.min(currentPage * 20, totalContacts)} de {totalContacts} contatos
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * 20 >= totalContacts}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detalhes do contato selecionado */}
        {selectedContact && (
          <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Detalhes do Contato</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h3>
                <p className="text-sm text-gray-500">{selectedContact.company}</p>
              </div>

              <div className="space-y-3">
                {selectedContact.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedContact.email}`} className="text-sm text-blue-600 hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                )}

                {selectedContact.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${selectedContact.phone}`} className="text-sm text-blue-600 hover:underline">
                      {formatPhone(selectedContact.phone)}
                    </a>
                  </div>
                )}

                {selectedContact.source && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Origem: {selectedContact.source}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Score</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedContact.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{selectedContact.score}%</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <MessageCircle size={18} />
                  <span>Iniciar Conversa</span>
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                  <Edit2 size={18} />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de criar contato */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Novo Contato</h2>
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
                  Nome *
                </label>
                <input
                  type="text"
                  value={newContact.nome}
                  onChange={(e) => setNewContact({...newContact, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="joao@empresa.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={newContact.telefone}
                    onChange={(e) => setNewContact({...newContact, telefone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={newContact.whatsapp}
                    onChange={(e) => setNewContact({...newContact, whatsapp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={newContact.empresa}
                  onChange={(e) => setNewContact({...newContact, empresa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da Empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={newContact.cargo}
                  onChange={(e) => setNewContact({...newContact, cargo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Diretor"
                />
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
                onClick={handleCreateContact}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Contato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;