import { supabase } from './supabase';
import type { CareerFull } from '../data/careersTypes';

export interface CareerFilter {
  searchQuery?: string;
  category?: string;
  riasecCodes?: string[];
  demandLevel?: 'high' | 'medium' | 'low';
  salaryMin?: number;
  salaryMax?: number;
}

export async function fetchAllCareers(): Promise<CareerFull[]> {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching careers:', error);
    return [];
  }

  return (data || []) as CareerFull[];
}

export async function fetchCareerById(id: string): Promise<CareerFull | null> {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching career:', error);
    return null;
  }

  return data as CareerFull;
}

export async function searchCareers(filters: CareerFilter): Promise<CareerFull[]> {
  let query = supabase.from('careers').select('*');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.demandLevel) {
    query = query.eq('jobDemand.level', filters.demandLevel);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching careers:', error);
    return [];
  }

  let results = (data || []) as CareerFull[];

  // Client-side filtering for complex queries
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  if (filters.riasecCodes && filters.riasecCodes.length > 0) {
    results = results.filter((c) => {
      const matches = filters.riasecCodes!.map((code) => {
        const codeKey = code.toLowerCase() as keyof typeof c.riasecMatch;
        return c.riasecMatch[codeKey] > 50;
      });
      return matches.some((m) => m);
    });
  }

  if (filters.salaryMin !== undefined) {
    results = results.filter((c) => c.salary.entryLevel >= filters.salaryMin!);
  }

  if (filters.salaryMax !== undefined) {
    results = results.filter((c) => c.salary.entryLevel <= filters.salaryMax!);
  }

  return results;
}

export async function saveCareersCache(careers: CareerFull[]): Promise<void> {
  localStorage.setItem('prospect_sa_careers_cache', JSON.stringify(careers));
  localStorage.setItem('prospect_sa_careers_cache_time', Date.now().toString());
}

export function getCareersCache(): CareerFull[] | null {
  const cached = localStorage.getItem('prospect_sa_careers_cache');
  const cacheTime = localStorage.getItem('prospect_sa_careers_cache_time');

  if (!cached || !cacheTime) return null;

  // Cache expires after 24 hours
  const now = Date.now();
  const cacheAge = now - parseInt(cacheTime);
  if (cacheAge > 24 * 60 * 60 * 1000) {
    localStorage.removeItem('prospect_sa_careers_cache');
    localStorage.removeItem('prospect_sa_careers_cache_time');
    return null;
  }

  return JSON.parse(cached) as CareerFull[];
}

export async function findSimilarCareers(
  careerId: string,
  allCareers: CareerFull[]
): Promise<CareerFull[]> {
  const career = allCareers.find((c) => c.id === careerId);
  if (!career) return [];

  // Calculate similarity based on RIASEC match and category
  const similarities = allCareers
    .filter((c) => c.id !== careerId)
    .map((c) => {
      let riasecScore = 0;
      let count = 0;

      (['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] as const).forEach((code) => {
        riasecScore += Math.abs(c.riasecMatch[code] - career.riasecMatch[code]);
        count++;
      });

      const avgDiff = riasecScore / count;
      const categoryMatch = c.category === career.category ? 0 : 10;
      const score = 100 - (avgDiff + categoryMatch);

      return { career: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.career);

  return similarities;
}
