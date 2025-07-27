import React from 'react';
import { OutbreakData } from '../types/outbreak';
import { Calendar, MapPin, AlertTriangle } from 'lucide-react';

interface TimelineProps {
  outbreaks: OutbreakData[];
  onTimelineClick?: (outbreak: OutbreakData) => void;
}

const Timeline: React.FC<TimelineProps> = ({ outbreaks, onTimelineClick }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityDotColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const sortedOutbreaks = [...outbreaks].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Helper to get relative time string
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Disease Outbreak Timeline</h3>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {sortedOutbreaks.map((outbreak, index) => (
          <div
            key={outbreak.id}
            className="relative flex gap-3 cursor-pointer"
            onClick={() => {
              if (typeof onTimelineClick === 'function') onTimelineClick(outbreak);
            }}
            title="Zoom to outbreak on map"
          >
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${getSeverityDotColor(outbreak.severity)}`} />
              {index < sortedOutbreaks.length - 1 && (
                <div className="w-px h-12 bg-gray-200 mt-2" />
              )}
            </div>
            {/* Timeline content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-gray-800">{outbreak.disease}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(outbreak.severity)}`}>
                    {outbreak.severity}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Crop:</span>
                    <span>{outbreak.crop}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{outbreak.region}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{getRelativeTime(outbreak.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;