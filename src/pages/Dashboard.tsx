import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Flame, TrendingUp } from 'lucide-react'
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

    // Load plano_treino
    const { data: planoData } = await supabase
      .from('planos_treino')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (planoData) {
      setPlano(planoData)
      // Load concurso
      const { data: concursoData } = await supabase
        .from('concursos')
        .select('*')
        .eq('id', planoData.concurso_id)
        .single()
      if (concursoData) setConcurso(concursoData)
    }

    // Load latest scores per constructo
    const { data: sessoes } = await supabase
      .from('sessoes_treino')
      .select('score, exercicio_id, started_at')
      .eq('user_id', profile.id)
      .eq('completado', true)
      .order('started_at', { ascending: false })

    if (sessoes && sessoes.length > 0) {
      // Get exercise -> constructo mapping
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
            latestScores.set(cId, s.score)
          }
        }

        setScores(
          Array.from(latestScores.entries()).map(([cId, score]) => ({
            constructo: constructoNames.get(cId) || 'Desconhecido',
            score,
          }))
        )
      }

      // Calculate streak
      const dates = [...new Set(sessoes.map(s => s.started_at.split('T')[0]))].sort().reverse()
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
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">
          Olá, {profile?.nome || 'Candidato'}!
        </h1>
        {concurso && (
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold">
              {concurso.sigla}
            </span>
            <Link to="/onboarding" className="text-sm text-gray-400 hover:text-accent transition-colors">
              [Trocar]
            </Link>
          </div>
        )}
        {!plano && (
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors"
          >
            Começar diagnóstico
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treino de Hoje */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4">Treino de Hoje</h2>
          {plano ? (
            <div>
              <p className="text-sm text-gray-500 mb-1">Próximo exercício</p>
              <p className="text-base font-semibold text-primary mb-1">Atenção Concentrada</p>
              <p className="text-sm text-gray-400 mb-6">Nível {plano.nivel_atual}</p>
              <Link
                to="/treino"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
              >
                <Play className="w-5 h-5" />
                INICIAR
              </Link>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Complete o diagnóstico para gerar seu plano de treino.</p>
          )}
        </div>

        {/* Progresso */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4">Seu Progresso</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Progresso geral</span>
              <span className="font-bold text-primary">{plano ? Math.round(plano.progresso) : 0}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${plano?.progresso ?? 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
            <span className="font-semibold text-primary">{streak} dias consecutivos</span>
          </div>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-primary mb-4">Radar dos Constructos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="constructo" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
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
