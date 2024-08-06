import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Slab, Poppins } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import GoogleAnalytics from "@/components/GoogleAnaytics";
import CookieBanner from "@/components/CookieBanner";
import "intro.js/introjs.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});
const roboto_slab = Roboto_Slab({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
	title: "YoLazyBooks",
	description: "Record and Track funds in Realtime.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${poppins.variable} ${roboto_slab.variable}`}>
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
