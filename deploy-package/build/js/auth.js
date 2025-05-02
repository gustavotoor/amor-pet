/**
 * Integração do frontend com o backend para autenticação
 * Sistema Amor Pet
 * 
 * Este arquivo contém as funções JavaScript para integrar o frontend
 * com as APIs de autenticação do backend.
 */

// URL base da API
const API_URL = '/api';

// Funções de autenticação
const AuthService = {
  // Registrar novo usuário
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }
      
      // Salvar token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },
  
  // Login de usuário
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
      
      // Salvar token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  
  // Login com Google
  googleLogin: async (googleData) => {
    try {
      const response = await fetch(`${API_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(googleData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login com Google');
      }
      
      // Salvar token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  },
  
  // Recuperação de senha
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao solicitar recuperação de senha');
      }
      
      return data;
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      throw error;
    }
  },
  
  // Redefinição de senha
  resetPassword: async (token, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao redefinir senha');
      }
      
      return data;
    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      throw error;
    }
  },
  
  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },
  
  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Obter token
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};

// Exportar o serviço de autenticação
window.AuthService = AuthService;
