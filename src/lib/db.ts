import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { AtmosphericSnapshot, RegionTelemetry, ForecastPoint, ForecastResponse, ActionAdvisory, TimelineCode } from './types';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'airsync.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(dbPath, { timeout: 10000 });
    try {
      _db.pragma('journal_mode = WAL');
      _db.pragma('busy_timeout = 10000');
    } catch {
      // Ignored if busy in concurrent worker
    }
  }
  return _db;
}

const db = getDb();

// Initialize database schema
export function initDatabase() {
  try {
    db.pragma('busy_timeout = 10000');

  db.exec(`
    CREATE TABLE IF NOT EXISTS timeline_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeline_code TEXT UNIQUE,
      timeline_label TEXT,
      aqi INTEGER,
      aqi_status TEXT,
      pm25 INTEGER,
      pm25_status TEXT,
      temp INTEGER,
      humidity INTEGER,
      wind_speed INTEGER,
      wind_direction TEXT,
      updated_ago TEXT,
      inversion_level TEXT,
      inversion_desc TEXT,
      inversion_height INTEGER,
      inversion_trapping INTEGER,
      dispersion_level TEXT,
      dispersion_desc TEXT,
      dispersion_mixing TEXT,
      dispersion_ventilation INTEGER,
      plume_level TEXT,
      plume_desc TEXT,
      plume_corridor TEXT,
      plume_fires INTEGER,
      plume_confidence TEXT,
      risk_level TEXT,
      risk_headline TEXT,
      risk_explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS regional_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeline_code TEXT,
      district_key TEXT,
      name TEXT,
      hindi_name TEXT,
      aqi INTEGER,
      aqi_status TEXT,
      pm25 INTEGER,
      tomorrow_aqi INTEGER,
      trend TEXT,
      inversion TEXT,
      dispersion TEXT,
      plume_influence TEXT,
      key_source TEXT,
      coord_x INTEGER,
      coord_y INTEGER,
      lat REAL,
      lng REAL,
      UNIQUE(timeline_code, district_key)
    );

    CREATE TABLE IF NOT EXISTS forecast_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hour_offset INTEGER UNIQUE,
      time_label TEXT,
      day_label TEXT,
      aqi INTEGER,
      pm25 INTEGER,
      is_peak INTEGER,
      inversion TEXT,
      dispersion TEXT,
      plume_risk TEXT
    );

    CREATE TABLE IF NOT EXISTS action_advisories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeline_code TEXT,
      target_role TEXT,
      badge TEXT,
      headline TEXT,
      bullet_points TEXT, -- JSON array
      primary_action TEXT
    );

    CREATE TABLE IF NOT EXISTS ai_query_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT,
      answer TEXT,
      key_factors TEXT, -- JSON array
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    seedInitialData();
  } catch (err) {
    // Database may be locked by another worker or already created
  }
}

function seedInitialData() {
  const rowCount = db.prepare('SELECT COUNT(*) as count FROM timeline_snapshots').get() as { count: number };
  if (rowCount.count > 0) return; // already seeded

  // 1. Seed Timeline Snapshots (NOW, 24H, 48H, 72H)
  const insertSnapshot = db.prepare(`
    INSERT INTO timeline_snapshots (
      timeline_code, timeline_label, aqi, aqi_status, pm25, pm25_status, temp, humidity, wind_speed, wind_direction,
      updated_ago, inversion_level, inversion_desc, inversion_height, inversion_trapping,
      dispersion_level, dispersion_desc, dispersion_mixing, dispersion_ventilation,
      plume_level, plume_desc, plume_corridor, plume_fires, plume_confidence,
      risk_level, risk_headline, risk_explanation
    ) VALUES (
      @code, @label, @aqi, @aqi_status, @pm25, @pm25_status, @temp, @humidity, @wind_speed, @wind_direction,
      @updated_ago, @inv_lvl, @inv_desc, @inv_h, @inv_trap,
      @disp_lvl, @disp_desc, @disp_mix, @disp_vent,
      @plume_lvl, @plume_desc, @plume_corridor, @plume_fires, @plume_conf,
      @risk_lvl, @risk_head, @risk_exp
    )
  `);

  insertSnapshot.run({
    code: 'now',
    label: 'Real-time Live',
    aqi: 287,
    aqi_status: 'POOR',
    pm25: 138,
    pm25_status: 'HIGH',
    temp: 29,
    humidity: 62,
    wind_speed: 6,
    wind_direction: 'NW',
    updated_ago: 'Updated 2 minutes ago',
    inv_lvl: 'HIGH',
    inv_desc: 'Stable atmospheric conditions may trap pollutants close to the surface.',
    inv_h: 320,
    inv_trap: 82,
    disp_lvl: 'LOW',
    disp_desc: 'Weak winds and low atmospheric mixing may prevent pollutants from dispersing.',
    disp_mix: 'Poor',
    disp_vent: 1920,
    plume_lvl: 'MODERATE',
    plume_desc: 'Satellite-detected agricultural fires and prevailing winds indicate possible plume transport toward NCR.',
    plume_corridor: 'Punjab → Haryana → Delhi NCR',
    plume_fires: 248,
    plume_conf: 'Potential plume influence',
    risk_lvl: 'HIGH',
    risk_head: 'Pollution Build-up Risk',
    risk_exp: 'Strong overnight inversion combined with weak winds may cause PM2.5 accumulation across Delhi NCR.'
  });

  insertSnapshot.run({
    code: '24h',
    label: 'Tomorrow (+24h)',
    aqi: 326,
    aqi_status: 'VERY POOR',
    pm25: 164,
    pm25_status: 'VERY HIGH',
    temp: 27,
    humidity: 71,
    wind_speed: 4,
    wind_direction: 'WNW',
    updated_ago: 'Forecasted for Tomorrow Morning',
    inv_lvl: 'HIGH',
    inv_desc: 'Intensified nocturnal surface inversion with shallow planetary boundary layer.',
    inv_h: 240,
    inv_trap: 91,
    disp_lvl: 'POOR',
    disp_desc: 'Stagnant boundary layer with near-calm winds during peak morning transit.',
    disp_mix: 'Very Poor',
    disp_vent: 960,
    plume_lvl: 'MODERATE',
    plume_desc: 'Wind trajectory favorable for secondary aerosol pooling into eastern NCR.',
    plume_corridor: 'Punjab → Haryana → Delhi NCR',
    plume_fires: 310,
    plume_conf: 'Active transport trajectory',
    risk_lvl: 'HIGH',
    risk_head: 'Pollution Build-up Risk',
    risk_exp: 'Peak accumulation window between 06:00 and 10:00 AM due to maximum diurnal trapping.'
  });

  insertSnapshot.run({
    code: '48h',
    label: 'Day After (+48h)',
    aqi: 349,
    aqi_status: 'VERY POOR',
    pm25: 182,
    pm25_status: 'CRITICAL',
    temp: 26,
    humidity: 68,
    wind_speed: 5,
    wind_direction: 'NW',
    updated_ago: 'Projected Peak Window',
    inv_lvl: 'HIGH',
    inv_desc: 'Prolonged cold anticyclonic subsidence capping urban basin.',
    inv_h: 280,
    inv_trap: 88,
    disp_lvl: 'POOR',
    disp_desc: 'Minimal convective flushing; high aerosol optical depth expected.',
    disp_mix: 'Poor',
    disp_vent: 1400,
    plume_lvl: 'HIGH',
    plume_desc: 'Sustained northwest synoptic winds carrying agricultural smoke parcels.',
    plume_corridor: 'Punjab → Haryana → Delhi NCR',
    plume_fires: 420,
    plume_conf: 'Elevated plume transport',
    risk_lvl: 'SEVERE',
    risk_head: 'Pollution Build-up Risk',
    risk_exp: 'Sustained particulate saturation requiring proactive emission control.'
  });

  insertSnapshot.run({
    code: '72h',
    label: 'In 3 Days (+72h)',
    aqi: 274,
    aqi_status: 'POOR',
    pm25: 122,
    pm25_status: 'MODERATE-HIGH',
    temp: 28,
    humidity: 55,
    wind_speed: 12,
    wind_direction: 'ENE',
    updated_ago: 'Projected Dispersal Phase',
    inv_lvl: 'MODERATE',
    inv_desc: 'Boundary layer opens with daytime solar warming; inversion weakens.',
    inv_h: 650,
    inv_trap: 45,
    disp_lvl: 'MODERATE',
    disp_desc: 'Wind speed rising to 12 km/h promotes steady horizontal dispersion.',
    disp_mix: 'Moderate',
    disp_vent: 7800,
    plume_lvl: 'LOW',
    plume_desc: 'Wind shift to easterly corridor diverts incoming regional smoke plumes away.',
    plume_corridor: 'Corridor diverted toward Rajasthan',
    plume_fires: 190,
    plume_conf: 'Low direct impact',
    risk_lvl: 'MODERATE',
    risk_head: 'Pollution Build-up Risk',
    risk_exp: 'Atmospheric flushing underway; AQI improving back towards lower Poor category.'
  });

  // 2. Seed Regional NCR Data across Timelines
  const insertRegion = db.prepare(`
    INSERT INTO regional_data (
      timeline_code, district_key, name, hindi_name, aqi, aqi_status, pm25, tomorrow_aqi,
      trend, inversion, dispersion, plume_influence, key_source, coord_x, coord_y, lat, lng
    ) VALUES (
      @timeline_code, @district_key, @name, @hindi_name, @aqi, @aqi_status, @pm25, @tomorrow_aqi,
      @trend, @inversion, @dispersion, @plume_influence, @key_source, @coord_x, @coord_y, @lat, @lng
    )
  `);

  const baseDistricts = [
    { key: 'delhi', name: 'Delhi', hindi: 'दिल्ली', x: 230, y: 190, lat: 28.6139, lng: 77.2090, src: 'Vehicular + Secondary Inversion' },
    { key: 'noida', name: 'Noida', hindi: 'नोएडा', x: 310, y: 220, lat: 28.5355, lng: 77.3910, src: 'Construction Dust + Traffic' },
    { key: 'gurugram', name: 'Gurugram', hindi: 'गुरुग्राम', x: 155, y: 275, lat: 28.4595, lng: 77.0266, src: 'Highway Transit + Stagnation' },
    { key: 'ghaziabad', name: 'Ghaziabad', hindi: 'गाज़ियाबाद', x: 325, y: 130, lat: 28.6692, lng: 77.4538, src: 'Industrial Biomass + Inversion' },
    { key: 'faridabad', name: 'Faridabad', hindi: 'फरीदाबाद', x: 245, y: 315, lat: 28.4089, lng: 77.3178, src: 'Industrial Corridor + Settling' },
    { key: 'greater_noida', name: 'Greater Noida', hindi: 'ग्रेटर नोएडा', x: 375, y: 260, lat: 28.4744, lng: 77.5040, src: 'Expressway Corridors + Plume' }
  ];

  const regionalVariations: Record<TimelineCode, Record<string, { aqi: number; pm25: number; tomorrow: number; trend: string; inv: string; disp: string; plume: string }>> = {
    now: {
      delhi: { aqi: 287, pm25: 138, tomorrow: 326, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      noida: { aqi: 312, pm25: 156, tomorrow: 347, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      gurugram: { aqi: 265, pm25: 124, tomorrow: 298, trend: 'up', inv: 'MODERATE', disp: 'LOW', plume: 'LOW' },
      ghaziabad: { aqi: 326, pm25: 168, tomorrow: 362, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      faridabad: { aqi: 294, pm25: 142, tomorrow: 328, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'LOW' },
      greater_noida: { aqi: 308, pm25: 150, tomorrow: 339, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' }
    },
    '24h': {
      delhi: { aqi: 326, pm25: 164, tomorrow: 349, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      noida: { aqi: 347, pm25: 178, tomorrow: 365, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      gurugram: { aqi: 298, pm25: 146, tomorrow: 320, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      ghaziabad: { aqi: 362, pm25: 192, tomorrow: 380, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'HIGH' },
      faridabad: { aqi: 328, pm25: 165, tomorrow: 345, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      greater_noida: { aqi: 339, pm25: 172, tomorrow: 355, trend: 'up', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' }
    },
    '48h': {
      delhi: { aqi: 349, pm25: 182, tomorrow: 310, trend: 'stable', inv: 'HIGH', disp: 'LOW', plume: 'HIGH' },
      noida: { aqi: 365, pm25: 195, tomorrow: 325, trend: 'down', inv: 'HIGH', disp: 'LOW', plume: 'HIGH' },
      gurugram: { aqi: 320, pm25: 162, tomorrow: 285, trend: 'down', inv: 'MODERATE', disp: 'LOW', plume: 'MODERATE' },
      ghaziabad: { aqi: 380, pm25: 210, tomorrow: 335, trend: 'down', inv: 'HIGH', disp: 'LOW', plume: 'HIGH' },
      faridabad: { aqi: 345, pm25: 178, tomorrow: 305, trend: 'down', inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
      greater_noida: { aqi: 355, pm25: 185, tomorrow: 315, trend: 'down', inv: 'HIGH', disp: 'LOW', plume: 'HIGH' }
    },
    '72h': {
      delhi: { aqi: 274, pm25: 122, tomorrow: 240, trend: 'down', inv: 'MODERATE', disp: 'MODERATE', plume: 'LOW' },
      noida: { aqi: 288, pm25: 130, tomorrow: 250, trend: 'down', inv: 'MODERATE', disp: 'MODERATE', plume: 'LOW' },
      gurugram: { aqi: 248, pm25: 110, tomorrow: 220, trend: 'down', inv: 'LOW', disp: 'GOOD', plume: 'LOW' },
      ghaziabad: { aqi: 295, pm25: 136, tomorrow: 260, trend: 'down', inv: 'MODERATE', disp: 'MODERATE', plume: 'LOW' },
      faridabad: { aqi: 268, pm25: 118, tomorrow: 235, trend: 'down', inv: 'MODERATE', disp: 'MODERATE', plume: 'LOW' },
      greater_noida: { aqi: 282, pm25: 126, tomorrow: 245, trend: 'down', inv: 'MODERATE', disp: 'MODERATE', plume: 'LOW' }
    }
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 100) return 'GOOD';
    if (aqi <= 200) return 'MODERATE';
    if (aqi <= 300) return 'POOR';
    if (aqi <= 400) return 'VERY POOR';
    return 'SEVERE';
  };

  for (const [timeline, districts] of Object.entries(regionalVariations)) {
    for (const b of baseDistricts) {
      const v = districts[b.key];
      insertRegion.run({
        timeline_code: timeline,
        district_key: b.key,
        name: b.name,
        hindi_name: b.hindi,
        aqi: v.aqi,
        aqi_status: getAqiStatus(v.aqi),
        pm25: v.pm25,
        tomorrow_aqi: v.tomorrow,
        trend: v.trend,
        inversion: v.inv,
        dispersion: v.disp,
        plume_influence: v.plume,
        key_source: b.src,
        coord_x: b.x,
        coord_y: b.y,
        lat: b.lat,
        lng: b.lng
      });
    }
  }

  // 3. Seed 72-Hour Forecast Line Data
  const insertForecast = db.prepare(`
    INSERT INTO forecast_points (hour_offset, time_label, day_label, aqi, pm25, is_peak, inversion, dispersion, plume_risk)
    VALUES (@hour, @time, @day, @aqi, @pm25, @is_peak, @inv, @disp, @plume)
  `);

  const forecastData = [
    { hour: 0, time: 'NOW', day: 'Today', aqi: 287, pm25: 138, is_peak: 0, inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
    { hour: 12, time: '+12h', day: 'Tonight', aqi: 305, pm25: 149, is_peak: 0, inv: 'HIGH', disp: 'LOW', plume: 'MODERATE' },
    { hour: 24, time: '+24h', day: 'Tomorrow AM', aqi: 326, pm25: 164, is_peak: 1, inv: 'HIGH', disp: 'POOR', plume: 'MODERATE' },
    { hour: 36, time: '+36h', day: 'Tomorrow Eve', aqi: 341, pm25: 174, is_peak: 1, inv: 'HIGH', disp: 'LOW', plume: 'HIGH' },
    { hour: 48, time: '+48h', day: 'Day 2 Peak', aqi: 349, pm25: 182, is_peak: 1, inv: 'HIGH', disp: 'POOR', plume: 'HIGH' },
    { hour: 60, time: '+60h', day: 'Day 3 Day', aqi: 310, pm25: 152, is_peak: 0, inv: 'MODERATE', disp: 'MODERATE', plume: 'LOW' },
    { hour: 72, time: '+72h', day: 'Day 3 Eve', aqi: 274, pm25: 122, is_peak: 0, inv: 'MODERATE', disp: 'GOOD', plume: 'LOW' }
  ];

  for (const pt of forecastData) {
    insertForecast.run({
      hour: pt.hour,
      time: pt.time,
      day: pt.day,
      aqi: pt.aqi,
      pm25: pt.pm25,
      is_peak: pt.is_peak,
      inv: pt.inv,
      disp: pt.disp,
      plume: pt.plume
    });
  }

  // 4. Seed Action Advisories for Citizens, Authorities, Industries
  const insertAdvisory = db.prepare(`
    INSERT INTO action_advisories (timeline_code, target_role, badge, headline, bullet_points, primary_action)
    VALUES (@code, @role, @badge, @headline, @bullets, @primary_action)
  `);

  // Citizens
  insertAdvisory.run({
    code: 'now',
    role: 'citizens',
    badge: 'HEALTH & EXPOSURE',
    headline: 'Protect vulnerable respiratory health during morning inversion',
    bullets: JSON.stringify([
      'Sensitive groups (children, elderly, asthmatics) should reduce prolonged outdoor activity between 06:00 and 10:00 AM.',
      'Shift vigorous aerobic workouts or running to mid-afternoon (13:00–16:00) when boundary layer mixing improves.',
      'Keep windows closed during overnight hours when surface pollutants pool near ground level.',
      'Wear certified N95 / FFP2 respirators if commuting in open or two-wheeler transport during early morning.'
    ]),
    primary_action: 'Avoid morning outdoor exercise between 06:00 and 10:00 AM'
  });

  // Authorities
  insertAdvisory.run({
    code: 'now',
    role: 'authorities',
    badge: 'INTERVENTION & ENFORCEMENT',
    headline: 'High pollutant accumulation conditions expected across northern and eastern NCR',
    bullets: JSON.stringify([
      'Prioritize synchronized mechanized sweeping and water sprinkling along high-density corridors (Ring Road, Anand Vihar, Loni).',
      'Deploy mobile anti-smog mist guns starting at 05:00 AM before surface inversion traps vehicle exhaust.',
      'Enforce strict non-destined diesel truck bypass through Eastern and Western Peripheral Expressways.',
      'Conduct nocturnal drone thermal surveillance for unauthorized open waste burning in industrial zones.'
    ]),
    primary_action: 'Deploy synchronized misting on eastern corridors before 05:00 AM'
  });

  // Industries
  insertAdvisory.run({
    code: 'now',
    role: 'industries',
    badge: 'COMPLIANCE & READINESS',
    headline: 'Atmospheric dispersion remains poor overnight; initiate clean-fuel protocol',
    bullets: JSON.stringify([
      'Heighten emission-control readiness and ensure continuous operation of Bag Filters and Wet Scrubbers.',
      'Reschedule batch operations with fugitive dust release away from the 06:00–10:00 AM low-ventilation window.',
      'Ensure zero reliance on unapproved diesel generator sets; verify primary grid power connectivity.',
      'Mandate complete covering of raw material transit trucks entering industrial clusters.'
    ]),
    primary_action: 'Maintain emission control systems at peak efficiency during nocturnal lull'
  });

  // 5. Seed Initial Sample AI Queries
  const insertQuery = db.prepare(`
    INSERT INTO ai_query_logs (question, answer, key_factors)
    VALUES (@q, @a, @f)
  `);

  insertQuery.run({
    q: 'Why will AQI increase tomorrow?',
    a: 'AirSync expects AQI to rise because nighttime atmospheric inversion is likely to strengthen while wind speeds remain low, reducing pollutant dispersion. Satellite fire activity northwest of Delhi may also contribute to plume transport toward NCR.',
    f: JSON.stringify(['Nighttime inversion', 'Low wind speed (<5 km/h)', 'Northwest plume transport'])
  });

  insertQuery.run({
    q: 'Why is Ghaziabad worse than Gurugram right now?',
    a: 'Ghaziabad sits downwind of regional north-westerly airflow and suffers from lower planetary boundary layer ventilation, causing particulates to accumulate along the eastern river basin.',
    f: JSON.stringify(['Downwind airflow', 'Boundary layer ventilation deficit', 'Local industrial baseline'])
  });
}

// Auto-run initialization on module load
initDatabase();

// Export queries
export function getSnapshotByTimeline(timeline: TimelineCode = 'now'): AtmosphericSnapshot | null {
  const row = db.prepare(`
    SELECT * FROM timeline_snapshots WHERE timeline_code = ?
  `).get(timeline) as any;

  if (!row) return null;

  return {
    timeline: row.timeline_code,
    timelineLabel: row.timeline_label,
    aqi: row.aqi,
    aqiStatus: row.aqi_status,
    pm25: row.pm25,
    pm25Status: row.pm25_status,
    temp: row.temp,
    humidity: row.humidity,
    windSpeed: row.wind_speed,
    windDirection: row.wind_direction,
    updatedAgo: row.updated_ago,
    inversion: {
      level: row.inversion_level,
      description: row.inversion_desc,
      boundaryHeightMeters: row.inversion_height,
      trappingRatioPercent: row.inversion_trapping
    },
    dispersion: {
      level: row.dispersion_level,
      description: row.dispersion_desc,
      windSpeedKmh: row.wind_speed,
      mixingStatus: row.dispersion_mixing,
      ventilationIndex: row.dispersion_ventilation
    },
    plume: {
      level: row.plume_level,
      description: row.plume_desc,
      corridor: row.plume_corridor,
      fireCountSatellite: row.plume_fires,
      confidence: row.plume_confidence
    },
    riskSummary: {
      level: row.risk_level,
      headline: row.risk_headline,
      explanation: row.risk_explanation
    }
  };
}

export function getRegionsByTimeline(timeline: TimelineCode = 'now'): RegionTelemetry[] {
  const rows = db.prepare(`
    SELECT * FROM regional_data WHERE timeline_code = ?
  `).all(timeline) as any[];

  return rows.map(r => ({
    id: r.district_key,
    name: r.name,
    hindiName: r.hindi_name,
    districtKey: r.district_key,
    aqi: r.aqi,
    aqiStatus: r.aqi_status,
    pm25: r.pm25,
    tomorrowAqi: r.tomorrow_aqi,
    trend: r.trend,
    inversion: r.inversion,
    dispersion: r.dispersion,
    plumeInfluence: r.plume_influence,
    keySource: r.key_source,
    coordinates: { x: r.coord_x, y: r.coord_y },
    lat: r.lat,
    lng: r.lng
  }));
}

export function getForecast72h(): ForecastResponse {
  const rows = db.prepare(`
    SELECT * FROM forecast_points ORDER BY hour_offset ASC
  `).all() as any[];

  const points: ForecastPoint[] = rows.map(r => ({
    hourOffset: r.hour_offset,
    timeLabel: r.time_label,
    dayLabel: r.day_label,
    aqi: r.aqi,
    pm25: r.pm25,
    isPeak: Boolean(r.is_peak),
    inversion: r.inversion,
    dispersion: r.dispersion,
    plumeRisk: r.plume_risk
  }));

  return {
    points,
    peakWindow: {
      time: 'Tomorrow 06:00 – 10:00',
      expectedAqiRange: '320 – 349 (Very Poor)',
      why: [
        'Strong nighttime inversion trapping ground emissions below 280m',
        'Weak surface winds (< 5 km/h) stalling horizontal dispersion',
        'Possible northwest agricultural plume transport corridor',
        'No significant rainfall or frontal wind clearing'
      ]
    }
  };
}

export function getAdvisories(role?: string): ActionAdvisory[] {
  let query = 'SELECT * FROM action_advisories';
  const params: any[] = [];
  if (role) {
    query += ' WHERE target_role = ?';
    params.push(role);
  }

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map(r => ({
    id: String(r.id),
    targetRole: r.target_role,
    badge: r.badge,
    headline: r.headline,
    bulletPoints: JSON.parse(r.bullet_points),
    primaryAction: r.primary_action
  }));
}

export function logAiQuery(question: string, answer: string, factors: string[]) {
  const stmt = db.prepare(`
    INSERT INTO ai_query_logs (question, answer, key_factors)
    VALUES (?, ?, ?)
  `);
  stmt.run(question, answer, JSON.stringify(factors));
}

export function getRecentAiQueries(limit = 5) {
  const rows = db.prepare(`
    SELECT id, question, answer, key_factors, timestamp
    FROM ai_query_logs
    ORDER BY id DESC
    LIMIT ?
  `).all(limit) as any[];

  return rows.map(r => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    timestamp: r.timestamp,
    factors: JSON.parse(r.key_factors || '[]')
  }));
}
