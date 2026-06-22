import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { Home, LayoutDashboard, LogOut, Menu, X, CheckSquare } from "lucide-react";
import { Button } from "./ui/button";

const SidebarLayout = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const menuItems = [
    {
      path: "/",
      name: "Trang chủ",
      icon: <Home className="size-5" />,
    },
    {
      path: "/dashboard",
      name: "Thống kê",
      icon: <LayoutDashboard className="size-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fefcff] relative">
      {/* Background dreamy glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 80%, rgba(173, 216, 230, 0.25), transparent 50%),
            radial-gradient(circle at 90% 20%, rgba(255, 182, 193, 0.3), transparent 50%)`,
        }}
      />

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 bg-white/40 backdrop-blur-lg p-6 relative z-10 shrink-0 h-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <CheckSquare className="size-6 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            DoDo!
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-slate-100/80 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="size-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.displayName || "Người dùng"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                @{user?.username || "username"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/5 cursor-pointer text-sm font-medium transition-all duration-150"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* --- MOBILE HEADER & SIDEBAR --- */}
      <div className="md:hidden flex flex-col w-full h-full relative">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-100 bg-white/40 backdrop-blur-lg flex items-center justify-between px-6 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <CheckSquare className="size-5 text-indigo-600" />
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              DoDo!
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="size-6" />
          </button>
        </header>

        {/* Mobile Menu Backdrop */}
        {isMobileOpen && (
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs z-40 transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <aside
          className={`absolute top-0 right-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col p-6 z-50 transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-slate-800">Menu</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.displayName || "Người dùng"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  @{user?.username || "username"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/5 text-sm font-medium transition-all duration-150 cursor-pointer"
              onClick={() => {
                setIsMobileOpen(false);
                handleLogout();
              }}
            >
              <LogOut className="size-5" />
              Đăng xuất
            </Button>
          </div>
        </aside>

        {/* Content Outlet for Mobile */}
        <main className="flex-1 overflow-y-auto relative z-0">
          <Outlet />
        </main>
      </div>

      {/* --- CONTENT OUTLET FOR DESKTOP --- */}
      <main className="hidden md:block flex-1 overflow-y-auto relative z-10 h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
