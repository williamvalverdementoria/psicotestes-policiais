import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, Check } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Concurso, Constructo } from '@/types/database'

type Step = 'select-concurso' | 'intro' | 'diagnostic' | 'results'

export function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('select-concurso')
  const [concursos, setConcursos] = useState<Concurso[]>([])
  const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(null)
  const [constructos, setConstructos] = useState<Constructo[]>([])
  const [currentConstructoIndex, setCurrentConstructoIndex] = useState(0)
  const [scores, setScores] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('concursos').select('*').eq('ativo', true).then(({ data }) => {
      if (data) setConcursos(data)
    })
  }, [])

  async function selectConcurso(concurso: Concurso) {
    setSelectedConcurso(concurso)
    // Load constructos for this concurso
    const { data: cc } = await supabase
      .from('concurso_constructos')
      .select('constructo_id')
      .eq('concurso_id', concurso.id)
      .order('prioridade')

    if (cc) {
      const ids = cc.map(c => c.constructo_id)
      const { data: cts } = await supabase
        .from('constructos')
        .select('*')
        .in('id', ids)

      if (cts) {
        // Sort by priority
        const sorted = ids.map(id => cts.find(c => c.id === id)).filter(Boolean) as Constructo[]
        setConstructos(sorted)
      }
    }
    setStep('intro')
  }

  async function submitDiagnosticScore(score: number) {
    if (!user || !selectedConcurso) return

    const constructo = constructos[currentConstructoIndex]
    const newScores = new Map(scores)
    newScores.set(constructo.id, score)
    setScores(newScores)

    // Save diagnostic
    await supabase.from('diagnosticos').insert({
      user_id: user.id,
      concurso_id: selectedConcurso.id,
      constructo_id: constructo.id,
      score_inicial: score,
      nivel_sugerido: score >= 70 ? 3 : score >= 40 ? 2 : 1,
    })

    if (currentConstructoIndex < constructos.length - 1) {
      setCurrentConstructoIndex(currentConstructoIndex + 1)
    } else {
      // All done — create plano
      setLoading(true)
      const avgScore = Array.from(newScores.values()).reduce((a, b) => a + b, 0) / newScores.size
      const nivel = avgScore >= 70 ? 3 : avgScore >= 40 ? 2 : 1

      await supabase.from('planos_treino').insert({
        user_id: user.id,
        concurso_id: selectedConcurso.id,
        nivel_inicial: nivel,
        nivel_atual: nivel,
        progresso: 0,
      })

      setLoading(false)
      setStep('results')
    }
  }

  // Simple diagnostic exercise: rate 1-100 simulation
  function DiagnosticExercise() {
    const constructo = constructos[currentConstructoIndex]
    const [answer, setAnswer] = useState(50)

    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-4">
          <span className="text-sm text-gray-400">
            Constructo {currentConstructoIndex + 1} de {constructos.length}
          </span>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${((currentConstructoIndex + 1) / constructos.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-primary mb-2">{constructo.nome}</h2>
        <p className="text-sm text-gray-500 mb-8">{constructo.descricao}</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-6">
            Como você avalia sua habilidade neste constructo? (Exercício simplificado para diagnóstico)
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={answer}
            onChange={e => setAnswer(Number(e.target.value))}
            className="w-full mb-4 accent-accent"
          />
          <p className="text-2xl font-bold text-primary mb-6">{answer}/100</p>

          <button
            onClick={() => submitDiagnosticScore(answer)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
          >
            {currentConstructoIndex < constructos.length - 1 ? 'Próximo' : 'Finalizar'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  function Results() {
    const radarData = constructos.map(c => ({
      constructo: c.nome.length > 15 ? c.nome.substring(0, 12) + '...' : c.nome,
      score: scores.get(c.id) || 0,
    }))

    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Diagnóstico completo!</h2>
        <p className="text-gray-500 mb-8">Seu plano personalizado foi criado.</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
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
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
        >
          Ver meu plano
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {step === 'select-concurso' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">Para qual concurso você está se preparando?</h1>
            <p className="text-gray-500 mb-8">Selecione o concurso para personalizar seu plano de treino.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concursos.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectConcurso(c)}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-accent shadow-sm hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-lg font-bold text-primary">{c.sigla}</span>
                  </div>
                  <p className="text-sm text-gray-500">{c.nome}</p>
                  {c.banca && <p className="text-xs text-gray-400 mt-1">Banca: {c.banca}</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'intro' && selectedConcurso && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Vamos descobrir seu nível atual</h1>
            <p className="text-gray-500 mb-2">
              Concurso selecionado: <strong>{selectedConcurso.sigla}</strong>
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Faremos um exercício rápido para cada constructo avaliado. Leva cerca de 5 minutos.
            </p>
            <button
              onClick={() => setStep('diagnostic')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
            >
              Iniciar Diagnóstico
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'diagnostic' && <DiagnosticExercise />}

        {step === 'results' && !loading && <Results />}

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Criando seu plano personalizado...</p>
          </div>
        )}
      </div>
    </div>
  )
}
