# Wireframe de Baixa Fidelidade - Área Administrativa Amor Pet

## Login Administrativo
- Logo "Amor Pet" (centralizado no topo)
- Título: "Área Administrativa"
- Formulário de login:
  - Campo de e-mail
  - Campo de senha
  - Botão "Entrar" (primário)
- Nota de segurança: "Acesso restrito à equipe administrativa"

## Dashboard Administrativo
- Cabeçalho com logo "Amor Pet" e nome do administrador logado
- Menu lateral:
  - Dashboard
  - Agendamentos
  - Clientes
  - Pets
  - Planos
  - Serviços
  - Horários
  - Pagamentos
  - Relatórios
  - Configurações
  - Sair
- Visão geral:
  - Cards com estatísticas:
    - Total de agendamentos do dia
    - Agendamentos pendentes
    - Planos vendidos no mês
    - Faturamento do mês
  - Gráfico de agendamentos da semana
  - Lista dos próximos agendamentos do dia

## Gestão de Agendamentos
- Título: "Gerenciar Agendamentos"
- Filtros:
  - Data (calendário)
  - Status (Todos, Pendentes, Confirmados, Concluídos, Cancelados)
  - Cliente (busca por nome)
  - Serviço (dropdown)
- Visualizações:
  - Calendário (visão mensal/semanal/diária)
  - Lista (tabela com todos os agendamentos)
- Na visão de lista:
  - Colunas: Data/Hora, Cliente, Pet, Serviço, Status, Pagamento, Ações
  - Ações: Ver detalhes, Editar, Cancelar, Marcar como concluído
- Botão "Novo Agendamento" (para criar manualmente)

## Detalhes do Agendamento (Admin)
- Título: "Detalhes do Agendamento"
- Informações completas:
  - ID do agendamento
  - Data e hora
  - Cliente (com link para perfil)
  - Pet (com foto e link para perfil)
  - Serviço
  - Status (com opção de alterar)
  - Forma de pagamento
  - Status do pagamento
  - Observações
- Histórico de alterações
- Botões de ação:
  - "Editar"
  - "Cancelar agendamento"
  - "Marcar como concluído"
  - "Enviar lembrete por e-mail"

## Gestão de Clientes
- Título: "Gerenciar Clientes"
- Filtro/Busca por nome, e-mail ou telefone
- Lista de clientes:
  - Nome
  - E-mail
  - Telefone
  - Quantidade de pets
  - Data de cadastro
  - Status (Ativo/Inativo)
  - Ações: Ver detalhes, Editar, Desativar/Ativar
- Botão "Novo Cliente" (para cadastro manual)

## Perfil do Cliente (Admin)
- Título: "Perfil do Cliente"
- Informações do cliente:
  - Nome completo
  - E-mail
  - Telefone
  - Data de cadastro
  - Status da conta
- Abas:
  - "Pets" (lista de pets do cliente)
  - "Agendamentos" (histórico de agendamentos)
  - "Planos" (planos ativos e histórico)
  - "Pagamentos" (histórico de pagamentos)
- Botões de ação:
  - "Editar cliente"
  - "Desativar conta" / "Ativar conta"
  - "Adicionar pet"
  - "Criar agendamento"

## Gestão de Planos
- Título: "Gerenciar Planos"
- Lista de planos configurados:
  - Nome do plano
  - Serviços incluídos
  - Preço
  - Validade
  - Status (Ativo/Inativo)
  - Ações: Editar, Desativar/Ativar
- Botão "Novo Plano"

## Edição de Plano
- Título: "Editar Plano" / "Novo Plano"
- Formulário:
  - Nome do plano
  - Serviços incluídos (checkboxes)
  - Quantidade de serviços
  - Preço normal (calculado automaticamente)
  - Preço com desconto
  - Período de validade (em meses)
  - Status (Ativo/Inativo)
  - Descrição
- Botão "Cancelar" (secundário)
- Botão "Salvar" (primário)

## Gestão de Serviços
- Título: "Gerenciar Serviços"
- Lista de serviços:
  - Nome do serviço
  - Descrição
  - Duração
  - Preço
  - Status (Ativo/Inativo)
  - Ações: Editar, Desativar/Ativar
- Botão "Novo Serviço"

## Gestão de Horários
- Título: "Configurar Horários"
- Configuração de dias da semana:
  - Checkboxes para cada dia
  - Horário de início e fim para cada dia
- Configuração de capacidade:
  - Número máximo de agendamentos por hora
  - Intervalo entre agendamentos
- Bloqueio de datas específicas:
  - Calendário para selecionar datas a bloquear
  - Lista de datas bloqueadas com motivo
- Botão "Salvar configurações"

## Gestão de Pagamentos
- Título: "Gerenciar Pagamentos"
- Filtros:
  - Período
  - Status (Todos, Pendentes, Confirmados, Cancelados)
  - Tipo (Individual, Plano)
- Lista de pagamentos:
  - Data
  - Cliente
  - Tipo (Individual/Plano)
  - Valor
  - Método (Pix)
  - Status
  - Ações: Ver detalhes, Confirmar manualmente
- Totalizadores:
  - Total recebido no período
  - Total pendente

## Relatórios
- Título: "Relatórios"
- Tipos de relatórios:
  - Agendamentos por período
  - Vendas de planos
  - Faturamento
  - Clientes mais frequentes
- Filtros por período (data inicial e final)
- Visualização em gráficos e tabelas
- Botão "Exportar CSV"

## Paleta de Cores
- Verde-água (#A8D5BA): Botões primários, destaques, status "Confirmado"
- Azul claro (#B3D4E5): Botões secundários, elementos de fundo, menu lateral
- Bege (#F5E8C7): Fundo de cards, áreas neutras
- Laranja suave (#F4A261): Alertas, notificações, status "Pendente"
- Vermelho suave: Status "Cancelado"
- Branco: Fundo principal
- Cinza escuro: Textos principais

## Responsividade
- Em dispositivos móveis:
  - Menu lateral se transforma em menu hamburger
  - Tabelas adaptadas com scroll horizontal
  - Cards empilham verticalmente
  - Gráficos redimensionados
  - Botões adaptados para toque (maior área clicável)
