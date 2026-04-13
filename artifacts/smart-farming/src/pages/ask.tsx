import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAskFarmingQuestion } from "@workspace/api-client-react";
import type { FarmingQuestionResult } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sprout, BookOpen, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  question: z.string().min(5, "Please ask a more detailed question.").max(500),
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  relatedTopics?: string[];
};

export default function Ask() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hello! I am your AI Agronomist. I have access to our comprehensive farming knowledge base. Ask me anything about crop diseases, irrigation, soil management, or specific crop care."
  }]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const askMutation = useAskFarmingQuestion();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: "user", content: values.question }]);
    form.reset();

    askMutation.mutate({ data: { question: values.question } }, {
      onSuccess: (data: FarmingQuestionResult) => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          relatedTopics: data.relatedTopics
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: "I apologize, but I encountered an error retrieving that information. Please try asking your question again."
        }]);
      }
    });
  }

  const handleTopicClick = (topic: string) => {
    form.setValue("question", `Tell me more about ${topic}`);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          AI Farming Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          RAG-powered agronomist trained on verified agricultural data.
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-muted">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
                  msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                )}>
                  {msg.role === "user" ? <User className="h-5 w-5" /> : <Sprout className="h-5 w-5" />}
                </div>
                
                <div className={cn(
                  "max-w-[85%] space-y-3",
                  msg.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-accent text-accent-foreground rounded-tr-sm" 
                      : "bg-muted/50 border rounded-tl-sm"
                  )}>
                    {msg.content}
                  </div>
                  
                  {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                    <div className="pl-2 pr-2">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                        <BookOpen className="h-3 w-3" />
                        Sources used:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-background/50">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.role === "assistant" && msg.relatedTopics && msg.relatedTopics.length > 0 && (
                    <div className="pl-2 pr-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Related topics you can explore:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.relatedTopics.map((topic, i) => (
                          <Button 
                            key={i} 
                            variant="secondary" 
                            size="sm" 
                            className="h-7 text-xs rounded-full"
                            onClick={() => handleTopicClick(topic)}
                          >
                            {topic}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {askMutation.isPending && (
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-1">
                  <Sprout className="h-5 w-5" />
                </div>
                <div className="bg-muted/50 border p-4 rounded-2xl rounded-tl-sm w-24 flex justify-center items-center gap-1.5">
                  <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card mt-auto flex-shrink-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto flex gap-3 items-end">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea 
                        placeholder="Ask about crop rotation, pest control, fertilizer..." 
                        className="min-h-[60px] max-h-[150px] resize-y rounded-xl"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (field.value.trim().length >= 5) {
                              form.handleSubmit(onSubmit)();
                            }
                          }
                        }}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-[60px] w-[60px] rounded-xl flex-shrink-0 shadow-md"
                disabled={askMutation.isPending || form.watch("question").trim().length < 5}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}