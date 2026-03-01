import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Search, MapPin, Star, Filter, MessageSquare, ChevronRight, Briefcase, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // Fetch User
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Fetch all lawyers from the 'lawyers' table
      const { data, error } = await supabase
        .from('lawyers')
        .select('*');

      if (error) {
        console.error('Error fetching lawyers', error);
      } else {
        setLawyers(data || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleConsult = async (lawyer) => {
    if (!currentUser) {
      alert("Please login to consult a lawyer.");
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from('cases')
      .insert([
        { 
          user_id: currentUser.id, 
          assigned_lawyer_id: lawyer.id,
          status: 'Pending', // Status to show up in lawyer's new requests
          description: `Consultation with ${lawyer.full_name}`,
          title: 'New Consultation',
          evidence_url: '',
          incident_location: 'Remote'
        }
      ])
      .select();

    if (error) {
      console.error("Error creating case:", error);
      alert("Failed to start consultation.");
    } else {
      alert("Consultation request sent! You can now message them from your profile.");
      navigate("/profile");
    }
  };


  const filteredLawyers = lawyers.filter(l => 
    l.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Find a Legal Expert</h1>
            <p className="text-gray-500 max-w-2xl text-lg">Connect with verified lawyers who specialize in your case type. Review their profiles and start a consultation instantly.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition">
               <Filter className="w-5 h-5 text-gray-400" /> Filters
             </button>
             <button className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-md hover:bg-orange-600 transition">
               <Search className="w-5 h-5" /> Search
             </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <input 
            type="text" 
            placeholder="Search by name, specialization, or location..." 
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-none shadow-lg shadow-gray-200/50 text-lg focus:ring-2 focus:ring-orange-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLawyers.length > 0 ? filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-100 transition"></div>
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex gap-4">
                    <img 
                      src={lawyer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.full_name)}&background=random`} 
                      alt={lawyer.full_name} 
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-white"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{lawyer.full_name}</h3>
                      <p className="text-orange-600 font-medium text-sm mb-1">{lawyer.domain || 'General Practice'}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md w-fit border border-gray-100">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>Reg: {lawyer.reg_no || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-6 px-2">
                   <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{lawyer.experience_years || 5}+</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Years Exp.</p>
                   </div>
                   <div className="w-px h-8 bg-gray-100"></div>
                   <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">4.9</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Rating</p>
                   </div>
                   <div className="w-px h-8 bg-gray-100"></div>
                   <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">98%</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Success</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <button onClick={() => handleConsult(lawyer)} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Message to Consult
                  </button>
                  <button className="w-full bg-white border border-gray-200 hover:border-orange-200 hover:bg-orange-50 text-gray-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
                    View Profile <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-gray-500 text-lg">No lawyers found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
