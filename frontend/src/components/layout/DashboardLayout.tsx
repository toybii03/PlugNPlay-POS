import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  console.log("Rendering DashboardLayout component");
  return (
    <div
      className="flex h-screen bg-gray-50 dark:bg-gray-950"
      data-id="lkeaelm3b"
      data-path="src/components/layout/DashboardLayout.tsx"
    >
      <Sidebar
        data-id="px2s7mphc"
        data-path="src/components/layout/DashboardLayout.tsx"
      />
      <div
        className="flex-1 flex flex-col overflow-hidden"
        data-id="mzks70wqk"
        data-path="src/components/layout/DashboardLayout.tsx"
      >
        <Header
          data-id="geuy5vwkd"
          data-path="src/components/layout/DashboardLayout.tsx"
        />
        <main
          className="flex-1 overflow-auto p-6"
          data-id="1vda8up60"
          data-path="src/components/layout/DashboardLayout.tsx"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
