import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Lock, Play } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { PlanoTreino, Exercicio, Constructo } from '@/types/database'

interface WeekItem {
  exercicio: Exercicio
  constructo: Constructo
  completed: boolean
  score?: number
}

export function Plano() {
  const { profile } = useAuth()
  const [plano, setPlano] = useState<PlanoTreino | null>(null)
  const [weeks, setWeeks] = useState<WeekItem[][]>([])
  const [concursoSigla, setConcursoSigla] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadPlano()
  }, [profile])

  async function loadPlano() {
    if (!profile) return

    const { data: planoData } = await supabase
      .from('planos_treino')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!planoData) { setLoading(false); return }
    setPlano(planoData)

    const { data: concurso } = await supabase
      .from('concursos')
      .select('sigla')
      .eq('id', planoData.concurso_id)
      .single()
    if (concurso) setConcursoSigla(concurso.sigla)

    // Load exercises
    const { data: cc } = await supabase
      .from('concurso_constructos')
      .select('constructo_id')
      .eq('concurso_id', planoData.concurso_id)
      .order('prioridade')

    if (!cc) { setLoading(false); return }
    const ctIds = cc.map(c => c.constructo_id)

    const { data: exercicios } = await supabase
      .from('exercicios')
      .select('*')
      .in('constructo_id', ctIds)
      .eq('ativo', true)
      .order('dificuldade')

    const { data: constructos } = await supabase
      .from('constructos')
      .select('*')
      .in('id', ctIds)

    const { data: sessoes } = await supabase
      .from('sessoes_treino')
      .select('exercicio_id, score')
      .eq('user_id', profile.id)
      .eq('completado', true)

    if (exercicios && constructos) {
      const ctMap = new Map(constructos.map(c => [c.id, c]))
      const completedMap = new Map(sessoes?.map(s => [s.exercicio_id, s.score ?? 0]) || [])

      const items: WeekItem[] = exercicios.map(ex => ({
        exercicio: ex,
        constructo: ctMap.get(ex.constructo_id)!,
        completed: completedMap.has(ex.id),
        score: completedMap.get(ex.id),
      }))

      // Split into weeks of ~5 items
      const weekSize = 5
      const weekArr: WeekItem[][] = []
      for (let i = 0; i < items.length; i += weekSize) {
        weekArr.push(items.slice(i, i + weekSize))
      }
      setWeeks(weekArr)
    }

    setLoading(false)
  }

  const isFree = profile?.plano === 'gratuito'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!plano) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-primary mb-4">Nenhum plano criado</h2>
        <Link to="/onboarding" className="px-6 py-3 bg-accent text-white font-bold rounded-xl">
          Criar plano
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Seu Plano: {concursoSigla} 2026</h1>
        <p className="text-gray-500 text-sm mt-1">Progresso: {Math.round(plano.progresso ?? 0)}%</p>
      </div>

      <div className="space-y-6">
        {weeks.map((week, wi) => {
          const locked = isFree && wi > 0
          return (
            <div key={wi} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary">
                  Semana {wi + 1} — {wi === 0 ? 'Fundamentos' : wi === 1 ? 'Aprofundamento' : 'Avançado'}
                </h3>
                {locked && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Lock className="w-3.5 h-3.5" />
                    Pago
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {week.map(item => (
                  <div
                    key={item.exercicio.id}
                    className={`flex items-center justify-between py-2 ${locked ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.completed ? (
                        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-success" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-primary">{item.constructo.nome} — Nível {item.exercicio.dificuldade}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.score !== undefined && (
                        <span className="text-sm font-bold text-primary">{item.score}pts</span>
                      )}
                      {!item.completed && !locked && (
                        <Link
                          to={`/exercicio/${item.exercicio.id}`}
                          className="p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
