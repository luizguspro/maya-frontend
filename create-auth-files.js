// frontend/create-auth-files.js
const fs = require('fs');
const path = require('path');

// Criar diretório contexts se não existir
const contextsDir = path.join(__dirname, 'src', 'contexts');
if (!fs.existsSync(contextsDir)) {
  fs.mkdirSync(contextsDir, { recursive: true });
}

// AuthContext.jsx
const authContextContent = `// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário do token salvo
  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('maya-token');
      
      if (token) {
        try {
          // Configurar token no axios
          api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
          
          // Buscar dados do usuário
          const response = await api.get('/auth/me');
          setUser(response.data.usuario);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          // Token inválido, limpar
          Cookies.remove('maya-token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, senha });
      
      const { usuario, token } = response.data;
      
      // Salvar token
      Cookies.set('maya-token', token, { expires: 7 }); // 7 dias
      
      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
      
      // Salvar usuário no estado
      setUser(usuario);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Função de registro
  const register = async (dados) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', dados);
      
      const { usuario, token } = response.data;
      
      // Salvar token
      Cookies.set('maya-token', token, { expires: 7 });
      
      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
      
      // Salvar usuário no estado
      setUser(usuario);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar conta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar dados locais
      Cookies.remove('maya-token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  // Função para recuperar senha
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao solicitar recuperação';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};`;

fs.writeFileSync(path.join(contextsDir, 'AuthContext.jsx'), authContextContent);
console.log('✅ AuthContext.jsx criado');

// ProtectedRoute.jsx
const protectedRouteContent = `// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;`;

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'ProtectedRoute.jsx'), protectedRouteContent);
console.log('✅ ProtectedRoute.jsx criado');

console.log('\n📁 Arquivos criados com sucesso!');
console.log('Agora crie manualmente os arquivos Login.jsx e Register.jsx em src/pages/');
console.log('\nReinicie o servidor de desenvolvimento:');
console.log('npm run dev');