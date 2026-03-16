"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Logo from "@/components/layout/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/shop?category=men" },
  { label: "Women", href: "/shop?category=women" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check login status whenever route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Decode name initial from /api/auth/me (best-effort, silent)
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => {
          const name: string = d?.data?.name ?? "";
          setUserInitial(name.charAt(0).toUpperCase());
        })
        .catch(() => setUserInitial("U"));
    } else {
      setIsLoggedIn(false);
      setUserInitial("");
    }
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const isActive = (href: string, label: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/shop")) {
      // Treat all /shop variants (men, women filters) as "Shop" for active state
      return pathname.startsWith("/shop") && label === "Shop";
    }
    return pathname === href;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-charcoal-100/70 transition-all duration-500 ease-premium ${
          isScrolled ? "shadow-soft" : ""
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Logo href="/" size="md" />

            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-[0.04em] text-charcoal-400 hover:text-charcoal-950 transition-colors pb-1 ${
                    isActive(link.href, link.label)
                      ? "text-charcoal-950 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-6 after:bg-charcoal-950"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/shop"
                className="hidden sm:flex p-2.5 text-charcoal-400 hover:text-charcoal-900 rounded-full hover:bg-charcoal-50 transition-all duration-300"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </Link>

              {isLoggedIn ? (
                <div ref={dropdownRef} className="relative hidden sm:block">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-8 h-8 rounded-full bg-charcoal-950 text-white text-xs font-semibold flex items-center justify-center hover:bg-charcoal-700 transition-colors duration-200 select-none"
                    aria-label="Account menu"
                  >
                    {userInitial}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-44 bg-white rounded-2xl border border-charcoal-100 shadow-soft-md py-1.5 z-50">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        My Orders
                      </Link>
                      <div className="my-1.5 h-px bg-charcoal-50" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex p-2.5 text-charcoal-400 hover:text-charcoal-900 rounded-full hover:bg-charcoal-50 transition-all duration-300"
                  aria-label="Account"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative flex p-2.5 text-charcoal-400 hover:text-charcoal-900 rounded-full hover:bg-charcoal-50 transition-all duration-300"
                aria-label={`Cart (${totalItems} items)`}
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] text-[10px] font-bold text-white bg-charcoal-950 rounded-full ring-2 ring-white">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex md:hidden p-2.5 text-charcoal-400 hover:text-charcoal-900 rounded-full hover:bg-charcoal-50 transition-all duration-300 ml-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-charcoal-100 md:hidden transition-all duration-400 ease-premium ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 space-y-1">
          <div className="pb-4 mb-2 border-b border-charcoal-100">
            <Logo href="/" size="sm" />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                pathname === link.href
                  ? "bg-charcoal-50 text-charcoal-950"
                  : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-950"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-charcoal-100 mt-2 space-y-2">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="btn-secondary w-full text-center text-sm">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-center text-sm text-red-500 py-3 hover:bg-red-50 rounded-full transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-secondary w-full text-center text-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
