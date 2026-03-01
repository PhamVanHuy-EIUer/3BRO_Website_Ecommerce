"use client";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import { ApiResponse } from "@/models/ApiResponse";
import { UpdateProfile } from "@/models/UpdateProfile";
import { userService } from "@/services/user.service";
import { motion } from "framer-motion";
import LoadingUser from "@/components/LoadingUser";
import { COLORS } from "@/data/data";
import { LocationEdit, MapIcon, SearchIcon } from "lucide-react";

// Import LeafletMap với dynamic import để tránh lỗi "window is not defined"
const LeafletMap = dynamic(
  () => import("@/components/user/UserMenu/AddressContent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Map...</p>
        </div>
      </div>
    ),
  },
);

export default function EditProfile() {
  const [address, setAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  //   const [locationError, setLocationError] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const { user, refreshAuth, authorized } = useAuth();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const editRouter = useRouter();
  const [loading, setLoading] = useState(false);
  const { bgRed } = COLORS;
  const [latitude, setLatitude] = useState(user?.latitude || 10.8231);
  const [longtitude, setLongtitude] = useState(user?.longtitude || 106.6297);
  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    detailedAddress: "",
    ward: "",
    district: "",
    city: "Hồ Chí Minh",
    customCity: "",
    // notes: "",
  });
  const parseVNAddress = (address: string) => {
    if (!address) return null;

    const parts = address.split(",").map((p) => p.trim());

    const ward = parts.find((p) => /(phường|xã|thị trấn)/i.test(p)) || "";

    const district =
      parts.find(
        (p) =>
          /(quận|huyện|thành phố|thị xã)/i.test(p) &&
          !/(hà nội|hồ chí minh|đà nẵng|cần thơ|hải phòng)/i.test(p),
      ) || "";

    const city =
      parts.find((p) =>
        /(hà nội|hồ chí minh|đà nẵng|cần thơ|hải phòng)/i.test(p),
      ) ||
      parts.find((p) => /(tỉnh)/i.test(p)) ||
      "";

    const detailedAddress =
      parts.find(
        (p) => /\d+/.test(p) && /(đường|phố|quốc lộ|tỉnh lộ)/i.test(p),
      ) ||
      parts[0] ||
      "";

    return {
      detailedAddress,
      ward,
      district,
      city,
    };
  };

  useEffect(() => {
    console.log("Here", user);

    setFormData((prev) => ({
      ...prev,
      fullName: user?.fullName || prev.fullName,
      phoneNumber: user?.phone || prev.phoneNumber,
      email: user?.email || prev.email,
    }));

    if (!user?.address) return;
    setAddress(user.address);

    const parsed = parseVNAddress(user.address);
    if (!parsed) return;

    setFormData((prev) => ({
      ...prev,
      detailedAddress: parsed.detailedAddress,
      ward: parsed.ward,
      district: parsed.district,
      city: parsed.city || prev.city,
    }));
  }, [user]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      api.error({
        title: "Your browser does not support geolocation",
        duration: 2,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongtitude(lng);

        // Gọi reverse geocoding để lấy địa chỉ từ tọa độ
        try {
          const res = await fetch(
            `/api/nominatim/reverse?lat=${lat}&lon=${lng}`,
          );

          if (!res.ok) throw new Error("Reverse geocoding failed");

          const data = await res.json();

          if (data && data.display_name) {
            setAddress(data.display_name);

            // Parse địa chỉ và cập nhật form
            const parsed = parseVNAddress(data.display_name);
            if (parsed) {
              setFormData((prev) => ({
                ...prev,
                detailedAddress: parsed.detailedAddress,
                ward: parsed.ward,
                district: parsed.district,
                city: parsed.city || prev.city,
              }));
            }
          }
        } catch (err) {
          console.error("Error getting address from coordinates:", err);
          // Vẫn giữ tọa độ ngay cả khi không lấy được địa chỉ
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            api.error({
              title: "User denied the request for Location access",
              duration: 2,
            });
            break;
          case error.POSITION_UNAVAILABLE:
            api.error({
              title: "Location information is unavailable",
              duration: 2,
            });
            break;
          case error.TIMEOUT:
            api.error({
              title: "The request to get user location timed out",
              duration: 2,
            });
            break;
          default:
            api.error({
              title: "Error getting user location",
              duration: 2,
            });
        }
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        // timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // const handleUpdateUser = async () => {
  //   const newProfile: UpdateProfile = {
  //     fullName: formData.fullName,
  //     phone: formData.phoneNumber,
  //     address: address,
  //     latitude: latitude,
  //     longtitude: longtitude,
  //   };
  //   const res: ApiResponse<UpdateProfile> =
  //     await userService.updateProfileByUser(newProfile);
  // };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.preventDefault;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchAddressOnMap = async () => {
    const cityName =
      formData.city === "Khác" ? formData.customCity : formData.city;

    const fullAddress = [
      formData.detailedAddress,
      formData.ward,
      formData.district,
      cityName,
      "Vietnam",
    ]
      .filter(Boolean)
      .join(", ");

    if (!fullAddress.trim() || fullAddress === "Vietnam") {
      alert("Please enter a detailed address");
      return;
    }

    if (formData.city === "Khác" && !formData.customCity.trim()) {
      alert("Please enter the city or province name");
      return;
    }

    setIsLoadingLocation(true);

    try {
      const res = await fetch(
        `/api/nominatim/search?q=${encodeURIComponent(fullAddress)}`,
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];

        setLatitude(parseFloat(lat));
        setLongtitude(parseFloat(lon));
        setAddress(display_name);
      } else {
        api.error({ title: "Address not found on the map", duration: 2 });
      }
    } catch (err) {
      console.error(err);
      api.error({ title: "An error occurred", duration: 2 });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UpdateProfile = {
      fullName: formData.fullName,
      phone: formData.phoneNumber,
      address: address,
      latitude: latitude,
      longtitude: longtitude,
    };
    try {
      setLoading(true);
      const res: ApiResponse<UpdateProfile> =
        await userService.updateProfileByUser(newProfile);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (res.isSuccess) {
        api.success({
          title: "Success",
          description: "Profile information updated successfully",
          duration: 2,
        });
        await refreshAuth();
        // Redirect back to the page user came from (e.g. product page)
        if (returnUrl) {
          // Wait for React to commit the updated user state before navigating
          await new Promise((resolve) => setTimeout(resolve, 500));
          editRouter.push(returnUrl);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      {loading && <LoadingUser />}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Add New Address</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0912345678"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                    disabled
                    readOnly
                  />
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-4">
                  Detailed Address
                </h2>

                {/* Detailed Address */}
                <div>
                  <label
                    htmlFor="detailedAddress"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="detailedAddress"
                    name="detailedAddress"
                    value={formData.detailedAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Đường Lê Lợi"
                  />
                </div>

                {/* Ward and District */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ward"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ward / Commune <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phường Bến Nghé"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      District
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Quận 1"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City / Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Biên Hòa">Biên Hòa</option>
                    <option value="Nha Trang">Nha Trang</option>
                    <option value="Vũng Tàu">Vũng Tàu</option>
                    <option value="Khác">Khác (Tự nhập)</option>
                  </select>
                </div>

                {/* Custom City Input - Only show when "Khác" is selected */}
                {formData.city === "Khác" && (
                  <div className="animate-fadeIn">
                    <label
                      htmlFor="customCity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter City / Province{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="customCity"
                      name="customCity"
                      value={formData.customCity}
                      onChange={handleInputChange}
                      required={formData.city === "Khác"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Đà Lạt, Huế, Quy Nhơn..."
                    />
                  </div>
                )}

                {/* Search Address on Map Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={searchAddressOnMap}
                    disabled={isLoadingLocation}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoadingLocation ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Searching location...
                      </>
                    ) : (
                      <>
                        <SearchIcon size={18} />
                        Search location on map
                      </>
                    )}
                  </button>
                </div>

                {/* Notes */}
                {/* <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú thêm về địa chỉ (gần cửa hàng nào, cách nhận diện...)"
                />
              </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full text-white px-6 py-3 rounded hover:bg-[#cf3636] transition cursor-pointer ${bgRed}`}
                >
                  Update Profile
                </button>
              </form>
            </div>

            {/* Right Column - Map and Info */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Select Location on Map
                  </h2>

                  {/* Get Current Location Button */}
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2ec264] text-white rounded-md hover:bg-[#23a05b] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
                  >
                    {isLoadingLocation ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Loading current location...
                      </>
                    ) : (
                      <>
                        <MapIcon size={18} />
                        Current Location
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {/* {locationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {locationError}
                    </p>
                  </div>
                )} */}

                <LeafletMap
                  latitude={latitude}
                  longtitude={longtitude}
                  setLatitude={setLatitude}
                  setLongtitude={setLongtitude}
                  setAddress={setAddress}
                  radius={500}
                />

                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-600">
                      Address from map:
                    </span>
                    <span className="text-sm">{address || "Đang tải..."}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500">
                        Latitude:
                      </span>
                      <span className="text-sm">{latitude.toFixed(6)}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500">
                        Longtitude:
                      </span>
                      <span className="text-sm">{longtitude.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
