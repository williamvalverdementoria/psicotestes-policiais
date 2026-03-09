import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Flame, ArrowRight, Sparkles } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { PlanoTreino, Concurso } from '@/types/database'

interface ConstructoScore {
  constructo: string
  score: number
}

export function Dashboard() {
  const { profile } = useAuth()
  const [plano, setPlano] = useState<PlanoTreino | null>(null)
  const [concurso, setConcurso] = useState<Concurso | null>(null)
  const [scores, setScores] = useState<ConstructoScore[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadDashboard()
  }, [profile])

  async function loadDashboard() {
    if (!profile) return

    const { data: planoData } = await supabase
      .from('planos_treino')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (planoData) {
      setPlano(planoData)
      const { data: concursoData } = await supabase
        .from('concursos')
        .select('*')
        .eq('id', planoData.concurso_id)
        .single()
      if (concursoData) setConcurso(concursoData)
    }

    const { data: sessoes } = await supabase
      .from('sessoes_treino')
      .select('score, exercicio_id, started_at')
      .eq('user_id', profile.id)
      .eq('completado', true)
      .order('started_at', { ascending: false })

    if (sessoes && sessoes.length > 0) {
      const exercicioIds = [...new Set(sessoes.map(s => s.exercicio_id))]
      const { data: exercicios } = await supabase
        .from('exercicios')
        .select('id, constructo_id')
        .in('id', exercicioIds)

      const { data: constructos } = await supabase
        .from('constructos')
        .select('id, nome')

      if (exercicios && constructos) {
        const exercicioToConstructo = new Map(exercicios.map(e => [e.id, e.constructo_id]))
        const constructoNames = new Map(constructos.map(c => [c.id, c.nome]))

        const latestScores = new Map<string, number>()
        for (const s of sessoes) {
          const cId = exercicioToConstructo.get(s.exercicio_id)
          if (cId && !latestScores.has(cId)) {
            latestScores.set(cId, s.score ?? 0)
          }
        }

        setScores(
          Array.from(latestScores.entries()).map(([cId, score]) => ({
            constructo: constructoNames.get(cId) || 'Desconhecido',
            score,
          }))
        )
      }

      const dates = [...new Set(sessoes.map(s => (s.started_at ?? '').split('T')[0]))].sort().reverse()
      let streakCount = 0
      const today = new Date().toISOString().split('T')[0]
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
        if (dates[i] === expected || (i === 0 && dates[0] === today)) {
          streakCount++
        } else break
      }
      setStreak(streakCount)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    )
  }

  const radarData = scores.length > 0
    ? scores
    : [
        { constructo: 'Personalidade', score: 0 },
        { constructo: 'Atenção Conc.', score: 0 },
        { constructo: 'Atenção Div.', score: 0 },
        { constructo: 'Memória', score: 0 },
        { constructo: 'Rac. Lógico', score: 0 },
      ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Olá, {profile?.nome || 'Candidato'} 👋
        </h1>
        {concurso && (
          <div className="flex items-center gap-3 mt-3">
            <span className="badge bg-accent/10 text-accent text-sm">
              {concurso.sigla}
            </span>
            <Link to="/onboarding" className="text-sm text-gray-400 hover:text-accent transition-colors duration-200">
              Trocar concurso →
            </Link>
          </div>
        )}
        {!plano && (
          <Link
            to="/onboarding"
            className="btn-primary mt-5"
          >
            <Sparkles className="w-4 h-4" />
            Começar diagnóstico
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treino de Hoje */}
        <div className="card-elevated p-7">
          <h2 className="text-lg font-extrabold text-primary mb-5">Treino de Hoje</h2>
          {plano ? (
            <div>
              <p className="text-sm text-gray-400 mb-1">Próximo exercício</p>
              <p className="text-base font-bold text-primary mb-0.5">Atenção Concentrada</p>
              <p className="text-sm text-gray-400 mb-6">Nível {plano.nivel_atual}</p>
              <Link
                to="/treino"
                className="btn-primary"
              >
                <Play className="w-5 h-5" />
                INICIAR TREINO
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-gray-400 text-sm">Complete o diagnóstico para gerar seu plano de treino.</p>
            </div>
          )}
        </div>

        {/* Progresso */}
        <div className="card-elevated p-7">
          <h2 className="text-lg font-extrabold text-primary mb-5">Seu Progresso</h2>
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2.5">
              <span className="text-gray-500 font-medium">Progresso geral</span>
              <span className="font-extrabold text-primary text-lg">{plano ? Math.round(plano.progresso ?? 0) : 0}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-700 ease-out"
                style={{ width: `${plano?.progresso ?? 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-orange-50/80">
            <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
            <div>
              <span className="font-bold text-primary text-sm">{streak} dias consecutivos</span>
              <p className="text-xs text-gray-400">Continue treinando!</p>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="card-elevated p-7 lg:col-span-2">
          <h2 className="text-lg font-extrabold text-primary mb-6">Radar dos Constructos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="constructo" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="url(#radarGradient)"
                  strokeWidth={2.5}
                />
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {scores.length === 0 && (
            <p className="text-center text-sm text-gray-400 -mt-4">
              Complete exercícios para ver seu radar de desempenho.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
