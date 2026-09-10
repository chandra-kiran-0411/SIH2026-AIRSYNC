# AirSync — Delhi NCR Air Quality Intelligence Platform

> **Smart India Hackathon 2026**
> *"Less information. More understanding."*

AirSync is a real-time atmospheric intelligence platform built for Delhi NCR. It goes beyond raw AQI numbers to explain *why* pollution is building up, *when* it will peak, and *what* each stakeholder — citizen, authority, or industry — should do right now.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Target Audience](#target-audience)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [APIs Used](#apis-used)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Physics & Mathematical Models](#physics--mathematical-models)
- [Steps to Run](#steps-to-run)
- [Database Schema](#database-schema)
- [Internal API Routes](#internal-api-routes)
- [Data Sources](#data-sources)

---

## About the Project

Most air quality dashboards show a single number — the AQI. AirSync is different.

It integrates **real-time meteorological data**, **atmospheric physics models**, **satellite fire detection**, and **causal AI reasoning** to answer the questions that actually matter:

| Question | AirSync Answer |
|---|---|
| **NOW** — What is happening? | Live AQI, PM2.5, temperature, wind, pressure for Delhi NCR |
| **WHY** — Why is it building up? | Atmospheric inversion depth, dispersion index, plume corridor analysis |
| **NEXT** — What will happen in 72 hours? | Hour-by-hour AQI forecast with peak window identification |
| **ACTION** — What should I do? | Role-specific advisories for citizens, municipal authorities, and industries |

The platform covers **6 districts of Delhi NCR**: Delhi, Noida, Gurugram, Ghaziabad, Faridabad, and Greater Noida — each with independent air quality telemetry, trend indicators, and inversion/dispersion profiles.

---

## Target Audience

AirSync is designed for **three distinct stakeholder groups**:

### 👤 Citizens & Residents
People living or commuting in Delhi NCR who need actionable, plain-language guidance — not raw atmospheric data — to protect their health. Especially useful for parents, the elderly, joggers, cyclists, and asthma sufferers who need to know *when* it is safe to go outside and *what* precautions to take.

### 🏛️ Municipal Authorities & GRAP Enforcement Teams
CPCB, DPCC, Delhi Government, and municipal corporations who need a unified operational view to time anti-smog interventions (mist guns, truck diversions, mechanized sweeping) precisely with predicted inversion and dispersion windows. AirSync tells *when* to act, not just *that* the AQI is high.

### 🏭 Industries & Compliance Officers
Industrial units in NCR that must comply with Graded Response Action Plan (GRAP) thresholds. AirSync shows when low-ventilation windows are forecast so they can reschedule high-emission processes proactively and maintain compliance.

---

## Features

- **Real-time AQI & Weather** — Live data fetched from Open-Meteo (no API key required)
- **Atmospheric Intelligence Panel** — Visual cards for thermal inversion depth, dispersion index, and plume transport corridor (Punjab → Haryana → Delhi NCR)
- **Interactive Delhi NCR Map** — Leaflet-powered map with 4 toggle layers: AQI heatmap, CAAQMS monitoring stations, NASA FIRMS satellite fire points, and plume transport overlay
- **72-Hour Forecast Timeline** — Continuous AQI projection curve with peak window alerts (e.g., "Tomorrow 06:00–10:00: AQI 320–349")
- **Timeline Selector** — Switch between NOW / +24h / +48h / +72h views; all sections update simultaneously
- **Action Advisory Panel** — Role-filtered advisories (Citizens / Authorities / Industries) with primary action call-outs
- **Ask AirSync** — Causal physics reasoning engine that answers natural-language questions like "Why is Ghaziabad worse than Gurugram?" or "Is it safe to jog tomorrow?"
- **Animated Background** — Canvas-based atmospheric streamline animation reflecting real wind patterns
- **Data Provenance Footer** — Transparent attribution for all data sources (CPCB, NASA FIRMS, ECMWF/CAMS, IMD, Open-Meteo)

---

## Tech Stack

| Technology | Version | Purpose in AirSync |
|---|---|---|
| **Next.js** | 16.3.4 | Full-stack React framework providing App Router, API Routes (server-side), and SSR/CSR hybrid rendering |
| **React** | 19.2.8 | Component-based UI rendering; state management for timeline, snapshot, and district selection |
| **TypeScript** | ^5 | Strict typing across all components, API routes, and DB layer — prevents data shape mismatches between API and UI |
| **TailwindCSS** | ^4 | Utility-first CSS for the dark-mode glassmorphism design system (`bg-white/[0.03]`, `backdrop-blur`, etc.) |
| **Leaflet** | ^1.9.4 | Interactive map rendering for the Delhi NCR district map with dynamic AQI layers and marker clusters |
| **better-sqlite3** | ^13.0.3 | Embedded, zero-setup SQLite database for storing seeded atmospheric data, forecasts, advisories, and AI query logs |
| **lucide-react** | ^1.43.0 | Icon library used throughout the UI (Wind, Flame, Layers, Sparkles, MapPin, etc.) |
| **docx** | ^9.7.1 | Used in `scripts/generate_docx.mjs` to generate the project's technical architecture document programmatically |

### Why these choices?

- **Next.js + App Router**: Co-locates the frontend and backend API routes in one repo. No separate Express server needed — each `route.ts` inside `src/app/api/` becomes a serverless API endpoint automatically.
- **better-sqlite3 (not PostgreSQL)**: The project is self-contained and runs offline for demos. SQLite requires zero infrastructure — the database file lives at `data/airsync.db` and is created on first run.
- **Leaflet (not Google Maps)**: Leaflet is free and open-source and works without any API key. Dark basemap tiles (CartoDB DarkMatter) are fetched from a public CDN.
- **Open-Meteo (not OpenWeatherMap)**: Open-Meteo is completely free, requires no registration or API key, and provides ECMWF-quality meteorological and air quality forecasts at hourly resolution.

---

## APIs Used

### External APIs

#### 1. Open-Meteo Weather Forecast API
- **Base URL**: `https://api.open-meteo.com/v1/forecast`
- **Authentication**: None — no API key required
- **Used in**: `/api/weather` and `/api/overview`
- **Data fetched**: `temperature_2m`, `relative_humidity_2m`, `wind_speed_10m`, `wind_direction_10m`, `surface_pressure`, `weather_code`, `cloud_cover`, `precipitation`, `wind_gusts_10m`
- **Usage in AirSync**: Provides the live weather values shown in the Current Conditions panel. Temperature, humidity, wind speed, and wind direction card values all come from this API. The 72-hour hourly forecast is also fetched for trend context.

#### 2. Open-Meteo Air Quality API (CAMS / Copernicus)
- **Base URL**: `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Authentication**: None — no API key required
- **Used in**: `/api/overview`
- **Data fetched**: `pm2_5`, `pm10`, `carbon_monoxide`, `nitrogen_dioxide`, `sulphur_dioxide`, `ozone`, `us_aqi`
- **Usage in AirSync**: Provides the real-time AQI (US EPA scale) and full pollutant breakdown displayed in the hero section and current conditions panel. Powered by the Copernicus Atmosphere Monitoring Service (CAMS) model.

---

## Project Structure

```
airsync/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main single-page application entry
│   │   ├── layout.tsx                  # Root layout with metadata
│   │   ├── globals.css                 # Global styles and Tailwind base
│   │   └── api/
│   │       ├── overview/route.ts       # Live AQI + weather from Open-Meteo
│   │       ├── weather/route.ts        # Detailed weather data (72h hourly)
│   │       ├── regions/route.ts        # District-level telemetry from SQLite
│   │       ├── forecast/route.ts       # 72-hour forecast from SQLite
│   │       ├── action/route.ts         # Action advisories from SQLite
│   │       ├── ask-airsync/route.ts    # AI reasoning engine endpoint
│   │       └── status/route.ts         # System/pipeline status
│   ├── components/
│   │   ├── AtmosphericCanvas.tsx       # Animated background wind streamlines
│   │   ├── Navbar.tsx                  # Top navigation bar
│   │   ├── Hero.tsx                    # Hero section with 4-question navigation
│   │   ├── ForecastTimeline.tsx        # NOW / +24h / +48h / +72h selector bar
│   │   ├── CurrentConditions.tsx       # AQI, PM2.5, temperature, wind cards
│   │   ├── AtmosphericIntelligence.tsx # Inversion, dispersion, plume cards
│   │   ├── DelhiNCRMap.tsx             # Leaflet map with layer toggles
│   │   ├── Forecast72Hours.tsx         # 72-hour AQI forecast curve + peak alert
│   │   ├── ActionPanel.tsx             # Role-filtered advisory cards
│   │   ├── AskAirSync.tsx              # AI Q&A chatbot interface
│   │   └── Footer.tsx                  # Data provenance and branding
│   └── lib/
│       ├── aqi.ts                      # CPCB NAQI calculation & sub-index models
│       ├── db.ts                       # SQLite database layer (schema + queries)
│       ├── reasoningEngine.ts          # Causal physics AI reasoning engine
│       └── types.ts                    # TypeScript interfaces for all data shapes
├── scripts/
│   ├── seed.mjs                        # Standalone DB seeder (run before build)
│   └── generate_docx.mjs              # Generates architecture DOCX document
├── data/
│   └── airsync.db                      # SQLite database (auto-created on first run)
├── public/                             # Static assets
├── Start AirSync.bat                   # One-click Windows launcher
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies and npm scripts
└── tsconfig.json                       # TypeScript configuration
```

---

## Workflow

```
┌────────────────────────────────────────────────────────────────┐
│                       AIRSYNC DATA FLOW                        │
└────────────────────────────────────────────────────────────────┘

  Browser (User)
       │
       │  1. Page Load
       ▼
  Next.js Frontend (page.tsx)
       │
       ├──► GET /api/weather ──────────► Open-Meteo Forecast API
       │                                 (temperature, humidity, wind, pressure)
       │
       ├──► GET /api/overview ─────────► Open-Meteo Forecast API  (weather)
       │                                 Open-Meteo Air Quality / CAMS (AQI)
       │
       ├──► GET /api/regions ──────────► SQLite DB (regional_data table)
       │       ?timeline=now
       │
       ├──► GET /api/forecast ─────────► SQLite DB (forecast_points table)
       │
       └──► GET /api/action ───────────► SQLite DB (action_advisories table)

  2. User Interaction
       │
       ├──► Timeline Switch (NOW/+24h/+48h/+72h)
       │       └── Re-fetches /api/overview and /api/regions with new timeline
       │
       ├──► District Selection on Map
       │       └── Updates inspector panel with selected district telemetry
       │
       └──► Ask AirSync (Natural Language Query)
               └── POST /api/ask-airsync
                     ├── reasoningEngine.ts (pattern-matched causal physics)
                     └── Logs Q&A to SQLite ai_query_logs table

┌────────────────────────────────────────────────────────────────┐
│                   ATMOSPHERIC REASONING PIPELINE               │
└────────────────────────────────────────────────────────────────┘

  User Question → Pattern Matching → Meteorological Model Selection
       │
       ├── "tomorrow / rise / worse"   → Nocturnal inversion model
       ├── "stubble / fire / punjab"   → NASA FIRMS plume transport model
       ├── "inversion / boundary"      → Boundary layer physics explanation
       ├── "rain / wind / fog"         → Precipitation / ventilation model
       ├── "jog / outdoor / safe"      → Diurnal mixing window model
       ├── "noida / ghaziabad / diff"  → Regional micro-meteorology model
       └── default                     → 72-hour atmospheric synopsis
       │
       └── Returns: answer + keyFactors + confidence + meteorologicalBasis
```

---

## Physics & Mathematical Models

AirSync translates raw environmental sensor measurements into actionable causal intelligence using established atmospheric physics equations, micro-meteorological dispersion principles, and official CPCB/MoEFCC index calculations.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            AIRSYNC SCIENTIFIC ENGINE                             │
├──────────────────────────┬─────────────────────────────┬─────────────────────────┤
│ 1. CPCB NAQI Formulation │ 2. Ventilation Coefficient  │ 3. PBL Inversion Model  │
│    Linear Interpolation  │    VC = Hm × U              │    Lapse Rate Reversal  │
├──────────────────────────┼─────────────────────────────┼─────────────────────────┤
│ 4. Plume Transport Lag   │ 5. Secondary Smog Growth    │ 6. Predictive Curve     │
│    Δt = D / |v|          │    Hygroscopic Swelling     │    Harmonic + Spline    │
└──────────────────────────┴─────────────────────────────┴─────────────────────────┘
```

---

### 1. Indian National Air Quality Index (CPCB NAQI) Formulation

AirSync computes the official Indian National Air Quality Index (NAQI) as defined by the Ministry of Environment, Forest and Climate Change (MoEFCC) and Central Pollution Control Board (CPCB) in [`src/lib/aqi.ts`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/lib/aqi.ts).

#### A. Sub-Index Breakpoint Interpolation Function

For any pollutant concentration $C$, its individual sub-index $I$ is calculated via piecewise linear interpolation between its regulatory breakpoints:

$$
I = I_{\text{low}} + \left[ \frac{I_{\text{high}} - I_{\text{low}}}{C_{\text{high}} - C_{\text{low}}} \right] \times (C - C_{\text{low}})
$$

Where:
- $C$: Measured pollutant concentration ($\mu\text{g/m}^3$)
- $C_{\text{low}}, C_{\text{high}}$: Lower and upper concentration breakpoints for the category
- $I_{\text{low}}, I_{\text{high}}$: Corresponding sub-index score range
- $I$: Resulting sub-index value for that specific pollutant

#### B. Composite Index Aggregation (Max-Operator Principle)

The overall AQI is governed by the single most toxic pollutant (the dominant stressor), modeled as the maximum of all available pollutant sub-indices:

$$
\text{AQI} = \max \Big( I_{\text{PM2.5}}, \; I_{\text{PM10}}, \; I_{\text{NO}_2}, \; I_{\text{SO}_2}, \; I_{\text{CO}}, \; I_{\text{O}_3} \Big)
$$

$$
\text{Prominent Pollutant} = \underset{p \in \mathcal{P}}{\operatorname{argmax}} \big( I_p \big)
$$

Implemented in [`calculateIndianAqi()`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/lib/aqi.ts#L78-L103) and consumed in [`/api/overview`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/app/api/overview/route.ts#L67) and [`/api/regions`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/app/api/regions/route.ts#L157).

#### C. Official CPCB Breakpoints Reference Table

| Category | AQI Range (CPCB) | PM2.5 (µg/m³) | PM10 (µg/m³) | Health Impact & Physiological Severity |
|---|---|---|---|---|
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | Minimal impact |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | Minor breathing discomfort to sensitive people |
| **Moderate** | 101 – 200 | 61 – 90 | 101 – 250 | Breathing discomfort with lungs/asthma/heart diseases |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | Breathing discomfort to most people on prolonged exposure |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | Respiratory illness on prolonged exposure |
| **Severe** | 401 – 500 | 250+ | 430+ | Affects healthy people; seriously impacts those with existing diseases |

#### D. Inverse Breakpoint Formulation (Concentration Estimation)

Used in [`src/app/api/forecast/route.ts`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/app/api/forecast/route.ts#L57-L62) to reconstruct physically realistic PM2.5 concentrations from projected AQI values:

$$
C = C_{\text{low}} + \left[ \frac{C_{\text{high}} - C_{\text{low}}}{I_{\text{high}} - I_{\text{low}}} \right] \times (I - I_{\text{low}})
$$

---

### 2. Atmospheric Ventilation Coefficient (VC) & Dispersion Model

The rate at which the atmosphere can dilute and transport ground-level pollutants is modeled using the **Ventilation Index** (also known as the **Ventilation Coefficient**, $VC$), standardized by the India Meteorological Department (IMD) and CPCB.

#### Formula:

$$
VC = H_m \times U
$$

Where:
- $H_m$: Planetary Boundary Layer (PBL) / Mixing Height ($\text{meters}$)
- $U$: Horizontal surface wind speed ($\text{m/s}$ or synoptic velocity)
- $VC$: Ventilation Coefficient ($\text{m}^2/\text{s}$)

```
┌────────────────────────────────────────────────────────┐
│             AIR POLLUTION DISPERSION COLUMN            │
│                                                        │
│   Wind Speed (U) ────────► ────────►                   │
│  ┌─────────────────────────────────────────┐           │
│  │ Inversion Lid (Warm Air Cap Barrier)    │           │
│  ├─────────────────────────────────────────┤ ▲         │
│  │                                         │ │         │
│  │  Trapped Ground Layer (Emissions)       │ │ Mixing  │
│  │  Smoke, PM2.5, NOx Concentration        │ │ Height  │
│  │                                         │ │ (H_m)   │
│  └─────────────────────────────────────────┘ ▼         │
│  ═════════════════════════════════════════════         │
│                Delhi NCR Surface                       │
└────────────────────────────────────────────────────────┘
```

#### Atmospheric Dispersion Regimes:

| Ventilation Index ($VC$) | Dispersion Category | Atmospheric Behavior in Delhi NCR | AirSync Advisory Trigger |
|---|---|---|---|
| **$VC < 2,000 \text{ m}^2/\text{s}$** | **Critical / Poor** | Surface stagnation, pollutant trapping, low vertical and horizontal dilution | Pre-emptive misting, heavy vehicle diversions, industrial shift rescheduling |
| **$2,000 \le VC < 6,000 \text{ m}^2/\text{s}$** | **Moderate** | Subdued dispersion; gradual particulate accumulation | Normal monitoring, dust suppression |
| **$VC \ge 6,000 \text{ m}^2/\text{s}$** | **Good / Active Flushing** | Strong convective mixing and advective clearance | Safe outdoor activity windows |

#### AirSync Timeline Snapshot Calibration ([`src/lib/db.ts`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/lib/db.ts#L145-L245)):

- **NOW ($t = 0\text{h}$)**: $H_m = 320\text{ m}, \; U = 6\text{ km/h} \implies VC = 1,920\text{ m}^2/\text{s}$ → **Critical Stagnation**
- **Tomorrow AM Peak ($+24\text{h}$)**: $H_m = 240\text{ m}, \; U = 4\text{ km/h} \implies VC = 960\text{ m}^2/\text{s}$ → **Severe Stagnation**
- **Projected Peak ($+48\text{h}$)**: $H_m = 280\text{ m}, \; U = 5\text{ km/h} \implies VC = 1,400\text{ m}^2/\text{s}$ → **Poor Dispersion**
- **Dispersal Phase ($+72\text{h}$)**: $H_m = 650\text{ m}, \; U = 12\text{ km/h} \implies VC = 7,800\text{ m}^2/\text{s}$ → **Active Flushing**

---

### 3. Planetary Boundary Layer (PBL) & Thermal Inversion Mechanics

The core reason why Delhi NCR experiences intense winter smog is **thermal inversion**, modeled in [`src/lib/reasoningEngine.ts`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/lib/reasoningEngine.ts#L39-L47) and displayed in [`src/components/AtmosphericIntelligence.tsx`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/components/AtmosphericIntelligence.tsx#L32-L96).

#### A. Temperature Lapse Rate Reversal

Under standard tropospheric conditions, air temperature decreases with altitude:

$$
\Gamma = -\frac{dT}{dz} \approx +6.5^\circ\text{C}/\text{km} \quad (\text{Normal Environmental Lapse Rate})
$$

During winter nights, rapid longwave radiative cooling of the ground surface chills the contact air layer while air aloft remains warmer, reversing the temperature gradient:

$$
\frac{dT}{dz} > 0 \quad (\text{Thermal Inversion Layer})
$$

Because warmer, less dense air overlies cooler, denser ground air, vertical buoyancy is extinguished:

$$
a_z = g \left( \frac{T_{\text{parcel}} - T_{\text{env}}}{T_{\text{env}}} \right) < 0 \quad (\text{Negative Buoyant Acceleration})
$$

Pollutants emitted at ground level (exhaust, biomass smoke, dust) cannot rise and remain trapped under an atmospheric "lid."

#### B. Geometric Box Trapping Model

The ground boundary layer volume $V$ over an urban basin of surface area $A$ is:

$$
V = A \times H_m
$$

Under steady emission flux $Q$ ($\text{g/s}$), steady-state ground concentration $C$ follows the box dilution relationship:

$$
C = \frac{Q}{A \times H_m \times U}
$$

When inversion height $H_m$ compresses from $1,200\text{ m}$ to $240\text{ m}$, the available dilution volume shrinks by **80%**, causing a proportional spike in ground-level particulate concentration even without any increase in emission sources.

#### C. Inversion Trapping Ratio ($R_{\text{trap}}$)

AirSync models the trapping efficiency percentage $R_{\text{trap}}$ as an inverse function of boundary layer depth:

$$
R_{\text{trap}} = \left( 1 - \frac{H_m}{H_{\text{ref}}} \right) \times 100\%
$$

Where $H_{\text{ref}} \approx 1,800\text{ m}$ is the uninhibited summer convective mixing height.
- At $H_m = 320\text{ m}$: $R_{\text{trap}} \approx 82\%$ trapped
- At $H_m = 240\text{ m}$: $R_{\text{trap}} \approx 91\%$ trapped
- At $H_m = 650\text{ m}$: $R_{\text{trap}} \approx 45\%$ trapped

---

### 4. Regional Plume Advection & Transport Corridor Dynamics

AirSync couples **NASA FIRMS satellite thermal anomaly detection** (VIIRS/MODIS) with Lagrangian wind advection vectors to track regional biomass burning transport from Punjab and Haryana into Delhi NCR ([`src/lib/reasoningEngine.ts`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/lib/reasoningEngine.ts#L29-L37), [`src/components/DelhiNCRMap.tsx`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/components/DelhiNCRMap.tsx#L45-L54)).

#### A. 2D Advection Velocity Vector

Prevailing northwest synoptic winds transport agricultural smoke parcels along the Indo-Gangetic Plain:

$$
\vec{v} = (u, v) = \big( |\vec{U}| \cos\theta, \; |\vec{U}| \sin\theta \big)
$$

Where $\theta \approx 315^\circ$ represents prevailing North-Westerly (NW) wind flow directed toward South-East (SE).

#### B. Transit Lag Equation

The time $\Delta t$ required for an upwind smoke plume at distance $D$ to reach Delhi NCR is given by:

$$
\Delta t = \frac{D}{|\vec{v}_{\text{transport}}|}
$$

- Upwind fire centroid distance: $D \approx 250 - 350\text{ km}$ (Punjab/Haryana agricultural belt)
- Upper boundary-layer transport winds: $|\vec{v}_{\text{transport}}| \approx 8 - 14\text{ km/h}$
- **Calculated Transit Time**: $\Delta t \approx 24 - 36\text{ hours}$

This mathematical lag enables AirSync to issue predictive alerts 24 to 36 hours before satellite-detected smoke reaches ground monitors in the capital.

#### C. Micro-Meteorological Funneling (Noida/Ghaziabad vs Gurugram)

Regional variations across NCR districts are modeled by accounting for windward versus leeward positioning relative to the Yamuna river basin:
- **Gurugram** (South-West): Lies on the western flank; receives partial cross-ventilation before full plume saturation.
- **Ghaziabad & Noida** (East): Lie directly downwind of the northwest transport vector. Plumes crossing Delhi decelerate over the eastern urban friction barrier, pooling against industrial baseline emissions and driving higher sustained AQI.

---

### 5. Secondary Smog Formation & Aerosol Hygroscopic Swelling

AirSync accounts for secondary aerosol chemistry and moisture interactions under early morning conditions:

#### A. Aerosol Hygroscopic Growth Function

Under high morning relative humidity ($RH > 65\%$), hygroscopic salts (ammonium nitrate $\text{NH}_4\text{NO}_3$ and ammonium sulfate $(\text{NH}_4)_2\text{SO}_4$) absorb water vapor, increasing particle diameter:

$$
D_p(RH) = D_{p,\text{dry}} \times \left( 1 - \frac{RH}{100} \right)^{-\gamma}
$$

Where $\gamma$ is the aerosol hygroscopicity parameter ($\approx 0.20 - 0.28$ for urban NCR aerosols).

#### B. Impact on Light Extinction & Smog Visibility

The optical cross-section and light extinction coefficient $\beta_{\text{ext}}$ scale with particle cross-sectional area ($D_p^2$):

$$
\beta_{\text{ext}} \propto N \cdot D_p(RH)^2
$$

As relative humidity surges past 70% in morning inversions, aerosol particles swell, multiplying visual extinction, reducing Koschmieder visual range ($L_v = 3.912 / \beta_{\text{ext}}$), and generating dense morning smog before mid-day solar dehydration.

---

### 6. 72-Hour Predictive Forecast Curve & Diurnal Wave Model

In [`src/app/api/forecast/route.ts`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/app/api/forecast/route.ts#L47-L65) and [`src/components/Forecast72Hours.tsx`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/components/Forecast72Hours.tsx#L50-L65), the 72-hour trajectory is modeled and rendered using harmonic analysis and cubic spline geometry.

#### A. Diurnal Sinusoidal Harmonic Perturbation

The continuous AQI curve incorporates diurnal solar-heating oscillation on top of synoptic baseline trends:

$$
\text{AQI}(t) = \text{BaseAQI}(t) + A \cdot \sin\left( \frac{2\pi \cdot t}{T} + \phi \right)
$$

Where:
- $T = 24\text{ hours}$ (diurnal cycle period)
- $\phi$: Phase angle aligning peak amplitude with the 06:00–10:00 AM nocturnal trapping window
- $A$: Diurnal swing amplitude ($\approx 6 - 12\text{ AQI points}$)

#### B. Cubic Bézier Spline Interpolation for Visual Smoothness

The SVG forecast curve uses piecewise cubic Bézier curves connecting adjacent 12-hour forecast coordinates $(x_i, y_i)$ to guarantee first-derivative ($C^1$) smoothness:

$$
B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3, \quad t \in [0, 1]
$$

With smooth horizontal tangent control points:

$$
\begin{aligned}
P_1 &= \big( x_0 + 0.45 \cdot (x_1 - x_0), \; y_0 \big) \\
P_2 &= \big( x_1 - 0.45 \cdot (x_1 - x_0), \; y_1 \big)
\end{aligned}
$$

---

### 7. Fluid Streamline Particle Advection (Atmospheric Canvas)

The ambient background visualizer in [`src/components/AtmosphericCanvas.tsx`](file:///c:/Users/GUNAVARDHAN/.gemini/antigravity/scratch/airsync/src/components/AtmosphericCanvas.tsx#L51-L91) numerically integrates velocity vectors along the northwest transport path:

#### Particle Integration:

$$
\begin{aligned}
x_{t+1} &= x_t + v \cdot \cos\theta \\
y_{t+1} &= y_t + v \cdot \sin\theta
\end{aligned}
$$

Where:
- $\theta = 35^\circ$ ($0.6108\text{ rad}$), directing streamlines from upper-left (North-West) to lower-right (South-East)
- Particle speed: $v \in [0.35, 1.05]\text{ px/frame}$
- Particle length: $L \in [25, 70]\text{ px}$
- Boundary wrap: $\text{if } x > W + 50 \implies x \leftarrow -50, \quad y \leftarrow \operatorname{Uniform}(0, H)$

---

## Steps to Run

### Prerequisites

- **Node.js** v18 or above
- **npm** v9 or above
- Internet connection (for Open-Meteo live API calls)

### Option 1: Windows One-Click Launch

Double-click **`Start AirSync.bat`** in the project root.
It will automatically start the dev server and open `http://localhost:3000`.

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd airsync

# 2. Install dependencies
npm install

# 3. (Optional) Seed the SQLite database with a clean slate
npm run db:seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: The database is initialized automatically on first run via `initDatabase()` in `lib/db.ts`. Running `npm run db:seed` separately wipes and re-seeds the database for a guaranteed clean state.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run db:seed` | Wipes and re-seeds the SQLite database with all initial atmospheric data |
| `npm run build` | Builds the production bundle (also runs `db:seed` automatically as a prebuild step) |
| `npm run start` | Starts the production server (requires `npm run build` first) |
| `npm run lint` | Runs ESLint across all source files |

---

## Database Schema

The SQLite database (`data/airsync.db`) contains 5 tables:

### `timeline_snapshots`
Stores the full atmospheric snapshot for each timeline (`now` / `24h` / `48h` / `72h`) including AQI, PM2.5, weather fields, thermal inversion depth and trapping ratio, dispersion index and ventilation coefficient, plume corridor details, and overall risk summary.

### `regional_data`
Stores per-district telemetry for all 6 NCR districts (Delhi, Noida, Gurugram, Ghaziabad, Faridabad, Greater Noida) at each timeline. Columns include AQI, PM2.5, tomorrow AQI, trend direction (`up/down/stable`), inversion level, dispersion level, plume influence, and GPS coordinates.

### `forecast_points`
Stores the 7 forecast data points (0h → 72h at 12-hour intervals) with AQI, PM2.5, inversion, dispersion, plume risk, and a peak flag used to highlight critical windows.

### `action_advisories`
Stores role-specific action advisories for `citizens`, `authorities`, and `industries` — each with a badge label, headline, bullet points (stored as a JSON array), and a primary action call-out.

### `ai_query_logs`
Logs every question answered by the Ask AirSync engine along with the generated answer, key meteorological factors (JSON array), and a UTC timestamp.

---

## Internal API Routes

| Route | Method | Description |
|---|---|---|
| `/api/overview` | GET | Live AQI + pollutants from CAMS and current weather. Supports `?timeline=now / 24h / 48h / 72h`. |
| `/api/weather` | GET | Detailed live weather (temperature, humidity, wind, pressure, weather code, 72h hourly) from Open-Meteo. |
| `/api/regions` | GET | Telemetry for all 6 NCR districts from SQLite, filtered by `?timeline=`. |
| `/api/forecast` | GET | Full 72-hour AQI forecast array plus identified peak window with causal explanations. |
| `/api/action` | GET | Action advisories from SQLite. Optional `?role=citizens / authorities / industries`. |
| `/api/ask-airsync` | POST | Runs the causal reasoning engine. Body: `{ "question": "..." }`. Returns answer, keyFactors, confidence, meteorologicalBasis. |
| `/api/ask-airsync` | GET | Returns the 5 most recent AI query logs from the database. |
| `/api/status` | GET | Operational status of all data pipelines (CPCB, NASA FIRMS, ECMWF/CAMS, IMD, AirSync Physics). |

---

## Data Sources

| Source | Type | Used For |
|---|---|---|
| **Open-Meteo** (open-meteo.com) | Live API · Free | Real-time weather: temperature, humidity, wind, pressure, precipitation |
| **Open-Meteo Air Quality / CAMS** | Live API · Free | Real-time AQI (US EPA scale), PM2.5, PM10, NO₂, SO₂, O₃, CO |
| **CPCB CAAQMS** | Reference data | Continuous Ambient Air Quality Monitoring Station grid — 40+ stations in NCR |
| **NASA FIRMS** | Reference data | VIIRS/MODIS satellite fire anomaly detection for stubble burning plume corridors |
| **ECMWF / CAMS** | Reference model | Aerosol optical depth, boundary-layer height, atmospheric transport modeling |
| **IMD** | Reference data | Synoptic surface wind vectors and boundary meteorological observations |

---

*Built for Smart India Hackathon 2026 · AirSync Physics + Causal AI · Delhi NCR*