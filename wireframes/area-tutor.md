# Wireframe de Baixa Fidelidade - Área do Tutor Amor Pet

## Menu de Navegação
- Logo "Amor Pet" (à esquerda)
- Links de navegação (à direita):
  - Dashboard
  - Meus Pets
  - Agendamentos
  - Planos
  - Perfil
  - Sair

## Dashboard do Tutor
- Saudação: "Olá, [Nome do Tutor]"
- Seção "Próximos Agendamentos":
  - Cards com data, horário, pet e serviço
  - Botão "Ver detalhes" em cada card
  - Botão "Agendar novo serviço"
- Seção "Meus Planos Ativos":
  - Cards com tipo de plano e saldo
  - Ex: "Plano 4 Banhos - Restam 2 banhos"
  - Botão "Adquirir plano" se não houver planos ativos
- Seção "Meus Pets":
  - Miniaturas dos pets cadastrados
  - Botão "Adicionar novo pet"

## Cadastro/Edição de Pet
- Título: "Adicionar novo pet" ou "Editar informações do pet"
- Formulário:
  - Upload de foto (com área para arrastar ou selecionar arquivo)
  - Nome do pet
  - Espécie (dropdown: Cão, Gato, Outro)
  - Raça (campo de texto ou dropdown dependendo da espécie)
  - Idade
  - Peso (kg)
  - Observações (textarea para informações adicionais)
  - Botão "Cancelar" (secundário)
  - Botão "Salvar" (primário)

## Lista de Pets
- Título: "Meus Pets"
- Filtro/Busca por nome
- Lista de pets:
  - Foto do pet
  - Nome
  - Espécie/Raça
  - Idade/Peso
  - Botões de ação:
    - "Editar"
    - "Excluir"
    - "Agendar serviço"
- Botão "Adicionar novo pet" (fixo no canto inferior direito)

## Perfil do Tutor
- Título: "Meu Perfil"
- Formulário:
  - Nome completo
  - E-mail (desabilitado para edição)
  - Telefone
  - Botão "Alterar senha"
  - Botão "Cancelar" (secundário)
  - Botão "Salvar alterações" (primário)

## Alteração de Senha
- Título: "Alterar senha"
- Formulário:
  - Senha atual
  - Nova senha
  - Confirmar nova senha
  - Botão "Cancelar" (secundário)
  - Botão "Salvar nova senha" (primário)

## Paleta de Cores
- Verde-água (#A8D5BA): Botões primários, destaques
- Azul claro (#B3D4E5): Botões secundários, elementos de fundo
- Bege (#F5E8C7): Fundo de cards, áreas neutras
- Laranja suave (#F4A261): Alertas, notificações
- Branco: Fundo principal
- Cinza escuro: Textos principais

## Responsividade
- Em dispositivos móveis:
  - Menu se transforma em menu hamburger
  - Cards empilham verticalmente
  - Formulários ocupam toda a largura da tela
  - Botões adaptados para toque (maior área clicável)
