"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

interface GameRound {
  betAmount: number
  multiplier: number
  result: "win" | "loss"
  timestamp: number
}

export function BalloonsGame() {
  const [betAmount, setBetAmount] = useState(10)
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0)
  const [targetMultiplier, setTargetMultiplier] = useState<number | null>(null)
  const [balloonSize, setBalloonSize] = useState(120)
  const [balloonPosition, setBalloonPosition] = useState(15) // percentage from bottom - much lower
  const [gameActive, setGameActive] = useState(false)
  const [gameMode, setGameMode] = useState<"manual" | "auto">("manual")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("hard")
  const [balance, setBalance] = useState(1000)
  const [gameHistory, setGameHistory] = useState<GameRound[]>([])
  const [balloonPopped, setBalloonPopped] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null)
  const [pumpCount, setPumpCount] = useState(0)
  const [popChance, setPopChance] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isLandscape, setIsLandscape] = useState(false)

  const difficultySettings = {
    easy: { basePopChance: 0.02, popIncrease: 0.03, maxMultiplier: 5.0 },
    medium: { basePopChance: 0.03, popIncrease: 0.05, maxMultiplier: 10.0 },
    hard: { basePopChance: 0.05, popIncrease: 0.08, maxMultiplier: 20.0 },
  }

  const quickMultipliers = [1.0, 1.23, 1.55, 1.98, 2.56, 3.36, 4.48]

  // Mobile detection and orientation handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsLandscape(window.innerWidth > window.innerHeight && window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Haptic feedback for mobile
  const hapticFeedback = useCallback(() => {
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }, [isMobile])

  // Sound effects
  const playSound = useCallback((type: 'pump' | 'pop' | 'win' | 'cashout') => {
    if (!soundEnabled) return
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    switch (type) {
      case 'pump':
        oscillator.frequency.setValueAtTime(400 + pumpCount * 50, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.1)
        break
      case 'pop':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
        break
      case 'win':
      case 'cashout':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
        break
    }
  }, [soundEnabled, pumpCount])

  const calculateMultiplier = (pumps: number) => {
    return 1.0 + pumps * 0.15 + pumps * pumps * 0.02
  }

  useEffect(() => {
    if (gameActive && targetMultiplier && currentMultiplier >= targetMultiplier) {
      console.log("[v0] Auto cash-out triggered at target multiplier:", targetMultiplier)
      cashOut()
    }
  }, [currentMultiplier, targetMultiplier, gameActive])

  const selectTargetMultiplier = (multiplier: number) => {
    if (gameActive) return

    setTargetMultiplier(multiplier)
    const adjustedBet = Math.max(10, Math.floor(betAmount * (multiplier / 2)))
    setBetAmount(Math.min(adjustedBet, balance))
    console.log("[v0] Selected target multiplier:", multiplier, "Adjusted bet to:", adjustedBet)
  }

  const startGame = () => {
    console.log("[v0] Starting game with bet:", betAmount, "Balance:", balance, "Target multiplier:", targetMultiplier)

    if (balance < betAmount || betAmount <= 0) {
      console.log("[v0] Cannot start game - insufficient balance or invalid bet")
      return
    }

    setGameActive(true)
    setBalloonPopped(false)
    setCurrentMultiplier(1.0)
    setBalloonSize(120)
    setBalloonPosition(15) // Move up only 1% per pump, start at 15%
    setGameResult(null)
    setPumpCount(0)
    setPopChance(difficultySettings[difficulty].basePopChance)
    setBalance((prev) => prev - betAmount)

    console.log("[v0] Game started! Initial pop chance:", difficultySettings[difficulty].basePopChance)
  }

  const pump = () => {
    if (!gameActive || balloonPopped) return

    const settings = difficultySettings[difficulty]
    const currentPopChance = popChance

    hapticFeedback()
    
    console.log("[v0] Pumping... Current pop chance:", currentPopChance.toFixed(3))

    if (Math.random() < currentPopChance) {
      console.log("[v0] Balloon popped!")
      popBalloon()
      return
    }

    const newPumpCount = pumpCount + 1
    const newMultiplier = calculateMultiplier(newPumpCount)
    const newPopChance = settings.basePopChance + newPumpCount * settings.popIncrease

    playSound('pump')
    setPumpCount(newPumpCount)
    setCurrentMultiplier(newMultiplier)
    setPopChance(newPopChance)
    setBalloonSize(120 + newPumpCount * 15)
    setBalloonPosition(15 + newPumpCount * 1) // Move up only 1% per pump, start at 15%

    console.log(
      "[v0] Successful pump!",
      "Count:",
      newPumpCount,
      "Multiplier:",
      newMultiplier.toFixed(2),
      "New pop chance:",
      newPopChance.toFixed(3),
      "Position:",
      (15 + newPumpCount * 1).toFixed(1) + "%",
    )
  }

  const popBalloon = () => {
    console.log("[v0] Balloon popped! Multiplier was:", currentMultiplier)
    playSound('pop')
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }
    setBalloonPopped(true)
    setGameActive(false)
    setGameResult("loss")
    setTargetMultiplier(null)

    const round: GameRound = {
      betAmount,
      multiplier: currentMultiplier,
      result: "loss",
      timestamp: Date.now(),
    }
    setGameHistory((prev) => [round, ...prev.slice(0, 9)])
  }

  const cashOut = () => {
    if (balloonPopped || !gameActive) return

    const winAmount = betAmount * currentMultiplier
    console.log("[v0] Cashed out! Won:", winAmount, "Multiplier:", currentMultiplier)
    playSound('cashout')
    hapticFeedback()
    setBalance((prev) => prev + winAmount)
    setGameActive(false)
    setGameResult("win")
    setTargetMultiplier(null)

    const round: GameRound = {
      betAmount,
      multiplier: currentMultiplier,
      result: "win",
      timestamp: Date.now(),
    }
    setGameHistory((prev) => [round, ...prev.slice(0, 9)])
  }

  const adjustBetAmount = (multiplier: number) => {
    setBetAmount((prev) => Math.max(1, prev * multiplier))
  }

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setBetAmount(Math.max(1, value))
  }

  const setQuickBet = (amount: number) => {
    setBetAmount(amount)
  }

  return (
    <div className={`min-h-screen bg-slate-900 text-white relative overflow-hidden ${isMobile ? 'touch-manipulation' : ''}`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-800"></div>
      </div>

      <div className="relative z-10 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-6 gap-2 sm:gap-0">
          <Button asChild variant="ghost" size="sm" className="hover:bg-slate-700 text-white w-full sm:w-auto touch-manipulation">
            <Link href="/games">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isMobile ? 'Back' : 'Back to Games'}
            </Link>
          </Button>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <Badge variant="outline" className="px-2 sm:px-3 py-1 border-green-500/30 text-green-400 text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />${balance.toFixed(2)}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-white text-xs sm:text-sm touch-manipulation"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs sm:text-sm hidden sm:block">
              Fairness
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className={`${isLandscape ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6'}`}>
            <div className={`${isLandscape ? 'order-1' : 'lg:col-span-1 order-2 lg:order-1'}`}>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className={`${isMobile ? 'p-3 space-y-3' : 'p-4 sm:p-6 space-y-4 sm:space-y-6'}`}>
                  <div className="flex space-x-2">
                    <Button
                      variant={gameMode === "manual" ? "default" : "outline"}
                      size={isMobile ? "sm" : "default"}
                      onClick={() => setGameMode("manual")}
                      className={`flex-1 text-xs sm:text-sm touch-manipulation ${gameMode === "manual" ? "bg-slate-600 text-white" : "bg-slate-700 text-slate-300 hover:text-white active:text-white border-slate-600 transition-colors"}`}
                    >
                      Manual
                    </Button>
                    <Button
                      variant={gameMode === "auto" ? "default" : "outline"}
                      size={isMobile ? "sm" : "default"}
                      onClick={() => setGameMode("auto")}
                      className={`flex-1 text-xs sm:text-sm touch-manipulation ${gameMode === "auto" ? "bg-slate-600 text-white" : "bg-slate-700 text-slate-300 hover:text-white active:text-white border-slate-600 transition-colors"}`}
                    >
                      Auto
                    </Button>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 mb-2 block">Bet Amount</label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={handleBetAmountChange}
                      step="1"
                      min="1"
                      className={`w-full bg-slate-700 border border-slate-600 rounded px-3 text-center font-mono text-white focus:outline-none focus:border-slate-500 touch-manipulation ${isMobile ? 'py-3 text-lg' : 'py-2 sm:py-3 text-base sm:text-lg'}`}
                      placeholder="10"
                      disabled={gameActive}
                    />
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size={isMobile ? "default" : "sm"}
                        variant="outline"
                        onClick={() => adjustBetAmount(0.5)}
                        className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:text-white active:text-white transition-colors text-xs sm:text-sm touch-manipulation"
                        disabled={gameActive}
                      >
                        ½
                      </Button>
                      <Button
                        size={isMobile ? "default" : "sm"}
                        variant="outline"
                        onClick={() => adjustBetAmount(2)}
                        className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:text-white active:text-white transition-colors text-xs sm:text-sm touch-manipulation"
                        disabled={gameActive}
                      >
                        2×
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button
                        size={isMobile ? "default" : "sm"}
                        variant="outline"
                        onClick={() => setQuickBet(10)}
                        className="bg-slate-700 border-slate-600 text-slate-300 hover:text-white active:text-white transition-colors text-xs touch-manipulation"
                        disabled={gameActive}
                      >
                        $10
                      </Button>
                      <Button
                        size={isMobile ? "default" : "sm"}
                        variant="outline"
                        onClick={() => setQuickBet(50)}
                        className="bg-slate-700 border-slate-600 text-slate-300 hover:text-white active:text-white transition-colors text-xs touch-manipulation"
                        disabled={gameActive}
                      >
                        $50
                      </Button>
                      <Button
                        size={isMobile ? "default" : "sm"}
                        variant="outline"
                        onClick={() => setQuickBet(100)}
                        className="bg-slate-700 border-slate-600 text-slate-300 hover:text-white active:text-white transition-colors text-xs touch-manipulation"
                        disabled={gameActive}
                      >
                        $100
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 mb-2 block">Difficulty</label>
                    <Select
                      value={difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}
                    >
                      <SelectTrigger className={`bg-slate-700 border-slate-600 text-white touch-manipulation ${isMobile ? 'py-3' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm text-slate-400 mb-3">
                      Pump
                      {targetMultiplier && (
                        <span className="ml-2 text-green-400 font-mono text-xs sm:text-sm">Target: {targetMultiplier.toFixed(2)}x</span>
                      )}
                    </div>
                    {!gameActive ? (
                      <Button
                        onClick={startGame}
                        className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold touch-manipulation ${isMobile ? 'py-4 text-lg' : 'py-2 sm:py-3 text-sm sm:text-lg'}`}
                        disabled={balance < betAmount || betAmount <= 0}
                      >
                        Bet ${betAmount.toFixed(0)}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={pump}
                          className={`w-full font-semibold touch-manipulation ${isMobile ? 'py-4 text-base' : 'py-2 sm:py-3 text-sm sm:text-base'} ${
                            balloonPosition >= 90
                              ? "bg-red-600 hover:bg-red-700 animate-pulse"
                              : popChance > 0.3
                                ? "bg-red-600 hover:bg-red-700 animate-pulse"
                                : popChance > 0.15
                                  ? "bg-orange-600 hover:bg-orange-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          disabled={balloonPopped}
                        >
                          <span className="hidden sm:inline">
                            {balloonPopped
                              ? "💥 POPPED"
                              : balloonPosition >= 90
                                ? "🚨 CRITICAL - Pump"
                                : popChance > 0.3
                                  ? "⚠️ HIGH RISK - Pump"
                                  : popChance > 0.15
                                    ? "🔶 MEDIUM RISK - Pump"
                                    : "🔵 Pump"}
                          </span>
                          <span className="sm:hidden">
                            {balloonPopped
                              ? "💥 POPPED"
                              : balloonPosition >= 90
                                ? "🚨 Pump"
                                : popChance > 0.3
                                  ? "⚠️ Pump"
                                  : popChance > 0.15
                                    ? "🔶 Pump"
                                    : "🔵 Pump"}
                          </span>
                        </Button>
                        <Button
                          onClick={cashOut}
                          className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold touch-manipulation ${isMobile ? 'py-3 text-base' : 'py-2 text-sm sm:text-base'}`}
                          disabled={balloonPopped || pumpCount === 0}
                        >
                          <span className="hidden sm:inline">Cash Out ${(betAmount * currentMultiplier).toFixed(2)}</span>
                          <span className="sm:hidden">${(betAmount * currentMultiplier).toFixed(0)}</span>
                        </Button>
                      </div>
                    )}
                    {gameActive && (
                      <div className="mt-2 text-center text-xs sm:text-sm text-slate-400">
                        <div className="sm:hidden">
                          <div>Pumps: {pumpCount} | Risk: {(popChance * 100).toFixed(1)}%</div>
                          <div>Height: {balloonPosition.toFixed(0)}%</div>
                        </div>
                        <div className="hidden sm:block">
                          Pumps: {pumpCount} | Pop Risk: {(popChance * 100).toFixed(1)}% | Height: {balloonPosition.toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={`${isLandscape ? 'order-2' : 'lg:col-span-3 order-1 lg:order-2'}`}>
              <div className={`flex justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 ${isMobile ? 'mb-3' : 'mb-4 sm:mb-6'}`}>
                {quickMultipliers.map((mult) => (
                  <Button
                    key={mult}
                    variant="outline"
                    size={isMobile ? "default" : "sm"}
                    onClick={() => selectTargetMultiplier(mult)}
                    disabled={gameActive}
                    className={`font-mono whitespace-nowrap transition-all cursor-pointer touch-manipulation ${isMobile ? 'px-3 py-2 text-sm min-w-[60px]' : 'px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm'} ${
                      targetMultiplier === mult
                        ? "bg-green-600 text-white border-green-500 shadow-lg"
                        : currentMultiplier >= mult
                          ? "bg-slate-600 text-white border-slate-500"
                          : "bg-slate-700 text-slate-300 border-slate-600 hover:text-white active:text-white"
                    }`}
                  >
                    {mult.toFixed(2)}x
                  </Button>
                ))}
              </div>

              {!gameActive && (
                <div className={`text-center text-slate-400 text-xs sm:text-sm ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <span className="hidden sm:inline">Click a multiplier above to set your target cash-out point</span>
                  <span className="sm:hidden">Tap multiplier to set target</span>
                </div>
              )}

              <div className={`relative bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden ${isLandscape ? 'h-48' : isMobile ? 'h-72' : 'h-64 sm:h-80 lg:h-96'}`}>
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div
                    className="relative transition-all duration-500 ease-out"
                    style={{
                      transform: `translateY(-${balloonPosition + 10}%)`,
                    }}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 flex items-center justify-center text-white font-bold shadow-2xl select-none ${
                        balloonPopped ? "bg-red-500 animate-bounce" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(balloonSize, isMobile ? window.innerWidth * 0.4 : window.innerWidth * 0.3)}px`,
                        height: `${Math.min(balloonSize * 1.2, isMobile ? window.innerWidth * 0.48 : window.innerWidth * 0.36)}px`,
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                        fontSize: `${Math.min(balloonSize / 5, isMobile ? 18 : window.innerWidth < 640 ? 16 : 24)}px`,
                        boxShadow: balloonPopped
                          ? "0 0 30px rgba(239, 68, 68, 0.8)"
                          : "0 0 20px rgba(239, 68, 68, 0.6)",
                      }}
                    >
                      {balloonPopped ? "💥" : `${currentMultiplier.toFixed(2)}x`}
                    </div>
                    <div className={`absolute top-full left-1/2 bg-slate-600 transform -translate-x-1/2 ${isMobile ? 'w-1 h-8' : 'w-0.5 h-12'}`} />
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 ${isMobile ? 'translate-y-6' : 'translate-y-10'}`}>
                      <div className={`bg-slate-700 rounded-lg border border-slate-600 ${isMobile ? 'w-8 h-4' : 'w-12 h-6'}`}></div>
                      <div className={`bg-slate-600 rounded-full mx-auto -mt-1 ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
                    </div>
                  </div>

                  {gameResult && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
                        gameResult === "win" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      <div className="text-center text-white px-4">
                        <div
                          className={`font-bold mb-2 sm:mb-4 ${isMobile ? 'text-xl' : 'text-2xl sm:text-4xl'} ${
                            gameResult === "win" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {gameResult === "win" ? "🎉 WIN!" : "💥 POPPED!"}
                        </div>
                        <div className={`${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
                          {gameResult === "win"
                            ? `Won $${(betAmount * currentMultiplier).toFixed(2)}`
                            : `Lost $${betAmount.toFixed(0)}`}
                        </div>
                        <div className={`text-slate-300 mt-1 sm:mt-2 ${isMobile ? 'text-sm' : 'text-sm sm:text-lg'}`}>Multiplier: {currentMultiplier.toFixed(2)}x</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
