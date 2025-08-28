"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Calendar, Trophy, Gamepad2, Settings, Edit } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const stats = [
    { label: "Games Played", value: "47", icon: Gamepad2 },
    { label: "High Score", value: "2,450", icon: Trophy },
    { label: "Achievements", value: "12", icon: Trophy },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="glass mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-work-sans font-bold text-3xl mb-2">{user.username}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Active Player
                  </Badge>
                </div>
                
                <Button variant="outline" className="hover:text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="glass glass-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { game: "Aviator", score: "1,250", time: "2 hours ago" },
                { game: "Ludo", score: "Victory", time: "5 hours ago" },
                { game: "Color Prediction", score: "850", time: "1 day ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium">{activity.game}</div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                  <Badge variant="outline">{activity.score}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive updates about your games</div>
                </div>
                <Button variant="outline" size="sm" className="hover:text-white">
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                <div>
                  <div className="font-medium">Privacy Settings</div>
                  <div className="text-sm text-muted-foreground">Control who can see your profile</div>
                </div>
                <Button variant="outline" size="sm" className="hover:text-white">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                <div>
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-muted-foreground">Update your account password</div>
                </div>
                <Button variant="outline" size="sm" className="hover:text-white">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}