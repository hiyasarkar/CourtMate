const fs = require('fs');
let file = fs.readFileSync('c:/Users/monda/Desktop/courtmate/CourtMate/frontend/src/pages/ProfilePage.jsx', 'utf8');

const startStr = '  const navigate = useNavigate();';
const endStr = '  if (!user) {';
const startIdx = file.indexOf(startStr);
const endIdx = file.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = \  const navigate = useNavigate();

  const fetchUserDashboardData = React.useCallback(async (userId) => {
     const { data: casesData } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

     if (casesData && casesData.length > 0) {
        const formattedCases = casesData.map(c => ({
           id: c.id,
           title: c.description ? c.description.substring(0, 30) + '...' : \\\Case #\\\\\\,
           subtitle: c.incident_location ? \\\Incident at \\\\\\ : 'Legal Matter',
           status: c.status || 'Active',
           date: c.created_at || new Date().toISOString(),
           docUrl: c.pdf_url || c.evidence_url || null
        }));

        setUserCases(formattedCases);
        setActiveUserCases(formattedCases.filter(c => c.status !== 'Closed'));
     } else {
        setUserCases([]);
        setActiveUserCases([]);
     }

     const { data: lawyersData } = await supabase
        .from('lawyers')
        .select('*')
        .limit(3);

     if (lawyersData && lawyersData.length > 0) {
        const mappedLawyers = lawyersData.map(l => ({
           name: l.full_name,
           domain: l.domain || 'General',
           rating: '4.8',
           img: \\\https://ui-avatars.com/api/?name=\\\&background=random\\\
        }));
        setRecommendedLawyers(mappedLawyers);
     } else {
        setRecommendedLawyers([
          { name: 'Sanjay Gupta', domain: 'Corporate Law', rating: '4.9', img: 'https://i.pravatar.cc/150?u=sanjay' },
          { name: 'Priya Sharma', domain: 'Family Law', rating: '4.8', img: 'https://i.pravatar.cc/150?u=priya' },
          { name: 'Amit Patel', domain: 'Criminal Defense', rating: '4.7', img: 'https://i.pravatar.cc/150?u=amit' }
        ]);
     }
  }, []);

  const fetchLawyerDashboardData = React.useCallback(async () => {
    const { data: casesData } = await supabase
       .from('cases')
       .select('*')
       .limit(5);

    if (casesData && casesData.length > 0) {
       setLawyerActiveCases(casesData.map(c => ({
         id: c.id,
         title: c.description?.substring(0, 20) + '...',
         client_name: 'Platform User',
         status: c.status || 'Active',
         next_step: 'Pending Review'
       })));
       
       setLawyerNewRequests(casesData.slice(0, 3).map(c => ({
         title: c.description?.substring(0, 20) + ' - Request',
         amount: 'Consultation',
         loc: c.incident_location || 'Remote',
         created_at: c.created_at
       })));
    } else {
       setLawyerActiveCases([
          { id: 'CM-2023-89', client_name: 'Arjun Das', title: 'Contract Dispute', status: 'Discovery', next_step: 'Review Documents' },
          { id: 'CM-2023-42', client_name: 'Rahul Mehta', title: 'Property Dispute', status: 'In Review', next_step: 'Prepare Response' }
       ]);
       setLawyerNewRequests([
          { title: 'Tenant Rights Issue', amount: ' Fixed', loc: 'Mumbai', created_at: new Date().toISOString() },
          { title: 'Family Law Consultation', amount: 'Hourly', loc: 'Delhi', created_at: new Date().toISOString() }
       ]);
    }

    setRecentActivity([
      { name: 'Arjun Das', action: 'Uploaded new evidence', time: '2h ago', initials: 'AD' },
      { name: 'Sneha Verma', action: 'Hearing rescheduled', time: '4h ago', initials: 'SV' }
    ]);

    setUpcomingHearings([
      { month: 'NOV', date: '14', name: 'Arjun Das', type: 'Contract Dispute', time: '10:00 AM' },
      { month: 'NOV', date: '16', name: 'Vivek Sharma', type: 'Estate Planning', time: '02:30 PM' }
    ]);
  }, []);

  const fetchUserDataWrapper = React.useCallback(async (userId, email, userRole) => {
     const { data: lData } = await supabase
       .from('lawyers')
       .select('*')
       .eq('email', email)
       .single();
       
     let finalRole = userRole;
     if (lData) {
       setLawyerData(lData);
       setRole('Lawyer');
       finalRole = 'Lawyer';
     }

     if (finalRole === 'Lawyer') {
        fetchLawyerDashboardData();
     } else {
        fetchUserDashboardData(userId);
     }
  }, [fetchLawyerDashboardData, fetchUserDashboardData]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        const currentUser = session.user;
        setUser(currentUser);
        
        const userRole = currentUser.user_metadata?.role || 'User';
        setRole(userRole);

        fetchUserDataWrapper(currentUser.id, currentUser.email, userRole);
      }
    });
  }, [navigate, fetchUserDataWrapper]);

\
  file = file.substring(0, startIdx) + replacement + file.substring(endIdx);
  fs.writeFileSync('c:/Users/monda/Desktop/courtmate/CourtMate/frontend/src/pages/ProfilePage.jsx', file);
  console.log('Fixed successfully');
} else {
  console.log("Could not find delimiters", startIdx, endIdx);
}
