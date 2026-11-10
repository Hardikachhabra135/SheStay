const fs = require('fs');
const path = require('path');
const institutionService = require('./institutionService');

const DATA_PATH = path.join(__dirname, '../data/properties.json');

// Haversine formula for exact distance between two coordinates
function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function readProperties() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[PropertyService] Error reading properties.json:', err.message);
    return [];
  }
}

function getAllProperties() {
  return readProperties();
}

function getPropertyById(id) {
  const properties = readProperties();
  return properties.find(p => p.id.toLowerCase() === id.toLowerCase()) || null;
}

function searchAndFilterProperties(criteria = {}) {
  const {
    q,
    city,
    state,
    area,
    locality,
    college,
    institutionId,
    radius,
    type,
    minPrice,
    maxPrice,
    minScore,
    meals,
    tiffinNearby,
    nearKm,
    sortBy,
    page = 1,
    limit = 50
  } = criteria;

  let properties = readProperties();

  // 1. Resolve Target Institution (if user searched or filtered by college)
  let targetInstitution = null;
  const collegeQuery = college || institutionId;
  if (collegeQuery && collegeQuery.trim()) {
    targetInstitution = institutionService.getInstitutionById(collegeQuery) ||
                        institutionService.findBestMatchingInstitution(collegeQuery);
  } else if (q && q.trim()) {
    // Check if omni query matches an institution
    const matchedInst = institutionService.findBestMatchingInstitution(q.trim());
    if (matchedInst) {
      targetInstitution = matchedInst;
    }
  }

  // 2. Compute dynamic distance to college if institution resolved
  if (targetInstitution && targetInstitution.coordinates) {
    properties = properties.map(p => {
      const pCoords = p.coordinates || (p.lat && p.lng ? { lat: p.lat, lng: p.lng } : null);
      let calculatedDist = null;
      if (pCoords) {
        calculatedDist = calculateHaversineKm(
          targetInstitution.coordinates.lat,
          targetInstitution.coordinates.lng,
          pCoords.lat,
          pCoords.lng
        );
      }
      return {
        ...p,
        calculatedDistanceKm: calculatedDist !== null ? calculatedDist : p.distanceKm,
        targetCollege: {
          id: targetInstitution.id,
          name: targetInstitution.name,
          shortName: targetInstitution.shortName,
          city: targetInstitution.city,
          locality: targetInstitution.locality
        }
      };
    });
  }

  // 3. Filter by Omni-Search Query (q)
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    properties = properties.filter(p => {
      // If omni query resolved an institution, match properties near that institution's city or college list
      if (targetInstitution) {
        if (p.city && p.city.toLowerCase() === targetInstitution.city.toLowerCase()) return true;
        if (p.nearbyColleges && p.nearbyColleges.some(c => c.id === targetInstitution.id || c.name.toLowerCase().includes(term))) return true;
        if (p.calculatedDistanceKm !== undefined && p.calculatedDistanceKm <= 15) return true;
      }
      // General textual match
      return (
        p.name.toLowerCase().includes(term) ||
        (p.city && p.city.toLowerCase().includes(term)) ||
        (p.state && p.state.toLowerCase().includes(term)) ||
        (p.locality && p.locality.toLowerCase().includes(term)) ||
        (p.area && p.area.toLowerCase().includes(term)) ||
        (p.address && p.address.toLowerCase().includes(term)) ||
        (p.pincode && p.pincode.includes(term)) ||
        (p.nearbyColleges && p.nearbyColleges.some(nc => nc.name.toLowerCase().includes(term)))
      );
    });
  }

  // 4. Filter by State
  if (state && state.trim() && state.toLowerCase() !== 'all') {
    const sTerm = state.trim().toLowerCase();
    properties = properties.filter(p => p.state && p.state.toLowerCase().includes(sTerm));
  }

  // 5. Filter by City
  if (city && city.trim() && city.toLowerCase() !== 'all') {
    const cTerm = city.trim().toLowerCase();
    properties = properties.filter(p =>
      (p.city && p.city.toLowerCase().includes(cTerm)) ||
      (p.address && p.address.toLowerCase().includes(cTerm))
    );
  }

  // 6. Filter by Locality / Area
  const locTerm = (locality || area || '').trim().toLowerCase();
  if (locTerm && locTerm !== 'all') {
    properties = properties.filter(p =>
      (p.locality && p.locality.toLowerCase().includes(locTerm)) ||
      (p.area && p.area.toLowerCase().includes(locTerm)) ||
      (p.address && p.address.toLowerCase().includes(locTerm))
    );
  }

  // 7. Filter by Distance Radius from College (e.g., 1, 3, 5, 10, 15 km)
  const maxRadius = radius ? Number(radius) : (nearKm ? Number(nearKm) : null);
  if (maxRadius !== null && !isNaN(maxRadius)) {
    properties = properties.filter(p => {
      const dist = p.calculatedDistanceKm !== undefined ? p.calculatedDistanceKm : (p.distanceKm || 0);
      return dist <= maxRadius;
    });
  }

  // 8. Filter by Property Type
  if (type) {
    const types = Array.isArray(type)
      ? type.map(t => t.toLowerCase())
      : type.split(',').map(t => t.trim().toLowerCase());

    if (types.length > 0 && !types.includes('all')) {
      properties = properties.filter(p => {
        const pType = (p.type || '').toLowerCase();
        return types.some(t => {
          if (t === 'flat' || t === 'apartment') return pType === 'apartment' || pType === 'flat';
          return pType === t || pType.includes(t);
        });
      });
    }
  }

  // 9. Filter by Rent / Budget
  if (minPrice !== undefined && minPrice !== null && !isNaN(Number(minPrice))) {
    properties = properties.filter(p => (p.monthlyRent || p.price) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== null && !isNaN(Number(maxPrice))) {
    properties = properties.filter(p => (p.monthlyRent || p.price) <= Number(maxPrice));
  }

  // 10. Filter by Minimum Safety Score
  if (minScore !== undefined && minScore !== null && !isNaN(Number(minScore))) {
    properties = properties.filter(p => (p.score || 0) >= Number(minScore));
  }

  // 11. Filter by Meals
  if (meals === true || meals === 'true') {
    properties = properties.filter(p => p.meals === true);
  }

  // 12. Filter by Tiffin Nearby
  if (tiffinNearby === true || tiffinNearby === 'true') {
    properties = properties.filter(p => p.tiffinNearby === true);
  }

  // 13. Sorting
  const sortKey = (sortBy || (targetInstitution ? 'distance' : 'score')).toLowerCase();
  switch (sortKey) {
    case 'price':
    case 'price-asc':
      properties.sort((a, b) => (a.monthlyRent || a.price) - (b.monthlyRent || b.price));
      break;
    case 'price-desc':
      properties.sort((a, b) => (b.monthlyRent || b.price) - (a.monthlyRent || a.price));
      break;
    case 'distance':
    case 'distance-asc':
      properties.sort((a, b) => {
        const distA = a.calculatedDistanceKm !== undefined ? a.calculatedDistanceKm : (a.distanceKm || 999);
        const distB = b.calculatedDistanceKm !== undefined ? b.calculatedDistanceKm : (b.distanceKm || 999);
        return distA - distB;
      });
      break;
    case 'reviews':
    case 'reviews-desc':
      properties.sort((a, b) => (b.verifiedReviews || 0) - (a.verifiedReviews || 0));
      break;
    case 'score':
    case 'score-desc':
    default:
      properties.sort((a, b) => (b.score || 0) - (a.score || 0));
      break;
  }

  // Pagination
  const total = properties.length;
  const pNum = Math.max(1, parseInt(page, 10) || 1);
  const pSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
  const paginated = properties.slice((pNum - 1) * pSize, pNum * pSize);

  return {
    total,
    page: pNum,
    limit: pSize,
    targetInstitution,
    data: paginated
  };
}

function getRecommendedProperties(limit = 3, city = null) {
  let properties = readProperties();
  if (city && city.trim()) {
    const cLower = city.trim().toLowerCase();
    const cityProps = properties.filter(p => p.city && p.city.toLowerCase().includes(cLower));
    if (cityProps.length > 0) properties = cityProps;
  }
  return properties
    .filter(p => (p.score || 0) >= 75)
    .sort((a, b) => (b.score * 0.7 + b.verifiedReviews * 0.3) - (a.score * 0.7 + a.verifiedReviews * 0.3))
    .slice(0, limit);
}

module.exports = {
  getAllProperties,
  getPropertyById,
  searchAndFilterProperties,
  getRecommendedProperties
};
