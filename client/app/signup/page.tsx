"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHead } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Banner } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Something went wrong");
        return;
      }

      toast.success("Account created", "Sign in with your new credentials to continue.");
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        `We could not reach the server at ${API_URL}. Check NEXT_PUBLIC_API_URL and CORS (CLIENT_URL), then try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="z-auth">
      <div className="z-auth-card">
        <Card>
          <CardHead title="Create your account" subtitle="Join ZMart to check out faster and track orders." />
          <CardBody>
            <form className="z-form-grid" onSubmit={handleSubmit}>
              <Field label="Full name" htmlFor="name" required>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>

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

              <Field label="Password" htmlFor="password" hint="Use at least 8 characters." required>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </Field>

              {error ? <Banner tone="danger">{error}</Banner> : null}

              <Button type="submit" size="lg" block loading={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="z-auth-foot">
              Already have an account?{" "}
              <Link href="/login" className="z-link">
                Sign in
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
