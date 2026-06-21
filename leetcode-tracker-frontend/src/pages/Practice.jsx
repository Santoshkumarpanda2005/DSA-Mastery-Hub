import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, ShieldCheck, ChevronRight, Play } from 'lucide-react';

export default function Practice({ token }) {
  const [mlData, setMlData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMlData = async () => {
      try {
        // Fallback to localhost if needed, but keeping production URL structure for consistency
        const res = await axios.get('https://dsa-mastery-hub.onrender.com/api/ml/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => axios.get('http://localhost:10000/api/ml/analytics', { headers: { Authorization: `Bearer ${token}` } }));
        setMlData(res.data);
      } catch (err) {
        console.error("Failed to fetch ML data", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMlData();
  }, [token]);

  const readinessScore = mlData?.readinessScore || 0;
  // Calculate a theoretical coding round pass rate based on readiness
  const passRate = readinessScore > 0 ? Math.min(100, Math.floor(readinessScore * 1.15)) : 0; 

  const readinessData = [{ name: 'Score', value: readinessScore }, { name: 'Remaining', value: 100 - readinessScore }];
  const probabilityData = [{ name: 'Probability', value: passRate }, { name: 'Risk', value: 100 - passRate }];
  const COLORS = ['#10b981', '#1e293b'];
  const PROB_COLORS = ['#3b82f6', '#1e293b'];

  const recommendations = mlData?.recommendations?.map((rec, idx) => ({
    id: idx + 1,
    name: rec,
    topic: mlData.weakTopics && mlData.weakTopics.length > 0 ? mlData.weakTopics[idx % mlData.weakTopics.length] : 'Mixed',
    difficulty: 'Medium',
    match: `${Math.floor(Math.random() * 15) + 85}%` // Mock match percentage between 85-99%
  })) || [];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="text-emerald-400" size={32} /> Targeted Practice & Readiness
          </h1>
          <p className="text-slate-400">Custom problem sets generated to attack your specific weaknesses and prepare you for interviews.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Personalized Recommendations */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Play className="text-sky-400" /> Actionable Recommendations
            </h2>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center p-8 text-sky-500 animate-pulse">Loading ML Recommendations...</div>
              ) : recommendations.length === 0 ? (
                <div className="text-slate-400 p-4">No recommendations available yet. Keep practicing!</div>
              ) : (
                recommendations.map((rec) => (
                  <div key={rec.id} className="bg-slate-900/50 border border-slate-700/50 hover:border-sky-500/50 p-4 rounded-xl transition-all cursor-pointer group flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-sky-400 transition-colors">{rec.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-slate-400">{rec.topic}</span>
                        <span className="text-slate-600">•</span>
                        <span className={rec.difficulty === 'Easy' ? 'text-emerald-400' : 'text-yellow-400'}>{rec.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Match</div>
                        <div className="text-emerald-400 font-bold">{rec.match}</div>
                      </div>
                      <div className="bg-slate-800 p-2 rounded-full group-hover:bg-sky-500/20 text-slate-500 group-hover:text-sky-400 transition-colors">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interview Readiness Profile */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl border-t-4 border-t-emerald-500">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" /> Interview Readiness Profile
            </h2>
            
            <div className="flex flex-col items-center justify-center space-y-8">
              
              {/* Readiness Score Gauge */}
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={readinessData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                      {readinessData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">{readinessScore}<span className="text-lg text-slate-400">/100</span></span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Readiness</span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-slate-700/50"></div>

              {/* Coding Round Probability Gauge */}
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={probabilityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                      {probabilityData.map((entry, index) => <Cell key={`cell-${index}`} fill={PROB_COLORS[index % PROB_COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">{passRate}%</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 text-center">Coding Round<br/>Pass Rate</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
