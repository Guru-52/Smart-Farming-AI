import { Link, useLocation } from "wouter";
import { Sprout, LayoutDashboard, Lightbulb, MessageSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Predict Crop", href: "/predict", icon: Lightbulb },
  { name: "Ask Assistant", href: "/ask", icon: MessageSquare },
  { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar text-sidebar-foreground transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 text-sidebar-primary font-semibold hover:opacity-80 transition-opacity">
            <Sprout className="h-6 w-6" />
            <span>AgriIntel</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-11 transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-sidebar-accent p-4">
            <p className="text-xs text-sidebar-accent-foreground/70 font-medium">System Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-sidebar-foreground">All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b bg-background sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
            <Sprout className="h-6 w-6" />
            <span>AgriIntel</span>
          </Link>
        </header>

        <main className="flex-1 overflow-auto bg-background/50 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
          <div className="h-full relative z-10 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden border-t bg-background flex items-center justify-around p-2 pb-safe">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex flex-col h-14 w-14 gap-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name.split(' ')[0]}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}