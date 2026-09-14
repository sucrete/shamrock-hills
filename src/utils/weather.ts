const LAT = 38.8631;
const LON = -94.3735;

// api.weather.gov accepts any User-Agent, but wants one that identifies the
// calling app rather than a generic browser string.
const USER_AGENT = 'ShamrockHillsGolfClubWebsite/1.0';
const NWS_HEADERS = { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' };

interface NWSPeriod {
  startTime: string;
  isDaytime: boolean;
  temperature: number;
  windSpeed: string;
  shortForecast: string;
}

// NWS reports conditions as free text ("Mostly Sunny", "Chance Rain Showers"),
// not WMO weather codes — this maps that text onto the same code ranges
// getWeatherLabel() already understands, so it needs no changes.
function textToWeatherCode(text: string): number {
  const t = text.toLowerCase();
  if (t.includes('thunder')) return 95;
  if (t.includes('snow') || t.includes('sleet') || t.includes('ice')) return 85;
  if (t.includes('rain') || t.includes('shower') || t.includes('drizzle')) return 61;
  if (t.includes('fog') || t.includes('haze') || t.includes('mist')) return 45;
  if (t.includes('overcast') || (t.includes('cloudy') && !t.includes('partly') && !t.includes('mostly'))) return 3;
  if (t.includes('partly') || t.includes('mostly')) return 2;
  if (t.includes('sunny') || t.includes('clear')) return 0;
  return 1;
}

// windSpeed comes back as a string like "10 mph" or "10 to 15 mph" — take
// the higher end of a range as the representative value.
function parseWindSpeedMph(windSpeed: string): number {
  const matches = windSpeed.match(/\d+/g);
  return matches ? Number(matches[matches.length - 1]) : 0;
}

export async function fetchWeather() {
  try {
    const pointsRes = await fetch(`https://api.weather.gov/points/${LAT},${LON}`, {
      headers: NWS_HEADERS,
      next: { revalidate: 1800 },
    });
    if (!pointsRes.ok) return null;
    const points = await pointsRes.json();
    const { forecast: forecastUrl, forecastHourly: forecastHourlyUrl } = points.properties;

    const [forecastRes, hourlyRes] = await Promise.all([
      fetch(forecastUrl, { headers: NWS_HEADERS, next: { revalidate: 1800 } }),
      fetch(forecastHourlyUrl, { headers: NWS_HEADERS, next: { revalidate: 1800 } }),
    ]);
    if (!forecastRes.ok || !hourlyRes.ok) return null;

    const forecast = await forecastRes.json();
    const hourly = await hourlyRes.json();

    const nowPeriod: NWSPeriod = hourly.properties.periods[0];
    const current = {
      temperature_2m: nowPeriod.temperature,
      weather_code: textToWeatherCode(nowPeriod.shortForecast),
      wind_speed_10m: parseWindSpeedMph(nowPeriod.windSpeed),
    };

    // Day/night periods both key off the same date — a daytime period sets
    // that day's high, the following night period sets its low.
    const dailyMap = new Map<string, { hi?: number; lo?: number; code?: number }>();
    for (const period of forecast.properties.periods as NWSPeriod[]) {
      const date = period.startTime.slice(0, 10);
      const bucket = dailyMap.get(date) ?? {};
      if (period.isDaytime) {
        bucket.hi = period.temperature;
        bucket.code = textToWeatherCode(period.shortForecast);
      } else {
        bucket.lo = period.temperature;
        bucket.code = bucket.code ?? textToWeatherCode(period.shortForecast);
      }
      dailyMap.set(date, bucket);
    }
    const dates = Array.from(dailyMap.keys()).sort();

    const daily = {
      time: dates,
      weather_code: dates.map((d) => dailyMap.get(d)!.code ?? 1),
      temperature_2m_max: dates.map((d) => dailyMap.get(d)!.hi ?? dailyMap.get(d)!.lo ?? 0),
      temperature_2m_min: dates.map((d) => dailyMap.get(d)!.lo ?? dailyMap.get(d)!.hi ?? 0),
    };

    return { current, daily };
  } catch {
    return null;
  }
}

export function getWeatherLabel(code: number, windSpeed = 0): string {
  if (windSpeed > 20) return 'Windy';
  if (code === 0)     return 'Sunny';
  if (code <= 2)      return 'Partly Cloudy';
  if (code === 3)     return 'Cloudy';
  if (code <= 48)     return 'Foggy';
  if (code <= 82)     return 'Rainy';
  if (code <= 86)     return 'Snowy';
  return                     'Stormy';
}
