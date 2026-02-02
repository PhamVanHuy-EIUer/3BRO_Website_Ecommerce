"use client";

import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "@/lib/leafletIcon";

interface LeafletMapProps {
  latitude: number;
  longtitude: number;
  radius: number;
  setLatitude: (lat: number) => void;
  setLongtitude: (lng: number) => void;
  setAddress: (address: string) => void;
}

const DEFAULT_CENTER = {
  lat: 10.8231,
  lng: 106.6297,
};

function PanTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longtitude,
  radius,
  setLatitude,
  setLongtitude,
  setAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const center =
    latitude && longtitude
      ? { lat: latitude, lng: longtitude }
      : DEFAULT_CENTER;

  // Hàm lấy địa chỉ từ tọa độ (Reverse Geocoding)
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/nominatim/reverse?lat=${lat}&lon=${lng}`);
      if (!res.ok) return;

      const data = await res.json();
      if (data.display_name) {
        setAddress(cleanAddress(data.display_name));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Hàm tìm kiếm địa điểm
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Thêm "Vietnam" hoặc "Ho Chi Minh" vào query để tìm chính xác hơn
      let searchQuery = query;

      // Nếu query chứa "đường", "street", hoặc các từ khóa đường phố
      const streetKeywords = ["đường", "street", "phố", "road", "avenue"];
      const hasStreetKeyword = streetKeywords.some((keyword) =>
        query.toLowerCase().includes(keyword),
      );

      // Nếu chưa có địa danh cụ thể, thêm "Ho Chi Minh City, Vietnam"
      if (
        !query.toLowerCase().includes("vietnam") &&
        !query.toLowerCase().includes("hồ chí minh") &&
        !query.toLowerCase().includes("ho chi minh")
      ) {
        searchQuery = `${query}, Ho Chi Minh City, Vietnam`;
      }

      const response = await fetch(
        `/api/nominatim/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      // Lọc và sắp xếp kết quả
      let filteredResults = data;

      // Nếu tìm đường, ưu tiên các kết quả có type là road/street
      if (hasStreetKeyword) {
        const roadResults = data.filter(
          (item: any) =>
            item.type === "road" ||
            item.type === "street" ||
            item.type === "residential" ||
            item.class === "highway",
        );

        // Nếu có kết quả đường, ưu tiên chúng
        if (roadResults.length > 0) {
          filteredResults = [
            ...roadResults,
            ...data.filter((item: any) => !roadResults.includes(item)),
          ].slice(0, 10);
        }
      }

      setSearchResults(filteredResults.slice(0, 8));
      setShowResults(true);
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Lấy địa chỉ khi tọa độ thay đổi
  useEffect(() => {
    if (latitude && longtitude) {
      getAddressFromCoords(latitude, longtitude);
    }
  }, [latitude, longtitude]);

  // Xử lý khi chọn kết quả tìm kiếm
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setLatitude(lat);
    setLongtitude(lng);
    setAddress(cleanAddress(result.display_name));
    setSearchQuery("");
    setShowResults(false);
    setSearchResults([]);
  };

  const cleanAddress = (address: string) => {
    return address.replace(/,\s*\d{4,6}(?=,)/g, "");
  };

  // Xử lý khi kéo marker
  const handleMarkerDragEnd = (e: any) => {
    const pos = e.target.getLatLng();
    setLatitude(pos.lat);
    setLongtitude(pos.lng);
    getAddressFromCoords(pos.lat, pos.lng);
  };

  return (
    <div className="relative">
      {/* Search Box */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-96">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm: Đường Lê Lợi, Nguyễn Huệ, Bến Thành..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectResult(result)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    {/* Icon based on type */}
                    <span className="text-lg mt-0.5">
                      {result.type === "road" ||
                      result.type === "street" ||
                      result.type === "residential"
                        ? "🛣️"
                        : result.type === "building"
                          ? "🏢"
                          : "📍"}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {result.display_name}
                      </div>
                      {result.type && (
                        <div className="text-xs text-gray-500 mt-1">
                          {result.type === "road" || result.type === "street"
                            ? "Đường"
                            : result.type === "residential"
                              ? "Khu dân cư"
                              : result.type === "building"
                                ? "Tòa nhà"
                                : result.type}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {showResults &&
            searchResults.length === 0 &&
            searchQuery.trim() &&
            !isSearching && (
              <div className="mt-2 bg-white rounded-lg shadow-lg p-4">
                <p className="text-sm text-gray-500 text-center">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Thử thêm "đường" hoặc tên quận/thành phố
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="w-full h-96"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <PanTo lat={center.lat} lng={center.lng} />

        <Marker
          draggable
          position={[center.lat, center.lng]}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
        />

        <Circle
          center={[center.lat, center.lng]}
          radius={radius}
          pathOptions={{
            color: "red",
            fillOpacity: 0.35,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
