import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Warehouse,
  UserCheck,
  CreditCard,
  FileText,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Warehouse,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Users",
    href: "/users",
    icon: UserCheck,
    adminOnly: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    adminOnly: true,
  },
];

const Sidebar: React.FC = () => {
  console.log("Rendering Sidebar component");
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) =>
      (!item.adminOnly || user?.role === "admin" || user?.role === "manager") &&
      !(user?.role === "cashier" && item.title === "Dashboard") &&
      !(
        user?.role === "manager" &&
        (item.title === "Users" || item.title === "Settings")
      )
  );

  return (
    <div
      className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full"
      data-id="4xgsk69sy"
      data-path="src/components/layout/Sidebar.tsx"
    >
      <div
        className="p-6 border-b border-gray-200 dark:border-gray-700"
        data-id="fmnq5eoo8"
        data-path="src/components/layout/Sidebar.tsx"
      >
        <div
          className="flex items-center space-x-3"
          data-id="4i5yxd8zo"
          data-path="src/components/layout/Sidebar.tsx"
        >
          <div className="flex items-center justify-center">
            <img
              src="/images/plugnplay.JPEG"
              alt=""
              className="h-10 w-auto"
            />
          </div>
          <div
            data-id="e5jnblubh"
            data-path="src/components/layout/Sidebar.tsx"
          >
            <h1
              className="text-xl font-bold text-gray-900 dark:text-white"
              data-id="f0w25e7xq"
              data-path="src/components/layout/Sidebar.tsx"
            >
              PlugNPlay
            </h1>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              data-id="v81jt3uuo"
              data-path="src/components/layout/Sidebar.tsx"
            >
              Point of Sale
            </p>
          </div>
        </div>
      </div>

      <nav
        className="p-4"
        data-id="1ye6ub1ot"
        data-path="src/components/layout/Sidebar.tsx"
      >
        <ul
          className="space-y-2"
          data-id="xy163u4li"
          data-path="src/components/layout/Sidebar.tsx"
        >
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <li
                key={item.href}
                data-id="yyrye4uuv"
                data-path="src/components/layout/Sidebar.tsx"
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                  data-id="d1d6yb5sl"
                  data-path="src/components/layout/Sidebar.tsx"
                >
                  <Icon
                    className="h-5 w-5"
                    data-id="srbx1ymx6"
                    data-path="src/components/layout/Sidebar.tsx"
                  />
                  <span
                    data-id="i5apr9c4s"
                    data-path="src/components/layout/Sidebar.tsx"
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
