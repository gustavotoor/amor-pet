// Arquivo de autenticação modificado para demonstração
// Este arquivo simula a autenticação sem depender do backend

document.addEventListener('DOMContentLoaded', function() {
  // Verificar se já existe um usuário logado
  checkAuthStatus();
  
  // Configurar formulário de login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Configurar formulário de cadastro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Configurar botão de logout
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});

// Verificar status de autenticação
function checkAuthStatus() {
  const currentUser = localStorage.getItem('amorpet_user');
  const token = localStorage.getItem('amorpet_token');
  
  // Se estamos na página de login ou cadastro e o usuário já está logado, redirecionar para dashboard
  if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('cadastro.html')) && currentUser && token) {
    window.location.href = '/tutor/dashboard.html';
    return;
  }
  
  // Se estamos em uma página protegida e o usuário não está logado, redirecionar para login
  if ((window.location.pathname.includes('/tutor/') || window.location.pathname.includes('/admin/')) && (!currentUser || !token)) {
    window.location.href = '/login.html';
    return;
  }
  
  // Se o usuário está logado, atualizar a interface
  if (currentUser && token) {
    updateUserInterface(JSON.parse(currentUser));
  }
}

// Lidar com login
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validação básica
  if (!email || !password) {
    showMessage('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  // Simulação de autenticação para demonstração
  // Em um ambiente real, isso seria uma chamada API
  simulateAuth(email, password);
}

// Lidar com cadastro
function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validação básica
  if (!name || !email || !password) {
    showMessage('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showMessage('As senhas não coincidem', 'error');
    return;
  }
  
  // Simulação de registro para demonstração
  // Em um ambiente real, isso seria uma chamada API
  simulateRegister(name, email, password);
}

// Simular autenticação
function simulateAuth(email, password) {
  showMessage('Autenticando...', 'info');
  
  // Simular delay de rede
  setTimeout(() => {
    // Criar usuário demo
    const user = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: email.includes('admin') ? 'admin' : 'tutor'
    };
    
    // Criar token demo
    const token = 'demo_token_' + Math.random().toString(36).substr(2, 16);
    
    // Salvar no localStorage
    localStorage.setItem('amorpet_user', JSON.stringify(user));
    localStorage.setItem('amorpet_token', token);
    
    showMessage('Login realizado com sucesso!', 'success');
    
    // Redirecionar baseado no papel do usuário
    if (user.role === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = '/tutor/dashboard.html';
    }
  }, 1000);
}

// Simular registro
function simulateRegister(name, email, password) {
  showMessage('Registrando...', 'info');
  
  // Simular delay de rede
  setTimeout(() => {
    // Criar usuário demo
    const user = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: email.includes('admin') ? 'admin' : 'tutor'
    };
    
    // Criar token demo
    const token = 'demo_token_' + Math.random().toString(36).substr(2, 16);
    
    // Salvar no localStorage
    localStorage.setItem('amorpet_user', JSON.stringify(user));
    localStorage.setItem('amorpet_token', token);
    
    showMessage('Cadastro realizado com sucesso!', 'success');
    
    // Redirecionar baseado no papel do usuário
    if (user.role === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = '/tutor/dashboard.html';
    }
  }, 1000);
}

// Lidar com logout
function handleLogout(event) {
  if (event) event.preventDefault();
  
  // Limpar dados de autenticação
  localStorage.removeItem('amorpet_user');
  localStorage.removeItem('amorpet_token');
  
  // Redirecionar para login
  window.location.href = '/login.html';
}

// Atualizar interface do usuário
function updateUserInterface(user) {
  // Atualizar nome do usuário onde for necessário
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(element => {
    element.textContent = user.name;
  });
  
  // Atualizar email do usuário onde for necessário
  const userEmailElements = document.querySelectorAll('.user-email');
  userEmailElements.forEach(element => {
    element.textContent = user.email;
  });
  
  // Mostrar/esconder elementos baseado no papel do usuário
  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(element => {
    element.style.display = user.role === 'admin' ? 'block' : 'none';
  });
  
  const tutorElements = document.querySelectorAll('.tutor-only');
  tutorElements.forEach(element => {
    element.style.display = user.role === 'tutor' ? 'block' : 'none';
  });
}

// Mostrar mensagem ao usuário
function showMessage(message, type = 'info') {
  // Verificar se já existe um elemento de mensagem
  let messageElement = document.querySelector('.auth-message');
  
  // Se não existir, criar um novo
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'auth-message';
    
    // Inserir após o formulário ou no início do body
    const form = document.querySelector('form');
    if (form) {
      form.parentNode.insertBefore(messageElement, form);
    } else {
      document.body.insertBefore(messageElement, document.body.firstChild);
    }
  }
  
  // Definir classe baseada no tipo
  messageElement.className = `auth-message ${type}`;
  messageElement.textContent = message;
  
  // Remover após alguns segundos
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}
