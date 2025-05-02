# Amor Pet - Sistema de Agendamento para Pet Shop

![Logo Amor Pet](/home/ubuntu/amor-pet/frontend/public/images/logo.png)

## Sobre o Projeto

O Amor Pet é um sistema completo de agendamento online para pet shops, desenvolvido para facilitar o gerenciamento de cadastros de clientes e pets, agendamentos de banho e tosa, e aquisição de planos de serviços (pacotes pré-pagos).

O sistema possui uma interface intuitiva, responsiva e visualmente coesa, com integração de pagamento via Pix e uma área administrativa completa para gerenciamento de operações.

## Funcionalidades Principais

### Para Tutores de Animais
- Cadastro e login (tradicional ou via Google)
- Gerenciamento de perfil e dados pessoais
- Cadastro e gerenciamento de pets
- Agendamento de serviços (banho e banho/tosa)
- Aquisição de planos de economia
- Pagamento via Pix
- Visualização de histórico de agendamentos

### Para Administradores
- Dashboard com estatísticas e visão geral
- Gerenciamento de agendamentos
- Gerenciamento de clientes e pets
- Configuração de serviços e preços
- Gerenciamento de planos
- Relatórios financeiros e operacionais
- Configurações do sistema

## Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap para responsividade
- Bibliotecas: React Datepicker, React Icons

### Backend
- Node.js com Express
- PostgreSQL como banco de dados
- Sequelize ORM
- JWT para autenticação
- Passport.js para OAuth
- Nodemailer para envio de emails
- QRCode para geração de QR Codes Pix

### Integrações
- Google OAuth para autenticação
- API de Pagamento Pix (implementação genérica)
- Serviço de Email

## Estrutura do Projeto

```
amor-pet/
├── backend/             # Código do servidor
│   ├── config/          # Configurações
│   ├── controllers/     # Controladores da API
│   ├── database/        # Scripts SQL e configuração do banco
│   ├── middlewares/     # Middlewares Express
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços (Pix, etc.)
│   ├── tests/           # Testes automatizados
│   └── utils/           # Utilitários
├── frontend/            # Código do cliente
│   └── public/          # Arquivos estáticos
│       ├── admin/       # Páginas da área administrativa
│       ├── css/         # Estilos CSS
│       ├── images/      # Imagens e recursos
│       ├── js/          # Scripts JavaScript
│       └── tutor/       # Páginas da área do tutor
├── docs/                # Documentação
└── reports/             # Relatórios de testes
```

## Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- NPM ou Yarn

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/amor-pet.git
cd amor-pet
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp backend/.env.example backend/.env
# Edite o arquivo .env com suas configurações
```

4. Configure o banco de dados:
```bash
npm run setup-db
```

5. Inicie o servidor:
```bash
npm start
```

6. Acesse o sistema:
```
http://localhost:3000
```

## Configurações Personalizáveis

### Configurações Gerais
- Informações do pet shop (nome, endereço, contato)
- Logo e cores do sistema
- Horários de funcionamento

### Configurações de Serviços
- Tipos de serviço (banho, banho/tosa)
- Preços e duração
- Capacidade de atendimento

### Configurações de Planos
- Tipos de plano
- Quantidade de serviços incluídos
- Descontos aplicados

### Configurações de Pagamento
- Chave Pix
- Nome e cidade do beneficiário
- Modo de teste (para desenvolvimento)

### Configurações de Email
- Servidor SMTP
- Credenciais de acesso
- Templates de email

## Guia de Uso

### Para Tutores

1. **Cadastro e Login**
   - Acesse a landing page e clique em "Criar conta" ou "Login"
   - Faça cadastro (Google ou tradicional) e logue no sistema

2. **Cadastro de Pets**
   - No dashboard, clique em "Adicionar Pet"
   - Preencha as informações do pet (nome, espécie, raça, idade, peso)
   - Adicione uma foto (opcional) e observações

3. **Agendamento de Serviço**
   - No dashboard, clique em "Agendar Serviço"
   - Selecione o pet, o serviço desejado (banho ou banho/tosa)
   - Escolha a data e horário disponíveis
   - Selecione a forma de pagamento (Pix ou plano pré-pago)
   - Confirme o agendamento

4. **Compra de Plano**
   - No dashboard, clique em "Planos"
   - Escolha o plano desejado
   - Realize o pagamento via Pix
   - Aguarde a confirmação do pagamento

### Para Administradores

1. **Acesso à Área Administrativa**
   - Acesse a página de login e entre com credenciais de administrador

2. **Gerenciamento de Agendamentos**
   - No dashboard, visualize os agendamentos do dia
   - Acesse "Agendamentos" para ver todos os agendamentos
   - Filtre por data, status, serviço ou cliente
   - Confirme, conclua ou cancele agendamentos

3. **Gerenciamento de Clientes**
   - Acesse "Clientes" para ver todos os tutores cadastrados
   - Visualize detalhes de cada cliente e seus pets
   - Edite informações quando necessário

4. **Configurações do Sistema**
   - Acesse "Configurações" para ajustar parâmetros do sistema
   - Configure horários de funcionamento, serviços, planos e integrações

## Testes

O sistema inclui testes automatizados para garantir o funcionamento correto de todas as funcionalidades:

```bash
# Executar todos os testes
npm test

# Verificar relatórios de teste
cat reports/test-report-*.txt
```

## Suporte e Contato

Para suporte técnico ou dúvidas sobre o sistema, entre em contato:

- Email: suporte@amorpet.com.br
- Telefone: (11) 1234-5678

---

Desenvolvido com ❤️ para Amor Pet © 2025
