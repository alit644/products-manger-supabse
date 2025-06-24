import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";

const RootLayout = () => {
  return (
    <main className="flex justify-between">
      <Sidebar />
      <div className="bg-[var(--color-dark)] w-full text-white sm:p-6 p-4 sm:ml-64 mt-14">
        <Outlet />
      </div>
    </main>
  );
};

export default RootLayout;
