import { Link } from "wouter";
import { useGetCropStats, useGetRecentPredictions } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, TrendingUp, Lightbulb, MessageSquare, Database, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetCropStats();
  const { data: recentPredictions, isLoading: predictionsLoading } = useGetRecentPredictions();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Farm Intelligence Overview</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Monitor your agricultural predictive models and recent insights.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
        <Link href="/predict">
          <Card className="hover-elevate cursor-pointer border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-primary">Predict Crop</h3>
                <p className="text-sm text-muted-foreground mt-1">Run ML model with soil & weather data</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ask">
          <Card className="hover-elevate cursor-pointer border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-accent text-accent-foreground rounded-lg">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-accent-foreground">Ask Assistant</h3>
                <p className="text-sm text-muted-foreground mt-1">Get AI farming advice instantly</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : stats ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Predictions</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalPredictions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Supported Crops</CardTitle>
                <Sprout className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCrops}</div>
                <p className="text-xs text-muted-foreground mt-1">Across 4 climate zones</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Model Accuracy</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(stats.modelAccuracy * 100).toFixed(1)}%</div>
                <Progress value={stats.modelAccuracy * 100} className="h-1 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Knowledge Base</CardTitle>
                <Database className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalKnowledgeEntries}</div>
                <p className="text-xs text-muted-foreground mt-1">Articles & guidelines</p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
        {/* Recent Predictions */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Latest ML crop recommendations run by the system.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {predictionsLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : recentPredictions && recentPredictions.length > 0 ? (
              <div className="space-y-4">
                {recentPredictions.slice(0, 5).map((pred) => (
                  <div key={pred.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {pred.crop.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground capitalize">{pred.crop}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pred.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={cn("font-mono", pred.confidence > 0.8 ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50")}>
                        {(pred.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                        N: {pred.nitrogen} | P: {pred.phosphorus} | K: {pred.potassium}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-lg border border-dashed">
                <Sprout className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No predictions yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">Run your first crop prediction model to see history here.</p>
                <Button asChild className="mt-4">
                  <Link href="/predict">Run Prediction</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Crops */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Popular Recommendations</CardTitle>
            <CardDescription>Most frequently predicted crops</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {statsLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : stats?.popularCrops ? (
              <div className="space-y-6 mt-2">
                {stats.popularCrops.map((item, i) => (
                  <div key={item.crop} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{item.crop}</span>
                      <span className="text-muted-foreground">{item.count} predictions</span>
                    </div>
                    <Progress value={(item.count / Math.max(...stats.popularCrops.map(c => c.count))) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}