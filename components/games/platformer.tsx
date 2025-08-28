"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Player {
  x: number
  y: number
  velocityY: number
  isJumping: boolean
  isOnGround: boolean
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
}

interface Coin {
  x: number
  y: number
  collected: boolean
}

export default function Platformer() {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "gameOver" | "won">("waiting")
  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: 300,
    velocityY: 0,
    isJumping: false,
    isOnGround: true,
  })
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [coins, setCoins] = useState<Coin[]>([])
  const [platforms] = useState<Platform[]>([
    { x: 0, y: 350, width: 800, height: 20 },
    { x: 200, y: 280, width: 100, height: 20 },
    { x: 400, y: 220, width: 100, height: 20 },
    { x: 600, y: 160, width: 100, height: 20 },
    { x: 300, y: 100, width: 200, height: 20 },
  ])

  const initializeGame = () => {
    setPlayer({
      x: 50,
      y: 300,
      velocityY: 0,
      isJumping: false,
      isOnGround: true,
    })
    setCoins([
      { x: 250, y: 250, collected: false },
      { x: 450, y: 190, collected: false },
      { x: 650, y: 130, collected: false },
      { x: 400, y: 70, collected: false },
    ])
    setScore(0)
    setGameState("playing")
  }

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== "playing") return

      if (event.code === "Space" && player.isOnGround) {
        setPlayer((prev) => ({
          ...prev,
          velocityY: -15,
          isJumping: true,
          isOnGround: false,
        }))
      }
      if (event.code === "ArrowLeft") {
        setPlayer((prev) => ({ ...prev, x: Math.max(0, prev.x - 10) }))
      }
      if (event.code === "ArrowRight") {
        setPlayer((prev) => ({ ...prev, x: Math.min(750, prev.x + 10) }))
      }
    },
    [gameState, player.isOnGround],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (gameState !== "playing") return

    const gameLoop = setInterval(() => {
      setPlayer((prev) => {
        let newY = prev.y + prev.velocityY
        let newVelocityY = prev.velocityY + 0.8 // gravity
        let newIsOnGround = false

        // Check platform collisions
        for (const platform of platforms) {
          if (
            prev.x + 30 > platform.x &&
            prev.x < platform.x + platform.width &&
            newY + 30 > platform.y &&
            prev.y + 30 <= platform.y &&
            prev.velocityY >= 0
          ) {
            newY = platform.y - 30
            newVelocityY = 0
            newIsOnGround = true
            break
          }
        }

        // Check if fell off screen
        if (newY > 400) {
          setGameState("gameOver")
        }

        return {
          ...prev,
          y: newY,
          velocityY: newVelocityY,
          isOnGround: newIsOnGround,
          isJumping: !newIsOnGround,
        }
      })

      // Check coin collection
      setCoins((prev) =>
        prev.map((coin) => {
          if (!coin.collected && Math.abs(player.x - coin.x) < 30 && Math.abs(player.y - coin.y) < 30) {
            setScore((s) => s + 100)
            return { ...coin, collected: true }
          }
          return coin
        }),
      )

      // Check win condition
      if (coins.every((coin) => coin.collected)) {
        setGameState("won")
      }
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameState, player.x, player.y, coins, platforms])

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-white">Platformer Adventure</CardTitle>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">Score: {score}</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">Level: {level}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {gameState === "waiting" && (
              <div className="text-center space-y-3 sm:space-y-4">
                <p className="text-slate-300 text-sm sm:text-base">Use ARROW KEYS to move and SPACEBAR to jump!</p>
                <p className="text-slate-400 text-xs sm:text-sm">Collect all coins to win. Don't fall off the platforms!</p>
                <Button onClick={initializeGame} className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                  Start Game
                </Button>
              </div>
            )}

            {(gameState === "playing" || gameState === "gameOver" || gameState === "won") && (
              <div className="relative">
                {/* Game Canvas */}
                <div className="relative w-full bg-gradient-to-b from-sky-400 to-sky-600 rounded-lg overflow-hidden" style={{ height: 'clamp(250px, 50vh, 400px)' }}>
                  {/* Platforms */}
                  {platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="absolute bg-green-600 rounded"
                      style={{
                        left: `${(platform.x / 800) * 100}%`,
                        top: `${(platform.y / 400) * 100}%`,
                        width: `${(platform.width / 800) * 100}%`,
                        height: `${(platform.height / 400) * 100}%`,
                      }}
                    />
                  ))}

                  {/* Coins */}
                  {coins.map(
                    (coin, index) =>
                      !coin.collected && (
                        <div
                          key={index}
                          className="absolute bg-yellow-400 rounded-full animate-pulse"
                          style={{
                            left: `${(coin.x / 800) * 100}%`,
                            top: `${(coin.y / 400) * 100}%`,
                            width: 'clamp(16px, 3vw, 24px)',
                            height: 'clamp(16px, 3vw, 24px)',
                          }}
                        />
                      ),
                  )}

                  {/* Player */}
                  <div
                    className="absolute bg-red-500 rounded transition-all duration-75"
                    style={{
                      left: `${(player.x / 800) * 100}%`,
                      top: `${(player.y / 400) * 100}%`,
                      width: 'clamp(20px, 4vw, 32px)',
                      height: 'clamp(20px, 4vw, 32px)',
                    }}
                  />
                </div>

                {gameState === "gameOver" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-3 sm:space-y-4 p-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-red-400">Game Over!</h3>
                      <p className="text-slate-300 text-sm sm:text-base">You fell off the platform!</p>
                      <Button onClick={initializeGame} className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {gameState === "won" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-3 sm:space-y-4 p-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-green-400">You Won!</h3>
                      <p className="text-slate-300 text-sm sm:text-base">All coins collected! Score: {score}</p>
                      <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                        Play Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-xs sm:text-sm text-slate-400">
              <p>Controls: ← → Arrow Keys to move, SPACEBAR to jump</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
