import Reviews from "@/components/Reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | Flynx Platform",
  description: "See what teams worldwide say about Flynx.",
};

export default function ReviewsPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "6rem" }}>
      <Reviews />
    </div>
  );
}
