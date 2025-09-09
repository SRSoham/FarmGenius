import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { translations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface FarmerProfileProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  user: any;
  onLogout: () => void;
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  farmLocation: z.string().min(2, "Farm location is required"),
  farmSize: z.number().min(0.1, "Farm size must be greater than 0").optional(),
  farmType: z.string().optional(),
  primaryCrops: z.array(z.string()).optional(),
  experience: z.string().optional(),
});

const cropOptions = ['Rice', 'Coconut', 'Pepper', 'Cardamom', 'Ginger', 'Turmeric', 'Banana', 'Cashew', 'Rubber', 'Tea', 'Coffee'];
const experienceOptions = ['Beginner (0-2 years)', 'Intermediate (3-10 years)', 'Expert (10+ years)'];
const farmTypeOptions = ['Organic', 'Conventional', 'Mixed', 'Sustainable'];

export function FarmerProfile({ language, user, onLogout }: FarmerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(user?.primaryCrops || []);
  const { toast } = useToast();
  const t = translations[language];

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      farmLocation: user?.farmLocation || "",
      farmSize: user?.farmSize || undefined,
      farmType: user?.farmType || "",
      primaryCrops: user?.primaryCrops || [],
      experience: user?.experience || "",
    },
  });

  const handleSaveProfile = async (values: z.infer<typeof profileSchema>) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          primaryCrops: selectedCrops,
        }),
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to save profile changes.",
        variant: "destructive",
      });
    }
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
  };

  const getProfileCompleteness = () => {
    const fields = [
      user?.fullName,
      user?.email,
      user?.phone,
      user?.farmLocation,
      user?.farmSize,
      user?.farmType,
      user?.primaryCrops?.length > 0,
      user?.experience,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <section className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="farmer-profile-title">
            Farmer Profile
          </h2>
        </div>
        <Button 
          variant="outline" 
          onClick={onLogout}
          data-testid="button-logout"
        >
          Logout
        </Button>
      </div>

      {/* Profile Completeness */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Profile Completeness</h3>
          <span className="text-2xl font-bold text-primary">{getProfileCompleteness()}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProfileCompleteness()}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your profile to get personalized farming recommendations
        </p>
      </Card>

      {/* Profile Information */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            data-testid="button-edit-profile"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your farm location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Size (acres)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Enter farm size" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farm type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {farmTypeOptions.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farming Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceOptions.map((exp) => (
                          <SelectItem key={exp} value={exp.toLowerCase()}>{exp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Primary Crops</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {cropOptions.map((crop) => (
                    <Button
                      key={crop}
                      type="button"
                      variant={selectedCrops.includes(crop) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCrop(crop)}
                      className="text-xs"
                    >
                      {crop}
                    </Button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" data-testid="button-save-profile">
                Save Profile
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{user?.fullName || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user?.email || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{user?.phone || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Farm Location</Label>
                <p className="font-medium">{user?.farmLocation || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Farm Size</Label>
                <p className="font-medium">{user?.farmSize ? `${user.farmSize} acres` : "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Farm Type</Label>
                <p className="font-medium">{user?.farmType || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Experience</Label>
                <p className="font-medium">{user?.experience || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Primary Crops</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user?.primaryCrops?.length > 0 ? (
                    user.primaryCrops.map((crop: string) => (
                      <span key={crop} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                        {crop}
                      </span>
                    ))
                  ) : (
                    <p className="font-medium">Not selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <Card className="rounded-2xl shadow-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Farming Journey</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </p>
            <p className="text-sm text-muted-foreground">Days with us</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {user?.primaryCrops?.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">Crops grown</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {getProfileCompleteness()}%
            </p>
            <p className="text-sm text-muted-foreground">Profile complete</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {user?.farmSize || 0}
            </p>
            <p className="text-sm text-muted-foreground">Acres farmed</p>
          </div>
        </div>
      </Card>
    </section>
  );
}