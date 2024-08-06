"use client";
import React, { useState, useEffect, Fragment } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { MenuItem } from "@/utils/data/menuData";
import { menuData } from "@/utils/data/menuData";
import NavLink from "../NavLinks/NavBar";
import AuthorizationService from "@/lib/services/authorization.service";
import { Role } from "@/utils/data/menuData";
import AuthenticationService from "@/lib/services/authentication.service";
import { useRouter } from "next/navigation";

function Navigation() {
	const [showMenu, setShowMenu] = useState(false);
	const [menuItems, setMenuItems] = useState<MenuItem[] | any>(null);
	const [commonItems, setCommonItems] = useState<MenuItem[] | null>();
	const router = useRouter();

	useEffect(() => {
		const setRoleMenu = async () => {
			try {
				const isAdmin = await AuthorizationService.checkIsAdmin();
				const isCustomer = await AuthorizationService.checkIsCustomer();

				let role: Role;
				if (isAdmin) role = "admin";
				if (isCustomer) role = "customer";

				setMenuItems(() => menuData[role]);
				setCommonItems(() => menuData["common"]);
			} catch (error) {
				console.log("NavBar error: getting the roles");
			}
		};

		setRoleMenu();
	}, []);

	const handleMenushowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		console.log("Toggling Menu");
		setShowMenu((showMenu) => !showMenu);
	};

	return (
		<div className="fixed z-20 w-full bg-white lg:hidden">
			<div className="relative flex justify-end py-2 border-b">
				<button
					className="px-1 py-0.5 rounded mr-2 lg:invisible"
					onClick={handleMenushowMenu}>
					<RxHamburgerMenu size={30} />
				</button>
				<div
					className={`absolute  w-full bg-white shadow-md lg:hidden ${
						// if showMenu is true, show the menu else hide it
						showMenu ? "block" : "hidden"
					}`}>
					<div className="flex items-center justify-between px-2">
						<div className="flex items-center gap-x-1">
							<Image
								src={logo}
								alt="logo"
								width={25}
								height={25}
							/>
							<h1 className="text-lg font-bold uppercase font-body text-body-900">
								YoLazyBooks
							</h1>
						</div>
						<button
							className="px-1 py-0.5 rounded text-danger-700"
							onClick={handleMenushowMenu}>
							<AiOutlineClose size={22} />
						</button>
					</div>
					<div className="flex flex-col px-1 my-4 gap-y-2 ">
						{menuItems &&
							menuItems.map(
								({ href, name }: MenuItem, index: number) => {
									return (
										<Fragment key={index}>
											<NavLink
												href={href}
												name={name}
												toggleMenu={setShowMenu}
											/>
										</Fragment>
									);
								}
							)}
						{commonItems &&
							commonItems.map(
								({ href, name }: MenuItem, index: number) => {
									return (
										<Fragment key={index}>
											<NavLink
												href={href}
												name={name}
												toggleMenu={setShowMenu}
											/>
										</Fragment>
									);
								}
							)}
						<button
							type="button"
							onClick={async (event) => {
								event.preventDefault();
								try {
									await AuthenticationService.logout();
									router.push("/login");
								} catch (error) {
									console.log("Error Logging out. Navbar");
								}
							}}
							className="text-lg font-regular text-white font-body text-center py-1.5 px-2 bg-primary-500 rounded capitalize mx-2">
							Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navigation;
