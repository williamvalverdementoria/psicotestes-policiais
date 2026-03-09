import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Lock, Clock, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Exercicio, Constructo } from '@/types/database'

interface ExercicioComConstructo extends Exercicio {
  constructo?: Constructo
}

export function Treino() {
  const { profile } = useAuth()
  const [exercicios, setExercicios] = useState<ExercicioComConstructo[]>([])
  const [dailyCount, setDailyCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadExercicios()
  }, [profile])

  async function loadExercicios() {
    if (!profile) return

    const { data: exs } = await supabase
      .from('exercicios')
      .select('*')
      .eq('ativo', true)
      .order('dificuldade')

    const { data: cts } = await supabase.from('constructos').select('*')

    if (exs && cts) {
      const ctMap = new Map(cts.map(c => [c.id, c]))
      setExercicios(exs.map(e => ({ ...e, constructo: ctMap.get(e.constructo_id) })))
    }

    // Count today's sessions
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('sessoes_treino')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('completado', true)
      .gte('started_at', today)

    setDailyCount(count || 0)
    setLoading(false)
  }

  const isFree = profile?.plano === 'gratuito'
  const limitReached = isFree && dailyCount >= 3

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Treino</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isFree ? `${dailyCount}/3 exercícios hoje` : 'Exercícios ilimitados'}
        </p>
      </div>

      {limitReached && (
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 mb-6 text-center">
          <Lock className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-bold text-primary mb-2">Limite diário atingido</h3>
          <p className="text-sm text-gray-500 mb-4">Você completou 3 exercícios hoje. Desbloqueie treino ilimitado!</p>
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
          >
            Ver planos
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exercicios.map(ex => {
          const locked = isFree && ex.dificuldade > 2
          return (
            <div
              key={ex.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all ${
                locked ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  ex.constructo?.categoria === 'atencao' ? 'bg-blue-100 text-blue-700' :
                  ex.constructo?.categoria === 'memoria' ? 'bg-amber-100 text-amber-700' :
                  ex.constructo?.categoria === 'raciocinio' ? 'bg-rose-100 text-rose-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {ex.constructo?.nome}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < ex.dificuldade ? 'bg-accent' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-primary mb-1">{ex.titulo}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(ex.tempo_limite / 60)}min
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  Nível {ex.dificuldade}
                </span>
              </div>

              {locked ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4" />
                  Plano pago
                </div>
              ) : limitReached ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4" />
                  Limite atingido
                </div>
              ) : (
                <Link
                  to={`/exercicio/${ex.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent-dark transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Iniciar
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
