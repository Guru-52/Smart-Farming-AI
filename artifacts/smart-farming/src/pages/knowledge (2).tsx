import { useState } from "react";
import { useGetKnowledgeBase } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Book, FolderOpen, Tag, Database } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Knowledge() {
  const { data: entries, isLoading } = useGetKnowledgeBase();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = entries ? Array.from(new Set(entries.map(e => e.category))) : [];

  const filteredEntries = entries?.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory ? entry.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Database className="h-8 w-8 text-secondary" />
          Agricultural Knowledge Base
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Browse verified farming practices, crop guidelines, and agronomic data.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-6 flex-shrink-0">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles, tags..." 
                className="pl-9 h-10 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="bg-card border-muted/50">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <ScrollArea className="h-64 md:h-auto">
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === null 
                        ? 'bg-secondary/10 text-secondary font-medium' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category 
                          ? 'bg-secondary/10 text-secondary font-medium' 
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-auto bg-background/50 rounded-xl border border-muted/50 p-6 shadow-inner">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="h-48 border-muted/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No entries found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max">
              {filteredEntries.map((entry, index) => (
                <Card 
                  key={entry.id} 
                  className="group hover-elevate transition-all border-muted hover:border-secondary/30 h-full flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                        {entry.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {entry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {entry.content}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/50">
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}