import { CareerFull } from '../data/careersTypes';
import { allCareersComplete } from '../data/careers400Final';
import {
  UNIVERSITIES,
  TVET_COLLEGES,
  COST_OF_LIVING,
  PROVINCE_JOB_DEMAND,
  MAJOR_CITIES,
  INDUSTRY_BREAKDOWN,
  TOP_EMPLOYERS,
  UniversityLocation,
  TVETCollegeLocation,
  CostOfLiving,
  ProvinceJobDemand,
} from '../data/mapData';
import { bursaries } from '../data/bursaries';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'user' | 'career' | 'university' | 'tvet' | 'jobHotspot';
  title: string;
  demandLevel?: 'high' | 'medium' | 'low';
  icon?: string;
}

/**
 * Get careers available in a specific province
 */
export function getCareersByProvince(province: string, limit?: number): CareerFull[] {
  const filtered = allCareersComplete.filter((career) => {
    const { jobLocations } = career;
    return (
      jobLocations.provinces.includes(province) ||
      jobLocations.provinces.includes('All provinces')
    );
  });

  // Sort by demand level (high > medium > low)
  filtered.sort((a, b) => {
    const demandOrder = { high: 0, medium: 1, low: 2 };
    return demandOrder[a.jobDemand.level] - demandOrder[b.jobDemand.level];
  });

  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get careers available in a specific city hotspot
 */
export function getCareersByHotspot(city: string): CareerFull[] {
  return allCareersComplete.filter((career) => career.jobLocations.hotspots.includes(city));
}

/**
 * Get universities available in a province
 */
export function getUniversitiesByProvince(province: string): UniversityLocation[] {
  return UNIVERSITIES.filter((uni) => uni.province === province);
}

/**
 * Get TVET colleges available in a province
 */
export function getTVETCollegesByProvince(province: string): TVETCollegeLocation[] {
  return TVET_COLLEGES.filter((college) => college.province === province);
}

/**
 * Get all colleges (universities + TVET) in a province
 */
export function getCollegesByProvince(province: string): (UniversityLocation | TVETCollegeLocation)[] {
  return [
    ...getUniversitiesByProvince(province),
    ...getTVETCollegesByProvince(province),
  ];
}

/**
 * Get job demand summary for all provinces
 */
export function getJobDemandByProvince(): ProvinceJobDemand[] {
  return PROVINCE_JOB_DEMAND;
}

/**
 * Get job demand for a specific province
 */
export function getJobDemandForProvince(province: string): ProvinceJobDemand | null {
  return PROVINCE_JOB_DEMAND.find((pd) => pd.province === province) || null;
}

/**
 * Get cost of living data for a city
 */
export function getCostOfLivingByCity(city: string): CostOfLiving | null {
  return COST_OF_LIVING.find((col) => col.city === city) || null;
}

/**
 * Get bursaries available in a province
 */
export function getBursariesByProvince(province: string) {
  return bursaries.filter(
    (bursary) =>
      !bursary.provincesOffered || bursary.provincesOffered.includes(province) || bursary.provincesOffered.includes('All')
  );
}

/**
 * Create map markers from careers
 */
export function createCareerMarkers(careers: CareerFull[]): MapMarker[] {
  const markers: MapMarker[] = [];

  // For each career, add a marker for each hotspot location
  for (const career of careers) {
    for (const hotspot of career.jobLocations.hotspots) {
      const city = MAJOR_CITIES.find((c) => c.name === hotspot);
      if (city) {
        markers.push({
          id: `career-${career.id}-${hotspot}`,
          lat: city.lat,
          lng: city.lng,
          type: 'career',
          title: career.title,
          demandLevel: career.jobDemand.level,
          icon: '💼',
        });
      }
    }
  }

  return markers;
}

/**
 * Create map markers from universities
 */
export function createUniversityMarkers(universities: UniversityLocation[]): MapMarker[] {
  return universities.map((uni) => ({
    id: `uni-${uni.name}`,
    lat: uni.lat,
    lng: uni.lng,
    type: 'university',
    title: uni.name,
    icon: '🎓',
  }));
}

/**
 * Create map markers from TVET colleges
 */
export function createTVETMarkers(colleges: TVETCollegeLocation[]): MapMarker[] {
  return colleges.map((college) => ({
    id: `tvet-${college.name}`,
    lat: college.lat,
    lng: college.lng,
    type: 'tvet',
    title: college.name,
    icon: '🏗️',
  }));
}

/**
 * Get careers with high demand in a province
 */
export function getHighDemandCareers(province: string): CareerFull[] {
  return getCareersByProvince(province).filter((career) => career.jobDemand.level === 'high');
}

/**
 * Get TVET-suitable careers (non-university track)
 */
export function getTVETCareers(): CareerFull[] {
  return allCareersComplete.filter(
    (career) => career.category === 'tvet' || career.category === 'trade' || career.category === 'digital'
  );
}

/**
 * Get TVET careers in a province
 */
export function getTVETCareersByProvince(province: string): CareerFull[] {
  return getTVETCareers().filter((career) => {
    return (
      career.jobLocations.provinces.includes(province) ||
      career.jobLocations.provinces.includes('All provinces')
    );
  });
}

/**
 * Format salary to readable format
 */
export function formatSalary(salary: number): string {
  if (salary >= 1000000) {
    return `R${(salary / 1000000).toFixed(1)}M`;
  } else if (salary >= 1000) {
    return `R${(salary / 1000).toFixed(0)}k`;
  }
  return `R${salary}`;
}

/**
 * Get nearby universities and TVET to a location (within same province is "nearby")
 */
export function getNearbyColleges(
  lat: number,
  lng: number,
  province: string
): { universities: UniversityLocation[]; tvet: TVETCollegeLocation[] } {
  return {
    universities: getUniversitiesByProvince(province),
    tvet: getTVETCollegesByProvince(province),
  };
}

/**
 * Get industry breakdown for a province
 */
export function getIndustryBreakdown(province: string) {
  return INDUSTRY_BREAKDOWN.find((ib) => ib.province === province);
}

/**
 * Get top employers in a province
 */
export function getTopEmployersByProvince(province: string): typeof TOP_EMPLOYERS {
  return TOP_EMPLOYERS.filter((emp) => emp.province === province);
}

/**
 * Count careers available in a province
 */
export function countCareersInProvince(province: string): number {
  return getCareersByProvince(province).length;
}

/**
 * Count colleges (universities + TVET) in a province
 */
export function countCollegesInProvince(province: string): number {
  const unis = getUniversitiesByProvince(province).length;
  const tvet = getTVETCollegesByProvince(province).length;
  return unis + tvet;
}

/**
 * Get average salary by province (calculated from careers)
 */
export function getAverageSalaryByProvince(province: string): number {
  const careers = getCareersByProvince(province);
  if (careers.length === 0) return 0;

  const total = careers.reduce((sum, c) => sum + c.salary.entryLevel, 0);
  return Math.round(total / careers.length);
}
