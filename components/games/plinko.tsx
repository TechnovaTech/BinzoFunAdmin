"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

interface Ball {
  id: number
  x: number
  y: number
  isActive: boolean
  trail: Array<{ x: number; y: number }>
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface PegHit {
  id: number
  x: number
  y: number
  timestamp: number
}

export function PlinkoGame() {
  const [balance, setBalance] = useState(1000)
  const [betAmount, setBetAmount] = useState(10)
  const [isDropping, setIsDropping] = useState(false)
  const [gameMode, setGameMode] = useState<"manual" | "auto">("manual")
  const [risk, setRisk] = useState("medium")
  const [rows, setRows] = useState(16)
  const [balls, setBalls] = useState<Ball[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [pegHits, setPegHits] = useState<PegHit[]>([])
  const [gameHistory, setGameHistory] = useState<Array<{ multiplier: number; winnings: number; timestamp: number }>>([])
  const [winAnimation, setWinAnimation] = useState<{ slot: number; multiplier: number } | null>(null)
  const ballIdRef = useRef(0)
  const particleIdRef = useRef(0)
  const pegHitIdRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // gravity
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0),
      )

      setPegHits((prev) => prev.filter((hit) => Date.now() - hit.timestamp < 300))
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const getMultipliers = (riskLevel: string, rowCount: number) => {
    const multiplierSets = {
      low: [1.5, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.5],
      medium: [5.6, 2.1, 1.1, 1, 0.5, 0.3, 0.5, 1, 1.1, 2.1, 5.6],
      high: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    }
    return multiplierSets[riskLevel as keyof typeof multiplierSets] || multiplierSets.medium
  }

  const multipliers = getMultipliers(risk, rows)

  const getSlotColor = (multiplier: number) => {
    if (multiplier >= 50) return "bg-red-500"
    if (multiplier >= 10) return "bg-orange-500"
    if (multiplier >= 3) return "bg-yellow-500"
    if (multiplier >= 1) return "bg-green-500"
    return "bg-blue-500"
  }

