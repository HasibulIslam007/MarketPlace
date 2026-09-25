"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHead } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Banner } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      login(data.token, data.user);
      toast.success("Welcome back", `Signed in as ${data.user?.name ?? email}.`);

      const requestedPath = new URLSearchParams(window.location.search).get("redirect");
      const redirectPath =
        requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//")
          ? requestedPath
          : "/";

      router.push(redirectPath);
    } catch {
      setError("We could not sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="z-auth">
      <div className="z-auth-card">
        <Card>
          <CardHead title="Welcome back" subtitle="Sign in to continue shopping with ZMart." />
          <CardBody>
            <form className="z-form-grid" onSubmit={handleSubmit}>
              <Field label="Email address" htmlFor="email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>

              <Field label="Password" htmlFor="password" required>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>

              {error ? <Banner tone="danger">{error}</Banner> : null}

              <Button type="submit" size="lg" block loading={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="z-auth-foot">
              New to ZMart?{" "}
              <Link href="/signup" className="z-link">
                Create an account
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
