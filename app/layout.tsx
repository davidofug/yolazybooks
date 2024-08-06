import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans, Montserrat } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import GoogleAnalytics from "@/components/GoogleAnaytics";
import CookieBanner from "@/components/CookieBanner";
import "intro.js/introjs.css";

const JosefinSans = Josefin_Sans({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	variable: "--font-josefin-sans",
});
const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	title: "YoLazyBooks",
	description: "Keep Financial records. Issue Invoices.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${JosefinSans.variable} ${montserrat.variable}`}>
			<GoogleAnalytics
				GA_MEASUREMENT_ID={String(
					process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!
				)}
			/>
			<body>
				{children}
				<CookieBanner />
			</body>
		</html>
	);
}
