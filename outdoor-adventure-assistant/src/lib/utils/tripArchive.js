const STORAGE_KEY = 'outdoor_trip_archive';

export function generateTripId() {
  return 'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function saveTrip(tripData) {
  const trips = getAllTrips();
  const newTrip = {
    id: tripData.id || generateTripId(),
    createdAt: tripData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...tripData
  };
  trips.unshift(newTrip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return newTrip;
}

export function updateTrip(tripId, tripData) {
  const trips = getAllTrips();
  const index = trips.findIndex(t => t.id === tripId);
  if (index !== -1) {
    trips[index] = {
      ...trips[index],
      ...tripData,
      id: tripId,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return trips[index];
  }
  return null;
}

export function deleteTrip(tripId) {
  const trips = getAllTrips();
  const filtered = trips.filter(t => t.id !== tripId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function getTrip(tripId) {
  const trips = getAllTrips();
  return trips.find(t => t.id === tripId) || null;
}

export function getAllTrips() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function getTripsByType(type) {
  const trips = getAllTrips();
  return trips.filter(t => t.type === type);
}

export function createTripFromData(type, name, data, notes = '') {
  return {
    type,
    name,
    data,
    notes,
    isFavorite: false,
    tags: []
  };
}

export function toggleFavorite(tripId) {
  const trips = getAllTrips();
  const index = trips.findIndex(t => t.id === tripId);
  if (index !== -1) {
    trips[index].isFavorite = !trips[index].isFavorite;
    trips[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return trips[index];
  }
  return null;
}

export function addTag(tripId, tag) {
  const trips = getAllTrips();
  const index = trips.findIndex(t => t.id === tripId);
  if (index !== -1 && !trips[index].tags.includes(tag)) {
    trips[index].tags.push(tag);
    trips[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return trips[index];
  }
  return null;
}

export function removeTag(tripId, tag) {
  const trips = getAllTrips();
  const index = trips.findIndex(t => t.id === tripId);
  if (index !== -1) {
    trips[index].tags = trips[index].tags.filter(t => t !== tag);
    trips[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return trips[index];
  }
  return null;
}

export function getTripStats() {
  const trips = getAllTrips();
  const stats = {
    total: trips.length,
    byType: {},
    favorites: trips.filter(t => t.isFavorite).length,
    thisMonth: 0,
    totalDistance: 0,
    totalDuration: 0
  };

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  trips.forEach(trip => {
    stats.byType[trip.type] = (stats.byType[trip.type] || 0) + 1;
    
    const createdAt = new Date(trip.createdAt);
    if (createdAt >= thisMonthStart) {
      stats.thisMonth++;
    }

    if (trip.data && trip.data.distance) {
      stats.totalDistance += parseFloat(trip.data.distance) || 0;
    }
    if (trip.data && trip.data.duration) {
      stats.totalDuration += parseFloat(trip.data.duration) || 0;
    }
  });

  return stats;
}

export function exportTrips() {
  const trips = getAllTrips();
  const dataStr = JSON.stringify(trips, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `outdoor_trips_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importTrips(jsonData) {
  try {
    const newTrips = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (!Array.isArray(newTrips)) return false;
    
    const existingTrips = getAllTrips();
    const validTrips = newTrips.filter(t => t.id && t.type && t.data);
    
    const merged = [...validTrips, ...existingTrips];
    const unique = merged.filter((trip, index, self) =>
      index === self.findIndex(t => t.id === trip.id)
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    return true;
  } catch (e) {
    return false;
  }
}

export function clearAllTrips() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
