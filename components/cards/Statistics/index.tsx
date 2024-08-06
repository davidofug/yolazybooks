import React from "react";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import { addSeparator } from "@/utils/functions/thousandSeparator";

interface CardProps {
	title: string;
	value: number;
	percentage: number | string;
	type?: string;
}
const Card: React.FC<CardProps> = ({ title, value, percentage, type }) => {
	return (
		<div className="w-full p-2 sm:px-10 md:px-2 sm:py-8 md:py-2 border border-secondary-200 rounded-md flex flex-col gap-y-5 sm:gap-y-8 md:gap-y-5">
			<h3 className="text-sm font-medium font-body text-body-900">
				{title ?? "Title"}
			</h3>
			<div className="flex items-end justify-between">
				<p className="text-h4 text-body-900">
					{value ? addSeparator(value) : 0}
				</p>
				<p
					className={`rounded-lg px-1.5 py-0.5 flex w-fit h-fit gap-x-0.5 items-center text-xs font-semibold ${
						type && type === "danger"
							? "text-red-800 bg-danger-100"
							: "text-success-800 bg-success-100"
					}`}>
					{type === "success" ? (
						<BsArrowUpShort size={16} className="font-semibold" />
					) : (
						<BsArrowDownShort size={16} className="font-semibold" />
					)}
					{typeof percentage === "string"
						? percentage
						: `${percentage} %`}
				</p>
			</div>
		</div>
	);
};

export default Card;
