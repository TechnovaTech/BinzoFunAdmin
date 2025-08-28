"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Flag, Bomb, Timer } from "lucide-react"
import Link from "next/link"

type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [mineCount, setMineCount] = useState(10)
  const [flagCount, setFlagCount] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [timer, setTimer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const difficulties = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
  }

  const initBoard = () => {
    const { rows, cols, mines } = difficulties[difficulty]
    const newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    )

    // Place mines
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++
              }
            }
          }
          newBoard[r][c].neighborMines = count
        }
      }
    }

    setBoard(newBoard)
    setGameStatus('playing')
    setMineCount(mines)
    setFlagCount(0)
    setTimer(0)
    setGameStarted(false)
  }

  useEffect(() => {
    initBoard()
  }, [difficulty])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && gameStatus === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameStatus])

  const revealCell = (row: number, col: number) => {
    if (gameStatus !== 'playing' || board[row][col].isRevealed || board[row][col].isFlagged) return

    if (!gameStarted) setGameStarted(true)

    const newBoard = [...board]
    
    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      newBoard.forEach(r => r.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true
      }))
      setGameStatus('lost')
    } else {
      // Reveal cell and adjacent empty cells
      const reveal = (r: number, c: number) => {
        if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length || 
            newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return
        
        newBoard[r][c].isRevealed = true
        
        if (newBoard[r][c].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              reveal(r + dr, c + dc)
            }
          }
        }
      }
      
      reveal(row, col)
      
      // Check win condition
      const unrevealedNonMines = newBoard.flat().filter(cell => !cell.isRevealed && !cell.isMine).length
      if (unrevealedNonMines === 0) {
        setGameStatus('won')
      }
    }
    
    setBoard(newBoard)
  }

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameStatus !== 'playing' || board[row][col].isRevealed) return

    const newBoard = [...board]
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setFlagCount(prev => newBoard[row][col].isFlagged ? prev + 1 : prev - 1)
    setBoard(newBoard)
  }

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return <Flag className="w-2 h-2 text-red-500" />
    if (!cell.isRevealed) return null
    if (cell.isMine) return <Bomb className="w-2 h-2 text-red-600" />
    if (cell.neighborMines > 0) return <span className="text-xs font-bold leading-none">{cell.neighborMines}</span>
    return null
  }

  const getCellClass = (cell: Cell) => {
    let baseClass = "aspect-square flex items-center justify-center border border-gray-600 cursor-pointer transition-all active:scale-95 "
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += "bg-red-600 text-white shadow-inner"
      } else {
        baseClass += "bg-gray-100 text-gray-900 shadow-inner"
        if (cell.neighborMines === 1) baseClass += " text-blue-700"
        else if (cell.neighborMines === 2) baseClass += " text-green-700"
        else if (cell.neighborMines === 3) baseClass += " text-red-700"
        else if (cell.neighborMines === 4) baseClass += " text-purple-700"
        else if (cell.neighborMines === 5) baseClass += " text-yellow-700"
        else if (cell.neighborMines >= 6) baseClass += " text-pink-700"
      }
    } else {
      baseClass += "bg-gradient-to-br from-gray-300 to-gray-400 active:from-gray-200 active:to-gray-300 shadow-md"
      if (cell.isFlagged) baseClass += " !bg-gradient-to-br !from-yellow-200 !to-yellow-300"
    }
    
    return baseClass
  }

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-6 border-b border-white/10 gap-3 mb-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/games">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Games</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="font-work-sans font-bold text-xl sm:text-2xl text-white">Minesweeper</h1>
              <p className="text-slate-400 text-sm sm:text-base hidden sm:block">Classic mine detection puzzle game</p>
            </div>
          </div>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 border-slate-600 text-slate-300 text-xs sm:text-sm">
            <Bomb className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Puzzle Game
          </Badge>
        </div>
        
        <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge variant="secondary" className="bg-blue-600 text-xs px-1 sm:px-2">
                💣 {mineCount - flagCount}
              </Badge>
              <Badge variant="secondary" className="bg-green-600 text-xs px-1 sm:px-2">
                <Timer className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                {timer}s
              </Badge>
              <Badge variant={gameStatus === 'won' ? 'default' : gameStatus === 'lost' ? 'destructive' : 'secondary'} className="text-xs px-1 sm:px-2">
                {gameStatus === 'won' ? '🎉' : gameStatus === 'lost' ? '💥' : '🎮'}
                <span className="hidden sm:inline ml-1">
                  {gameStatus === 'won' ? 'Won!' : gameStatus === 'lost' ? 'Lost!' : 'Playing'}
                </span>
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <Button
                key={diff}
                variant={difficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(diff)}
                className={`h-7 px-2 text-xs ${difficulty === diff ? "" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={initBoard}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-7 px-2 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <div 
            className="grid gap-0.5 sm:gap-1 p-1 sm:p-2 bg-gray-200 border-2 sm:border-4 border-gray-400 rounded shadow-lg"
            style={{ 
              gridTemplateColumns: `repeat(${difficulties[difficulty].cols}, minmax(0, 1fr))`,
              maxWidth: '100%',
              minWidth: difficulty === 'hard' ? '600px' : 'auto'
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(cell)}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                  style={{ 
                    width: difficulty === 'hard' ? 'clamp(16px, 2.2vw, 22px)' : difficulty === 'medium' ? 'clamp(20px, 3vw, 28px)' : 'clamp(28px, 5vw, 40px)',
                    height: difficulty === 'hard' ? 'clamp(16px, 2.2vw, 22px)' : difficulty === 'medium' ? 'clamp(20px, 3vw, 28px)' : 'clamp(28px, 5vw, 40px)'
                  }}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-400">
          <div className="hidden sm:block">Left click to reveal • Right click to flag • Find all mines to win!</div>
          <div className="sm:hidden">Tap to reveal • Long press to flag</div>
        </div>
        
        {gameStatus === 'won' && (
          <div className="mt-3 sm:mt-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎉</div>
            <div className="text-base sm:text-lg font-bold text-green-400">Congratulations!</div>
            <div className="text-xs sm:text-sm text-gray-400">Completed in {timer} seconds</div>
          </div>
        )}
        
        {gameStatus === 'lost' && (
          <div className="mt-3 sm:mt-4 text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💥</div>
            <div className="text-base sm:text-lg font-bold text-red-400">Game Over!</div>
            <div className="text-xs sm:text-sm text-gray-400">Better luck next time</div>
          </div>
        )}
      </div>
    </div>
  )
}