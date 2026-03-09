import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Lock, Clock, Target, Sparkles } from 'lucide-react'
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
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Treino</h1>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">
          {isFree ? `${dailyCount}/3 exercícios hoje` : '✨ Exercícios ilimitados'}
        </p>
      </div>

      {limitReached && (
        <div className="card-elevated p-8 text-center bg-gradient-to-br from-accent/5 to-transparent">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h3 className="font-extrabold text-primary text-lg mb-2">Limite diário atingido</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">Você completou 3 exercícios hoje. Desbloqueie treino ilimitado!</p>
          <Link to="/perfil" className="btn-primary">
            <Sparkles className="w-4 h-4" />
            Ver planos
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {exercicios.map(ex => {
          const locked = isFree && ex.dificuldade > 2
          return (
            <div
              key={ex.id}
              className={`card-elevated p-6 ${
                locked ? 'opacity-50 hover:shadow-sm' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`badge ${
                  ex.constructo?.categoria === 'atencao' ? 'bg-blue-50 text-blue-600' :
                  ex.constructo?.categoria === 'memoria' ? 'bg-amber-50 text-amber-600' :
                  ex.constructo?.categoria === 'raciocinio' ? 'bg-rose-50 text-rose-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {ex.constructo?.nome}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i < ex.dificuldade ? 'bg-accent' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-primary mb-2">{ex.titulo}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(ex.tempo_limite / 60)}min
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Nível {ex.dificuldade}
                </span>
              </div>

              {locked ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Lock className="w-4 h-4" />
                  Plano pago
                </div>
              ) : limitReached ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Lock className="w-4 h-4" />
                  Limite atingido
                </div>
              ) : (
                <Link
                  to={`/exercicio/${ex.id}`}
                  className="btn-primary !text-sm !px-5 !py-2.5"
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
