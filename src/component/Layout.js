import React from "react";
import SidebarV1 from "./Sidebarv1";

const Layout = ({ children }) => {
  return (
    <div className="container-fluid vh-100">
      <div className=" h-100 g-0 flex">
        {/* Sidebar */}
        <div className="bg-light overflow-auto  flex-19">
          <SidebarV1 />
        </div>

        {/* Main Content */}
        <div className="overflow-auto p-3 flex-80">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
