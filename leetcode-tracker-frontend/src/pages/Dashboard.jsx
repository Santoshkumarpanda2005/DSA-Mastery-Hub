import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Code, CheckCircle, Clock, X, Brain, AlertCircle } from 'lucide-react';

export default function Dashboard({ token }) {
  const [data, setData] = useState({ activities: [], profileStats: { totalProblemsSolved: 0, totalTimeSpent: 0, totalAttempts: 0 }, ml: null });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, mlRes] = await Promise.all([
          axios.get('https://dsa-mastery-hub.onrender.com/api/activity/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://dsa-mastery-hub.onrender.com/api/ml/analytics', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(e => { console.warn('ML Service unreachable', e); return { data: null }; })
        ]);
        
        // Calculate total attempts if not provided
        let totalAttempts = res.data.profileStats?.totalAttempts || 0;
        if (!totalAttempts && res.data.activities) {
           totalAttempts = res.data.activities.reduce((sum, act) => sum + (act.attempts || 1), 0);
        }

        setData({
          ...res.data,
          profileStats: {
            ...res.data.profileStats,
            totalAttempts
          },
          ml: mlRes.data
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-sky-500 font-bold tracking-widest animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-none flex flex-col justify-center transition-colors duration-300">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Problems Solved</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{data.profileStats?.totalProblemsSolved || 0}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-none flex flex-col justify-center transition-colors duration-300">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Time Spent</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {(() => {
              const totalSeconds = data.profileStats?.totalTimeSpent || 0;
              const h = Math.floor(totalSeconds / 3600);
              const m = Math.floor((totalSeconds % 3600) / 60);
              const s = totalSeconds % 60;
              if (h > 0) return `${h}h ${m}m`;
              if (m > 0) return `${m}m ${s}s`;
              return `${s}s`;
            })()}
          </span>
        </div>
      </div>



      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-none overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Recent Activity
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm font-medium border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <th className="p-4 pl-6">Problem Title</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Topic</th>
                <th className="p-4">Time Spent</th>
                <th className="p-4">Attempts</th>
                <th className="p-4 pr-6">Submission Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {data.activities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-500">
                    No activity found. Go solve some LeetCode!
                  </td>
                </tr>
              ) : (
                data.activities.map((act) => (
                  <tr 
                    key={act._id} 
                    onClick={() => setSelectedActivity(act)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-medium text-slate-900 dark:text-slate-200 group-hover:text-sky-500 transition-colors">{act.problemName}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        act.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : 
                        act.difficulty === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : 
                        "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {act.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                      {act.topic?.[0] || 'Unknown'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                      {(() => {
                        const m = Math.floor(act.timeSpent / 60);
                        return m > 0 ? `${m}m` : `${act.timeSpent}s`;
                      })()}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                      {act.attempts || 1}
                    </td>
                    <td className="p-4 pr-6">
                      {act.accepted ? (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                          Accepted
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                            {act.submissionStatus || 'Failed'}
                          </span>
                          {(act.compileError || act.runtimeError) && (
                            <div className="mt-1 max-w-[200px] max-h-16 overflow-hidden text-ellipsis text-[10px] bg-slate-900 text-rose-300 p-1.5 rounded border border-rose-900/50" title={act.compileError || act.runtimeError}>
                              {act.compileError || act.runtimeError}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedActivity.problemName}</h2>
                <div className="flex gap-3 text-sm">
                  <span className={`font-bold ${
                    selectedActivity.difficulty === "Easy" ? "text-emerald-500 dark:text-emerald-400" : 
                    selectedActivity.difficulty === "Medium" ? "text-amber-500 dark:text-yellow-400" : 
                    "text-rose-500 dark:text-rose-400"
                  }`}>
                    {selectedActivity.difficulty}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono"><Clock size={14} className="inline mr-1 -mt-0.5"/>{selectedActivity.runtime || 'N/A'}</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono">{selectedActivity.memory || 'N/A'}</span>
                </div>
              </div>
              <button onClick={() => setSelectedActivity(null)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Code Block & Review */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-sky-400 flex items-center gap-2">
                    <Code size={20} className="text-slate-500 dark:text-sky-400" /> Submitted Code ({selectedActivity.language})
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <pre className="text-slate-800 dark:text-slate-300 font-mono text-sm">
                      <code>{selectedActivity.code || "// No code available"}</code>
                    </pre>
                  </div>
                </div>

                {/* AI Code Review */}
                {selectedActivity.review && (
                  <div className="bg-slate-50 dark:bg-[#1e1e1e] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4">Review</h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                      {selectedActivity.review.summary}
                    </p>
                    {selectedActivity.review.suggestions && selectedActivity.review.suggestions.length > 0 && (
                      <ul className="space-y-4">
                        {selectedActivity.review.suggestions.map((sug, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <span className="text-slate-400 dark:text-slate-500 mt-1">•</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* AI Insights Sidebar */}
              <div className="space-y-6">
                {selectedActivity.accepted ? (
                  <>
                    <div className="bg-indigo-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-500/30">
                      <h3 className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 mb-4">
                        <Brain size={20} /> AI Analysis
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-indigo-500/70 dark:text-indigo-400/70 uppercase tracking-wider font-bold mb-1">Time Complexity</div>
                          <div className="text-slate-900 dark:text-slate-200 font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-slate-700">{selectedActivity.timeComplexity || 'O(?)'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-indigo-500/70 dark:text-indigo-400/70 uppercase tracking-wider font-bold mb-1">Space Complexity</div>
                          <div className="text-slate-900 dark:text-slate-200 font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-slate-700">{selectedActivity.spaceComplexity || 'O(?)'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-sky-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-sky-200 dark:border-sky-500/30">
                      <h3 className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-2 mb-4">
                        <AlertCircle size={20} /> Recommendations
                      </h3>
                      {!selectedActivity.recommendations || selectedActivity.recommendations.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic">No specific recommendations for this problem.</p>
                      ) : (
                        <ul className="space-y-2">
                          {selectedActivity.recommendations.map((rec, i) => {
                            const isObj = typeof rec === 'object' && rec !== null;
                            const title = isObj ? rec.title : rec;
                            const link = isObj ? rec.link : null;
                            return (
                              <li key={i} className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 text-sm hover:border-sky-300 dark:hover:border-sky-500 transition-colors cursor-pointer">
                                {link ? (
                                  <a href={link} target="_blank" rel="noreferrer" className="hover:underline block w-full">{title}</a>
                                ) : (
                                  title
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-500/30">
                    <h3 className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2 mb-4">
                      <Brain size={20} /> AI Debugging Hint
                    </h3>
                    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedActivity.aiHint ? selectedActivity.aiHint : "No AI hint available for this submission. The AI may be analyzing it now, try refreshing in a moment."}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
