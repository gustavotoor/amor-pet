# Instruções de Implantação - Amor Pet

Este documento fornece instruções detalhadas para implantar o sistema Amor Pet em diferentes plataformas de hospedagem.

## Conteúdo do Pacote de Implantação

- `build/` - Diretório contendo todos os arquivos estáticos otimizados para produção
- `docs/` - Documentação completa do sistema
- `README.md` - Instruções gerais e visão geral do projeto

## Opções de Implantação

Você pode escolher entre várias plataformas para hospedar o sistema Amor Pet. Abaixo estão instruções para as mais populares:

### 1. GitHub Pages

GitHub Pages é uma solução gratuita para hospedar sites estáticos diretamente de um repositório GitHub.

#### Pré-requisitos:
- Uma conta GitHub
- Git instalado em seu computador

#### Passos para implantação:
1. Crie um novo repositório no GitHub (ex: `amor-pet`)
2. Clone o repositório para sua máquina local:
   ```
   git clone https://github.com/seu-usuario/amor-pet.git
   ```
3. Copie todo o conteúdo da pasta `build/` para o repositório clonado
4. Adicione, comite e envie os arquivos para o GitHub:
   ```
   git add .
   git commit -m "Implantação inicial do Amor Pet"
   git push origin main
   ```
5. Nas configurações do repositório no GitHub, vá para "Pages"
6. Em "Source", selecione "main" como branch e "/" (root) como pasta
7. Clique em "Save"
8. Aguarde alguns minutos e seu site estará disponível em `https://seu-usuario.github.io/amor-pet/`

### 2. Netlify

Netlify oferece hospedagem gratuita com recursos avançados como CI/CD automático.

#### Pré-requisitos:
- Uma conta Netlify (pode criar com GitHub, GitLab ou email)

#### Passos para implantação:
1. Faça login no Netlify (https://app.netlify.com/)
2. Clique em "Add new site" > "Deploy manually"
3. Arraste e solte a pasta `build/` na área indicada
4. Aguarde o upload e processamento
5. Seu site estará disponível em um domínio aleatório (ex: `random-name-123456.netlify.app`)
6. Você pode personalizar o domínio nas configurações do site

### 3. Vercel

Vercel é excelente para hospedar sites estáticos e aplicações React/Next.js.

#### Pré-requisitos:
- Uma conta Vercel (pode criar com GitHub, GitLab ou email)

#### Passos para implantação:
1. Faça login no Vercel (https://vercel.com/)
2. Clique em "Add New" > "Project"
3. Escolha "Upload" na seção "Import Git Repository"
4. Arraste e solte a pasta `build/` na área indicada
5. Clique em "Deploy"
6. Seu site estará disponível em um domínio `.vercel.app`
7. Você pode personalizar o domínio nas configurações do projeto

### 4. Firebase Hosting

Firebase Hosting é uma solução robusta do Google com plano gratuito.

#### Pré-requisitos:
- Uma conta Google
- Node.js e npm instalados
- Firebase CLI instalado (`npm install -g firebase-tools`)

#### Passos para implantação:
1. Faça login no Firebase CLI:
   ```
   firebase login
   ```
2. Inicialize um novo projeto Firebase:
   ```
   firebase init
   ```
3. Selecione "Hosting" quando perguntado sobre quais recursos deseja configurar
4. Selecione um projeto existente ou crie um novo
5. Quando perguntado sobre o diretório público, digite `build`
6. Configure como SPA (Single Page Application) se perguntado
7. Implante o site:
   ```
   firebase deploy
   ```
8. Seu site estará disponível em `https://seu-projeto.web.app`

## Configuração de Domínio Personalizado

Para todas as plataformas acima, você pode configurar um domínio personalizado:

1. Compre um domínio em um registrador (GoDaddy, Namecheap, Google Domains, etc.)
2. Nas configurações da plataforma de hospedagem, procure por "Custom domain" ou "Domains"
3. Adicione seu domínio e siga as instruções para configurar os registros DNS
4. Geralmente, você precisará adicionar registros CNAME ou A apontando para os servidores da plataforma
5. Aguarde a propagação DNS (pode levar até 48 horas, mas geralmente é mais rápido)

## Atualizações Futuras

Para atualizar o site no futuro:

1. Faça as alterações necessárias no código-fonte
2. Reconstrua a versão de produção
3. Reimplante seguindo os mesmos passos acima

## Suporte

Se encontrar algum problema durante a implantação, consulte a documentação completa na pasta `docs/` ou entre em contato com o suporte técnico.
