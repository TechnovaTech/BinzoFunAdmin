"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export default function HomePage() {
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
      isPopular: true,
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
      isPopular: true,
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
      isPopular: true,
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
      description: "🚀 DEMO: Watch the jet soar and cash out before it crashes! Real-time multipliers up to 100x",
      players: "Solo",
      rating: 4.9,
      icon: Rocket,
      category: "Crash Game",
      difficulty: "Medium",
      playTime: "1-3 min",
      isPopular: true,
      isDemoMode: true,
      thumbnail:"/jetx.jpeg",
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-work-sans font-bold text-3xl md:text-4xl mb-2">Game Dashboard</h1>
              <p className="text-muted-foreground">
                {user ? `Welcome back, ${user.username}!` : "Choose your next gaming adventure"}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                11 Games Available
              </Badge>
            </div>
          </div>
        </div>

        {/* User Stats */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-work-sans font-bold text-primary mb-1">{userStats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-work-sans font-bold text-primary mb-1">{userStats.totalWins}</div>
                <div className="text-xs text-muted-foreground">Total Wins</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-work-sans font-bold text-primary mb-1">{userStats.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-sm font-work-sans font-bold text-primary mb-1">{userStats.favoriteGame}</div>
                <div className="text-xs text-muted-foreground">Favorite Game</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input/50"
              suppressHydrationWarning
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-input/50" suppressHydrationWarning>
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
              <SelectTrigger className="w-32 bg-input/50" suppressHydrationWarning>
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

        {/* Popular Games Section */}
        {searchQuery === "" && selectedCategory === "all" && selectedDifficulty === "all" && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <h2 className="font-work-sans font-semibold text-xl">Popular Games</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularGames.map((game) => {
                const Icon = game.icon
                return (
                  <Card key={game.id} className="glass glass-hover group">
                    <div className="relative">
                      <img
                        src={game.thumbnail || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary/90">Popular</Badge>
                      {game.isDemoMode && (
                        <Badge className="absolute top-2 left-2 bg-green-500/90 text-xs animate-pulse">DEMO</Badge>
                      )}    
                    </div>
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between mb-3 p-4 pb-0">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-work-sans font-semibold">{game.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{game.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 px-4">{game.description}</p>
                      <div className="flex items-center justify-between p-4 pt-0">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {game.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{game.playTime}</span>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/games/${game.id}`}>
                            <Play className="h-3 w-3 mr-1" />
                            Play
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

        {/* All Games Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-work-sans font-semibold text-xl">
              {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all"
                ? `Games (${filteredGames.length})`
                : "All Games"}
            </h2>
          </div>

          {filteredGames.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-work-sans font-semibold text-lg mb-2">No games found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => {
                const Icon = game.icon
                const difficultyColor = {
                  Easy: "text-green-500",
                  Medium: "text-yellow-500",
                  Hard: "text-red-500",
                }[game.difficulty]

                return (
                  <Card key={game.id} className="glass glass-hover group">
                    <div className="relative">
                      <img
                        src={game.thumbnail || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      {game.isPopular && (
                        <Badge className="absolute top-2 right-2 bg-primary/90 text-xs">Popular</Badge>
                      )}
                      {game.isDemoMode && (
                        <Badge className="absolute top-2 left-2 bg-green-500/90 text-xs animate-pulse">DEMO</Badge>
                      )}
                    </div>
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between mb-3 p-4 pb-0">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <h3 className="font-work-sans font-semibold text-sm">{game.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{game.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 px-4">{game.description}</p>

                      <div className="flex items-center justify-between mb-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {game.category}
                        </Badge>
                        <span className={`text-xs font-medium ${difficultyColor}`}>{game.difficulty}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 pt-0">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {game.playTime}
                        </div>
                        <Button asChild size="sm" variant="ghost" className="h-7 px-2">
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
          )}
        </div>

        {/* Recently Played (for logged in users) */}
        {user && searchQuery === "" && selectedCategory === "all" && selectedDifficulty === "all" && (
          <div>
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <h2 className="font-work-sans font-semibold text-xl">Recently Played</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentlyPlayed.map((game) => {
                const Icon = game.icon
                return (
                  <Card key={game.id} className="glass glass-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-work-sans font-semibold text-sm">{game.name}</h3>
                          <p className="text-xs text-muted-foreground">{game.category}</p>
                        </div>
                        <Button asChild size="sm" variant="ghost">
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
