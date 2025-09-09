import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CommunityPost, Expert, Consultation } from "@shared/schema";

interface CommunitySupportProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  user: any;
}

export function CommunitySupport({ language, user }: CommunitySupportProps) {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('question');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = translations[language];

  const { data: posts = [], isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ['/api/community-posts'],
    queryFn: async () => {
      const response = await fetch('/api/community-posts');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: experts = [], isLoading: expertsLoading } = useQuery<Expert[]>({
    queryKey: ['/api/experts'],
    queryFn: async () => {
      const response = await fetch('/api/experts');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: consultations = [], isLoading: consultationsLoading } = useQuery<Consultation[]>({
    queryKey: ['/api/consultations', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/consultations?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const postMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/community-posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      setNewPostTitle('');
      setNewPostContent('');
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community.",
      });
    },
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/consultations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/consultations'] });
      toast({
        title: "Consultation Requested",
        description: "An expert will respond to your question soon.",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content.",
        variant: "destructive",
      });
      return;
    }

    postMutation.mutate({
      userId: user?.id || 'guest',
      title: newPostTitle,
      content: newPostContent,
      category: selectedCategory,
      tags: [],
      images: [],
    });
  };

  const handleAskExpert = (expertId: string, question: string) => {
    consultationMutation.mutate({
      userId: user?.id || 'guest',
      expertId,
      question,
      images: [],
      priority: 'medium',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'question': return '❓';
      case 'experience': return '💡';
      case 'tip': return '🔧';
      case 'success-story': return '🎉';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'answered': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <section className="py-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="community-support-title">
          Community & Expert Support 👨‍🌾
        </h2>
      </div>

      <Tabs defaultValue="community" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="consultations">My Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="space-y-4">
          {/* Create New Post */}
          <Card className="rounded-2xl shadow-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Share with Community</h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                {['question', 'experience', 'tip', 'success-story'].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {getCategoryIcon(category)} {category}
                  </Button>
                ))}
              </div>

              <Input
                placeholder="Post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                data-testid="post-title-input"
              />

              <Textarea
                placeholder="Share your farming experience, ask questions, or provide tips..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
                data-testid="post-content-input"
              />

              <Button 
                onClick={handleCreatePost}
                disabled={postMutation.isPending}
                className="w-full"
                data-testid="button-create-post"
              >
                {postMutation.isPending ? "Posting..." : "Share Post"}
              </Button>
            </div>
          </Card>

          {/* Community Posts */}
          <Card className="rounded-2xl shadow-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Community Posts</h3>
            
            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="p-4 border border-border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(post.category)} {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="text-xs">{post.likes || 0}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <p className="text-muted-foreground">No community posts yet. Be the first to share!</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <Card className="rounded-2xl shadow-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Agricultural Experts</h3>
            
            {expertsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : experts.length > 0 ? (
              <div className="space-y-4">
                {experts.map((expert) => (
                  <div key={expert.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center">
                          {expert.name}
                          {expert.isVerified && (
                            <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </h4>
                        <p className="text-sm text-primary">{expert.specialization}</p>
                        <p className="text-xs text-muted-foreground">{expert.experience} experience • {expert.location}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{expert.rating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    
                    {expert.bio && (
                      <p className="text-sm text-muted-foreground mb-3">{expert.bio}</p>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={() => {
                        const question = prompt("What would you like to ask this expert?");
                        if (question) handleAskExpert(expert.id, question);
                      }}
                      data-testid={`button-ask-expert-${expert.id}`}
                    >
                      Ask Expert
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="space-y-4">
                  {/* Sample Expert Data */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center">
                          Dr. Rajesh Kumar
                          <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </h4>
                        <p className="text-sm text-primary">Rice & Paddy Cultivation Expert</p>
                        <p className="text-xs text-muted-foreground">15+ years experience • Thrissur, Kerala</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Specialized in sustainable rice farming techniques and integrated pest management for Kerala farmers.</p>
                    <Button size="sm">Ask Expert</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card className="rounded-2xl shadow-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">My Expert Consultations</h3>
            
            {consultationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : consultations.length > 0 ? (
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`text-xs ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(consultation.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground font-medium mb-2">{consultation.question}</p>
                    
                    {consultation.response && (
                      <div className="bg-green-50 rounded-lg p-3 mt-2">
                        <p className="text-sm text-green-800">
                          <strong>Expert Response:</strong> {consultation.response}
                        </p>
                        {consultation.responseTimestamp && (
                          <p className="text-xs text-green-600 mt-1">
                            Answered on {new Date(consultation.responseTimestamp).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-muted-foreground">No consultations yet. Ask an expert to get started!</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}