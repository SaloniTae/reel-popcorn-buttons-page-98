
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { LinkTrackingProvider } from "@/context/LinkTrackingContext";

const AdminLayout = () => {
  return (
    <LinkTrackingProvider>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </LinkTrackingProvider>
  );
};

export default AdminLayout;
