"use client";
import React from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface NavigationProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleServiceScoll: () => void;
	handleContactScroll: () => void;
	handleAboutScroll: () => void;
}
const Navigation: React.FC<NavigationProps> = ({
	isOpen,
	setIsOpen,
	handleServiceScoll,
	handleContactScroll,
	handleAboutScroll,
}) => {
	return (
		<div
			className={`flex w-full flex-col font-body text-base md:text-base font-normal text-secondary-900 fixed top-0 bg-white z-20 border-b-2 ${
				isOpen ? "border-transparent" : "border-primary-500 "
			} transition-all duration-300 `}
			id="navbar">
			<div
				className={`flex ${
					isOpen ? "justify-between" : "justify-end"
				} w-full md:hidden`}>
				<button
					type="button"
					onClick={(event) => {
						event.preventDefault();
						setIsOpen(!isOpen);
					}}
					className={`${
						isOpen ? "" : "invisible"
					} outline-none px-2`}>
					<AiOutlineClose className="text-danger-500" />
				</button>
				<button
					type="button"
					onClick={(event) => {
						event.preventDefault();
						setIsOpen(!isOpen);
					}}
					className="mx-4 outline-none cursor-pointer md:hidden">
					<AiOutlineMenu className="w-6 h-6 my-2" />
				</button>
			</div>
			<header
				className={`md:flex md:static flex-col md:flex-row md:justify-between items-center md:py-2 px-10 md:first-line:px-24 bg-white gap-2 w-full absolute z-20 top-10 ${
					isOpen ? "flex " : "hidden"
				} h-screen md:h-fit`}>
				<nav className="flex flex-col items-center gap-4 md:flex-row">
					<h1 className="hidden text-2xl font-bold text-black md:block">
						<a href="/">YoLazyBooks</a>
					</h1>
					<ul className="flex flex-col gap-4 text-center md:flex-row">
						<li>
							{/* <a href="#services">Services</a> */}
							<button onClick={handleServiceScoll}>
								Services
							</button>
						</li>
						<li>
							{/* <a href="#about">About</a> */}
							<button onClick={handleAboutScroll}>About</button>
						</li>
						<li>
							{/* <a href="#contact">Contact</a> */}
							<button onClick={handleContactScroll}>
								Contact
							</button>
						</li>
					</ul>
				</nav>
				<nav>
					<ul className="flex flex-col items-center gap-4 md:flex-row h-fit">
						<li>
							<a href="/login">Login</a>
						</li>
						<li>
							<a
								href="/sign-up"
								className="px-4 py-2 text-white bg-primary-500 rounded-2xl ">
								Sign up
							</a>
						</li>
					</ul>
				</nav>
			</header>
		</div>
	);
};

export default Navigation;
