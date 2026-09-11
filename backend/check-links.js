const db = require('./db');
const axios = require('axios');

async function verifyInstitutionLinks() {
  try {
    const [rows] = await db.query('SELECT institution_id, name, application_url FROM institutions');
    console.log(`Checking ${rows.length} institution links...\n`);

    for (const inst of rows) {
      if (!inst.application_url) {
        console.warn(`⚠️ [MISSING URL] ${inst.name}`);
        continue;
      }

      try {
        const res = await axios.get(inst.application_url, { 
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });

        if (res.status === 200) {
          console.log(`✅ [OK] ${inst.name}`);
        }
      } catch (error) {
        console.error(`❌ [BROKEN LINK ${error.response?.status || 'TIMEOUT'}] ${inst.name}: ${inst.application_url}`);
      }
    }
  } catch (err) {
    console.error('DB query error:', err);
  }
}

verifyInstitutionLinks();