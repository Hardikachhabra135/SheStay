/* ==========================================================
   SheStay — DEMO & FALLBACK DATA (Pan-India)
   All listings here are structured demonstration data for the SheStay prototype.
   When backend is running, live data is fetched from /api/properties & /api/institutions.
   ========================================================== */

const PLACES = {
  college: { name: 'IILM University / Campuses', lat: 28.4744, lng: 77.5040 },
  metro:   { name: 'Knowledge Park II Metro', lat: 28.4710, lng: 77.5010 }
};

const INSTITUTIONS = [
  {
    "id": "iilm-greater-noida",
    "name": "IILM University, Greater Noida",
    "shortName": "IILM University",
    "searchTerms": [
      "IILM",
      "IILM Greater Noida",
      "IILM University",
      "Knowledge Park 2"
    ],
    "city": "Greater Noida",
    "state": "Delhi NCR",
    "locality": "Knowledge Park II",
    "pincode": "201306",
    "coordinates": {
      "lat": 28.4632,
      "lng": 77.4935
    },
    "type": "University"
  },
  {
    "id": "galgotias-greater-noida",
    "name": "Galgotias University, Greater Noida",
    "shortName": "Galgotias University",
    "searchTerms": [
      "Galgotias",
      "Galgotia",
      "GU Greater Noida",
      "Yamuna Expressway"
    ],
    "city": "Greater Noida",
    "state": "Delhi NCR",
    "locality": "Sector 17A, Yamuna Expressway",
    "pincode": "203201",
    "coordinates": {
      "lat": 28.3644,
      "lng": 77.5401
    },
    "type": "University"
  },
  {
    "id": "sharda-greater-noida",
    "name": "Sharda University, Greater Noida",
    "shortName": "Sharda University",
    "searchTerms": [
      "Sharda",
      "Sharda University",
      "Knowledge Park 3"
    ],
    "city": "Greater Noida",
    "state": "Delhi NCR",
    "locality": "Knowledge Park III",
    "pincode": "201310",
    "coordinates": {
      "lat": 28.4732,
      "lng": 77.4831
    },
    "type": "University"
  },
  {
    "id": "amity-noida",
    "name": "Amity University, Noida",
    "shortName": "Amity University",
    "searchTerms": [
      "Amity",
      "Amity Noida",
      "Amity University Sector 125"
    ],
    "city": "Noida",
    "state": "Delhi NCR",
    "locality": "Sector 125",
    "pincode": "201313",
    "coordinates": {
      "lat": 28.544,
      "lng": 77.3332
    },
    "type": "University"
  },
  {
    "id": "bennett-greater-noida",
    "name": "Bennett University, Greater Noida",
    "shortName": "Bennett University",
    "searchTerms": [
      "Bennett",
      "Bennett University",
      "Times Group Bennett"
    ],
    "city": "Greater Noida",
    "state": "Delhi NCR",
    "locality": "Sector Tech Zone II",
    "pincode": "201310",
    "coordinates": {
      "lat": 28.4528,
      "lng": 77.5847
    },
    "type": "University"
  },
  {
    "id": "delhi-university-north",
    "name": "Delhi University (North Campus), Delhi",
    "shortName": "Delhi University",
    "searchTerms": [
      "DU",
      "Delhi University",
      "DU North Campus",
      "Hansraj",
      "Hindu College",
      "SRCC",
      "Miranda House"
    ],
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "North Campus, University Enclave",
    "pincode": "110007",
    "coordinates": {
      "lat": 28.6896,
      "lng": 77.212
    },
    "type": "Central University"
  },
  {
    "id": "iit-delhi",
    "name": "IIT Delhi (Indian Institute of Technology)",
    "shortName": "IIT Delhi",
    "searchTerms": [
      "IIT Delhi",
      "IITD",
      "Hauz Khas IIT"
    ],
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "Hauz Khas",
    "pincode": "110016",
    "coordinates": {
      "lat": 28.545,
      "lng": 77.1926
    },
    "type": "Institute of Technology"
  },
  {
    "id": "jamia-millia-islamia",
    "name": "Jamia Millia Islamia, New Delhi",
    "shortName": "Jamia Millia Islamia",
    "searchTerms": [
      "JMI",
      "Jamia",
      "Jamia Millia",
      "Okhla"
    ],
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "Jamia Nagar, Okhla",
    "pincode": "110025",
    "coordinates": {
      "lat": 28.5616,
      "lng": 77.2802
    },
    "type": "Central University"
  },
  {
    "id": "ip-university-delhi",
    "name": "Guru Gobind Singh Indraprastha University (GGSIPU)",
    "shortName": "IP University",
    "searchTerms": [
      "IPU",
      "IP University",
      "GGSIPU Dwarka",
      "BVCOE Paschim Vihar"
    ],
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "Sector 16C, Dwarka",
    "pincode": "110078",
    "coordinates": {
      "lat": 28.595,
      "lng": 77.0195
    },
    "type": "State University"
  },
  {
    "id": "bvcoe-delhi",
    "name": "BVCOE (Bharati Vidyapeeth's College of Engineering)",
    "shortName": "BVCOE Delhi",
    "searchTerms": [
      "BVCOE",
      "Bharati Vidyapeeth",
      "Paschim Vihar BVCOE"
    ],
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "A-4 Block, Paschim Vihar",
    "pincode": "110063",
    "coordinates": {
      "lat": 28.6754,
      "lng": 77.1151
    },
    "type": "Engineering College"
  },
  {
    "id": "chandigarh-university-mohali",
    "name": "Chandigarh University, Mohali",
    "shortName": "Chandigarh University",
    "searchTerms": [
      "CU",
      "Chandigarh University",
      "Gharuan",
      "Kharar"
    ],
    "city": "Mohali",
    "state": "Punjab & Chandigarh",
    "locality": "NH-95, Chandigarh-Ludhiana Highway, Mohali",
    "pincode": "140413",
    "coordinates": {
      "lat": 30.7688,
      "lng": 76.5754
    },
    "type": "University"
  },
  {
    "id": "chitkara-university-punjab",
    "name": "Chitkara University, Punjab",
    "shortName": "Chitkara University",
    "searchTerms": [
      "Chitkara",
      "Chitkara University",
      "Rajpura"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Chandigarh",
    "locality": "Chandigarh-Patiala National Highway",
    "pincode": "140401",
    "coordinates": {
      "lat": 30.5161,
      "lng": 76.6592
    },
    "type": "University"
  },
  {
    "id": "manipal-university",
    "name": "Manipal Academy of Higher Education (MAHE)",
    "shortName": "Manipal University",
    "searchTerms": [
      "Manipal",
      "MAHE",
      "MIT Manipal",
      "KMC Manipal"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "locality": "Tiger Circle, Manipal",
    "pincode": "576104",
    "coordinates": {
      "lat": 13.3525,
      "lng": 74.7928
    },
    "type": "Deemed University"
  },
  {
    "id": "vit-vellore",
    "name": "VIT Vellore (Vellore Institute of Technology)",
    "shortName": "VIT Vellore",
    "searchTerms": [
      "VIT",
      "VIT Vellore",
      "Katpadi VIT"
    ],
    "city": "Vellore",
    "state": "Tamil Nadu",
    "locality": "Katpadi",
    "pincode": "632014",
    "coordinates": {
      "lat": 12.9698,
      "lng": 79.1559
    },
    "type": "Deemed University"
  },
  {
    "id": "srm-ist-chennai",
    "name": "SRM Institute of Science and Technology, Kattankulathur",
    "shortName": "SRM University Chennai",
    "searchTerms": [
      "SRM",
      "SRM Chennai",
      "SRM KTR"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "locality": "Kattankulathur, Chengalpattu",
    "pincode": "603203",
    "coordinates": {
      "lat": 12.823,
      "lng": 80.0444
    },
    "type": "Deemed University"
  },
  {
    "id": "christ-university-bengaluru",
    "name": "Christ University, Bengaluru",
    "shortName": "Christ University",
    "searchTerms": [
      "Christ",
      "Christ University",
      "Christ Central Campus",
      "Hosur Road"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "locality": "Hosur Road, DRC Post, Koramangala Extension",
    "pincode": "560029",
    "coordinates": {
      "lat": 12.9344,
      "lng": 77.606
    },
    "type": "Deemed University"
  },
  {
    "id": "symbiosis-pune",
    "name": "Symbiosis International University, Pune",
    "shortName": "Symbiosis Pune",
    "searchTerms": [
      "Symbiosis",
      "SIU Pune",
      "SCMS Viman Nagar",
      "Symbiosis Lavale"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "locality": "Viman Nagar & Lavale",
    "pincode": "411014",
    "coordinates": {
      "lat": 18.5636,
      "lng": 73.9126
    },
    "type": "Deemed University"
  },
  {
    "id": "mit-wpu-pune",
    "name": "MIT World Peace University (MIT-WPU), Pune",
    "shortName": "MIT-WPU Pune",
    "searchTerms": [
      "MIT Pune",
      "MIT WPU",
      "MIT Kothrud"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "locality": "Paud Road, Kothrud",
    "pincode": "411038",
    "coordinates": {
      "lat": 18.5178,
      "lng": 73.8151
    },
    "type": "University"
  },
  {
    "id": "bits-pilani",
    "name": "BITS Pilani (Birla Institute of Technology and Science)",
    "shortName": "BITS Pilani",
    "searchTerms": [
      "BITS",
      "BITS Pilani",
      "Pilani Campus"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "locality": "Vidya Vihar, Pilani",
    "pincode": "333031",
    "coordinates": {
      "lat": 28.3639,
      "lng": 75.5873
    },
    "type": "Deemed University"
  },
  {
    "id": "iit-bombay",
    "name": "IIT Bombay (Indian Institute of Technology)",
    "shortName": "IIT Bombay",
    "searchTerms": [
      "IIT Bombay",
      "IITB",
      "Powai IIT"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Powai",
    "pincode": "400076",
    "coordinates": {
      "lat": 19.1334,
      "lng": 72.9133
    },
    "type": "Institute of Technology"
  },
  {
    "id": "iit-madras",
    "name": "IIT Madras (Indian Institute of Technology)",
    "shortName": "IIT Madras",
    "searchTerms": [
      "IIT Madras",
      "IITM",
      "Guindy IIT",
      "Adyar IIT"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "locality": "Sardar Patel Road, Adyar",
    "pincode": "600036",
    "coordinates": {
      "lat": 12.9915,
      "lng": 80.2337
    },
    "type": "Institute of Technology"
  }
];

const LISTINGS = [
  {
    "id": "iilm-saheli-residency",
    "name": "Saheli Executive Women's PG",
    "type": "PG",
    "city": "Greater Noida",
    "state": "Delhi NCR",
    "locality": "Knowledge Park II",
    "area": "Knowledge Park II",
    "address": "Plot 14, Knowledge Park II",
    "price": 10500,
    "monthlyRent": 10500,
    "distanceKm": 0.4,
    "commute": "5 min walk to IILM University",
    "score": 88,
    "verifiedReviews": 38,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "High-Speed Wi-Fi",
      "Air Conditioned Rooms",
      "3 Home-cooked Meals",
      "100% Power Backup",
      "Washing Machines",
      "RO Drinking Water",
      "Study Desk & Wardrobe"
    ],
    "securityFeatures": [
      "24/7 CCTV in Corridors & Entry",
      "Biometric / RFID Gate Access",
      "Resident Female Warden",
      "Night Security Guard",
      "Visitor Entry Logbook & Verification",
      "Fire Extinguishers on Every Floor"
    ],
    "images": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "iilm-greater-noida",
        "name": "IILM University, Greater Noida",
        "distanceKm": 0.4,
        "commute": "5 min walk"
      },
      {
        "id": "sharda-greater-noida",
        "name": "Sharda University, Greater Noida",
        "distanceKm": 1.5,
        "commute": "5 min e-rickshaw"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Knowledge Park II Aqua Line Metro",
        "distanceKm": 0.3,
        "commute": "4 min walk"
      }
    ],
    "coordinates": {
      "lat": 28.4615,
      "lng": 77.495
    },
    "lat": 28.4615,
    "lng": 77.495,
    "isDemo": true
  },
  {
    "id": "galgotias-campus-haven",
    "name": "Yamuna Haven Women's Hostel",
    "type": "Hostel",
    "city": "Greater Noida",
    "state": "Delhi NCR",
    "locality": "Sector 17A",
    "area": "Sector 17A",
    "address": "Sector 17A, Yamuna Expressway",
    "price": 9200,
    "monthlyRent": 9200,
    "distanceKm": 1.1,
    "commute": "12 min walk / 3 min hostel shuttle to Galgotias Univ",
    "score": 81,
    "verifiedReviews": 31,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [
      {
        "level": "warn",
        "text": "Yamuna Expressway highway frontage requires avoiding solo night walks"
      }
    ],
    "facilities": [
      "Wi-Fi",
      "Air Cooled / AC Options",
      "3 Meals Included",
      "Hostel Shuttle Service",
      "Power Backup",
      "Gym & Badminton Court"
    ],
    "securityFeatures": [
      "24/7 Security Guard at Main Perimeter Gate",
      "CCTV Surveillance Across Corridors and Mess",
      "Fingerprint Scanner at Gate",
      "Female Warden on Duty",
      "Verified Shuttle Driver with Background Check"
    ],
    "images": [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "galgotias-greater-noida",
        "name": "Galgotias University, Greater Noida",
        "distanceKm": 1.1,
        "commute": "Hostel shuttle / 12 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Hostel Free College Shuttle",
        "distanceKm": 0,
        "commute": "Direct at gate"
      },
      {
        "name": "Yamuna Expressway Bus Stop",
        "distanceKm": 0.8,
        "commute": "9 min walk"
      }
    ],
    "coordinates": {
      "lat": 28.368,
      "lng": 77.538
    },
    "lat": 28.368,
    "lng": 77.538,
    "isDemo": true
  },
  {
    "id": "du-north-campus-nest",
    "name": "Kalyani Enclave Girls PG",
    "type": "PG",
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "North Campus",
    "area": "North Campus",
    "address": "B-Block, Kamla Nagar",
    "price": 13500,
    "monthlyRent": 13500,
    "distanceKm": 0.6,
    "commute": "8 min walk to DU North Campus & Hansraj",
    "score": 90,
    "verifiedReviews": 49,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Gigabit Wi-Fi",
      "Air Conditioning",
      "3 Nutritious Meals",
      "Inverter Power Backup",
      "Daily Housekeeping",
      "Terrace Garden & Study Lounge"
    ],
    "securityFeatures": [
      "24/7 CCTV in Corridors & Entry",
      "Digital Biometric Door Locks",
      "Senior Female Warden on Premises",
      "Night Security Guard",
      "Gated Residential Lane with Barrier"
    ],
    "images": [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "delhi-university-north",
        "name": "Delhi University (North Campus), Delhi",
        "distanceKm": 0.6,
        "commute": "8 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Vishwa Vidyalaya Metro (Yellow Line)",
        "distanceKm": 0.9,
        "commute": "10 min walk"
      }
    ],
    "coordinates": {
      "lat": 28.6845,
      "lng": 77.2065
    },
    "lat": 28.6845,
    "lng": 77.2065,
    "isDemo": true
  },
  {
    "id": "cu-gharuan-residence",
    "name": "Kharar Heights Women's Living",
    "type": "PG",
    "city": "Mohali",
    "state": "Punjab & Chandigarh",
    "locality": "Kharar (near CU)",
    "area": "Kharar (near CU)",
    "address": "Near NH-95, Kharar",
    "price": 8800,
    "monthlyRent": 8800,
    "distanceKm": 2.2,
    "commute": "6 min auto / direct CU bus to Chandigarh University",
    "score": 83,
    "verifiedReviews": 28,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Wi-Fi",
      "Air Conditioning",
      "3 Meals Included",
      "RO Water",
      "Power Backup",
      "Study Tables"
    ],
    "securityFeatures": [
      "24/7 CCTV Surveillance",
      "Biometric Fingerprint Scanner",
      "Full-time Female Warden",
      "Night Security Guard",
      "Visitor Restrictions After 7 PM"
    ],
    "images": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "chandigarh-university-mohali",
        "name": "Chandigarh University, Mohali",
        "distanceKm": 2.2,
        "commute": "6 min auto / college bus"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Kharar Bus Stand",
        "distanceKm": 1.2,
        "commute": "5 min auto"
      }
    ],
    "coordinates": {
      "lat": 30.755,
      "lng": 76.592
    },
    "lat": 30.755,
    "lng": 76.592,
    "isDemo": true
  },
  {
    "id": "vit-katpadi-haven",
    "name": "Vaigai Women's Stay",
    "type": "Hostel",
    "city": "Vellore",
    "state": "Tamil Nadu",
    "locality": "Katpadi (VIT Area)",
    "area": "Katpadi (VIT Area)",
    "address": "Chittoor Main Road, Katpadi",
    "price": 8500,
    "monthlyRent": 8500,
    "distanceKm": 0.5,
    "commute": "6 min walk to VIT Vellore Main Gate",
    "score": 91,
    "verifiedReviews": 45,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Wi-Fi",
      "AC / Non-AC Rooms",
      "3 Meals (South & North Indian options)",
      "RO Water Coolers",
      "Automatic Washing Machines",
      "Power Backup"
    ],
    "securityFeatures": [
      "Biometric Fingerprint Gate Entry",
      "24/7 CCTV in Entrances and Corridors",
      "Resident Female Warden",
      "Two Stationed Night Guards",
      "Emergency Contact Linkage with Local Katpadi Police"
    ],
    "images": [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "vit-vellore",
        "name": "VIT Vellore (Vellore Institute of Technology)",
        "distanceKm": 0.5,
        "commute": "6 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Katpadi Junction Railway Station",
        "distanceKm": 0.7,
        "commute": "8 min walk"
      }
    ],
    "coordinates": {
      "lat": 12.973,
      "lng": 79.153
    },
    "lat": 12.973,
    "lng": 79.153,
    "isDemo": true
  },
  {
    "id": "christ-koramangala-studio",
    "name": "Kaveri Studio for Women",
    "type": "Apartment",
    "city": "Bengaluru",
    "state": "Karnataka",
    "locality": "Koramangala",
    "area": "Koramangala",
    "address": "Hosur Road, DRC Post, Koramangala",
    "price": 17500,
    "monthlyRent": 17500,
    "distanceKm": 0.3,
    "commute": "4 min walk to Christ University Main Gate",
    "score": 93,
    "verifiedReviews": 56,
    "womenOnly": true,
    "meals": false,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "High-speed Fiber Wi-Fi",
      "Air Conditioning",
      "Organic Breakfast & Dinner",
      "100% Inverter Backup",
      "Housekeeping & Laundry",
      "Study Pods & Co-working Lounge"
    ],
    "securityFeatures": [
      "App-controlled Digital Door Locks",
      "24/7 Guarded Front Desk & Concierge",
      "CCTV Monitoring on All Floors",
      "Resident Female Manager",
      "Fire Safety Sprinklers & Smoke Detectors"
    ],
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "christ-university-bengaluru",
        "name": "Christ University, Bengaluru",
        "distanceKm": 0.3,
        "commute": "4 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Dairy Circle Bus Terminus",
        "distanceKm": 0.5,
        "commute": "6 min walk"
      },
      {
        "name": "Rashtreeya Vidyalaya Road Metro",
        "distanceKm": 2.1,
        "commute": "8 min cab"
      }
    ],
    "coordinates": {
      "lat": 12.936,
      "lng": 77.608
    },
    "lat": 12.936,
    "lng": 77.608,
    "isDemo": true
  },
  {
    "id": "symbiosis-viman-nagar-pg",
    "name": "Sahyadri Women's Enclave",
    "type": "PG",
    "city": "Pune",
    "state": "Maharashtra",
    "locality": "Viman Nagar",
    "area": "Viman Nagar",
    "address": "Clover Park, Viman Nagar",
    "price": 14000,
    "monthlyRent": 14000,
    "distanceKm": 0.8,
    "commute": "10 min walk to Symbiosis Viman Nagar Campus",
    "score": 89,
    "verifiedReviews": 42,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Wi-Fi",
      "Air Conditioned Rooms",
      "3 Meals Included",
      "Power Backup",
      "Washing Machines",
      "Attached Balconies"
    ],
    "securityFeatures": [
      "24/7 Gated Society Security Checkpoint",
      "CCTV Monitoring Across Gates & Corridors",
      "Female Warden On-Site",
      "Night Security Guard",
      "Visitor Entry Pass Required"
    ],
    "images": [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "symbiosis-pune",
        "name": "Symbiosis International University, Pune",
        "distanceKm": 0.8,
        "commute": "10 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Viman Nagar Metro Station (Pune Metro)",
        "distanceKm": 0.6,
        "commute": "7 min walk"
      },
      {
        "name": "Pune International Airport",
        "distanceKm": 2.5,
        "commute": "10 min cab"
      }
    ],
    "coordinates": {
      "lat": 18.567,
      "lng": 73.915
    },
    "lat": 18.567,
    "lng": 73.915,
    "isDemo": true
  },
  {
    "id": "iit-bombay-powai-residence",
    "name": "Powai Greens Serviced Living",
    "type": "Apartment",
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Powai",
    "area": "Powai",
    "address": "Central Avenue, Hiranandani Gardens, Powai",
    "price": 21000,
    "monthlyRent": 21000,
    "distanceKm": 0.9,
    "commute": "10 min walk to IIT Bombay Main Gate",
    "score": 94,
    "verifiedReviews": 50,
    "womenOnly": true,
    "meals": false,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Gigabit Fiber Wi-Fi",
      "Air Conditioned Suites",
      "Modular Kitchenette",
      "Housekeeping Service",
      "Washing Machine & Dryer",
      "Fitness Center & Swimming Pool"
    ],
    "securityFeatures": [
      "24/7 Concierge & Uniformed Security",
      "Smart Keycard Elevator & Apartment Access",
      "Perimeter CCTV & Intercom Screening",
      "Fire Sprinklers & Smoke Detectors"
    ],
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "iit-bombay",
        "name": "IIT Bombay (Indian Institute of Technology)",
        "distanceKm": 0.9,
        "commute": "10 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Kanjurmarg Railway Station",
        "distanceKm": 2.2,
        "commute": "8 min auto"
      },
      {
        "name": "Powai Lake Bus Depot",
        "distanceKm": 0.4,
        "commute": "5 min walk"
      }
    ],
    "coordinates": {
      "lat": 19.121,
      "lng": 72.911
    },
    "lat": 19.121,
    "lng": 72.911,
    "isDemo": true
  },
  {
    "id": "jaipur-malviya-manor",
    "name": "Pink City Girls Residency",
    "type": "PG",
    "city": "Jaipur",
    "state": "Rajasthan",
    "locality": "Malviya Nagar",
    "area": "Malviya Nagar",
    "address": "Sector 3, Malviya Nagar",
    "price": 8500,
    "monthlyRent": 8500,
    "distanceKm": 1.2,
    "commute": "12 min walk / 4 min e-rickshaw to MNIT Jaipur",
    "score": 85,
    "verifiedReviews": 35,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Wi-Fi",
      "Air Cooled & AC Rooms",
      "3 Pure Veg Meals Included",
      "RO Water",
      "Washing Machine",
      "Power Backup"
    ],
    "securityFeatures": [
      "24/7 CCTV at Main Entry and Staircases",
      "Biometric Access System",
      "Resident Female Warden",
      "Night Guard at Gate",
      "Fire Extinguishers"
    ],
    "images": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "bits-pilani",
        "name": "MNIT / University Campuses, Jaipur",
        "distanceKm": 1.2,
        "commute": "12 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Gaurav Tower Bus Stop",
        "distanceKm": 0.5,
        "commute": "6 min walk"
      },
      {
        "name": "Gandhinagar Jaipur Railway Station",
        "distanceKm": 2.8,
        "commute": "8 min cab"
      }
    ],
    "coordinates": {
      "lat": 26.852,
      "lng": 75.815
    },
    "lat": 26.852,
    "lng": 75.815,
    "isDemo": true
  },
  {
    "id": "hyderabad-gachibowli-haven",
    "name": "Deccan Pearl Women's Living",
    "type": "PG",
    "city": "Hyderabad",
    "state": "Telangana",
    "locality": "Gachibowli",
    "area": "Gachibowli",
    "address": "Telecom Nagar, Gachibowli",
    "price": 13000,
    "monthlyRent": 13000,
    "distanceKm": 1.4,
    "commute": "12 min to DLF Cyber City / Univ of Hyderabad",
    "score": 90,
    "verifiedReviews": 44,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "Gigabit Wi-Fi",
      "Air Conditioning",
      "3 South & North Indian Meals",
      "100% Generator Backup",
      "Laundromat",
      "Gym & Terrace Lounge"
    ],
    "securityFeatures": [
      "24/7 CCTV in Corridors and Entry Gate",
      "RFID Smart Keycard Gate",
      "Stationed Night Guards",
      "Female Facility Manager",
      "Smoke Detectors and Fire Hydrants"
    ],
    "images": [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "bits-pilani",
        "name": "University of Hyderabad / IIIT Hyderabad",
        "distanceKm": 1.8,
        "commute": "6 min auto"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Raidurg Metro Station",
        "distanceKm": 2.4,
        "commute": "7 min auto"
      },
      {
        "name": "Gachibowli 'X' Roads Bus Stop",
        "distanceKm": 0.6,
        "commute": "7 min walk"
      }
    ],
    "coordinates": {
      "lat": 17.44,
      "lng": 78.361
    },
    "lat": 17.44,
    "lng": 78.361,
    "isDemo": true
  },
  {
    "id": "sunrise",
    "name": "Sunrise Residency PG",
    "type": "PG",
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "Paschim Vihar",
    "area": "Paschim Vihar",
    "address": "A-2 Block, Paschim Vihar",
    "price": 8500,
    "monthlyRent": 8500,
    "distanceKm": 1.1,
    "commute": "14 min walk to BVCOE",
    "score": 63,
    "verifiedReviews": 29,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [
      {
        "id": "rf-1",
        "level": "risk",
        "title": "Unlit lane after 8 pm",
        "text": "Lane from Paschim Vihar East metro is poorly lit after 8 pm.",
        "details": "The walk from Paschim Vihar East metro has no working streetlights. Reported by 4 verified residents, most recently 3 weeks ago.",
        "reply": "Two lights added at our gate and a streetlight request filed. Our guard meets residents at the metro after 8 pm — just call.",
        "date": "Oct 2026",
        "severity": "High"
      },
      {
        "id": "rf-2",
        "level": "warn",
        "title": "Slow deposit refunds",
        "text": "Two residents waited 3+ months for deposit refunds.",
        "details": "Two residents waited 3+ months for ₹15,000 deposits. One refunded after a complaint; one still open.",
        "reply": "Refund policy is now 30 days, in writing.",
        "date": "Sep 2026",
        "severity": "Medium"
      }
    ],
    "facilities": [
      "Wi-Fi",
      "Air Conditioning",
      "3 Meals Included",
      "Power Backup",
      "Washing Machine",
      "RO Drinking Water",
      "Geyser"
    ],
    "securityFeatures": [
      "24/7 CCTV in Corridors & Entry",
      "Biometric Gate Access",
      "Full-time Female Warden",
      "Night Security Guard",
      "Visitor Entry Logbook",
      "Fire Extinguishers on 1st & Ground Floor"
    ],
    "images": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "bvcoe-delhi",
        "name": "BVCOE (Bharati Vidyapeeth's College of Engineering)",
        "distanceKm": 1.1,
        "commute": "14 min walk"
      }
    ],
    "nearbyTransport": [
      {
        "name": "Paschim Vihar East Metro",
        "distanceKm": 0.8,
        "commute": "10 min walk"
      }
    ],
    "coordinates": {
      "lat": 28.6772,
      "lng": 77.1176
    },
    "lat": 28.6772,
    "lng": 77.1176,
    "isDemo": true
  },
  {
    "id": "lotus-nest",
    "name": "Lotus Nest Girls PG",
    "type": "PG",
    "city": "New Delhi",
    "state": "Delhi NCR",
    "locality": "Paschim Vihar",
    "area": "Paschim Vihar",
    "address": "B-3 Pocket 2, Paschim Vihar",
    "price": 11500,
    "monthlyRent": 11500,
    "distanceKm": 0.8,
    "commute": "10 min walk to BVCOE",
    "score": 86,
    "verifiedReviews": 41,
    "womenOnly": true,
    "meals": true,
    "tiffinNearby": true,
    "flags": [],
    "facilities": [
      "High-speed Wi-Fi",
      "Air Conditioned Rooms",
      "3 Home-cooked Meals",
      "100% Power Backup",
      "Automatic Washing Machines"
    ],
    "securityFeatures": [
      "Gated Colony with Guard Checkpoint",
      "Biometric Turnstile Entry",
      "32 Active HD CCTVs with 30-day backup",
      "Resident Female Warden",
      "Two Night Guards on Duty"
    ],
    "images": [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    "nearbyColleges": [
      {
        "id": "bvcoe-delhi",
        "name": "BVCOE (Bharati Vidyapeeth's College of Engineering)",
        "distanceKm": 0.8,
        "commute": "10 min walk"
      }
    ],
    "nearbyTransport": [],
    "coordinates": {
      "lat": 28.6745,
      "lng": 77.1132
    },
    "lat": 28.6745,
    "lng": 77.1132,
    "isDemo": true
  }
];

