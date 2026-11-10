const fs = require('fs');
const path = require('path');

const INSTITUTIONS_PATH = path.join(__dirname, '../data/institutions.json');

function readInstitutionsData() {
  try {
    const raw = fs.readFileSync(INSTITUTIONS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[InstitutionService] Error reading institutions.json:', err.message);
    return [];
  }
}

function getAllInstitutions() {
  return readInstitutionsData();
}

function getInstitutionById(id) {
  if (!id) return null;
  const list = readInstitutionsData();
  const lower = id.trim().toLowerCase();
  return list.find(i => i.id.toLowerCase() === lower) || null;
}

function searchInstitutions(query) {
  if (!query || !query.trim()) return getAllInstitutions().slice(0, 10);
  const term = query.trim().toLowerCase();
  const list = readInstitutionsData();

  return list.filter(inst => {
    if (inst.name.toLowerCase().includes(term)) return true;
    if (inst.shortName.toLowerCase().includes(term)) return true;
    if (inst.city.toLowerCase().includes(term)) return true;
    if (inst.locality && inst.locality.toLowerCase().includes(term)) return true;
    if (inst.searchTerms && inst.searchTerms.some(st => st.toLowerCase().includes(term))) return true;
    return false;
  }).slice(0, 10);
}

function findBestMatchingInstitution(query) {
  if (!query || !query.trim()) return null;
  const term = query.trim().toLowerCase();
  const list = readInstitutionsData();

  // 1. Exact ID match
  const exactId = list.find(i => i.id.toLowerCase() === term);
  if (exactId) return exactId;

  // 2. Exact shortName or search term match
  const exactMatch = list.find(i => 
    i.shortName.toLowerCase() === term ||
    (i.searchTerms && i.searchTerms.some(st => st.toLowerCase() === term))
  );
  if (exactMatch) return exactMatch;

  // 3. Partial / contains match
  const partialMatch = list.find(i =>
    i.name.toLowerCase().includes(term) ||
    i.shortName.toLowerCase().includes(term) ||
    (i.searchTerms && i.searchTerms.some(st => st.toLowerCase().includes(term)))
  );

  return partialMatch || null;
}

module.exports = {
  getAllInstitutions,
  getInstitutionById,
  searchInstitutions,
  findBestMatchingInstitution
};

