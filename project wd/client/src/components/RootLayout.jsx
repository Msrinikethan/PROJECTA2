import React from "react";
import Header from "./common/Header.jsx";
import Footer from "./common/Footer.jsx";
import { Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function Rootlayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY } keepAlive>
      <div>
        <Header />
        <div style={{ minHeight: "90vh" }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </ClerkProvider>
  );
}

export default Rootlayout;