const TIFFINS = [
  {
    name: 'Maa Ki Rasoi Tiffins',
    food: 'Veg', meals: 'Lunch + dinner', pricePerMonth: 3200, trialPrice: 80,
    hygiene: 4.6, reviews: 58, womenRun: true, deliversToGate: true, distanceKm: 0.4
  },
  {
    name: 'Ghar Ka Khana by Sunita',
    food: 'Veg', meals: 'Dinner only', pricePerMonth: 1800, trialPrice: 70,
    hygiene: 4.4, reviews: 23, womenRun: true, deliversToGate: true, distanceKm: 0.7
  },
  {
    name: 'Annapurna Homestyle Kitchen',
    food: 'Veg & Jain', meals: 'Lunch + dinner', pricePerMonth: 3400, trialPrice: 90,
    hygiene: 4.8, reviews: 76, womenRun: true, deliversToGate: true, distanceKm: 0.5
  },
  {
    name: 'Punjabi Dhaba Tiffin Co.',
    food: 'Veg & non-veg', meals: 'Lunch + dinner', pricePerMonth: 3800, trialPrice: 100,
    hygiene: 3.6, reviews: 41, womenRun: false, deliversToGate: false, distanceKm: 1.2,
    note: '3 reviews mention late deliveries after 9 pm'
  }
];
