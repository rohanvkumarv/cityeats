
import Link from 'next/link';
import Image from 'next/image';
import { RiStarFill, RiWifiLine, RiParkingBoxLine, RiSnowflakeLine } from 'react-icons/ri';
import { FaUmbrella } from 'react-icons/fa';

export default function RestaurantCard({ restaurant }) {
  const {
    id,
    name,
    cuisine,
    rating,
    hasAC,
    hasRooftop,
    hasWifi,
    hasParking,
    images
  } = restaurant;

  // Find the main image or use the first one
  const mainImage = images?.find(img => img.isMain) || images?.[0];
  const imageUrl = mainImage?.imageUrl || '/images/restaurant-placeholder.jpg';

  return (
    <Link href={`/restaurants/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Restaurant Image */}
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Restaurant Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            
            {/* Rating */}
            {rating && (
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-sm">
                <RiStarFill className="text-yellow-500 mr-1" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {cuisine?.map((item, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Amenities Icons */}
          <div className="flex space-x-3 text-gray-500 mt-3">
            {hasAC && (
              <div className="flex flex-col items-center text-xs">
                <RiSnowflakeLine className="text-blue-500" />
                <span>AC</span>
              </div>
            )}
            {hasRooftop && (
              <div className="flex flex-col items-center text-xs">
                <FaUmbrella className="text-orange-500" />
                <span>Rooftop</span>
              </div>
            )}
            {hasWifi && (
              <div className="flex flex-col items-center text-xs">
                <RiWifiLine className="text-green-500" />
                <span>WiFi</span>
              </div>
            )}
            {hasParking && (
              <div className="flex flex-col items-center text-xs">
                <RiParkingBoxLine className="text-purple-500" />
                <span>Parking</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}