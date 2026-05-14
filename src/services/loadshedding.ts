export interface LoadSheddingData {
  currentStage: number;
  forecast: Array<{ date: string; stage: number }>;
  updatedAt: string;
}

const CACHE_KEY = 'prospect_loadshedding_cache';
const CACHE_TTL = 30 * 60 * 1000;

export async function fetchLoadShedding(): Promise<LoadSheddingData> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    } catch {
      // ignore
    }
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch('https://loadshedding.eskom.co.za/api/v4/load_shedding/current'),
      fetch('https://loadshedding.eskom.co.za/api/v4/load_shedding/forecast'),
    ]);

    const current = await currentRes.json();
    const forecastData = await forecastRes.json();

    const data: LoadSheddingData = {
      currentStage: current.status ?? 0,
      forecast: forecastData.forecast ?? [],
      updatedAt: current.updated_at ?? new Date().toISOString(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch {
    // API unreachable — return suspended state (most common in 2025+)
    const data: LoadSheddingData = {
      currentStage: 0,
      forecast: [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  }
}

export interface StageInfo {
  name: string;
  hours: string;
  colorBg: string;
  colorText: string;
}

export function getStageInfo(stage: number): StageInfo {
  if (stage === 0) return { name: 'No Load Shedding', hours: 'No scheduled outages', colorBg: 'bg-green-50', colorText: 'text-green-800' };
  if (stage <= 2) return { name: `Stage ${stage}`, hours: 'Approximately 1 hour per day', colorBg: 'bg-yellow-50', colorText: 'text-yellow-800' };
  if (stage <= 4) return { name: `Stage ${stage}`, hours: 'Approximately 2 hours per day', colorBg: 'bg-orange-50', colorText: 'text-orange-800' };
  if (stage <= 6) return { name: `Stage ${stage}`, hours: `Approximately ${stage <= 5 ? 3 : '3–4'} hours per day`, colorBg: 'bg-red-50', colorText: 'text-red-800' };
  return { name: `Stage ${stage}`, hours: 'Approximately 4+ hours per day', colorBg: 'bg-red-100', colorText: 'text-red-900' };
}

export function initLoadSheddingSync() {
  fetchLoadShedding();
  setInterval(fetchLoadShedding, CACHE_TTL);
}
