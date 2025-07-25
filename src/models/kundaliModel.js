// Swiss Ephemeris setup (swisseph must be loaded globally, not via require)
swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

// Embedded nakshatra data (full 27 nakshatras with ranges)
const nakshatras = [
  { name: "Ashwini", startDeg: 0.0, endDeg: 13.3333 },
  { name: "Bharani", startDeg: 13.3333, endDeg: 26.6666 },
  { name: "Krittika", startDeg: 26.6666, endDeg: 40.0 },
  { name: "Rohini", startDeg: 40.0, endDeg: 53.3333 },
  { name: "Mrigashira", startDeg: 53.3333, endDeg: 66.6666 },
  { name: "Ardra", startDeg: 66.6666, endDeg: 80.0 },
  { name: "Punarvasu", startDeg: 80.0, endDeg: 93.3333 },
  { name: "Pushya", startDeg: 93.3333, endDeg: 106.6666 },
  { name: "Ashlesha", startDeg: 106.6666, endDeg: 120.0 },
  { name: "Magha", startDeg: 120.0, endDeg: 133.3333 },
  { name: "Purva Phalguni", startDeg: 133.3333, endDeg: 146.6666 },
  { name: "Uttara Phalguni", startDeg: 146.6666, endDeg: 160.0 },
  { name: "Hasta", startDeg: 160.0, endDeg: 173.3333 },
  { name: "Chitra", startDeg: 173.3333, endDeg: 186.6666 },
  { name: "Swati", startDeg: 186.6666, endDeg: 200.0 },
  { name: "Vishakha", startDeg: 200.0, endDeg: 213.3333 },
  { name: "Anuradha", startDeg: 213.3333, endDeg: 226.6666 },
  { name: "Jyeshtha", startDeg: 226.6666, endDeg: 240.0 },
  { name: "Mula", startDeg: 240.0, endDeg: 253.3333 },
  { name: "Purva Ashadha", startDeg: 253.3333, endDeg: 266.6666 },
  { name: "Uttara Ashadha", startDeg: 266.6666, endDeg: 280.0 },
  { name: "Shravana", startDeg: 280.0, endDeg: 293.3333 },
  { name: "Dhanishta", startDeg: 293.3333, endDeg: 306.6666 },
  { name: "Shatabhisha", startDeg: 306.6666, endDeg: 320.0 },
  { name: "Purva Bhadrapada", startDeg: 320.0, endDeg: 333.3333 },
  { name: "Uttara Bhadrapada", startDeg: 333.3333, endDeg: 346.6666 },
  { name: "Revati", startDeg: 346.6666, endDeg: 360.0 }
];

// Julian Day calculation
function toJulianDay(date) {
  return swe.swe_julday(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60,
    swe.SE_GREG_CAL
  );
}

// Planet position in degrees (Lahiri, Sidereal)
function getPlanetPosition(jd, planetId) {
  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL;
  const result = swe.swe_calc_ut(jd, planetId, flags);
  return result.xx[0]; // longitude
}

// Ascendant + House cusps (Placidus)
function getAscendantAndHouses(jd, lat, lon) {
  const { cusp, ascmc } = swe.swe_houses_ex(jd, swe.SEFLG_SWIEPH, lat, lon, 'P');
  return {
    ascendantDegree: ascmc[0],
    ascendantSignIndex: Math.floor(ascmc[0] / 30),
    houses: cusp
  };
}

// Nakshatra with Pada
function getNakshatra(degree) {
  const siderealDeg = degree % 360;
  for (const n of nakshatras) {
    if (siderealDeg >= n.startDeg && siderealDeg < n.endDeg) {
      const pada = Math.floor(((siderealDeg - n.startDeg) / (13.3333 / 4))) + 1;
      return { name: n.name, pada };
    }
  }
  return { name: 'Unknown', pada: 0 };
}

// Tithi calculation
function getTithi(moonDeg, sunDeg) {
  const diff = (moonDeg - sunDeg + 360) % 360;
  const tithiIndex = Math.floor(diff / 12);
  const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const tithiNumber = (tithiIndex % 15) + 1;
  return `${paksha} Paksha Tithi ${tithiNumber}`;
}

// Yoga calculation
function getYoga(moonDeg, sunDeg) {
  const sum = (moonDeg + sunDeg) % 360;
  const yogaIndex = Math.floor(sum / 13.3333);
  return `Yoga ${yogaIndex + 1}`;
}

// Karana calculation
function getKarana(moonDeg, sunDeg) {
  const diff = (moonDeg - sunDeg + 360) % 360;
  const karanaIndex = Math.floor((diff % 180) / 6);
  return `Karana ${karanaIndex + 1}`;
}

// Vara (weekday)
function getVara(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'UTC' });
}

// Main kundali generation function
function generateKundali(datetimeStr, lat, lon) {
  const date = new Date(datetimeStr);
  const jd = toJulianDay(date);

  const sun = getPlanetPosition(jd, swe.SE_SUN);
  const moon = getPlanetPosition(jd, swe.SE_MOON);
  const mars = getPlanetPosition(jd, swe.SE_MARS);
  const mercury = getPlanetPosition(jd, swe.SE_MERCURY);
  const jupiter = getPlanetPosition(jd, swe.SE_JUPITER);
  const venus = getPlanetPosition(jd, swe.SE_VENUS);
  const saturn = getPlanetPosition(jd, swe.SE_SATURN);
  const rahu = getPlanetPosition(jd, swe.SE_MEAN_NODE);
  const ketu = (rahu + 180) % 360;

  const { ascendantDegree, ascendantSignIndex, houses } = getAscendantAndHouses(jd, lat, lon);
  const nakshatra = getNakshatra(moon);

  return {
    datetime: datetimeStr,
    location: { latitude: lat, longitude: lon },
    ascendant: {
      degree: ascendantDegree,
      signIndex: ascendantSignIndex
    },
    houses,
    planets: {
      sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu
    },
    nakshatra,
    tithi: getTithi(moon, sun),
    yoga: getYoga(moon, sun),
    karana: getKarana(moon, sun),
    vara: getVara(date)
  };
}

