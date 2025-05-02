# Documentação Técnica - Sistema Amor Pet

## Arquitetura do Sistema

O sistema Amor Pet segue uma arquitetura cliente-servidor com separação clara entre frontend e backend:

### Frontend
- Interface de usuário construída com HTML5, CSS3 e JavaScript
- Design responsivo utilizando Bootstrap
- Comunicação com o backend via requisições AJAX/Fetch API
- Armazenamento local de tokens JWT para autenticação persistente

### Backend
- API RESTful desenvolvida com Node.js e Express
- Banco de dados relacional PostgreSQL
- ORM Sequelize para mapeamento objeto-relacional
- Autenticação baseada em tokens JWT
- Middlewares para controle de acesso e validação

### Diagrama de Arquitetura

```
[Cliente Web] <--HTTPS--> [Servidor Express] <---> [Banco de Dados PostgreSQL]
     |                          |
     |                          |
[Autenticação] <---> [Google OAuth]
                          |
[Pagamentos] <---> [API Pix]
                          |
[Notificações] <---> [Serviço de Email]
```

## Estrutura do Banco de Dados

### Diagrama Entidade-Relacionamento

O banco de dados do sistema Amor Pet é composto pelas seguintes tabelas principais:

1. **users**: Armazena informações dos usuários (tutores e administradores)
2. **pets**: Armazena informações dos pets vinculados aos tutores
3. **services**: Armazena os serviços oferecidos (banho e banho/tosa)
4. **plans**: Armazena os planos de economia disponíveis
5. **plans_purchased**: Armazena os planos adquiridos pelos tutores
6. **appointments**: Armazena os agendamentos realizados
7. **payments**: Armazena informações de pagamentos
8. **schedule_settings**: Armazena configurações de horários de funcionamento
9. **blocked_dates**: Armazena datas bloqueadas para agendamento

### Relacionamentos Principais

- Um usuário (tutor) pode ter vários pets (1:N)
- Um pet pode ter vários agendamentos (1:N)
- Um usuário (tutor) pode adquirir vários planos (1:N)
- Um agendamento está associado a um serviço (N:1)
- Um agendamento pode utilizar um plano adquirido (N:1)
- Um agendamento pode ter um pagamento associado (1:1)
- Um plano adquirido pode ter um pagamento associado (1:1)

## Fluxos de Dados

### Fluxo de Autenticação

1. Usuário acessa a página de login
2. Sistema apresenta opções de login (tradicional ou Google)
3. Usuário fornece credenciais
4. Backend valida credenciais e gera token JWT
5. Frontend armazena token e redireciona para dashboard
6. Requisições subsequentes incluem token no cabeçalho Authorization

### Fluxo de Agendamento

1. Usuário acessa página de agendamento
2. Sistema carrega pets do usuário e serviços disponíveis
3. Usuário seleciona pet, serviço e data
4. Sistema verifica disponibilidade e exibe horários livres
5. Usuário seleciona horário e forma de pagamento
6. Sistema registra agendamento e processa pagamento
7. Sistema envia confirmação por email

### Fluxo de Pagamento via Pix

1. Sistema gera QR Code Pix com dados do pagamento
2. Usuário escaneia QR Code e realiza pagamento
3. Sistema verifica status do pagamento (simulado)
4. Sistema atualiza status do agendamento ou plano
5. Sistema envia confirmação por email

## Segurança

### Autenticação e Autorização

- Senhas armazenadas com hash bcrypt
- Tokens JWT com expiração configurável
- Middleware de autenticação para proteger rotas
- Middleware de autorização para controle de acesso baseado em função
- Proteção contra CSRF com tokens

### Validação de Dados

- Validação de entrada no frontend e backend
- Sanitização de dados para prevenir injeção SQL
- Validação de tipos e formatos (email, telefone, etc.)
- Limitação de tamanho de uploads

### Proteção contra Ataques Comuns

