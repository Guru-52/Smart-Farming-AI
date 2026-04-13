// Farming knowledge base data
// This data is seeded into the database and used for RAG-based Q&A

export const FARMING_KNOWLEDGE = [
  {
    title: "Rice Cultivation Requirements",
    category: "Crop Requirements",
    content: "Rice requires flooded or wet conditions for optimal growth. It needs high nitrogen (80-100 kg/ha), phosphorus (40-60 kg/ha), and moderate potassium. Temperature should be 20-35°C with high humidity (80-90%). Rainfall of 200+ mm is ideal. Soil pH should be 5.5-7.0. Rice is the world's most important food crop, feeding over half the global population. Best grown in alluvial or clay soils that retain water well.",
    tags: ["rice", "cereal", "paddy", "water", "nitrogen", "tropical"],
  },
  {
    title: "Soil pH and Crop Compatibility",
    category: "Soil Types",
    content: "Soil pH is crucial for nutrient availability. Most crops prefer 6.0-7.0 (slightly acidic to neutral). Blueberries and potatoes prefer 4.5-5.5 (acidic). Alfalfa and barley prefer 6.5-7.5 (neutral to slightly alkaline). Chickpea grows well at 7.0-8.0. Adjusting pH: lime raises pH (acidic to neutral), sulfur lowers pH (alkaline to acidic). Test soil pH annually for best results. Sandy soils tend to be more acidic, clay soils more alkaline.",
    tags: ["soil", "pH", "acidity", "alkaline", "nutrients", "testing"],
  },
  {
    title: "NPK Fertilizer Guide",
    category: "Farming Tips",
    content: "NPK fertilizers provide Nitrogen (N), Phosphorus (P), and Potassium (K). Nitrogen promotes vegetative growth and green color — ideal for leafy crops. Phosphorus supports root development, flowering, and fruiting. Potassium improves disease resistance, drought tolerance, and fruit quality. For balanced fertilization: cereals need more N, fruiting vegetables need more P and K, root vegetables need more K. Apply fertilizers in split doses to minimize leaching. Organic alternatives: compost, bone meal, wood ash.",
    tags: ["NPK", "fertilizer", "nitrogen", "phosphorus", "potassium", "nutrition"],
  },
  {
    title: "Maize/Corn Growing Guide",
    category: "Crop Requirements",
    content: "Maize (corn) grows best in well-drained, fertile soils with pH 5.8-7.0. It requires full sun (8+ hours), temperature of 18-32°C, and 500-800mm of rainfall distributed evenly. Nitrogen is the most critical nutrient (120-180 kg/ha). Plant spacing: 60-75cm between rows, 25-30cm within rows. Common pests: fall armyworm, corn borers. Rotate with legumes to restore soil nitrogen naturally. Harvest when husks turn brown and kernels are hard.",
    tags: ["maize", "corn", "cereal", "nitrogen", "drainage", "rotation"],
  },
  {
    title: "Irrigation Techniques for Water-Stressed Crops",
    category: "Farming Tips",
    content: "Drip irrigation is most efficient, delivering water directly to roots with 90%+ efficiency. Sprinkler systems suit field crops with 75-85% efficiency. Flood irrigation is common in rice but wastes water. For water-stressed conditions: mulching reduces evaporation by 30-50%, deficit irrigation techniques can reduce water use by 20-40% with minimal yield loss. Monitor soil moisture with tensiometers. Schedule irrigation in early morning or evening to minimize evaporation. Key indicators of water stress: wilting, leaf rolling, blue-green color change.",
    tags: ["irrigation", "water", "drip", "sprinkler", "drought", "mulching"],
  },
  {
    title: "Legumes and Nitrogen Fixation",
    category: "Crop Requirements",
    content: "Legumes (beans, peas, lentils, chickpeas) fix atmospheric nitrogen through symbiosis with Rhizobium bacteria in root nodules. A legume crop can fix 50-200 kg N/ha per season, reducing fertilizer costs. Inoculating seeds with Rhizobium before planting increases nitrogen fixation by 10-30%. Legumes improve soil structure, add organic matter, and break pest cycles. Include legumes in crop rotation every 2-3 years. Best companions for cereals (wheat, maize, rice). Low nitrogen requirements make them cost-effective for smallholder farmers.",
    tags: ["legumes", "nitrogen", "fixation", "Rhizobium", "rotation", "beans"],
  },
  {
    title: "Cotton Cultivation Best Practices",
    category: "Crop Requirements",
    content: "Cotton requires high temperatures (25-35°C), long frost-free periods (160-200 days), and moderate rainfall (500-700mm). Soil must be deep, well-drained with pH 6.0-8.0. Cotton is a heavy feeder — requires 100-150 kg N/ha, 40-60 kg P/ha, and 40-60 kg K/ha. The boll weevil and bollworm are major pests. Integrated Pest Management (IPM) combining biological, chemical, and cultural controls is recommended. Harvest when bolls open to maximize fiber quality. Defoliation before harvest improves machine picking efficiency.",
    tags: ["cotton", "fiber", "pest", "IPM", "fertilizer", "tropical"],
  },
  {
    title: "Fruit Tree Planting and Care",
    category: "Crop Requirements",
    content: "Fruit trees require site selection based on soil depth (minimum 1.5m), drainage, and sun exposure. Most fruit trees prefer pH 6.0-7.0. Planting hole should be 2-3 times root ball width. Apply balanced NPK fertilizer in first 3 years for establishment. Pruning in dormant season promotes fruiting and disease prevention. Water requirements: tropical fruits (mango, papaya, banana) need 1000-1500mm annually. Temperate fruits (apple, pear) need 600-1200mm with cold winters for dormancy. Mulch around trees to retain moisture and prevent weeds.",
    tags: ["fruit", "trees", "mango", "apple", "banana", "pruning", "orchards"],
  },
  {
    title: "Soil Erosion Prevention",
    category: "Soil Types",
    content: "Soil erosion costs global agriculture billions annually and reduces productivity by 30-40% on affected land. Prevention strategies: contour farming across slopes reduces runoff by 50%, terracing on steep slopes (>15%), cover crops reduce erosion by 90%, windbreaks reduce wind erosion, mulching protects soil surface, minimum tillage or no-till farming preserves soil structure. Strip cropping alternates erosion-resistant crops. Grass waterways prevent gully erosion. Check dams in drainage channels slow water flow. Healthy soil organic matter improves water infiltration 10x.",
    tags: ["erosion", "soil", "contour", "cover crops", "mulching", "conservation"],
  },
  {
    title: "Greenhouse Farming Technology",
    category: "Farming Tips",
    content: "Greenhouses extend growing seasons, protect crops from weather, and increase yield 3-10x compared to open fields. Types: glass greenhouses (maximum light), polycarbonate (good insulation), polyethylene tunnel (low cost). Climate control: heating for winter, shade nets for summer, automated ventilation. Hydroponic systems in greenhouses use 90% less water than soil farming. LED grow lights can supplement natural light in low-sunlight regions. Key crops: tomatoes, cucumbers, lettuce, herbs, peppers. Return on investment typically 2-4 years for commercial operations.",
    tags: ["greenhouse", "hydroponics", "technology", "climate", "LED", "protected"],
  },
  {
    title: "Banana Cultivation Guide",
    category: "Crop Requirements",
    content: "Bananas thrive in tropical climates with temperature 26-30°C, high humidity (75-85%), and annual rainfall of 1000-2000mm. Soil must be deep, well-drained, loamy with pH 5.5-6.5. Heavy feeders: 200g N, 60g P, 300g K per plant per year. Plant spacing: 2-3m x 2-3m. Ratoon cropping allows multiple harvests from one planting. Major diseases: Panama disease (Fusarium wilt), Black Sigatoka. Major pests: banana weevil. Harvest when fingers fill out and skin lightens. Ethylene ripening used for commercial distribution. Sucker selection for new plant propagation.",
    tags: ["banana", "tropical", "fruit", "humidity", "potassium", "sucker"],
  },
  {
    title: "Integrated Pest Management (IPM)",
    category: "Farming Tips",
    content: "IPM combines multiple pest control strategies to minimize pesticide use and environmental impact. Components: (1) Monitoring - regular scouting to identify pests and determine economic threshold. (2) Biological control - use of natural enemies: ladybugs for aphids, Bacillus thuringiensis for caterpillars, parasitic wasps for whiteflies. (3) Cultural control - crop rotation, resistant varieties, sanitation. (4) Mechanical control - traps, barriers, hand-picking. (5) Chemical control - targeted pesticide use as last resort. IPM reduces pesticide use by 50-70% while maintaining yields. Always follow label instructions and observe pre-harvest intervals.",
    tags: ["IPM", "pest", "biological", "pesticide", "monitoring", "resistance"],
  },
  {
    title: "Coffee Growing Regions and Varieties",
    category: "Crop Requirements",
    content: "Coffee grows in the 'Coffee Belt' between Tropics of Cancer and Capricorn. Two main species: Arabica (high altitude 1000-2000m, mild flavor, 65% of production) and Robusta (lower altitude, stronger flavor, more disease resistant). Optimal conditions: 15-24°C, 1500-2000mm rainfall, pH 6.0-7.0, well-drained volcanic soils. Shade-grown coffee benefits biodiversity and cup quality. Fertilizer needs: 150-200g N, 50-60g P, 150-200g K per tree annually. Coffee berry borer and coffee leaf rust are main challenges. Harvest by selective picking ensures only ripe berries are collected.",
    tags: ["coffee", "arabica", "robusta", "altitude", "shade", "volcanic"],
  },
  {
    title: "Composting and Organic Matter",
    category: "Soil Types",
    content: "Compost improves soil structure, water retention, and provides slow-release nutrients. Hot composting (55-65°C) kills pathogens and weed seeds in 3-4 weeks. Materials: 30:1 carbon-to-nitrogen ratio ideal (3 parts brown, 1 part green). Browns: straw, cardboard, dry leaves. Greens: kitchen scraps, grass clippings, manure. Vermicomposting uses earthworms to produce high-quality worm castings. Application rate: 5-10 tonnes/ha for degraded soils, 2-5 tonnes/ha for maintenance. Biochar mixed with compost improves water retention in sandy soils and increases carbon sequestration. Compost tea can be applied as foliar spray or soil drench.",
    tags: ["compost", "organic", "soil", "worms", "vermicomposting", "biochar"],
  },
  {
    title: "Wheat and Winter Cereal Production",
    category: "Crop Requirements",
    content: "Wheat is cultivated on 220 million hectares globally. Winter wheat sown in autumn, harvested early summer. Spring wheat sown spring, harvested late summer. Optimal temperature: 15-20°C (growing), 25-32°C (grain filling). Requires 450-650mm rainfall. Soil pH 6.0-7.5. Nitrogen timing critical: split applications at planting and tillering. Vernalization requirement (cold period) triggers flowering in winter wheat. Diseases: rust (leaf, stripe, stem), powdery mildew, Fusarium head blight. Varieties: hard red winter (bread flour), soft red winter (pastry), durum (pasta). Harvest at 13-14% moisture for safe storage.",
    tags: ["wheat", "cereal", "winter", "spring", "rust", "grain", "vernalization"],
  },
  {
    title: "Vegetable Garden Planning",
    category: "Farming Tips",
    content: "Companion planting improves yields and reduces pests naturally. Three Sisters: corn, beans, and squash grown together benefit each other. Crop families to rotate: Solanaceae (tomato, pepper, eggplant), Cucurbitaceae (squash, cucumber, melon), Brassicaceae (cabbage, broccoli, kale), Apiaceae (carrot, celery, parsley). Never plant the same family in the same spot consecutively. Intercropping fast and slow growers maximizes space. Succession planting every 2-3 weeks ensures continuous harvest. Raised beds improve drainage and warm soil faster in spring. Test soil before planting and amend as needed.",
    tags: ["vegetable", "companion", "rotation", "succession", "raised beds", "intercropping"],
  },
  {
    title: "Climate Change Adaptation in Agriculture",
    category: "Farming Tips",
    content: "Climate change brings higher temperatures, unpredictable rainfall, and extreme weather events. Adaptation strategies: drought-tolerant varieties, heat-resistant cultivars, adjusted planting dates, diversified crop portfolios, water harvesting and storage, agroforestry systems, conservation agriculture (minimum tillage, permanent soil cover, crop rotation), climate-smart agriculture. Farmers should maintain weather records to identify trends. Climate-resilient crops: sorghum, millet, cassava, cowpea, sweet potato. Smallholder farmers are most vulnerable — community-based approaches improve resilience through knowledge sharing.",
    tags: ["climate change", "drought", "adaptation", "resilient", "sorghum", "agroforestry"],
  },
  {
    title: "Organic Certification and Standards",
    category: "Farming Tips",
    content: "Organic farming prohibits synthetic pesticides, herbicides, and fertilizers. Transition period: 2-3 years from conventional to organic before certification is granted. Key organic inputs: compost, green manure, crop rotation, biological pest control, approved natural pesticides (neem oil, pyrethrin, copper fungicides). Certification bodies: USDA NOP, EU Organic Regulation, Indian National Programme for Organic Production (NPOP). Premium price premium: 20-50% above conventional. Keep detailed records of all inputs and practices. Soil health is central — organic matter improves every 3-5 years of organic management.",
    tags: ["organic", "certification", "USDA", "compost", "natural", "premium"],
  },
  {
    title: "Grapes and Vineyard Management",
    category: "Crop Requirements",
    content: "Grapes require specific climate conditions: warm, dry summers and cool winters. Chill hours (below 7°C) needed for dormancy break. Optimal temperature: 15-30°C during growing season. pH 6.0-7.0, deep well-drained soils. High potassium (200+ kg/ha) improves berry quality and disease resistance. Pruning systems: Guyot, Cordon, Goblet — each suited to different climates. Canopy management controls yield and quality balance. Major diseases: powdery mildew, downy mildew, Botrytis bunch rot. Rootstocks provide phylloxera resistance. Harvest timing determined by Brix (sugar), acidity, and seed color. Sustainable viticulture reduces water and chemical inputs.",
    tags: ["grapes", "vineyard", "wine", "pruning", "mildew", "potassium", "viticulture"],
  },
  {
    title: "Post-Harvest Storage and Handling",
    category: "Farming Tips",
    content: "Post-harvest losses account for 20-40% of food production globally. Key factors: temperature control (cold chain), humidity management, ventilation, sanitation, and pest control. Cereals: store at 12-14% moisture, 15-25°C, in sealed containers with desiccants. Fruits and vegetables: controlled atmosphere (CA) storage with 2-5% O2 and 1-5% CO2 extends shelf life 3-10x. Root crops: store in cool, dark, well-ventilated cellars. Proper curing of potatoes and sweet potatoes heals surface wounds and extends storage. Hermetic storage bags prevent insect damage without chemicals. Grain moisture meters are essential tools for safe storage.",
    tags: ["post-harvest", "storage", "cold chain", "moisture", "atmosphere", "losses"],
  },
  {
    title: "Precision Agriculture and Digital Farming",
    category: "Farming Tips",
    content: "Precision agriculture uses technology to optimize inputs and maximize efficiency. Key technologies: GPS-guided variable rate applicators reduce input costs 10-20%, drone imagery identifies crop stress areas, soil sampling grids (1 sample per 2.5ha) reveal nutrient variability, weather stations provide microclimatic data, IoT sensors monitor soil moisture, remote sensing satellites track crop health via NDVI. Machine learning models predict yield and disease risk. Data management platforms integrate all farm data for decision support. Benefits: reduced environmental impact, lower costs, improved yields. Entry point: start with soil sampling and satellite crop monitoring.",
    tags: ["precision", "GPS", "drone", "IoT", "satellite", "NDVI", "digital"],
  },
];
