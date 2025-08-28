"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, History, RotateCcw, X } from "lucide-react"

export function ColorPredictionGame() {
  const [balance, setBalance] = useState(2000)
  const [betAmount, setBetAmount] = useState(100)
  const [selectedBet, setSelectedBet] = useState<"green" | "violet" | "red" | number | null>(null)
  const [gameState, setGameState] = useState<"betting" | "result">("betting")
  const [result, setResult] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(6)
  const [currentPeriod] = useState(312089)

  const getNumberColor = (num: number) => {
    if (num === 0) return "red-violet"
    if (num === 5) return "green-violet"
    if ([1, 3, 7, 9].includes(num)) return "green"
    if ([2, 4, 6, 8].includes(num)) return "red"
    return "violet"
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            const gameResult = Math.floor(Math.random() * 10)
            setResult(gameResult)
            setGameState("result")
            
            let won = false
            if (typeof selectedBet === "number" && selectedBet === gameResult) {
              won = true
              setBalance(b => b + betAmount * 9)
            } else if (typeof selectedBet === "string") {
              const resultColor = getNumberColor(gameResult)
              if (
                (selectedBet === "green" && (resultColor === "green" || resultColor === "green-violet")) ||
                (selectedBet === "red" && (resultColor === "red" || resultColor === "red-violet")) ||
                (selectedBet === "violet" && resultColor.includes("violet"))
              ) {
                won = true
                const multiplier = selectedBet === "violet" ? 4.5 : 2.0
                setBalance(b => b + betAmount * multiplier)
              }
            }
            
            setTimeout(() => {
              setGameState("betting")
              setResult(null)
              setSelectedBet(null)
              return 6
            }, 3000)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown, selectedBet, betAmount])

  const placeBet = (bet: "green" | "violet" | "red" | number) => {
    if (gameState !== "betting" || betAmount > balance) return
    setSelectedBet(bet)
    setBalance(b => b - betAmount)
  }

  return (
    <div className="min-h-screen bg-black text-white p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-lg sm:text-xl font-bold text-center">Color Prediction</h1>
        <div></div>
      </div>

      <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
        {/* Period Display */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex space-x-1">
            <span className="bg-green-500 px-2 py-1 rounded text-xs">9</span>
            <span className="bg-red-500 px-2 py-1 rounded text-xs">8</span>
          </div>
        </div>

        {/* Result Display */}
        <div className={`rounded-lg p-6 sm:p-8 text-center relative ${
          result !== null 
            ? getNumberColor(result) === "green" 
              ? "bg-green-500" 
              : getNumberColor(result) === "red" 
                ? "bg-red-500" 
                : getNumberColor(result).includes("violet") 
                  ? "bg-gradient-to-br from-red-500 to-purple-500" 
                  : "bg-purple-500"
            : "bg-gray-700"
        }`}>
          {result !== null ? (
            <div className="text-4xl sm:text-6xl font-bold text-white">{result}</div>
          ) : (
            <div className="text-4xl sm:text-6xl font-bold text-white">?</div>
          )}
        </div>

        {/* Countdown */}
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-300 mb-2">Countdown</div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-2">
            {countdown}
          </div>
          <div className="flex justify-center space-x-4 text-xs">
            <div>
              <div className="text-gray-300">Min</div>
              <div>100</div>
            </div>
            <div>
              <div className="text-gray-300">Max</div>
              <div>2K</div>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <div className="text-center text-xs sm:text-sm text-gray-300">Colors</div>
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <Button
              onClick={() => placeBet("green")}
              disabled={gameState !== "betting"}
              className={`h-12 sm:h-16 bg-green-500 hover:bg-green-600 text-white font-bold text-sm sm:text-base ${
                selectedBet === "green" ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div>
                <div>Green</div>
                <div className="text-xs">x2.0 or x1.6</div>
              </div>
            </Button>
            <Button
              onClick={() => placeBet("violet")}
              disabled={gameState !== "betting"}
              className={`h-12 sm:h-16 bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm sm:text-base ${
                selectedBet === "violet" ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div>
                <div>Violet</div>
                <div className="text-xs">x4.5</div>
              </div>
            </Button>
            <Button
              onClick={() => placeBet("red")}
              disabled={gameState !== "betting"}
              className={`h-12 sm:h-16 bg-red-500 hover:bg-red-600 text-white font-bold text-sm sm:text-base ${
                selectedBet === "red" ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div>
                <div>Red</div>
                <div className="text-xs">x2.0 or x1.6</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Numbers */}
        <div className="space-y-2">
          <div className="text-center text-xs sm:text-sm text-gray-300">Numbers</div>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
              const colorClass = getNumberColor(num) === "green" ? "bg-green-500" :
                                getNumberColor(num) === "red" ? "bg-red-500" :
                                getNumberColor(num).includes("violet") ? "bg-gradient-to-br from-red-500 to-purple-500" :
                                "bg-purple-500"
              
              return (
                <Button
                  key={num}
                  onClick={() => placeBet(num)}
                  disabled={gameState !== "betting"}
                  className={`h-10 sm:h-12 ${colorClass} hover:opacity-80 text-white font-bold text-sm sm:text-base ${
                    selectedBet === num ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  {num}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-gray-900 rounded-lg p-3 sm:p-4 space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Balance: {balance}</span>
            <span>WIN: 0</span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <Button 
              onClick={() => {
                setSelectedBet(null)
                setCountdown(6)
                setGameState("betting")
                setResult(null)
              }}
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3"
            >
              Try Again
            </Button>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button 
                onClick={() => setBetAmount(Math.max(10, betAmount - 50))}
                size="sm" 
                className="bg-gray-600 hover:bg-gray-700 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
              >
                -
              </Button>
              <div className="bg-gray-800 px-2 sm:px-4 py-1 sm:py-2 rounded min-w-[60px] sm:min-w-[80px] text-center">
                <div className="text-xs text-gray-300">Bet</div>
                <div className="font-bold text-xs sm:text-sm">{betAmount}</div>
              </div>
              <Button 
                onClick={() => setBetAmount(betAmount + 50)}
                size="sm" 
                className="bg-gray-600 hover:bg-gray-700 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
              >
                +
              </Button>
            </div>
            
            <Button size="sm" className="bg-red-600 hover:bg-red-700 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 rounded-lg p-2 sm:p-3">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-xs text-center">
            <div>
              <div className="text-gray-400 text-xs">Period</div>
              <div className="text-xs sm:text-sm">{currentPeriod}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Result</div>
              <div className="text-xs sm:text-sm">{result ?? "?"}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Time</div>
              <div className="text-xs sm:text-sm">11:18</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Fairness</div>
              <div className="text-xs sm:text-sm">⚖️</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}