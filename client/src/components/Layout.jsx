import React from "react";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <main className="w-full px-6 py-6">{children}</main>
    </div>
  );
};

export default Layout;
