import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWeatherDataSchema, 
  insertSoilDataSchema, 
  insertAlertSchema, 
  insertVoiceQuerySchema,
  insertUserSchema,
  insertDiseaseDetectionSchema,
  insertFertilizerRecommendationSchema,
  insertMarketPriceSchema,
  insertFinancialRecordSchema,
  insertExpertSchema,
  insertConsultationSchema,
  insertCommunityPostSchema,
  insertPostCommentSchema,
  insertIrrigationScheduleSchema,
  insertCropAdvisorySchema
} from "@shared/schema";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize demo user
  try {
    const existingDemo = await storage.getUserByUsername('demo');
    if (!existingDemo) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await storage.createUser({
        username: 'demo',
        password: hashedPassword,
        fullName: 'Demo Farmer',
        email: 'demo@example.com',
        farmLocation: 'Ernakulam, Kerala',
        farmSize: 5.0,
        farmType: 'organic',
        primaryCrops: ['Rice', 'Coconut', 'Pepper'],
        experience: 'intermediate',
        language: 'en',
        phone: '+91 9876543210',
        isVerified: true,
      });
    }
  } catch (error) {
    console.log('Demo user already exists or creation failed');
  }

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // User profile routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      // Remove password from updates if present (should be updated separately)
      delete updates.password;
      
      const user = await storage.updateUser(req.params.id, updates);
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Disease Detection routes
  app.post("/api/disease-detections", async (req, res) => {
    try {
      const validatedData = insertDiseaseDetectionSchema.parse(req.body);
      const detection = await storage.createDiseaseDetection(validatedData);
      res.json(detection);
    } catch (error) {
      res.status(400).json({ message: "Invalid disease detection data" });
    }
  });

  app.get("/api/disease-detections", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const detections = await storage.getDiseaseDetections(userId);
      res.json(detections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch disease detections" });
    }
  });

  // Fertilizer Recommendation routes
  app.post("/api/fertilizer-recommendations", async (req, res) => {
    try {
      const validatedData = insertFertilizerRecommendationSchema.parse(req.body);
      const recommendation = await storage.createFertilizerRecommendation(validatedData);
      res.json(recommendation);
    } catch (error) {
      res.status(400).json({ message: "Invalid fertilizer recommendation data" });
    }
  });

  app.get("/api/fertilizer-recommendations", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const recommendations = await storage.getFertilizerRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fertilizer recommendations" });
    }
  });

  // Market Prices routes
  app.post("/api/market-prices", async (req, res) => {
    try {
      const validatedData = insertMarketPriceSchema.parse(req.body);
      const price = await storage.createMarketPrice(validatedData);
      res.json(price);
    } catch (error) {
      res.status(400).json({ message: "Invalid market price data" });
    }
  });

  app.get("/api/market-prices", async (req, res) => {
    try {
      const location = req.query.location as string;
      const prices = await storage.getMarketPrices(location);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market prices" });
    }
  });

  // Expert routes
  app.post("/api/experts", async (req, res) => {
    try {
      const validatedData = insertExpertSchema.parse(req.body);
      const expert = await storage.createExpert(validatedData);
      res.json(expert);
    } catch (error) {
      res.status(400).json({ message: "Invalid expert data" });
    }
  });

  app.get("/api/experts", async (req, res) => {
    try {
      const experts = await storage.getExperts();
      res.json(experts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experts" });
    }
  });

  // Consultation routes
  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  app.get("/api/consultations", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const consultations = await storage.getConsultations(userId);
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Community Post routes
  app.post("/api/community-posts", async (req, res) => {
    try {
      const validatedData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(validatedData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid community post data" });
    }
  });

  app.get("/api/community-posts", async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  // Weather API routes
  app.get("/api/weather/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const weatherData = await storage.getWeatherData(location);
      
      if (!weatherData) {
        return res.status(404).json({ message: "Weather data not found for this location" });
      }
      
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  app.post("/api/weather", async (req, res) => {
    try {
      const validatedData = insertWeatherDataSchema.parse(req.body);
      const weatherData = await storage.createWeatherData(validatedData);
      res.json(weatherData);
    } catch (error) {
      res.status(400).json({ message: "Invalid weather data" });
    }
  });

  // Soil API routes
  app.get("/api/soil/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const soilData = await storage.getSoilData(location);
      
      if (!soilData) {
        return res.status(404).json({ message: "Soil data not found for this location" });
      }
      
      res.json(soilData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch soil data" });
    }
  });

  app.post("/api/soil", async (req, res) => {
    try {
      const validatedData = insertSoilDataSchema.parse(req.body);
      const soilData = await storage.createSoilData(validatedData);
      res.json(soilData);
    } catch (error) {
      res.status(400).json({ message: "Invalid soil data" });
    }
  });

  // Alerts API routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  // Voice query API routes
  app.post("/api/voice-query", async (req, res) => {
    try {
      const validatedData = insertVoiceQuerySchema.parse(req.body);
      
      // Generate AI response based on query
      const response = generateAIResponse(validatedData.query, validatedData.language);
      
      const voiceQuery = await storage.createVoiceQuery({
        ...validatedData,
        response,
      });
      
      res.json(voiceQuery);
    } catch (error) {
      res.status(400).json({ message: "Invalid voice query data" });
    }
  });

  app.get("/api/voice-queries/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const queries = await storage.getRecentVoiceQueries(limit);
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent voice queries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateAIResponse(query: string, language: string): string {
  const responses = {
    en: {
      weather: "Based on current weather data, I recommend taking precautions for your crops due to expected heavy rainfall.",
      pest: "For pest control, try using neem oil spray during evening hours. It's effective against most common pests.",
      price: "Current market prices show rice at ₹2,800 per quintal in Ernakulam market.",
      soil: "Your soil analysis suggests moderate fertility. Consider adding organic compost to improve nutrient levels.",
      crop: "For this season, coconut and rice cultivation would be ideal based on your soil type and weather conditions.",
      default: "I understand you're asking about farming. Could you be more specific about weather, crops, or pest control?"
    },
    ml: {
      weather: "നിലവിലെ കാലാവസ്ഥാ ഡാറ്റയുടെ അടിസ്ഥാനത്തിൽ, പ്രതീക്ഷിക്കുന്ന കനത്ത മഴ കാരണം നിങ്ങളുടെ വിളകൾക്ക് മുൻകരുതലുകൾ എടുക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു.",
      pest: "കീടനിയന്ത്രണത്തിനായി, വൈകുന്നേരങ്ങളിൽ നീം എണ്ണ സ്പ്രേ ഉപയോగിക്കാൻ ശ്രമിക്കുക. മിക്ക സാധാരണ കീടങ്ങൾക്കും ഇത് ഫലപ്രദമാണ്.",
      price: "നിലവിലെ മാർക്കറ്റ് വിലകൾ എറണാകുളം മാർക്കറ്റിൽ അരി ക്വിന്റലിന് ₹2,800 കാണിക്കുന്നു.",
      soil: "നിങ്ങളുടെ മണ്ണ് വിശകലനം മിതമായ ഫലഭൂയിഷ്ഠത സൂചിപ്പിക്കുന്നു. പോഷകങ്ങളുടെ അളവ് മെച്ചപ്പെടുത്താൻ ജൈവവളം ചേർക്കാൻ പരിഗണിക്കുക.",
      crop: "ഈ സീസണിൽ, നിങ്ങളുടെ മണ്ണിന്റെ തരവും കാലാവസ്ഥാ അവസ്ഥയും അടിസ്ഥാനമാക്കി തെങ്ങ്, നെൽ കൃഷി അനുയോജ്യമാകും.",
      default: "നിങ്ങൾ കൃഷിയെക്കുറിച്ച് ചോദിക്കുന്നുവെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു. കാലാവസ്ഥ, വിളകൾ അല്ലെങ്കിൽ കീടനിയന്ത്രണത്തെക്കുറിച്ച് കൂടുതൽ വ്യക്തമാക്കാമോ?"
    },
    ta: {
      weather: "தற்போதைய வானிலை தரவுகளின் அடிப்படையில், எதிர்பார்க்கப்படும் கனமழை காரணமாக உங்கள் பயிர்களுக்கு முன்னெச்சரிக்கை நடவடிக்கைகளை எடுக்க பரிந்துரைக்கிறேன்.",
      pest: "பூச்சி கட்டுப்பாட்டிற்கு, மாலை நேரங்களில் வேப்பெண்ணெய் தெளிப்பதை முயற்சிக்கவும். பொதுவான பூச்சிகளுக்கு இது பயனுள்ளதாக இருக்கும்.",
      price: "தற்போதைய சந்தை விலைகள் எர்ணாகுளம் சந்தையில் அரிசி குவிண்டாலுக்கு ₹2,800 ஐ காட்டுகிறது.",
      soil: "உங்கள் மண் பகுப்பாய்வு மிதமான வளத்தை குறிக்கிறது. ஊட்டச்சத்து அளவுகளை மேம்படுத்த கரிம உரம் சேர்ப்பதை பரிசீலிக்கவும்.",
      crop: "இந்த பருவத்தில், உங்கள் மண் வகை மற்றும் வானிலை நிலைமைகளின் அடிப்படையில் தென்னை மற்றும் நெல் சாகுபடி ஏற்றதாக இருக்கும்.",
      default: "நீங்கள் விவசாயத்தைப் பற்றி கேட்கிறீர்கள் என்று புரிந்துகொள்கிறேன். வானிலை, பயிர்கள் அல்லது பூச்சி கட்டுப்பாடு பற்றி மிகவும் குறிப்பிட்டுச் சொல்ல முடியுமா?"
    },
    hi: {
      weather: "वर्तमान मौसम डेटा के आधार पर, अपेक्षित भारी बारिश के कारण मैं आपकी फसलों के लिए सावधानियां बरतने की सलाह देता हूं।",
      pest: "कीट नियंत्रण के लिए, शाम के समय नीम तेल का छिड़काव करने का प्रयास करें। यह अधिकांश सामान्य कीटों के विरुद्ध प्रभावी है।",
      price: "वर्तमान बाजार मूल्य एर्णाकुलम बाजार में चावल ₹2,800 प्रति क्विंटल दिखाते हैं।",
      soil: "आपका मिट्टी विश्लेषण मध्यम उर्वरता का सुझाव देता है। पोषक तत्वों के स्तर को बेहतर बनाने के लिए जैविक खाद जोड़ने पर विचार करें।",
      crop: "इस मौसम के लिए, आपकी मिट्टी के प्रकार और मौसम की स्थिति के आधार पर नारियल और धान की खेती आदर्श होगी।",
      default: "मैं समझता हूं कि आप खेती के बारे में पूछ रहे हैं। क्या आप मौसम, फसल या कीट नियंत्रण के बारे में अधिक विशिष्ट हो सकते हैं?"
    }
  };

  const langResponses = responses[language as keyof typeof responses] || responses.en;
  const queryLower = query.toLowerCase();

  if (queryLower.includes('weather') || queryLower.includes('rain') || queryLower.includes('കാലാവസ്ഥ') || queryLower.includes('மழை') || queryLower.includes('मौसम')) {
    return langResponses.weather;
  } else if (queryLower.includes('pest') || queryLower.includes('insect') || queryLower.includes('കീടം') || queryLower.includes('பூச்சி') || queryLower.includes('कीट')) {
    return langResponses.pest;
  } else if (queryLower.includes('price') || queryLower.includes('market') || queryLower.includes('വില') || queryLower.includes('விலை') || queryLower.includes('मूल्य')) {
    return langResponses.price;
  } else if (queryLower.includes('soil') || queryLower.includes('മണ്ണ്') || queryLower.includes('மண்') || queryLower.includes('मिट्टी')) {
    return langResponses.soil;
  } else if (queryLower.includes('crop') || queryLower.includes('plant') || queryLower.includes('വിള') || queryLower.includes('பயிர்') || queryLower.includes('फसल')) {
    return langResponses.crop;
  } else {
    return langResponses.default;
  }
}
