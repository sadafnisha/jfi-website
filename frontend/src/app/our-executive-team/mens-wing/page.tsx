import type { Metadata } from "next";
import WingTeam from "@/components/WingTeam";

export const metadata: Metadata = { title: "Men's Wing" };

export default function MensWingPage() {
  return <WingTeam wingKey="mens" />;
}
