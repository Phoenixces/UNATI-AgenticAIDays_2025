import React, { useState, useEffect } from 'react';
import { Map, BarChart3, Bell, Settings } from 'lucide-react';
import MapView from './components/MapView';
import Timeline from './components/Timeline';
import KPICards from './components/KPICards';
import Charts from './components/Charts';
import DataTable from './components/DataTable';
import { OutbreakData, KPIData, ChartData } from './types/outbreak';
import { mockOutbreaks, mockKPIData, mockChartData } from './data/mockData';

type TabType = 'map' | 'analytics';


function App() {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [outbreaks, setOutbreaks] = useState<OutbreakData[]>([]);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakData | null>(null);

  // Mock API calls - replace with actual API endpoints later
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOutbreaks(mockOutbreaks);
        setKpiData(mockKPIData);
        setChartData(mockChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkerClick = (outbreak: OutbreakData) => {
    setSelectedOutbreak(outbreak);
    // Optionally: scroll timeline to this outbreak, highlight, etc.
  };

  const handleTimelineClick = (outbreak: OutbreakData) => {
    setSelectedOutbreak(outbreak);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Disease Outbreak Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Map View
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Map and Timeline Section */}
            <div className="flex flex-col lg:flex-row gap-6 h-96 lg:h-[500px]">
              <div className="w-full lg:w-[70%]">
                <MapView 
                  outbreaks={outbreaks} 
                  onMarkerClick={handleMarkerClick}
                  selectedOutbreak={selectedOutbreak}
                />
              </div>
              <div className="w-full lg:w-[30%]">
                <Timeline 
                  outbreaks={outbreaks} 
                  onTimelineClick={handleTimelineClick}
                />
              </div>
            </div>

            {/* KPI Cards */}
            {kpiData && <KPICards data={kpiData} />}

            {/* Data Table */}
            <DataTable outbreaks={outbreaks} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            {kpiData && <KPICards data={kpiData} />}

            {/* Charts */}
            {chartData && <Charts data={chartData} />}

            {/* Data Table */}
            <DataTable outbreaks={outbreaks} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;