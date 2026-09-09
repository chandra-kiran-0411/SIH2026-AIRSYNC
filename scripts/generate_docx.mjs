import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create headings
function createHeading(text, level) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 280, after: 120 }
  });
}

// Helper function to create standard text
function createPara(text, bold = false, italic = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        italic,
        font: 'Calibri',
        size: 22
      })
    ],
    spacing: { before: 80, after: 80 }
  });
}

// Helper function for bullet point
function createBullet(text, boldPrefix = '') {
  return new Paragraph({
    bullet: { level: 0 },
    children: [
      boldPrefix ? new TextRun({ text: boldPrefix + ' ', bold: true, font: 'Calibri', size: 22 }) : new TextRun(''),
      new TextRun({ text, font: 'Calibri', size: 22 })
    ],
    spacing: { before: 60, after: 60 }
  });
}

// Helper for table cells
function createCell(text, isHeader = false, widthPercent = 50) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: isHeader ? { fill: '0f172a', type: ShadingType.CLEAR } : { fill: 'f8fafc', type: ShadingType.CLEAR },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader,
            color: isHeader ? 'ffffff' : '0f172a',
            font: 'Calibri',
            size: 20
          })
        ],
        spacing: { before: 80, after: 80 }
      })
    ]
  });
}

async function generate() {
  console.log('Generating AirSync Comprehensive Architecture & Roadmap Document (.docx)...');

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1400, right: 1400 }
          }
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'AirSync — Delhi NCR Air Quality Intelligence Platform',
                bold: true,
                size: 36,
                color: '0284c7',
                font: 'Calibri'
              })
            ],
            spacing: { before: 200, after: 100 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Smart India Hackathon 2026 — Comprehensive Project Roadmap, Architecture & Component Reference',
                italic: true,
                size: 22,
                color: '475569',
                font: 'Calibri'
              })
            ],
            spacing: { before: 0, after: 200 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Philosophy: "Less information. More understanding."',
                bold: true,
                size: 24,
                color: '0f172a',
                font: 'Calibri'
              })
            ],
            spacing: { before: 0, after: 300 }
          }),

          // 1. Executive Summary
          createHeading('1. Executive Summary & Core Objective', HeadingLevel.HEADING_1),
          createPara('AirSync is designed as a Delhi NCR Air Quality Decision-Support and Intelligence Platform for the Smart India Hackathon 2026. Unlike conventional environmental platforms (such as IQAir or Earth Nullschool) that overload citizens and judges with raw, uninterpreted sensor measurements, AirSync converts atmospheric science into intuitive causal reasoning within 5 to 10 seconds.'),
          createPara('The entire architecture resolves 4 fundamental human questions:'),
          createBullet('What is the current air pollution and weather baseline across Delhi NCR?', '1. NOW:'),
          createBullet('Why is pollution accumulating? Explains thermal inversion caps, boundary-layer dispersion stalling, and northwest stubble plume transport.', '2. WHY?:'),
          createBullet('What will happen over the next 72 hours, and when exactly is the peak window expected (06:00 – 10:00 AM)?', '3. NEXT:'),
          createBullet('What specific, non-alarmist actions must Citizens, Municipal Authorities, and Industrial Units execute?', '4. ACTION:'),

          // 2. Full Technical Roadmap
          createHeading('2. Complete Technical Roadmap (SIH 2026 & Beyond)', HeadingLevel.HEADING_1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Phase / Timeline', true, 25),
                  createCell('Core Milestones & Technical Deliverables', true, 50),
                  createCell('Status', true, 25)
                ]
              }),
              new TableRow({
                children: [
                  createCell('Phase 1: SIH Core Platform (Current)'),
                  createCell('Next.js 16 + React 19 Frontend with Apple-grade dark command-center UI, real-time Leaflet GIS mapping, 72-hour continuous predictive forecast curve, embedded SQLite database with WAL concurrency, and AirSync Physics + AI Atmospheric Explainer.'),
                  createCell('100% COMPLETE & LIVE')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Phase 2: Live IoT & Automated Ingestion (Month 1-2)'),
                  createCell('Direct automated API ingestion from CPCB CAAQMS portal via automated CRON jobs; real-time ingestion of NASA FIRMS VIIRS satellite thermal fire anomaly CSV feeds; IMD synoptic weather stream integration.'),
                  createCell('PLANNED (Schema Ready)')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Phase 3: Physics-Informed ML Forecast Engine (Month 3-4)'),
                  createCell('Coupled WRF-Chem atmospheric dispersion model with lightweight LSTM/XGBoost neural network predicting boundary-layer inversion depth 72 hours in advance at 1km² spatial resolution.'),
                  createCell('ROADMAP')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Phase 4: Multi-Agency Government Action HUD (Month 5-6)'),
                  createCell('Direct WhatsApp/SMS emergency alerts for vulnerable groups; automated GRAP Stage III/IV enforcement trigger dashboards for DPCC, CAQM, and municipal corporations in Delhi, Noida, and Gurugram.'),
                  createCell('ROADMAP')
                ]
              })
            ]
          }),

          // 3. API Keys & Telemetry Pipeline Architecture
          createHeading('3. API Keys, Data Pipelines & Integration Guide', HeadingLevel.HEADING_1),
          createPara('AirSync is engineered with zero runtime vendor lock-in. Below is the full breakdown of data feeds used, credentials, and how to configure live enterprise keys:'),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Telemetry / Service Pipeline', true, 30),
                  createCell('Current Implementation', true, 35),
                  createCell('Production API Key & Source Details', true, 35)
                ]
              }),
              new TableRow({
                children: [
                  createCell('Interactive GIS Basemap (Street & Dark)'),
                  createCell('CartoDB Dark Matter tiles via open-access CDN (zero API key needed, unlimited bandwidth).'),
                  createCell('Free open access via CARTO / OpenStreetMap.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('High-Res Satellite Imagery Basemap'),
                  createCell('Esri World Imagery ArcGIS REST tile servers (embedded directly in Leaflet switcher).'),
                  createCell('Free open GIS tile endpoint via ArcGIS Online.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('NASA FIRMS Satellite Fires'),
                  createCell('Pre-seeded live thermal anomaly coordinates in Punjab & Haryana upwind corridor.'),
                  createCell('Key: MAP_KEY from firms.modaps.eosdis.nasa.gov. Plug into NASA_FIRMS_KEY in .env.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('CPCB Ground Stations (CAAQMS)'),
                  createCell('40 continuous stations seeded across Delhi, Noida, Gurugram, Ghaziabad, Faridabad, and Greater Noida.'),
                  createCell('Key: Government API Key from api.data.gov.in / CAAQMS live feed.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Weather & Synoptic Wind Fields'),
                  createCell('Embedded IMD atmospheric observations (wind speed, wind direction, humidity, temp).'),
                  createCell('Optional: OpenWeatherMap or Tomorrow.io API key.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Atmospheric AI Reasoning Engine'),
                  createCell('In-house deterministic physics & causal inference engine (src/lib/reasoningEngine.ts).'),
                  createCell('Zero external API costs; completely self-hosted with SQLite query logging.')
                ]
              })
            ]
          }),

          createPara('To configure live third-party keys in production, create a .env.local file in the project root:'),
          createPara('NASA_FIRMS_MAP_KEY=your_nasa_firms_key_here\nCPCB_DATA_GOV_API_KEY=your_datagov_key_here\nOPENWEATHER_API_KEY=your_openweather_key_here', false, true),

          // 4. Complete Components Catalog
          createHeading('4. Complete Components Catalog & Responsibilities', HeadingLevel.HEADING_1),
          createPara('Every UI element in AirSync is built as a reusable, typed React component in src/components/:'),

          createBullet('GPU-accelerated ambient HTML5 canvas rendering smooth wind streamlines flowing from the North-West toward Delhi NCR, visually representing prevailing atmospheric transport.', '1. AtmosphericCanvas.tsx:'),
          createBullet('Sticky top navigation with AirSync branding, SIH 2026 badge, section anchor links, and an emerald pulsing ● LIVE telemetry indicator.', '2. Navbar.tsx:'),
          createBullet('Command-center hero containing the core headline ("Understand the air. Before it changes."), a 5-second situational summary pill, and direct jump cards to the 4 questions.', '3. Hero.tsx:'),
          createBullet('Interactive temporal simulation bar (NOW | +24H | +48H | +72H). Selecting an interval dynamically recalculates the entire dashboard (metrics, map markers, atmospheric reasons, and risk).', '4. ForecastTimeline.tsx:'),
          createBullet('Section 1 (NOW). Large typography cards showing AQI 287 (POOR), PM2.5 138 µg/m³, Temperature 29°C, Humidity 62%, and Surface Wind 6 km/h NW with restrained contextual accents.', '5. CurrentConditions.tsx:'),
          createBullet('Section 2 (WHY? - Core Feature). Features 3 large cards: Inversion (HIGH) with vertical atmospheric cross-section; Dispersion (LOW) with mixing gauge and ventilation index; and Stubble Plume Influence (MODERATE) with directional corridor (Punjab → Haryana → Delhi NCR). Topped with the prominent "Pollution Build-up Risk: HIGH" callout.', '6. AtmosphericIntelligence.tsx:'),
          createBullet('Section 3 (MAP). Real Leaflet GIS map with Dark Matter and Satellite imagery switcher, CAAQMS sensor stations, NASA FIRMS fire markers, northwest smoke transport vectors, and a live District Telemetry inspector with fly-to zoom.', '7. DelhiNCRMap.tsx:'),
          createBullet('Section 4 (NEXT). Continuous 72-hour forecast graph with danger zone shading for the 06:00–10:00 AM peak window, hover tooltips, and underlying causality bullets.', '8. Forecast72Hours.tsx:'),
          createBullet('Section 6 (ACTION). Actionable, non-alarmist protocols divided into 3 dedicated tabs for Citizens, Municipal Authorities, and Industrial Operators, compliant with GRAP protocols.', '9. ActionPanel.tsx:'),
          createBullet('AI Atmospheric Explainer. Compact module featuring 1-click preset questions and a custom prompt input. Queries the server-side reasoning engine and records queries to SQLite.', '10. AskAirSync.tsx:'),
          createBullet('Footer with telemetry provenance credits to CPCB, NASA FIRMS, ECMWF / CAMS, IMD, and the SIH 2026 mission statement.', '11. Footer.tsx:'),

          // 5. Backend REST API Reference
          createHeading('5. Backend REST API Endpoints Reference', HeadingLevel.HEADING_1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Endpoint', true, 25),
                  createCell('Method', true, 15),
                  createCell('Description & Query Params', true, 60)
                ]
              }),
              new TableRow({
                children: [
                  createCell('/api/overview'),
                  createCell('GET'),
                  createCell('Accepts ?timeline=now|24h|48h|72h. Returns atmospheric snapshot, inversion height, dispersion status, and overall build-up risk.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('/api/regions'),
                  createCell('GET'),
                  createCell('Accepts ?timeline=now|24h|48h|72h. Returns coordinates, live AQI, PM2.5, tomorrow prediction, and key stressors for all 6 NCR zones.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('/api/forecast'),
                  createCell('GET'),
                  createCell('Returns the 72-hour forecast series points, peak window timing (06:00–10:00 AM), expected AQI range, and causality reasons.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('/api/action'),
                  createCell('GET'),
                  createCell('Accepts optional ?role=citizens|authorities|industries. Returns categorized advisory action cards and priority direct actions.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('/api/ask-airsync'),
                  createCell('POST & GET'),
                  createCell('POST accepts JSON { question: string }. Executes atmospheric reasoning engine, logs query into SQLite, and returns plain-language causality response.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('/api/status'),
                  createCell('GET'),
                  createCell('System health monitor returning ingestion latency and status for CPCB, NASA FIRMS, CAMS, and IMD feeds.')
                ]
              })
            ]
          }),

          // 6. Database Schema Reference
          createHeading('6. Database Architecture & Schema (SQLite)', HeadingLevel.HEADING_1),
          createPara('Database File: airsync/data/airsync.db (powered by better-sqlite3 with WAL journaling mode for ultra-high concurrency and sub-millisecond response times).'),
          createBullet('timeline_snapshots: Stores complete environmental records across temporal intervals (now, 24h, 48h, 72h).', 'Table 1:'),
          createBullet('regional_data: Stores district-level readings for Delhi, Noida, Gurugram, Ghaziabad, Faridabad, and Greater Noida.', 'Table 2:'),
          createBullet('forecast_points: Stores 72-hour timeline series points, peak indicators, and meteorological ratings.', 'Table 3:'),
          createBullet('action_advisories: Stores Graded Response Action Plan (GRAP) guidelines for citizens, authorities, and industries.', 'Table 4:'),
          createBullet('ai_query_logs: Automatically persists every question asked by users along with generated causal explanations and timestamps.', 'Table 5:'),

          // 7. Pitch Presentation Guide
          createHeading('7. Smart India Hackathon Presentation & Pitch Strategy', HeadingLevel.HEADING_1),
          createPara('When demonstrating AirSync to judges, follow this proven 60-second walkthrough:'),
          createBullet('Open http://localhost:3000. Point out that within 5 seconds, any citizen or judge can see the air is Poor (287) and that a dangerous peak is coming tomorrow morning between 6-10 AM.', 'Step 1 (The 10-Second Test):'),
          createBullet('Scroll to Section 2 (WHY?). Show that AirSync is NOT just reporting numbers like IQAir. It visualizes the vertical inversion lid trapping smoke and shows weak 6 km/h winds stalling dispersion.', 'Step 2 (The Key Differentiator):'),
          createBullet('Scroll to Section 3 (MAP). Toggle between Dark Map and Satellite view. Zoom into Noida, Ghaziabad, and Anand Vihar. Show the NASA FIRMS fires in Punjab and the wind plume trajectory.', 'Step 3 (Interactive GIS Map):'),
          createBullet('Click "+24H" or "+48H" on the timeline slider. Show how the entire dashboard recalculates in real-time.', 'Step 4 (Temporal Simulation):'),
          createBullet('Type a question into "Ask AirSync" (e.g., "Why is Ghaziabad worse than Gurugram?"). Show the instant scientific plain-language answer and explain that it is persisted in the local SQLite database.', 'Step 5 (Atmospheric AI):')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'AirSync_Comprehensive_Roadmap_and_Architecture.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document created successfully at: ${outputPath}`);
}

generate().catch(console.error);
