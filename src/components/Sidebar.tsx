import { SiSalla } from "react-icons/si";
import { SIDEBAR_DATA } from "../data";
import { NavLink } from "react-router";
import { MdLogout } from "react-icons/md";
import { useAuthStore } from "../store/useAuthStore";
import Avatar from "./Avatar";
import { useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";

const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const username = user?.user_metadata.username || user?.user_metadata.user_name;
  const [isOpen, setIsOpen] = useState(false);

  const renderLink = SIDEBAR_DATA.map((link) => (
    <li key={link.title}>
      <NavLink
        to={link.path}
        className={
          "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      >
        <link.icon className="w-6 h-6" />
        <span className="ml-3">{link.title}</span>
      </NavLink>
    </li>
  ));

  return (
    <div className="">
      <nav className="fixed top-0 z-50 w-full bg-[var(--color-dark)] border-b border-zinc-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end space-x-1.5">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-300 rounded-lg sm:hidden hover:bg-[#169976] focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <FaBarsStaggered className="w-6 h-6" />

                <span className="sr-only">Open sidebar</span>
              </button>
              <div className="flex gap-2 ">
                <SiSalla className="w-8 h-8 text-[#3ecf8e]" />

                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Salla
                </span>
              </div>
            </div>
            <div>
            
                <Avatar name={username} />
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 sm:w-64 w-50 h-screen pt-20 transition-transform -translate-x-full ${
          isOpen ? "translate-x-0" : ""
        } bg-[var(--color-dark)] border-r  sm:translate-x-0 border-zinc-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[var(--color-dark)] ">
          <ul className="space-y-2 font-medium">{renderLink}</ul>
          <button
            onClick={logout}
            className="w-full pt-4 mt-4 space-y-2 font-medium border-t border-gray-700 "
          >
            <p className="flex items-center cursor-pointer p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <MdLogout className="w-6 h-6" />
              <span className="ml-3">Logout</span>
            </p>
          </button>
        </div>
      </aside>

    
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
