
import { getUserKundali, getZodiacCompatibility } from "../models/kundaliModel.js";
import { getCurrentDate } from "../utils/dateCalc.js";
import {
  calculatePlanetLongitude,
  calculateAscendant,
  getNakshatraForDegree,
  getPadaForNakshatra,
  determineDoshas,
  computeDashas,
  findYogas,
  calculatePanchanga
} from '../models/kundaliModel.js';
export function getZodiacSign(dob) {
  const date = new Date(dob);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const zodiacSigns = [
    { sign:'Capricorn',   from:'12-22', to:'01-19' },
    { sign:'Aquarius',    from:'01-20', to:'02-18' },
    { sign:'Pisces',      from:'02-19', to:'03-20' },
    { sign:'Aries',       from:'03-21', to:'04-19' },
    { sign:'Taurus',      from:'04-20', to:'05-20' },
    { sign:'Gemini',      from:'05-21', to:'06-20' },
    { sign:'Cancer',      from:'06-21', to:'07-22' },
    { sign:'Leo',         from:'07-23', to:'08-22' },
    { sign:'Virgo',       from:'08-23', to:'09-22' },
    { sign:'Libra',       from:'09-23', to:'10-22' },
    { sign:'Scorpio',     from:'10-23', to:'11-21' },
    { sign:'Sagittarius', from:'11-22', to:'12-21' }
  ];

  for (let z of zodiacSigns) {
    const [fromMonth, fromDay] = z.from.split("-").map(Number);
    const [toMonth, toDay] = z.to.split("-").map(Number);

    if (
      (month === fromMonth && day >= fromDay) ||
      (month === toMonth && day <= toDay)
    ) {
      return z.sign;
    }
  }

  return "Unknown";
}

export async function loadKundali(userId) {
  return await getUserKundali(userId);
}

export async function checkZodiacCompatibility(sign1, sign2) {
  return await getZodiacCompatibility(sign1, sign2);
}

export function generateDailyPrediction(zodiacSign) {
  const day = getCurrentDate();
  return `Prediction for ${zodiacSign} on ${day}: Great opportunities await if you stay positive.`;
}


// src/controllers/astrologyEngine.js



/**
 * Generate full standalone Kundali for given birth profile
 * @param {Object} profile
 * @returns {Promise<Object>}
 */
export async function generateFullKundali(profile) {
  const { name, gender, dob, time, place, latitude, longitude, timezone } = profile;

  // 1. Convert DOB and time into Julian day / sidereal time
  const birthMoment = new Date(`${dob}T${time}${timezone}`);

  // 2. Calculate planetary longitudes
  const planets = {};
  ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'].forEach(body => {
    const lon = calculatePlanetLongitude(body, birthMoment, latitude, longitude);
    const nakshatra = getNakshatraForDegree(lon);
    planets[body] = {
      sign: nakshatra.sign,
      degree: lon % 30,
      nakshatra: nakshatra.name,
      pada: getPadaForNakshatra(nakshatra, lon),
      house: null,         // Populated later
      retrograde: lon.isRetrograde,
      strength: lon.strength,
      dignity: lon.dignity
    };
  });

  // 3. Ascendant calculation
  const asc = calculateAscendant(birthMoment, latitude, longitude);
  planets.ascendant = { sign: asc.sign, degree: asc.degree };

  // 4. Assign houses: whole-sign house system
  const houses = {};
  for (let i = 1; i <= 12; i++) {
    houses[`house${i}`] = ((asc.signIndex + i - 1) % 12) + 1; // sign index to Rashi names
  }
  Object.keys(planets).forEach(body => {
    if (planets[body].house == null) {
      const signIndex = getSignIndex(planets[body].sign);
      planets[body].house = ((signIndex - asc.signIndex + 12) % 12) + 1;
    }
  });

  // 5. Panchanga details
  const panchanga = calculatePanchanga(birthMoment, latitude, longitude);

  // 6. Compute Dashas
  const dashas = computeDashas(birthMoment, planets.Moon);

  // 7. Determine Doshas and Yogas
  const doshas = determineDoshas(planets, asc);
  const yogas = findYogas(planets, houses);

  // Output combined Kundali JSON
  return {
    userProfile: { name, gender, dob, time, place, coordinates: { latitude, longitude, timezone } },
    basicDetails: {
      sunSign: planets.Sun.sign,
      moonSign: planets.Moon.sign,
      ascendant: asc.sign,
      nakshatra: planets.Moon.nakshatra,
      birthRashi: planets.Moon.sign
    },
    planetaryPositions: planets,
    houses,
    divisionalCharts: {},    // Optional: stub for D9, D7 charts if implemented
    doshas,
    yogas,
    dashas,
    panchanga,
    remedies: [],            // Placeholder: can be rule-based
    matchMaking: {},         // Placeholder: combine two kundalis later
    metadata: { generatedAt: new Date().toISOString(), version: "1.0" }
  };
}
