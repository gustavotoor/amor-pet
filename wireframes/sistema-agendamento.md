# Wireframe de Baixa Fidelidade - Sistema de Agendamento Amor Pet

## Fluxo de Agendamento

### Passo 1: Seleção de Serviço
- Título: "Agendar Serviço"
- Seleção de tipo de serviço:
  - Card "Banho" (com ícone, descrição curta e preço)
  - Card "Banho e Tosa" (com ícone, descrição curta e preço)
- Informação sobre planos ativos (se houver):
  - "Você possui um plano ativo: Plano 4 Banhos - Restam 2 banhos"
- Botão "Voltar" (secundário)
- Botão "Continuar" (primário)

### Passo 2: Seleção de Pet
- Título: "Selecione o Pet"
- Lista de pets cadastrados:
  - Cards com foto, nome e informações básicas de cada pet
  - Opção de selecionar apenas um pet por vez
- Botão "Cadastrar novo pet" (caso não tenha pets cadastrados)
- Botão "Voltar" (secundário)
- Botão "Continuar" (primário)

### Passo 3: Seleção de Data e Horário
- Título: "Escolha a Data e Horário"
- Calendário interativo:
  - Visualização mensal
  - Dias indisponíveis desabilitados
  - Dias com pouca disponibilidade marcados
- Após selecionar a data:
  - Lista de horários disponíveis
  - Horários já ocupados aparecem desabilitados
- Botão "Voltar" (secundário)
- Botão "Continuar" (primário)

### Passo 4: Confirmação e Pagamento
- Título: "Confirmar Agendamento"
- Resumo do agendamento:
  - Serviço selecionado
  - Pet selecionado
  - Data e horário
  - Preço
- Opções de pagamento:
  - "Usar plano ativo" (se aplicável)
  - "Pagar com Pix"
- Se "Pagar com Pix" for selecionado:
  - QR Code do Pix
  - Chave Pix (copiável)
  - Valor a pagar
  - Instruções para pagamento
- Botão "Voltar" (secundário)
- Botão "Confirmar Agendamento" (primário)

### Tela de Confirmação
- Ícone de sucesso (marca de verificação)
- Título: "Agendamento Confirmado!"
- Resumo do agendamento:
  - Número do agendamento
  - Serviço
  - Pet
  - Data e horário
- Texto: "Enviamos um e-mail de confirmação para você"
- Botão "Ver meus agendamentos"
- Botão "Voltar ao início"

## Gerenciamento de Agendamentos

### Lista de Agendamentos
- Título: "Meus Agendamentos"
- Filtros:
  - Status (Agendado, Concluído, Cancelado)
  - Período (Esta semana, Este mês, Personalizado)
- Lista de agendamentos:
  - Data e horário
  - Serviço
  - Pet
  - Status
  - Botões de ação:
    - "Ver detalhes"
    - "Reagendar" (se aplicável)
    - "Cancelar" (se aplicável)

### Detalhes do Agendamento
- Título: "Detalhes do Agendamento"
- Informações completas:
  - Número do agendamento
  - Status
  - Serviço
  - Pet (com foto)
  - Data e horário
  - Forma de pagamento utilizada
  - Observações
- Botões de ação:
  - "Voltar"
  - "Reagendar" (se aplicável)
  - "Cancelar agendamento" (se aplicável)

### Reagendamento
- Similar à tela de seleção de data e horário
- Título: "Reagendar Serviço"
- Informações do agendamento atual
- Seleção de nova data e horário
- Botão "Cancelar" (secundário)
- Botão "Confirmar Reagendamento" (primário)

## Paleta de Cores
- Verde-água (#A8D5BA): Botões primários, destaques, status "Confirmado"
- Azul claro (#B3D4E5): Botões secundários, elementos de fundo
- Bege (#F5E8C7): Fundo de cards, áreas neutras
- Laranja suave (#F4A261): Alertas, notificações, status "Pendente"
- Vermelho suave: Status "Cancelado"
- Branco: Fundo principal
- Cinza escuro: Textos principais

## Responsividade
- Em dispositivos móveis:
  - Calendário adaptado para tela menor
  - Horários em formato de lista vertical
  - Cards empilham verticalmente
  - Botões adaptados para toque (maior área clicável)
