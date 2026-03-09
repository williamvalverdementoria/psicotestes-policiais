import { useEffect, useState } from 'react'
import { Flame, TrendingUp, Clock } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface ConstructoProgress {
  nome: string
  latestScore: number
  sessions: { name: string; score: number }[]
  totalSessions: number
  avgTime: number
}

export function Progresso() {
  const { profile } = useAuth()
  const [data, setData] = useState<ConstructoProgress[]>([])
  const [streak, setStreak] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadProgress()
  }, [profile])

  async function loadProgress() {
    if (!profile) return

    const { data: sessoes } = await supabase
      .from('sessoes_treino')
      .select('*')
      .eq('user_id', profile.id)
      .eq('completado', true)
      .order('started_at')

    if (!sessoes) { setLoading(false); return }

    setTotalSessions(sessoes.length)
    setTotalTime(sessoes.reduce((acc, s) => acc + (s.tempo_gasto || 0), 0))

    const dates = [...new Set(sessoes.map(s => (s.started_at ?? '').split('T')[0]))].sort().reverse()
    let streakCount = 0
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      if (dates[i] === expected) streakCount++
      else break
    }
    setStreak(streakCount)

    const exIds = [...new Set(sessoes.map(s => s.exercicio_id))]
    const { data: exercicios } = await supabase.from('exercicios').select('id, constructo_id').in('id', exIds)
    const { data: constructos } = await supabase.from('constructos').select('*')

    if (!exercicios || !constructos) { setLoading(false); return }

    const exToCtMap = new Map(exercicios.map(e => [e.id, e.constructo_id]))
    const grouped = new Map<string, typeof sessoes>()
    for (const s of sessoes) {
      const ctId = exToCtMap.get(s.exercicio_id)
      if (!ctId) continue
      if (!grouped.has(ctId)) grouped.set(ctId, [])
      grouped.get(ctId)!.push(s)
    }

    const progressData: ConstructoProgress[] = constructos.map(ct => {
      const sessions = grouped.get(ct.id) || []
      return {
        nome: ct.nome,
        latestScore: sessions.length > 0 ? (sessions[sessions.length - 1].score ?? 0) : 0,
        sessions: sessions.map((s, i) => ({ name: `S${i + 1}`, score: s.score ?? 0 })),
        totalSessions: sessions.length,
        avgTime: sessions.length > 0
          ? sessions.reduce((a, s) => a + (s.tempo_gasto || 0), 0) / sessions.length
          : 0,
      }
    })

    setData(progressData)
    setLoading(false)
  }

  const isFree = profile?.plano === 'gratuito'
  const totalMinutes = Math.round(totalTime / 60000)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    )
  }

  const radarData = data.map(d => ({ constructo: d.nome.length > 12 ? d.nome.substring(0, 10) + '...' : d.nome, score: d.latestScore }))
  const selected = data[selectedTab]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-primary tracking-tight">Progresso</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, value: totalSessions, label: 'Sessões', color: 'text-accent' },
          { icon: Clock, value: `${totalMinutes}min`, label: 'Treinado', color: 'text-accent' },
          { icon: Flame, value: streak, label: 'Streak', color: streak > 0 ? 'text-orange-500' : 'text-gray-300' },
        ].map((stat, i) => (
          <div key={i} className="card-elevated p-5 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
            <p className="text-xl font-extrabold text-primary">{stat.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Radar */}
      <div className="card-elevated p-7 relative">
        <h2 className="text-lg font-extrabold text-primary mb-5">Radar dos Constructos</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="constructo" tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar dataKey="score" stroke="#3b82f6" fill="url(#radarGradientProgress)" strokeWidth={2.5} />
              <defs>
                <linearGradient id="radarGradientProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {isFree && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <p className="text-sm text-gray-500 font-semibold">Desbloqueie relatórios completos com o plano pago</p>
          </div>
        )}
      </div>

      {/* Per-constructo */}
      <div className="card-elevated overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {data.map((d, i) => (
            <button
              key={d.nome}
              onClick={() => setSelectedTab(i)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedTab === i ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d.nome}
            </button>
          ))}
        </div>

        {selected && (
          <div className="p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-3xl font-extrabold text-primary">{selected.latestScore}<span className="text-lg text-gray-400 font-medium">/100</span></p>
                <p className="text-sm text-gray-400 font-medium mt-0.5">{selected.totalSessions} sessões realizadas</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium">Tempo médio</p>
                <p className="font-bold text-primary text-lg">{Math.round(selected.avgTime / 1000)}s</p>
              </div>
            </div>

            {selected.sessions.length > 1 ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selected.sessions}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8 font-medium">Complete mais exercícios para ver a evolução.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
