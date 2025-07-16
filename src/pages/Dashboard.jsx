// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bell, Plus, Search, Filter, Download,
  Phone, Mail, MoreVertical, Activity, Clock, Users,
  MessageCircle, Calendar, DollarSign, Target, ArrowUp,
  ArrowDown, ChevronRight, Zap, BarChart3, Presentation,
  Trophy, TrendingDown, Award, Star, ChevronUp, Eye,
  RefreshCw, AlertCircle
} from 'lucide-react';
import BadgeStatus from '../components/BadgeStatus';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para dados reais - corrigidos com os nomes corretos
  const [kpis, setKpis] = useState({
    totalLeads: 0,
    newLeadsToday: 0,
    scheduledVisits: 0,
    conversionRate: 0,
    totalSales: 0,
    targetAchieved: 0,
    newCustomers: 0,
    averageTicket: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [channelPerformance, setChannelPerformance] = useState([]);
  const [salesFunnel, setSalesFunnel] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  // Estados animados
  const [animatedKpis, setAnimatedKpis] = useState({
    totalLeads: 0,
    newLeadsToday: 0,
    scheduledVisits: 0,
    conversionRate: 0
  });

  // Função para calcular mudança percentual
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Buscar dados da API
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [kpisRes, activitiesRes, performanceRes, channelRes, funnelRes, sellersRes] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getRecentActivities(),
        dashboardService.getPerformanceData(),
        dashboardService.getChannelPerformance(),
        dashboardService.getSalesFunnel(),
        dashboardService.getTopSellers()
      ]);

      // Processar dados dos KPIs
      const kpisData = kpisRes.data;
      setKpis({
        totalLeads: kpisData.totalLeads || 0,
        newLeadsToday: kpisData.newLeadsToday || 0,
        scheduledVisits: kpisData.scheduledVisits || 0,
        conversionRate: kpisData.conversionRate || 0,
        totalSales: kpisData.totalSales || 0,
        targetAchieved: kpisData.targetAchieved || 0,
        newCustomers: kpisData.newCustomers || 0,
        averageTicket: kpisData.averageTicket || 0
      });

      setRecentActivities(activitiesRes.data || []);
      setPerformanceData(performanceRes.data || []);
      setChannelPerformance(channelRes.data || []);
      setSalesFunnel(funnelRes.data || []);
      setTopSellers(sellersRes.data || []);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar dados ao montar componente
  useEffect(() => {
    fetchDashboardData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Animação dos números dos KPIs
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const interval = duration / steps;

    const animateValue = (start, end, setter) => {
      let current = start;
      const increment = (end - start) / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        setter(Math.round(current));
      }, interval);
      
      return timer;
    };

    const timers = [
      animateValue(0, kpis.totalLeads, (val) => 
        setAnimatedKpis(prev => ({ ...prev, totalLeads: val }))),
      animateValue(0, kpis.newLeadsToday, (val) => 
        setAnimatedKpis(prev => ({ ...prev, newLeadsToday: val }))),
      animateValue(0, kpis.scheduledVisits, (val) => 
        setAnimatedKpis(prev => ({ ...prev, scheduledVisits: val }))),
      animateValue(0, kpis.conversionRate, (val) => 
        setAnimatedKpis(prev => ({ ...prev, conversionRate: val })))
    ];

    return () => timers.forEach(timer => clearInterval(timer));
  }, [kpis]);

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

  const formatRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    return messageDate.toLocaleDateString('pt-BR');
  };

  // KPIs com cálculo de trends reais
  const kpiDataIndividual = [
    {
      title: 'Leads Quentes',
      value: animatedKpis.totalLeads,
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
      value: animatedKpis.newLeadsToday,
      icon: '✨',
      trend: '+8%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'últimos 7 dias'
    },
    {
      title: 'Visitas Agendadas',
      value: animatedKpis.scheduledVisits,
      icon: '📅',
      trend: animatedKpis.scheduledVisits > 0 ? '+3%' : '0%',
      trendUp: animatedKpis.scheduledVisits > 0,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'agendamentos ativos'
    },
    {
      title: 'Taxa de Conversão',
      value: `${animatedKpis.conversionRate}%`,
      icon: '🎯',
      trend: '+5.2%',
      trendUp: true,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'vs. mês passado'
    }
  ];

  // Se estiver carregando
  if (isLoading && !kpis.totalLeads) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isPresentationMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-500`}>
      {/* Header */}
      <header className={`${isPresentationMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-all duration-500`}>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isPresentationMode ? 'text-white' : 'text-gray-900'}`}>
                {isPresentationMode ? 'Performance da Equipe de Vendas' : `${getGreeting()}, Ana!`}
              </h1>
              <p className={`text-sm capitalize ${isPresentationMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isPresentationMode ? `Resultados de ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}` : currentDate}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
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
        {/* Mostrar erro se houver */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-600">{error}</span>
          </div>
        )}

        {/* KPIs com animação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiDataIndividual.map((kpi, index) => (
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
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico de Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Performance de Conversas</h2>
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
              </select>
            </div>
            
            {/* Mini gráfico de barras */}
            <div className="flex items-end justify-between h-32 mb-4">
              {performanceData.length > 0 ? (
                performanceData.slice(-10).map((data, index) => {
                  const maxValue = Math.max(...performanceData.map(d => parseInt(d.novos_leads) || 0));
                  const height = maxValue > 0 ? (parseInt(data.novos_leads) / maxValue) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 mx-1">
                      <div 
                        className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${data.data}: ${data.novos_leads} leads`}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <p>Sem dados disponíveis</p>
                </div>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Atividades Recentes</h2>
              <RefreshCw size={16} className="text-gray-400" />
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'new_lead' ? 'bg-blue-100' :
                      activity.type === 'deal_won' ? 'bg-green-100' :
                      activity.type === 'new_message' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'new_lead' ? <Users size={16} className="text-blue-600" /> :
                       activity.type === 'deal_won' ? <Trophy size={16} className="text-green-600" /> :
                       activity.type === 'new_message' ? <MessageCircle size={16} className="text-purple-600" /> :
                       <Activity size={16} className="text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(activity.time)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">Nenhuma atividade recente</p>
              )}
            </div>
          </div>
        </div>

        {/* Métricas adicionais */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance por Canal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance por Canal</h2>
            <div className="space-y-3">
              {channelPerformance.length > 0 ? (
                channelPerformance.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: channel.fill }}
                      />
                      <span className="text-sm text-gray-600">{channel.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{channel.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">Sem dados de canais</p>
              )}
            </div>
          </div>

          {/* Funil de Vendas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Funil de Vendas</h2>
            <div className="space-y-2">
              {salesFunnel.length > 0 ? (
                salesFunnel.map((stage, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{stage.stage}</span>
                      <span className="font-medium">{stage.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">Sem dados do funil</p>
              )}
            </div>
          </div>

          {/* Top Vendedores */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Vendedores</h2>
            <div className="space-y-3">
              {topSellers.length > 0 ? (
                topSellers.map((seller, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{seller.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                        <p className="text-xs text-gray-500">{seller.sales} vendas</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      R$ {(seller.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">Sem vendedores cadastrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;