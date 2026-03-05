export const SHIPPING_THRESHOLD = 300; 

export const PRODUCTS = [
  // ─────────────────────────────────────────
  // RUNNING
  // ─────────────────────────────────────────
  {
    id: 1,
    name: "Dryfit Pro Running Tee",
    category: "Running",
    gender: "men",
    price: 14.99,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=500&h=600&fit=crop",
    variant: "Navy Blue / S",
    description:
      "Dryfit technology wicks moisture fast, keeping you cool and dry throughout your run. Slim-fit cut with unrestricted range of motion.",
    material: "88% Recycled Polyester · 12% Spandex · Dryfit Pro technology",
    care: "Machine wash 30°C · No fabric softener · Air dry · Do not tumble dry",
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeChart: {
      headers: ["Size", "Chest (cm)", "Shoulder (cm)", "Length (cm)"],
      rows: [
        ["S",   "88",  "42", "68"],
        ["M",   "92",  "44", "70"],
        ["L",   "96",  "46", "72"],
        ["XL",  "100", "48", "74"],
        ["XXL", "104", "50", "76"],
      ],
    },
  },
  {
    id: 2,
    name: "7-Inch Running Shorts",
    category: "Running",
    gender: "men",
    price: 12.99,
    badge: null,
    image: "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=500&h=600&fit=crop",
    variant: "Black / M",
    description:
      "Breathable mesh-lined running shorts with a rear zip pocket for your phone. Flatlock seams prevent chafing on long runs.",
    material: "100% Recycled Polyester · Mesh liner",
    care: "Machine wash 30°C · No bleach · Air dry",
    sizes: ["S", "M", "L", "XL"],
    sizeChart: {
      headers: ["Size", "Waist (cm)", "Hip (cm)", "Length (cm)"],
      rows: [
        ["S",  "70-74", "88-92",   "38"],
        ["M",  "75-79", "93-97",   "40"],
        ["L",  "80-84", "98-102",  "42"],
        ["XL", "85-89", "103-107", "44"],
      ],
    },
  },
  {
    id: 3,
    name: "AirStrike X1 Running Shoes",
    category: "Running",
    gender: "unisex",
    price: 79.99,
    originalPrice: 99.99,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop",
    variant: "White / Blue",
    description:
      "Ultra-light EVA midsole for optimal cushioning. Flyknit upper for breathability and a sock-like fit. Rubber outsole for superior grip.",
    material: "Upper: Flyknit mesh · Midsole: EVA foam · Outsole: Rubber grip",
    care: "Wipe clean with damp cloth · Do not machine wash · Air dry naturally · Avoid direct sunlight",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    sizeChart: {
      headers: ["EU", "UK", "US Men", "US Women", "cm"],
      rows: [
        ["38", "5",  "6",  "7",  "24.0"],
        ["39", "6",  "7",  "8",  "24.7"],
        ["40", "7",  "8",  "9",  "25.4"],
        ["41", "8",  "9",  "10", "26.0"],
        ["42", "9",  "10", "11", "26.7"],
        ["43", "10", "11", "12", "27.3"],
        ["44", "11", "12", "13", "28.0"],
      ],
    },
  },

  // ─────────────────────────────────────────
  // BASKETBALL
  // ─────────────────────────────────────────
  {
    id: 4,
    name: "Pro Basketball Game Jersey",
    category: "Basketball",
    gender: "men",
    price: 18.99,
    badge: "New",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=600&fit=crop",
    variant: "Red / White",
    description:
      "Ultra-breathable moisture-wicking jersey with a classic baggy fit for total freedom of movement. Heat-transfer numbers resist cracking and peeling.",
    material: "100% Cooling Polyester · Heat-transfer raised numbers",
    care: "Machine wash 30°C · Turn inside out · Do not tumble dry · Air dry",
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeChart: {
      headers: ["Size", "Chest (cm)", "Shoulder (cm)", "Length (cm)"],
      rows: [
        ["S",   "92",  "44", "72"],
        ["M",   "96",  "46", "74"],
        ["L",   "100", "48", "76"],
        ["XL",  "104", "50", "78"],
        ["XXL", "110", "52", "80"],
      ],
    },
  },
  {
    id: 5,
    name: "HoopFly 2 Basketball Shoes",
    category: "Basketball",
    gender: "men",
    price: 109.99,
    badge: "New",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&h=600&fit=crop",
    variant: "Black / Gold",
    description:
      "High-top ankle support with Air Cushion midsole for superior impact absorption on landing. Herringbone rubber outsole grips on any court surface.",
    material: "Upper: Synthetic leather + mesh · Midsole: Air Cushion · Outsole: Herringbone rubber",
    care: "Wipe clean after each session · Store in a cool dry place · Avoid direct sunlight",
    sizes: ["40", "41", "42", "43", "44", "45"],
    sizeChart: {
      headers: ["EU", "US", "cm"],
      rows: [
        ["40", "7.5",  "25.4"],
        ["41", "8.5",  "26.0"],
        ["42", "9.5",  "26.7"],
        ["43", "10.5", "27.3"],
        ["44", "11.5", "28.0"],
        ["45", "12.5", "28.7"],
      ],
    },
  },

  // ─────────────────────────────────────────
  // FOOTBALL
  // ─────────────────────────────────────────
  {
    id: 6,
    name: "ClubKit Football Jersey",
    category: "Football",
    gender: "unisex",
    price: 16.99,
    badge: null,
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=500&h=600&fit=crop",
    variant: "Green / White",
    description:
      "4-way stretch cooling fabric with a comfortable round neck. Suitable for match days and everyday training alike.",
    material: "100% 4-way stretch Polyester · QuickDry moisture management",
    care: "Machine wash 30°C · Turn inside out · No bleach · Air dry",
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeChart: {
      headers: ["Size", "Chest (cm)", "Shoulder (cm)", "Length (cm)"],
      rows: [
        ["S",   "88",  "42", "70"],
        ["M",   "92",  "44", "72"],
        ["L",   "96",  "46", "74"],
        ["XL",  "100", "48", "76"],
        ["XXL", "106", "50", "78"],
      ],
    },
  },
  {
    id: 7,
    name: "Turf Football Shoes",
    category: "Football",
    gender: "men",
    price: 55.99,
    originalPrice: 69.99,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&h=600&fit=crop",
    variant: "Black / Red",
    description:
      "TF (Turf) studs designed for artificial short-grass pitches. Snug fit for precise ball control. Lightweight midsole built for speed.",
    material: "Upper: Microfiber leather · Sole: TPU with TF studs",
    care: "Brush off dirt after use · Air dry naturally · Do not machine wash",
    sizes: ["39", "40", "41", "42", "43", "44"],
    sizeChart: {
      headers: ["EU", "US", "cm"],
      rows: [
        ["39", "6.5",  "24.7"],
        ["40", "7.5",  "25.4"],
        ["41", "8.5",  "26.0"],
        ["42", "9.5",  "26.7"],
        ["43", "10.5", "27.3"],
        ["44", "11.5", "28.0"],
      ],
    },
  },

  // ─────────────────────────────────────────
  // GYM & TRAINING
  // ─────────────────────────────────────────
  {
    id: 8,
    name: "Long Sleeve Compression Top",
    category: "Gym",
    gender: "men",
    price: 19.99,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=600&fit=crop",
    variant: "Black / S",
    description:
      "Long sleeve compression top keeps muscles warm and boosts circulation during heavy training. 4-way stretch fabric hugs without restricting.",
    material: "78% Polyester · 22% Spandex · Compression technology",
    care: "Hand wash or machine wash 30°C · Do not wring · Air dry · Do not tumble dry",
    sizes: ["S", "M", "L", "XL"],
    sizeChart: {
      headers: ["Size", "Chest (cm)", "Waist (cm)", "Sleeve (cm)"],
      rows: [
        ["S",  "84-88",  "70-74", "62"],
        ["M",  "89-93",  "75-79", "64"],
        ["L",  "94-98",  "80-84", "66"],
        ["XL", "99-104", "85-89", "68"],
      ],
    },
  },
  {
    id: 9,
    name: "Women's High-Waist Gym Leggings",
    category: "Gym",
    gender: "women",
    price: 16.99,
    badge: null,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=600&fit=crop",
    variant: "Black / M",
    description:
      "High-waist leggings with a sculpting fit, 4-way stretch fabric for comfort in any pose. Flatlock seams prevent skin irritation.",
    material: "75% Nylon · 25% Spandex · UPF 50+ UV protection",
    care: "Hand wash or cold machine wash 30°C · No fabric softener · Air dry",
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeChart: {
      headers: ["Size", "Waist (cm)", "Hip (cm)", "Length (cm)"],
      rows: [
        ["XS", "60-64", "84-88",   "95"],
        ["S",  "65-69", "89-93",   "97"],
        ["M",  "70-74", "94-98",   "99"],
        ["L",  "75-79", "99-103",  "101"],
        ["XL", "80-84", "104-108", "103"],
      ],
    },
  },
  {
    id: 10,
    name: "Gym Training Gloves",
    category: "Gear",
    gender: "unisex",
    price: 8.99,
    badge: null,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=600&fit=crop",
    variant: "Black / Grey",
    description:
      "Gym gloves with gel palm padding to protect hands and finger joints. Breathable mesh back, wrist wrap for added support.",
    material: "Palm: PU leather + gel padding · Back: Breathable mesh · Wrist: Neoprene",
    care: "Wipe clean with damp cloth after use · Air dry · Do not machine wash",
    sizes: ["S/M", "L/XL"],
    sizeChart: {
      headers: ["Size", "Hand circumference (cm)"],
      rows: [
        ["S/M",  "17-20"],
        ["L/XL", "21-24"],
      ],
    },
  },

  // ─────────────────────────────────────────
  // APPAREL – WOMEN
  // ─────────────────────────────────────────
  {
    id: 11,
    name: "Active Sports Bra",
    category: "Apparel",
    gender: "women",
    price: 11.99,
    badge: "New",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop",
    variant: "Coral Pink / S",
    description:
      "Medium-support sports bra ideal for yoga, gym sessions, and light running. Racerback design for airflow, removable padded cups.",
    material: "80% Nylon · 20% Spandex · Removable padded cups",
    care: "Hand wash cold · Do not wring · Air dry · Do not tumble dry",
    sizes: ["XS", "S", "M", "L"],
    sizeChart: {
      headers: ["Size", "Bust (cm)", "Underbust (cm)"],
      rows: [
        ["XS", "76-80", "63-67"],
        ["S",  "81-85", "68-72"],
        ["M",  "86-90", "73-77"],
        ["L",  "91-96", "78-82"],
      ],
    },
  },
  {
    id: 12,
    name: "Women's Running Windbreaker",
    category: "Apparel",
    gender: "women",
    price: 25.99,
    originalPrice: 34.99,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop",
    variant: "Blue / M",
    description:
      "Ultra-light packable windbreaker with light water resistance. Perfect for early morning outdoor runs.",
    material: "100% Nylon ripstop · DWR water-repellent coating",
    care: "Machine wash 30°C · Air dry · Do not iron directly",
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeChart: {
      headers: ["Size", "Chest (cm)", "Shoulder (cm)", "Length (cm)"],
      rows: [
        ["XS", "84",  "38", "60"],
        ["S",  "88",  "40", "62"],
        ["M",  "92",  "42", "64"],
        ["L",  "96",  "44", "66"],
        ["XL", "100", "46", "68"],
      ],
    },
  },

  // ─────────────────────────────────────────
  // GEAR & EQUIPMENT
  // ─────────────────────────────────────────
  {
    id: 13,
    name: "Sports Water Bottle 750ml",
    category: "Gear",
    gender: "unisex",
    price: 6.99,
    badge: null,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&h=600&fit=crop",
    variant: "Matte Black",
    description:
      "BPA-free Tritan sports bottle, 750ml capacity. One-handed flip cap, wide mouth for easy ice loading. Fits standard bike bottle cages.",
    material: "BPA-free Tritan plastic · Secure locking cap",
    care: "Hand wash or dishwasher safe · Do not fill with liquids above 60°C",
    sizes: ["One size"],
    sizeChart: {
      headers: ["Spec", "Value"],
      rows: [
        ["Capacity",  "750ml"],
        ["Height",    "24cm"],
        ["Diameter",  "7.5cm"],
        ["Weight",    "130g"],
      ],
    },
  },
  {
    id: 14,
    name: "Pro Speed Jump Rope",
    category: "Gear",
    gender: "unisex",
    price: 9.99,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1598136490941-31b4c34b7ffd?w=500&h=600&fit=crop",
    variant: "Black / Red",
    description:
      "High-speed jump rope with 360° ball bearings to prevent tangling. Non-slip rubber handles, adjustable PVC-coated steel cable.",
    material: "Cable: PVC-coated steel · Handles: ABS plastic + rubber · Bearings: Stainless steel",
    care: "Wipe clean after use · Store in a dry place · Avoid direct sunlight",
    sizes: ["One size"],
    sizeChart: {
      headers: ["Spec", "Value"],
      rows: [
        ["Cable length", "3m (adjustable)"],
        ["Handle",       "16cm"],
        ["Weight",       "180g"],
      ],
    },
  },
  {
    id: 15,
    name: "Gym Duffel Bag 40L",
    category: "Gear",
    gender: "unisex",
    price: 21.99,
    originalPrice: 28.99,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
    variant: "Black",
    description:
      "40L gym duffel with a ventilated shoe compartment, waterproof wet pocket, and padded shoulder strap for all-day carry comfort.",
    material: "600D water-resistant Polyester · YKK zippers · Foam-padded shoulder strap",
    care: "Wipe clean with damp cloth · Air dry before storing · Do not machine wash",
    sizes: ["One size"],
    sizeChart: {
      headers: ["Spec", "Value"],
      rows: [
        ["Capacity",    "40L"],
        ["Dimensions",  "55 × 28 × 28cm"],
        ["Weight",      "0.85kg"],
      ],
    },
  },
];

export const CATEGORIES = [
  "All",
  "Running",
  "Basketball",
  "Football",
  "Gym",
  "Apparel",
  "Gear",
];