import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Lock, Play, Sparkles } from 'lucide-react'
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

    const { data: concurso } = await supabase.from('concursos').select('sigla').eq('id', planoData.concurso_id).single()
    if (concurso) setConcursoSigla(concurso.sigla)

    const { data: cc } = await supabase
      .from('concurso_constructos')
      .select('constructo_id')
      .eq('concurso_id', planoData.concurso_id)
      .order('prioridade')

    if (!cc) { setLoading(false); return }
    const ctIds = cc.map(c => c.constructo_id)

    const { data: exercicios } = await supabase.from('exercicios').select('*').in('constructo_id', ctIds).eq('ativo', true).order('dificuldade')
    const { data: constructos } = await supabase.from('constructos').select('*').in('id', ctIds)
    const { data: sessoes } = await supabase.from('sessoes_treino').select('exercicio_id, score').eq('user_id', profile.id).eq('completado', true)

    if (exercicios && constructos) {
      const ctMap = new Map(constructos.map(c => [c.id, c]))
      const completedMap = new Map(sessoes?.map(s => [s.exercicio_id, s.score ?? 0]) || [])

      const items: WeekItem[] = exercicios.map(ex => ({
        exercicio: ex,
        constructo: ctMap.get(ex.constructo_id)!,
        completed: completedMap.has(ex.id),
        score: completedMap.get(ex.id),
      }))

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
        <div className="spinner" />
      </div>
    )
  }

  if (!plano) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-extrabold text-primary mb-3">Nenhum plano criado</h2>
        <p className="text-sm text-gray-400 mb-6">Complete o diagnóstico para gerar seu plano personalizado.</p>
        <Link to="/onboarding" className="btn-primary">Criar plano</Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Seu Plano: {concursoSigla} 2026</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-700" style={{ width: `${plano.progresso ?? 0}%` }} />
          </div>
          <span className="text-sm font-bold text-primary">{Math.round(plano.progresso ?? 0)}%</span>
        </div>
      </div>

      <div className="space-y-5">
        {weeks.map((week, wi) => {
          const locked = isFree && wi > 0
          return (
            <div key={wi} className="card-elevated p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-extrabold text-primary">
                  Semana {wi + 1} — {wi === 0 ? 'Fundamentos' : wi === 1 ? 'Aprofundamento' : 'Avançado'}
                </h3>
                {locked && (
                  <span className="badge bg-gray-100 text-gray-500">
                    <Lock className="w-3 h-3" />
                    Pago
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {week.map(item => (
                  <div
                    key={item.exercicio.id}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl transition-colors ${locked ? 'opacity-40' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.completed ? (
                        <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-success" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-gray-200" />
                      )}
                      <p className="text-sm font-semibold text-primary">{item.constructo.nome} — Nível {item.exercicio.dificuldade}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.score !== undefined && (
                        <span className="text-sm font-bold text-accent">{item.score}pts</span>
                      )}
                      {!item.completed && !locked && (
                        <Link
                          to={`/exercicio/${item.exercicio.id}`}
                          className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200"
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
