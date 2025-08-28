"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, GameCard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Gamepad2,
  Play,
  Star,
  Search,
  Filter,
  Clock,
  Target,
  Plane,
  Zap,
  Bomb,
  BombIcon as Balloon,
  Mountain,
  Dice6,
  Rocket,
  TrendingUp,
  Truck,
} from "lucide-react"

export default function GamesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const allGames = [
    {
      id: "ludo",
      name: "Ludo",
      description: "Offline 4-player bot version classic board game",
      players: "1-4 Players",
      rating: 4.8,
      icon: Gamepad2,
      category: "Board Game",
      difficulty: "Easy",
      playTime: "15-30 min",
      isPopular: false,
      thumbnail: "/ludo.jpeg",
    },
    {
      id: "aviator",
      name: "Aviator",
      description: "Basic curve game animation with crash mechanics",
      players: "Solo",
      rating: 4.9,
      icon: Plane,
      category: "Crash Game",
      difficulty: "Medium",
      playTime: "2-5 min",
      isPopular: false,
      thumbnail: "/aviator.png",
    },
    {
      id: "chicken-road",
      name: "Chicken Road",
      description: "Mini-runner style game with obstacles",
      players: "Solo",
      rating: 4.6,
      icon: Mountain,
      category: "Runner",
      difficulty: "Medium",
      playTime: "3-8 min",
      isPopular: false,
      thumbnail: "/chickenroad.jpeg",
    },
    {
      id: "color-prediction",
      name: "Color Prediction",
      description: "2-color betting logic prediction game",
      players: "Solo",
      rating: 4.7,
      icon: Target,
      category: "Prediction",
      difficulty: "Easy",
      playTime: "1-2 min",
      isPopular: false,
      thumbnail: "/colorpridiction.webp",
    },
    {
      id: "plinko",
      name: "Plinko",
      description: "Ball drop with slot win mechanics",
      players: "Solo",
      rating: 4.6,
      icon: Zap,
      category: "Arcade",
      difficulty: "Easy",
      playTime: "3-5 min",
      isPopular: false,
      thumbnail: "/plinko.jpeg",
    },
    {
      id: "mines",
      name: "Mines",
      description: "Bomb-avoidance grid strategy game",
      players: "Solo",
      rating: 4.8,
      icon: Bomb,
      category: "Strategy",
      difficulty: "Hard",
      playTime: "5-10 min",
      isPopular: false,
      thumbnail: "/mines.jpeg",
    },

    {
      id: "balloons",
      name: "Balloons",
      description: "Tap to pop-style balloon game",
      players: "Solo",
      rating: 4.5,
      icon: Balloon,
      category: "Arcade",
      difficulty: "Easy",
      playTime: "2-4 min",
      isPopular: false,
      thumbnail: "/balloon.png"
    },
    {
      id: "cock-fight",
      name: "Cock Fight",
      description: "Auto-battle logic fighting game",
      players: "Solo",
      rating: 4.4,
      icon: Zap,
      category: "Battle",
      difficulty: "Medium",
      playTime: "3-7 min",
      isPopular: false,
      thumbnail: "/cockfight.webp",
    },
    {
      id: "dice",
      name: "Dice",
      description: "Random roll with points scoring system",
      players: "Solo",
      rating: 4.3,
      icon: Dice6,
      category: "Luck",
      difficulty: "Easy",
      playTime: "1-2 min",
      isPopular: false,
      thumbnail: "/Dice.jpeg",
    },
    {
      id: "jet-x",
      name: "Jet-X",
      description: " DEMO: Watch the jet soar and cash out before it crashes! Real-time multipliers up to 100x",
      players: "Solo",
      rating: 4.9,
      icon: Rocket,
      category: "Crash Game",
      difficulty: "Medium",
      playTime: "1-3 min",
      isPopular: false,
      isDemoMode: false,
      thumbnail: "/jetx.jpeg",
    },
    {
      id: "pushpa",
      name: "Pushpa",
      description: "Truck-themed crash game with multiplier betting",
      players: "Solo",
      rating: 4.7,
      icon: Truck,
      category: "Crash Game",
      difficulty: "Medium",
      playTime: "2-5 min",
      isPopular: false,
      thumbnail: "/pushpa.jpg",
    },
  ]

  const categories = ["all", "Board Game", "Crash Game", "Runner", "Prediction", "Arcade", "Strategy", "Battle", "Luck"]
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const filteredGames = allGames.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || game.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const popularGames = allGames.filter((game) => game.isPopular)
  const recentlyPlayed = allGames.slice(0, 3)

  const userStats = {
    gamesPlayed: 23,
    totalWins: 15,
    winRate: 65,
    favoriteGame: "Aviator",
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="font-work-sans font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Game Dashboard</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {user ? `Welcome back, ${user.username}!` : "Choose your next gaming adventure"}
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                11 Games Available
              </Badge>
            </div>
          </div>
        </div>

        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="glass">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-work-sans font-bold text-primary mb-1">{userStats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-work-sans font-bold text-primary mb-1">{userStats.totalWins}</div>
                <div className="text-xs text-muted-foreground">Total Wins</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-work-sans font-bold text-primary mb-1">{userStats.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-sm font-work-sans font-bold text-primary mb-1">{userStats.favoriteGame}</div>
                <div className="text-xs text-muted-foreground">Favorite Game</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input/50 w-full"
              suppressHydrationWarning
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40 bg-input/50" suppressHydrationWarning>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-32 bg-input/50" suppressHydrationWarning>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="glass">
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-work-sans font-semibold text-lg sm:text-xl">
              {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all"
                ? `Games (${filteredGames.length})`
                : "All Games"}
            </h2>
          </div>

          {filteredGames.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-6 sm:p-8 text-center">
                <Gamepad2 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-work-sans font-semibold text-base sm:text-lg mb-2">No games found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {filteredGames.map((game) => {
                const Icon = game.icon
                const difficultyColor = {
                  Easy: "text-green-500",
                  Medium: "text-yellow-500",
                  Hard: "text-red-500",
                }[game.difficulty]

                return (
                  <GameCard key={game.id}>
                    <div className="relative">
                      <img
                        src={game.thumbnail || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-24 sm:h-32 md:h-36 object-cover rounded-t-lg"
                      />
                      {game.isPopular && (
                        <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-primary/90 text-xs">Popular</Badge>
                      )}
                      {game.isDemoMode && (
                        <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-green-500/90 text-xs animate-pulse">DEMO</Badge>
                      )}
                    </div>
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-1 min-w-0 flex-1">
                          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <h3 className="font-work-sans font-semibold text-xs sm:text-sm truncate">{game.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{game.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2 hidden sm:block">{game.description}</p>

                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs px-1 sm:px-2 truncate">
                          {game.category}
                        </Badge>
                        <span className={`text-xs font-medium ${difficultyColor}`}>{game.difficulty}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-2 w-2 sm:h-3 sm:w-3 inline mr-1" />
                          <span className="hidden sm:inline">{game.playTime}</span>
                          <span className="sm:hidden">{game.playTime.split(' ')[0]}</span>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="h-6 sm:h-7 px-1 sm:px-2">
                          <Link href={`/games/${game.id}`}>
                            <Play className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </GameCard>
                )
              })}
            </div>
          )}
        </div>

        {user && searchQuery === "" && selectedCategory === "all" && selectedDifficulty === "all" && (
          <div>
            <div className="flex items-center mb-4">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
              <h2 className="font-work-sans font-semibold text-lg sm:text-xl">Recently Played</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {recentlyPlayed.map((game) => {
                const Icon = game.icon
                return (
                  <Card key={game.id} className="glass glass-hover">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-work-sans font-semibold text-sm truncate">{game.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{game.category}</p>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="flex-shrink-0">
                          <Link href={`/games/${game.id}`}>
                            <Play className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}