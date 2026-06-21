import React, { useState } from 'react';
import { Map, CheckCircle2, Lock, PlayCircle, X } from 'lucide-react';
import { roadmapData, phases } from '../data/roadmapData';

export default function Roadmap() {
  const [selectedNode, setSelectedNode] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-500 dark:border-emerald-400 dark:text-emerald-900 shadow-emerald-500/20';
      case 'current': return 'bg-sky-100 border-sky-300 text-sky-800 dark:bg-sky-500 dark:border-sky-400 dark:text-sky-900 shadow-sky-500/40 ring-4 ring-sky-500/20';
      case 'locked': return 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 opacity-70';
      default: return 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} />;
      case 'current': return <PlayCircle size={18} />;
      case 'locked': return <Lock size={18} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Map className="text-purple-600 dark:text-purple-400" size={40} /> DSA Mastery Roadmap
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Your step-by-step path to cracking product companies. Follow the curriculum from top to bottom.
          </p>
        </div>

        {/* Roadmap Tree */}
        <div className="space-y-16">
          {phases.map((phase, pIndex) => {
            const phaseNodes = roadmapData.filter(n => n.phase === phase.id);
            return (
              <div key={phase.id} className="relative">
                {/* Phase Header */}
                <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/30 p-6 rounded-2xl mb-12 text-center relative z-10 backdrop-blur-sm shadow-sm">
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">{phase.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400">{phase.description}</p>
                </div>

                {/* Nodes Grid */}
                <div className="relative flex flex-col items-center gap-8">
                  {/* Central Spine */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-slate-200 dark:bg-slate-800 -z-10"></div>
                  
                  {phaseNodes.map((node, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <div key={node.id} className={`w-full flex ${isLeft ? 'justify-start md:pr-[50%]' : 'justify-end md:pl-[50%]'} relative`}>
                        {/* Branch connecting to spine (hidden on mobile, visible on md) */}
                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-[10%] border-t-4 border-dashed border-slate-200 dark:border-slate-700 -z-10 ${isLeft ? 'right-[40%]' : 'left-[40%]'}`}></div>
                        
                        <div 
                          onClick={() => setSelectedNode(node)}
                          className={`w-full md:w-[80%] mx-auto md:mx-0 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 shadow-xl ${getStatusColor(node.status)} flex items-center justify-between`}
                        >
                          <span className="font-bold text-lg">{node.title}</span>
                          <span className="opacity-80 flex-shrink-0 ml-4">{getStatusIcon(node.status)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal for Details */}
      {selectedNode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedNode(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center ${
              selectedNode.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
              selectedNode.status === 'current' ? 'bg-sky-50 dark:bg-sky-900/20' :
              'bg-slate-50 dark:bg-slate-800/50'
            }`}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {selectedNode.title}
                <span className="text-slate-500 dark:text-slate-400">{getStatusIcon(selectedNode.status)}</span>
              </h3>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Must Solve Problems</h4>
              {selectedNode.problems && selectedNode.problems.length > 0 ? (
                <ul className="space-y-3">
                  {selectedNode.problems.map((prob, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      {prob}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No specific problems listed yet.</p>
              )}
              
              <div className="mt-8">
                <button 
                  className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${selectedNode.status === 'locked' ? 'bg-slate-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'}`}
                >
                  {selectedNode.status === 'locked' ? 'Complete Previous Topics First' : 'Practice These Problems'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
