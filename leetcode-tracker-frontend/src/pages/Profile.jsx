import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ token }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, userRes] = await Promise.all([
          axios.get('https://dsa-mastery-hub.onrender.com/api/activity/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://dsa-mastery-hub.onrender.com/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(err => {
            console.error("Failed to fetch user profile, falling back to activity user", err);
            return { data: null };
          })
        ]);
        
        let totalAttempts = activityRes.data.profileStats?.totalAttempts || 0;
        let easyCount = 0, mediumCount = 0, hardCount = 0;
        
        if (activityRes.data.activities) {
           totalAttempts = activityRes.data.activities.reduce((sum, act) => sum + (act.attempts || 1), 0);
           activityRes.data.activities.forEach(act => {
             if (act.difficulty === 'Easy') easyCount++;
             else if (act.difficulty === 'Medium') mediumCount++;
             else if (act.difficulty === 'Hard') hardCount++;
           });
        }

        // Process skill profile for Recharts
        let skillDataArray = [];
        if (activityRes.data.skillProfile) {
          const sortedTopics = Object.entries(activityRes.data.skillProfile)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6); // Take top 6 topics
          
          let maxScore = sortedTopics.length > 0 ? Math.max(...sortedTopics.map(t => t[1]), 10) : 10;
          
          skillDataArray = sortedTopics.map(([topic, score]) => ({
            subject: topic,
            A: score,
            fullMark: maxScore
          }));
        }

        // Merge users safely
        const activityUser = activityRes.data.user || {};
        const profileUser = userRes.data || {};
        
        // Create a definitive user object that prefers profileUser fields if they exist and are not empty
        const mergedUser = { ...activityUser };
        for (const key in profileUser) {
          if (profileUser[key] !== undefined && profileUser[key] !== null && profileUser[key] !== '') {
            mergedUser[key] = profileUser[key];
          }
        }

        setData({
          ...activityRes.data,
          user: mergedUser,
          profileStats: {
            ...activityRes.data.profileStats,
            totalAttempts,
            easyCount,
            mediumCount,
            hardCount
          },
          skillDataArray
        });
      } catch (err) {
        console.error("Failed to fetch profile data", err);
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

  // Mock Data for Readiness and Probability since backend doesn't have it yet
  const readinessData = [{ name: 'Score', value: 78 }, { name: 'Remaining', value: 22 }];
  const probabilityData = [{ name: 'Probability', value: 81 }, { name: 'Risk', value: 19 }];
  const COLORS = ['#ef4444', '#f1f5f9'];
  const COLORS_DARK = ['#ef4444', '#1e293b'];
  const PROB_COLORS = ['#22c55e', '#f1f5f9'];
  const PROB_COLORS_DARK = ['#22c55e', '#1e293b'];

  const user = data?.user || {};
  const stats = data?.profileStats || {};
  const recentActivities = data?.activities?.slice(0, 5) || [];
  const skillData = data?.skillDataArray || [];
  
  // Calculate max score for percentage bars
  const maxSkillScore = skillData.length > 0 ? Math.max(...skillData.map(s => s.A)) : 1;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-colors duration-300">
        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 z-10 flex-shrink-0 overflow-hidden shadow-lg">
          <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.leetcodeUsername || 'Alex'}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="z-10 flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{user.name || user.leetcodeUsername || 'Guest User'}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-2">@{user.leetcodeUsername || 'guest'}</p>
          {user.bio && <p className="text-sm text-slate-500 dark:text-slate-300 max-w-xl">{user.bio}</p>}
        </div>
        <button 
          onClick={() => navigate('/edit-profile')}
          className="z-10 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-xl transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Full Name</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">{user.name || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">{user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">{user.phoneNumber || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gender</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">{user.gender || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Date of Birth</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <span className="text-slate-400 italic font-normal">Not provided</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Membership Date</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Biography</p>
                <p className="font-medium text-slate-900 dark:text-slate-200 leading-relaxed text-sm">{user.bio || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                {user.githubUrl ? (
                  <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-600 font-medium text-sm">GitHub</a>
                ) : (
                  <span className="text-slate-400 italic font-normal text-sm">No GitHub</span>
                )}
                {user.linkedinUrl ? (
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-sky-500 hover:text-sky-600 font-medium text-sm">LinkedIn</a>
                ) : (
                  <span className="text-slate-400 italic font-normal text-sm">No LinkedIn</span>
                )}
              </div>
            </div>
          </div>

          {/* Interview Readiness Snapshot */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Interview Readiness Snapshot</h3>
            <div className="flex justify-around items-center h-32">
              <div className="relative w-28 h-28 flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={readinessData} cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                      {readinessData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} className="dark:hidden" />)}
                      {readinessData.map((entry, index) => <Cell key={`cell-dark-${index}`} fill={COLORS_DARK[index]} className="hidden dark:block" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[40%] flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">78<span className="text-xs text-slate-500">/100</span></span>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-[-20px]">Readiness Score</span>
              </div>

              <div className="relative w-28 h-28 flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={probabilityData} cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                      {probabilityData.map((entry, index) => <Cell key={`cell-${index}`} fill={PROB_COLORS[index]} className="dark:hidden" />)}
                      {probabilityData.map((entry, index) => <Cell key={`cell-dark-${index}`} fill={PROB_COLORS_DARK[index]} className="hidden dark:block" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[40%] flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">81%</span>
                </div>
                <span className="text-xs text-slate-500 font-medium text-center mt-[-20px]">Coding Round Pass Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Activity Overview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Activity Overview</h3>
            <div className="flex divide-x divide-slate-200 dark:divide-slate-800">
              <div className="flex-1 pr-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Solved</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalProblemsSolved || 0}</p>
              </div>
              <div className="flex-1 pl-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Attempts Breakdown</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalAttempts || 0}</p>
                <p className="text-xs font-medium">
                  <span className="text-emerald-500">Easy {stats.easyCount || 0}</span> <span className="text-slate-300 dark:text-slate-600">/</span> <span className="text-amber-500">Medium {stats.mediumCount || 0}</span> <span className="text-slate-300 dark:text-slate-600">/</span> <span className="text-rose-500">Hard {stats.hardCount || 0}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Skill Profile */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Detailed Skill Profile</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Custom Toggle</span>
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white dark:bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-64">
                {skillData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                      <PolarGrid stroke="#cbd5e1" className="dark:stroke-slate-700" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Radar name="Skill" dataKey="A" stroke="#475569" fill="#94a3b8" fillOpacity={0.5} className="dark:stroke-slate-500 dark:fill-slate-600" />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 italic text-sm">Not enough data for skill radar.</div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                {skillData.length > 0 ? skillData.map((skill) => (
                  <div key={skill.subject}>
                    <div className="flex justify-between text-sm mb-1 font-medium text-slate-700 dark:text-slate-300">
                      <span>{skill.subject}</span>
                      <span>{skill.A} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-slate-800 dark:bg-slate-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((skill.A / maxSkillScore) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                )) : (
                  <div className="text-slate-500 italic text-sm text-center">Solve more problems to build your profile.</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Solved Problems */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Solved Problems</h3>
              {recentActivities.length > 0 ? (
                <ul className="space-y-3">
                  {recentActivities.map(act => (
                    <li key={act._id} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                      <span className="truncate">{act.problemName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        act.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : 
                        act.difficulty === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : 
                        "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {act.difficulty}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No recent activity.</p>
              )}
            </div>

            {/* My roadmap */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">My roadmap</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Quick look at your personalized roadmap.</p>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-slate-900 dark:text-white" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Week 3: Mastering Graphs</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">60%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-4">
                  <div className="bg-slate-900 dark:bg-slate-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <ul className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4">
                  <li className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Solve 2 Graph Mediums
                  </li>
                  <li className="text-sm flex items-center gap-2 text-slate-400 dark:text-slate-600">
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div> Click 2 Slides DP State
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
