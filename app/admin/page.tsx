"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Gamepad2, 
  TrendingUp,
  Activity,
  User,
  Settings,
  BarChart2
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalGames: 11,
    totalPlays: 0
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  useEffect(() => {
    // Add test users and load real data
    const testUsers = [
      { id: 1, username: "TestUser1", email: "test1@example.com", status: "Active" },
      { id: 2, username: "TestUser2", email: "test2@example.com", status: "Active" }
    ]
    
    const users = JSON.parse(localStorage.getItem("gameHub_users") || "[]")
    const currentUser = JSON.parse(localStorage.getItem("gameHub_user") || "null")
    
    const allUsers = [...users, ...testUsers]
    if (currentUser && currentUser.email !== "admin@gamehub.com") {
      allUsers.push({
        id: currentUser.id || "current",
        username: currentUser.username,
        email: currentUser.email,
        joinedAt: currentUser.joinedAt,
        status: "Active"
      })
    }
    
    const formattedUsers = allUsers.map((user: any, index: number) => ({
      id: user.id || index,
      username: user.username || 'Unknown',
      email: user.email || 'No email',
      joinDate: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown',
      status: "Active"
    }))
    
    setRecentUsers(formattedUsers)
    setStats({
      totalUsers: allUsers.length,
      activeUsers: currentUser ? 1 : 0,
      totalGames: 11,
      totalPlays: allUsers.length * 5
    })
  }, [])

  // Debug info
  console.log("Current user:", user)
  console.log("Recent users:", recentUsers)
  console.log("Stats:", stats)

  const allGames = [
    { 
      id: 1, 
      name: "Aviator", 
      category: "Crash", 
      plays: 3420, 
      rating: 4.9, 
      status: "Active",
      image: "/images/aviator.png",
      releaseDate: "2023-01-15"
    },
    { 
      id: 2, 
      name: "Balloons", 
      category: "Arcade", 
      plays: 2890, 
      rating: 4.7, 
      status: "Active",
      image: "/images/balloons.png",
      releaseDate: "2023-02-20"
    },
    { 
      id: 3, 
      name: "Chicken Road", 
      category: "Adventure", 
      plays: 2156, 
      rating: 4.6, 
      status: "Active",
      image: "/images/chicken-road.png",
      releaseDate: "2023-03-10"
    },
    { 
      id: 4, 
      name: "Cock Fight", 
      category: "Action", 
      plays: 1987, 
      rating: 4.8, 
      status: "Active",
      image: "/images/cock-fight.png",
      releaseDate: "2023-01-25"
    },
    { 
      id: 5, 
      name: "Color Prediction", 
      category: "Puzzle", 
      plays: 1750, 
      rating: 4.5, 
      status: "Active",
      image: "/images/color-prediction.png",
      releaseDate: "2023-04-05"
    },
    { 
      id: 6, 
      name: "Dice", 
      category: "Dice", 
      plays: 1620, 
      rating: 4.7, 
      status: "Active",
      image: "/images/dice.png",
      releaseDate: "2023-03-18"
    },
    { 
      id: 7, 
      name: "Jet-X", 
      category: "Crash", 
      plays: 1420, 
      rating: 4.9, 
      status: "Active",
      image: "/images/jetx.png",
      releaseDate: "2023-02-28"
    },
    { 
      id: 8, 
      name: "Ludo", 
      category: "Board", 
      plays: 1350, 
      rating: 4.8, 
      status: "Active",
      image: "/images/ludo.png",
      releaseDate: "2023-01-10"
    },
    { 
      id: 9, 
      name: "Mines", 
      category: "Puzzle", 
      plays: 1280, 
      rating: 4.6, 
      status: "Active",
      image: "/images/mines.png",
      releaseDate: "2023-03-22"
    },
    { 
      id: 10, 
      name: "Plinko", 
      category: "Arcade", 
      plays: 1150, 
      rating: 4.5, 
      status: "Active",
      image: "/images/plinko.png",
      releaseDate: "2023-04-12"
    },
    { 
      id: 11, 
      name: "Pushpa", 
      category: "Action", 
      plays: 980, 
      rating: 4.7, 
      status: "Active",
      image: "/images/pushpa.png",
      releaseDate: "2023-05-01"
    }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-work-sans font-bold text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your GameHub platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{stats.activeUsers}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Games</p>
                      <p className="text-2xl font-bold">{stats.totalGames}</p>
                    </div>
                    <Gamepad2 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Plays</p>
                      <p className="text-2xl font-bold">{stats.totalPlays}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          
          
          
          
          
          

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">Joined {user.joinDate}</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allGames.slice(0, 5).map((game) => (
                      <div key={game.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <Gamepad2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{game.name}</p>
                            <p className="text-sm text-muted-foreground">{game.plays.toLocaleString()} plays • {game.rating}★</p>
                          </div>
                        </div>
                        <Badge variant={game.status === "Active" ? "default" : "secondary"}>
                          {game.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games">
            <Card className="mb-6">
          <CardHeader>
            <CardTitle>All Games</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your game library</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead className="text-center">
                  <tr className="text-sm text-muted-foreground border-b">
                    <th className="p-3 text-center">Game</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-center">Plays</th>
                    <th className="p-3 text-center">Rating</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allGames.map((game) => (
                    <tr key={game.id} className="hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-10 h-10 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${game.image})` }}></div>
                          <div>
                            <p className="font-medium">{game.name}</p>
                            <p className="text-xs text-muted-foreground">Released: {game.releaseDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Badge variant="outline">{game.category}</Badge>
                        </div>
                      </td>
                      <td className="p-3 text-center">{game.plays.toLocaleString()}</td>
                      <td className="p-3 text-center">{game.rating} ★</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Badge variant={game.status === "Active" ? "default" : "secondary"}>
                            {game.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground">View and manage all users</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="text-sm text-muted-foreground border-b">
                        <th className="p-3">User</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Joined</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="p-3">
                            <div className="flex items-center justify-center space-x-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{user.username}</span>
                            </div>
                          </td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.joinDate}</td>
                          <td className="p-3">
                            <Badge variant="default">Active</Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="12" cy="5" r="1"/>
                                <circle cx="12" cy="19" r="1"/>
                              </svg>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Configure platform settings</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">General Settings</h3>
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Maintenance Mode</h4>
                          <p className="text-sm text-muted-foreground">Take the site offline for maintenance</p>
                        </div>
                        <Button variant="outline" size="sm">Enable Maintenance</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}