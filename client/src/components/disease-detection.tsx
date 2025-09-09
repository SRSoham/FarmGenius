import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DiseaseDetection } from "@shared/schema";

interface DiseaseDetectionProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  user: any;
}

const cropTypes = [
  'Rice', 'Coconut', 'Pepper', 'Cardamom', 'Ginger', 'Turmeric', 
  'Banana', 'Cashew', 'Rubber', 'Tea', 'Coffee', 'Vanilla'
];

export function DiseaseDetection({ language, user }: DiseaseDetectionProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = translations[language];

  const { data: detections = [], isLoading } = useQuery<DiseaseDetection[]>({
    queryKey: ['/api/disease-detections', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/disease-detections?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const detectionMutation = useMutation({
    mutationFn: async (data: { imagePath: string; cropType: string; userId: string }) => {
      return await apiRequest('/api/disease-detections', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/disease-detections'] });
      toast({
        title: "Disease Analysis Complete",
        description: "Check the results below for recommendations.",
      });
      setSelectedImage(null);
      setPreviewUrl('');
      setSelectedCrop('');
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Please try again with a clear image.",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedCrop) {
      toast({
        title: "Missing Information",
        description: "Please select an image and crop type.",
        variant: "destructive",
      });
      return;
    }

    // Simulate image upload and analysis
    const imagePath = `uploads/${Date.now()}_${selectedImage.name}`;
    
    detectionMutation.mutate({
      imagePath,
      cropType: selectedCrop,
      userId: user?.id || 'guest',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <section className="py-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="disease-detection-title">
          Disease & Pest Detection 🐛
        </h2>
      </div>

      {/* Image Upload Section */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Analyze Crop Image</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="crop-select">Select Crop Type</Label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger data-testid="crop-select">
                <SelectValue placeholder="Choose your crop" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image-upload">Upload Crop Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="mt-1"
              data-testid="image-upload"
            />
          </div>

          {previewUrl && (
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
                data-testid="image-preview"
              />
            </div>
          )}

          <Button 
            onClick={handleAnalyze}
            disabled={!selectedImage || !selectedCrop || detectionMutation.isPending}
            className="w-full"
            data-testid="button-analyze"
          >
            {detectionMutation.isPending ? "Analyzing..." : "Analyze for Diseases"}
          </Button>
        </div>
      </Card>

      {/* Recent Detections */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Analysis</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : detections.length > 0 ? (
          <div className="space-y-4">
            {detections.slice(0, 5).map((detection) => (
              <div key={detection.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{detection.cropType}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(detection.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  {detection.severity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(detection.severity)}`}>
                      {detection.severity}
                    </span>
                  )}
                </div>
                
                {detection.detectedDisease && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-foreground">Detected: {detection.detectedDisease}</p>
                    {detection.confidence && (
                      <p className="text-xs text-muted-foreground">
                        Confidence: {Math.round(detection.confidence * 100)}%
                      </p>
                    )}
                  </div>
                )}

                {detection.symptoms && detection.symptoms.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-foreground">Symptoms:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {detection.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {detection.treatment && (
                  <div className="bg-green-50 rounded-lg p-3 mt-3">
                    <p className="text-sm font-medium text-green-800">Treatment:</p>
                    <p className="text-sm text-green-700">{detection.treatment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <p className="text-muted-foreground">No disease analysis yet. Upload an image to get started!</p>
          </div>
        )}
      </Card>
    </section>
  );
}