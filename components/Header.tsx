"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/lib/config";
import { ROUTES } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const { currentUser, logout, getUserName } = useAuth();

  const isActive = (route: string) => pathname === route;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & App Name */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden">
              <Image
                src="/icons/logo.svg"
                alt="Logo"
                width={36}
                height={36}
                className="transition-transform group-hover:scale-110"
              />
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:block">
              {AppConfig.app.shortName}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href={ROUTES.HOME} active={isActive(ROUTES.HOME)}>
              Home
            </NavLink>
            <NavLink href={ROUTES.TEST} active={isActive(ROUTES.TEST)}>
              Assessment
            </NavLink>
            <NavLink href={ROUTES.RESULTS} active={isActive(ROUTES.RESULTS)}>
              My Progress
            </NavLink>
            <NavLink href={ROUTES.JOURNAL} active={isActive(ROUTES.JOURNAL)}>
              Journal
            </NavLink>
            <NavLink href={ROUTES.COACH} active={isActive(ROUTES.COACH)}>
              Coach
            </NavLink>
            <NavLink href={ROUTES.SETTINGS} active={isActive(ROUTES.SETTINGS)}>
              Settings
            </NavLink>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-400">
                      {getUserName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{getUserName()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href={ROUTES.SIGNIN}>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "text-purple-400 bg-purple-500/10"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </Link>
  );
}
