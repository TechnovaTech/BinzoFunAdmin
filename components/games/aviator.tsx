"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export function AviatorGame() {
  const [balance, setBalance] = useState(3000)
  const [betAmount1, setBetAmount1] = useState(1.0)
  const [betAmount2, setBetAmount2] = useState(1.0)
  const [gameState, setGameState] = useState<"waiting" | "flying" | "crashed" | "flew_away">("waiting")
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0)
  const [crashPoint, setCrashPoint] = useState(0)
  const [hasBet1, setHasBet1] = useState(false)
  const [hasBet2, setHasBet2] = useState(false)
  const [cashedOut1, setCashedOut1] = useState(false)
  const [cashedOut2, setCashedOut2] = useState(false)
  const [planePosition, setPlanePosition] = useState({ x: 20, y: 85 })
  const [countdown, setCountdown] = useState(5)
  const [multiplierHistory, setMultiplierHistory] = useState([7.20, 1.19, 1.76, 1.87, 3.54, 1.31, 3.76, 1.07, 1.01, 1.16, 1.19, 1.26, 1.51, 1.18, 1.20, 18.74, 8.86, 3.49, 5.52, 2.59, 1.11, 17.1])
  const [bettingHistory] = useState([
    { player: "d***6", bet: 7.75, multiplier: null, win: null },
    { player: "d***6", bet: 3.87, multiplier: null, win: null }
  ])
  const intervalRef = useRef<NodeJS.Timeout>()
  const countdownRef = useRef<NodeJS.Timeout>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const startNewRound = () => {
    cleanup()
    setCountdown(5)
    setGameState("waiting")
    setCashedOut1(false)
    setCashedOut2(false)
    setCurrentMultiplier(1.0)
    setPlanePosition({ x: 20, y: 85 })
    
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          startFlight()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startFlight = () => {
    cleanup()
    const random = Math.random()
    const willFlyAway = random > 0.9
    let newCrashPoint = willFlyAway ? 50 + Math.random() * 100 :
                      random < 0.6 ? 1.01 + Math.random() * 1.5 :
                      random < 0.85 ? 2.5 + Math.random() * 5 :
                      7.5 + Math.random() * 42.5
    setCrashPoint(newCrashPoint)
    setGameState("flying")

    intervalRef.current = setInterval(() => {
      setCurrentMultiplier((prev) => {
        const next = prev + 0.02

        if (next >= newCrashPoint) {
          clearInterval(intervalRef.current!)
          const finalMultiplier = parseFloat(next.toFixed(2))
          if (willFlyAway) {
            setGameState("flew_away")
            // Fast fly away animation
            let flyProgress = 0
            const flyInterval = setInterval(() => {
              flyProgress += 0.1
              setPlanePosition({
                x: Math.min(120, 85 + flyProgress * 50),
                y: Math.max(-20, 15 - flyProgress * 40)
              })
              if (flyProgress >= 1) clearInterval(flyInterval)
            }, 30)
          } else {
            setGameState("crashed")
          }
          setMultiplierHistory(h => [finalMultiplier, ...h.slice(0, 21)])
          timeoutRef.current = setTimeout(() => {
            setHasBet1(false)
            setHasBet2(false)
            startNewRound()
          }, 2000)
          return next
        }

        setPlanePosition(() => {
          const progress = Math.min((next - 1.0) / 10, 1)
          return {
            x: Math.min(85, 20 + progress * 65),
            y: Math.max(15, 85 - progress * 70)
          }
        })

        return next
      })
    }, 80)
  }

  useEffect(() => {
    startNewRound()
    return cleanup
  }, [])

  const placeBet = (betNumber: 1 | 2) => {
    const amount = betNumber === 1 ? betAmount1 : betAmount2
    if (amount > balance || amount < 0.01 || gameState === "flying") return
    setBalance((prev) => prev - amount)
    if (betNumber === 1) {
      setHasBet1(true)
    } else {
      setHasBet2(true)
    }
  }

  const cashOut = (betNumber: 1 | 2) => {
    const hasBet = betNumber === 1 ? hasBet1 : hasBet2
    const cashedOut = betNumber === 1 ? cashedOut1 : cashedOut2
    const amount = betNumber === 1 ? betAmount1 : betAmount2

    if (!hasBet || cashedOut || gameState !== "flying") return

    const winnings = amount * currentMultiplier
    setBalance((prev) => prev + winnings)

    if (betNumber === 1) {
      setCashedOut1(true)
      setHasBet1(false)
    } else {
      setCashedOut2(true)
      setHasBet2(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-black/50 backdrop-blur-sm border-b border-gray-700 gap-3">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="font-bold text-xl sm:text-2xl text-white">Aviator</h1>
        </div>
        <div className="text-green-400 font-bold text-base sm:text-lg">{balance.toFixed(2)} USD</div>
      </div>

      {/* Top Bar with History */}
      <div className="bg-black/30 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <span className="text-gray-400 text-xs sm:text-sm">ROUND HISTORY</span>
            <div className="flex space-x-1 overflow-x-auto flex-1 sm:flex-none">
              {multiplierHistory.slice(0, 8).map((mult, index) => (
                <div
                  key={index}
                  className={`px-1.5 sm:px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                    mult < 2 ? "bg-red-500/20 text-red-400" : 
                    mult < 10 ? "bg-blue-500/20 text-blue-400" : 
                    "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {mult}x
                </div>
              ))}
            </div>
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">🎲 Provably Fair</div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col xl:flex-row">
        {/* Left Sidebar */}
        <div className="w-full xl:w-72 bg-black/40 backdrop-blur-sm border-b xl:border-b-0 xl:border-r border-gray-700">
          {/* Live Bets */}
          <div className="p-3 sm:p-4">
            <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-3">LIVE BETS</h3>
            <div className="space-y-2 max-h-48 xl:max-h-none overflow-y-auto xl:overflow-visible">
              {bettingHistory.map((bet, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
                      $
                    </div>
                    <span className="text-white text-xs sm:text-sm">{bet.player}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-xs sm:text-sm font-medium">{bet.bet}</div>
                    <div className="text-gray-400 text-xs">USD</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex-1 relative">
          <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-black" style={{ height: 'clamp(250px, 40vh, 600px)' }}>
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            {/* Flight Path */}
            {gameState === "flying" && (
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 5 95% Q ${planePosition.x * 0.8}% ${planePosition.y + 10}% ${planePosition.x}% ${planePosition.y}%`}
                  stroke="url(#pathGradient)"
                  strokeWidth="8"
                  fill="url(#pathGradient)"
                  fillOpacity="0.2"
                />
              </svg>
            )}

            {/* Multiplier Display */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4">
              <div
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-center drop-shadow-2xl transition-all duration-200 ${
                  gameState === "flying" ? "text-white" : 
                  gameState === "crashed" ? "text-red-400" : 
                  gameState === "flew_away" ? "text-green-400" : "text-gray-400"
                }`}
                style={{ fontFamily: 'monospace' }}
              >
                {currentMultiplier.toFixed(2)}x
              </div>
              {gameState === "flew_away" && (
                <div className="text-center text-green-400 text-sm sm:text-base md:text-lg font-bold mt-2 animate-pulse">
                  FLEW AWAY!
                </div>
              )}
            </div>

            {/* Airplane */}
            <div
              className={`absolute z-20 ${
                gameState === "flying" ? "transition-all duration-75" : 
                gameState === "flew_away" ? "" : "transition-all duration-100"
              }`}
              style={{
                left: `${planePosition.x}%`,
                top: `${planePosition.y}%`,
                transform: gameState === "crashed" ? "rotate(45deg) scale(1.3)" : 
                          gameState === "flew_away" ? "rotate(-30deg) scale(0.6)" : "rotate(-15deg)",
              }}
            >
              <svg width="60" height="30" viewBox="0 0 60 30" className="drop-shadow-2xl">
                {/* Plane Body */}
                <ellipse cx="30" cy="15" rx="25" ry="4" fill="#dc2626" />
                <ellipse cx="30" cy="15" rx="22" ry="3" fill="#ef4444" />
                
                {/* Wings */}
                <ellipse cx="25" cy="8" rx="12" ry="2" fill="#dc2626" transform="rotate(-10 25 8)" />
                <ellipse cx="25" cy="22" rx="12" ry="2" fill="#dc2626" transform="rotate(10 25 22)" />
                <ellipse cx="25" cy="8" rx="10" ry="1.5" fill="#ef4444" transform="rotate(-10 25 8)" />
                <ellipse cx="25" cy="22" rx="10" ry="1.5" fill="#ef4444" transform="rotate(10 25 22)" />
                
                {/* Tail */}
                <polygon points="50,10 55,12 55,18 50,20 48,15" fill="#dc2626" />
                <polygon points="50,11 54,12.5 54,17.5 50,19 49,15" fill="#ef4444" />
                
                {/* Cockpit */}
                <ellipse cx="15" cy="15" rx="8" ry="3" fill="#1e40af" opacity="0.8" />
                <ellipse cx="15" cy="15" rx="6" ry="2" fill="#3b82f6" opacity="0.6" />
                
                {/* Propeller */}
                {(gameState === "flying" || gameState === "flew_away") && (
                  <g>
                    <line x1="5" y1="15" x2="15" y2="15" stroke="#ffffff" strokeWidth="1" opacity="0.6">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 10 15;360 10 15"
                        dur={gameState === "flew_away" ? "0.05s" : "0.08s"}
                        repeatCount="indefinite"
                      />
                    </line>
                    <line x1="10" y1="10" x2="10" y2="20" stroke="#ffffff" strokeWidth="1" opacity="0.6">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 10 15;360 10 15"
                        dur={gameState === "flew_away" ? "0.05s" : "0.08s"}
                        repeatCount="indefinite"
                      />
                    </line>
                  </g>
                )}
                
                {/* Engine Glow */}
                <ellipse cx="8" cy="15" rx="3" ry="2" fill="#f97316" opacity="0.8">
                  <animate attributeName="rx" values="2;4;2" dur="0.3s" repeatCount="indefinite" />
                </ellipse>
              </svg>
            </div>

            {/* Crash Effect */}
            {gameState === "crashed" && (
              <div
                className="absolute z-30"
                style={{ left: `${Math.min(planePosition.x, 75)}%`, top: `${Math.max(Math.min(planePosition.y, 70), 15)}%` }}
              >
                <div className="relative">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"
                      style={{
                        left: `${Math.cos((i * 30) * Math.PI / 180) * 20}px`,
                        top: `${Math.sin((i * 30) * Math.PI / 180) * 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                  <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse opacity-75"></div>
                </div>
              </div>
            )}

            {/* Waiting State */}
            {gameState === "waiting" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 animate-pulse" style={{ fontFamily: 'monospace' }}>
                  {countdown}
                </div>
                <div className="text-white text-sm sm:text-base md:text-lg">
                  Next round starts in...
                </div>
              </div>
            )}

            {/* Flew Away Effect */}
            {gameState === "flew_away" && (
              <div className="absolute top-20 right-10 z-30">
                <div className="text-green-400 text-xl font-bold animate-bounce">
                  ✈️ FLEW AWAY!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4">
          {/* Bet Panel 1 */}
          <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                <span className="text-white font-medium text-xs sm:text-base">BET 1</span>
              </div>
              <div className="text-gray-400 text-xs">Auto: OFF</div>
            </div>
            
            <div className="bg-gray-900/50 rounded p-2 sm:p-3 mb-2 sm:mb-4">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <button 
                  onClick={() => setBetAmount1(Math.max(0.01, betAmount1 - 0.1))}
                  disabled={hasBet1}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 font-bold text-xs sm:text-base"
                >
                  -
                </button>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-white">{betAmount1.toFixed(2)}</div>
                  <div className="text-gray-400 text-xs">USD</div>
                </div>
                <button 
                  onClick={() => setBetAmount1(betAmount1 + 0.1)}
                  disabled={hasBet1}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 font-bold text-xs sm:text-base"
                >
                  +
                </button>
              </div>
              
              <div className="flex justify-center space-x-1">
                {[1, 2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount1(amount)}
                    disabled={hasBet1}
                    className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {!hasBet1 ? (
              <button
                onClick={() => placeBet(1)}
                disabled={betAmount1 > balance}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 sm:py-3 rounded transition-all text-xs sm:text-base"
              >
                BET {betAmount1.toFixed(2)} USD
              </button>
            ) : cashedOut1 ? (
              <button
                disabled
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 sm:py-3 rounded text-xs sm:text-base"
              >
                CASHED OUT {(betAmount1 * currentMultiplier).toFixed(2)} USD
              </button>
            ) : (
              <button
                onClick={() => cashOut(1)}
                disabled={gameState !== "flying"}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 sm:py-3 rounded transition-all text-xs sm:text-base animate-pulse"
              >
                CASH OUT {(betAmount1 * currentMultiplier).toFixed(2)} USD
              </button>
            )}
          </div>

          {/* Bet Panel 2 */}
          <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                <span className="text-white font-medium text-xs sm:text-base">BET 2</span>
              </div>
              <div className="text-gray-400 text-xs">Auto: OFF</div>
            </div>
            
            <div className="bg-gray-900/50 rounded p-2 sm:p-3 mb-2 sm:mb-4">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <button 
                  onClick={() => setBetAmount2(Math.max(0.01, betAmount2 - 0.1))}
                  disabled={hasBet2}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 font-bold text-xs sm:text-base"
                >
                  -
                </button>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-white">{betAmount2.toFixed(2)}</div>
                  <div className="text-gray-400 text-xs">USD</div>
                </div>
                <button 
                  onClick={() => setBetAmount2(betAmount2 + 0.1)}
                  disabled={hasBet2}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 font-bold text-xs sm:text-base"
                >
                  +
                </button>
              </div>
              
              <div className="flex justify-center space-x-1">
                {[1, 2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount2(amount)}
                    disabled={hasBet2}
                    className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {!hasBet2 ? (
              <button
                onClick={() => placeBet(2)}
                disabled={betAmount2 > balance}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 sm:py-3 rounded transition-all text-xs sm:text-base"
              >
                BET {betAmount2.toFixed(2)} USD
              </button>
            ) : cashedOut2 ? (
              <button
                disabled
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 sm:py-3 rounded text-xs sm:text-base"
              >
                CASHED OUT {(betAmount2 * currentMultiplier).toFixed(2)} USD
              </button>
            ) : (
              <button
                onClick={() => cashOut(2)}
                disabled={gameState !== "flying"}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 sm:py-3 rounded transition-all text-xs sm:text-base animate-pulse"
              >
                CASH OUT {(betAmount2 * currentMultiplier).toFixed(2)} USD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}