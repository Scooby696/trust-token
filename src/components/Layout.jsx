import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CryptoTicker from "./CryptoTicker";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CryptoTicker />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}