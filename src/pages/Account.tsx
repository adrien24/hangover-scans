import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Clock, Star, Settings, Edit, LogOut } from "lucide-react";
import MangaNavigation from "@/components/MangaNavigation";
import { useAuth } from "@/hooks/useAuth";

const Account = () => {
  const { user, logout } = useAuth();

  const userStats = {
    totalRead: 156,
    chaptersRead: 2847,
    timeSpent: "284h 32m",
    favoriteGenre: "Action",
    joinDate: "January 2023"
  };

  const recentActivity = [
    {
      manga: "Attack on Titan",
      chapter: "Chapter 139",
      action: "Completed reading",
      time: "2 hours ago",
      cover: "/manga-cover-1.jpg"
    },
    {
      manga: "One Piece",
      chapter: "Chapter 1100",
      action: "Added to watchlist",
      time: "1 day ago", 
      cover: "/manga-cover-2.jpg"
    },
    {
      manga: "Demon Slayer",
      chapter: "Chapter 230",
      action: "Started reading",
      time: "3 days ago",
      cover: "/manga-cover-3.jpg"
    }
  ];

  const achievements = [
    { name: "Speed Reader", description: "Read 100+ chapters in a month", icon: "🏃‍♂️", earned: true },
    { name: "Manga Explorer", description: "Read 50+ different manga series", icon: "🗺️", earned: true },
    { name: "Early Bird", description: "Read latest chapters within 24h", icon: "🐦", earned: true },
    { name: "Completionist", description: "Finish 10+ manga series", icon: "✅", earned: false },
    { name: "Night Owl", description: "Read after midnight 50+ times", icon: "🦉", earned: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MangaNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="text-2xl">{user?.username?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{user?.username || "Utilisateur"}</h1>
                    <p className="text-muted-foreground mb-2">{user?.email}</p>
                    <Badge variant="secondary" className="mb-4">Premium Reader</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Se deconnecter
                    </Button>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.totalRead}</div>
                    <div className="text-sm text-muted-foreground">Manga Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.chaptersRead}</div>
                    <div className="text-sm text-muted-foreground">Chapters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.timeSpent}</div>
                    <div className="text-sm text-muted-foreground">Time Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.7</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.favoriteGenre}</div>
                    <div className="text-sm text-muted-foreground">Fav Genre</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="reading-history">Reading History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={activity.cover} 
                        alt={activity.manga}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{activity.manga}</div>
                        <div className="text-sm text-muted-foreground">{activity.chapter}</div>
                        <div className="text-sm text-primary">{activity.action}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-4 p-4 border rounded-lg ${
                        achievement.earned ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`}>
                          {achievement.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      {achievement.earned && (
                        <Badge variant="secondary">Earned</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reading-history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reading History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Detailed reading history coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reading Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Preferences settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;