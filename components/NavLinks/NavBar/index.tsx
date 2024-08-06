"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
    href: string;
    name: string;
    toggleMenu: (showMenu: boolean) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, name, toggleMenu }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      key={name}
      className={`py-1.5 text-center font-body text-base font-regular capitalize ${
        isActive ? "bg-primary-200 text-primary-500" : "text-body-900"
      }`}
      onClick={() => toggleMenu(false)}
    >
      {name}
    </Link>
  );
};

export default NavLink;
