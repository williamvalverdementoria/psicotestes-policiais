export type PlanoTipo = 'gratuito' | 'assinatura' | 'avulso'
export type ProdutoTipo = 'assinatura' | 'avulso'
export type AssinaturaStatus = 'active' | 'canceled' | 'past_due'
export type ConstructoCategoria = 'personalidade' | 'atencao' | 'memoria' | 'raciocinio'

export interface Profile {
  id: string
  email: string
  nome: string | null
  telefone: string | null
  plano: PlanoTipo
  stripe_customer_id: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Concurso {
  id: string
  nome: string
  sigla: string
  banca: string | null
  estado: string | null
  edital_url: string | null
  ativo: boolean
  created_at: string
}

export interface Constructo {
  id: string
  nome: string
  descricao: string | null
  categoria: ConstructoCategoria
  created_at: string
}

export interface ConcursoConstructo {
  id: string
  concurso_id: string
  constructo_id: string
  peso: number
  prioridade: number
}

export interface Exercicio {
  id: string
  constructo_id: string
  tipo: string
  titulo: string
  instrucoes: string | null
  config_json: Record<string, unknown>
  tempo_limite: number
  dificuldade: number
  ativo: boolean
  created_at: string
}

export interface PlanoTreino {
  id: string
  user_id: string
  concurso_id: string
  nivel_inicial: number
  nivel_atual: number
  progresso: number
  created_at: string
  updated_at: string
}

export interface SessaoTreino {
  id: string
  user_id: string
  plano_treino_id: string | null
  exercicio_id: string
  score: number
  tempo_gasto: number | null
  acertos: number
  erros: number
  respostas_json: Record<string, unknown>
  completado: boolean
  started_at: string
  finished_at: string | null
}

export interface Diagnostico {
  id: string
  user_id: string
  concurso_id: string
  constructo_id: string
  score_inicial: number
  nivel_sugerido: number
  created_at: string
}

export interface Produto {
  id: string
  tipo: ProdutoTipo
  nome: string
  descricao: string | null
  preco_cents: number
  concurso_id: string | null
  duracao_meses: number | null
  stripe_price_id: string | null
  ativo: boolean
  created_at: string
}

export interface Assinatura {
  id: string
  user_id: string
  produto_id: string
  stripe_subscription_id: string | null
  status: AssinaturaStatus
  access_start: string
  access_end: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      concursos: { Row: Concurso; Insert: Partial<Concurso>; Update: Partial<Concurso> }
      constructos: { Row: Constructo; Insert: Partial<Constructo>; Update: Partial<Constructo> }
      concurso_constructos: { Row: ConcursoConstructo; Insert: Partial<ConcursoConstructo>; Update: Partial<ConcursoConstructo> }
      exercicios: { Row: Exercicio; Insert: Partial<Exercicio>; Update: Partial<Exercicio> }
      planos_treino: { Row: PlanoTreino; Insert: Partial<PlanoTreino>; Update: Partial<PlanoTreino> }
      sessoes_treino: { Row: SessaoTreino; Insert: Partial<SessaoTreino>; Update: Partial<SessaoTreino> }
      diagnosticos: { Row: Diagnostico; Insert: Partial<Diagnostico>; Update: Partial<Diagnostico> }
      produtos: { Row: Produto; Insert: Partial<Produto>; Update: Partial<Produto> }
      assinaturas: { Row: Assinatura; Insert: Partial<Assinatura>; Update: Partial<Assinatura> }
    }
  }
}
