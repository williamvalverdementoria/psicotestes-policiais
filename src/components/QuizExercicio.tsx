import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pause, Play, X, ChevronRight, ChevronDown, Check, Clock, FileText, Brain, Heart, Shield, Lightbulb, BookOpen, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { getCoachingScript } from '@/lib/coaching-scripts'
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
    case 'personalidade': return 'text-blue-300 bg-blue-500/10 border-blue-500/20'
    case 'memoria': return 'text-slate-300 bg-slate-500/10 border-slate-500/20'
    case 'raciocinio': return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20'
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

function CoachingSection({ section }: { section: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  items: string[]
  accent: string
  bg: string
  itemIcon: React.ComponentType<{ className?: string }> | null
  numbered: boolean
} }) {
  const [expanded, setExpanded] = useState(section.id === 'como-funciona')
  const Icon = section.icon
  const ItemIcon = section.itemIcon

  return (
    <div className={`coaching-section border rounded-xl transition-all duration-300 cursor-pointer ${section.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${section.accent} flex-shrink-0`} />
          <span className="text-[13px] font-semibold text-white">{section.title}</span>
          <span className="text-[11px] text-gray-500 font-medium">{section.items.length}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <div className={`coaching-section-content ${expanded ? 'expanded' : ''}`}>
        <div>
          <div className="px-4 pb-3 space-y-1.5">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 animate-slide-in-right" style={{ animationDelay: `${i * 50}ms` }}>
                {section.numbered ? (
                  <span className={`w-5 h-5 rounded-md bg-white/5 ${section.accent} text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{i + 1}</span>
                ) : ItemIcon ? (
                  <ItemIcon className={`w-3.5 h-3.5 ${section.accent} flex-shrink-0 mt-1`} />
                ) : (
                  <span className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${section.accent.replace('text-', 'bg-')}`} />
                )}
                <p className="text-gray-400 text-[13px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
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
  const [preTestStep, setPreTestStep] = useState<'tutorial' | 'instructions'>('tutorial')
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

  // ─── PRE-TEST SCREENS ───
  if (!started) {
    const CategoryIcon = getCategoryIcon(category)
    const categoryColor = getCategoryColor(category)
    const coaching = getCoachingScript(exercicio.titulo, config)

    const coachingSections = [
      {
        id: 'como-funciona',
        icon: BookOpen,
        title: 'Como Funciona',
        items: coaching.comoFunciona,
        accent: 'text-blue-400',
        bg: 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20',
        itemIcon: null as null,
        numbered: true,
      },
      {
        id: 'dicas',
        icon: Zap,
        title: 'Estratégia',
        items: coaching.dicasEstrategicas,
        accent: 'text-amber-400',
        bg: 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20',
        itemIcon: null as null,
        numbered: false,
      },
      {
        id: 'marcar',
        icon: CheckCircle2,
        title: 'O Que Marcar',
        items: coaching.oQueMarcar,
        accent: 'text-emerald-400',
        bg: 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20',
        itemIcon: Check,
        numbered: false,
      },
      {
        id: 'nao-marcar',
        icon: XCircle,
        title: 'O Que Evitar',
        items: coaching.oQueNaoMarcar,
        accent: 'text-red-400',
        bg: 'bg-red-500/5 border-red-500/10 hover:border-red-500/20',
        itemIcon: X,
        numbered: false,
      },
      ...(coaching.exemplosPraticos?.length ? [{
        id: 'exemplos',
        icon: FileText,
        title: 'Exemplos',
        items: coaching.exemplosPraticos,
        accent: 'text-violet-400',
        bg: 'bg-violet-500/5 border-violet-500/10 hover:border-violet-500/20',
        itemIcon: ArrowRight,
        numbered: false,
      }] : []),
    ]

    // Step indicator
    const StepIndicator = () => (
      <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            preTestStep === 'tutorial'
              ? 'bg-accent text-white shadow-lg shadow-accent/30'
              : 'bg-accent/10 text-accent'
          }`}>1</div>
          <span className={`text-xs font-medium transition-colors hidden sm:block ${
            preTestStep === 'tutorial' ? 'text-white' : 'text-gray-500'
          }`}>Script</span>
        </div>
        <div className={`w-10 h-[2px] rounded-full transition-colors duration-500 ${
          preTestStep === 'instructions' ? 'bg-accent' : 'bg-white/10'
        }`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            preTestStep === 'instructions'
              ? 'bg-accent text-white shadow-lg shadow-accent/30'
              : 'bg-white/5 text-gray-500'
          }`}>2</div>
          <span className={`text-xs font-medium transition-colors hidden sm:block ${
            preTestStep === 'instructions' ? 'text-white' : 'text-gray-500'
          }`}>Instruções</span>
        </div>
      </div>
    )

    // ─── TUTORIAL / COACHING STEP ───
    if (preTestStep === 'tutorial') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary">
          {/* Minimal header */}
          <div className="border-b border-white/5">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${categoryColor}`}>
                <CategoryIcon className="w-3 h-3" />
                {getCategoryLabel(category)}
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
            <StepIndicator />

            {/* Hero title */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">{coaching.titulo}</h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">{coaching.descricao}</p>
            </div>

            {/* Collapsible coaching sections */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 stagger-children">
              {coachingSections.map((section) => (
                <CoachingSection key={section.id} section={section} />
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setPreTestStep('instructions')}
              className="w-full mt-6 group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 animate-fade-in-up"
              style={{ animationDelay: '500ms' }}
            >
              Continuar para Instruções
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )
    }

    // ─── INSTRUCTIONS STEP ───
    const instrucoes = exercicio.instrucoes || ''
    const paragraphs = instrucoes.split('\n').filter(p => p.trim())

    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary">
        {/* Header */}
        <div className="border-b border-white/5">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setPreTestStep('tutorial')} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${categoryColor}`}>
              <CategoryIcon className="w-3 h-3" />
              {getCategoryLabel(category)}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 step-transition-enter">
          <StepIndicator />

          {/* Title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">{exercicio.titulo}</h1>
            <div className="flex items-center justify-center gap-5 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gray-500" />
                {questoes.length} questões
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-500" />
                {Math.floor(exercicio.tempo_limite / 60)} min
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-white">Instruções do Teste</h2>
            </div>
            <div className="px-5 py-4 max-h-[45vh] overflow-y-auto">
              <div className="space-y-2.5">
                {paragraphs.map((p, i) => {
                  const trimmed = p.trim()
                  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.startsWith('•') && !trimmed.startsWith('—')) {
                    return <p key={i} className="text-accent font-semibold text-sm mt-5 first:mt-0 tracking-wide">{trimmed}</p>
                  }
                  if (trimmed.startsWith('•') || trimmed.startsWith('—') || trimmed.startsWith('-')) {
                    return <p key={i} className="text-gray-400 text-sm pl-4 leading-relaxed">{trimmed}</p>
                  }
                  return <p key={i} className="text-gray-400 text-sm leading-relaxed">{trimmed}</p>
                })}
              </div>
            </div>
          </div>

          {/* Likert preview */}
          {isLikert && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="text-gray-500 text-[11px] font-semibold mb-3 uppercase tracking-widest">Escala de Resposta</p>
              <div className="flex items-center justify-between gap-1">
                {questoes[0].opcoes.map((opcao, i) => (
                  <div key={i} className="text-center flex-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 font-semibold text-sm mx-auto mb-1.5 hover:bg-white/10 transition-colors">
                      {i + 1}
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight hidden sm:block">
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
            className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Play className="w-5 h-5" />
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
    <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg font-mono font-semibold text-base tabular-nums ${
            timerWarning ? 'bg-red-500/10 text-red-400 animate-pulse' : 'bg-white/5 text-white/80'
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 hidden sm:block font-medium">{exercicio.titulo}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-lg tabular-nums">
            {currentIndex + 1}<span className="text-gray-600">/{questoes.length}</span>
          </span>
          <button onClick={() => setPaused(!paused)} className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => finishExercise()} className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-white/[0.03]">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
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

        <div className="w-full max-w-2xl animate-fade-in">
          {/* Question card */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 sm:p-7 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold text-accent/80 bg-accent/5 px-2 py-0.5 rounded-md">
                {currentIndex + 1} de {questoes.length}
              </span>
              {isLikert && (
                <span className="text-[11px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">
                  Likert
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed">
              {questao.enunciado}
            </p>
          </div>

          {/* Options - Likert style */}
          {isLikert ? (
            <div className="mb-5">
              <div className="flex items-stretch gap-1.5 sm:gap-2">
                {questao.opcoes.map((opcao, i) => {
                  const label = opcao.replace(/^\d+\s*-?\s*/, '')
                  let btnClasses = 'flex-1 flex flex-col items-center justify-center py-3 sm:py-4 rounded-xl border transition-all duration-200 cursor-pointer min-h-[68px] sm:min-h-[80px] '

                  if (!answered) {
                    btnClasses += selectedOption === i
                      ? 'border-accent bg-accent/15 scale-[1.03]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]'
                  } else {
                    if (i === questao.resposta_correta) {
                      btnClasses += 'border-emerald-500/30 bg-emerald-500/10 scale-[1.03]'
                    } else if (i === selectedOption && i !== questao.resposta_correta) {
                      btnClasses += 'border-red-500/30 bg-red-500/10'
                    } else {
                      btnClasses += 'border-white/[0.03] bg-white/[0.01] opacity-30'
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={btnClasses}
                      disabled={answered}
                    >
                      <span className={`text-base sm:text-lg font-semibold mb-0.5 ${
                        answered && i === questao.resposta_correta ? 'text-emerald-400'
                        : answered && i === selectedOption ? 'text-red-400'
                        : selectedOption === i ? 'text-accent'
                        : 'text-white/70'
                      }`}>
                        {i + 1}
                      </span>
                      {label && (
                        <span className={`text-[9px] sm:text-[10px] leading-tight text-center px-0.5 ${
                          answered && i === questao.resposta_correta ? 'text-emerald-400/70'
                          : answered && i === selectedOption ? 'text-red-400/70'
                          : selectedOption === i ? 'text-accent/70'
                          : 'text-gray-600'
                        }`}>
                          {label}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {!answered && (
                <div className="flex items-center justify-between mt-1.5 px-1">
                  <span className="text-[10px] text-gray-600">
                    {questao.opcoes[0].replace(/^\d+\s*-?\s*/, '')}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {questao.opcoes[questao.opcoes.length - 1].replace(/^\d+\s*-?\s*/, '')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Options - Multiple choice style */
            <div className="space-y-2 mb-5">
              {questao.opcoes.map((opcao, i) => {
                let classes = 'w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer '

                if (!answered) {
                  classes += selectedOption === i
                    ? 'border-accent/40 bg-accent/10 text-white'
                    : 'border-white/[0.06] bg-white/[0.02] text-gray-300 hover:border-white/15 hover:bg-white/[0.05]'
                } else {
                  if (i === questao.resposta_correta) {
                    classes += 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  } else if (i === selectedOption && i !== questao.resposta_correta) {
                    classes += 'border-red-500/30 bg-red-500/10 text-red-400'
                  } else {
                    classes += 'border-white/[0.03] bg-white/[0.01] text-gray-600'
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
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                        answered && i === questao.resposta_correta
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : answered && i === selectedOption
                          ? 'bg-red-500/20 text-red-400'
                          : selectedOption === i
                          ? 'bg-accent/20 text-accent'
                          : 'bg-white/5 text-gray-500'
                      }`}>
                        {answered && i === questao.resposta_correta ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span className="leading-snug text-sm font-medium">{opcao}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Explicação */}
          {showExplicacao && questao.explicacao && (
            <div className={`rounded-xl p-4 mb-5 border animate-fade-in-up ${
              selectedOption === questao.resposta_correta
                ? 'bg-emerald-500/5 border-emerald-500/15'
                : 'bg-red-500/5 border-red-500/15'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                {selectedOption === questao.resposta_correta ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <p className={`font-semibold text-sm ${
                  selectedOption === questao.resposta_correta ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {selectedOption === questao.resposta_correta ? 'Resposta Ideal' : 'Resposta Diferente do Ideal'}
                </p>
              </div>
              <p className="text-gray-400 text-[13px] leading-relaxed pl-6">{questao.explicacao}</p>
            </div>
          )}

          {/* Action button */}
          {!answered ? (
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                selectedOption !== null
                  ? 'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/20'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-accent text-white hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
            >
              {currentIndex < questoes.length - 1 ? (
                <>Próxima <ChevronRight className="w-4 h-4" /></>
              ) : (
                'Ver Resultado'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-6 px-4 py-2.5 border-t border-white/5">
        <div className="text-center">
          <span className="text-lg font-semibold text-emerald-400 tabular-nums">{acertos}</span>
          <p className="text-[10px] text-gray-600 font-medium">Acertos</p>
        </div>
        <div className="w-px h-6 bg-white/5" />
        <div className="text-center">
          <span className="text-lg font-semibold text-red-400 tabular-nums">{erros}</span>
          <p className="text-[10px] text-gray-600 font-medium">Erros</p>
        </div>
        <div className="w-px h-6 bg-white/5" />
        <div className="text-center">
          <span className="text-lg font-semibold text-white/70 tabular-nums">
            {Math.round((acertos / Math.max(acertos + erros, 1)) * 100)}%
          </span>
          <p className="text-[10px] text-gray-600 font-medium">Precisão</p>
        </div>
      </div>
    </div>
  )
}
