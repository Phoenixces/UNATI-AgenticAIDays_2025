import React from 'react';
import { KPIData } from '../types/outbreak';
import { TrendingUp, Target, MapPin, Clock } from 'lucide-react';

interface KPICardsProps {
  data: KPIData;
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Total Outbreaks',
      value: data.totalOutbreaks.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Most Affected Crop',
      value: data.mostAffectedCrop,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '450 cases',
      changeType: 'neutral'
    },
    {
      title: 'Most Affected Region',
      value: data.mostAffectedRegion,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '28.3%',
      changeType: 'increase'
    },
    {
      title: 'Latest Outbreak',
      value: data.latestOutbreakTime,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 'Active',
      changeType: 'active'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </h3>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      card.changeType === 'increase'
                        ? 'text-green-700 bg-green-100'
                        : card.changeType === 'active'
                        ? 'text-red-700 bg-red-100'
                        : 'text-gray-700 bg-gray-100'
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;