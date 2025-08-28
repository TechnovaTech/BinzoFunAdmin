"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function CockFightGame() {
  const [balance, setBalance] = useState(1000)
  const [betAmount, setBetAmount] = useState(100)
  const [selectedBet, setSelectedBet] = useState<"red" | "blue" | "tie" | null>(null)
  const [gameState, setGameState] = useState<"betting" | "fighting" | "result">("betting")
  const [winner, setWinner] = useState<"red" | "blue" | "tie" | null>(null)
  const [countdown, setCountdown] = useState(20)
  const [multiplier, setMultiplier] = useState(1.0)
  const [history, setHistory] = useState<string[]>(["R", "B", "R", "T", "B", "R", "B", "R"])

  const odds = {
    red: 1.95,
    blue: 1.95,
    tie: 8.0
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "betting" && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGameState("fighting")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    if (gameState === "fighting") {
      let progress = 0
      interval = setInterval(() => {
        progress += 1
        setMultiplier(1 + progress * 0.1)
        
        if (progress >= 30) {
          const random = Math.random()
          let result: "red" | "blue" | "tie"
          
          if (random < 0.45) result = "red"
          else if (random < 0.90) result = "blue" 
          else result = "tie"
          
          setWinner(result)
          setGameState("result")
          
          if (selectedBet === result) {
            const winnings = betAmount * odds[selectedBet]
            setBalance(b => b + winnings)
          }
          
          setHistory(prev => [result === "red" ? "R" : result === "blue" ? "B" : "T", ...prev.slice(0, 7)])
          
          setTimeout(() => {
            setGameState("betting")
            setCountdown(20)
            setSelectedBet(null)
            setWinner(null)
            setMultiplier(1.0)
          }, 5000)
        }
      }, 100)
    }

    return () => clearInterval(interval)
  }, [gameState, countdown, selectedBet, betAmount])

  const placeBet = (type: "red" | "blue" | "tie") => {
    if (gameState !== "betting" || betAmount > balance) return
    setSelectedBet(type)
    setBalance(b => b - betAmount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-black to-yellow-900 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-black/50 border-b border-yellow-600 gap-2 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-lg sm:text-2xl text-yellow-400">SUPER COCKFIGHT</h1>
        </div>
        <div className="text-yellow-400 font-bold text-lg sm:text-xl">₱{balance.toFixed(2)}</div>
      </div>

      {/* History Bar */}
      <div className="bg-black/70 p-2 sm:p-3 border-b border-yellow-600">
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <span className="text-yellow-400 font-bold text-xs sm:text-base">HISTORY:</span>
          {history.map((result, index) => (
            <div key={index} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
              result === "R" ? "bg-red-600" : result === "B" ? "bg-blue-600" : "bg-green-600"
            }`}>
              {result}
            </div>
          ))}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center py-3 sm:py-4 bg-black/50">
        {gameState === "betting" && (
          <div className="text-xl sm:text-3xl font-bold text-yellow-400">
            BETTING TIME: {countdown}s
          </div>
        )}
        {gameState === "fighting" && (
          <div className="text-xl sm:text-3xl font-bold text-red-400 animate-pulse">
            FIGHT! {multiplier.toFixed(1)}x
          </div>
        )}
        {gameState === "result" && (
          <div className="text-xl sm:text-3xl font-bold text-green-400">
            WINNER: {winner === "red" ? "RED" : winner === "blue" ? "BLUE" : "TIE"}!
          </div>
        )}
      </div>

      {/* Main Arena */}
      <div className="relative p-3 sm:p-6">
        <div className="bg-gradient-to-br from-yellow-800/30 to-red-800/30 rounded-xl border-2 sm:border-4 border-yellow-600 p-4 sm:p-8 relative overflow-hidden">
          {/* Arena Background */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-600/10 to-transparent"></div>
          
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-8 items-center">
            {/* Red Rooster */}
            <div className="text-center">
              <div className={`relative ${gameState === "fighting" ? "animate-bounce" : ""}`}>
                <div className="text-4xl sm:text-6xl lg:text-9xl filter drop-shadow-lg transform scale-x-[-1]">🐓</div>
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-16 h-2 sm:h-4 bg-red-600 rounded-full opacity-50"></div>
              </div>
              <div className="mt-2 sm:mt-4 bg-red-600/80 rounded-lg p-2 sm:p-4 border border-red-400 sm:border-2">
                <div className="text-sm sm:text-2xl font-bold text-white">RED</div>
                <div className="text-xs sm:text-lg text-red-200">{odds.red}x</div>
              </div>
            </div>

            {/* VS Circle */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 sm:border-4 border-yellow-300 mx-auto">
                <span className="text-lg sm:text-2xl lg:text-4xl font-bold text-black">VS</span>
              </div>
            </div>

            {/* Blue Rooster */}
            <div className="text-center">
              <div className={`relative ${gameState === "fighting" ? "animate-bounce" : ""}`}>
                <div className="text-4xl sm:text-6xl lg:text-9xl filter drop-shadow-lg">🐓</div>
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-16 h-2 sm:h-4 bg-blue-600 rounded-full opacity-50"></div>
              </div>
              <div className="mt-2 sm:mt-4 bg-blue-600/80 rounded-lg p-2 sm:p-4 border border-blue-400 sm:border-2">
                <div className="text-sm sm:text-2xl font-bold text-white">BLUE</div>
                <div className="text-xs sm:text-lg text-blue-200">{odds.blue}x</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Betting Options */}
      <div className="p-3 sm:p-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Button
            onClick={() => placeBet("red")}
            disabled={gameState !== "betting" || betAmount > balance}
            className={`h-16 sm:h-20 text-sm sm:text-xl font-bold transition-all ${
              selectedBet === "red" 
                ? "bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <div>
              <div>RED</div>
              <div className="text-xs sm:text-sm">{odds.red}x</div>
            </div>
          </Button>

          <Button
            onClick={() => placeBet("tie")}
            disabled={gameState !== "betting" || betAmount > balance}
            className={`h-16 sm:h-20 text-sm sm:text-xl font-bold transition-all ${
              selectedBet === "tie" 
                ? "bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400" 
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <div>
              <div>TIE</div>
              <div className="text-xs sm:text-sm">{odds.tie}x</div>
            </div>
          </Button>

          <Button
            onClick={() => placeBet("blue")}
            disabled={gameState !== "betting" || betAmount > balance}
            className={`h-16 sm:h-20 text-sm sm:text-xl font-bold transition-all ${
              selectedBet === "blue" 
                ? "bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <div>
              <div>BLUE</div>
              <div className="text-xs sm:text-sm">{odds.blue}x</div>
            </div>
          </Button>
        </div>

        {/* Bet Amount Controls */}
        <div className="bg-black/50 rounded-lg p-3 sm:p-4 border border-yellow-600">
          <div className="text-center mb-3 sm:mb-4">
            <div className="text-sm sm:text-lg font-bold text-yellow-400 mb-2">BET AMOUNT</div>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <Button 
                onClick={() => setBetAmount(Math.max(10, betAmount - 50))}
                className="bg-gray-700 hover:bg-gray-600 w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl"
                disabled={gameState !== "betting"}
              >
                -
              </Button>
              <div className="text-xl sm:text-3xl font-bold text-yellow-400 min-w-[80px] sm:min-w-[120px]">₱{betAmount}</div>
              <Button 
                onClick={() => setBetAmount(betAmount + 50)}
                className="bg-gray-700 hover:bg-gray-600 w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl"
                disabled={gameState !== "betting"}
              >
                +
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[50, 100, 250, 500].map(amount => (
              <Button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-xs sm:text-sm py-2"
                disabled={gameState !== "betting"}
              >
                ₱{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Bet */}
        {selectedBet && (
          <div className="mt-3 sm:mt-4 bg-yellow-600/20 border-2 border-yellow-600 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-sm sm:text-xl font-bold text-yellow-400">
              YOUR BET: {selectedBet.toUpperCase()} - ₱{betAmount}
            </div>
            <div className="text-sm sm:text-lg text-white">
              Potential Win: ₱{(betAmount * odds[selectedBet]).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}