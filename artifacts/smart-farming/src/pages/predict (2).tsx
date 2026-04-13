import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePredictCrop } from "@workspace/api-client-react";
import type { CropPredictionResult } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sprout, ThermometerSun, Droplets, FlaskConical, Beaker, Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nitrogen: z.coerce.number().min(0).max(140),
  phosphorus: z.coerce.number().min(0).max(145),
  potassium: z.coerce.number().min(0).max(205),
  temperature: z.coerce.number().min(8).max(45),
  humidity: z.coerce.number().min(14).max(100),
  ph: z.coerce.number().min(3.5).max(9.9),
  rainfall: z.coerce.number().min(20).max(300),
});

type FormValues = z.infer<typeof formSchema>;

export default function Predict() {
  const { toast } = useToast();
  const [result, setResult] = useState<CropPredictionResult | null>(null);
  
  const predictMutation = usePredictCrop();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
      temperature: 25,
      humidity: 60,
      ph: 6.5,
      rainfall: 100,
    },
  });

  function onSubmit(values: FormValues) {
    predictMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        setResult(data);
        toast({
          title: "Prediction Complete",
          description: `Best crop recommendation: ${data.crop}`,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        toast({
          title: "Prediction Failed",
          description: err.message || "An error occurred while running the model.",
          variant: "destructive"
        });
      }
    });
  }

  const handleReset = () => {
    setResult(null);
    form.reset();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Crop Recommendation Model</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Enter soil nutrients and environmental conditions to predict the most suitable crop using our ML model.
        </p>
      </div>

      {result && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
            <div className="bg-primary/10 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Recommended Crop</h2>
                  <p className="text-2xl md:text-3xl font-bold capitalize text-foreground">{result.crop}</p>
                </div>
              </div>
              <div className="w-full md:w-64">
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span className="text-muted-foreground">Model Confidence</span>
                  <span className="text-primary">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence * 100} className="h-2 bg-primary/20" />
              </div>
            </div>
            
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Why this crop?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
                    <Leaf className="h-5 w-5 text-accent" />
                    Farming Tips
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.farmingTips}
                  </p>
                </div>
              </div>
              
              <div>
                <Card className="bg-background/50 h-full border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Alternative Options</CardTitle>
                    <CardDescription>Other crops that might work well in these conditions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.alternativeCrops.map(crop => (
                        <Badge key={crop} variant="secondary" className="capitalize text-sm py-1 px-3">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleReset}>
                      Run Another Prediction
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={result ? "opacity-50 pointer-events-none grayscale-[50%] transition-all" : ""}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Soil Nutrients (NPK)
                </CardTitle>
                <CardDescription>Enter the soil macronutrient levels in kg/ha.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base">Nitrogen (N)</FormLabel>
                        <span className="font-mono text-sm text-primary font-medium">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={0} max={140} step={1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base">Phosphorus (P)</FormLabel>
                        <span className="font-mono text-sm text-primary font-medium">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={0} max={145} step={1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base">Potassium (K)</FormLabel>
                        <span className="font-mono text-sm text-primary font-medium">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={0} max={205} step={1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ph"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-muted-foreground" />
                          Soil pH Level
                        </FormLabel>
                        <span className="font-mono text-sm text-primary font-medium">{field.value.toFixed(1)}</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={3.5} max={9.9} step={0.1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5 text-accent" />
                  Environmental Conditions
                </CardTitle>
                <CardDescription>Average weather metrics for the growing season.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base">Temperature</FormLabel>
                        <span className="font-mono text-sm text-accent font-medium">{field.value}°C</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={8} max={45} step={1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="humidity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base">Relative Humidity</FormLabel>
                        <span className="font-mono text-sm text-accent font-medium">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={14} max={100} step={1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rainfall"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-end mb-2">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          Rainfall
                        </FormLabel>
                        <span className="font-mono text-sm text-blue-500 font-medium">{field.value}mm</span>
                      </div>
                      <FormControl>
                        <Slider 
                          min={20} max={300} step={1}
                          value={[field.value]} 
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="pt-6 border-t mt-auto">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full text-base font-semibold h-14"
                  disabled={predictMutation.isPending}
                >
                  {predictMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Analyzing Data...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Run Prediction Model
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}