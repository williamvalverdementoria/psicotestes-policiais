import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pause, Play, X, ChevronRight, Check } from 'lucide-react'
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

  if (questoes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{exercicio.titulo}</h1>
          <p className="text-gray-400 mb-4">{exercicio.instrucoes}</p>
          <p className="text-sm text-gray-500 mb-8">{questoes.length} questões · {Math.floor(exercicio.tempo_limite / 60)} minutos</p>
          <button
            onClick={startExercise}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
          >
            <Play className="w-6 h-6" />
            Começar
          </button>
        </div>
      </div>
    )
  }

  const questao = questoes[currentIndex]

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-dark">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-mono font-bold text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-400">{exercicio.titulo}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {currentIndex + 1}/{questoes.length}
          </span>
          <button onClick={() => setPaused(!paused)} className="p-2 text-gray-400 hover:text-white transition-colors">
            {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button onClick={() => finishExercise()} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questoes.length) * 100}%` }}
        />
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {paused && (
          <div className="absolute inset-0 bg-primary/95 flex items-center justify-center z-10">
            <div className="text-center">
              <Pause className="w-12 h-12 text-accent mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-4">Pausado</p>
              <button
                onClick={() => setPaused(false)}
                className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl">
          {/* Question */}
          <div className="bg-white/5 rounded-2xl p-6 sm:p-8 mb-6">
            <p className="text-xs text-accent font-bold mb-3">Questão {currentIndex + 1}</p>
            <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
              {questao.enunciado}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {questao.opcoes.map((opcao, i) => {
              let classes = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium '

              if (!answered) {
                classes += selectedOption === i
                  ? 'border-accent bg-accent/20 text-white'
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
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
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
                    {opcao}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Explicação */}
          {showExplicacao && questao.explicacao && (
            <div className={`rounded-xl p-4 mb-6 text-sm ${
              selectedOption === questao.resposta_correta
                ? 'bg-success/10 border border-success/20 text-success'
                : 'bg-danger/10 border border-danger/20 text-danger'
            }`}>
              <p className="font-bold mb-1">
                {selectedOption === questao.resposta_correta ? 'Correto!' : 'Incorreto'}
              </p>
              <p className="opacity-90">{questao.explicacao}</p>
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
      <div className="flex items-center justify-center gap-8 px-4 py-3 bg-primary-dark">
        <div className="text-center">
          <span className="text-2xl font-bold text-success">{acertos}</span>
          <p className="text-xs text-gray-400">Acertos</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-danger">{erros}</span>
          <p className="text-xs text-gray-400">Erros</p>
        </div>
      </div>
    </div>
  )
}
