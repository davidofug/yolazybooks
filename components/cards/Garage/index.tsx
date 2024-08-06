import Image from "next/image";
import React from "react";

import logo from "@/assets/images/logo.png";

import Garage from "@/types/Interfaces";

import capitalizeFirstLetter from "@/utils/functions/capitalizeFirstLetter";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { GrLocation } from "react-icons/gr";

interface CardProps {
	garage: any;
	handleModel(): void;
	setSelectedGarage(garage: Garage): void;
}

const Index: React.FC<CardProps> = ({
	garage,
	handleModel,
	setSelectedGarage,
}) => {
	return (
		<li className="flex flex-row items-center justify-between w-full p-1 mb-3 rounded-md bg-secondary-50/25 hover:bg-secondary-50 cursor-pointer">
			<Image
				src={garage.logoUrl || logo}
				alt="logo"
				width={100}
				height={100}
				priority={true}
				quality={75}
				className="w-1/6 lg:w-20"
			/>
			<div className="w-1/3 p-1 overflow-hidden">
				<h3
					className={`text-xs md:text-2xl sm:text-lg lg:text-base ${
						garage.name.length > 19 ? "text-xs" : ""
					}`}>
					{garage.name}
				</h3>
				<div className="flex flex-row">
					{[1, 2, 3, 4, 5].map((item, index) => {
						if (garage.averageRating) {
							if (garage.averageRating > item) {
								return (
									<AiFillStar
										key={index}
										className="w-3 h-3 md:w-8 md:h-8 lg:w-4 lg:h-4 fill-yellow-500"
									/>
								);
							} else {
								return (
									<AiOutlineStar
										key={index}
										className="w-3 h-3 md:w-8 md:h-8 lg:w-4 lg:h-4 fill-yellow-500"
									/>
								);
							}
						} else {
							return (
								<AiOutlineStar
									key={index}
									className="w-3 h-3 md:w-8 md:h-8 lg:w-4 lg:h-4 fill-yellow-500"
								/>
							);
						}
					})}
				</div>
				<div className="flex flex-row items-center gap-1 overflow-hidden">
					<GrLocation className="w-3 h-3 md:w-6 md:h-6 lg:h-4 lg:w-4" />
					<h5 className="text-xs md:text-xl lg:text-base">
						{garage.garageAddress.name}
					</h5>
				</div>
			</div>
			{/* Contact person  */}
			<div className="hidden md:flex md:flex-col md:w-1/3">
				<h3 className="md:text-xl font-body lg:text-base">
					{`${capitalizeFirstLetter(
						garage.contactPerson.salutation
					)}.${capitalizeFirstLetter(garage.contactPerson.name)}`}
				</h3>
				<p className="flex items-center gap-2 text-sm font-normal">
					<span className="font-bold font-heading md:text-2xl lg:text-base">
						Role:
					</span>
					{capitalizeFirstLetter(garage.contactPerson.role)}
				</p>
				<div className="flex flex-row items-center gap-1">
					<h2 className="font-bold font-heading md:text-xl lg:text-base">
						Tel:
					</h2>
					<h2 className="lg:text-base">
						{garage.contactPerson.phone}
					</h2>
				</div>
				<div className="flex flex-row gap-2">
					<p className="flex items-center gap-2 font-normal md:text-sm ">
						<span className="font-bold font-heading md:text-xl lg:text-base">
							Email:
						</span>
						{garage.contactPerson.email}
					</p>
				</div>
			</div>
			<div className="">
				<button
					className="p-1 text-xs text-white rounded-md cursor-pointer md:text-base bg-primary-500 font-body"
					onClick={() => {
						setSelectedGarage(garage);
						handleModel();
					}}>
					Book appointment
				</button>
			</div>
		</li>
	);
};

export default Index;
