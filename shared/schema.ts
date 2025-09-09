import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  farmLocation: text("farm_location"),
  farmSize: real("farm_size"), // in acres
  farmType: varchar("farm_type", { length: 50 }), // organic, conventional, etc.
  primaryCrops: text("primary_crops").array(),
  experience: varchar("experience", { length: 20 }), // beginner, intermediate, expert
  language: varchar("language", { length: 5 }).notNull().default("en"),
  location: jsonb("location"),
  profileImage: text("profile_image"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  windSpeed: real("wind_speed").notNull(),
  visibility: real("visibility").notNull(),
  condition: text("condition").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const soilData = pgTable("soil_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  soilType: text("soil_type").notNull(),
  phLevel: real("ph_level").notNull(),
  fertility: text("fertility").notNull(),
  recommendations: text("recommendations").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 50 }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  location: text("location").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const voiceQueries = pgTable("voice_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  query: text("query").notNull(),
  response: text("response").notNull(),
  language: varchar("language", { length: 5 }).notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Disease and Pest Detection
export const diseaseDetections = pgTable("disease_detections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  imagePath: text("image_path").notNull(),
  cropType: text("crop_type").notNull(),
  detectedDisease: text("detected_disease"),
  confidence: real("confidence"),
  symptoms: text("symptoms").array(),
  treatment: text("treatment"),
  severity: varchar("severity", { length: 20 }),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Fertilizer and Nutrient Advisory
export const fertilizerRecommendations = pgTable("fertilizer_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  cropType: text("crop_type").notNull(),
  soilType: text("soil_type").notNull(),
  cropStage: varchar("crop_stage", { length: 30 }).notNull(),
  recommendedFertilizers: jsonb("recommended_fertilizers"),
  nutrients: jsonb("nutrients"), // NPK values, micronutrients
  applicationSchedule: jsonb("application_schedule"),
  costEstimate: real("cost_estimate"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Market and Financial Support
export const marketPrices = pgTable("market_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropName: text("crop_name").notNull(),
  variety: text("variety"),
  marketLocation: text("market_location").notNull(),
  priceMin: real("price_min").notNull(),
  priceMax: real("price_max").notNull(),
  priceAverage: real("price_average").notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // kg, quintal, ton
  quality: varchar("quality", { length: 20 }), // Grade A, B, C
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const financialRecords = pgTable("financial_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // income, expense
  category: varchar("category", { length: 50 }).notNull(), // seeds, fertilizer, labor, sales
  amount: real("amount").notNull(),
  description: text("description"),
  cropRelated: text("crop_related"),
  receiptImage: text("receipt_image"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Community and Expert Support
export const experts = pgTable("experts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  experience: varchar("experience", { length: 20 }).notNull(),
  location: text("location"),
  contactInfo: jsonb("contact_info"),
  rating: real("rating").default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  profileImage: text("profile_image"),
  bio: text("bio"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  expertId: varchar("expert_id").notNull(),
  question: text("question").notNull(),
  response: text("response"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, answered, closed
  images: text("images").array(),
  priority: varchar("priority", { length: 20 }).default("medium"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  responseTimestamp: timestamp("response_timestamp"),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 30 }).notNull(), // question, experience, tip, success-story
  images: text("images").array(),
  likes: real("likes").default(0),
  tags: text("tags").array(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const postComments = pgTable("post_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Irrigation Support
export const irrigationSchedules = pgTable("irrigation_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  cropType: text("crop_type").notNull(),
  fieldSize: real("field_size").notNull(),
  soilType: text("soil_type").notNull(),
  irrigationMethod: varchar("irrigation_method", { length: 30 }).notNull(), // drip, sprinkler, flood
  schedule: jsonb("schedule"), // days, times, duration
  waterRequirement: real("water_requirement"), // liters per day
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Crop Advisory
export const cropAdvisories = pgTable("crop_advisories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropName: text("crop_name").notNull(),
  variety: text("variety"),
  region: text("region").notNull(),
  season: varchar("season", { length: 20 }).notNull(),
  plantingGuidance: jsonb("planting_guidance"),
  careInstructions: jsonb("care_instructions"),
  harvestGuidance: jsonb("harvest_guidance"),
  commonIssues: jsonb("common_issues"),
  expectedYield: real("expected_yield"),
  profitability: jsonb("profitability"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export const insertSoilDataSchema = createInsertSchema(soilData).omit({
  id: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertVoiceQuerySchema = createInsertSchema(voiceQueries).omit({
  id: true,
  timestamp: true,
});

export const insertDiseaseDetectionSchema = createInsertSchema(diseaseDetections).omit({
  id: true,
  timestamp: true,
});

export const insertFertilizerRecommendationSchema = createInsertSchema(fertilizerRecommendations).omit({
  id: true,
  timestamp: true,
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({
  id: true,
  timestamp: true,
});

export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({
  id: true,
  timestamp: true,
});

export const insertExpertSchema = createInsertSchema(experts).omit({
  id: true,
  createdAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  timestamp: true,
  responseTimestamp: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  timestamp: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  timestamp: true,
});

export const insertIrrigationScheduleSchema = createInsertSchema(irrigationSchedules).omit({
  id: true,
  createdAt: true,
});

export const insertCropAdvisorySchema = createInsertSchema(cropAdvisories).omit({
  id: true,
  timestamp: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type SoilData = typeof soilData.$inferSelect;
export type InsertSoilData = z.infer<typeof insertSoilDataSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type VoiceQuery = typeof voiceQueries.$inferSelect;
export type InsertVoiceQuery = z.infer<typeof insertVoiceQuerySchema>;
export type DiseaseDetection = typeof diseaseDetections.$inferSelect;
export type InsertDiseaseDetection = z.infer<typeof insertDiseaseDetectionSchema>;
export type FertilizerRecommendation = typeof fertilizerRecommendations.$inferSelect;
export type InsertFertilizerRecommendation = z.infer<typeof insertFertilizerRecommendationSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;
export type Expert = typeof experts.$inferSelect;
export type InsertExpert = z.infer<typeof insertExpertSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type IrrigationSchedule = typeof irrigationSchedules.$inferSelect;
export type InsertIrrigationSchedule = z.infer<typeof insertIrrigationScheduleSchema>;
export type CropAdvisory = typeof cropAdvisories.$inferSelect;
export type InsertCropAdvisory = z.infer<typeof insertCropAdvisorySchema>;
