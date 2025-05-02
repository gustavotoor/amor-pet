# Wireframe de Baixa Fidelidade - Sistema de Planos e Pagamentos Amor Pet

## Lista de Planos Disponíveis
- Título: "Planos de Serviços"
- Texto introdutório: "Economize adquirindo nossos planos de serviços"
- Cards de planos:
  - Card "Plano 4 Banhos":
    - Ícone ilustrativo
    - Título do plano
    - Descrição: "4 banhos com desconto de X%"
    - Preço individual: "R$XX,XX por banho"
    - Preço do plano: "R$XX,XX (economia de R$XX,XX)"
    - Validade: "Válido por 3 meses"
    - Botão "Adquirir plano"
  - Card "Plano 2 Banhos e Tosa":
    - Ícone ilustrativo
    - Título do plano
    - Descrição: "2 banhos e tosa com desconto de X%"
    - Preço individual: "R$XX,XX por serviço"
    - Preço do plano: "R$XX,XX (economia de R$XX,XX)"
    - Validade: "Válido por 2 meses"
    - Botão "Adquirir plano"
  - Outros planos seguindo o mesmo padrão

## Processo de Compra de Plano

### Passo 1: Detalhes do Plano
- Título: "Adquirir Plano"
- Detalhes completos do plano selecionado:
  - Nome do plano
  - Serviços incluídos
  - Preço total
  - Economia em relação aos serviços individuais
  - Validade
  - Termos e condições (expandível)
- Botão "Voltar" (secundário)
- Botão "Continuar para pagamento" (primário)

### Passo 2: Pagamento via Pix
- Título: "Pagamento via Pix"
- QR Code do Pix (grande e centralizado)
- Informações do pagamento:
  - Valor total
  - Nome do beneficiário
  - Chave Pix (com botão de copiar)
- Instruções:
  - "Escaneie o QR Code com o aplicativo do seu banco"
  - "Ou copie a chave Pix e cole no aplicativo do seu banco"
  - "Após o pagamento, o sistema confirmará automaticamente"
- Contador regressivo para expiração do QR Code
- Status do pagamento (Aguardando, Processando, Confirmado)
- Botão "Cancelar" (secundário)
- Botão "Já realizei o pagamento" (informativo)

### Tela de Confirmação
- Ícone de sucesso (marca de verificação)
- Título: "Plano Adquirido com Sucesso!"
- Resumo da compra:
  - Nome do plano
  - Serviços incluídos
  - Validade
  - Número do pedido
- Texto: "Enviamos um e-mail de confirmação para você"
- Botão "Ver meus planos"
- Botão "Agendar serviço agora"

## Gerenciamento de Planos

### Meus Planos
- Título: "Meus Planos"
- Abas:
  - "Planos Ativos"
  - "Planos Expirados"
  - "Histórico de Compras"
- Lista de planos ativos:
  - Nome do plano
  - Serviços restantes (ex: "2/4 banhos utilizados")
  - Data de validade
  - Barra de progresso visual
  - Botão "Agendar serviço"
- Lista de planos expirados:
  - Nome do plano
  - Status (Expirado, Totalmente utilizado)
  - Data de expiração
- Histórico de compras:
  - Data da compra
  - Nome do plano
  - Valor pago
  - Status (Ativo, Expirado, Totalmente utilizado)

## Pagamento Individual

### Pagamento de Serviço Individual
- Título: "Pagamento de Serviço"
- Resumo do serviço:
  - Tipo de serviço
  - Pet
  - Data e horário
  - Valor
- QR Code do Pix
- Informações do pagamento:
  - Valor total
  - Nome do beneficiário
  - Chave Pix (com botão de copiar)
- Instruções para pagamento
- Status do pagamento
- Botão "Cancelar" (secundário)
- Botão "Já realizei o pagamento" (informativo)

## Paleta de Cores
- Verde-água (#A8D5BA): Botões primários, destaques, status "Confirmado"
- Azul claro (#B3D4E5): Botões secundários, elementos de fundo
- Bege (#F5E8C7): Fundo de cards, áreas neutras
- Laranja suave (#F4A261): Alertas, notificações, status "Pendente"
- Branco: Fundo principal
- Cinza escuro: Textos principais

## Responsividade
- Em dispositivos móveis:
  - Cards empilham verticalmente
  - QR Code redimensionado para caber na tela
  - Botões adaptados para toque (maior área clicável)
  - Informações organizadas para visualização vertical
