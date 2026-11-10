const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(path, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==============================================');
  console.log('   SheStay Pan-India API Comprehensive Tests  ');
  console.log('==============================================');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health returns 200 with service information', async () => {
    const res = await makeRequest('/api/health');
    if (res.status !== 200 || res.data.status !== 'ok') {
      throw new Error(`Expected status 200 with ok, got ${res.status}`);
    }
  });

  // 2. States list
  await test('GET /api/locations/states returns Indian states and UTs', async () => {
    const res = await makeRequest('/api/locations/states');
    if (res.status !== 200 || !Array.isArray(res.data.data) || res.data.data.length < 10) {
      throw new Error(`Expected at least 10 states, got ${res.data?.data?.length}`);
    }
    const hasDelhiNCR = res.data.data.some(s => s.name === 'Delhi NCR');
    const hasMaharashtra = res.data.data.some(s => s.name === 'Maharashtra');
    const hasKarnataka = res.data.data.some(s => s.name === 'Karnataka');
    if (!hasDelhiNCR || !hasMaharashtra || !hasKarnataka) {
      throw new Error('Key states missing from states dataset');
    }
  });

  // 3. Cities list
  await test('GET /api/locations/cities returns Pan-India cities', async () => {
    const res = await makeRequest('/api/locations/cities');
    if (res.status !== 200 || !Array.isArray(res.data.data) || res.data.data.length < 25) {
      throw new Error(`Expected >=25 cities, got ${res.data?.data?.length}`);
    }
    const hasGreaterNoida = res.data.data.some(c => c.name === 'Greater Noida');
    const hasBengaluru = res.data.data.some(c => c.name === 'Bengaluru');
    const hasPune = res.data.data.some(c => c.name === 'Pune');
    if (!hasGreaterNoida || !hasBengaluru || !hasPune) {
      throw new Error('Major hubs missing from cities dataset');
    }
  });

  // 4. Institutions list & search
  await test('GET /api/institutions/search?q=IILM finds IILM University', async () => {
    const res = await makeRequest('/api/institutions/search?q=IILM');
    if (res.status !== 200 || !Array.isArray(res.data.data) || res.data.data.length === 0) {
      throw new Error('IILM search returned empty');
    }
    const first = res.data.data[0];
    if (!first.name.includes('IILM') || first.city !== 'Greater Noida') {
      throw new Error(`Unexpected institution search result: ${JSON.stringify(first)}`);
    }
  });

  // 5. Galgotias search
  await test('GET /api/institutions/search?q=Galgotias finds Galgotias University', async () => {
    const res = await makeRequest('/api/institutions/search?q=Galgotias');
    if (res.status !== 200 || res.data.data.length === 0 || !res.data.data[0].name.includes('Galgotias')) {
      throw new Error('Galgotias search failed');
    }
  });

  // 6. Property discovery near IILM University (distance calculation)
  await test('GET /api/properties?college=IILM University returns calculated distances', async () => {
    const res = await makeRequest('/api/properties?college=IILM%20University');
    if (res.status !== 200 || !Array.isArray(res.data.data) || res.data.data.length === 0) {
      throw new Error('Expected properties near IILM');
    }
    const first = res.data.data[0];
    if (first.calculatedDistanceKm === undefined || first.calculatedDistanceKm > 5) {
      throw new Error(`Expected property within 5km of IILM, got ${first.calculatedDistanceKm}`);
    }
  });

  // 7. Distance radius filtering
  await test('GET /api/properties?college=IILM%20University&radius=1 filters strictly <= 1 km', async () => {
    const res = await makeRequest('/api/properties?college=IILM%20University&radius=1');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const allWithin1km = res.data.data.every(p => p.calculatedDistanceKm <= 1);
    if (!allWithin1km) throw new Error('Radius filter violated');
  });

  // 8. Pan-India city filter (Bengaluru)
  await test('GET /api/properties?city=Bengaluru returns Bengaluru listings', async () => {
    const res = await makeRequest('/api/properties?city=Bengaluru');
    if (res.status !== 200 || res.data.data.length === 0) {
      throw new Error('Expected properties in Bengaluru');
    }
    const allInBlr = res.data.data.every(p => p.city === 'Bengaluru');
    if (!allInBlr) throw new Error('City filter returned non-Bengaluru property');
  });

  // 9. Pan-India city filter (Pune)
  await test('GET /api/properties?city=Pune returns Pune listings', async () => {
    const res = await makeRequest('/api/properties?city=Pune');
    if (res.status !== 200 || res.data.data.length === 0) {
      throw new Error('Expected properties in Pune');
    }
    const allInPune = res.data.data.every(p => p.city === 'Pune');
    if (!allInPune) throw new Error('City filter returned non-Pune property');
  });

  // 10. Pan-India city filter (Mumbai)
  await test('GET /api/properties?city=Mumbai returns Mumbai listings', async () => {
    const res = await makeRequest('/api/properties?city=Mumbai');
    if (res.status !== 200 || res.data.data.length === 0) {
      throw new Error('Expected properties in Mumbai');
    }
  });

  // 11. Pan-India city filter (Vellore)
  await test('GET /api/properties?city=Vellore returns Vellore listings', async () => {
    const res = await makeRequest('/api/properties?city=Vellore');
    if (res.status !== 200 || res.data.data.length === 0) {
      throw new Error('Expected properties in Vellore');
    }
  });

  // 12. Omni-search by college name
  await test('GET /api/properties/search?q=Christ%20University resolves Christ University Bangalore', async () => {
    const res = await makeRequest('/api/properties/search?q=Christ%20University');
    if (res.status !== 200 || res.data.data.length === 0) {
      throw new Error('Omni search for Christ University returned empty');
    }
    const found = res.data.data.some(p => p.name.includes('Kaveri') || p.city === 'Bengaluru');
    if (!found) throw new Error('Expected Kaveri Studio near Christ University');
  });

  // 13. AI safety assessment endpoint
  await test('POST /api/ai/assess-property evaluates Pan-India property', async () => {
    const res = await makeRequest('/api/ai/assess-property', 'POST', { propertyId: 'iilm-saheli-residency' });
    if (res.status !== 200 || !res.data.data) {
      throw new Error(`Expected assessment object, got ${res.status}`);
    }
    if (typeof res.data.data.overallScore !== 'number') {
      throw new Error('Assessment overallScore missing');
    }
  });

  console.log('==============================================');
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log('==============================================');
  if (failed > 0) process.exit(1);
}

const { server } = require('../server');

setTimeout(async () => {
  try {
    await runTests();
  } finally {
    server.close();
    process.exit(0);
  }
}, 500);