- Proteção contra XSS com sanitização de saída
- Proteção contra CSRF com tokens
- Rate limiting para prevenir ataques de força bruta
- Headers de segurança (HSTS, X-Content-Type-Options, etc.)

## Integrações Externas

### Google OAuth

- Implementação usando passport-google-oauth20
- Fluxo de autenticação OAuth 2.0
- Vinculação de contas Google com usuários existentes
- Configuração via variáveis de ambiente

### API de Pagamento Pix

- Implementação genérica para demonstração
- Geração de QR Codes estáticos
- Simulação de confirmação de pagamento
- Webhook para receber notificações de pagamento

### Serviço de Email

- Implementação usando Nodemailer
- Templates HTML para diferentes tipos de email
- Configuração via variáveis de ambiente
- Modo de teste para desenvolvimento

## Escalabilidade e Performance

### Otimizações Implementadas

- Paginação de resultados em listagens
- Indexação de colunas frequentemente consultadas
- Caching de dados estáticos
- Compressão de respostas HTTP

### Possibilidades de Escalabilidade

- Balanceamento de carga com múltiplas instâncias
- Separação de serviços em microsserviços
- Implementação de filas para processamento assíncrono
- Caching distribuído com Redis

## Monitoramento e Logs

### Logs do Sistema

- Logs de acesso e erros
- Logs de transações críticas (pagamentos, agendamentos)
- Rotação de logs para evitar arquivos muito grandes
- Níveis de log configuráveis (debug, info, warn, error)

### Monitoramento

- Endpoint de health check (/api/status)
- Métricas básicas de performance
- Alertas para erros críticos
- Dashboard administrativo com estatísticas em tempo real

## Considerações de Implementação

### Decisões Técnicas

- Escolha de PostgreSQL pela robustez e suporte a transações complexas
- Uso de Sequelize ORM para abstração do banco de dados
- Implementação de JWT para autenticação stateless
- Separação clara entre frontend e backend para facilitar manutenção

### Limitações Conhecidas

- Implementação simplificada de Pix (simulação)
- Ausência de processamento assíncrono para tarefas pesadas
- Sem implementação de cache distribuído
- Testes automatizados cobrem apenas APIs principais

### Melhorias Futuras

- Implementação de PWA para acesso offline
- Integração com provedores reais de pagamento
- Sistema de notificações push
- Aplicativo móvel nativo
- Implementação de chat para suporte ao cliente

## Ambiente de Desenvolvimento

### Requisitos

- Node.js v14+
- PostgreSQL v12+
- NPM ou Yarn
- Git

### Configuração Local

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure variáveis de ambiente: copie `.env.example` para `.env` e ajuste
4. Configure banco de dados: `npm run setup-db`
5. Inicie em modo desenvolvimento: `npm run dev`

### Scripts Disponíveis

- `npm start`: Inicia o servidor em modo produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento com hot-reload
- `npm test`: Executa testes automatizados
- `npm run setup-db`: Configura o banco de dados

## Ambiente de Produção

### Requisitos

- Servidor Linux (Ubuntu 20.04+ recomendado)
- Node.js v14+
- PostgreSQL v12+
- Nginx como proxy reverso
- Certificado SSL (Let's Encrypt recomendado)

### Configuração de Produção

1. Clone o repositório
2. Instale dependências: `npm install --production`
3. Configure variáveis de ambiente para produção
4. Configure banco de dados: `npm run setup-db`
5. Configure Nginx como proxy reverso
6. Configure PM2 para gerenciamento de processos
7. Configure certificado SSL
8. Inicie o servidor: `pm2 start backend/server.js`

### Backup e Recuperação

- Backup diário do banco de dados
- Backup semanal dos arquivos de upload
- Procedimento de recuperação documentado
- Teste regular de restauração

---

Esta documentação técnica serve como referência para desenvolvedores e administradores do sistema Amor Pet.
