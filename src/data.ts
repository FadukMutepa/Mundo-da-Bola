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

Eles argumentavam que a bola não corre apenas sob a lei da física, mas sim movida pelo afeto, agústia e destino de milhões de almas. Chamar de "Mundo da Bola" era conferir ao jogo um tecido social próprio, onde regras ordinárias perdem o valor em troca de paixões inexplicáveis.

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
  },
  {
    id: 'art-7',
    title: 'Fim da Novela: Lateral da Seleção acerta com atual Campeão Brasileiro',
    summary: 'O defensor de 28 anos assinou por quatro temporadas e chega para suprir a principal carência técnica no setor defensivo da equipe paulista.',
    content: `A busca incessante por um lateral de elite finalmente chegou ao fim para o torcedor do atual campeão nacional. Na tarde de ontem, todas as bases contratuais foram finalizadas e o defensor titular da Seleção Brasileira assinou um vínculo definitivo válido até dezembro de 2029.

Com uma proposta financeira agressiva que inclui bonificações elevadas por metas de desempenho e títulos, o clube paulista conseguiu superar o forte assédio de duas equipes do futebol francês. O valor total da transferência gira em torno de 8 milhões de euros (aproximadamente R$ 48 milhões). 

O atleta, conhecido por sua solidez defensiva extraordinária e cruzamentos cirúrgicos na linha de fundo, será apresentado na manhã de sexta-feira com direito a abertura dos portões do estádio para receber as boas-vindas dos torcedores.

O treinador da equipe celebrou imensamente a concretização da contratação: "É um atleta de hierarquia internacional, experiente e que sabe lidar com a pressão de grandes decisões. Ele vai elevar o nível tático do nosso elenco de forma imediata".`,
    category: 'Transferências',
    image: 'https://images.unsplash.com/photo-1540747737956-37872604fec0?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-16T14:30:00-03:00',
    author: 'Renato Silva',
    readTime: '3 min',
    isHighlight: false,
    likes: 112,
    comments: []
  },
  {
    id: 'art-8',
    title: 'Duelo de Gigantes: Liderança isolada entra em jogo em clássico de alta voltagem',
    summary: 'Os dois melhores ataques do torneio se enfrentam neste domingo com promessa de casa cheia e disputas ferozes em cada milímetro do gramado.',
    content: `Não é apenas mais uma rodada comum, é o confronto direto que pode definir os rumos do título da temporada nacional. O líder e o vice-líder entram em campo separados por apenas um único ponto na tabela de classificação. 

A comissão defensiva de ambas as equipes passou a semana testando esquemas para deter os atacantes mais perigosos do campeonato. De um lado, o quarteto entrosado do time visitante que soma mais de 24 gols marcados. Do outro, o sistema de posse de bola rápido e dinâmico dos donos da casa.

Todas as cargas de ingressos oferecidas aos sócios-torcedores evaporaram em menos de duas horas, garantindo recorde absoluto de público pagante neste ano.

A arbitragem também estará sob os holofotes, tendo sido escalado o árbitro com maior prestígio na comissão de futebol profissional para tentar manter o duelo sob controle tático do apito.`,
    category: 'Jogos',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-15T09:15:00-03:00',
    author: 'Julia Carvalho',
    readTime: '4 min',
    isHighlight: false,
    likes: 145,
    comments: []
  },
  {
    id: 'art-9',
    title: 'Milagre na Chuva: Time da Lanterna arranca empate heróico contra Líder no último segundo',
    summary: 'Sob um temporal incessante que castigou o gramado, a equipe subestimada resistiu bravamente à pressão incessante e debaixo de lama pontuou no placar.',
    content: `A beleza incomparável do futebol reside exatamente no fato de que o favoritismo teórico desmorona diante do suor e da determinação debaixo das quatro linhas. O lanterna do campeonato, desacreditado por comentaristas de mesa redonda, deu uma verdadeira lição de bravura e fé.

Com um gramado pesado e poças acumuladas que dificultavam a tradicional troca de passes curtos do líder, o confronto travou em uma batalha de força e lançamentos longos.

Após sofrer dois gols no primeiro tempo, tudo parecia caminhar para mais uma goleada tranquila. No entanto, as alterações no vestiário surtiram efeito imediato. Após diminuir a desvantagem no início do segundo tempo com um chute cruzado magnífico, a equipe de menor orçamento jogou com a alma.

O empate heróico por 2 a 2 veio aos 96 minutos, após uma cobrança de falta onde o goleiro foi para a área e causou confusão na zaga adversária, sobrando o rebote para o jovem atacante estufar as redes no meio da lama.`,
    category: 'Jogos',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-14T19:40:00-03:00',
    author: 'Julia Carvalho',
    readTime: '3 min',
    isHighlight: false,
    likes: 178,
    comments: []
  },
  {
    id: 'art-10',
    title: 'Tabela de Classificação Atualizada: G-4 se consolida enquanto briga contra rebaixamento esquenta',
    summary: 'A rodada do final de semana desenhou mudanças profundas no destino do torneio, com favoritos tropeçando e azarões surpreendendo nas vagas continentais.',
    content: `Com o encerramento da 15ª rodada do torneio de futebol nacional, a tabela de classificação oficial ganhou contornos fascinantes e dramáticos que prometem agitar as torcidas.

O pelotão da frente está mais compactado do que nunca. O empate do então líder indiscutível abriu caminho para os principais perseguidores colarem na tabela. A distância entre o primeiro e o quarto colocado agora é de apenas três pontos escassos, um único jogo de diferença tática.

Na rabeira da tabela de pontos, a briga pela sobrevivência no campeonato ganhou folhetos de pura emoção e nervosismo. Três equipes venceram seus difíceis compromissos fora de casa, embolando de vez a zona vermelha e jogando equipes tradicionais para perto do descenso.

Com apenas mais quatro rodadas restantes para o término do primeiro turno do campeonato nacional, os times começam a planejar reforços cirúrgicos na janela que se aproxima.`,
    category: 'Resultados',
    image: 'https://images.unsplash.com/photo-1486282946615-4aeedd3aebd5?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-13T22:10:00-03:00',
    author: 'Artur Mendes',
    readTime: '4 min',
    isHighlight: false,
    likes: 132,
    comments: []
  },
  {
    id: 'art-11',
    title: 'Análise Detalhada dos Números: Por que a defesa do campeão é a menos vazada dos últimos 10 anos?',
    summary: 'Fomos a fundo nas estatísticas de interceptações, duelos aéreos e coberturas para mostrar de forma visual como o ferrolho tático funciona com precisão cirúrgica.',
    content: `Os números frios muitas vezes dizem muito mais sobre a consistência de um time campeão do que os melhores dribles ou jogadas ensaiadas no ataque do campo.

A campanha defensiva histórica do líder da temporada chama atenção não por acaso. Com apenas 7 gols sofridos em 18 jogos disputados, a equipe caminha a passos largos para bater o recorde histórico absoluto da era dos pontos corridos.

Utilizando dados e estatísticas detalhadas fornecidas pelos sensores térmicos dos estádios, revelamos os três pilares que sustentam este ferrolho impecável:

1. **Taxa de Interceptações Altas (84%):** O posicionamento cirúrgico dos zagueiros centrais impede que passes em profundidade encontrem os atletas adversários livres nas costas do corredor de contenção.

2. **Duelos Defensivos pelo Alto:** Com uma média de altura acima da média e tempo de bola apurado, o time ganha 3 a cada 4 escanteios cobrados em sua própria grande área de defesa.

3. **Compactações de Linhas Curtas:** Em fase defensiva, a equipe recua suas linhas em bloco, deixando uma distância de no máximo 12 metros de campo entre os meias defensivos e os defensores, encurralando totalmente o meio de campo adversário.`,
    category: 'Resultados',
    image: 'https://images.unsplash.com/photo-1540747737956-37872604fec0?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-12T16:45:00-03:00',
    author: 'Artur Mendes',
    readTime: '5 min',
    isHighlight: false,
    likes: 167,
    comments: []
  },
  {
    id: 'art-12',
    title: 'O Mistério do Número 10: Como a lendária camisa ganhou o peso de representar a genialidade em campo',
    summary: 'Resgatamos as origens históricas de como um número atribuído de forma puramente aleatória em 1958 transformou o número na marca registrada do craque máximo.',
    content: `O número 10 estampado nas costas de uma camisa de futebol evoca imediatamente imagens de talento transcendental, lances mágicos, passes milimétricos e gols antológicos na torrente viva da arquibancada. Mas você sabia que a consagração mística deste número nasceu de um puro acaso burocrático?

Antes da Copa do Mundo de 1958 na Suécia, as seleções numéricas não possuiuam atribuições de status fixas associadas aos jogadores. A delegação brasileira, em face às pressões de planejamento da época, enviou a lista de convocados oficiais para a FIFA sem definir os números de camisa correspondentes para os atletas.

Um funcionário da associação organizadora, de forma puramente arbitrária para preencher os formulários pendentes, distribuiu os números de 1 a 22 de forma aleatória.

Por um capricho divino dos deuses do futebol, a camisa de número 10 caiu no colo de um garoto de apenas 17 anos chamado Edson Arantes do Nascimento, que em poucas semanas assombraria o planeta de chuteiras. O resto é história de pura realeza lírica.`,
    category: 'Curiosidades',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop',
    date: '2026-06-11T11:00:00-03:00',
    author: 'Giselle Fernandes',
    readTime: '3 min',
    isHighlight: false,
    likes: 233,
    comments: []
  }
];
