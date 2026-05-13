import Pricing from "@/components/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Cognis Platform",
  description: "Simple, transparent pricing. Choose the plan that fits your workflow.",
};

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "6rem" }}>
      <div style={{ paddingTop: "2rem", textAlign: "center", paddingBottom: "1rem" }}>
        <Pricing />
      </div>
    </div>
  );
}
