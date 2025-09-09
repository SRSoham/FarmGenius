import { 
  type User, type InsertUser, 
  type WeatherData, type InsertWeatherData, 
  type SoilData, type InsertSoilData, 
  type Alert, type InsertAlert, 
  type VoiceQuery, type InsertVoiceQuery,
  type DiseaseDetection, type InsertDiseaseDetection,
  type FertilizerRecommendation, type InsertFertilizerRecommendation,
  type MarketPrice, type InsertMarketPrice,
  type FinancialRecord, type InsertFinancialRecord,
  type Expert, type InsertExpert,
  type Consultation, type InsertConsultation,
  type CommunityPost, type InsertCommunityPost,
  type PostComment, type InsertPostComment,
  type IrrigationSchedule, type InsertIrrigationSchedule,
  type CropAdvisory, type InsertCropAdvisory
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  
  // Weather data
  getWeatherData(location: string): Promise<WeatherData | undefined>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  
  // Soil data
  getSoilData(location: string): Promise<SoilData | undefined>;
  createSoilData(data: InsertSoilData): Promise<SoilData>;
  
  // Alerts
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  // Voice queries
  createVoiceQuery(query: InsertVoiceQuery): Promise<VoiceQuery>;
  getRecentVoiceQueries(limit?: number): Promise<VoiceQuery[]>;
  
  // Disease detection
  createDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection>;
  getDiseaseDetections(userId: string): Promise<DiseaseDetection[]>;
  
  // Fertilizer recommendations
  createFertilizerRecommendation(recommendation: InsertFertilizerRecommendation): Promise<FertilizerRecommendation>;
  getFertilizerRecommendations(userId: string): Promise<FertilizerRecommendation[]>;
  
  // Market prices
  createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice>;
  getMarketPrices(location?: string): Promise<MarketPrice[]>;
  
  // Financial records
  createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord>;
  getFinancialRecords(userId: string): Promise<FinancialRecord[]>;
  
  // Experts
  createExpert(expert: InsertExpert): Promise<Expert>;
  getExperts(): Promise<Expert[]>;
  
  // Consultations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultations(userId: string): Promise<Consultation[]>;
  updateConsultation(id: string, updates: Partial<InsertConsultation>): Promise<Consultation>;
  
  // Community posts
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  
  // Post comments
  createPostComment(comment: InsertPostComment): Promise<PostComment>;
  getPostComments(postId: string): Promise<PostComment[]>;
  
  // Irrigation schedules
  createIrrigationSchedule(schedule: InsertIrrigationSchedule): Promise<IrrigationSchedule>;
  getIrrigationSchedules(userId: string): Promise<IrrigationSchedule[]>;
  
  // Crop advisories
  createCropAdvisory(advisory: InsertCropAdvisory): Promise<CropAdvisory>;
  getCropAdvisories(region?: string): Promise<CropAdvisory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private weatherData: Map<string, WeatherData>;
  private soilData: Map<string, SoilData>;
  private alerts: Map<string, Alert>;
  private voiceQueries: VoiceQuery[];
  private diseaseDetections: Map<string, DiseaseDetection>;
  private fertilizerRecommendations: Map<string, FertilizerRecommendation>;
  private marketPrices: Map<string, MarketPrice>;
  private financialRecords: Map<string, FinancialRecord>;
  private experts: Map<string, Expert>;
  private consultations: Map<string, Consultation>;
  private communityPosts: Map<string, CommunityPost>;
  private postComments: Map<string, PostComment>;
  private irrigationSchedules: Map<string, IrrigationSchedule>;
  private cropAdvisories: Map<string, CropAdvisory>;

  constructor() {
    this.users = new Map();
    this.weatherData = new Map();
    this.soilData = new Map();
    this.alerts = new Map();
    this.voiceQueries = [];
    this.diseaseDetections = new Map();
    this.fertilizerRecommendations = new Map();
    this.marketPrices = new Map();
    this.financialRecords = new Map();
    this.experts = new Map();
    this.consultations = new Map();
    this.communityPosts = new Map();
    this.postComments = new Map();
    this.irrigationSchedules = new Map();
    this.cropAdvisories = new Map();

    // Initialize with some sample data for Kerala
    this.initializeData();
  }

  private initializeData() {
    // Initialize weather data for different Kerala districts
    const weatherId1 = randomUUID();
    const weather1: WeatherData = {
      id: weatherId1,
      location: "Ernakulam, Kerala",
      temperature: 28,
      humidity: 75,
      windSpeed: 12,
      visibility: 10,
      condition: "Partly Cloudy",
      timestamp: new Date(),
    };
    this.weatherData.set("ernakulam", weather1);

    // Initialize soil data
    const soilId1 = randomUUID();
    const soil1: SoilData = {
      id: soilId1,
      location: "Ernakulam, Kerala",
      soilType: "Lateritic Soil",
      phLevel: 6.2,
      fertility: "Moderate",
      recommendations: "Suitable for rice, coconut, and spice cultivation. Consider organic fertilizers to improve fertility.",
    };
    this.soilData.set("ernakulam", soil1);

    // Initialize active alerts
    const alertId1 = randomUUID();
    const alert1: Alert = {
      id: alertId1,
      type: "weather",
      title: "Heavy Rain Alert",
      message: "Expected rainfall 50-75mm in next 6 hours. Take necessary precautions for your crops.",
      severity: "high",
      location: "Ernakulam, Kerala",
      isActive: true,
      timestamp: new Date(),
    };
    this.alerts.set(alertId1, alert1);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getWeatherData(location: string): Promise<WeatherData | undefined> {
    const key = location.toLowerCase().split(',')[0].trim();
    return this.weatherData.get(key);
  }

  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const id = randomUUID();
    const weatherData: WeatherData = {
      ...data,
      id,
      timestamp: new Date(),
    };
    const key = data.location.toLowerCase().split(',')[0].trim();
    this.weatherData.set(key, weatherData);
    return weatherData;
  }

  async getSoilData(location: string): Promise<SoilData | undefined> {
    const key = location.toLowerCase().split(',')[0].trim();
    return this.soilData.get(key);
  }

  async createSoilData(data: InsertSoilData): Promise<SoilData> {
    const id = randomUUID();
    const soilData: SoilData = {
      ...data,
      id,
    };
    const key = data.location.toLowerCase().split(',')[0].trim();
    this.soilData.set(key, soilData);
    return soilData;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.isActive);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      ...alert,
      id,
      timestamp: new Date(),
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async createVoiceQuery(query: InsertVoiceQuery): Promise<VoiceQuery> {
    const id = randomUUID();
    const voiceQuery: VoiceQuery = {
      ...query,
      id,
      timestamp: new Date(),
    };
    this.voiceQueries.push(voiceQuery);
    return voiceQuery;
  }

  async getRecentVoiceQueries(limit: number = 10): Promise<VoiceQuery[]> {
    return this.voiceQueries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Disease detection methods
  async createDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection> {
    const id = randomUUID();
    const diseaseDetection: DiseaseDetection = {
      ...detection,
      id,
      timestamp: new Date(),
      // Mock disease detection results
      detectedDisease: this.generateMockDisease(detection.cropType),
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      symptoms: this.generateMockSymptoms(detection.cropType),
      treatment: this.generateMockTreatment(detection.cropType),
      severity: Math.random() > 0.5 ? 'medium' : 'low',
    };
    this.diseaseDetections.set(id, diseaseDetection);
    return diseaseDetection;
  }

  async getDiseaseDetections(userId: string): Promise<DiseaseDetection[]> {
    return Array.from(this.diseaseDetections.values())
      .filter(detection => detection.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Fertilizer recommendation methods
  async createFertilizerRecommendation(recommendation: InsertFertilizerRecommendation): Promise<FertilizerRecommendation> {
    const id = randomUUID();
    const fertilizerRec: FertilizerRecommendation = {
      ...recommendation,
      id,
      timestamp: new Date(),
      // Mock fertilizer recommendations
      recommendedFertilizers: this.generateMockFertilizers(recommendation.cropType, recommendation.soilType),
      nutrients: this.generateMockNutrients(recommendation.cropType),
      applicationSchedule: this.generateMockSchedule(recommendation.cropStage),
      costEstimate: Math.floor(Math.random() * 5000) + 2000, // ₹2000-7000
    };
    this.fertilizerRecommendations.set(id, fertilizerRec);
    return fertilizerRec;
  }

  async getFertilizerRecommendations(userId: string): Promise<FertilizerRecommendation[]> {
    return Array.from(this.fertilizerRecommendations.values())
      .filter(rec => rec.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Market price methods
  async createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice> {
    const id = randomUUID();
    const marketPrice: MarketPrice = {
      ...price,
      id,
      timestamp: new Date(),
    };
    this.marketPrices.set(id, marketPrice);
    return marketPrice;
  }

  async getMarketPrices(location?: string): Promise<MarketPrice[]> {
    const prices = Array.from(this.marketPrices.values());
    if (location) {
      return prices.filter(price => price.marketLocation.toLowerCase().includes(location.toLowerCase()));
    }
    return prices.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Financial record methods
  async createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord> {
    const id = randomUUID();
    const financialRecord: FinancialRecord = {
      ...record,
      id,
      timestamp: new Date(),
    };
    this.financialRecords.set(id, financialRecord);
    return financialRecord;
  }

  async getFinancialRecords(userId: string): Promise<FinancialRecord[]> {
    return Array.from(this.financialRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Expert methods
  async createExpert(expert: InsertExpert): Promise<Expert> {
    const id = randomUUID();
    const expertRecord: Expert = {
      ...expert,
      id,
      createdAt: new Date(),
    };
    this.experts.set(id, expertRecord);
    return expertRecord;
  }

  async getExperts(): Promise<Expert[]> {
    return Array.from(this.experts.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Consultation methods
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultationRecord: Consultation = {
      ...consultation,
      id,
      timestamp: new Date(),
    };
    this.consultations.set(id, consultationRecord);
    return consultationRecord;
  }

  async getConsultations(userId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values())
      .filter(consultation => consultation.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateConsultation(id: string, updates: Partial<InsertConsultation>): Promise<Consultation> {
    const existing = this.consultations.get(id);
    if (!existing) {
      throw new Error("Consultation not found");
    }
    const updated: Consultation = {
      ...existing,
      ...updates,
      responseTimestamp: updates.response ? new Date() : existing.responseTimestamp,
    };
    this.consultations.set(id, updated);
    return updated;
  }

  // Community post methods
  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const communityPost: CommunityPost = {
      ...post,
      id,
      timestamp: new Date(),
    };
    this.communityPosts.set(id, communityPost);
    return communityPost;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Post comment methods
  async createPostComment(comment: InsertPostComment): Promise<PostComment> {
    const id = randomUUID();
    const postComment: PostComment = {
      ...comment,
      id,
      timestamp: new Date(),
    };
    this.postComments.set(id, postComment);
    return postComment;
  }

  async getPostComments(postId: string): Promise<PostComment[]> {
    return Array.from(this.postComments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Irrigation schedule methods
  async createIrrigationSchedule(schedule: InsertIrrigationSchedule): Promise<IrrigationSchedule> {
    const id = randomUUID();
    const irrigationSchedule: IrrigationSchedule = {
      ...schedule,
      id,
      createdAt: new Date(),
    };
    this.irrigationSchedules.set(id, irrigationSchedule);
    return irrigationSchedule;
  }

  async getIrrigationSchedules(userId: string): Promise<IrrigationSchedule[]> {
    return Array.from(this.irrigationSchedules.values())
      .filter(schedule => schedule.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Crop advisory methods
  async createCropAdvisory(advisory: InsertCropAdvisory): Promise<CropAdvisory> {
    const id = randomUUID();
    const cropAdvisory: CropAdvisory = {
      ...advisory,
      id,
      timestamp: new Date(),
    };
    this.cropAdvisories.set(id, cropAdvisory);
    return cropAdvisory;
  }

  async getCropAdvisories(region?: string): Promise<CropAdvisory[]> {
    const advisories = Array.from(this.cropAdvisories.values());
    if (region) {
      return advisories.filter(advisory => 
        advisory.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    return advisories.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Helper methods for generating mock data
  private generateMockDisease(cropType: string): string {
    const diseases: { [key: string]: string[] } = {
      'Rice': ['Brown Spot', 'Leaf Blast', 'Sheath Blight', 'Bacterial Leaf Blight'],
      'Coconut': ['Leaf Spot', 'Bud Rot', 'Crown Rot', 'Root Wilt'],
      'Pepper': ['Anthracnose', 'Leaf Spot', 'Quick Wilt', 'Phytophthora'],
      'default': ['Leaf Spot', 'Fungal Infection', 'Bacterial Wilt', 'Nutrient Deficiency']
    };
    const cropDiseases = diseases[cropType] || diseases['default'];
    return cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
  }

  private generateMockSymptoms(cropType: string): string[] {
    const symptoms = [
      'Yellow spots on leaves',
      'Brown patches on stem',
      'Wilting of lower leaves',
      'Dark spots with yellow halo',
      'Premature leaf drop',
      'Stunted growth'
    ];
    return symptoms.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private generateMockTreatment(cropType: string): string {
    const treatments = [
      'Apply copper-based fungicide spray every 7-10 days',
      'Remove affected leaves and improve air circulation',
      'Use neem oil spray in early morning or evening',
      'Ensure proper drainage and avoid overwatering',
      'Apply organic compost to improve plant immunity'
    ];
    return treatments[Math.floor(Math.random() * treatments.length)];
  }

  private generateMockFertilizers(cropType: string, soilType: string): any {
    return {
      primary: 'NPK 20:20:20',
      secondary: 'Organic Compost',
      micronutrients: ['Zinc Sulphate', 'Boron'],
      application: 'Apply during vegetative growth stage'
    };
  }

  private generateMockNutrients(cropType: string): any {
    return {
      nitrogen: Math.floor(Math.random() * 50) + 30,
      phosphorus: Math.floor(Math.random() * 30) + 20,
      potassium: Math.floor(Math.random() * 40) + 25,
      organic_matter: Math.floor(Math.random() * 10) + 5
    };
  }

  private generateMockSchedule(cropStage: string): any {
    return {
      week1: 'Base fertilizer application',
      week3: 'First top dressing',
      week6: 'Second top dressing',
      week9: 'Final application before harvest'
    };
  }
}

export const storage = new MemStorage();
