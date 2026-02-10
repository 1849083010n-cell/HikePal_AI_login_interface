import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './ui/Button';
import { getHikingRecommendation } from '../services/geminiService';
import { Map, Mountain, LogOut, Navigation, Send, User as UserIcon, Camera, Trophy, MapPin } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const response = await getHikingRecommendation(query);
    setAiResponse(response);
    setLoading(false);
  };

  // 显示用的名称逻辑：优先显示 full_name，其次 username，最后 email/phone
  const displayName = user.full_name || user.username || user.email?.split('@')[0] || user.phone || 'Explorer';
  // 角色显示：首字母大写
  const displayRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Hiker';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-stone-800 tracking-tight">HikePal</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-stone-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-stone-800 leading-none">{displayName}</p>
                  <p className="text-xs text-stone-500 mt-1">{displayRole}</p>
                </div>
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Profile" 
                    className="h-9 w-9 rounded-full border border-stone-200 object-cover bg-stone-100"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
              <Button variant="ghost" onClick={onLogout} className="p-2 text-stone-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">
            Welcome back, {displayName}
          </h1>
          <p className="text-stone-500 flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" /> Hong Kong
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: AI Assistant */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Navigation className="h-6 w-6" />
                  AI Trail Guide
                </h2>
                <p className="mt-2 text-emerald-100 opacity-90">
                  Ask me about hiking trails, weather conditions, or gear advice for Hong Kong.
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {aiResponse ? (
                   <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 shadow-inner">
                     <div className="flex items-start gap-3">
                       <div className="bg-emerald-100 p-2 rounded-full mt-1 shrink-0">
                         <Mountain className="h-5 w-5 text-emerald-700" />
                       </div>
                       <div className="prose prose-stone prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-stone-700">
                         {aiResponse}
                       </div>
                     </div>
                     <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setAiResponse(null)}
                          className="text-xs text-stone-500 hover:text-emerald-600 font-medium px-3 py-1 rounded-full hover:bg-stone-100 transition-colors"
                        >
                          Clear Result
                        </button>
                     </div>
                   </div>
                ) : (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                    <Map className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-stone-900 font-medium">Ready to explore?</h3>
                    <p className="text-stone-500 text-sm mt-1 max-w-sm mx-auto">
                      Try asking: "Easy coastal trails in Sai Kung" or "Sunset spots on Lantau Island".
                    </p>
                  </div>
                )}

                <form onSubmit={handleAskAI} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Where do you want to hike today?"
                    className="w-full pl-5 pr-14 py-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-900 placeholder:text-stone-400 shadow-sm"
                  />
                  <button 
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute right-2 top-2 p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-sm"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Suggested Routes Section (Mock Data) */}
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4 px-1 flex items-center justify-between">
                <span>Popular This Week</span>
                <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Dragon's Back", diff: "Easy", time: "2h", loc: "Shek O", img: "https://picsum.photos/400/300?random=1" },
                  { name: "Lion Rock", diff: "Moderate", time: "3h", loc: "Sha Tin", img: "https://picsum.photos/400/300?random=2" },
                ].map((route, i) => (
                  <div key={i} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={route.img} alt={route.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium">
                        {route.time}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                           <h4 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{route.name}</h4>
                           <p className="text-xs text-stone-500 flex items-center mt-1">
                             <MapPin className="h-3 w-3 mr-1" /> {route.loc}
                           </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          route.diff === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {route.diff}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: User Stats / Social */}
          <div className="space-y-6">
             {/* Profile Card */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Achievements
                  </h3>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {displayRole}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="text-2xl font-bold text-stone-900">0</div>
                    <div className="text-xs text-stone-500 uppercase tracking-wide mt-1 font-semibold">Hikes</div>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="text-2xl font-bold text-stone-900">0<span className="text-sm font-normal text-stone-400">km</span></div>
                    <div className="text-xs text-stone-500 uppercase tracking-wide mt-1 font-semibold">Distance</div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-stone-600">Level 1 Hiker</span>
                    <span className="text-stone-900 font-bold">0 / 100 XP</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[5%] rounded-full"></div>
                  </div>
                </div>
             </div>

             {/* Action Card */}
             <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2">Capture the Moment</h3>
                 <p className="text-stone-300 text-sm mb-4">Share your summit photos with the HikePal community.</p>
                 <Button variant="secondary" className="w-full text-sm py-2 bg-white/10 text-white hover:bg-white/20 border-white/10 backdrop-blur-sm border">
                   <Camera className="h-4 w-4 mr-2" />
                   Upload Photo
                 </Button>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                 <Mountain className="h-40 w-40" />
               </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};