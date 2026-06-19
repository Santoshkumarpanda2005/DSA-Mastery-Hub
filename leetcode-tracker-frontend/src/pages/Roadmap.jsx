import React, { useState } from 'react';
import { Map, Zap, Send, Bot, User, Code2 } from 'lucide-react';

export default function Roadmap() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState(null);

  const roadmapTimeline = [
    { week: 1, title: 'Mastering Graphs: DFS & BFS', status: 'completed', description: 'Deep dive into graph traversals to fix your current conceptual bottleneck.' },
    { week: 2, title: 'Advanced Graphs: Shortest Path', status: 'current', description: 'Dijkstra\'s and Bellman-Ford algorithms.' },
    { week: 3, title: 'Dynamic Programming: 1D & 2D', status: 'upcoming', description: 'Tackling your secondary weakness with foundational DP concepts.' },
    { week: 4, title: 'Trees: Advanced Balancing', status: 'upcoming', description: 'AVL and Red-Black tree properties.' },
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedQuestion({
        title: "The Cursed Graph of Nodes",
        difficulty: "Hard",
        description: "You are given an undirected graph with `n` nodes labeled from `0` to `n - 1`. You are also given a 2D integer array `edges` where `edges[i] = [u_i, v_i]` indicates that there is an edge between nodes `u_i` and `v_i`.\n\nA node is considered **cursed** if it is part of a cycle of length 3. Return the total number of connected components that contain at least one cursed node.",
        constraints: [
          "`1 <= n <= 10^5`",
          "`0 <= edges.length <= 10^5`",
          "`edges[i].length == 2`",
          "There are no repeated edges or self-loops."
        ]
      });
      setIsGenerating(false);
      setPrompt('');
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Map className="text-purple-400" size={32} /> Personalized Roadmap & AI Generator
          </h1>
          <p className="text-slate-400">Follow your custom timeline or generate unique problems on the fly using Gemini AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personalized Roadmap Timeline */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl border-t-4 border-t-purple-500">
            <h2 className="text-xl font-semibold text-slate-200 mb-8 flex items-center gap-2">
              <Map className="text-purple-400" /> Study Roadmap
            </h2>
            
            <div className="relative border-l-2 border-slate-700 ml-3 space-y-10">
              {roadmapTimeline.map((item, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                    item.status === 'completed' ? 'bg-emerald-500 border-emerald-900' :
                    item.status === 'current' ? 'bg-sky-500 border-sky-900 ring-4 ring-sky-500/20' :
                    'bg-slate-700 border-slate-900'
                  }`}></div>
                  
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Week {item.week}</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    item.status === 'completed' ? 'text-slate-300' :
                    item.status === 'current' ? 'text-sky-400' :
                    'text-slate-400'
                  }`}>{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Question Generation Studio */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Zap className="text-amber-400" /> AI Practice Studio
            </h2>

            {/* Chat/Output Area */}
            <div className="flex-1 overflow-y-auto mb-6 bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 space-y-6">
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-indigo-400" />
                </div>
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 text-sm text-slate-300">
                  Hello! I'm your Gemini AI coach. Tell me what you want to practice. For example: "Generate a Medium difficulty question combining Trees and DFS".
                </div>
              </div>

              {generatedQuestion && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={18} className="text-indigo-400" />
                  </div>
                  <div className="bg-slate-800 p-5 rounded-2xl rounded-tl-none border border-indigo-500/30 w-full shadow-lg shadow-indigo-500/5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Code2 size={20} className="text-indigo-400"/>
                        {generatedQuestion.title}
                      </h3>
                      <span className="text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded border border-rose-400/20">
                        {generatedQuestion.difficulty}
                      </span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap mb-6">
                      {generatedQuestion.description}
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Constraints</h4>
                      <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 font-mono">
                        {generatedQuestion.constraints.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-indigo-400 animate-pulse" />
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleGenerate} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <User size={20} />
              </div>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your request here..."
                disabled={isGenerating}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-400 text-white p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-indigo-500"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
