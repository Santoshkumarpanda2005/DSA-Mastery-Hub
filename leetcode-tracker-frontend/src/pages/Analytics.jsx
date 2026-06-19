import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Analytics() {
  // Mock data specifically requested by the user
  const skillData = [
    { subject: 'Arrays', A: 90, fullMark: 100 },
    { subject: 'Trees', A: 55, fullMark: 100 },
    { subject: 'Graphs', A: 40, fullMark: 100 },
    { subject: 'DP', A: 25, fullMark: 100 },
    { subject: 'Strings', A: 70, fullMark: 100 },
    { subject: 'Math', A: 60, fullMark: 100 },
  ];

  const weaknessData = [
    { name: 'Graph Traversal', errors: 12 },
    { name: 'Recursion Base Cases', errors: 8 },
    { name: 'DP Memoization', errors: 7 },
    { name: 'Tree Balancing', errors: 4 },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-indigo-400" size={32} /> Skill Profiling & Analytics
          </h1>
          <p className="text-slate-400">Deep dive into your algorithmic strengths and automatically identified weaknesses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Skill Profile Radar Chart */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Brain className="text-sky-400" /> Skill Profile Radar
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                  <Radar name="Skill Level" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {skillData.slice(0, 4).map((skill) => (
                <div key={skill.subject} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-center">
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{skill.subject}</div>
                  <div className="text-xl font-bold text-white">{skill.A}/100</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weakness Detection Panel */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl border-t-4 border-t-rose-500">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-rose-400" /> AI Weakness Detection
            </h2>
            <p className="text-slate-400 mb-6">
              Based on your recent failed attempts and time spent, the engine has identified these specific conceptual bottlenecks:
            </p>
            
            <div className="space-y-6">
              {weaknessData.map((item, index) => (
                <div key={item.name} className="relative">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-200 font-medium">{item.name}</span>
                    <span className="text-rose-400 font-bold">{item.errors} repeated errors</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`} 
                      style={{ width: `${(item.errors / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl">
              <h3 className="text-rose-400 font-semibold mb-2">Priority Focus: Graphs</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your performance in Graph Traversals (specifically DFS state tracking) is significantly below your average baseline. We recommend prioritizing Graph problems this week.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
