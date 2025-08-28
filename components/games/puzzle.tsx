"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type GemType = "red" | "blue" | "green" | "yellow" | "purple" | "orange" | null

interface Position {
  row: number
  col: number
}

export default function Puzzle() {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "gameOver">("waiting")
  const [board, setBoard] = useState<GemType[][]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(30)
  const [selectedGem, setSelectedGem] = useState<Position | null>(null)
  const [target, setTarget] = useState(1000)

  const gemColors = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  }

  const gemTypes: GemType[] = ["red", "blue", "green", "yellow", "purple", "orange"]

  const createRandomBoard = (): GemType[][] => {
    const newBoard: GemType[][] = []
    for (let row = 0; row < 8; row++) {
      newBoard[row] = []
      for (let col = 0; col < 8; col++) {
        newBoard[row][col] = gemTypes[Math.floor(Math.random() * gemTypes.length)]
      }
    }
    return newBoard
  }

  const findMatches = (board: GemType[][]): Position[] => {
    const matches: Position[] = []

    // Check horizontal matches
    for (let row = 0; row < 8; row++) {
      let count = 1
      let currentGem = board[row][0]
      for (let col = 1; col < 8; col++) {
        if (board[row][col] === currentGem && currentGem !== null) {
          count++
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              matches.push({ row, col: i })
            }
          }
          count = 1
          currentGem = board[row][col]
        }
      }
      if (count >= 3) {
        for (let i = 8 - count; i < 8; i++) {
          matches.push({ row, col: i })
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < 8; col++) {
      let count = 1
      let currentGem = board[0][col]
      for (let row = 1; row < 8; row++) {
        if (board[row][col] === currentGem && currentGem !== null) {
          count++
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              matches.push({ row: i, col })
            }
          }
          count = 1
          currentGem = board[row][col]
        }
      }
      if (count >= 3) {
        for (let i = 8 - count; i < 8; i++) {
          matches.push({ row: i, col })
        }
      }
    }

    return matches
  }

  const removeMatches = (board: GemType[][], matches: Position[]): GemType[][] => {
    const newBoard = board.map((row) => [...row])
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null
    })
    return newBoard
  }

  const dropGems = (board: GemType[][]): GemType[][] => {
    const newBoard = board.map((row) => [...row])

    for (let col = 0; col < 8; col++) {
      let writePos = 7
      for (let row = 7; row >= 0; row--) {
        if (newBoard[row][col] !== null) {
          newBoard[writePos][col] = newBoard[row][col]
          if (writePos !== row) {
            newBoard[row][col] = null
          }
          writePos--
        }
      }

      // Fill empty spaces with new gems
      for (let row = writePos; row >= 0; row--) {
        newBoard[row][col] = gemTypes[Math.floor(Math.random() * gemTypes.length)]
      }
    }

    return newBoard
  }

  const swapGems = (board: GemType[][], pos1: Position, pos2: Position): GemType[][] => {
    const newBoard = board.map((row) => [...row])
    const temp = newBoard[pos1.row][pos1.col]
    newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col]
    newBoard[pos2.row][pos2.col] = temp
    return newBoard
  }

  const isAdjacent = (pos1: Position, pos2: Position): boolean => {
    const rowDiff = Math.abs(pos1.row - pos2.row)
    const colDiff = Math.abs(pos1.col - pos2.col)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }

  const initializeGame = () => {
    let newBoard = createRandomBoard()
    // Remove initial matches
    let matches = findMatches(newBoard)
    while (matches.length > 0) {
      newBoard = removeMatches(newBoard, matches)
      newBoard = dropGems(newBoard)
      matches = findMatches(newBoard)
    }

    setBoard(newBoard)
    setScore(0)
    setMoves(30)
    setSelectedGem(null)
    setGameState("playing")
  }

  const handleGemClick = (row: number, col: number) => {
    if (gameState !== "playing") return

    const clickedPos = { row, col }

    if (!selectedGem) {
      setSelectedGem(clickedPos)
    } else if (selectedGem.row === row && selectedGem.col === col) {
      setSelectedGem(null)
    } else if (isAdjacent(selectedGem, clickedPos)) {
      // Try to swap gems
      const newBoard = swapGems(board, selectedGem, clickedPos)
      const matches = findMatches(newBoard)

      if (matches.length > 0) {
        setMoves((prev) => prev - 1)
        processMatches(newBoard, matches)
      }
      setSelectedGem(null)
    } else {
      setSelectedGem(clickedPos)
    }
  }

  const processMatches = (initialBoard: GemType[][], initialMatches: Position[]) => {
    let currentBoard = initialBoard
    let currentMatches = initialMatches
    let totalScore = 0

    while (currentMatches.length > 0) {
      totalScore += currentMatches.length * 10
      currentBoard = removeMatches(currentBoard, currentMatches)
      currentBoard = dropGems(currentBoard)
      currentMatches = findMatches(currentBoard)
    }

    setBoard(currentBoard)
    setScore((prev) => prev + totalScore)
  }

  useEffect(() => {
    if (moves <= 0) {
      setGameState("gameOver")
    }
  }, [moves])

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-6 border-b border-slate-700 gap-3 mb-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <a href="/games">
                <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back to Games</span>
                <span className="sm:hidden">Back</span>
              </a>
            </Button>
            <div>
              <h1 className="font-work-sans font-bold text-xl sm:text-2xl text-white">Puzzle</h1>
              <p className="text-slate-400 text-sm sm:text-base hidden sm:block">Match 3 gems to score points</p>
            </div>
          </div>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 border-slate-600 text-slate-300 text-xs sm:text-sm">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Puzzle Game
          </Badge>
        </div>
        
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">Score: {score}</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">Moves: {moves}</Badge>
              <Badge variant="default" className="text-xs sm:text-sm">Target: {target}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {gameState === "waiting" && (
              <div className="text-center space-y-3 sm:space-y-4">
                <p className="text-slate-300 text-sm sm:text-base">Match 3 or more gems to score points!</p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Click two adjacent gems to swap them. Reach {target} points to win!</span>
                  <span className="sm:hidden">Tap adjacent gems to swap. Reach {target} points!</span>
                </p>
                <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                  Start Game
                </Button>
              </div>
            )}

            {(gameState === "playing" || gameState === "gameOver") && (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-8 gap-1 bg-slate-800 p-2 rounded-lg mx-auto" style={{ maxWidth: 'min(400px, 100vw - 2rem)' }}>
                  {board.map((row, rowIndex) =>
                    row.map((gem, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleGemClick(rowIndex, colIndex)}
                        className={`
                          aspect-square rounded-lg transition-all duration-200 active:scale-95
                          ${gem ? gemColors[gem] : "bg-slate-700"}
                          ${
                            selectedGem?.row === rowIndex && selectedGem?.col === colIndex
                              ? "ring-2 ring-white scale-110"
                              : ""
                          }
                        `}
                        style={{ 
                          width: 'clamp(28px, 8vw, 44px)',
                          height: 'clamp(28px, 8vw, 44px)'
                        }}
                        disabled={gameState !== "playing"}
                      />
                    )),
                  )}
                </div>

                {gameState === "gameOver" && (
                  <div className="text-center space-y-3 sm:space-y-4 p-3 sm:p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{score >= target ? "You Won!" : "Game Over!"}</h3>
                    <p className="text-slate-300 text-sm sm:text-base">
                      Final Score: {score} / {target}
                    </p>
                    <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
