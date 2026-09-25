"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHead } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import Icon, { type IconName } from "@/components/ui/Icon";
import { HomePageSettings } from "@/lib/api";

export interface StorefrontCustomizerProps {
  heroSettings: HomePageSettings;
  setHeroSettings: (settings: HomePageSettings) => void;
  heroImageFile: string;
  setHeroImageFile: (file: string) => void;
  heroImageName: string;
  savingHero: boolean;
  onHeroImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveHero: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function StorefrontQuotesCard({
  heroSettings,
  setHeroSettings,
}: {
  heroSettings: HomePageSettings;
  setHeroSettings: (s: HomePageSettings) => void;
}) {
  return (
    <Card>
      <CardHead
        title="1. Banner Headlines & Quotes"
        subtitle="The main text and badge displayed on the left side of the homepage hero."
      />
      <CardBody>
        <div className="z-form-grid">
          <div className="z-form-grid z-form-grid-2">
            <Field label="Collection badge pill" htmlFor="hero-badge" hint="e.g., New Collection 2032">
              <Input
                id="hero-badge"
                value={heroSettings.heroBadge || ""}
                placeholder="New Collection 2032"
                onChange={(e) => setHeroSettings({ ...heroSettings, heroBadge: e.target.value })}
              />
            </Field>
            <Field label="Main headline (Line 1)" htmlFor="hero-title" hint="e.g., Step Into" required>
              <Input
                id="hero-title"
                value={heroSettings.heroTitle || ""}
                placeholder="Step Into"
                required
                onChange={(e) => setHeroSettings({ ...heroSettings, heroTitle: e.target.value })}
              />
            </Field>
          </div>

          <div className="z-form-grid z-form-grid-2">
            <Field label="Highlighted text (Line 2)" htmlFor="hero-title-accent" hint="Accent cyan phrase" required>
              <Input
                id="hero-title-accent"
                value={heroSettings.heroTitleAccent || ""}
                placeholder="Your Best"
                required
                onChange={(e) => setHeroSettings({ ...heroSettings, heroTitleAccent: e.target.value })}
              />
            </Field>
            <Field label="Hero description paragraph" htmlFor="hero-subtitle" hint="Short quote under the headline">
              <Textarea
                id="hero-subtitle"
                rows={2}
                value={heroSettings.heroSubtitle || ""}
                placeholder="Premium footwear for every step of your journey..."
                onChange={(e) => setHeroSettings({ ...heroSettings, heroSubtitle: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function StorefrontBoxesCard({
  heroSettings,
  setHeroSettings,
}: {
  heroSettings: HomePageSettings;
  setHeroSettings: (s: HomePageSettings) => void;
}) {
  return (
    <Card>
      <CardHead
        title="2. Floating Promotional Boxes (3 Boxes on Image)"
        subtitle="Configure the 3 promotional highlight badges overlaid on the hero image."
      />
      <CardBody>
        <div className="z-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* Box 1 */}
          <div className="card" style={{ padding: "16px", border: "1px solid var(--z-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Badge tone="brand">Box 1</Badge>
              <strong style={{ fontSize: "0.95rem" }}>Round Discount Badge</strong>
            </div>

            <div className="z-form-grid">
              <Field label="Top prefix" htmlFor="discount-top" hint="e.g., UP TO">
                <Input
                  id="discount-top"
                  value={heroSettings.discountTop || ""}
                  placeholder="UP TO"
                  onChange={(e) => setHeroSettings({ ...heroSettings, discountTop: e.target.value })}
                />
              </Field>
              <Field label="Main discount" htmlFor="discount-val" hint="e.g., 40%">
                <Input
                  id="discount-val"
                  value={heroSettings.discountValue || ""}
                  placeholder="40%"
                  onChange={(e) => setHeroSettings({ ...heroSettings, discountValue: e.target.value })}
                />
              </Field>
              <Field label="Bottom suffix" htmlFor="discount-bottom" hint="e.g., OFF">
                <Input
                  id="discount-bottom"
                  value={heroSettings.discountBottom || ""}
                  placeholder="OFF"
                  onChange={(e) => setHeroSettings({ ...heroSettings, discountBottom: e.target.value })}
                />
              </Field>

              <div style={{ padding: "12px", background: "var(--z-bg)", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--z-text-muted)" }}>Live Preview:</span>
                <div style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#00e5ff", color: "#050b14",
                  margin: "8px auto 0",
                  fontWeight: 800
                }}>
                  <small style={{ fontSize: "9px" }}>{heroSettings.discountTop || "UP TO"}</small>
                  <strong style={{ fontSize: "18px", lineHeight: 1 }}>{heroSettings.discountValue || "40%"}</strong>
                  <small style={{ fontSize: "9px" }}>{heroSettings.discountBottom || "OFF"}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="card" style={{ padding: "16px", border: "1px solid var(--z-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Badge tone="brand">Box 2</Badge>
              <strong style={{ fontSize: "0.95rem" }}>Benefit Box 1 (Left)</strong>
            </div>

            <div className="z-form-grid">
              <Field label="1. Logo / Icon" htmlFor="card1-icon">
                <Select
                  id="card1-icon"
                  value={heroSettings.card1Icon || "truck"}
                  onChange={(e) => setHeroSettings({ ...heroSettings, card1Icon: e.target.value })}
                >
                  <option value="truck">Truck (Shipping)</option>
                  <option value="check">Check Mark</option>
                  <option value="package">Package / Box</option>
                  <option value="shield">Shield (Guarantee)</option>
                  <option value="star">Star</option>
                  <option value="bag">Shopping Bag</option>
                  <option value="sparkles">Sparkles</option>
                </Select>
              </Field>
              <Field label="2. Main title (2-4 words)" htmlFor="card1-title" hint="e.g., Free Shipping">
                <Input
                  id="card1-title"
                  value={heroSettings.card1Title || ""}
                  placeholder="Free Shipping"
                  onChange={(e) => setHeroSettings({ ...heroSettings, card1Title: e.target.value })}
                />
              </Field>
              <Field label="3. Short quote / subtitle" htmlFor="card1-sub" hint="e.g., Orders over $75">
                <Input
                  id="card1-sub"
                  value={heroSettings.card1Subtitle || ""}
                  placeholder="Orders over $75"
                  onChange={(e) => setHeroSettings({ ...heroSettings, card1Subtitle: e.target.value })}
                />
              </Field>

              <div style={{ padding: "12px", background: "var(--z-bg)", borderRadius: "10px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--z-text-muted)" }}>Live Preview:</span>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "8px",
                  padding: "10px 14px",
                  background: "rgba(14, 25, 44, .88)",
                  borderRadius: "12px"
                }}>
                  <span style={{ color: "#00e5ff", display: "grid", placeItems: "center" }}>
                    <Icon name={(heroSettings.card1Icon || "truck") as IconName} size={22} />
                  </span>
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "#fff" }}>
                      {heroSettings.card1Title || "Free Shipping"}
                    </strong>
                    <small style={{ display: "block", fontSize: "12px", color: "#38bdf8" }}>
                      {heroSettings.card1Subtitle || "Orders over $75"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3 */}
          <div className="card" style={{ padding: "16px", border: "1px solid var(--z-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Badge tone="brand">Box 3</Badge>
              <strong style={{ fontSize: "0.95rem" }}>Benefit Box 2 (Right)</strong>
            </div>

            <div className="z-form-grid">
              <Field label="1. Logo / Icon" htmlFor="card2-icon">
                <Select
                  id="card2-icon"
                  value={heroSettings.card2Icon || "refresh"}
                  onChange={(e) => setHeroSettings({ ...heroSettings, card2Icon: e.target.value })}
                >
                  <option value="refresh">Refresh / Return</option>
                  <option value="shield">Shield (Security)</option>
                  <option value="check">Check Mark</option>
                  <option value="heart">Heart</option>
                  <option value="star">Star</option>
                  <option value="truck">Truck</option>
                  <option value="sparkles">Sparkles</option>
                </Select>
              </Field>
              <Field label="2. Main title (2-4 words)" htmlFor="card2-title" hint="e.g., Easy Returns">
                <Input
                  id="card2-title"
                  value={heroSettings.card2Title || ""}
                  placeholder="Easy Returns"
                  onChange={(e) => setHeroSettings({ ...heroSettings, card2Title: e.target.value })}
                />
              </Field>
              <Field label="3. Short quote / subtitle" htmlFor="card2-sub" hint="e.g., 60-day guarantee">
                <Input
                  id="card2-sub"
                  value={heroSettings.card2Subtitle || ""}
                  placeholder="60-day guarantee"
                  onChange={(e) => setHeroSettings({ ...heroSettings, card2Subtitle: e.target.value })}
                />
              </Field>

              <div style={{ padding: "12px", background: "var(--z-bg)", borderRadius: "10px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--z-text-muted)" }}>Live Preview:</span>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "8px",
                  padding: "10px 14px",
                  background: "rgba(14, 25, 44, .88)",
                  borderRadius: "12px"
                }}>
                  <span style={{ color: "#00e5ff", display: "grid", placeItems: "center" }}>
                    <Icon name={(heroSettings.card2Icon || "refresh") as IconName} size={22} />
                  </span>
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "#fff" }}>
                      {heroSettings.card2Title || "Easy Returns"}
                    </strong>
                    <small style={{ display: "block", fontSize: "12px", color: "#94a3b8" }}>
                      {heroSettings.card2Subtitle || "60-day guarantee"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function StorefrontCustomizer({
  heroSettings,
  setHeroSettings,
  heroImageFile,
  setHeroImageFile,
  heroImageName,
  savingHero,
  onHeroImageChange,
  onSaveHero,
}: StorefrontCustomizerProps) {
  return (
    <form onSubmit={onSaveHero} className="z-stack">
      <div className="z-toolbar" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Storefront Customizer</h2>
          <p style={{ color: "var(--z-text-muted)", fontSize: "0.875rem", margin: "4px 0 0" }}>
            Customize the hero banner headlines, promotional boxes, and banner image.
          </p>
        </div>
        <Button type="submit" loading={savingHero} >
          {savingHero ? "Saving changes..." : "Save all storefront changes"}
        </Button>
      </div>

      <StorefrontQuotesCard heroSettings={heroSettings} setHeroSettings={setHeroSettings} />

      <StorefrontBoxesCard heroSettings={heroSettings} setHeroSettings={setHeroSettings} />

      <Card>
        <CardHead
          title="3. Featured Banner Image"
          subtitle="The image shown in the hero visual on the public homepage."
        />
        <CardBody>
          <div className="z-split">
            <div className="z-gallery">
              <div className="z-gallery-main">
                {(heroImageFile || heroSettings.heroImageUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImageFile || heroSettings.heroImageUrl || ""}
                    alt={heroSettings.heroImageAlt}
                  />
                ) : (
                  <div className="z-gallery-fallback" aria-hidden="true">
                    <Icon name="image" size={40} />
                  </div>
                )}
              </div>
            </div>

            <div className="z-form-grid">
              <Field label="Upload image" htmlFor="hero-file" hint="JPG, PNG, WEBP or GIF - max 10 MB.">
                <input
                  id="hero-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={onHeroImageChange}
                  className="input"
                />
              </Field>

              {heroImageName ? <p className="z-hint">Selected: {heroImageName}</p> : null}

              <Field label="Or paste an image URL" htmlFor="hero-url">
                <Input
                  id="hero-url"
                  type="url"
                  placeholder="https://..."
                  value={heroSettings.heroImageUrl || ""}
                  onChange={(event) => {
                    setHeroImageFile("");
                    setHeroSettings({ ...heroSettings, heroImageUrl: event.target.value });
                  }}
                />
              </Field>

              <Field
                label="Image alt text"
                htmlFor="hero-alt"
                hint="Describes the image for screen readers."
                required
              >
                <Input
                  id="hero-alt"
                  value={heroSettings.heroImageAlt}
                  maxLength={160}
                  required
                  onChange={(event) => {
                    setHeroSettings({ ...heroSettings, heroImageAlt: event.target.value });
                  }}
                />
              </Field>
            </div>
          </div>
        </CardBody>
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--z-border)", display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" loading={savingHero} >
            {savingHero ? "Saving changes..." : "Save all storefront changes"}
          </Button>
        </div>
      </Card>
    </form>
  );
}


