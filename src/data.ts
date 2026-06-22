import { NewsArticle } from './types';

export const CATEGORY_PRESETS = [
  'Transferências',
  'Jogos',
  'Resultados',
  'Curiosidades'
] as const;

export const IMAGE_PRESETS = [
  {
    name: 'Estádio Iluminado',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
  },
  {
    name: 'Bola no Gramado',
    url: 'https://images.unsplash.com/photo-1540747737956-37872604fec0?q=80&w=1200&auto=format&fit=crop'
  },
  {
    name: 'Chute de Chuteira',
    url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop'
  },
  {
    name: 'Gramado com Rede',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop'
  },
  {
    name: 'Torcida Vibrante',
    url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1200&auto=format&fit=crop'
  },
  {
    name: 'Tática e Prancheta',
    url: 'https://images.unsplash.com/photo-1486282946615-4aeedd3aebd5?q=80&w=1200&auto=format&fit=crop'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'A Nova Era de Estrelas: Gigante de Milão anuncia contratação recorde para a temporada',
    summary: 'A negociação milionária que durou três meses foi finalmente fechada na madrugada deste sábado. O jovem craque sul-americano chega com status de camisa 10 e promete revolucionar a liga europeia de futebol.',
    content: `Depois de três meses de intensas negociações e especulações de bastidores, o anúncio oficial finalmente veio a público neste sábado para delírio dos torcedores italianos. O jovem atacante brasileiro de apenas 21 anos, apontado como uma das grandes promessas para os próximos anos, assinou contrato com o gigante de Milão até junho de 2031.

O acordo foi costurado em valores astronômicos que superam a marca de 95 milhões de euros (aproximadamente R$ 570 milhões), tornando-se de longe a transação mais cara desta janela de transferências europeias. 

"Estou realizando um grande sonho de infância. Vestir este manto histórico e poder atuar no San Siro diante de uma torcida tão fanática é algo inexplicável. Quero fazer história aqui e trazer muitos títulos para este clube", declarou o novo contratado em sua primeira entrevista coletiva com o uniforme do novo time.

A expectativa é que o atleta se junte ao elenco para os treinamentos na próxima segunda-feira, passando por exames médicos finais. O treinador já sinalizou que pretende construir o esquema tático da equipe ao redor do jovem talento, utilizando sua velocidade incomparável e visão de jogo aguçada para dinamizar as transições rápidas nas pontas do gramado.`,
    category: 'Transferências',
    image: 'https://images.unsplash.com/photo-1486282946615-4aeedd3aebd5?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-22T08:15:00-03:00',
    author: 'Renato Silva',
    readTime: '3 min',
    isHighlight: true,
    likes: 342,
    comments: [
      {
        id: 'c1',
        author: 'Marcos Almeida',
        content: 'Baita contratação! Esse garoto joga demais, vai mudar a dinâmica do campeonato inteiro.',
        date: '2026-06-22T09:02:00-03:00'
      },
      {
        id: 'c2',
        author: 'Carlos Eduardo',
        content: 'Valor muito alto, mas o potencial dele é gigante. Tomara que dê certo!',
        date: '2026-06-22T09:12:00-03:00'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Clássico das Multidões decide a vaga na grande final com gol dramático aos 94 minutos',
    summary: 'Em um jogo eletrizante do começo ao fim, com expulsões brutais e gol contra, o clássico regional terminou com uma cabeçada salvadora que selou o destino dos finalistas e inflamou o estádio.',
    content: `O futebol raiz foi elevado ao seu patamar máximo no duelo decisivo da noite passada. Em um estádio completamente lotado, o Clássico das Multidões entregou absolutamente tudo o que os amantes do esporte esperavam: racha técnico, polêmicas de arbitragem, lances inacreditáveis e um final que será lembrado por gerações.

O jogo começou tenso, com pouca criatividade no meio-campo e muitas faltas táticas duras que culminaram em um cartão vermelho direto para o zagueiro visitante logo aos 23 minutos do primeiro tempo. Mesmo com um jogador a menos, a equipe forasteira postou-se como uma verdadeira muralha defensiva e surpreendeu ao abrir o placar em um contra-ataque relâmpago no início do segundo período.

A pressão do time da casa aumentava minuto a minuto. Aos 78 minutos, após uma cobrança de escanteio perfeita, o placar foi igualado. Mas a grande apoteose ficou guardada para o tempo extra de compensação dado pelo árbitro.

Aos 94 minutos de partida, no último suspiro do jogo, o cruzamento vindo do lado esquerdo encontrou o centroavante que se desmarcou pelas costas da zaga adversária. Uma cabeçada firme, consciente, que mandou a bola direto para o ângulo, longe do alcance do goleiro. O estádio tremeu, a arquibancada veio abaixo com a explosão dos torcedores e a vaga da finalíssima foi conquistada de forma épica.`,
    category: 'Jogos',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-21T21:40:00-03:00',
    author: 'Julia Carvalho',
    readTime: '4 min',
    isHighlight: false,
    likes: 215,
    comments: [
      {
        id: 'c3',
        author: 'Fernanda Rocha',
        content: 'Que jogo absurdo! Não lembro de ter visto um final de clássico tão emocionante assim em anos.',
        date: '2026-06-21T22:01:00-03:00'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Análise Tática: Como o Novo Esquema 3-2-4-1 quebrou a defesa invicta do campeonato',
    summary: 'Desvendamos o quebra-cabeça estratégico montado pelo comandante técnico, que usou laterais invertidos e sobreposição no meio de campo para asfixiar os líderes do campeonato.',
    content: `Dizer que o futebol moderno é resolvido em detalhes microscópicos não é clichê, é ciência pura de posicionamento. No confronto mais aguardado do meio de semana, vimos uma verdadeira aula prática de xadrez tático. Uma equipe postulante ao título quebrou a invencibilidade de 14 jogos do atual detentor do caneco de forma magistral.

A receita do sucesso foi o ousado e flexível esquema 3-2-4-1, inspirado em métodos recentes do topo europeu. Três zagueiros puros de movimentação lateral formaram a base inicial. No entanto, a verdadeira mágica reside nos "laterais construtores" que, em fase ofensiva, convergiram para o meio para somar forças com o volante centralizado, agindo como um poderoso escudo duplo.

Essa variação abriu espaços gigantescos para canais internos de infiltração. Com os meias abertos esticando a defesa adversária ao máximo pelas linhas pontilhadas, os criativos meio-campistas tabelaram livremente na intermediária.

O resultado tático foi devastador. A equipe adversária encontrou-se em constante desvantagem numérica onde quer que a bola estivesse, impedindo sua tradicional pressão coordenada. O nocaute tático foi desenhado em jogadas bem moldadas nas entrelinhas de campo. Uma leitura magistral que mostra que no futebol moderno, a mente de quem planeja na prancheta resolve tanto quanto o talento de quem executa no gramado.`,
    category: 'Resultados',
    image: 'https://images.unsplash.com/photo-1540747737956-37872604fec0?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-20T15:20:00-03:00',
    author: 'Artur Mendes',
    readTime: '5 min',
    isHighlight: false,
    likes: 189,
    comments: []
  },
  {
    id: 'art-4',
    title: 'Curiosidades Extras: De onde veio a icônica expressão "Mundo da Bola" e por que o futebol fascina tanto?',
    summary: 'Voltamos aos anos de 1920 para rastrear os primeiros cronistas esportivos de rádio e a fabulosa história de amor coletivo pela esfera de couro costurada à mão.',
    content: `Todo apaixonado por futebol já soltou um caloroso "Mundo da Bola" ou "Planeta Bola" para definir a imensa engrenagem de rituais, conversas de bar, folclores e disputas nacionais. No entanto, de onde nasceu essa relação linguística tão íntima com a redonda?

A nossa jornada volta mais de um século, especificamente na transição da década de 1910 para 1920. Naquela época pioneira, o futebol deixava de ser uma prática aristocrática de salão para invadir as várzeas, subúrbios urbanos e canais de rádio recém-fundados. Foram os icônicos cronistas esportivos do rádio que cunharam a mítica de que a bola é um microuniverso perfeito.

Eles argumentavam que a bola não corre apenas sob a lei da física, mas sim movida pelo afeto, angústia e destino de milhões de almas. Chamar de "Mundo da Bola" era conferir ao jogo um tecido social próprio, onde regras ordinárias perdem o valor em troca de paixões inexplicáveis.

Curiosamente, as primeiras bolas oficiais eram feitas de couro cru de origem bovina crua, preenchidas por bexigas de boi e costuradas por fora por grossas tiras de couro que causavam cicatrizes profundas nas cabeças dos destemidos atletas que tentassem cabecear. As evoluções tecnológicas deixaram o esporte ultraveloz e leve, mas o magnetismo e a mítica espiritual da redonda continuam intocáveis.`,
    category: 'Curiosidades',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-19T10:00:00-03:00',
    author: 'Giselle Fernandes',
    readTime: '3 min',
    isHighlight: false,
    likes: 154,
    comments: [
      {
        id: 'c4',
        author: 'Bruno Martins',
        content: 'Fantástica curiosidade! O futebol tem uma história incrivelmente rica que muitos torcedores novos não conhecem.',
        date: '2026-06-19T11:30:00-03:00'
      }
    ]
  },
  {
    id: 'art-5',
    title: 'A Nova Promessa Européia assina com clube do Oriente Médio em reviravolta chocante',
    summary: 'Aos 24 anos, o talentoso meio-campista recusou propostas de times da Champions League para participar do projeto esportivo e de marketing bilionário nas arábias.',
    content: `Quando todos os holofotes apontavam para uma grande disputa entre clubes do topo inglês e espanhol pela contratação do dinâmico jogador do ano, o futebol foi sacudido por um movimento totalmente fora do radar convencional de mercado esportivo. 

O dinâmico camisa 8 aceitou uma oferta inimaginável para atuar no próspero campeonato saudita ao lado de outras lendas veteranas. A negociação foi acelerada em questão de dias devido a números salariais que extrapolam qualquer patamar ocidental histórico de remuneração esportiva.

Em seu perfil oficial, o atleta explicou sua decisão audaciosa: "Este é um projeto integral de evolução social e desportiva num país de imenso investimento. Quero elevar a liga local a novos horizontes. Sinto que cumpri meu papel de alto rendimento na Europa e agora busco uma experiência totalmente nova".

Veteranos da mídia esportiva apontam que a tendência de jovens atletas estarem migrando para centros financeiros emergentes antes de atingirem o ápice físico dos 28 anos pode abalar de forma permanente a dominância geopolítica dos clubes históricos na Velha Bota e arredores nos próximos anos.`,
    category: 'Transferências',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-18T18:50:00-03:00',
    author: 'Renato Silva',
    readTime: '3 min',
    isHighlight: false,
    likes: 98,
    comments: []
  },
  {
    id: 'art-6',
    title: 'As Histórias das Zebras Mais Famosas da História dos Mundiais de Futebol',
    summary: 'Conheça ou relembre as surpreendentes vitórias de seleções dadas como eliminadas de véspera contra verdadeiras potências mundiais do futebol.',
    content: `Se existisse uma certeza absoluta de que o favoritismo vence sempre no gramado, o futebol seria o jogo mais previsível e sem brilho da terra. O combustível máximo que atrai bilhões de corações é o imprevisível, a chance mística do fraco superar o forte em 90 minutos de entrega absoluta.

Neste artigo especial, resgatamos os três episódios mais épicos das chamadas de "Zebras" na história dos mundiais mundiais de seleções:

1. **A Queda da Campeã Invicta (1990):** Na partida de abertura na Itália, a poderosa equipe da Argentina liderada por ninguém menos que Diego Armando Maradona foi surpreendida pela força física e vigor guerreiro do selecionado de Camarões. Com um placar apertado de 1 a 0 e dois atletas expulsos, os leões africanos contornaram todas as barreiras táticas do mundo.

2. **O Milagre do Leste Europeu (1994):** A badalada Alemanha, campeã do mundo anterior com craques consolidados, caiu prostrada diante de uma Bulgária inspirada que, motivada por seu genial maestro de meio-campo, brilhou intensamente nas oitavas de final nos EUA com gols inacreditáveis de virada.

3. **Invasão Vermelha em Coreia (2002):** A respeitada seleção italiana viu seu sonho derreter diante de uma resiliente seleção da Coreia do Sul, impulsionada por mil vozes unidas num coro uníssono em um jogo que definiu o torneio.

Estas crônicas provam que quando o árbitro apita o início do jogo, estatísticas e cifrões bilionários perdem lugar para o suor, garra estratégica e a inabalada determinação humana.`,
    category: 'Curiosidades',
    image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-17T11:22:00-03:00',
    author: 'Giselle Fernandes',
    readTime: '4 min',
    isHighlight: false,
    likes: 271,
    comments: [
      {
        id: 'c5',
        author: 'Eduardo Santos',
        content: 'Faltou falar da Coreia do Norte em 1966 vencendo a Itália! Aquilo sim foi uma loucura completa haha.',
        date: '2026-06-17T15:10:00-03:00'
      }
    ]
  }
];
