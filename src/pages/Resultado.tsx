import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, Clock, Target, Minus, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { SessaoTreino } from '@/types/database'

export function Resultado() {
  const { sessaoId } = useParams<{ sessaoId: string }>()
  const { user } = useAuth()
  const [sessao, setSessao] = useState<SessaoTreino | null>(null)
  const [previousScore, setPreviousScore] = useState<number | null>(null)
  const [history, setHistory] = useState<{ name: string; score: number }[]>([])
  const [constructoNome, setConstructoNome] = useState('')

  useEffect(() => {
    if (!sessaoId || !user) return
    loadResult()
  }, [sessaoId, user])

  async function loadResult() {
    if (!sessaoId || !user) return

    const { data: sessaoData } = await supabase.from('sessoes_treino').select('*').eq('id', sessaoId).single()
    if (!sessaoData) return
    setSessao(sessaoData)

    const { data: exercicio } = await supabase.from('exercicios').select('constructo_id').eq('id', sessaoData.exercicio_id).single()

    if (exercicio) {
      const { data: constructo } = await supabase.from('constructos').select('nome').eq('id', exercicio.constructo_id).single()
      if (constructo) setConstructoNome(constructo.nome)

      const { data: allExs } = await supabase.from('exercicios').select('id').eq('constructo_id', exercicio.constructo_id)

      if (allExs) {
        const exIds = allExs.map(e => e.id)
        const { data: sessions } = await supabase
          .from('sessoes_treino')
          .select('score, started_at')
          .eq('user_id', user!.id)
          .eq('completado', true)
          .in('exercicio_id', exIds)
          .order('started_at')
          .limit(20)

        if (sessions && sessions.length > 0) {
          setHistory(sessions.map((s, i) => ({ name: `S${i + 1}`, score: s.score ?? 0 })))
          const prev = sessions.find(s => (s.started_at ?? '') < (sessaoData.started_at ?? ''))
          if (prev) setPreviousScore(prev.score ?? 0)
        }
      }
    }
  }

  if (!sessao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="spinner" />
      </div>
    )
  }

  const score = sessao.score ?? 0
  const scoreColor = score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-danger'
  const diff = previousScore !== null ? score - previousScore : null
  const tempoMinutos = sessao.tempo_gasto ? Math.floor(sessao.tempo_gasto / 60000) : 0
  const tempoSegundos = sessao.tempo_gasto ? Math.floor((sessao.tempo_gasto % 60000) / 1000) : 0
  const acertos = sessao.acertos ?? 0
  const errosVal = sessao.erros ?? 0
  const total = acertos + errosVal
  const precisao = total > 0 ? Math.round((acertos / total) * 100) : 0

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-1">Resultado</h1>
          <p className="text-gray-500 font-medium">{constructoNome}</p>
        </div>

        {/* Score */}
        <div className="card-elevated p-8 text-center mb-6">
          <div className={`text-7xl font-extrabold ${scoreColor} mb-2`}>{score}</div>
          <p className="text-gray-400 text-sm font-medium mb-4">de 100 pontos</p>

          {diff !== null && (
            <div className={`badge text-sm py-1.5 px-4 ${
              diff > 0 ? 'bg-success/10 text-success' :
              diff < 0 ? 'bg-danger/10 text-danger' :
              'bg-gray-100 text-gray-500'
            }`}>
              {diff > 0 ? <ArrowUp className="w-4 h-4" /> :
               diff < 0 ? <ArrowDown className="w-4 h-4" /> :
               <Minus className="w-4 h-4" />}
              {diff > 0 ? '+' : ''}{diff} vs anterior
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Clock, value: `${tempoMinutos}:${String(tempoSegundos).padStart(2, '0')}`, label: 'Tempo', color: 'text-gray-400' },
            { icon: Target, value: acertos, label: 'Acertos', color: 'text-success' },
            { icon: Target, value: `${precisao}%`, label: 'Precisão', color: 'text-accent' },
          ].map((stat, i) => (
            <div key={i} className="card-elevated p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <p className="text-lg font-extrabold text-primary">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {history.length > 1 && (
          <div className="card-elevated p-6 mb-6">
            <h3 className="text-sm font-extrabold text-primary mb-4">Evolução — {constructoNome}</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link to="/treino" className="btn-primary flex-1">
            Próximo exercício
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
