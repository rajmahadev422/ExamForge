"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ProfileDropdown({ open, setOpen }) {
  const dropdownRef = useRef();
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  if (!open) return null;

  const handleProfile = () => {
    setOpen(false);
    router.push("/profile");
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut({ callbackUrl: "/login" }); // next-auth logout
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 w-48 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
    >
      <button
        onClick={handleProfile}
        className="w-full text-left text-black hover:cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
      >
        Change Profile
      </button>

      <button
        onClick={handleLogout}
        className="w-full text-left hover:cursor-pointer px-4 py-2 text-sm text-red-500 hover:bg-red-50"
      >
        Logout
      </button>
    </div>
  );
}