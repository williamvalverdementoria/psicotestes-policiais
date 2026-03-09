import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pause, Play, X, ChevronRight, Check, Clock, FileText, ChevronDown, Brain, Heart, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Exercicio } from '@/types/database'

interface Questao {
  id: string
  numero: number
  enunciado: string
  opcoes: string[]
  resposta_correta: number
  explicacao: string | null
}

interface Props {
  exercicio: Exercicio
}

function getTestCategory(config: Record<string, unknown>): 'personalidade' | 'raciocinio' | 'memoria' {
  if (config.tipo_personalidade) return 'personalidade'
  if (config.categoria_teste === 'memoria_visual' || config.categoria_teste === 'memoria_reconhecimento') return 'memoria'
  return 'raciocinio'
}

function getCategoryIcon(category: 'personalidade' | 'raciocinio' | 'memoria') {
  switch (category) {
    case 'personalidade': return Heart
    case 'memoria': return Brain
    case 'raciocinio': return Brain
  }
}

function getCategoryColor(category: 'personalidade' | 'raciocinio' | 'memoria') {
  switch (category) {
    case 'personalidade': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
    case 'memoria': return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    case 'raciocinio': return 'text-rose-400 bg-rose-500/20 border-rose-500/30'
  }
}

function getCategoryLabel(category: 'personalidade' | 'raciocinio' | 'memoria') {
  switch (category) {
    case 'personalidade': return 'Personalidade'
    case 'memoria': return 'Memória'
    case 'raciocinio': return 'Raciocínio'
  }
}

function isLikertTest(opcoes: string[]): boolean {
  if (opcoes.length >= 5 && opcoes.length <= 7) {
    const first = opcoes[0]
    return first.startsWith('1 ') || first.startsWith('0 ')
  }
  return false
}

