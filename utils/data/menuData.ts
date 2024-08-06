import { IconType } from "react-icons";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { BiSolidCoupon } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { IoMdCar } from "react-icons/io";
import { CustomerIcon } from "@/components/CustomerIcon";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export type Role = "superadmin" | "admin" | "member" | "guest";

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
			name: "members",
			href: "/admin/customers",
			icon: CustomerIcon,
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
	guest: [
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
