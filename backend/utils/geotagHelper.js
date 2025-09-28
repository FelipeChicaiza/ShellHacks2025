
// A simple mapping of city names to their coordinates
const cityCoordinates = {
  "Miami": { lat: 25.7617, lng: -80.1918 },
  "New York": { lat: 40.7128, lng: -74.0060 }, // NYC
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Austin": { lat: 30.2672, lng: -97.7431 },
  "Madrid": { lat: 40.4168, lng: -3.7038 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "Rome": { lat: 41.9028, lng: 12.4964 },
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  "Maracaibo": { lat: 10.6545, lng: -71.6533 },
  "Guayaquil": { lat: -2.170998, lng: -79.922359 },
};


export function getGeotag(city) {
  return cityCoordinates[city] || null; // return null if city not found
}