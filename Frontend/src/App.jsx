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
import { Button } from "./components/ui/button.jsx";
import NotFound from "./pages/NotFound.jsx";

const supabase = createClient(
  'https://ignhwqgpjcbddedvvdym.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnbmh3cWdwamNiZGRlZHZ2ZHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzQzMDIsImV4cCI6MjA1OTkxMDMwMn0.pCNpehukqdors7BwtZpW2hTqJjEstgW9wbaEy4p9R2U' // Replace with your Supabase anon key
);

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear session after logout
  };

  const getNavbarTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Satellite Ship Detection";
      case "/ships":
        return "Ships";
      case "/ships/":
        return "Ship Details";
      case "/map":
        return "Map";
      case "/account":
        return "Account";
      default:
        return "Ship Detection via Satellite"; 
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-md">
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </div>
      </div>

    )
  }
  else {
  return (
    <SidebarProvider defaultOpen={false}>
      <Router>
        <AppSidebar />
        <main className="w-full">
          <Navbar 
            title={getNavbarTitle()}
            add={
              <Button
                onClick={handleLogout}
                className="bg-blue-500 text-base text-white px-4 py-2 rounded hover:bg-blue-400 active:scale-96 focus:outline-none transition-transform duration-200 cursor-pointer"
              >
                Sign Out
              </Button>
            }
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ships" element={<Ships />} />
            <Route path="/ships/:id" element={<Ship />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </SidebarProvider>
  );
}
}

export default App;
