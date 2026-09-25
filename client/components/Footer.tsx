"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Formal Shoes", href: "/products?category=formal-shoes" },
  { label: "Slip-ons", href: "/products?category=slip-ons" },
  { label: "Kids' Shoes", href: "/products?category=kids-shoes" },
  { label: "Outdoor", href: "/products?category=outdoor" },
];

const helpLinks = [
  { label: "Shopping Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Sign In", href: "/login" },
  { label: "Create Account", href: "/signup" },
  { label: "Order Status", href: "/order-confirmation" },
];

const aboutLinks = [
  { label: "New Arrivals", href: "/products" },
  { label: "Sale", href: "/products" },
  { label: "Our Story", href: "/" },
  { label: "Account", href: "/login" },
];

function SocialIcon({ type }: { type: "instagram" | "facebook" | "x" | "youtube" | "tiktok" }) {
  if (type === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
  }

  if (type === "facebook") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 20v-7h2.5l.5-3H14V8.2c0-.9.3-1.5 1.6-1.5H17V4a14 14 0 0 0-2-.2c-2.3 0-3.8 1.4-3.8 4v2.2H9v3h2.2v7" /></svg>;
  }

  if (type === "x") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>;
  }

  if (type === "youtube") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 7.4a2.5 2.5 0 0 0-1.8-1.8C16.8 5.2 12 5.2 12 5.2s-4.8 0-6.4.4a2.5 2.5 0 0 0-1.8 1.8C3.4 9 3.4 12 3.4 12s0 3 .4 4.6a2.5 2.5 0 0 0 1.8 1.8c1.6.4 6.4.4 6.4.4s4.8 0 6.4-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.6.4-4.6s0-3-.4-4.6Z" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4v10.2a3.8 3.8 0 1 1-2.7-3.6V7.3c2 .9 3.9 1.2 5.7 1.1v2.7c-1.1 0-2.1-.2-3-.5v4.2a6.5 6.5 0 1 1-2.7-5.2V4Z" /></svg>;
}

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <footer className="site-footer">
      <section className="footer-newsletter" aria-labelledby="newsletter-heading">
        <div>
          <h2 id="newsletter-heading">Join the ZMart Club</h2>
          <p>Get 20% off your first order, plus free shipping on orders over $75.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="footer-email">Email address</label>
          <input
            id="footer-email"
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setSubmitted(false); }}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Subscribe</button>
          {submitted && <span className="newsletter-success" aria-live="polite">Thanks for joining!</span>}
        </form>
      </section>

      <div className="footer-main">
        <div className="footer-brand-column">
          <Link href="/" className="footer-brand" aria-label="ZMart home">
            <span className="footer-brand-mark">ϟ</span>
            <span>ZMart</span>
          </Link>
          <p>Premium footwear for every step of your journey. From athletic performance to everyday comfort.</p>
          <div className="footer-socials" aria-label="ZMart social channels">
            <span className="footer-social-icon" role="img" aria-label="Instagram"><SocialIcon type="instagram" /></span>
            <span className="footer-social-icon" role="img" aria-label="Facebook"><SocialIcon type="facebook" /></span>
            <span className="footer-social-icon" role="img" aria-label="X"><SocialIcon type="x" /></span>
            <span className="footer-social-icon" role="img" aria-label="YouTube"><SocialIcon type="youtube" /></span>
            <span className="footer-social-icon" role="img" aria-label="TikTok"><SocialIcon type="tiktok" /></span>
          </div>
        </div>

        <LinkColumn title="Shop" links={shopLinks} />
        <LinkColumn title="Help" links={helpLinks} />
        <LinkColumn title="About" links={aboutLinks} />
      </div>

      <div className="footer-bottom">
        <p>© 2026 ZMart. All rights reserved.</p>
        <div className="footer-legal" aria-label="Legal information">
          <span>Privacy</span>
          <span>Terms</span>
          <div className="payment-methods" aria-label="Accepted payment methods">
            <span className="payment-visa">VISA</span>
            <span className="payment-mastercard"><i /><i /></span>
            <span className="payment-amex">AMEX</span>
            <span className="payment-pay">Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}