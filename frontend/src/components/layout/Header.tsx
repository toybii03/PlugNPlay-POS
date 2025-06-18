import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useSettings();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6"
      data-id="zl3vywxnc"
      data-path="src/components/layout/Header.tsx"
    >
      <div
        className="flex items-center space-x-4"
        data-id="icrs2fifw"
        data-path="src/components/layout/Header.tsx"
      >
        <h2
          className="text-lg font-semibold text-gray-900 dark:text-white"
          data-id="9ad0ldmnm"
          data-path="src/components/layout/Header.tsx"
        >
          Welcome back, {user?.name}
        </h2>
      </div>

      <div
        className="flex items-center space-x-4"
        data-id="qc6r37ul6"
        data-path="src/components/layout/Header.tsx"
      >
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
          data-id="1jtn6rn5f"
          data-path="src/components/layout/Header.tsx"
        >
          {theme === "light" ? (
            <Moon
              className="h-4 w-4"
              data-id="cih4nl06k"
              data-path="src/components/layout/Header.tsx"
            />
          ) : (
            <Sun
              className="h-4 w-4"
              data-id="avegy3qqt"
              data-path="src/components/layout/Header.tsx"
            />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu
          data-id="bp1vpvywc"
          data-path="src/components/layout/Header.tsx"
        >
          <DropdownMenuTrigger
            asChild
            data-id="aixop2sri"
            data-path="src/components/layout/Header.tsx"
          >
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full p-0"
              data-id="ghx34a66r"
              data-path="src/components/layout/Header.tsx"
            >
              <Avatar
                className="h-9 w-9"
                data-id="6yar2w63i"
                data-path="src/components/layout/Header.tsx"
              >
                <AvatarFallback
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  data-id="qbdfefzyz"
                  data-path="src/components/layout/Header.tsx"
                >
                  {getInitials(user?.name || "User")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            data-id="3e2gcevhi"
            data-path="src/components/layout/Header.tsx"
          >
            <DropdownMenuLabel
              data-id="0db1krzmr"
              data-path="src/components/layout/Header.tsx"
            >
              <div
                className="flex flex-col space-y-1"
                data-id="34l0z6cuo"
                data-path="src/components/layout/Header.tsx"
              >
                <p
                  className="text-sm font-medium"
                  data-id="ej8vj93gz"
                  data-path="src/components/layout/Header.tsx"
                >
                  {user?.name}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                  data-id="2oofzu1gi"
                  data-path="src/components/layout/Header.tsx"
                >
                  {user?.email}
                </p>
                <p
                  className="text-xs text-blue-600 dark:text-blue-400 capitalize"
                  data-id="njq0i6qs6"
                  data-path="src/components/layout/Header.tsx"
                >
                  {user?.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator
              data-id="ki1wgmz99"
              data-path="src/components/layout/Header.tsx"
            />
            <DropdownMenuItem
              asChild
              data-id="8pi0nt8zk"
              data-path="src/components/layout/Header.tsx"
            >
              <Link
                to="/profile"
                className="flex items-center"
                data-id="aqoqt1zqo"
                data-path="src/components/layout/Header.tsx"
              >
                <User
                  className="mr-2 h-4 w-4"
                  data-id="ehybkkxwc"
                  data-path="src/components/layout/Header.tsx"
                />
                Profile
              </Link>
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <DropdownMenuItem
                asChild
                data-id="19tk7do99"
                data-path="src/components/layout/Header.tsx"
              >
                <Link
                  to="/settings"
                  className="flex items-center"
                  data-id="191o4jbn0"
                  data-path="src/components/layout/Header.tsx"
                >
                  <Settings
                    className="mr-2 h-4 w-4"
                    data-id="f5vf00rwr"
                    data-path="src/components/layout/Header.tsx"
                  />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator
              data-id="1holcp531"
              data-path="src/components/layout/Header.tsx"
            />
            <DropdownMenuItem
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="text-red-600 dark:text-red-400"
              data-id="oki62g9jc"
              data-path="src/components/layout/Header.tsx"
            >
              <LogOut
                className="mr-2 h-4 w-4"
                data-id="nrtbdmdet"
                data-path="src/components/layout/Header.tsx"
              />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
