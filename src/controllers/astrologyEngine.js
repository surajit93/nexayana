// src/controllers/astrologyEngine.js

import { getUserKundali, getZodiacCompatibility } from "../models/kundaliModel.js";
import { getCurrentDate } from "../utils/dateCalc.js";

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

