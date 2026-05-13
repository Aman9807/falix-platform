"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
// 🔐 THE MASTER ADMIN LIST
// Add your Google/Gmail account email here:
const ADMIN_EMAILS = [
  "khantafazzul740@gmail.com",
  "aman9807@github.com",
  "ENTER_YOUR_GMAIL_HERE",
];

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthCheck({ children, requireAdmin = false }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        // Check if user is in the admin list (Case-Insensitive & Trimmed)
        const userEmail = user.email?.toLowerCase().trim() || "";
        const lowerCaseAdminEmails = ADMIN_EMAILS.map(email => email.toLowerCase().trim());
        const isUserAdmin = lowerCaseAdminEmails.includes(userEmail);
        setIsAdmin(isUserAdmin);

        // If this page requires admin but the user isn't one, show error instead of silent redirect
        if (requireAdmin && !isUserAdmin) {
          console.warn("[Security] Unauthorized admin access attempt by:", userEmail);
          setLoading(false); // Stop loading to show the "unauthorized" state below
        } else {
          setLoading(false);
        }
      } else {
        router.push("/login");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, requireAdmin]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050508" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(37,99,235,0.1)", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Final validation before rendering
  if (!user) return null;
  
  if (requireAdmin && !isAdmin) {
    return (
      <div style={{ 
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
        background: "#050508", color: "#fff", padding: "2rem", textAlign: "center" 
      }}>
        <div style={{ padding: "2rem", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: "1.5rem", maxWidth: "400px" }}>
          <h2 style={{ color: "#f87171", marginBottom: "1rem", fontFamily: "'Space Grotesk', sans-serif" }}>Access Denied</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Your account <strong>{user.email || " (No Email)"}</strong> is not authorized to access the Admin Dashboard.
          </p>
          <button onClick={() => router.push("/")} className="btn-secondary" style={{ width: "100%" }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
