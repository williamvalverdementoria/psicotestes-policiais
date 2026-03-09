import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, Clock, Target, Minus } from 'lucide-react'
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

    const { data: sessaoData } = await supabase
      .from('sessoes_treino')
      .select('*')
      .eq('id', sessaoId)
      .single()

    if (!sessaoData) return
    setSessao(sessaoData)

    // Get constructo name
    const { data: exercicio } = await supabase
      .from('exercicios')
      .select('constructo_id')
      .eq('id', sessaoData.exercicio_id)
      .single()

    if (exercicio) {
      const { data: constructo } = await supabase
        .from('constructos')
        .select('nome')
        .eq('id', exercicio.constructo_id)
        .single()

      if (constructo) setConstructoNome(constructo.nome)

      // Get history
      const { data: allExs } = await supabase
        .from('exercicios')
        .select('id')
        .eq('constructo_id', exercicio.constructo_id)

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
          setHistory(sessions.map((s, i) => ({
            name: `S${i + 1}`,
            score: s.score,
          })))

          // Previous score
          const prev = sessions.find(s => s.started_at < sessaoData.started_at)
          if (prev) setPreviousScore(prev.score)
        }
      }
    }
  }

  if (!sessao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const scoreColor = sessao.score >= 70 ? 'text-success' : sessao.score >= 40 ? 'text-warning' : 'text-danger'
  const diff = previousScore !== null ? sessao.score - previousScore : null
  const tempoMinutos = sessao.tempo_gasto ? Math.floor(sessao.tempo_gasto / 60000) : 0
  const tempoSegundos = sessao.tempo_gasto ? Math.floor((sessao.tempo_gasto % 60000) / 1000) : 0
  const total = sessao.acertos + sessao.erros
  const precisao = total > 0 ? Math.round((sessao.acertos / total) * 100) : 0

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-1">Resultado</h1>
          <p className="text-gray-500">{constructoNome}</p>
        </div>

        {/* Score */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-6">
          <div className={`text-6xl font-extrabold ${scoreColor} mb-2`}>{sessao.score}</div>
          <p className="text-gray-400 text-sm mb-4">de 100 pontos</p>

          {diff !== null && (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
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
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">{tempoMinutos}:{String(tempoSegundos).padStart(2, '0')}</p>
            <p className="text-xs text-gray-400">Tempo</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Target className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-success">{sessao.acertos}</p>
            <p className="text-xs text-gray-400">Acertos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Target className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">{precisao}%</p>
            <p className="text-xs text-gray-400">Precisão</p>
          </div>
        </div>

        {/* Chart */}
        {history.length > 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-sm font-bold text-primary mb-4">Evolução — {constructoNome}</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            to="/treino"
            className="flex-1 text-center px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
          >
            Próximo exercício
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 text-gray-500 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
