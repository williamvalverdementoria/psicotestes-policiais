import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pause, Play, X, Clock, Target, ChevronDown, Lightbulb, BookOpen, Shield, Check, CheckCircle2, XCircle, ArrowRight, FileText, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { getCoachingScript } from '@/lib/coaching-scripts'
import { QuizExercicio } from '@/components/QuizExercicio'
import type { Exercicio as ExercicioType } from '@/types/database'

interface GridCell {
  symbol: string
  isTarget: boolean
  marked: boolean
}

function GridCoachingSection({ section }: { section: {
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

export function Exercicio() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [exercicio, setExercicio] = useState<ExercicioType | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [grid, setGrid] = useState<GridCell[]>([])
  const [gridConfig, setGridConfig] = useState({ linhas: 10, colunas: 15 })
  const [preTestStep, setPreTestStep] = useState<'tutorial' | 'instructions'>('tutorial')
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    if (!id) return
    supabase.from('exercicios').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setExercicio(data)
        setTimeLeft(data.tempo_limite)
        if (data.tipo !== 'quiz') {
          generateGrid(data)
        }
      }
    })
  }, [id])

  function generateGrid(ex: ExercicioType) {
    const config = ex.config_json as Record<string, unknown>
    const gridConf = config.grid as { linhas: number; colunas: number } || { linhas: 10, colunas: 15 }
    setGridConfig(gridConf)

    const total = gridConf.linhas * gridConf.colunas
    const targetRatio = (config.proporcao_alvo as number) || 0.15
    const targetCount = Math.round(total * targetRatio)

    const targetSymbol = (config.simbolo_alvo as string) || (config.alvo as string) || '◆'
    const distractors = (config.simbolos_distratores as string[]) || (config.distratores as string[]) || ['◇', '○', '●', '□']

    const cells: GridCell[] = []
    for (let i = 0; i < total; i++) {
      if (i < targetCount) {
        cells.push({ symbol: targetSymbol, isTarget: true, marked: false })
      } else {
        cells.push({
          symbol: distractors[Math.floor(Math.random() * distractors.length)],
          isTarget: false,
          marked: false,
        })
      }
    }
    // Shuffle
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]]
    }
    setGrid(cells)
  }

  const finishExercise = useCallback(async () => {
    if (finished || !user || !exercicio) return
    setFinished(true)
    clearInterval(timerRef.current)

    const tempoGasto = Date.now() - startTimeRef.current
    const totalTargets = grid.filter(c => c.isTarget).length
    const score = totalTargets > 0 ? Math.round((acertos / totalTargets) * 100) : 0

    const { data: sessao } = await supabase.from('sessoes_treino').insert({
      user_id: user.id,
      exercicio_id: exercicio.id,
      score,
      tempo_gasto: tempoGasto,
      acertos,
      erros,
      completado: true,
      finished_at: new Date().toISOString(),
    }).select().single()

    if (sessao) {
      navigate(`/resultado/${sessao.id}`)
    }
  }, [finished, user, exercicio, grid, acertos, erros, navigate])

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

  function togglePause() {
    setPaused(!paused)
  }

  function handleCellClick(index: number) {
    if (paused || finished || !started) return

    const cell = grid[index]
    if (cell.marked) return

    const newGrid = [...grid]
    newGrid[index] = { ...cell, marked: true }
    setGrid(newGrid)

    if (cell.isTarget) {
      setAcertos(prev => prev + 1)
    } else {
      setErros(prev => prev + 1)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // If quiz type, render QuizExercicio component
  if (exercicio?.tipo === 'quiz') {
    return <QuizExercicio exercicio={exercicio} />
  }

  if (!exercicio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!started) {
    const instrucoes = exercicio.instrucoes || ''
    const paragraphs = instrucoes.split('\n').filter((p: string) => p.trim())
    const configData = exercicio.config_json as Record<string, unknown>
    const targetSymbol = (configData?.simbolo_alvo as string) || (configData?.alvo as string) || '◆'
    const coaching = getCoachingScript(exercicio.titulo, configData)

    const coachingSections = [
      { id: 'como-funciona', icon: BookOpen, title: 'Como Funciona', items: coaching.comoFunciona, accent: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20', itemIcon: null as null, numbered: true },
      { id: 'dicas', icon: Zap, title: 'Estratégia', items: coaching.dicasEstrategicas, accent: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20', itemIcon: null as null, numbered: false },
      { id: 'marcar', icon: CheckCircle2, title: 'O Que Marcar', items: coaching.oQueMarcar, accent: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20', itemIcon: Check, numbered: false },
      { id: 'nao-marcar', icon: XCircle, title: 'O Que Evitar', items: coaching.oQueNaoMarcar, accent: 'text-red-400', bg: 'bg-red-500/5 border-red-500/10 hover:border-red-500/20', itemIcon: X, numbered: false },
    ]

    const StepIndicator = () => (
      <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            preTestStep === 'tutorial' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-accent/10 text-accent'
          }`}>1</div>
          <span className={`text-xs font-medium transition-colors hidden sm:block ${preTestStep === 'tutorial' ? 'text-white' : 'text-gray-500'}`}>Script</span>
        </div>
        <div className={`w-10 h-[2px] rounded-full transition-colors duration-500 ${preTestStep === 'instructions' ? 'bg-accent' : 'bg-white/10'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            preTestStep === 'instructions' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-white/5 text-gray-500'
          }`}>2</div>
          <span className={`text-xs font-medium transition-colors hidden sm:block ${preTestStep === 'instructions' ? 'text-white' : 'text-gray-500'}`}>Instruções</span>
        </div>
      </div>
    )

    // ─── TUTORIAL / COACHING STEP ───
    if (preTestStep === 'tutorial') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary">
          <div className="border-b border-white/5">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border text-cyan-300 bg-cyan-500/10 border-cyan-500/20">
                <Target className="w-3 h-3" />
                Atenção
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
            <StepIndicator />

            <div className="text-center mb-8 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">{coaching.titulo}</h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">{coaching.descricao}</p>
            </div>

            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 stagger-children">
              {coachingSections.map((section) => (
                <GridCoachingSection key={section.id} section={section} />
              ))}
            </div>

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
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary">
        <div className="border-b border-white/5">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setPreTestStep('tutorial')} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border text-cyan-300 bg-cyan-500/10 border-cyan-500/20">
              <Target className="w-3 h-3" />
              Atenção
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 step-transition-enter">
          <StepIndicator />

          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">{exercicio.titulo}</h1>
            <div className="flex items-center justify-center gap-5 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-500" />
                {Math.floor(exercicio.tempo_limite / 60)} min
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="inline-flex items-center gap-1.5">
                <Target className="w-4 h-4 text-gray-500" />
                Alvo: <span className="text-white text-base">{targetSymbol}</span>
              </span>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-white">Instruções do Teste</h2>
            </div>
            <div className="px-5 py-4 max-h-[40vh] overflow-y-auto">
              <div className="space-y-2.5">
                {paragraphs.map((p: string, i: number) => {
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

          <button
            onClick={startExercise}
            className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <Play className="w-5 h-5" />
            Iniciar Teste
          </button>
        </div>
      </div>
    )
  }

  const timerWarning = timeLeft < 60

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
          <button
            onClick={togglePause}
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={finishExercise}
            className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {paused && (
          <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Pause className="w-10 h-10 text-accent" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">Teste Pausado</p>
              <p className="text-gray-400 mb-8">Acertos: {acertos} · Erros: {erros}</p>
              <button
                onClick={togglePause}
                className="px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        <div
          className="grid gap-1 sm:gap-1.5 select-none"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.colunas}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-xs sm:text-sm md:text-base rounded-lg transition-all duration-150 ${
                cell.marked
                  ? cell.isTarget
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/10 hover:scale-105 active:scale-95 border border-white/[0.04]'
              }`}
              disabled={cell.marked || paused}
            >
              {cell.symbol}
            </button>
          ))}
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
