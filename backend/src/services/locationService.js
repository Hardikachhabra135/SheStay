const fs = require('fs');
const path = require('path');

const LOCATIONS_PATH = path.join(__dirname, '../data/locations.json');

function readLocationsData() {
  try {
    const raw = fs.readFileSync(LOCATIONS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[LocationService] Error reading locations.json:', err.message);
    return { states: [] };
  }
}

function getAllStates() {
  const data = readLocationsData();
  return data.states.map(s => ({
    name: s.name,
    code: s.code,
    cityCount: (s.cities || []).length
  }));
}

function getAllCities(stateName = null) {
  const data = readLocationsData();
  let cities = [];

  data.states.forEach(state => {
    if (!stateName || state.name.toLowerCase() === stateName.toLowerCase() || state.code.toLowerCase() === stateName.toLowerCase()) {
      (state.cities || []).forEach(city => {
        cities.push({
          ...city,
          state: state.name,
          stateCode: state.code
        });
      });
    }
  });

  return cities;
}

function searchLocations(query) {
  if (!query || !query.trim()) return [];
  const term = query.trim().toLowerCase();
  const data = readLocationsData();
  const results = [];

  data.states.forEach(state => {
    // Check if query matches state
    const matchesState = state.name.toLowerCase().includes(term);

    (state.cities || []).forEach(city => {
      const matchesCity = city.name.toLowerCase().includes(term);
      const matchedLocalities = (city.popularLocalities || []).filter(loc => loc.toLowerCase().includes(term));

      if (matchesCity || matchesState || matchedLocalities.length > 0) {
        results.push({
          city: city.name,
          state: state.name,
          stateCode: state.code,
          tier: city.tier,
          coordinates: city.coordinates,
          matchedLocalities: matchedLocalities.slice(0, 3),
          label: `${city.name}, ${state.name}`
        });
      }
    });
  });

  return results.slice(0, 10);
}

module.exports = {
  getAllStates,
  getAllCities,
  searchLocations
};

