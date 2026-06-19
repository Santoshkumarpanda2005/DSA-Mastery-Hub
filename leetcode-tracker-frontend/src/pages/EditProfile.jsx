import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, ArrowLeft, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ token }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '', // Readonly
    leetcodeUsername: '', // Readonly
    avatar: '' // New field
  });

  // Preset avatar options
  const avatarOptions = [
    { id: 'default', url: `https://api.dicebear.com/7.x/bottts/svg?seed=Alex` },
    { id: 'boy1', url: `https://api.dicebear.com/7.x/adventurer/svg?seed=Felix` },
    { id: 'girl1', url: `https://api.dicebear.com/7.x/lorelei/svg?seed=Mia` },
    { id: 'girl2', url: `https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia` },
    { id: 'boy2', url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Jack` },
    { id: 'neutral', url: `https://api.dicebear.com/7.x/notionists/svg?seed=Sam` },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://leetcode-tracker-api-h7cp.onrender.com/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let dobStr = '';
        if (res.data.dateOfBirth) {
          const date = new Date(res.data.dateOfBirth);
          dobStr = date.toISOString().split('T')[0];
        }

        const defaultAvatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${res.data.leetcodeUsername || 'Alex'}`;

        setFormData({
          name: res.data.name || '',
          phoneNumber: res.data.phoneNumber || '',
          gender: res.data.gender || '',
          dateOfBirth: dobStr,
          bio: res.data.bio || '',
          githubUrl: res.data.githubUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
          email: res.data.email || '',
          leetcodeUsername: res.data.leetcodeUsername || '',
          avatar: res.data.avatar || defaultAvatarUrl
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Could not load your profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await axios.put('https://leetcode-tracker-api-h7cp.onrender.com/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors duration-300">
        <button 
          onClick={() => navigate('/profile')}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <User className="text-sky-500" /> Edit Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Update your personal information and social links.</p>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/50 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 p-6 md:p-8 space-y-8">
        
        {/* Core Identity (Read-only) */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Core Identity (Read-only)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-500 text-sm font-medium mb-1.5">LeetCode Username</label>
              <input 
                type="text" disabled value={formData.leetcodeUsername}
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-sm font-medium mb-1.5">Email Address</label>
              <input 
                type="text" disabled value={formData.email}
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Profile Avatar</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Choose an avatar that represents you.</p>
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Include the dynamic leetcode username bottts avatar if not in presets */}
            <div 
              onClick={() => setFormData({ ...formData, avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.leetcodeUsername}` })}
              className={`w-20 h-20 rounded-full cursor-pointer border-4 transition-all overflow-hidden ${formData.avatar === `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.leetcodeUsername}` ? 'border-sky-500 scale-110 shadow-lg shadow-sky-500/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${formData.leetcodeUsername}`} alt="Default Robot" className="w-full h-full bg-slate-100 dark:bg-slate-800 object-cover" />
            </div>
            
            {avatarOptions.map((opt) => (
              <div 
                key={opt.id}
                onClick={() => setFormData({ ...formData, avatar: opt.url })}
                className={`w-20 h-20 rounded-full cursor-pointer border-4 transition-all overflow-hidden ${formData.avatar === opt.url ? 'border-sky-500 scale-110 shadow-lg shadow-sky-500/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <img src={opt.url} alt={opt.id} className="w-full h-full bg-slate-100 dark:bg-slate-800 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
              <input 
                type="text" name="name"
                placeholder="John Doe"
                value={formData.name} onChange={handleChange}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Phone Number</label>
              <input 
                type="tel" name="phoneNumber"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber} onChange={handleChange}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Gender</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Date of Birth</label>
              <input 
                type="date" name="dateOfBirth"
                value={formData.dateOfBirth} onChange={handleChange}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Bio</label>
            <textarea 
              name="bio" rows="3"
              placeholder="Tell us a little bit about yourself and your coding journey..."
              value={formData.bio} onChange={handleChange}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">GitHub URL</label>
              <input 
                type="url" name="githubUrl"
                placeholder="https://github.com/johndoe"
                value={formData.githubUrl} onChange={handleChange}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">LinkedIn URL</label>
              <input 
                type="url" name="linkedinUrl"
                placeholder="https://linkedin.com/in/johndoe"
                value={formData.linkedinUrl} onChange={handleChange}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/profile')}
            className="px-6 py-3 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save size={20} /> Save Changes</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
