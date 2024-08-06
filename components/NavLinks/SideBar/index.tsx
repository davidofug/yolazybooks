"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MenuItem } from "@/utils/data/menuData";

interface NavLinkProps extends MenuItem {
  collapsed?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ collapsed, href, name, icon }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`text-center font-body text-base font-regular hover:text-primary-500  group flex transition-all duration-200 ${
        isActive
          ? "bg-primary-200 text-primary-500"
          : "text-body-900 hover:bg-primary-50"
      }`}
    >
      <div
        className={`w-2 bg-primary-500 h-full rounded-r-md ${
          isActive ? "block" : "invisible"
        }`}
      ></div>
      <div className="flex gap-x-2 items-center px-5 py-1.5 mr-3 ">
        <div
          className={`${
            isActive
              ? "text-primary-500"
              : "text-black group-hover:bg-primary-50"
          }`}
        >
          {icon &&
            React.createElement(icon, {
              size: name === "ratings" ? 18 : 22,
              className: `group-hover:text-primary-500 group-hover:fill-[#EF5427] ${
                isActive ? "fill-[#EF5427]" : ""
              }`,
            })}
        </div>

        <span
          className={`capitalize group-hover:text-primary-500 transition-all duration-200 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          {name}
        </span>
      </div>
    </Link>
  );
};

export default NavLink;
