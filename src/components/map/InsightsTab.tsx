import { motion } from 'motion/react';
import { Briefcase, Building2, Banknote, TrendingUp, Wallet, BarChart2, GraduationCap, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  getIndustryBreakdown,
  getTopEmployersByProvince,
  countCareersInProvince,
  countCollegesInProvince,
  getAverageSalaryByProvince,
  getHighDemandCareers,
  getCostOfLivingByCity,
} from '../../services/mapService';
import { getBursariesByProvince } from '../../services/mapService';

interface InsightsTabProps {
  province: string;
  city?: string;
}

export default function InsightsTab({ province, city }: InsightsTabProps) {
  const careerCount = countCareersInProvince(province);
  const collegeCount = countCollegesInProvince(province);
  const topDemandCareers = getHighDemandCareers(province).slice(0, 3);
  const avgSalary = getAverageSalaryByProvince(province);
  const industryBreakdown = getIndustryBreakdown(province);
  const topEmployers = getTopEmployersByProvince(province);
  const bursaries = getBursariesByProvince(province);
  const costOfLiving = city ? getCostOfLivingByCity(city) : null;

  const StatCard = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border-2 border-slate-100 hover:border-slate-900 hover:shadow-md transition"
    >
      <div className="mb-2 text-slate-500">{icon}</div>
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Job Market Summary */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">Job Market</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Briefcase className="w-6 h-6" />} label="Careers" value={`${careerCount}+`} />
          <StatCard icon={<Building2 className="w-6 h-6" />} label="Colleges" value={`${collegeCount}`} />
          <StatCard icon={<Banknote className="w-6 h-6" />} label="Avg Salary" value={`R${(avgSalary / 1000).toFixed(0)}k`} />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Hot Roles" value={`${topDemandCareers.length}+`} />
        </div>

        {/* Top Demand Careers */}
        {topDemandCareers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 bg-white rounded-2xl p-5 border-2 border-slate-100"
          >
            <p className="text-sm font-semibold text-slate-700 mb-3">Fastest Growing</p>
            <div className="space-y-2">
              {topDemandCareers.map((career) => (
                <div
                  key={career.id}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
                >
                  <span className="text-sm font-medium text-slate-900">{career.title}</span>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded flex items-center gap-1"
                    style={{
                      backgroundColor: '#EF4444',
                      color: 'white',
                    }}
                  >
                    <TrendingUp className="w-3 h-3" /> High
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Cost of Living */}
      {costOfLiving && (
        <section>
          <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">Cost of Living in {city}</h3>
        </div>
          <div className="space-y-3">
            {[
              { label: 'Housing', value: costOfLiving.rent, max: 10000 },
              { label: 'Transport', value: costOfLiving.transport, max: 2000 },
              { label: 'Food', value: costOfLiving.food, max: 5000 },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-4 border-2 border-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{item.label}</span>
                  <span className="font-bold text-slate-900">
                    R{Array.isArray(item.value) ? `${item.value[0]}-${item.value[1]}` : item.value}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-900 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        ((Array.isArray(item.value) ? item.value[1] : item.value) / item.max) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </motion.div>
            ))}

            {/* Monthly Total */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-slate-900/10 to-slate-100 rounded-2xl p-4 border-2 border-slate-200"
            >
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1">
                Monthly Total
              </p>
              <p className="text-2xl font-bold text-slate-900">
                R{costOfLiving.monthly_total[0]} - R{costOfLiving.monthly_total[1]}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Industry Breakdown */}
      {industryBreakdown && (
        <section>
          <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">Industry Breakdown</h3>
        </div>
          <div className="space-y-3">
            {industryBreakdown.industries.map((industry) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-3 border-2 border-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{industry.name}</span>
                  <span className="text-xs font-bold text-slate-600">{industry.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${industry.percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-slate-900 h-2 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Education Landscape */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">Education Landscape</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Building2 className="w-6 h-6" />} label="Universities" value={collegeCount.toString()} />
          <StatCard icon={<Lightbulb className="w-6 h-6" />} label="Bursaries" value={`${bursaries.length}`} />
        </div>
      </section>

      {/* Top Employers */}
      {topEmployers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">Top Employers</h3>
        </div>
          <div className="space-y-3">
            {topEmployers.slice(0, 5).map((employer) => (
              <motion.div
                key={employer.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-4 border-2 border-slate-100 hover:border-slate-900 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{employer.name}</p>
                    <p className="text-xs text-slate-600">{employer.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{employer.openRoles}+ roles</p>
                    <p className="text-xs text-slate-600">{employer.industry}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
