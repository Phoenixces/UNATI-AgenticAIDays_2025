import { Loader } from '@googlemaps/js-api-loader';
import { OutbreakData } from '../types/outbreak';
import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
  outbreaks: OutbreakData[];
  onMarkerClick?: (outbreak: OutbreakData) => void;
  selectedOutbreak?: OutbreakData | null;
}

const MapView: React.FC<MapViewProps> = ({ outbreaks, onMarkerClick, selectedOutbreak }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#eae308ff';
      case 'Low': return '#22c55e';
      default: return '#2153b6ff';
    }
  };

  // Returns the marker icon path based on severity
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'src/images/red.png';
      case 'Medium':
        return 'src/images/yellow.png';
      case 'Low':
        return 'src/images/green.png';
      default:
        return '/red.png'; // fallback icon
    }
  };

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'AIzaSyC6PfW2fkuI552AuMqrjuXi19VMW3bWXTc',
        version: 'weekly',
        libraries: ['maps']
      });

      try {
        await loader.load();
        // banglore lat long 12.884733, 77.541865
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            //center: { lat: 23.5937, lng: 78.9629 }, // Center of India
            center: { lat: 12.884733, lng: 77.541865 }, // Center of Bangalore
            zoom: 10,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });
          
          setMap(mapInstance);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers and info windows
    markers.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(iw => iw.close());
    infoWindowsRef.current = [];

    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];


    outbreaks.forEach(outbreak => {
      const marker = new google.maps.Marker({
        position: { lat: outbreak.lat, lng: outbreak.lng },
        map: map,
        title: `${outbreak.disease} in ${outbreak.crop}`,
        icon: {
          url: getSeverityIcon(outbreak.severity),
          scaledSize: new google.maps.Size(32, 32),
        }
      });

      const infoWindowId = `info-window-${outbreak.id}`;
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div id="${infoWindowId}" class="p-3 max-w-xs">
            ${outbreak.imageUrl ? `<img src="${outbreak.imageUrl}" alt="${outbreak.disease}" class="w-full h-24 object-cover rounded mb-2" />` : ''}
            <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
              ${outbreak.imageUrl ? `<img src="${outbreak.imageUrl}" alt="${outbreak.disease}" class="w-8 h-8 rounded-full inline-block mr-2" />` : ''}
              ${outbreak.disease}
            </h3>
            <div class="space-y-1 text-sm">
              <p><span class="font-semibold">Crop:</span> ${outbreak.crop}</p>
              <p><span class="font-semibold">Severity:</span> 
                <span class="px-2 py-1 rounded text-xs text-white" 
                      style="background-color: ${getSeverityColor(outbreak.severity)}">
                  ${outbreak.severity}
                </span>
              </p>
              <p><span class="font-semibold">Region:</span> ${outbreak.region}</p>
              <p><span class="font-semibold">Date:</span> ${new Date(outbreak.date).toLocaleDateString()}</p>
              ${outbreak.farmer ? `<p><span class="font-semibold">Farmer:</span> ${outbreak.farmer}</p>` : ''}
              ${outbreak.description ? `<p class="mt-2 text-gray-600">${outbreak.description}</p>` : ''}
            </div>
          </div>
        `
      });

      let isOverMarker = false;
      let isOverInfoWindow = false;
      let closeTimer: ReturnType<typeof setTimeout> | null = null;

      const openInfoWindow = () => {
        infoWindow.open(map, marker);
        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const infoDiv = document.getElementById(infoWindowId);
          if (infoDiv) {
            infoDiv.addEventListener('mouseenter', () => {
              isOverInfoWindow = true;
              if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
              }
            });
            infoDiv.addEventListener('mouseleave', () => {
              isOverInfoWindow = false;
              if (!isOverMarker) {
                closeTimer = setTimeout(() => infoWindow.close(), 100);
              }
            });
          }
        });
      };

      marker.addListener('mouseover', () => {
        isOverMarker = true;
        openInfoWindow();
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      });
      marker.addListener('mouseout', () => {
        isOverMarker = false;
        // Only close if not over infoWindow
        setTimeout(() => {
          if (!isOverInfoWindow) infoWindow.close();
        }, 100);
      });
      marker.addListener('click', () => {
        openInfoWindow();
        onMarkerClick?.(outbreak);
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setMarkers(newMarkers);
    infoWindowsRef.current = newInfoWindows;
  }, [map, outbreaks, onMarkerClick]);

  // Effect to zoom and show info window when selectedOutbreak changes
  useEffect(() => {
    if (!map || !selectedOutbreak || markers.length === 0) return;
    // Find the marker and infoWindow for the selected outbreak
    const idx = outbreaks.findIndex(o => o.id === selectedOutbreak.id);
    if (idx === -1) return;
    const marker = markers[idx];
    const infoWindow = infoWindowsRef.current[idx];
    if (marker && infoWindow) {
      map.panTo(marker.getPosition()!);
      map.setZoom(14);
      infoWindowsRef.current.forEach(iw => iw.close());
      infoWindow.open(map, marker);
    }
  }, [selectedOutbreak, map, markers, outbreaks]);

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading map... (Google Maps API key required)</p>
        </div>
      )}
    </div>
  );
};

export default MapView;