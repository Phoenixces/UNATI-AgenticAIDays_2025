import { OutbreakData, KPIData, ChartData } from '../types/outbreak';

export const mockOutbreaks: OutbreakData[] = [
  {
    id: '1',
    lat: 26.85,
    lng: 80.95,
    disease: 'Blight',
    crop: 'Tomato',
    severity: 'High',
    date: '2025-01-24',
    region: 'Lucknow, UP',
    farmer: 'Rajesh Kumar',
    description: 'Severe tomato blight affecting 15 acres'
  },
  {
    id: '2',
    lat: 28.61,
    lng: 77.23,
    disease: 'Rust',
    crop: 'Wheat',
    severity: 'Medium',
    date: '2025-01-23',
    region: 'Delhi, DL',
    farmer: 'Priya Singh',
    description: 'Wheat rust spreading across multiple fields'
  },
  {
    id: '3',
    lat: 25.32,
    lng: 85.13,
    disease: 'Brown Spot',
    crop: 'Rice',
    severity: 'High',
    date: '2025-01-22',
    region: 'Patna, Bihar',
    farmer: 'Amit Sharma',
    description: 'Rice brown spot in monsoon-affected areas'
  },
  {
    id: '4',
    lat: 22.57,
    lng: 88.36,
    disease: 'Downy Mildew',
    crop: 'Cucumber',
    severity: 'Low',
    date: '2025-01-21',
    region: 'Kolkata, WB',
    farmer: 'Sunita Das',
    description: 'Minor cucumber downy mildew outbreak'
  },
  {
    id: '5',
    lat: 19.08,
    lng: 72.88,
    disease: 'Anthracnose',
    crop: 'Mango',
    severity: 'Medium',
    date: '2025-01-20',
    region: 'Mumbai, MH',
    farmer: 'Vikram Patel',
    description: 'Mango anthracnose in coastal regions'
  },
  {
    id: '6',
    lat: 13.08,
    lng: 80.27,
    disease: 'Bacterial Wilt',
    crop: 'Tomato',
    severity: 'High',
    date: '2025-01-19',
    region: 'Chennai, TN',
    farmer: 'Lakshmi Narayanan',
    description: 'Bacterial wilt outbreak in greenhouse tomatoes'
  },
  {
    id: '7',
    lat: 13.2908,
    lng: 77.5375,
    disease: 'Leaf Blight',
    crop: 'Maize',
    severity: 'High',
    date: '2025-07-21',
    region: 'Doddaballapur, Karnataka',
    farmer: 'Ravi Gowda',
    description: 'Symptoms of leaf blight observed in maize field.'
  },
  {
    id: '8',
    lat: 12.5468,
    lng: 77.4202,
    disease: 'Powdery Mildew',
    crop: 'Beans',
    severity: 'Low',
    date: '2025-07-22',
    region: 'Kanakapura, Karnataka',
    farmer: 'Meena Patil',
    description: 'Initial stage of powdery mildew seen on bean leaves.'
  },
  {
    id: '9',
    lat: 12.7229,
    lng: 77.2814,
    disease: 'Bacterial Leaf Spot',
    crop: 'Chilli',
    severity: 'High',
    date: '2025-07-20',
    region: 'Ramanagara, Karnataka',
    farmer: 'Ramesh Naik',
    description: 'Severe bacterial leaf spot found in chilli plantation.'
  },
  {
    id: '10',
    lat: 12.9576,
    lng: 77.2226,
    disease: 'Late Blight',
    crop: 'Tomato',
    severity: 'High',
    date: '2025-07-23',
    region: 'Magadi, Karnataka',
    farmer: 'Sunita Devi',
    description: 'Rapid spread of late blight affecting tomato yield.',
    imageUrl:'https://res.cloudinary.com/djlnbmhwn/image/upload/v1753555457/5431idea99rice1_si4jb1.jpg'
  },
  {
    id: '11',
    lat: 12.6514,
    lng: 77.2060,
    disease: 'Rust',
    crop: 'Wheat',
    severity: 'High',
    date: '2025-07-24',
    region: 'Channapatna, Karnataka',
    farmer: 'Manjunath R',
    description: 'Rust patches developing on lower wheat leaves.',
    imageUrl:'https://res.cloudinary.com/djlnbmhwn/image/upload/v1753555500/d41586-023-01465-4_25279380_o3mp3c.jpg',
  },
  {
    id: '12',
    lat: 12.7090,
    lng: 77.6955,
    disease: 'Sheath Rot',
    crop: 'Paddy',
    severity: 'Low',
    date: '2025-07-25',
    region: 'Anekal, Karnataka',
    farmer: 'Kavitha S',
    description: 'Mild sheath rot symptoms in early paddy growth stage.'
  }
];

export const mockKPIData: KPIData = {
  totalOutbreaks: 1203,
  mostAffectedCrop: 'Rice',
  mostAffectedRegion: 'Karnatka',
  latestOutbreakTime: '3 hrs ago'
};

export const mockChartData: ChartData = {
  cropOutbreaks: [
    { crop: 'Rice', count: 450 },
    { crop: 'Wheat', count: 320 },
    { crop: 'Tomato', count: 280 },
    { crop: 'Corn', count: 153 },
    { crop: 'Cotton', count: 89 },
    { crop: 'Sugarcane', count: 67 }
  ],
  diseaseDistribution: [
    { disease: 'Blight', count: 35 },
    { disease: 'Rust', count: 28 },
    { disease: 'Brown Spot', count: 22 },
    { disease: 'Downy Mildew', count: 15 }
  ],
  outbreaksOverTime: [
    { date: '2025-01-18', count: 45 },
    { date: '2025-01-19', count: 52 },
    { date: '2025-01-20', count: 38 },
    { date: '2025-01-21', count: 61 },
    { date: '2025-01-22', count: 73 },
    { date: '2025-01-23', count: 47 },
    { date: '2025-01-24', count: 58 }
  ]
};