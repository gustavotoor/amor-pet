# Guia de Estilo - Amor Pet

## Paleta de Cores

O sistema Amor Pet utiliza uma paleta de cores suave e amigável, inspirada no universo pet:

- **Verde-água (#A8D5BA)**: Cor primária, transmite calma e cuidado. Utilizada em cabeçalhos, botões principais e elementos de destaque.
- **Azul claro (#B3D4E5)**: Cor secundária, transmite confiança e serenidade. Utilizada em elementos secundários, cards e fundos alternativos.
- **Bege (#F5E8C7)**: Cor neutra, transmite neutralidade e acolhimento. Utilizada em fundos, cards e elementos de contraste suave.
- **Laranja suave (#F4A261)**: Cor de destaque, transmite energia e carinho. Utilizada em botões de ação, alertas e elementos que precisam de atenção.

### Aplicação das Cores

- **Fundos**: Branco (#FFFFFF) como cor principal, com seções alternadas em bege muito claro (#F9F5EB).
- **Textos**: Cinza escuro (#333333) para texto principal, cinza médio (#666666) para texto secundário.
- **Botões Principais**: Verde-água (#A8D5BA) com texto branco.
- **Botões Secundários**: Contorno verde-água com texto verde-água.
- **Botões de Ação**: Laranja suave (#F4A261) com texto branco.
- **Links**: Azul claro (#B3D4E5) em estado normal, verde-água (#A8D5BA) em hover.
- **Alertas**: Sucesso (verde-água), Informação (azul claro), Aviso (laranja suave), Erro (vermelho suave #E76F51).

## Tipografia

O sistema utiliza uma combinação de fontes que transmitem modernidade e acessibilidade:

- **Título Principal**: Montserrat Bold, 32px
- **Subtítulos**: Montserrat SemiBold, 24px
- **Cabeçalhos de Seção**: Montserrat Medium, 20px
- **Texto de Corpo**: Open Sans Regular, 16px
- **Texto Secundário**: Open Sans Light, 14px
- **Botões e CTAs**: Montserrat Medium, 16px
- **Formulários**: Open Sans Regular, 16px

## Elementos de Interface

### Botões

- **Botões Primários**: Cantos arredondados (8px), preenchimento completo, padding 12px 24px.
- **Botões Secundários**: Cantos arredondados (8px), apenas contorno, padding 12px 24px.
- **Botões de Ícone**: Circular, 40px x 40px, com ícone centralizado.
- **Estados**: Normal, Hover (escurece 10%), Ativo (escurece 15%), Desabilitado (opacidade 50%).

### Formulários

- **Campos de Entrada**: Cantos arredondados (6px), borda leve (#DDDDDD), padding 10px 12px.
- **Labels**: Posicionados acima dos campos, Open Sans Medium 14px.
- **Mensagens de Erro**: Texto vermelho suave abaixo do campo, Open Sans Regular 12px.
- **Checkbox e Radio**: Personalizado com cores do sistema.
- **Select**: Estilizado para combinar com os campos de entrada.

### Cards

- **Card Padrão**: Cantos arredondados (12px), sombra suave, padding 20px, fundo branco.
- **Card de Destaque**: Cantos arredondados (12px), sombra média, padding 20px, borda superior 4px na cor primária.
- **Card de Serviço**: Cantos arredondados (12px), imagem superior, conteúdo com padding 20px.

### Ícones

O sistema utiliza a biblioteca React Icons, com preferência para os conjuntos:
- **Font Awesome** (FaIcon) para ícones gerais
- **Material Design** (MdIcon) para ícones de interface
- **Tamanho padrão**: 20px para ícones em texto, 24px para ícones em botões

## Componentes Específicos

### Navegação

- **Menu Principal**: Fundo branco, texto cinza escuro, item ativo com borda inferior verde-água.
- **Sidebar**: Fundo bege muito claro, itens com ícone à esquerda, item ativo com fundo verde-água e texto branco.
- **Breadcrumbs**: Texto pequeno (12px), separados por ">" em cinza claro.

### Tabelas

- **Cabeçalho**: Fundo verde-água claro, texto cinza escuro, padding 12px.
- **Linhas**: Alternância entre branco e bege muito claro, padding 12px.
- **Borda**: Apenas horizontal, cinza muito claro (#EEEEEE).
- **Ações**: Ícones alinhados à direita.

### Calendário e Agendamento

- **Dias Disponíveis**: Verde-água claro.
- **Dias Indisponíveis**: Cinza claro.
- **Dia Selecionado**: Verde-água com texto branco.
- **Horários**: Cards pequenos, selecionável com mudança de cor.

### Notificações e Alertas

- **Sucesso**: Fundo verde-água muito claro, ícone e borda verde-água.
- **Informação**: Fundo azul claro muito claro, ícone e borda azul claro.
- **Aviso**: Fundo laranja muito claro, ícone e borda laranja suave.
- **Erro**: Fundo vermelho muito claro, ícone e borda vermelho suave.

## Responsividade

O sistema é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo, sidebar visível (1200px+)
- **Tablet**: Layout adaptado, sidebar colapsável (768px - 1199px)
- **Mobile**: Layout simplificado, menu hamburger, empilhamento de elementos (até 767px)

### Breakpoints

- **Extra Small**: até 575px
- **Small**: 576px - 767px
- **Medium**: 768px - 991px
- **Large**: 992px - 1199px
- **Extra Large**: 1200px+

## Acessibilidade

- **Contraste**: Todos os textos mantêm contraste mínimo de 4.5:1 com o fundo.
- **Foco**: Elementos interativos têm estado de foco visível.
- **Alternativas**: Imagens têm texto alternativo, ícones têm labels acessíveis.
- **Navegação**: Estrutura semântica para leitores de tela.
- **Formulários**: Labels associados corretamente aos campos.

## Animações e Transições

- **Transições**: Suaves, 0.3s para mudanças de estado (hover, focus).
- **Animações de Carregamento**: Spinner personalizado nas cores do sistema.
- **Animações de Entrada**: Fade-in suave para modais e notificações.
- **Animações de Feedback**: Pequena animação de escala em botões ao clicar.

---

Este guia de estilo serve como referência para manter a consistência visual em todo o sistema Amor Pet.