  const createParticles = (x: number, y: number, color: string, count = 8) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 30 + Math.random() * 20,
        color,
      })
    }
    setParticles((prev) => [...prev, ...newParticles])
  }

  const createPegHit = (x: number, y: number) => {
    setPegHits((prev) => [
      ...prev,
      {
        id: pegHitIdRef.current++,
        x,
        y,
        timestamp: Date.now(),
      },
    ])
    createParticles(x, y, "#60a5fa", 4)
  }

  const dropBall = async () => {
    if (betAmount > balance || betAmount < 1 || isDropping) return

    setIsDropping(true)
    setBalance((prev) => prev - betAmount)

    const newBallId = ballIdRef.current++
    const newBall: Ball = {
      id: newBallId,
      x: 50, // Start exactly in center
      y: 0,
      isActive: true,
      trail: [],
    }

    setBalls((prev) => [...prev, newBall])

    let currentX = newBall.x
    let currentY = 0
    let velocityX = 0
    const animationSteps = rows * 3 + 10
    const stepDelay = 80

    for (let step = 0; step < animationSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, stepDelay))

      const rowProgress = (currentY / 80) * rows // Adjusted for actual peg area
      const currentRow = Math.floor(rowProgress)

      const triangleWidth = (currentRow + 3) * 6 // Width increases with each row
      const triangleCenter = 50 // Center of triangle
      const leftBoundary = triangleCenter - triangleWidth / 2
      const rightBoundary = triangleCenter + triangleWidth / 2

      // Simulate peg collisions with more realistic physics
      if (currentRow < rows && step % 3 === 0) {
        const pegSpacing = triangleWidth / (currentRow + 3)
        const relativeX = currentX - leftBoundary
        const pegIndex = Math.round(relativeX / pegSpacing)
        const pegX = leftBoundary + pegIndex * pegSpacing

        if (Math.abs(currentX - pegX) < 2.5 && pegIndex >= 0 && pegIndex <= currentRow + 2) {
          // Peg hit! Create visual effect
          createPegHit(currentX, currentY)

          // Bounce off peg with realistic physics
          const bounceDirection = Math.random() < 0.5 ? -1 : 1
          velocityX += bounceDirection * (1.5 + Math.random() * 2)
          currentX += bounceDirection * (0.8 + Math.random() * 1.2)
        }
      }

      // Apply physics
      velocityX *= 0.92 // Air resistance
      currentX += velocityX + (Math.random() - 0.5) * 0.3
      currentY += (80 / animationSteps) * (1 + Math.random() * 0.2) // Adjusted for peg area height

      if (currentX < leftBoundary) {
        currentX = leftBoundary + 1
        velocityX = Math.abs(velocityX) * 0.7
      }
      if (currentX > rightBoundary) {
        currentX = rightBoundary - 1
        velocityX = -Math.abs(velocityX) * 0.7
      }

      setBalls((prev) =>
        prev.map((ball) =>
          ball.id === newBallId
            ? {
                ...ball,
                x: currentX,
                y: currentY,
                trail: [...ball.trail.slice(-8), { x: currentX, y: currentY }],
              }
            : ball,
        ),
      )
    }

    const finalTriangleWidth = (rows + 2) * 6
    const finalLeftBoundary = 50 - finalTriangleWidth / 2
    const finalRightBoundary = 50 + finalTriangleWidth / 2
    const relativePosition = (currentX - finalLeftBoundary) / finalTriangleWidth
    const slotIndex = Math.floor(relativePosition * multipliers.length)
    const finalSlot = Math.max(0, Math.min(multipliers.length - 1, slotIndex))
    const multiplier = multipliers[finalSlot]
    const winnings = Math.floor(betAmount * multiplier)

    // Create landing explosion
    const slotX = (finalSlot + 0.5) * (100 / multipliers.length)
    const explosionColor =
      multiplier >= 10 ? "#ef4444" : multiplier >= 3 ? "#f97316" : multiplier >= 1 ? "#22c55e" : "#3b82f6"
    createParticles(slotX, 95, explosionColor, multiplier >= 10 ? 20 : 12)

    // Win animation
    setWinAnimation({ slot: finalSlot, multiplier })
    setTimeout(() => setWinAnimation(null), 2000)

    // Add to history
    setGameHistory((prev) => [{ multiplier, winnings, timestamp: Date.now() }, ...prev.slice(0, 9)])

    // Update balance with animation
    setBalance((prev) => prev + winnings)

    // Remove ball after landing
    setTimeout(() => {
      setBalls((prev) => prev.filter((ball) => ball.id !== newBallId))
      setIsDropping(false)
    }, 1500)
  }

  const adjustBetAmount = (multiplier: number) => {
    setBetAmount((prev) => Math.max(1, Math.min(balance, Math.floor(prev * multiplier))))
  }

  const resetGame = () => {
    setBalance(1000)
    setGameHistory([])
    setBalls([])
    setParticles([])
    setPegHits([])
    setIsDropping(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-slate-800">
            <Link href="/games">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-bold text-xl text-white">Plinko</h1>
          <div className="text-right">
            <div className="text-lg font-bold text-green-400">₹{balance}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="p-4">
          <div className="bg-gradient-to-b from-blue-900 to-slate-900 rounded-2xl border border-slate-600 p-4 relative overflow-hidden" style={{ height: '400px' }}>
            {/* Ball trails */}
            {balls.map((ball) =>
              ball.trail.map((point, index) => (
                <div
                  key={`${ball.id}-trail-${index}`}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: (index / ball.trail.length) * 0.5,
                  }}
                />
              )),
            )}

            {/* Balls with glow effect */}
            {balls.map((ball) => (
              <div
                key={ball.id}
                className="absolute w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-75 z-10"
                style={{
                  left: `${ball.x}%`,
                  top: `${ball.y}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)",
                }}
              />
            ))}

            {/* Particles */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 rounded-full z-20"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                  opacity: particle.life / 50,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {/* Peg hit effects */}
            {pegHits.map((hit) => (
              <div
                key={hit.id}
                className="absolute w-6 h-6 border-2 border-blue-400 rounded-full animate-ping z-15"
                style={{
                  left: `${hit.x}%`,
                  top: `${hit.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {/* Triangular Peg Layout */}
            <div className="absolute inset-0 pt-6">
              {Array.from({ length: 12 }, (_, row) => {
                const pegsInRow = row + 1
                const rowSpacing = 25
                
                return (
                  <div
                    key={row}
                    className="absolute flex justify-center w-full"
                    style={{
                      top: `${10 + row * rowSpacing}px`,
                    }}
                  >
                    {Array.from({ length: pegsInRow }, (_, col) => {
                      const pegSpacing = 30
                      const offsetX = (pegsInRow - 1) * pegSpacing / 2
                      
                      return (
                        <div
                          key={col}
                          className="w-2 h-2 bg-white rounded-full"
                          style={{
                            position: 'absolute',
                            left: `calc(50% - ${offsetX}px + ${col * pegSpacing}px)`,
                            boxShadow: "0 0 6px rgba(255, 255, 255, 0.5)",
                          }}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* Multiplier Slots */}
            <div className="absolute bottom-0 left-0 right-0 flex">
              {[110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110].map((multiplier, index) => (
                <div
                  key={index}
                  className={`flex-1 h-10 flex items-center justify-center text-white font-bold text-xs border-r border-slate-600 relative transition-all duration-300 ${
                    multiplier >= 50 ? "bg-red-500" :
                    multiplier >= 10 ? "bg-orange-500" :
                    multiplier >= 3 ? "bg-yellow-500" :
                    multiplier >= 1 ? "bg-green-500" : "bg-blue-500"
                  } ${
                    winAnimation?.slot === index ? "animate-pulse scale-110 z-30" : ""
                  }`}
                  style={{
                    boxShadow: winAnimation?.slot === index ? "0 0 20px rgba(255, 255, 255, 0.8)" : "none",
                  }}
                >
                  <span className="text-xs">{multiplier}×</span>
                  {winAnimation?.slot === index && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold animate-bounce text-sm">
                      +₹{Math.floor(betAmount * multiplier)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {/* Risk & Rows */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Risk</label>
              <Select value={risk} onValueChange={setRisk}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Rows</label>
              <Select value="16" onValueChange={() => {}}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Bet Amount</label>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustBetAmount(0.5)}
                  disabled={isDropping}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  ½
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">₹{betAmount}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustBetAmount(2)}
                  disabled={isDropping}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  2×
                </Button>
              </div>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="bg-slate-700 border-slate-600 text-white text-center"
                disabled={isDropping}
              />
            </div>
          </div>

          {/* Drop Button */}
          <Button
            onClick={dropBall}
            disabled={betAmount > balance || betAmount < 1 || isDropping}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg rounded-xl"
          >
            {isDropping ? "DROPPING..." : "DROP"}
          </Button>
        </div>
      </div>
    </div>
  )
}
