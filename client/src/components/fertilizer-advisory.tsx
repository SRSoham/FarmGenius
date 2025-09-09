import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FertilizerRecommendation } from "@shared/schema";

interface FertilizerAdvisoryProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  user: any;
}

const cropTypes = ['Rice', 'Coconut', 'Pepper', 'Cardamom', 'Ginger', 'Turmeric', 'Banana', 'Cashew'];
const soilTypes = ['Lateritic', 'Alluvial', 'Red', 'Black', 'Sandy', 'Clay'];
const cropStages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'];

export function FertilizerAdvisory({ language, user }: FertilizerAdvisoryProps) {
  const [cropType, setCropType] = useState('');
  const [soilType, setSoilType] = useState('');
  const [cropStage, setCropStage] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = translations[language];

  const { data: recommendations = [], isLoading } = useQuery<FertilizerRecommendation[]>({
    queryKey: ['/api/fertilizer-recommendations', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/fertilizer-recommendations?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const recommendationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/fertilizer-recommendations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fertilizer-recommendations'] });
      toast({
        title: "Fertilizer Recommendation Generated",
        description: "Check your personalized fertilizer plan below.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Generate Recommendation",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetRecommendation = () => {
    if (!cropType || !soilType || !cropStage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    recommendationMutation.mutate({
      userId: user?.id || 'guest',
      cropType,
      soilType,
      cropStage,
      farmSize: parseFloat(farmSize) || 1,
    });
  };

  return (
    <section className="py-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="fertilizer-advisory-title">
          Fertilizer & Nutrient Advisory 🌿
        </h2>
      </div>

      {/* Input Form */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Get Fertilizer Recommendation</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Crop Type</Label>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger data-testid="crop-type-select">
                <SelectValue placeholder="Select your crop" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger data-testid="soil-type-select">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypes.map((soil) => (
                  <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Crop Growth Stage</Label>
            <Select value={cropStage} onValueChange={setCropStage}>
              <SelectTrigger data-testid="crop-stage-select">
                <SelectValue placeholder="Select growth stage" />
              </SelectTrigger>
              <SelectContent>
                {cropStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Farm Size (acres)</Label>
            <Input
              type="number"
              placeholder="Enter farm size"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              data-testid="farm-size-input"
            />
          </div>

          <Button 
            onClick={handleGetRecommendation}
            disabled={recommendationMutation.isPending}
            className="w-full mt-4"
            data-testid="button-get-recommendation"
          >
            {recommendationMutation.isPending ? "Generating..." : "Get Fertilizer Plan"}
          </Button>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Fertilizer Plans</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">
                    {rec.cropType} - {rec.cropStage}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </span>
                </div>

                {rec.recommendedFertilizers && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Recommended Fertilizers:</p>
                    <div className="bg-green-50 rounded-lg p-3">
                      <pre className="text-sm text-green-800 whitespace-pre-wrap">
                        {JSON.stringify(rec.recommendedFertilizers, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {rec.nutrients && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Nutrient Requirements:</p>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                        {JSON.stringify(rec.nutrients, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {rec.applicationSchedule && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Application Schedule:</p>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <pre className="text-sm text-purple-800 whitespace-pre-wrap">
                        {JSON.stringify(rec.applicationSchedule, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {rec.costEstimate && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800">
                      Estimated Cost: ₹{rec.costEstimate.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <p className="text-muted-foreground">No fertilizer plans yet. Create your first recommendation!</p>
          </div>
        )}
      </Card>
    </section>
  );
}