import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeSplash from './components/WelcomeSplash';
import Header from './components/Header';
import TripBanner from './components/TripBanner';
import NavigationTabs from './components/NavigationTabs';
import ItineraryView from './components/ItineraryView';
import ExpenseView from './components/ExpenseView';
import PackingView from './components/PackingView';
import PlaceNotesView from './components/PlaceNotesView';
import TripModal from './components/TripModal';
import LoginView from './components/LoginView';

import { 
  fetchTrips, 
  fetchItineraries, 
  fetchExpenses, 
  fetchPacking,
  saveTrip,
  saveItinerary,
  deleteItinerary,
  saveExpense,
  deleteExpense,
  savePackingItem
} from './lib/supabase';

import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('trip_user') || null;
  });

  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  
  const [itineraries, setItineraries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [packing, setPacking] = useState([]);
  
  const [activeTab, setActiveTab] = useState('itinerary');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Trip Modal State
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [editingTripData, setEditingTripData] = useState(null);

  // Initialize Dark Mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Trips on mount 100% from Supabase `tb_trips` ordered descending by date
  useEffect(() => {
    if (!currentUser) return;
    async function loadTrips() {
      setLoading(true);
      const res = await fetchTrips();
      if (res.data && res.data.length > 0) {
        const sorted = [...res.data].sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''));
        setTrips(sorted);
        setActiveTrip(sorted[0]);
      }
      setLoading(false);
    }
    loadTrips();
  }, [currentUser]);

  // Load Active Trip Data 100% from Supabase (`tb_itineraries`, `tb_expenses`, `tb_packing`)
  useEffect(() => {
    if (!activeTrip || !currentUser) return;

    async function loadTripDetails() {
      const itinRes = await fetchItineraries(activeTrip.id);
      setItineraries(itinRes.data);

      const expRes = await fetchExpenses(activeTrip.id);
      setExpenses(expRes.data);

      const packRes = await fetchPacking(activeTrip.id);
      setPacking(packRes.data);
    }

    loadTripDetails();
  }, [activeTrip, currentUser]);

  // Login / Logout Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('trip_user');
    setCurrentUser(null);
  };

  // Handlers
  const handleSelectTrip = (trip) => {
    setActiveTrip(trip);
  };

  const handleSaveTrip = async (tripData) => {
    await saveTrip(tripData);
    const updatedTrips = trips.some(t => t.id === tripData.id)
      ? trips.map(t => t.id === tripData.id ? tripData : t)
      : [tripData, ...trips];
    const sorted = updatedTrips.sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''));
    setTrips(sorted);
    setActiveTrip(tripData);
  };

  const handleSaveItinerary = async (item) => {
    await saveItinerary(item);
    const updated = itineraries.some(i => i.id === item.id)
      ? itineraries.map(i => i.id === item.id ? item : i)
      : [...itineraries, item];
    setItineraries(updated);
  };

  const handleDeleteItinerary = async (id) => {
    await deleteItinerary(id);
    setItineraries(itineraries.filter(i => i.id !== id));
  };

  const handleReorderItineraries = async (reorderedList) => {
    setItineraries(reorderedList);
    for (let i = 0; i < reorderedList.length; i++) {
      const item = reorderedList[i];
      if (item.sort_order !== i + 1) {
        await saveItinerary({ ...item, sort_order: i + 1 });
      }
    }
  };

  const handleSaveExpense = async (expense) => {
    await saveExpense(expense);
    const updated = expenses.some(e => e.id === expense.id)
      ? expenses.map(e => e.id === expense.id ? expense : e)
      : [expense, ...expenses];
    setExpenses(updated);
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleSavePackingItem = async (item) => {
    await savePackingItem(item);
    const updated = packing.some(p => p.id === item.id)
      ? packing.map(p => p.id === item.id ? item : p)
      : [...packing, item];
    setPacking(updated);
  };

  // If user is not logged in, render Login View
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {/* Animated Loading Splash */}
      <WelcomeSplash />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300 font-sans bg-codecat-glow">
        
        {/* Top Header */}
        <Header
          trips={trips}
          activeTrip={activeTrip}
          onSelectTrip={handleSelectTrip}
          onOpenNewTripModal={() => {
            setEditingTripData(null);
            setTripModalOpen(true);
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {loading ? (
            <div className="glass-card p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-sm font-semibold">載入行程資料中...</p>
            </div>
          ) : (
            <>
              {/* Active Trip Banner */}
              <TripBanner
                activeTrip={activeTrip}
                itineraries={itineraries}
                expenses={expenses}
                packing={packing}
                onOpenEditTripModal={(trip) => {
                  setEditingTripData(trip);
                  setTripModalOpen(true);
                }}
              />

              {/* Navigation Tabs */}
              <NavigationTabs
                activeTab={activeTab}
                onChangeTab={setActiveTab}
                itineraryCount={itineraries.length}
                expenseCount={expenses.length}
                packingCount={packing.length}
                placeCount={itineraries.filter(i => i.image_url || i.description).length}
              />

              {/* Animated Tab Views */}
              <div className="pb-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'itinerary' && (
                      <ItineraryView
                        itineraries={itineraries}
                        onSaveItinerary={handleSaveItinerary}
                        onDeleteItinerary={handleDeleteItinerary}
                        onReorderItineraries={handleReorderItineraries}
                      />
                    )}

                    {activeTab === 'expenses' && (
                      <ExpenseView
                        expenses={expenses}
                        itineraries={itineraries}
                        onSaveExpense={handleSaveExpense}
                        onDeleteExpense={handleDeleteExpense}
                        onSaveItinerary={handleSaveItinerary}
                      />
                    )}

                    {activeTab === 'packing' && (
                      <PackingView
                        packing={packing}
                        onSavePackingItem={handleSavePackingItem}
                      />
                    )}

                    {activeTab === 'places' && (
                      <PlaceNotesView
                        itineraries={itineraries}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md">
          <p>© 2026 旅遊筆記</p>
        </footer>

        {/* Trip Modal */}
        <TripModal
          isOpen={tripModalOpen}
          onClose={() => setTripModalOpen(false)}
          onSaveTrip={handleSaveTrip}
          initialTrip={editingTripData}
        />
      </div>
    </>
  );
}
