// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bell, Plus, Search, Filter, Download,
  Phone, Mail, MoreVertical, Activity, Clock, Users,
  MessageCircle, Calendar, DollarSign, Target, ArrowUp,
  ArrowDown, ChevronRight, Zap, BarChart3, Presentation,
  Trophy, TrendingDown, Award, Star, ChevronUp, Eye
} from 'lucide-react';
import BadgeStatus from '../components/BadgeStatus';
import { mockUser, mockKpis, mockLeads } from '../data/mockData';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [animatedKpis, setAnimatedKpis] = useState({
    leadsQuentes: 0,
    novosLeads: 0,
    visitasAgendadas: 0,
    taxaConversao: 0,
    // KPIs da equipe
    totalVendas: 0,
    metaAtingida: 0,
    ticketMedio: 0,
    cicloVenda: 0
  });

  // Animação dos números dos KPIs
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const interval = duration / steps;

    const timers = [];
    
    // KPIs individuais
    let currentLeads = 0;
    const leadsTimer = setInterval(() => {
      currentLeads += mockKpis.leadsQuentes / steps;
      if (currentLeads >= mockKpis.leadsQuentes) {
        currentLeads = mockKpis.leadsQuentes;
        clearInterval(leadsTimer);
      }
      setAnimatedKpis(prev => ({ ...prev, leadsQuentes: Math.floor(currentLeads) }));
    }, interval);
    timers.push(leadsTimer);

    // KPIs da equipe (para modo apresentação)
    if (isPresentationMode) {
      let currentVendas = 0;
      const targetVendas = 1847000;
      const vendasTimer = setInterval(() => {
        currentVendas += targetVendas / steps;
        if (currentVendas >= targetVendas) {
          currentVendas = targetVendas;
          clearInterval(vendasTimer);
        }
        setAnimatedKpis(prev => ({ ...prev, totalVendas: Math.floor(currentVendas) }));
      }, interval);
      timers.push(vendasTimer);

      let currentMeta = 0;
      const targetMeta = 92;
      const metaTimer = setInterval(() => {
        currentMeta += targetMeta / steps;
        if (currentMeta >= targetMeta) {
          currentMeta = targetMeta;
          clearInterval(metaTimer);
        }
        setAnimatedKpis(prev => ({ ...prev, metaAtingida: currentMeta.toFixed(1) }));
      }, interval);
      timers.push(metaTimer);
    }

    // Outros KPIs...
    let currentNovos = 0;
    const novosTimer = setInterval(() => {
      currentNovos += (isPresentationMode ? 127 : mockKpis.novosLeads) / steps;
      if (currentNovos >= (isPresentationMode ? 127 : mockKpis.novosLeads)) {
        currentNovos = isPresentationMode ? 127 : mockKpis.novosLeads;
        clearInterval(novosTimer);
      }
      setAnimatedKpis(prev => ({ ...prev, novosLeads: Math.floor(currentNovos) }));
    }, interval);
    timers.push(novosTimer);

    return () => timers.forEach(timer => clearInterval(timer));
  }, [isPresentationMode]);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // KPIs para modo individual
  const kpiDataIndividual = [
    {
      title: 'Leads Quentes',
      value: animatedKpis.leadsQuentes,
      icon: '🔥',
      trend: '+12%',
      trendUp: true,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'vs. semana passada'
    },
    {
      title: 'Novos Leads',
      value: animatedKpis.novosLeads,
      icon: '✨',
      trend: '+8%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'vs. semana passada'
    },
    {
      title: 'Visitas Agendadas',
      value: animatedKpis.visitasAgendadas,
      icon: '📅',
      trend: '-3%',
      trendUp: false,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'vs. semana passada'
    },
    {
      title: 'Taxa de Conversão',
      value: `${animatedKpis.taxaConversao}%`,
      icon: '🎯',
      trend: '+5.2%',
      trendUp: true,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'vs. mês passado'
    }
  ];

  // KPIs para modo apresentação (equipe)
  const kpiDataTeam = [
    {
      title: 'Vendas Total',
      value: `R$ ${animatedKpis.totalVendas.toLocaleString('pt-BR')}`,
      icon: '💰',
      trend: '+23%',
      trendUp: true,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'vs. mês passado'
    },
    {
      title: 'Meta Atingida',
      value: `${animatedKpis.metaAtingida}%`,
      icon: '🎯',
      trend: '+15%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'da meta mensal'
    },
    {
      title: 'Novos Clientes',
      value: animatedKpis.novosLeads,
      icon: '👥',
      trend: '+32%',
      trendUp: true,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'este mês'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 14.500',
      icon: '📊',
      trend: '+8%',
      trendUp: true,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'por negócio'
    }
  ];

  const kpiData = isPresentationMode ? kpiDataTeam : kpiDataIndividual;

  // Dados para o mini gráfico
  const miniChartData = isPresentationMode 
    ? [120, 145, 135, 180, 175, 210, 195, 235, 220, 285] // Dados da equipe
    : [40, 45, 35, 50, 48, 60, 55, 65, 58, 72]; // Dados individuais
  const maxValue = Math.max(...miniChartData);

  // Ranking da equipe (para modo apresentação)
  const teamRanking = [
    { name: 'Ana Silva', sales: 385000, deals: 23, conversion: 78, trend: 'up', avatar: 'AS' },
    { name: 'Carlos Santos', sales: 342000, deals: 19, conversion: 72, trend: 'up', avatar: 'CS' },
    { name: 'Marina Costa', sales: 298000, deals: 21, conversion: 65, trend: 'down', avatar: 'MC' },
    { name: 'João Oliveira', sales: 245000, deals: 17, conversion: 68, trend: 'up', avatar: 'JO' },
    { name: 'Pedro Lima', sales: 198000, deals: 15, conversion: 58, trend: 'stable', avatar: 'PL' }
  ];

  // Dados do funil (para modo apresentação)
  const funnelData = [
    { stage: 'Novos Leads', count: 450, color: 'bg-blue-500' },
    { stage: 'Qualificados', count: 312, color: 'bg-purple-500' },
    { stage: 'Em Negociação', count: 178, color: 'bg-orange-500' },
    { stage: 'Proposta Enviada', count: 92, color: 'bg-yellow-500' },
    { stage: 'Negócios Fechados', count: 45, color: 'bg-green-500' }
  ];

  // Atividades recentes
  const recentActivities = [
    { id: 1, type: 'message', icon: MessageCircle, text: 'Nova mensagem de João Pereira', time: '5 min atrás', color: 'text-blue-600 bg-blue-100' },
    { id: 2, type: 'lead', icon: Users, text: 'Novo lead: Tech Solutions Ltd', time: '15 min atrás', color: 'text-green-600 bg-green-100' },
    { id: 3, type: 'calendar', icon: Calendar, text: 'Reunião com Carlos em 1 hora', time: '45 min atrás', color: 'text-purple-600 bg-purple-100' },
    { id: 4, type: 'deal', icon: DollarSign, text: 'Negócio fechado: R$ 25.000', time: '2 horas atrás', color: 'text-orange-600 bg-orange-100' }
  ];

  // Performance por canal
  const channelPerformance = [
    { channel: 'WhatsApp', leads: 45, percentage: 38 },
    { channel: 'Instagram', leads: 32, percentage: 27 },
    { channel: 'Website', leads: 28, percentage: 24 },
    { channel: 'Email', leads: 13, percentage: 11 }
  ];

  return (
    <div className={`flex-1 overflow-y-auto ${isPresentationMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isPresentationMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-30 animate-slide-down`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isPresentationMode ? 'text-white' : 'text-gray-900'}`}>
                {isPresentationMode ? 'Performance da Equipe de Vendas' : `${getGreeting()}, ${mockUser.name.split(' ')[0]}!`}
              </h1>
              <p className={`text-sm capitalize ${isPresentationMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isPresentationMode ? `Resultados de ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}` : currentDate}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {!isPresentationMode && (
                <>
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors group">
                    <Bell size={20} className="group-hover:animate-bell" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2">
                    <Plus size={18} />
                    <span className="hidden sm:inline">Novo Lead</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className={`px-4 py-2 ${isPresentationMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-all flex items-center space-x-2`}
              >
                {isPresentationMode ? <Eye size={18} /> : <Presentation size={18} />}
                <span className="hidden sm:inline">{isPresentationMode ? 'Modo Normal' : 'Modo Apresentação'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* KPIs com animação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi, index) => (
            <div 
              key={index} 
              className={`${isPresentationMode ? 'bg-gray-800 border-gray-700' : `${kpi.bgColor} border-gray-100`} rounded-xl p-4 border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`${isPresentationMode ? 'bg-gray-700' : kpi.iconBg} p-2 rounded-lg transform transition-transform hover:scale-110`}>
                  <span className="text-xl">{kpi.icon}</span>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi.trendUp ? 'text-green-500' : 'text-red-500'
                }`}>
                  {kpi.trendUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span className="font-medium">{kpi.trend}</span>
                </div>
              </div>
              <h3 className={`text-sm font-medium mb-1 ${isPresentationMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.title}</h3>
              <p className={`text-2xl font-bold mb-1 ${isPresentationMode ? 'text-white' : kpi.textColor}`}>{kpi.value}</p>
              <p className={`text-xs ${isPresentationMode ? 'text-gray-500' : 'text-gray-500'}`}>{kpi.description}</p>
            </div>
          ))}
        </div>

        {/* Conteúdo Principal */}
        {isPresentationMode ? (
          // MODO APRESENTAÇÃO
          <div className="space-y-6">
            {/* Funil de Vendas e Ranking */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Funil de Vendas */}
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6">Funil de Vendas - {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</h2>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => {
                    const percentage = index > 0 ? ((stage.count / funnelData[index - 1].count) * 100).toFixed(0) : 100;
                    return (
                      <div key={index} className="animate-slide-right" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">{stage.stage}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-bold">{stage.count}</span>
                            {index > 0 && (
                              <span className="text-sm text-gray-400">({percentage}% conversão)</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
                          <div 
                            className={`${stage.color} h-8 rounded-full transition-all duration-1000 flex items-center justify-end pr-3`}
                            style={{ 
                              width: `${(stage.count / funnelData[0].count) * 100}%`,
                              animation: `grow-width 1s ease-out ${index * 200}ms both`
                            }}
                          >
                            <span className="text-white text-xs font-medium">{stage.count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ranking da Equipe */}
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Top Vendedores do Mês</h2>
                  <Trophy className="text-yellow-500" size={24} />
                </div>
                <div className="space-y-3">
                  {teamRanking.map((member, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-700' : 'bg-gray-700'
                      } animate-slide-left`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          index === 2 ? 'text-orange-600' : 
                          'text-gray-500'
                        }`}>
                          {index + 1}º
                        </div>
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-white flex items-center space-x-2">
                            {member.name}
                            {index === 0 && <Award className="text-yellow-500" size={16} />}
                          </p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-400">{member.deals} negócios | {member.conversion}% conv.</p>
                            {index > 0 && (
                              <span className="text-xs text-gray-500">
                                ({Math.round((member.sales / teamRanking[0].sales) * 100)}% do 1º)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">R$ {(member.sales / 1000).toFixed(0)}k</p>
                        <div className="flex items-center justify-end space-x-1 text-sm">
                          {member.trend === 'up' && <TrendingUp className="text-green-500" size={14} />}
                          {member.trend === 'down' && <TrendingDown className="text-red-500" size={14} />}
                          {member.trend === 'stable' && <Activity className="text-gray-500" size={14} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico de Performance Mensal */}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Performance Mensal da Equipe</h2>
                  <p className="text-sm text-gray-400">Vendas realizadas vs Meta estabelecida</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-400">Vendas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-600 rounded"></div>
                    <span className="text-sm text-gray-400">Meta</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end justify-between h-48 mb-4">
                {miniChartData.map((value, index) => (
                  <div key={index} className="flex-1 mx-1 relative group">
                    <div 
                      className="bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                      style={{ 
                        height: `${(value / maxValue) * 100}%`,
                        animation: `grow-bar 0.5s ease-out ${index * 50}ms both`
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        R$ {value}k
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">R$ 1.8M</p>
                  <p className="text-sm text-gray-400">Total Vendido</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">92%</p>
                  <p className="text-sm text-gray-400">Meta Atingida</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">+23%</p>
                  <p className="text-sm text-gray-400">vs. Mês Anterior</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // MODO NORMAL
          <>
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Gráfico de Performance */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Performance de Vendas</h2>
                    <p className="text-sm text-gray-500">Últimos 10 dias</p>
                  </div>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="today">Hoje</option>
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                    <option value="year">Ano</option>
                  </select>
                </div>
                
                {/* Mini gráfico de barras */}
                <div className="flex items-end justify-between h-32 mb-4">
                  {miniChartData.map((value, index) => (
                    <div key={index} className="flex-1 mx-1 relative group">
                      <div 
                        className="bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                        style={{ 
                          height: `${(value / maxValue) * 100}%`,
                          animation: `grow-bar 0.5s ease-out ${index * 50}ms both`
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Crescimento: <span className="font-bold text-green-600">+23%</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Meta: <span className="font-bold text-blue-600">85%</span></span>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                    <span>Ver detalhes</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Atividades Recentes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Atividades Recentes</h2>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer animate-slide-left"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.color}`}>
                        <activity.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ver todas atividades
                </button>
              </div>
            </div>

            {/* Performance por Canal e Tabela */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Leads por Canal</h2>
                <div className="space-y-3">
                  {channelPerformance.map((channel, index) => (
                    <div key={index} className="animate-slide-right" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{channel.channel}</span>
                        <span className="text-sm text-gray-900">{channel.leads} leads</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${channel.percentage}%`,
                            animation: `grow-width 1s ease-out ${index * 200}ms both`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leads Table */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in" style={{ animationDelay: '400ms' }}>
                {/* Table Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-lg font-bold text-gray-900">Leads Recentes</h2>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Buscar..."
                          className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-32 sm:w-40"
                        />
                      </div>
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter size={16} />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome do Lead
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Contato
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockLeads.map((lead, index) => (
                        <tr 
                          key={lead.id} 
                          className="hover:bg-gray-50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{lead.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <BadgeStatus status={lead.status} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{lead.score}</span>
                              <div className="flex-1 w-24">
                                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                      lead.score >= 80 ? 'bg-green-500' : 
                                      lead.score >= 60 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`}
                                    style={{ 
                                      width: `${lead.score}%`,
                                      animation: `grow-width 1s ease-out ${index * 100}ms both`
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all hover:scale-110">
                                <Phone size={14} />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all hover:scale-110">
                                <Mail size={14} />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all hover:scale-110">
                                <MoreVertical size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;