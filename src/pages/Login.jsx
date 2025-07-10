// src/pages/Login.jsx
import React, { useState } from 'react';
import { Mail, Lock, Zap, ArrowRight, Shield, Globe, Smartphone, MessageSquare } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Substituir por chamada de API
    onLogin();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4 relative">
      {/* Background sutil */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-md lg:max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Seção de informações - desktop */}
        <div className="hidden lg:flex flex-col text-white flex-1 space-y-8">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              O CRM que fala a língua do seu cliente
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Centralize todas as conversas, automatize processos e 
              feche mais negócios com o poder da comunicação integrada.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Mensagens Unificadas</h3>
                <p className="text-gray-300">WhatsApp, Instagram, Facebook e email em um só lugar</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Automação Inteligente</h3>
                <p className="text-gray-300">Chatbots e fluxos automatizados para economizar tempo</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Pipeline Visual</h3>
                <p className="text-gray-300">Acompanhe cada etapa da jornada do cliente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de login */}
        <div className="w-full max-w-md">
          {/* Logo e título - mobile */}
          <div className="text-center mb-6 lg:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Vico CRM
            </h1>
            <p className="text-gray-300 text-sm">Vendas através de conversas</p>
          </div>

          {/* Card do formulário */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8 border border-white/20">
            {/* Logo - desktop */}
            <div className="hidden lg:block text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Vico CRM</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Bem-vindo de volta</h2>
              <p className="text-gray-300 text-sm">Entre para continuar vendendo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Campo de senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Links auxiliares */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm space-y-2 sm:space-y-0">
                <label className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-500 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 mr-2" />
                  Lembrar-me
                </label>
                <a href="#" className="text-gray-300 hover:text-white">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão de submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-300">Novo por aqui?</span>
              </div>
            </div>

            {/* Link de cadastro */}
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Não tem uma conta?{' '}
                <a href="#" className="text-white font-medium hover:text-blue-400 transition-colors">
                  Fale com nosso time
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              CRM baseado em conversas para times de vendas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;