import React, { useState, useMemo } from 'react';
import { OutbreakData } from '../types/outbreak';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

interface DataTableProps {
  outbreaks: OutbreakData[];
}

type SortKey = keyof OutbreakData;
type SortOrder = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ outbreaks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-700 bg-red-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = outbreaks.filter(outbreak =>
      Object.values(outbreak).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      let comparison = 0;
      if (sortKey === 'date') {
        comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
      } else {
        comparison = aValue.toString().localeCompare(bValue.toString());
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [outbreaks, searchTerm, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Outbreak Reports
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search outbreaks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'farmer', label: 'Farmer' },
                { key: 'crop', label: 'Crop' },
                { key: 'disease', label: 'Disease' },
                { key: 'severity', label: 'Severity' },
                { key: 'date', label: 'Date' },
                { key: 'region', label: 'Region' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon column={key as SortKey} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((outbreak, index) => (
              <tr key={outbreak.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {outbreak.farmer || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {outbreak.crop}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {outbreak.disease}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(outbreak.severity)}`}>
                    {outbreak.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(outbreak.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {outbreak.region}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No outbreaks found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;