import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pause, Play, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
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
        generateGrid(data)
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

  if (!exercicio) {
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
          <h1 className="text-2xl font-bold text-white mb-4">{exercicio.titulo}</h1>
          <p className="text-gray-400 mb-8">{exercicio.instrucoes}</p>
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
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={finishExercise}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {paused && (
          <div className="absolute inset-0 bg-primary/95 flex items-center justify-center z-10">
            <div className="text-center">
              <Pause className="w-12 h-12 text-accent mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-4">Pausado</p>
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        <div
          className="grid gap-1 select-none"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.colunas}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded transition-all ${
                cell.marked
                  ? cell.isTarget
                    ? 'bg-success/30 text-success'
                    : 'bg-danger/30 text-danger'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              disabled={cell.marked || paused}
            >
              {cell.symbol}
            </button>
          ))}
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
