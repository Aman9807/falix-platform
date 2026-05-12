"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

// 🔐 THE MASTER ADMIN LIST
// Add your email here to get access to the Admin Dashboard
const ADMIN_EMAILS = [
  "khant@fatima.com", // Example (Update this with your real email!)
  "aman9807@github.com", // Example based on your push
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
        
        // Check if user is in the admin list (Case-Insensitive)
        const lowerCaseAdminEmails = ADMIN_EMAILS.map(email => email.toLowerCase());
        const isUserAdmin = lowerCaseAdminEmails.includes(user.email?.toLowerCase() || "");
        setIsAdmin(isUserAdmin);

        // If this page requires admin but the user isn't one, kick them out
        if (requireAdmin && !isUserAdmin) {
          console.warn("[Security] Unauthorized admin access attempt by:", user.email);
          router.push("/");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
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
  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
