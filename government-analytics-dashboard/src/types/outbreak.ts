export interface OutbreakData {
  id: string;
  lat: number;
  lng: number;
  disease: string;
  crop: string;
  severity: 'High' | 'Medium' | 'Low';
  date: string;
  region: string;
  farmer?: string;
  description?: string;
  imageUrl?: string;
}

export interface KPIData {
  totalOutbreaks: number;
  mostAffectedCrop: string;
  mostAffectedRegion: string;
  latestOutbreakTime: string;
}

export interface ChartData {
  cropOutbreaks: Array<{ crop: string; count: number }>;
  diseaseDistribution: Array<{ disease: string; count: number }>;
  outbreaksOverTime: Array<{ date: string; count: number }>;
}