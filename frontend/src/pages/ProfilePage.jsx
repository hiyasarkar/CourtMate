import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Briefcase, Folder, FileText, Gavel, Calendar, CheckSquare, 
  Lightbulb, Filter, MessageSquare, ChevronRight, MapPin, Clock, 
  MoreVertical, Star, Edit2, Upload, Phone, Send, FilePlus 
} from 'lucide-react';

const CircularProgress = ({ value }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="text-gray-200"
          strokeWidth="6"
          fill="transparent"
          stroke="currentColor"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="text-orange-500"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-800">{value}%</span>
        <span className="text-[8px] text-gray-500 font-bold -mt-1 uppercase tracking-wider">Confidence</span>
      </div>
    </div>
  );
};

const UserDashboard = ({ user, activeCases, myCases, recommendedLawyers, navigate }) => {
  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  const mostRecentActive = activeCases?.length > 0 ? activeCases[0] : null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, {name}</h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
              User
            </span>
          </div>
          <p className="text-gray-500 mt-2">Here's an overview of your legal activity today.</p>
        </div>
        <button onClick={() => navigate('/file-case')} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition whitespace-nowrap">
          + New Consultation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Active Case Card */}
          {mostRecentActive ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Active Case</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 block">Case {mostRecentActive.id ? `#${mostRecentActive.id.slice(0, 4)}` : ''}: {mostRecentActive.title || 'Legal Consultation'}</h2>
                    <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">You left off at the evidence submission stage. Our AI suggests adding photos of the incident to increase your case confidence.</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        Next: {mostRecentActive.next_hearing || 'Oct 24'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                        2 Tasks Pending
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 bg-[#fbf9f4] p-6 lg:p-8 rounded-2xl w-full md:w-auto h-full border border-orange-50/50">
                     <CircularProgress value={mostRecentActive.confidence_score || 85} />
                     <button onClick={() => navigate('/file-case')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition whitespace-nowrap mt-2">Continue Case</button>
                  </div>
               </div>
            </div>
          ) : (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center justify-center text-center h-48">
                <FileText className="w-8 h-8 text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No active cases</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-4">Start a new consultation to track your confidence score and case progress here.</p>
             </div>
          )}

          {/* My Cases */}
          <div>
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-xl font-bold text-gray-900">My Cases</h2>
              <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">View All</button>
            </div>
            <div className="grid gap-3">
              {myCases && myCases.length > 0 ? myCases.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:border-gray-200 transition cursor-pointer gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.status === 'Completed' ? 'bg-orange-100 text-orange-600' : item.status === 'Draft' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.status === 'Completed' ? <Folder className="w-6 h-6"/> : item.status === 'Draft' ? <FileText className="w-6 h-6"/> : <Gavel className="w-6 h-6"/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : item.status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )) : (
                 <div className="flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 p-8 rounded-3xl">
                    <p className="text-gray-500 text-sm">You haven't filed any cases yet.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Did you know tip */}
          <div className="bg-gradient-to-br from-[#2a2624] to-[#1c1917] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg mt-2">
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <div className="bg-[#3c3631] p-3 rounded-full">
                    <Lightbulb className="w-5 h-5 text-orange-400" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-100">Did you know?</h2>
               </div>
               <p className="text-gray-400 leading-relaxed mb-6 max-w-xl text-sm">
                 In small claims court, having organized photographic evidence can increase your success rate by up to 40%. Upload your documents to bolster your current filings.
               </p>
               <button onClick={() => navigate('/file-case')} className="cursor-pointer text-orange-400 font-bold flex items-center gap-2 hover:text-orange-300 transition text-sm">
                 Upload Evidence <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          
          {/* Recommended Lawyers */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recommended</h2>
              <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-lg">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {recommendedLawyers && recommendedLawyers.length > 0 ? recommendedLawyers.map((lawyer, i) => (
                <div key={lawyer.id || i} className="flex items-center gap-4 group">
                  <div className="relative">
                    <img src={lawyer.img || `https://i.pravatar.cc/150?u=${lawyer.name}`} alt={lawyer.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition">{lawyer.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{lawyer.desc}</p>
                      <button 
                        onClick={() => alert('Messaging features coming soon! Your conversation with ' + lawyer.name + ' will appear in the Messages panel.')}
                        className="w-full bg-gray-50 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 text-gray-700 text-xs font-bold py-2 rounded-xl border border-gray-200 transition"
                      >
                        Contact
                      </button>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-gray-500 text-center py-4">No recommendations at this time.</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-3xl flex flex-col shadow-sm border border-gray-100 h-full relative overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            </div>
            <div className="flex flex-col p-4 flex-1 items-center justify-center gap-2 min-h-[200px]">
              <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-500">No recent messages yet</p>
              <p className="text-xs text-gray-400 text-center px-4">When you contact a lawyer, your conversations will appear here.</p>
            </div>
            <div className="p-4 border-t border-gray-50 text-center mt-auto pb-6">
              <button className="text-orange-500 text-sm font-bold hover:text-orange-600 transition" onClick={() => navigate('/file-case')}>Go to Cases</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LawyerDashboard = ({ user, lawyerData, lawyerMetrics, newRequests, activeCases, recentActivity, upcomingHearings, navigate }) => {
  const name = user?.user_metadata?.full_name || lawyerData?.full_name || 'Legal Professional';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Legal Workspace</h1>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-orange-200">
              Lawyer
            </span>
          </div>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Track your impact, manage active cases, and connect with new clients efficiently.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition flex items-center gap-2 whitespace-nowrap cursor-not-allowed opacity-80">
          View New Requests
        </button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-orange-200 transition">
           <div className="absolute right-6 top-6">
             <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100">+2 this week</span>
           </div>
           <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-2">
             <Briefcase className="w-5 h-5 text-orange-500" />
           </div>
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active Cases</p>
             <p className="text-3xl font-extrabold text-gray-900">{lawyerMetrics?.active_count || activeCases?.length || 0}</p>
           </div>
        </div>
        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-orange-200 transition">
           <div className="absolute right-6 top-6">
             <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-orange-100 uppercase tracking-wider">Action Needed</span>
           </div>
           <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
             <Gavel className="w-5 h-5 text-amber-500" />
           </div>
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">New Requests</p>
             <p className="text-3xl font-extrabold text-gray-900">{lawyerMetrics?.request_count || newRequests?.length || 0}</p>
           </div>
        </div>
        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-orange-200 transition">
           <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
             <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
           </div>
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Users Helped</p>
             <p className="text-3xl font-extrabold text-gray-900">{lawyerMetrics?.users_helped || 0}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* New Case Requests */}
          <div>
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-xl font-bold text-gray-900">New Case Requests</h2>
              <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">View All</button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {newRequests && newRequests.length > 0 ? newRequests.map((req, i) => (
                <div key={i} className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 hover:bg-gray-50/50 transition">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mt-1 xl:mt-0">
                       <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1.5">{req.title || 'Legal Request'}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md"><span className="text-gray-400 font-normal">$</span> {req.amount || 'Consultation'}</span>
                        <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md"><MapPin className="w-3 h-3 text-gray-400" /> {req.loc || 'Local'}</span>
                        <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md"><Clock className="w-3 h-3 text-gray-400" /> {new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0 justify-end">
                    <button className="text-gray-500 text-sm font-bold hover:text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-full transition">Details</button>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 px-6 rounded-full transition shadow-sm">Accept</button>
                  </div>
                </div>
              )) : (
                 <div className="flex items-center justify-center bg-gray-50 p-6">
                    <p className="text-gray-500 text-sm">No new requests pending.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Active Cases Table-like view */}
          <div>
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-xl font-bold text-gray-900">Active Cases</h2>
              <button className="text-gray-400 hover:text-gray-600 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm"><Filter className="w-4 h-4"/></button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
               <div className="min-w-[700px]">
                 <div className="grid grid-cols-12 gap-4 p-5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                   <div className="col-span-3 pl-2">Case Title / ID</div>
                   <div className="col-span-3">Client details</div>
                   <div className="col-span-2">Status</div>
                   <div className="col-span-3">Next Step/Hearing</div>
                   <div className="col-span-1 text-center">Action</div>
                 </div>
                 <div className="divide-y divide-gray-50">
                   {activeCases && activeCases.length > 0 ? activeCases.map((caseItem, i) => (
                     <div key={caseItem.id || i} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-50/50 transition border-l-2 border-transparent hover:border-orange-500">
                       <div className="col-span-3 font-bold text-gray-800 italic text-sm pl-2 truncate">{caseItem.title || `#CM-${caseItem.id?.slice(0, 4)}`}</div>
                       <div className="col-span-3 flex items-center gap-3 truncate">
                         <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">{caseItem.client_name?.charAt(0) || 'U'}</div>
                         <span className="font-semibold text-gray-900 text-sm truncate">{caseItem.client_name || 'Anonymous User'}</span>
                       </div>
                       <div className="col-span-2 flex">
                         <span className={`px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap font-bold tracking-wide shadow-sm w-fit ${caseItem.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{caseItem.status || 'Active'}</span>
                       </div>
                       <div className="col-span-3 text-gray-600 font-medium text-sm truncate">{caseItem.next_step || 'Review Documents'}</div>
                       <div className="col-span-1 flex justify-center">
                         <button className="text-gray-400 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition"><MoreVertical className="w-5 h-5"/></button>
                       </div>
                     </div>
                   )) : (
                     <div className="p-8 text-center text-sm text-gray-500 bg-gray-50">
                       Currently no active cases assigned.
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* Recent Case Activity */}
          <div>
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-xl font-bold text-gray-900">Recent Case Activity</h2>
              <button className="text-gray-400 hover:text-gray-600 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm"><Clock className="w-4 h-4"/></button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col gap-8">
              {recentActivity && recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                <div key={i} className="flex justify-between items-start relative">
                  {i !== recentActivity.length - 1 && <div className="absolute left-6 top-10 w-[2px] h-[calc(100%+0.5rem)] bg-gray-100"></div>}
                  <div className="flex items-start gap-5">
                    {activity.img ? (
                      <div className="relative z-10 p-1 bg-white rounded-full h-fit flex-shrink-0">
                        <img src={activity.img} alt={activity.name} className="w-10 h-10 rounded-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative z-10 p-1 bg-white rounded-full h-fit flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-200">{activity.initials || 'A'}</div>
                      </div>
                    )}
                    <div className="pt-1">
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{activity.name}</p>
                      <p className="text-gray-500 text-sm">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium pt-1.5 whitespace-nowrap ml-4">{activity.time}</span>
                </div>
              )) : (
                <p className="text-center text-sm text-gray-500">No recent activity found.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Lawyer Profile Card */}
          <div className="bg-gradient-to-br from-[#1c1917] to-[#0c0a09] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden text-white relative border border-[#2a2624]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="p-7 relative z-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 border-2 border-[#3c3631] shadow-lg overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?u=lawyer" alt={name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white leading-tight mb-1 truncate">{name}</h2>
                  <p className="text-gray-400 text-xs mb-2 font-medium bg-[#2a2624] inline-block px-2 py-0.5 rounded-md">{lawyerData?.domain || 'Service Partner'}</p>
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> <span className="text-gray-300">4.9 (512)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mb-8">
                 <div className="flex-1 bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Status</p>
                   <div className="flex items-center gap-2">
                     <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                     </span>
                     <span className="text-sm font-semibold text-gray-200">Online</span>
                   </div>
                 </div>
                 <div className="flex-1 bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Region</p>
                   <p className="text-sm font-semibold text-gray-200 truncate" title="New Mexico">New Mexico</p>
                 </div>
              </div>
              <button className="w-full bg-[#2a2624] hover:bg-[#3c3631] text-white font-semibold py-3 rounded-xl transition flex justify-center items-center gap-2 text-sm border border-white/10 shadow-sm">
                <Edit2 className="w-4 h-4"/> Edit Profile
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 min-h-[200px]">
              <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-500">No recent messages yet</p>
              <p className="text-xs text-gray-400 text-center px-4">New inquiries and client messages will appear here.</p>
            </div>
            <div className="border-t border-gray-100 pt-5 text-center">
              <button className="text-orange-500 text-xs font-bold hover:text-orange-600 tracking-wide transition">View All Messages</button>
            </div>
          </div>

          {/* Upcoming Hearings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Hearings</h2>
              <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200 text-gray-400">
                 <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-6">
              {upcomingHearings && upcomingHearings.length > 0 ? upcomingHearings.map((hearing, i) => (
                <div key={i} className="flex items-center gap-4 hover:bg-gray-50 p-2 -mx-2 rounded-xl transition cursor-pointer">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-50/50 border border-orange-100 w-12 h-12 shadow-sm shrink-0">
                    <span className="text-[9px] font-bold text-orange-600 leading-none mb-1 uppercase tracking-widest">{hearing.month}</span>
                    <span className="text-lg font-extrabold text-gray-900 leading-none">{hearing.date}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5 truncate">{hearing.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium whitespace-nowrap">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">{hearing.type}</span>
                      <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded"><Clock className="w-3 h-3 text-gray-400"/> {hearing.time}</span>
                    </div>
                  </div>
                </div>
              )) : (
                 <div className="p-4 text-center text-sm text-gray-500 rounded-xl bg-gray-50 border border-gray-100">
                    No upcoming hearings scheduled.
                 </div>
              )}
            </div>
            <div className="border-t border-gray-100 pt-5 text-center">
              <button className="text-orange-500 text-xs font-bold hover:text-orange-600 tracking-wide">View Full Schedule</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-sm text-sm">
                 <Upload className="w-4 h-4"/> Upload Document
              </button>
              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-semibold py-3.5 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-sm">
                 <Phone className="w-4 h-4 text-gray-400"/> Schedule Client Call
              </button>
              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-semibold py-3.5 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-sm">
                 <Send className="w-4 h-4 text-gray-400"/> Send Case Update
              </button>
              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-semibold py-3.5 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-sm">
                 <FilePlus className="w-4 h-4 text-gray-400"/> Add Legal Note
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('User'); // 'User' | 'Lawyer'
  const [lawyerData, setLawyerData] = useState(null);
  
  // User Data States
  const [userCases, setUserCases] = useState([]);
  const [activeUserCases, setActiveUserCases] = useState([]);
  const [recommendedLawyers, setRecommendedLawyers] = useState([]);

  // Lawyer Data States
  const [lawyerActiveCases, setLawyerActiveCases] = useState([]);
  const [lawyerNewRequests, setLawyerNewRequests] = useState([]);
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const navigate = useNavigate();

  const fetchUserDashboardData = React.useCallback(async (userId) => {
     const { data: casesData } = await supabase.from("cases").select("*").eq("user_id", userId).order("created_at", { ascending: false });
     if (casesData && casesData.length > 0) {
        setUserCases(casesData.map(c => ({ id: c.id, title: c.description ? c.description.substring(0, 30) + "..." : "Case #" + c.id.substring(0, 6), subtitle: c.incident_location ? "Incident at " + c.incident_location : "Legal Matter", status: c.status || "Active", date: c.created_at || new Date().toISOString(), docUrl: c.pdf_url || c.evidence_url || null })));
        setActiveUserCases(casesData.map(c => ({ id: c.id, title: c.description ? c.description.substring(0, 30) + "..." : "Case #" + c.id.substring(0, 6), subtitle: c.incident_location ? "Incident at " + c.incident_location : "Legal Matter", status: c.status || "Active", date: c.created_at || new Date().toISOString(), docUrl: c.pdf_url || c.evidence_url || null })).filter(c => c.status !== "Closed"));
     } else {
        setUserCases([]);
        setActiveUserCases([]);
     }
     const { data: lawyersData } = await supabase.from("lawyers").select("*").limit(3);
     if (lawyersData && lawyersData.length > 0) {
        setRecommendedLawyers(lawyersData.map(l => ({ name: l.full_name, domain: l.domain || "General", rating: "4.8", img: "https://ui-avatars.com/api/?name=" + encodeURIComponent(l.full_name) + "&background=random" })));
     } else {
        setRecommendedLawyers([]);
     }
  }, []);

  const fetchLawyerDashboardData = React.useCallback(async () => {
    const { data: casesData } = await supabase.from("cases").select("*").limit(5);
    if (casesData && casesData.length > 0) {
      setLawyerActiveCases(casesData.map(c => ({ id: c.id, title: c.description?.substring(0, 20) + "...", client_name: "Platform User", status: c.status || "Active", next_step: "Pending Review" })));
      setLawyerNewRequests(casesData.slice(0, 3).map(c => ({ title: c.description?.substring(0, 20) + " - Request", amount: "Consultation", loc: c.incident_location || "Remote", created_at: c.created_at })));
    } else {
      setLawyerActiveCases([]);
      setLawyerNewRequests([]);
    }
    setRecentActivity([]);
    setUpcomingHearings([]);
  }, []);

  const fetchUserDataWrapper = React.useCallback(async (userId, email, userRole) => {
    const { data: lData } = await supabase.from("lawyers").select("*").eq("email", email).single();
    let finalRole = userRole;
    if (lData) {
      setLawyerData(lData);
      setRole("Lawyer");
      finalRole = "Lawyer";
    }
    if (finalRole === "Lawyer") {
      fetchLawyerDashboardData();
    } else {
      fetchUserDashboardData(userId);
    }
  }, [fetchLawyerDashboardData, fetchUserDashboardData]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        const uRole = session.user.user_metadata?.role || "User";
        setRole(uRole);
        fetchUserDataWrapper(session.user.id, session.user.email, uRole);
      }
    });
  }, [navigate, fetchUserDataWrapper]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        <span className="animate-spin h-6 w-6 border-4 border-orange-500 border-t-transparent rounded-full mr-3"></span>
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
         {role === 'Lawyer' ? (
            <LawyerDashboard 
              user={user} 
              lawyerData={lawyerData} 
              activeCases={lawyerActiveCases}
              newRequests={lawyerNewRequests}
              upcomingHearings={upcomingHearings}
              recentActivity={recentActivity}
              navigate={navigate}
            />
         ) : (
            <UserDashboard 
              user={user} 
              activeCases={activeUserCases}
              myCases={userCases}
              recommendedLawyers={recommendedLawyers}
              navigate={navigate}
            />
         )}
      </div>
    </div>
  );
}

