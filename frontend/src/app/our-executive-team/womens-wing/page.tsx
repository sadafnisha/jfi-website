import type { Metadata } from "next";
import WingTeam from "@/components/WingTeam";

export const metadata: Metadata = { title: "Women's Wing" };

export default function WomensWingPage() {
  return <WingTeam wingKey="womens" />;
}
