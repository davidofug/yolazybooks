import { IconType } from "react-icons";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { BiSolidCoupon } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { IoMdCar } from "react-icons/io";
import { GarageIcon } from "@/components/GarageIcon";
import { CustomerIcon } from "@/components/CustomerIcon";
import { GarageNetworkIcon } from "@/components/GarageNetwork";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export type Role = "superadmin" | "admin" | "customer" | "common";

export type MenuData = {
  [key in Role]: MenuItem[];
};

// define a type for the menu item
export interface MenuItem {
  name: string;
  href: string;
  icon?: IconType | React.ReactNode | any;
}

export const menuData = {
  admin: [
    {
      name: "dashboard",
      href: "/admin/dashboard",
      icon: AiOutlineDashboard,
    },
    {
      name: "customers",
      href: "/admin/customers",
      icon: CustomerIcon,
    },
    {
      name: "garages",
      href: "/admin/garages",
      icon: GarageIcon,
    },
    {
      name: "appointments",
      href: "/admin/appointments",
      icon: BiTime,
    },
    {
      name: "ratings",
      href: "/admin/ratings",
      icon: BsStarFill,
    },
    {
      name: "vehicles",
      href: "/admin/vehicles",
      icon: IoMdCar,
    },
    {
      name: "coupons",
      href: "/admin/coupons",
      icon: BiSolidCoupon,
    },
    {
      name: "Requests",
      href: "/admin/requests",
      icon: GarageNetworkIcon,
    },
  ],
  customer: [
    {
      name: "dashboard",
      href: "/customer/dashboard",
      icon: AiOutlineDashboard,
    },
    {
      name: "appointments",
      href: "/customer/appointments",
      icon: BiTime,
    },
    {
      name: "vehicles",
      href: "/customer/vehicles",
      icon: IoMdCar,
    },
    {
      name: "ratings",
      href: "/customer/ratings",
      icon: BsStarFill,
    },
  ],
  superadmin: [
    {
      name: "dashboard",
      href: "/superadmin/dashboard",
      icon: AiOutlineDashboard,
    },
    {
      name: "administrators",
      href: "/administrators",
      icon: IoIosPeople,
    },
    {
      name: "customers",
      href: "/customers",
      icon: BsPeopleFill,
    },
    {
      name: "garages",
      href: "/garages",
      icon: GarageIcon,
    },
    {
      name: "appointments",
      href: "/appointments",
      icon: BiTime,
    },
    {
      name: "ratings",
      href: "/ratings",
      icon: BsStarFill,
    },
    {
      name: "vehicles",
      href: "/vehicles",
      icon: IoMdCar,
    },
    {
      name: "coupons",
      href: "/coupons",
      icon: BiSolidCoupon,
    },
  ],
  common: [
    {
      name: "settings",
      href: "/settings",
      icon: IoMdSettings,
    },
    {
      name: "profile",
      href: "/customer/profile",
      icon: CgProfile,
    },
  ],
};