export function QuizExercicio({ exercicio }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [timeLeft, setTimeLeft] = useState(exercicio.tempo_limite)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showExplicacao, setShowExplicacao] = useState(false)
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const config = (exercicio.config_json || {}) as Record<string, unknown>
  const category = getTestCategory(config)
  const isLikert = questoes.length > 0 && isLikertTest(questoes[0].opcoes)

  useEffect(() => {
    supabase
      .from('questoes' as any)
      .select('*')
      .eq('exercicio_id', exercicio.id)
      .order('numero')
      .then(({ data }: { data: any[] | null }) => {
        if (data) {
          setQuestoes(data.map((q: any) => ({
            ...q,
            opcoes: typeof q.opcoes === 'string' ? JSON.parse(q.opcoes) : q.opcoes,
          })))
        }
      })
  }, [exercicio.id])

  const finishExercise = useCallback(async (finalAcertos?: number, finalErros?: number) => {
    if (finished || !user) return
    setFinished(true)
    clearInterval(timerRef.current)

    const a = finalAcertos ?? acertos
    const e = finalErros ?? erros
    const total = a + e
    const score = total > 0 ? Math.round((a / total) * 100) : 0
    const tempoGasto = Date.now() - startTimeRef.current

    const { data: sessao } = await supabase.from('sessoes_treino').insert({
      user_id: user.id,
      exercicio_id: exercicio.id,
      score,
      tempo_gasto: tempoGasto,
      acertos: a,
      erros: e,
      completado: true,
      finished_at: new Date().toISOString(),
    }).select().single()

    if (sessao) {
      navigate(`/resultado/${sessao.id}`)
    }
  }, [finished, user, exercicio.id, acertos, erros, navigate])

  useEffect(() => {
    if (!started || paused || finished) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishExercise()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [started, paused, finished, finishExercise])

  function startExercise() {
    setStarted(true)
    startTimeRef.current = Date.now()
  }

  function handleSelectOption(index: number) {
    if (answered || paused) return
    setSelectedOption(index)
  }

  function handleConfirm() {
    if (selectedOption === null || answered) return
    setAnswered(true)

    const questao = questoes[currentIndex]
    if (selectedOption === questao.resposta_correta) {
      setAcertos(prev => prev + 1)
    } else {
      setErros(prev => prev + 1)
    }
    setShowExplicacao(true)
  }

  function handleNext() {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setAnswered(false)
      setShowExplicacao(false)
    } else {
      const questao = questoes[currentIndex]
      const finalAcertos = acertos + (answered && selectedOption === questao.resposta_correta ? 0 : 0)
      finishExercise(finalAcertos, erros)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerWarning = timeLeft < 60

  if (questoes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Carregando questões...</p>
        </div>
      </div>
    )
  }

  // ─── START SCREEN ───
  if (!started) {
    const CategoryIcon = getCategoryIcon(category)
    const categoryColor = getCategoryColor(category)
    const instrucoes = exercicio.instrucoes || ''
    const paragraphs = instrucoes.split('\n').filter(p => p.trim())

    return (
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="bg-primary-dark border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryColor}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {getCategoryLabel(category)}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Test title card */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{exercicio.titulo}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {questoes.length} questões
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {Math.floor(exercicio.tempo_limite / 60)} minutos
              </span>
            </div>
          </div>

          {/* Instructions card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Instruções do Teste</h2>
            </div>
            <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
              <div className="space-y-3">
                {paragraphs.map((p, i) => {
                  const trimmed = p.trim()
                  // Headers (all caps or ending with :)
                  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.startsWith('•') && !trimmed.startsWith('—')) {
                    return <p key={i} className="text-accent font-bold text-sm mt-4 first:mt-0">{trimmed}</p>
                  }
                  // Bullet points
                  if (trimmed.startsWith('•') || trimmed.startsWith('—') || trimmed.startsWith('-')) {
                    return <p key={i} className="text-gray-300 text-sm pl-4 leading-relaxed">{trimmed}</p>
                  }
                  return <p key={i} className="text-gray-300 text-sm leading-relaxed">{trimmed}</p>
                })}
              </div>
            </div>
            <div className="px-6 py-3 bg-white/5 flex items-center justify-center">
              <ChevronDown className="w-4 h-4 text-gray-500 animate-bounce" />
            </div>
          </div>

          {/* Likert scale preview for personality tests */}
          {isLikert && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-8">
              <p className="text-purple-300 text-xs font-bold mb-2 uppercase tracking-wider">Escala de Resposta</p>
              <div className="flex items-center justify-between gap-1">
                {questoes[0].opcoes.map((opcao, i) => (
                  <div key={i} className="text-center flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                      {i + 1}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-tight hidden sm:block">
                      {opcao.replace(/^\d+\s*-?\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={startExercise}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-accent text-white font-bold text-lg rounded-2xl hover:bg-accent-dark transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
          >
            <Play className="w-6 h-6" />
            Iniciar Teste
          </button>
        </div>
      </div>
    )
  }

  const questao = questoes[currentIndex]
  const progressPercent = ((currentIndex + (answered ? 1 : 0)) / questoes.length) * 100

  // ─── EXERCISE SCREEN ───
  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-dark border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-lg ${
            timerWarning ? 'bg-danger/20 text-danger animate-pulse' : 'bg-white/10 text-white'
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">{exercicio.titulo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg">
            {currentIndex + 1}<span className="text-gray-500">/{questoes.length}</span>
          </span>
          <button onClick={() => setPaused(!paused)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
            {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button onClick={() => finishExercise()} className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex items-start justify-center p-4 pt-6 sm:pt-8 relative overflow-y-auto">
        {paused && (
          <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Pause className="w-10 h-10 text-accent" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">Teste Pausado</p>
              <p className="text-gray-400 mb-8">Questão {currentIndex + 1} de {questoes.length}</p>
              <button
                onClick={() => setPaused(false)}
                className="px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl">
          {/* Question card */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                Questão {currentIndex + 1}
              </span>
              {isLikert && (
                <span className="text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
                  Escala Likert
                </span>
              )}
            </div>
            <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
              {questao.enunciado}
            </p>
          </div>

          {/* Options - Likert style */}
          {isLikert ? (
            <div className="mb-6">
              <div className="flex items-stretch gap-2 sm:gap-3">
                {questao.opcoes.map((opcao, i) => {
                  const label = opcao.replace(/^\d+\s*-?\s*/, '')
                  let btnClasses = 'flex-1 flex flex-col items-center justify-center py-3 sm:py-4 rounded-xl border-2 transition-all cursor-pointer min-h-[72px] sm:min-h-[88px] '

                  if (!answered) {
                    btnClasses += selectedOption === i
                      ? 'border-accent bg-accent/20 scale-105 shadow-lg shadow-accent/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  } else {
                    if (i === questao.resposta_correta) {
                      btnClasses += 'border-success bg-success/20 scale-105'
                    } else if (i === selectedOption && i !== questao.resposta_correta) {
                      btnClasses += 'border-danger bg-danger/20'
                    } else {
                      btnClasses += 'border-white/5 bg-white/5 opacity-40'
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={btnClasses}
                      disabled={answered}
                    >
                      <span className={`text-lg sm:text-xl font-bold mb-0.5 ${
                        answered && i === questao.resposta_correta ? 'text-success'
                        : answered && i === selectedOption ? 'text-danger'
                        : selectedOption === i ? 'text-accent'
                        : 'text-white'
                      }`}>
                        {i + 1}
                      </span>
                      {label && (
                        <span className={`text-[9px] sm:text-[10px] leading-tight text-center px-1 ${
                          answered && i === questao.resposta_correta ? 'text-success/80'
                          : answered && i === selectedOption ? 'text-danger/80'
                          : selectedOption === i ? 'text-accent/80'
                          : 'text-gray-500'
                        }`}>
                          {label}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {!answered && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[10px] text-gray-500">
                    {questao.opcoes[0].replace(/^\d+\s*-?\s*/, '')}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {questao.opcoes[questao.opcoes.length - 1].replace(/^\d+\s*-?\s*/, '')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Options - Multiple choice style */
            <div className="space-y-3 mb-6">
              {questao.opcoes.map((opcao, i) => {
                let classes = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium '

                if (!answered) {
                  classes += selectedOption === i
                    ? 'border-accent bg-accent/20 text-white shadow-lg shadow-accent/10'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10'
                } else {
                  if (i === questao.resposta_correta) {
                    classes += 'border-success bg-success/20 text-success'
                  } else if (i === selectedOption && i !== questao.resposta_correta) {
                    classes += 'border-danger bg-danger/20 text-danger'
                  } else {
                    classes += 'border-white/5 bg-white/5 text-gray-500'
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className={classes}
                    disabled={answered}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                        answered && i === questao.resposta_correta
                          ? 'bg-success text-white'
                          : answered && i === selectedOption
                          ? 'bg-danger text-white'
                          : selectedOption === i
                          ? 'bg-accent text-white'
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        {answered && i === questao.resposta_correta ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span className="leading-snug">{opcao}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Explicação */}
          {showExplicacao && questao.explicacao && (
            <div className={`rounded-2xl p-5 mb-6 border ${
              selectedOption === questao.resposta_correta
                ? 'bg-success/10 border-success/20'
                : 'bg-danger/10 border-danger/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedOption === questao.resposta_correta ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <X className="w-5 h-5 text-danger" />
                )}
                <p className={`font-bold text-sm ${
                  selectedOption === questao.resposta_correta ? 'text-success' : 'text-danger'
                }`}>
                  {selectedOption === questao.resposta_correta ? 'Resposta Ideal!' : 'Resposta Diferente do Ideal'}
                </p>
              </div>
              <p className={`text-sm leading-relaxed ${
                selectedOption === questao.resposta_correta ? 'text-success/90' : 'text-danger/90'
              }`}>{questao.explicacao}</p>
            </div>
          )}

          {/* Action button */}
          {!answered ? (
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedOption !== null
                  ? 'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/25'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold text-lg bg-accent text-white hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
            >
              {currentIndex < questoes.length - 1 ? (
                <>Próxima <ChevronRight className="w-5 h-5" /></>
              ) : (
                'Ver Resultado'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-8 px-4 py-3 bg-primary-dark border-t border-white/10">
        <div className="text-center">
          <span className="text-2xl font-bold text-success">{acertos}</span>
          <p className="text-xs text-gray-500">Acertos</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <span className="text-2xl font-bold text-danger">{erros}</span>
          <p className="text-xs text-gray-500">Erros</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-300">
            {Math.round((acertos / Math.max(acertos + erros, 1)) * 100)}%
          </span>
          <p className="text-xs text-gray-500">Precisão</p>
        </div>
      </div>
    </div>
  )
}
