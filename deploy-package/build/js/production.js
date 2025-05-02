// Configurações para ambiente de produção
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar aviso de versão de produção
  const productionNotice = document.createElement('div');
  productionNotice.className = 'production-notice';
  productionNotice.textContent = 'Amor Pet - Versão de Produção';
  document.body.appendChild(productionNotice);
  
  // Registrar eventos de analytics (simulado)
  console.log('Analytics inicializado em ambiente de produção');
  
  // Verificar se o navegador suporta service workers para PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(function(error) {
        console.log('Falha ao registrar Service Worker:', error);
      });
  }
  
  // Melhorar carregamento de imagens com lazy loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
  
  // Adicionar tratamento de erros global
  window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.message);
    // Em produção, enviaria para um serviço de monitoramento
  });
});
