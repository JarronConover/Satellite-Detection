import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Ships from "./pages/Ships.jsx";
import Ship from "./pages/Ship.jsx";
import MapPage from "./pages/MapPage.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "./components/Navbar.jsx";
import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Account from "./pages/Account.jsx";

const supabase = createClient(
  'https://ignhwqgpjcbddedvvdym.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnbmh3cWdwamNiZGRlZHZ2ZHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzQzMDIsImV4cCI6MjA1OTkxMDMwMn0.pCNpehukqdors7BwtZpW2hTqJjEstgW9wbaEy4p9R2U' // Replace with your Supabase anon key
);

function App() {
  const [session, setSession] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear session after logout
  };

  if (!session) {
    return (
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    )
  }
  else {
  return (
    <SidebarProvider>
      <Router>
        {/* Sidebar and Router content */}
        <AppSidebar />
        <main className="w-full">
          <Navbar title={"Ship Detection via Satelite"} add={
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          }/>
          <SidebarTrigger />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:center" element={<Home />} />
            <Route path="/ships" element={<Ships />} />
            <Route path="/ships/filter/:bounds" element={<Ships />} />
            <Route path="/ships/:id" element={<Ship />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/account" element={<Account />} />

          </Routes>
        </main>
      </Router>
    </SidebarProvider>
  );
}
}

export default App;
