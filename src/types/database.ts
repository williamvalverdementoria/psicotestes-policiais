export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assinaturas: {
        Row: {
          access_end: string | null
          access_start: string | null
          created_at: string | null
          id: string
          produto_id: string
          status: Database["public"]["Enums"]["assinatura_status"] | null
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          access_end?: string | null
          access_start?: string | null
          created_at?: string | null
          id?: string
          produto_id: string
          status?: Database["public"]["Enums"]["assinatura_status"] | null
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          access_end?: string | null
          access_start?: string | null
          created_at?: string | null
          id?: string
          produto_id?: string
          status?: Database["public"]["Enums"]["assinatura_status"] | null
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      concurso_constructos: {
        Row: {
          concurso_id: string
          constructo_id: string
          id: string
          peso: number | null
          prioridade: number | null
        }
        Insert: {
          concurso_id: string
          constructo_id: string
          id?: string
          peso?: number | null
          prioridade?: number | null
        }
        Update: {
          concurso_id?: string
          constructo_id?: string
          id?: string
          peso?: number | null
          prioridade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "concurso_constructos_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concurso_constructos_constructo_id_fkey"
            columns: ["constructo_id"]
            isOneToOne: false
            referencedRelation: "constructos"
            referencedColumns: ["id"]
          },
        ]
      }
      concursos: {
        Row: {
          ativo: boolean | null
          banca: string | null
          created_at: string | null
          edital_url: string | null
          estado: string | null
          id: string
          nome: string
          sigla: string
        }
        Insert: {
          ativo?: boolean | null
          banca?: string | null
          created_at?: string | null
          edital_url?: string | null
          estado?: string | null
          id?: string
          nome: string
          sigla: string
        }
        Update: {
          ativo?: boolean | null
          banca?: string | null
          created_at?: string | null
          edital_url?: string | null
          estado?: string | null
          id?: string
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
      constructos: {
        Row: {
          categoria: Database["public"]["Enums"]["constructo_categoria"]
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          categoria: Database["public"]["Enums"]["constructo_categoria"]
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          categoria?: Database["public"]["Enums"]["constructo_categoria"]
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      diagnosticos: {
        Row: {
          concurso_id: string
          constructo_id: string
          created_at: string | null
          id: string
          nivel_sugerido: number | null
          score_inicial: number | null
          user_id: string
        }
        Insert: {
          concurso_id: string
          constructo_id: string
          created_at?: string | null
          id?: string
          nivel_sugerido?: number | null
          score_inicial?: number | null
          user_id: string
        }
        Update: {
          concurso_id?: string
          constructo_id?: string
          created_at?: string | null
          id?: string
          nivel_sugerido?: number | null
          score_inicial?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticos_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticos_constructo_id_fkey"
            columns: ["constructo_id"]
            isOneToOne: false
            referencedRelation: "constructos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios: {
        Row: {
          ativo: boolean | null
          config_json: Json
          constructo_id: string
          created_at: string | null
          dificuldade: number
          id: string
          instrucoes: string | null
          tempo_limite: number
          tipo: string
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          config_json?: Json
          constructo_id: string
          created_at?: string | null
          dificuldade?: number
          id?: string
          instrucoes?: string | null
          tempo_limite?: number
          tipo: string
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          config_json?: Json
          constructo_id?: string
          created_at?: string | null
          dificuldade?: number
          id?: string
          instrucoes?: string | null
          tempo_limite?: number
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_constructo_id_fkey"
            columns: ["constructo_id"]
            isOneToOne: false
            referencedRelation: "constructos"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_treino: {
        Row: {
          concurso_id: string
          created_at: string | null
          id: string
          nivel_atual: number | null
          nivel_inicial: number | null
          progresso: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          concurso_id: string
          created_at?: string | null
          id?: string
          nivel_atual?: number | null
          nivel_inicial?: number | null
          progresso?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          concurso_id?: string
          created_at?: string | null
          id?: string
          nivel_atual?: number | null
          nivel_inicial?: number | null
          progresso?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_treino_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_treino_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          concurso_id: string | null
          created_at: string | null
          descricao: string | null
          duracao_meses: number | null
          id: string
          nome: string
          preco_cents: number
          stripe_price_id: string | null
          tipo: Database["public"]["Enums"]["produto_tipo"]
        }
        Insert: {
          ativo?: boolean | null
          concurso_id?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_meses?: number | null
          id?: string
          nome: string
          preco_cents: number
          stripe_price_id?: string | null
          tipo: Database["public"]["Enums"]["produto_tipo"]
        }
        Update: {
          ativo?: boolean | null
          concurso_id?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_meses?: number | null
          id?: string
          nome?: string
          preco_cents?: number
          stripe_price_id?: string | null
          tipo?: Database["public"]["Enums"]["produto_tipo"]
        }
        Relationships: [
          {
            foreignKeyName: "produtos_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string | null
          plano: Database["public"]["Enums"]["plano_tipo"] | null
          stripe_customer_id: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id: string
          nome?: string | null
          plano?: Database["public"]["Enums"]["plano_tipo"] | null
          stripe_customer_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string | null
          plano?: Database["public"]["Enums"]["plano_tipo"] | null
          stripe_customer_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessoes_treino: {
        Row: {
          acertos: number | null
          completado: boolean | null
          erros: number | null
          exercicio_id: string
          finished_at: string | null
          id: string
          plano_treino_id: string | null
          respostas_json: Json | null
          score: number | null
          started_at: string | null
          tempo_gasto: number | null
          user_id: string
        }
        Insert: {
          acertos?: number | null
          completado?: boolean | null
          erros?: number | null
          exercicio_id: string
          finished_at?: string | null
          id?: string
          plano_treino_id?: string | null
          respostas_json?: Json | null
          score?: number | null
          started_at?: string | null
          tempo_gasto?: number | null
          user_id: string
        }
        Update: {
          acertos?: number | null
          completado?: boolean | null
          erros?: number | null
          exercicio_id?: string
          finished_at?: string | null
          id?: string
          plano_treino_id?: string | null
          respostas_json?: Json | null
          score?: number | null
          started_at?: string | null
          tempo_gasto?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_treino_exercicio_id_fkey"
            columns: ["exercicio_id"]
            isOneToOne: false
            referencedRelation: "exercicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessoes_treino_plano_treino_id_fkey"
            columns: ["plano_treino_id"]
            isOneToOne: false
            referencedRelation: "planos_treino"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessoes_treino_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_weekly_stats: { Args: never; Returns: Json }
      daily_session_count: { Args: { user_uuid: string }; Returns: number }
      has_paid_access: {
        Args: { concurso_uuid: string; user_uuid: string }
        Returns: boolean
      }
      weekly_user_stats: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      assinatura_status: "active" | "canceled" | "past_due"
      constructo_categoria:
        | "personalidade"
        | "atencao"
        | "memoria"
        | "raciocinio"
      plano_tipo: "gratuito" | "assinatura" | "avulso"
      produto_tipo: "assinatura" | "avulso"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Concurso = Database["public"]["Tables"]["concursos"]["Row"]
export type Constructo = Database["public"]["Tables"]["constructos"]["Row"]
export type ConcursoConstructo = Database["public"]["Tables"]["concurso_constructos"]["Row"]
export type Exercicio = Database["public"]["Tables"]["exercicios"]["Row"]
export type PlanoTreino = Database["public"]["Tables"]["planos_treino"]["Row"]
export type SessaoTreino = Database["public"]["Tables"]["sessoes_treino"]["Row"]
export type Diagnostico = Database["public"]["Tables"]["diagnosticos"]["Row"]
export type Produto = Database["public"]["Tables"]["produtos"]["Row"]
export type Assinatura = Database["public"]["Tables"]["assinaturas"]["Row"]
export type PlanoTipo = Database["public"]["Enums"]["plano_tipo"]
export type ProdutoTipo = Database["public"]["Enums"]["produto_tipo"]
export type AssinaturaStatus = Database["public"]["Enums"]["assinatura_status"]
export type ConstructoCategoria = Database["public"]["Enums"]["constructo_categoria"]
