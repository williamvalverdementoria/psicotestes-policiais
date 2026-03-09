/**
 * Pre-test coaching scripts — strategic tips for each test type.
 * Based on official test manuals (BFP, IFP-II, NEO PI-R, CPS, EFN, STAXI, IHS)
 * and profissiogramas for concursos policiais brasileiros.
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

  // ─── BFP (Bateria Fatorial de Personalidade) ───
  // 126 itens, escala Likert 1-7, 5 fatores com 17 subfacetas
  // Autores: Nunes, Hutz & Nunes (Casa do Psicólogo)
  if (tipoPersonalidade === 'BFP' || exercicioTitulo.includes('BFP')) {
    return {
      titulo: 'Como Funciona o BFP',
      descricao: 'O BFP (Bateria Fatorial de Personalidade) avalia 5 grandes fatores da personalidade — Neuroticismo, Extroversão, Socialização, Realização e Abertura — através de 126 afirmações na escala de 1 a 7.',
      comoFunciona: [
        'Serão apresentadas 126 afirmações sobre comportamentos e sentimentos.',
        'Para cada afirmação, marque na escala de 1 a 7: 1 = "Não me descreve" e 7 = "Me descreve totalmente".',
        'Os 5 fatores avaliados são: Neuroticismo (N), Extroversão (E), Socialização (S), Realização (R) e Abertura (A).',
        'Cada fator possui subfacetas — ex: Neuroticismo avalia Vulnerabilidade, Instabilidade Emocional, Passividade e Depressão.',
        'Algumas questões são invertidas (formulação oposta) — leia com atenção.',
      ],
      dicasEstrategicas: [
        'O perfil policial exige: Neuroticismo BAIXO (≤20° percentil), Extroversão e Socialização MODERADAS (35-60°), Realização MODERADA (35-60°) e Abertura MODERADA (30-60°).',
        'O Neuroticismo é o fator mais eliminatório — TODAS as 4 subfacetas (Vulnerabilidade, Instabilidade, Passividade, Depressão) precisam estar ≤20° percentil.',
        'Mantenha consistência — o teste detecta contradições entre itens que medem o mesmo traço.',
        'Atenção às questões invertidas: frases como "Dificilmente perdoo" são invertidas em Socialização.',
      ],
      oQueMarcar: [
        'Notas BAIXAS (1-2) em itens sobre nervosismo, ansiedade, tristeza, passividade e instabilidade (baixo Neuroticismo).',
        'Notas MODERADAS-ALTAS (5-6) em itens sobre comunicação, dinamismo e interação social (Extroversão adequada).',
        'Notas ALTAS (5-7) em itens sobre amabilidade, confiança e prossociabilidade (Socialização alta).',
        'Notas MODERADAS (5-6) em itens sobre competência, ponderação e empenho (Realização adequada).',
        'Notas MODERADAS (4-5) em itens sobre abertura a ideias, liberalismo e busca por novidades (Abertura controlada).',
      ],
      oQueNaoMarcar: [
        'NUNCA marque alto (6-7) em itens que descrevem ansiedade, vulnerabilidade, depressão ou passividade.',
        'Não marque baixo em itens sobre respeito aos outros, confiança ou cooperação (Socialização).',
        'Evite marcar muito alto (7) em Altivez — o percentil ideal é entre 20-70%.',
        'Não marque extremos em itens de Abertura — valores muito altos ou baixos eliminam.',
        'Evite padrão de respostas idênticas (sempre 7 ou sempre 1) — invalida o teste.',
      ],
      exemplosPraticos: [
        '"Fico nervoso facilmente" → Marque 1 ou 2 (Instabilidade Emocional - N2 baixo).',
        '"Tento fazer com que as pessoas se sintam bem" → Marque 6 ou 7 (Amabilidade - S1 alto).',
        '"Tomo cuidado com o que falo" → Marque 5 ou 6 (Ponderação - R2 moderado-alto).',
        '"Mesmo quando preciso resolver algo, costumo adiar" → Marque 1 ou 2 (Passividade - N3 baixo).',
      ],
    }
  }

  // ─── IFP-II (Inventário Fatorial de Personalidade) ───
  // 100 itens, escala Likert 1-7, 13 escalas baseadas na teoria de Murray
  // Publicado por Casa do Psicólogo / Pearson
  if (tipoPersonalidade === 'IFP-II' || exercicioTitulo.includes('IFP')) {
    return {
      titulo: 'Como Funciona o IFP-II',
      descricao: 'O IFP-II (Inventário Fatorial de Personalidade) avalia 13 necessidades psicológicas baseadas na teoria de Murray, com 100 afirmações na escala de 1 a 7.',
      comoFunciona: [
        'São 100 afirmações sobre necessidades e motivações pessoais.',
        'Marque de 1 a 7: 1 = "Nada característico" e 7 = "Totalmente característico".',
        'As 13 escalas são: Assistência, Intracepção, Afago, Deferência, Afiliação, Dominância, Desempenho, Exibição, Agressividade, Ordem, Persistência, Mudança e Autonomia.',
        'Possui também escala de Desejabilidade Social para detectar respostas forçadas.',
        'Cada escala tem um critério percentílico específico (mínimo e/ou máximo) para aprovação.',
      ],
      dicasEstrategicas: [
        'Para ser APTO, é preciso atingir o critério em pelo menos 5 das 13 escalas (conforme edital).',
        'Os critérios MAIS RESTRITIVOS são: Agressividade ≤20%, Afago ≤30% e Autonomia ≤30%.',
        'Demonstre equilíbrio: Deferência ≥40% (respeito à hierarquia) mas Dominância ≥25% (capacidade de liderança).',
        'A escala de Desejabilidade Social detecta tentativas de forçar um perfil ideal — seja consistente, não extremo.',
      ],
      oQueMarcar: [
        'Notas ALTAS (5-7) em itens de Assistência (ajudar/proteger) — critério ≥30%.',
        'Notas ALTAS em itens de Deferência (respeito à autoridade) — critério ≥40%.',
        'Notas ALTAS em itens de Desempenho (motivação, superar obstáculos) — critério ≥40%.',
        'Notas ALTAS em itens de Persistência (perseverança, terminar o que começou) — critério ≥25%.',
        'Notas MODERADAS-ALTAS em itens de Ordem (organização) — critério ≥50% e ≤90%.',
        'Notas MODERADAS em itens de Afiliação (vínculo social) — critério ≥40%.',
      ],
      oQueNaoMarcar: [
        'NUNCA marque alto em itens de Agressividade (hostilidade, confronto) — critério ≤20%.',
        'Não marque alto em itens de Afago (necessidade de proteção/carinho excessivo) — critério ≤30%.',
        'Não marque alto em itens de Autonomia (independência extrema) — critério ≤30%.',
        'Não marque alto em itens de Exibição (necessidade de atenção) — critério ≤35%.',
        'Evite marcar alto em itens de Intracepção (guiar-se só por sentimentos) — critério ≤50%.',
        'Cuidado com Mudança — o critério é ≥25% e ≤50%, então moderado.',
      ],
      exemplosPraticos: [
        '"Gosto de ajudar meus amigos quando estão com problemas" → Marque 6 ou 7 (Assistência).',
        '"Aceito com prazer a liderança das pessoas que admiro" → Marque 5 ou 6 (Deferência).',
        '"Gosto de concluir qualquer trabalho que tenha começado" → Marque 6 ou 7 (Persistência).',
        '"Gosto de dizer aos outros como fazer seus trabalhos" → Marque 4 ou 5 (Dominância moderada).',
      ],
    }
  }

  // ─── NEO PI-R ───
  // 240 itens, escala Likert 1-5, 5 domínios com 30 facetas (6 por domínio)
  // Adaptação brasileira por Flores-Mendoza (Vetor Editora)
  if (tipoPersonalidade === 'NEO-PI-R' || exercicioTitulo.includes('NEO')) {
    return {
      titulo: 'Como Funciona o NEO PI-R',
      descricao: 'O NEO PI-R avalia os 5 grandes fatores de personalidade (Big Five) com 240 itens e 30 facetas. É o teste de personalidade mais extenso e detalhado.',
      comoFunciona: [
        'São 240 afirmações divididas em 5 domínios, cada um com 6 facetas.',
        'Marque de 1 a 5: 1 = "Discordo fortemente" e 5 = "Concordo fortemente".',
        'Domínios: Neuroticismo (máx 60%), Extroversão (20-90%), Abertura (20-80%), Amabilidade (20-80/100%) e Conscienciosidade (30-100%).',
        'Muitas questões são invertidas — ex: "Sou uma pessoa despreocupada" é invertida em Neuroticismo/Ansiedade.',
        'Cada faceta tem critérios mínimos e máximos de percentil independentes.',
      ],
      dicasEstrategicas: [
        'Este é o teste MAIS LONGO (240 itens) — mantenha ritmo e consistência do início ao fim.',
        'Neuroticismo: TODAS as 6 facetas (Ansiedade, Depressão, Embaraço, Impulsividade, Raiva, Vulnerabilidade) devem ficar ≤60%.',
        'Conscienciosidade é o domínio com critérios MAIS ALTOS — Competência exige ≥40%, as demais ≥30%.',
        'Cuidado com itens invertidos — o NEO PI-R tem muitos. Se a frase é positiva mas a faceta é Neuroticismo, DISCORDE.',
      ],
      oQueMarcar: [
        'DISCORDE (1-2) de itens sobre ansiedade, depressão, embaraço, impulsividade, raiva e vulnerabilidade (Neuroticismo ≤60%).',
        'CONCORDE (4-5) com itens sobre assertividade (≥30%), atividade (≥30%) e acolhimento (≥20%) em Extroversão.',
        'CONCORDE (4-5) com itens sobre competência (≥40%), autodisciplina (≥30%), ordem (≥30%) e senso de dever (≥30%) em Conscienciosidade.',
        'CONCORDE MODERADAMENTE (3-4) com itens de Amabilidade: altruísmo (≥30%), confiança, franqueza, complacência (≥20%).',
        'MODERE (3) em itens de Abertura: fantasia (20-80%), ideias (20-80%), valores (20-80%), ações (20-80%).',
      ],
      oQueNaoMarcar: [
        'NUNCA concorde com itens sobre raiva hostil, impulsividade ou vulnerabilidade emocional.',
        'Não discorde de itens sobre competência, senso de dever ou autodisciplina.',
        'Não marque extremos em Abertura — valores fora de 20-80% eliminam em várias facetas.',
        'Evite concordar fortemente com itens de Busca de Sensações — o máximo é livre mas cuidado com coerência.',
        'Atenção: Embaraço (autoconsciência social) também precisa ser ≤60% — não concorde com frases sobre vergonha excessiva.',
      ],
      exemplosPraticos: [
        '"Sou uma pessoa despreocupada" → Marque 4 ou 5 (invertida — discordar = alta ansiedade).',
        '"Sou dominador(a), firme e assertivo(a)" → Marque 4 ou 5 (Assertividade ≥30%).',
        '"Sou conhecido(a) pela minha prudência e bom senso" → Marque 4 ou 5 (Competência ≥40%).',
        '"Muitas vezes fico irritado(a) com a maneira como me tratam" → Marque 1 ou 2 (Raiva ≤60%).',
      ],
    }
  }

  // ─── CPS (Escala de Personalidade de Comrey) ───
  // 100 itens, escala Likert 1-7, 8 dimensões + 2 escalas de validade
  // Adaptação brasileira (Vetor Editora)
  if (tipoPersonalidade === 'CPS' || exercicioTitulo.includes('CPS')) {
    return {
      titulo: 'Como Funciona o CPS',
      descricao: 'O CPS (Escala de Personalidade de Comrey) avalia 8 dimensões da personalidade com 100 itens na escala de 1 a 7, mais 2 escalas de controle (Validação e Desejabilidade Social).',
      comoFunciona: [
        'São 100 afirmações sobre comportamentos, sentimentos e atitudes.',
        'Marque de 1 a 7: 1 = "Nunca/Certamente não" e 7 = "Sempre/Certamente sim".',
        'As 8 dimensões são: Confiança, Ordem, Conformidade, Atividade, Autoconfiança, Expansão, Enfrentamento e Altruísmo.',
        'Há 2 escalas de validade: Validação (respostas óbvias) e Desejabilidade Social (tendência a impressionar).',
        'Algumas questões possuem gabarito invertido — a pontuação é recalculada automaticamente.',
      ],
      dicasEstrategicas: [
        'Os critérios avaliados são: Conformidade ≥50%, Atividade ≥40%, Autoconfiança ≥50%, Expansão entre 30-90%, Enfrentamento ≥50% e Altruísmo entre 30-90%.',
        'A escala de Validação tem itens óbvios (ex: "Neste momento estou vivo") — responda com coerência para validar o teste.',
        'Demonstre que você respeita regras (Conformidade), tem energia (Atividade) e enfrenta situações difíceis (Enfrentamento).',
        'Cuidado: Expansão e Altruísmo têm TETO — valores acima de 90% podem indicar perfil inadequado.',
      ],
      oQueMarcar: [
        'Notas ALTAS (5-7) em itens sobre respeitar leis e convenções sociais (Conformidade ≥50%).',
        'Notas ALTAS em itens sobre energia, disposição e capacidade de trabalho (Atividade ≥40%).',
        'Notas ALTAS em itens sobre segurança pessoal e autoestima (Autoconfiança ≥50%).',
        'Notas ALTAS em itens sobre enfrentar situações difíceis sem medo (Enfrentamento ≥50%).',
        'Notas MODERADAS-ALTAS em itens sobre sociabilidade e comunicação (Expansão 30-90%).',
        'Notas MODERADAS-ALTAS em itens sobre ajudar o próximo (Altruísmo 30-90%).',
      ],
      oQueNaoMarcar: [
        'Não marque baixo em itens sobre respeitar regras — Conformidade precisa ser ≥50%.',
        'Não marque baixo em itens sobre coragem e enfrentamento — critério ≥50%.',
        'Não marque valores extremos em Expansão ou Altruísmo — o teto é 90%.',
        'Cuidado com itens de Validação (frases óbvias) — responda corretamente ou o teste é invalidado.',
        'Não marque alto em itens invertidos — ex: "Viveria em locais de pouca higiene" é invertido em Ordem.',
      ],
      exemplosPraticos: [
        '"A maioria das pessoas é honesta" → Marque 5 ou 6 (Confiança).',
        '"Posso trabalhar muito tempo sem me sentir cansado" → Marque 6 ou 7 (Atividade).',
        '"Se as leis são injustas, devem ser desobedecidas" → Marque 1 ou 2 (Conformidade — invertido).',
        '"Tenho a impressão de que vou desmaiar quando vejo sangue" → Marque 1 ou 2 (Enfrentamento — invertido).',
      ],
    }
  }

  // ─── EFN (Escala Fatorial de Ajustamento Emocional/Neuroticismo) ───
  // 82 itens, escala Likert 1-7, 4 fatores
  // Publicado por Casa do Psicólogo
  if (tipoPersonalidade === 'EFN' || exercicioTitulo.includes('EFN')) {
    return {
      titulo: 'Como Funciona a EFN',
      descricao: 'A EFN (Escala Fatorial de Ajustamento Emocional/Neuroticismo) avalia especificamente a estabilidade emocional com 82 itens na escala 1-7. É o teste mais crítico para concursos policiais.',
      comoFunciona: [
        'São 82 afirmações sobre reações emocionais e ajustamento psicológico.',
        'Marque de 1 a 7: 1 = "Não me descreve", 4 = "Mais ou menos" e 7 = "Descreve-me".',
        'Avalia 4 fatores: Vulnerabilidade, Desajustamento Psicossocial, Ansiedade e Depressão.',
        'TODOS os 4 fatores precisam ficar ≤60° percentil para aprovação.',
        'Existem itens invertidos (frases positivas) que devem ser marcados com notas ALTAS.',
      ],
      dicasEstrategicas: [
        'Este é o teste MAIS ELIMINATÓRIO — a estabilidade emocional é requisito essencial para policiais.',
        'O critério é o MESMO para os 4 fatores: todos devem ficar ≤60% (abaixo do percentil 60).',
        'Itens invertidos são frases positivas como "Geralmente me sinto feliz" — nestes, marque 6 ou 7.',
        'Seja consistente em demonstrar equilíbrio emocional ao longo de TODO o teste.',
      ],
      oQueMarcar: [
        'Notas BAIXAS (1-2) em itens sobre medo de crítica, necessidade de aprovação e insegurança (Vulnerabilidade).',
        'Notas BAIXAS em itens sobre comportamentos desajustados, apostar, ouvir vozes, beber (Desajustamento Psicossocial).',
        'Notas BAIXAS em itens sobre preocupação excessiva, tensão e nervosismo (Ansiedade).',
        'Notas BAIXAS em itens sobre tristeza, desânimo e pessimismo (Depressão).',
        'Notas ALTAS (6-7) em itens INVERTIDOS — frases positivas como "Geralmente me sinto feliz".',
      ],
      oQueNaoMarcar: [
        'NUNCA marque alto em itens sobre dependência emocional, medo ou necessidade de proteção.',
        'Não marque alto em itens sobre uso de álcool, comportamentos impulsivos ou desajustados.',
        'Não marque alto em itens sobre irritabilidade extrema, insônia ou somatização.',
        'Não marque BAIXO em itens invertidos (positivos) — isso indica depressão/vulnerabilidade.',
      ],
      exemplosPraticos: [
        '"Deixo de fazer coisas por medo de ser criticado" → Marque 1 (Vulnerabilidade).',
        '"Com frequência, penso que minha vida é ruim" → Marque 1 (Depressão).',
        '"Geralmente me sinto feliz" → Marque 7 (item invertido — nota alta = ajustamento).',
        '"Sinto-me muito mal quando recebo alguma crítica" → Marque 1 ou 2 (Vulnerabilidade).',
      ],
    }
  }

  // ─── STAXI (Inventário de Expressão de Raiva Estado-Traço) ───
  // 44 itens, escala Likert 1-4
  // Adaptação brasileira por Spielberger (Vetor Editora)
  if (tipoPersonalidade === 'STAXI' || exercicioTitulo.includes('STAXI')) {
    return {
      titulo: 'Como Funciona o STAXI',
      descricao: 'O STAXI (Inventário de Expressão de Raiva Estado-Traço) avalia como você vivencia e expressa a raiva, com 44 itens na escala de 1 a 4.',
      comoFunciona: [
        'São 44 afirmações divididas em: Raiva-Estado (como se sente agora), Raiva-Traço (tendência geral) e Expressão de Raiva.',
        'Marque de 1 a 4: 1 = "Quase nunca" e 4 = "Quase sempre".',
        'As subescalas de expressão são: Raiva para Dentro (supressão), Raiva para Fora (expressão) e Controle de Raiva.',
        'A escala de Controle de Raiva é a MAIS IMPORTANTE — mede sua capacidade de gerenciar a raiva.',
      ],
      dicasEstrategicas: [
        'O perfil ideal: Raiva-Estado BAIXA, Raiva-Traço BAIXA, Expressão para Fora BAIXA e Controle de Raiva ALTO.',
        'Diferencie as partes do teste: a primeira seção pergunta "como me sinto AGORA" e a segunda "como GERALMENTE reajo".',
        'É normal sentir alguma frustração — o teste mede como você LIDA com ela, não se ela existe.',
        'Demonstre maturidade emocional: reconhecer sentimentos negativos sem ser dominado por eles.',
      ],
      oQueMarcar: [
        'Notas BAIXAS (1) na seção Raiva-Estado — "neste momento, sinto..." → quase nunca.',
        'Notas BAIXAS (1-2) em itens de Raiva-Traço — "quando me frustro, costumo...".',
        'Notas BAIXAS em itens sobre expressar raiva verbalmente ou fisicamente (Raiva para Fora).',
        'Notas ALTAS (3-4) em itens sobre controlar a raiva, manter a calma e usar estratégias de enfrentamento.',
      ],
      oQueNaoMarcar: [
        'NUNCA marque alto em itens sobre violência, agressão física ou verbal.',
        'Não marque alto em itens sobre perder o controle, explodir ou agir impulsivamente.',
        'Não marque baixo em itens sobre controle e manejo da raiva — isso indicaria falta de estratégia.',
        'Evite marcar 1 em TUDO — algum grau de frustração é normal. Marcar tudo mínimo ativa a invalidade.',
      ],
      exemplosPraticos: [
        '"Quando fico com raiva, digo coisas desagradáveis" → Marque 1 (Raiva para Fora baixa).',
        '"Consigo controlar minha raiva" → Marque 3 ou 4 (Controle alto).',
        '"Fico furioso quando sou criticado na frente de outros" → Marque 1 (Raiva-Traço baixa).',
        '"Quando irritado, respiro fundo e me acalmo" → Marque 3 ou 4 (Controle alto).',
      ],
    }
  }

  // ─── IHS (Inventário de Habilidades Sociais) ───
  // 38 itens, escala de frequência 0-4, 5 fatores
  // Del Prette & Del Prette (Casa do Psicólogo)
  if (tipoPersonalidade === 'IHS' || exercicioTitulo.includes('IHS')) {
    return {
      titulo: 'Como Funciona o IHS',
      descricao: 'O IHS (Inventário de Habilidades Sociais) de Del Prette avalia suas competências em situações sociais do dia a dia, com 38 itens na escala de 0 a 4.',
      comoFunciona: [
        'São 38 descrições de situações sociais cotidianas.',
        'Marque de 0 a 4 a frequência com que você age da forma descrita: 0 = "Nunca/raramente" e 4 = "Sempre/quase sempre".',
        'Avalia 5 fatores: Enfrentamento e Autoafirmação com Risco, Autoafirmação na Expressão de Sentimento Positivo, Conversação e Desenvoltura Social, Autoexposição a Desconhecidos e Autocontrole da Agressividade.',
        'A pontuação total e por fator é convertida em percentis para classificação.',
      ],
      dicasEstrategicas: [
        'O perfil policial exige ALTAS habilidades sociais — policiais lidam constantemente com o público.',
        'Enfrentamento com Risco é o fator MAIS IMPORTANTE — demonstre que se posiciona mesmo sob pressão social.',
        'Autocontrole da Agressividade é o equilíbrio: assertivo sim, agressivo não.',
        'Demonstre desenvoltura social — policiais precisam abordar desconhecidos com segurança e cordialidade.',
      ],
      oQueMarcar: [
        'Notas ALTAS (3-4) em itens sobre se posicionar em situações difíceis e defender seus direitos.',
        'Notas ALTAS em itens sobre expressar sentimentos positivos: elogiar, agradecer, demonstrar afeto.',
        'Notas ALTAS em itens sobre iniciar e manter conversas com desconhecidos.',
        'Notas ALTAS em itens sobre falar em público e se expor socialmente.',
        'Notas ALTAS em itens sobre manter a calma diante de críticas e provocações (Autocontrole).',
      ],
      oQueNaoMarcar: [
        'Não marque baixo em itens sobre enfrentar situações sociais desafiadoras — isso indica timidez.',
        'Não marque baixo em itens sobre falar em público ou abordar desconhecidos.',
        'Não marque alto em itens sobre reagir agressivamente a críticas — isso é diferente de autocontrole.',
        'Evite notas que demonstrem evitação social, passividade ou medo de conflito.',
      ],
      exemplosPraticos: [
        '"Consigo pedir favores a colegas quando preciso" → Marque 3 ou 4 (Autoafirmação).',
        '"Expresso minha opinião mesmo quando discordam de mim" → Marque 3 ou 4 (Enfrentamento).',
        '"Quando sou criticado injustamente, consigo me defender sem agressividade" → Marque 3 ou 4 (Autocontrole).',
        '"Em um grupo, evito falar para não chamar atenção" → Marque 0 ou 1 (item invertido).',
      ],
    }
  }

  // ─── REASONING TESTS ───
  if (categoriaTeste === 'raciocinio' || exercicioTitulo.includes('Raven') || exercicioTitulo.includes('Matrizes') || exercicioTitulo.includes('G-36') || exercicioTitulo.includes('G-38') || exercicioTitulo.includes('R-1') || exercicioTitulo.includes('Dominó') || exercicioTitulo.includes('Cubo') || exercicioTitulo.includes('Analogi')) {
    return {
      titulo: 'Como Funciona este Teste de Raciocínio',
      descricao: 'Este teste avalia sua capacidade de identificar padrões, regras lógicas e completar sequências. É um teste de inteligência não-verbal — não depende de conhecimentos prévios.',
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
        'Procure por: rotação, espelhamento, adição/subtração de elementos, alternância de preenchimento.',
        'Se travou em uma questão, passe para a próxima e volte depois — não perca tempo.',
        'Gaste no máximo 1-2 minutos por questão nas mais difíceis.',
      ],
      oQueMarcar: [
        'A alternativa que mantém a lógica tanto na horizontal quanto na vertical.',
        'Procure padrões de progressão: tamanho, quantidade, direção, preenchimento.',
        'Em matrizes 3x3, a resposta deve satisfazer a regra da linha E da coluna simultaneamente.',
        'Na dúvida, elimine as alternativas claramente erradas e escolha entre as restantes.',
      ],
      oQueNaoMarcar: [
        'Não escolha a alternativa mais "bonita" ou simétrica — foque na lógica do padrão.',
        'Não marque a primeira opção que parece certa — verifique todas as alternativas.',
        'Evite alternativas que só funcionam para uma dimensão (linha OU coluna, não ambas).',
        'Não gaste tempo demais em questões difíceis — elas valem o mesmo que as fáceis.',
      ],
    }
  }

  // ─── MEMORY TESTS ───
  if (categoriaTeste === 'memoria_visual' || categoriaTeste === 'memoria_reconhecimento' || exercicioTitulo.includes('TSP') || exercicioTitulo.includes('Memória') || exercicioTitulo.includes('Fisionomia')) {
    return {
      titulo: 'Como Funciona o Teste de Memória',
      descricao: 'Este teste avalia sua capacidade de memorizar e reconhecer informações visuais. A memória é uma habilidade fundamental para a atividade policial.',
      comoFunciona: [
        'Na primeira fase, serão apresentados estímulos para você memorizar.',
        'Na segunda fase, você precisará identificar os estímulos que viu anteriormente.',
        'Preste muita atenção aos detalhes — pequenas diferenças são testadas.',
        'O tempo de exposição é limitado — concentre-se desde o início.',
      ],
      dicasEstrategicas: [
        'Use técnicas de associação: conecte cada imagem a algo familiar (pessoa conhecida, lugar).',
        'Observe detalhes específicos: formato do rosto, traços marcantes, expressão, cabelo.',
        'Tente criar uma "história" mental conectando os elementos em sequência.',
        'Não tente memorizar tudo de uma vez — foque em 2-3 características distintas por estímulo.',
        'Na fase de reconhecimento, confie na sua primeira impressão — a memória inconsciente é forte.',
      ],
      oQueMarcar: [
        'Marque estímulos que você tem CERTEZA de ter visto.',
        'Na dúvida moderada, marque — a penalidade por omissão costuma ser maior.',
        'Preste atenção em detalhes sutis que diferenciam itens parecidos.',
      ],
      oQueNaoMarcar: [
        'Não marque estímulos que são parecidos mas não idênticos aos originais.',
        'Não marque por impulso sem observar — erros contam contra você.',
        'Não deixe muitas questões em branco — cada omissão é pontuação perdida.',
      ],
    }
  }

  // ─── ATTENTION TESTS (grid-based) ───
  if (exercicioTitulo.includes('AC') || exercicioTitulo.includes('Atenção') || exercicioTitulo.includes('Concentração') || config.grid) {
    return {
      titulo: 'Como Funciona o Teste de Atenção Concentrada',
      descricao: 'Este teste (modelo AC/TEACO-FF/TEADI) avalia sua capacidade de atenção concentrada, identificando símbolos-alvo em meio a distratores sob pressão de tempo.',
      comoFunciona: [
        'Uma grade com diversos símbolos será apresentada.',
        'Você deve identificar e marcar TODOS os símbolos-alvo o mais rápido possível.',
        'O símbolo-alvo será mostrado antes do início do teste — memorize-o bem.',
        'Há tempo limite — velocidade E precisão são avaliadas simultaneamente.',
        'Fórmula de pontuação: Acertos - Erros = Resultado Líquido. Erros SUBTRAEM da pontuação.',
      ],
      dicasEstrategicas: [
        'Memorize bem o símbolo-alvo ANTES de começar — observe cada detalhe (preenchimento, orientação, formato).',
        'Faça uma varredura SISTEMÁTICA: da esquerda para a direita, linha por linha, de cima para baixo.',
        'NÃO pule linhas nem faça varredura aleatória — isso causa omissões.',
        'Mantenha um ritmo constante — nem muito rápido (causa erros), nem muito lento (causa omissões).',
        'Se errar, não se preocupe — continue no ritmo sem voltar. O tempo é mais valioso.',
      ],
      oQueMarcar: [
        'APENAS o símbolo-alvo indicado nas instruções — observe preenchimento, orientação e formato.',
        'Marque TODAS as ocorrências — cada alvo não marcado é uma omissão que reduz a pontuação.',
        'Na dúvida entre dois símbolos muito parecidos, observe se o preenchimento (cheio/vazio) e a orientação conferem.',
      ],
      oQueNaoMarcar: [
        'NÃO marque símbolos distratores — eles são parecidos mas diferentes do alvo.',
        'Não clique aleatoriamente para "ganhar tempo" — cada erro SUBTRAI da sua pontuação.',
        'Cuidado com símbolos espelhados (◆ vs ◇), rotacionados ou com preenchimento diferente.',
      ],
    }
  }

  // ─── FALLBACK ───
  return {
    titulo: 'Como Funciona este Teste',
    descricao: 'Este teste avalia habilidades importantes para o perfil policial. Leia as instruções com atenção e responda da forma mais consistente possível.',
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
