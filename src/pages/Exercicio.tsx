import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pause, Play, X, Clock, Target, AlertTriangle, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { QuizExercicio } from '@/components/QuizExercicio'
import type { Exercicio as ExercicioType } from '@/types/database'

interface GridCell {
  symbol: string
  isTarget: boolean
  marked: boolean
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
    const config = exercicio.config_json as Record<string, unknown>
    const targetSymbol = (config?.simbolo_alvo as string) || (config?.alvo as string) || '◆'

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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border text-blue-400 bg-blue-500/20 border-blue-500/30">
              <Target className="w-3.5 h-3.5" />
              Atenção
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{exercicio.titulo}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {Math.floor(exercicio.tempo_limite / 60)} minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Símbolo alvo: <span className="text-white text-lg">{targetSymbol}</span>
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Instruções do Teste</h2>
            </div>
            <div className="px-6 py-5 max-h-[40vh] overflow-y-auto">
              <div className="space-y-3">
                {paragraphs.map((p: string, i: number) => {
                  const trimmed = p.trim()
                  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.startsWith('•') && !trimmed.startsWith('—')) {
                    return <p key={i} className="text-accent font-bold text-sm mt-4 first:mt-0">{trimmed}</p>
                  }
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

  const timerWarning = timeLeft < 60

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
          <button
            onClick={togglePause}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={finishExercise}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
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
              className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-xs sm:text-sm md:text-base rounded-md transition-all ${
                cell.marked
                  ? cell.isTarget
                    ? 'bg-success/30 text-success ring-1 ring-success/50'
                    : 'bg-danger/30 text-danger ring-1 ring-danger/50'
                  : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95'
              }`}
              disabled={cell.marked || paused}
            >
              {cell.symbol}
            </button>
          ))}
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
