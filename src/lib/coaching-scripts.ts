/**
 * Pre-test coaching scripts — strategic tips for each test type.
 * Simulates a psychologist explaining how the test works and what to aim for.
 */

interface CoachingScript {
  titulo: string
  descricao: string
  comoFunciona: string[]
  dicasEstrategicas: string[]
  oQueMarcar: string[]
  oQueNaoMarcar: string[]
  exemplosPraticos?: string[]
}

export function getCoachingScript(
  exercicioTitulo: string,
  config: Record<string, unknown>
): CoachingScript {
  const tipoPersonalidade = config.tipo_personalidade as string | undefined
  const categoriaTeste = config.categoria_teste as string | undefined

  // ─── PERSONALITY TESTS ───
  if (tipoPersonalidade === 'BFP' || exercicioTitulo.includes('BFP')) {
    return {
      titulo: 'Como Funciona o BFP',
      descricao: 'O BFP (Bateria Fatorial de Personalidade) avalia 5 grandes fatores da personalidade através de 126 afirmações. Você deve indicar o quanto cada afirmação descreve você.',
      comoFunciona: [
        'Serão apresentadas 126 afirmações sobre comportamentos e sentimentos.',
        'Para cada afirmação, marque na escala de 1 a 7 o quanto ela descreve você.',
        '1 = "Não me descreve" e 7 = "Me descreve totalmente".',
        'Não existe resposta certa ou errada — é sobre seu perfil pessoal.',
        'Responda com base em como você geralmente age, não em situações isoladas.',
      ],
      dicasEstrategicas: [
        'O perfil ideal para concursos policiais valoriza: estabilidade emocional, sociabilidade, responsabilidade e abertura controlada.',
        'Mantenha consistência nas respostas — o teste detecta contradições entre itens similares.',
        'Leia cada afirmação com calma, mas não demore demais. Sua primeira impressão costuma ser a mais autêntica.',
        'Atenção às questões invertidas: algumas frases são formuladas de forma negativa.',
      ],
      oQueMarcar: [
        'Notas ALTAS (6-7) em itens sobre responsabilidade, organização e disciplina.',
        'Notas ALTAS em itens sobre sociabilidade, comunicação e trabalho em equipe.',
        'Notas ALTAS em itens sobre estabilidade emocional e controle de impulsos.',
        'Notas MODERADAS (4-5) em itens sobre abertura a experiências.',
        'Notas BAIXAS (1-2) em itens sobre neuroticismo, ansiedade e vulnerabilidade.',
      ],
      oQueNaoMarcar: [
        'Evite extremos em TODAS as questões (sempre 1 ou sempre 7) — isso gera perfil inválido.',
        'Não marque alto em itens sobre impulsividade, agressividade ou instabilidade.',
        'Não marque baixo em itens sobre empatia, cooperação ou responsabilidade.',
        'Não marque notas muito altas em itens sobre passividade ou submissão.',
      ],
      exemplosPraticos: [
        '"Sou uma pessoa organizada" → Marque 6 ou 7 (responsabilidade alta).',
        '"Fico nervoso facilmente" → Marque 1 ou 2 (baixo neuroticismo).',
        '"Gosto de trabalhar em equipe" → Marque 6 ou 7 (sociabilidade alta).',
        '"Tenho dificuldade em controlar minha raiva" → Marque 1 ou 2 (estabilidade alta).',
      ],
    }
  }

  if (tipoPersonalidade === 'IFP-II' || exercicioTitulo.includes('IFP')) {
    return {
      titulo: 'Como Funciona o IFP-II',
      descricao: 'O IFP-II (Inventário Fatorial de Personalidade) avalia 13 necessidades psicológicas através de 100 afirmações na escala Likert.',
      comoFunciona: [
        'São 100 afirmações sobre necessidades e motivações pessoais.',
        'Marque de 1 a 7 o quanto cada afirmação se aplica a você.',
        '1 = "Nada a ver comigo" e 7 = "Tudo a ver comigo".',
        'O teste avalia necessidades como assistência, dominância, ordem, persistência, entre outras.',
        'Responda pensando no seu comportamento habitual, não em situações específicas.',
      ],
      dicasEstrategicas: [
        'O perfil policial ideal demonstra: alta persistência, ordem, assistência e dominância moderada.',
        'Demonstre equilíbrio — nem submisso demais, nem dominador demais.',
        'Mostre que você é alguém que ajuda os outros, mas com firmeza e autoridade.',
        'A consistência entre respostas similares é fundamental.',
      ],
      oQueMarcar: [
        'Notas ALTAS em itens sobre persistência, dedicação e esforço.',
        'Notas ALTAS em itens sobre organização, método e planejamento.',
        'Notas ALTAS em itens sobre ajudar e proteger outras pessoas.',
        'Notas MODERADAS-ALTAS (5-6) em itens sobre liderança e assertividade.',
        'Notas MODERADAS em itens sobre autonomia e independência.',
      ],
      oQueNaoMarcar: [
        'Evite notas altas em itens sobre agressão, hostilidade ou desprezo.',
        'Não marque alto em itens sobre dependência excessiva ou necessidade de aprovação.',
        'Não marque alto em itens sobre exibicionismo ou vaidade excessiva.',
        'Evite notas baixas em itens sobre responsabilidade social e empatia.',
      ],
      exemplosPraticos: [
        '"Gosto de ajudar pessoas em dificuldade" → Marque 6 ou 7.',
        '"Preciso que os outros me admirem" → Marque 2 ou 3.',
        '"Sou persistente quando enfrento desafios" → Marque 6 ou 7.',
        '"Prefiro que outros tomem decisões por mim" → Marque 1 ou 2.',
      ],
    }
  }

  if (tipoPersonalidade === 'NEO-PI-R' || exercicioTitulo.includes('NEO')) {
    return {
      titulo: 'Como Funciona o NEO PI-R',
      descricao: 'O NEO PI-R avalia os 5 grandes fatores de personalidade (Big Five) com 240 itens, sendo o teste mais completo e detalhado.',
      comoFunciona: [
        'São 240 afirmações divididas em 5 domínios e 30 facetas.',
        'Marque de 1 a 5 o quanto concorda com cada afirmação.',
        '1 = "Discordo fortemente" e 5 = "Concordo fortemente".',
        'Os 5 domínios são: Neuroticismo, Extroversão, Abertura, Amabilidade e Conscienciosidade.',
        'Muitas questões são formuladas de forma invertida — leia com atenção.',
      ],
      dicasEstrategicas: [
        'Este é o teste MAIS LONGO — mantenha o foco e a consistência do início ao fim.',
        'O perfil policial exige: baixo neuroticismo, alta conscienciosidade, extroversão moderada-alta, amabilidade moderada.',
        'Cuidado com questões de dupla negação — leia cada frase duas vezes se necessário.',
        'Não mude seu padrão de resposta ao longo do teste — a consistência é medida.',
      ],
      oQueMarcar: [
        'DISCORDE (1-2) de itens sobre ansiedade, depressão, impulsividade e vulnerabilidade (Neuroticismo baixo).',
        'CONCORDE (4-5) com itens sobre assertividade, sociabilidade e atividade (Extroversão alta).',
        'CONCORDE (4-5) com itens sobre organização, autodisciplina e senso de dever (Conscienciosidade alta).',
        'CONCORDE MODERADAMENTE (3-4) com itens sobre cooperação e confiança (Amabilidade moderada).',
        'MODERE (3) em itens sobre fantasia e valores liberais (Abertura controlada).',
      ],
      oQueNaoMarcar: [
        'Não concorde com itens sobre raiva hostil, instabilidade emocional ou autoconsciência excessiva.',
        'Não discorde de itens sobre senso de dever, competência ou ordem.',
        'Não marque extremos em abertura — nem muito conservador, nem muito liberal.',
        'Evite concordar com itens sobre impulsividade ou busca de emoções arriscadas.',
      ],
      exemplosPraticos: [
        '"Frequentemente me sinto tenso e nervoso" → Marque 1 ou 2 (discordo).',
        '"Sou uma pessoa muito organizada" → Marque 4 ou 5 (concordo).',
        '"Gosto de estar com outras pessoas" → Marque 4 ou 5 (concordo).',
        '"Às vezes perco a paciência" → Marque 1 ou 2 (discordo).',
      ],
    }
  }

  if (tipoPersonalidade === 'CPS' || exercicioTitulo.includes('CPS')) {
    return {
      titulo: 'Como Funciona o CPS',
      descricao: 'O CPS (Escala de Personalidade de Comrey) avalia 8 dimensões da personalidade com 100 itens na escala de 1 a 7.',
      comoFunciona: [
        'São 100 afirmações sobre comportamentos, sentimentos e atitudes.',
        'Marque de 1 a 7 o quanto cada afirmação descreve você.',
        'As 8 dimensões avaliadas incluem: confiança, ordem, conformidade, atividade, estabilidade emocional, extroversão, masculinidade/feminilidade e empatia.',
        'Inclui também escalas de validade para detectar respostas inconsistentes.',
      ],
      dicasEstrategicas: [
        'O perfil policial ideal no CPS demonstra alta estabilidade emocional, ordem, conformidade social e atividade.',
        'Demonstre que você é confiável, organizado e respeitador das regras.',
        'Mostre equilíbrio entre firmeza e empatia.',
        'Mantenha consistência — o CPS tem itens de controle de validade.',
      ],
      oQueMarcar: [
        'Notas ALTAS em itens sobre confiança nos outros e otimismo.',
        'Notas ALTAS em itens sobre ordem, organização e método.',
        'Notas ALTAS em itens sobre respeito às regras e convenções sociais.',
        'Notas ALTAS em itens sobre estabilidade emocional e equilíbrio.',
        'Notas MODERADAS-ALTAS em itens sobre atividade e energia.',
      ],
      oQueNaoMarcar: [
        'Evite notas altas em itens sobre desconfiança, cinismo ou pessimismo.',
        'Não marque alto em itens sobre desorganização ou desprezo por regras.',
        'Não marque baixo em itens sobre empatia e consideração pelos outros.',
        'Evite padrões extremos que ativem a escala de validade.',
      ],
    }
  }

  if (tipoPersonalidade === 'EFN' || exercicioTitulo.includes('EFN')) {
    return {
      titulo: 'Como Funciona o EFN',
      descricao: 'A EFN (Escala Fatorial de Ajustamento Emocional/Neuroticismo) avalia especificamente a estabilidade emocional com 82 itens.',
      comoFunciona: [
        'São 82 afirmações sobre reações emocionais e ajustamento.',
        'Marque de 1 a 7 o quanto cada afirmação se aplica a você.',
        'Avalia 4 fatores: Vulnerabilidade, Desajustamento Psicossocial, Ansiedade e Depressão.',
        'Este teste é CRÍTICO para concursos policiais — mede estabilidade emocional.',
      ],
      dicasEstrategicas: [
        'A estabilidade emocional é o critério MAIS ELIMINATÓRIO em concursos policiais.',
        'O objetivo é demonstrar BAIXO neuroticismo em TODOS os 4 fatores.',
        'Seja consistente — todas as respostas devem apontar para equilíbrio emocional.',
        'Questões invertidas são comuns — leia com muita atenção.',
      ],
      oQueMarcar: [
        'Notas BAIXAS (1-2) em itens sobre ansiedade, preocupação excessiva e nervosismo.',
        'Notas BAIXAS em itens sobre tristeza, desânimo e pensamentos negativos.',
        'Notas BAIXAS em itens sobre vulnerabilidade e fragilidade emocional.',
        'Notas BAIXAS em itens sobre desajustamento social e dificuldade de adaptação.',
        'Em itens invertidos (formulação positiva), marque notas ALTAS (6-7).',
      ],
      oQueNaoMarcar: [
        'NUNCA marque alto em itens sobre medo, pânico ou fobias.',
        'Não marque alto em itens sobre choro fácil, sensibilidade excessiva ou fragilidade.',
        'Não marque alto em itens sobre insônia, pesadelos ou somatização.',
        'Evite marcar alto em itens sobre dificuldade de relacionamento ou isolamento.',
      ],
      exemplosPraticos: [
        '"Fico ansioso com facilidade" → Marque 1 ou 2.',
        '"Costumo me sentir triste sem motivo" → Marque 1 ou 2.',
        '"Me sinto seguro na maioria das situações" → Marque 6 ou 7 (invertida).',
        '"Tenho medo de situações novas" → Marque 1 ou 2.',
      ],
    }
  }

  if (tipoPersonalidade === 'STAXI' || exercicioTitulo.includes('STAXI')) {
    return {
      titulo: 'Como Funciona o STAXI',
      descricao: 'O STAXI (Inventário de Expressão de Raiva Estado-Traço) avalia como você experimenta e expressa raiva, com 44 itens.',
      comoFunciona: [
        'São 44 afirmações divididas em escalas de raiva-estado, raiva-traço e expressão de raiva.',
        'Marque de 1 a 4 o quanto cada afirmação se aplica a você.',
        '1 = "Quase nunca" e 4 = "Quase sempre".',
        'Avalia: intensidade da raiva, frequência, expressão para fora, supressão e controle.',
      ],
      dicasEstrategicas: [
        'A capacidade de CONTROLAR a raiva é o que mais importa neste teste.',
        'O perfil ideal demonstra: baixa raiva-estado, baixa raiva-traço e ALTO controle de raiva.',
        'Diferencie "sentir raiva" de "expressar raiva" — é possível sentir sem agir.',
        'Demonstre maturidade emocional: reconhecer a raiva sem ser dominado por ela.',
      ],
      oQueMarcar: [
        'Notas BAIXAS (1) em itens sobre sentir raiva intensa ou frequente.',
        'Notas BAIXAS em itens sobre expressar raiva verbalmente ou fisicamente.',
        'Notas ALTAS (3-4) em itens sobre controlar a raiva e manter a calma.',
        'Notas MODERADAS em itens sobre reconhecer sentimentos de frustração (é humano).',
      ],
      oQueNaoMarcar: [
        'NUNCA marque alto em itens sobre violência, agressão física ou verbal.',
        'Não marque alto em itens sobre perder o controle ou explodir de raiva.',
        'Não marque baixo em itens sobre controle e manejo da raiva.',
        'Evite marcar 1 em TUDO — algum grau de frustração é normal e esperado.',
      ],
      exemplosPraticos: [
        '"Quando fico com raiva, digo coisas desagradáveis" → Marque 1.',
        '"Consigo controlar minha raiva" → Marque 3 ou 4.',
        '"Fico furioso quando sou criticado" → Marque 1.',
        '"Quando irritado, respiro fundo para me acalmar" → Marque 3 ou 4.',
      ],
    }
  }

  if (tipoPersonalidade === 'IHS' || exercicioTitulo.includes('IHS')) {
    return {
      titulo: 'Como Funciona o IHS',
      descricao: 'O IHS (Inventário de Habilidades Sociais) avalia suas competências em situações sociais com 38 itens.',
      comoFunciona: [
        'São 38 situações sociais do dia a dia.',
        'Marque de 0 a 4 a frequência com que você age da forma descrita.',
        '0 = "Nunca" e 4 = "Sempre".',
        'Avalia 5 fatores: enfrentamento com risco, autoafirmação, conversação, autoexposição e autocontrole.',
      ],
      dicasEstrategicas: [
        'O perfil policial exige ALTAS habilidades sociais em TODOS os fatores.',
        'Demonstre que você sabe se comunicar, liderar e resolver conflitos.',
        'Equilíbrio entre assertividade (falar o que pensa) e controle social (respeitar o outro).',
        'Policiais precisam de enfrentamento com risco alto — não ter medo de se posicionar.',
      ],
      oQueMarcar: [
        'Notas ALTAS (3-4) em itens sobre se posicionar em situações difíceis.',
        'Notas ALTAS em itens sobre iniciar e manter conversas.',
        'Notas ALTAS em itens sobre expressar opiniões e fazer pedidos.',
        'Notas ALTAS em itens sobre autocontrole e lidar com críticas.',
        'Notas ALTAS em itens sobre elogiar, agradecer e ser cordial.',
      ],
      oQueNaoMarcar: [
        'Não marque baixo em itens sobre enfrentar situações sociais desafiadoras.',
        'Não marque baixo em itens sobre falar em público ou se expor.',
        'Não marque alto em itens sobre evitar conflitos por medo.',
        'Evite notas que demonstrem timidez excessiva ou passividade.',
      ],
      exemplosPraticos: [
        '"Consigo pedir favores a colegas" → Marque 3 ou 4.',
        '"Expresso minha opinião mesmo quando discordam" → Marque 3 ou 4.',
        '"Fico calmo quando sou criticado" → Marque 3 ou 4.',
        '"Evito falar em reuniões" → Marque 0 ou 1.',
      ],
    }
  }

  // ─── REASONING TESTS ───
  if (categoriaTeste === 'raciocinio' || exercicioTitulo.includes('Raven') || exercicioTitulo.includes('Matrizes') || exercicioTitulo.includes('G-36') || exercicioTitulo.includes('G-38') || exercicioTitulo.includes('R-1') || exercicioTitulo.includes('Dominó') || exercicioTitulo.includes('Cubo') || exercicioTitulo.includes('Analogi')) {
    return {
      titulo: 'Como Funciona este Teste de Raciocínio',
      descricao: 'Este teste avalia sua capacidade de identificar padrões, regras lógicas e completar sequências. É um teste de inteligência não-verbal.',
      comoFunciona: [
        'Cada questão apresenta uma sequência ou matriz com um elemento faltando.',
        'Você deve analisar o padrão e escolher a alternativa que completa corretamente.',
        'A dificuldade aumenta progressivamente ao longo do teste.',
        'Há tempo limite — administre bem o tempo por questão.',
        'Se não souber, é melhor marcar uma alternativa do que deixar em branco.',
      ],
      dicasEstrategicas: [
        'Comece pelas questões mais fáceis — elas estão no início do teste.',
        'Analise LINHAS e COLUNAS separadamente para encontrar o padrão.',
        'Procure por: rotação, espelhamento, adição/subtração de elementos, alternância.',
        'Se travou em uma questão, passe para a próxima e volte depois.',
        'Gaste no máximo 1-2 minutos por questão nas mais difíceis.',
      ],
      oQueMarcar: [
        'A alternativa que mantém a lógica tanto na horizontal quanto na vertical.',
        'Procure padrões de progressão: tamanho, quantidade, direção, preenchimento.',
        'Em matrizes 3x3, a resposta deve satisfazer a regra da linha E da coluna.',
        'Na dúvida, elimine as alternativas claramente erradas e escolha entre as restantes.',
      ],
      oQueNaoMarcar: [
        'Não escolha a alternativa mais "bonita" — foque na lógica.',
        'Não marque a primeira opção que parece certa — verifique todas.',
        'Evite alternativas que só funcionam para uma dimensão (linha OU coluna, não ambas).',
        'Não gaste tempo demais em questões difíceis — elas valem o mesmo que as fáceis.',
      ],
    }
  }

  // ─── MEMORY TESTS ───
  if (categoriaTeste === 'memoria_visual' || categoriaTeste === 'memoria_reconhecimento' || exercicioTitulo.includes('TSP') || exercicioTitulo.includes('Memória') || exercicioTitulo.includes('Fisionomia')) {
    return {
      titulo: 'Como Funciona o Teste de Memória',
      descricao: 'Este teste avalia sua capacidade de memorizar e reconhecer informações visuais. É fundamental para a atividade policial.',
      comoFunciona: [
        'Na primeira fase, serão apresentados estímulos para você memorizar.',
        'Na segunda fase, você precisará identificar os estímulos que viu anteriormente.',
        'Preste muita atenção aos detalhes — pequenas diferenças são testadas.',
        'O tempo de exposição é limitado — concentre-se desde o início.',
      ],
      dicasEstrategicas: [
        'Use técnicas de associação: conecte cada imagem a algo familiar.',
        'Observe detalhes específicos: formato, posição, orientação, cores.',
        'Tente criar uma "história" mental conectando os elementos.',
        'Não tente memorizar tudo de uma vez — foque em características distintas.',
        'Na fase de reconhecimento, confie na sua primeira impressão.',
      ],
      oQueMarcar: [
        'Marque estímulos que você tem CERTEZA de ter visto.',
        'Na dúvida moderada, marque — a penalidade por omissão costuma ser maior.',
        'Preste atenção em detalhes sutis que diferenciam itens parecidos.',
      ],
      oQueNaoMarcar: [
        'Não marque estímulos que são parecidos mas não idênticos aos originais.',
        'Não marque por impulso — observe bem antes de responder.',
        'Não deixe muitas questões em branco — perde pontos por omissão.',
      ],
    }
  }

  // ─── ATTENTION TESTS (grid-based) ───
  if (exercicioTitulo.includes('AC') || exercicioTitulo.includes('Atenção') || exercicioTitulo.includes('Concentração') || config.grid) {
    return {
      titulo: 'Como Funciona o Teste de Atenção',
      descricao: 'Este teste avalia sua capacidade de atenção concentrada, identificando símbolos-alvo em meio a distratores.',
      comoFunciona: [
        'Uma grade com diversos símbolos será apresentada.',
        'Você deve identificar e marcar TODOS os símbolos-alvo o mais rápido possível.',
        'O símbolo-alvo será mostrado antes do início do teste.',
        'Há tempo limite — velocidade E precisão são importantes.',
        'Símbolos marcados incorretamente contam como erro.',
      ],
      dicasEstrategicas: [
        'Memorize bem o símbolo-alvo antes de começar.',
        'Faça uma varredura SISTEMÁTICA: da esquerda para a direita, linha por linha.',
        'NÃO pule linhas nem faça varredura aleatória.',
        'Mantenha um ritmo constante — nem muito rápido (erros), nem muito lento (omissões).',
        'Se errar, não se preocupe — continue no ritmo.',
      ],
      oQueMarcar: [
        'APENAS o símbolo-alvo indicado nas instruções.',
        'Marque cada ocorrência — não pule nenhuma.',
        'Na dúvida entre dois símbolos muito parecidos, observe detalhes como preenchimento, tamanho ou orientação.',
      ],
      oQueNaoMarcar: [
        'NÃO marque símbolos distratores (parecidos mas diferentes do alvo).',
        'Não clique aleatoriamente para "ganhar tempo" — erros diminuem sua pontuação.',
        'Cuidado com símbolos espelhados ou com preenchimento diferente.',
      ],
    }
  }

  // ─── FALLBACK ───
  return {
    titulo: 'Como Funciona este Teste',
    descricao: 'Este teste avalia habilidades importantes para o perfil policial. Leia as instruções com atenção e responda da forma mais autêntica e consistente possível.',
    comoFunciona: [
      'Leia cada questão com atenção antes de responder.',
      'Há tempo limite — administre bem o tempo.',
      'Responda todas as questões — não deixe nenhuma em branco.',
    ],
    dicasEstrategicas: [
      'Mantenha a calma e o foco durante todo o teste.',
      'Leia a questão duas vezes se necessário.',
      'Confie na sua primeira impressão quando estiver em dúvida.',
    ],
    oQueMarcar: [
      'A resposta que melhor representa o perfil esperado para a função policial.',
    ],
    oQueNaoMarcar: [
      'Evite respostas extremas ou inconsistentes.',
    ],
  }
}
