"use client";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { menuData } from "@/utils/data/menuData";
import { Role } from "@/utils/data/menuData";
import { MenuItem } from "@/utils/data/menuData";
import NavLink from "../NavLinks/SideBar";
import AuthorizationService from "@/lib/services/authorization.service";
import AuthenticationService from "@/lib/services/authentication.service";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/navigation";

function SideBar() {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>();
  const [commonItems, setCommonItems] = useState<MenuItem[] | null>();
  const [collapsed, setCollapsed] = useState<boolean>(false);
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

  return (
    <aside className="h-full border-r-[0.5px] border-secondary-100 w-fit hidden lg:flex flex-col">
      <nav className="flex flex-col justify-between h-full">
        <div className="flex flex-col justify-center gap-y-4">
          <header
            className="relative flex items-center justify-center px-2 py-2 cursor-pointer gap-x-2"
            onClick={(event) => {
              event.preventDefault();
              setCollapsed((collapsed) => !collapsed);
            }}
          >
            <Image src={logo} alt="logo" width={25} height={25} />
            <h1
              className={`text-lg font-bold font-body uppercase text-body-900 z-2 ${
                collapsed ? "hidden" : "block"
              }`}
            >
              Autofore
            </h1>
          </header>
          <section className="flex flex-col gap-y-2">
            {menuItems &&
              menuItems.map((item: MenuItem, index: number) => {
                return (
                  <Fragment key={index}>
                    <NavLink {...item} collapsed={collapsed} />
                  </Fragment>
                );
              })}
          </section>
        </div>
        <section className="flex flex-col mb-10 gap-y-2">
          {commonItems &&
            commonItems.map((item: MenuItem, index: number) => {
              return (
                <Fragment key={index}>
                  <NavLink {...item} collapsed={collapsed} />
                </Fragment>
              );
            })}
          <button
            className="ml-4 text-white rounded bg-primary-500 w-fit"
            onClick={async (event) => {
              event.preventDefault();
              try {
                await AuthenticationService.logout();
                router.push("/login");
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <div className="flex gap-x-3 items-center py-1.5 w-fit pl-2 pr-4 ">
              <BiLogOut size="22" className="text-white" />
              <span
                className={`capitalize transition-all duration-200 font-body text-base ${
                  collapsed ? "hidden" : "block"
                }`}
              >
                Logout
              </span>
            </div>
          </button>
        </section>
      </nav>
    </aside>
  );
}



export default SideBar;
