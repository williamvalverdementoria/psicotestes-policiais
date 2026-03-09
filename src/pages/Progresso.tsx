import { useEffect, useState } from 'react'
import { Flame, TrendingUp, Clock, Target } from 'lucide-react'
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

    // Streak
    const dates = [...new Set(sessoes.map(s => s.started_at.split('T')[0]))].sort().reverse()
    let streakCount = 0
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      if (dates[i] === expected) streakCount++
      else break
    }
    setStreak(streakCount)

    // Get exercises and constructos
    const exIds = [...new Set(sessoes.map(s => s.exercicio_id))]
    const { data: exercicios } = await supabase
      .from('exercicios')
      .select('id, constructo_id')
      .in('id', exIds)

    const { data: constructos } = await supabase.from('constructos').select('*')

    if (!exercicios || !constructos) { setLoading(false); return }

    const exToCtMap = new Map(exercicios.map(e => [e.id, e.constructo_id]))
    const ctMap = new Map(constructos.map(c => [c.id, c]))

    // Group sessions by constructo
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
        latestScore: sessions.length > 0 ? sessions[sessions.length - 1].score : 0,
        sessions: sessions.map((s, i) => ({ name: `S${i + 1}`, score: s.score })),
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
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const radarData = data.map(d => ({ constructo: d.nome.length > 12 ? d.nome.substring(0, 10) + '...' : d.nome, score: d.latestScore }))
  const selected = data[selectedTab]

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Progresso</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-bold text-primary">{totalSessions}</p>
          <p className="text-xs text-gray-400">Sessões</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-bold text-primary">{totalMinutes}min</p>
          <p className="text-xs text-gray-400">Treinado</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Flame className={`w-5 h-5 mx-auto mb-1 ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
          <p className="text-lg font-bold text-primary">{streak}</p>
          <p className="text-xs text-gray-400">Streak</p>
        </div>
      </div>

      {/* Radar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 relative">
        <h2 className="text-lg font-bold text-primary mb-4">Radar dos Constructos</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="constructo" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {isFree && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <p className="text-sm text-gray-500 font-medium">Desbloqueie relatórios completos com o plano pago</p>
          </div>
        )}
      </div>

      {/* Per-constructo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {data.map((d, i) => (
            <button
              key={d.nome}
              onClick={() => setSelectedTab(i)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTab === i ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {d.nome}
            </button>
          ))}
        </div>

        {selected && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-primary">{selected.latestScore}/100</p>
                <p className="text-sm text-gray-400">{selected.totalSessions} sessões realizadas</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Tempo médio</p>
                <p className="font-semibold text-primary">{Math.round(selected.avgTime / 1000)}s</p>
              </div>
            </div>

            {selected.sessions.length > 1 ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selected.sessions}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Complete mais exercícios para ver a evolução.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
