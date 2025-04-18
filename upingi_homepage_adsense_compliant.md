
# Cursor.ai Instructions: Upingi.com Homepage (AdSense-Compliant)

## 🎯 Objective
Redesign the homepage of **Upingi.com** so it meets **Google AdSense approval requirements**, with a strong focus on **above-the-fold content** (the content visible before scrolling) and original value.

---

## 📁 File
**Target File:** `index.html`

---

## ✅ Above-the-Fold Content Guidelines

### 1. ✨ Hero Section with Real Value (Above the Fold)
Create a prominent **welcome section** at the top of the homepage, before any ads or app listings.

```html
<section class="hero">
  <h1>Welcome to Upingi – Trusted Software Picks</h1>
  <p>
    At Upingi, we handpick high-quality software that helps you get things done—faster and safer.
    From productivity tools to fun games, we focus on what works. All links lead to official downloads—no bloatware, no tricks.
  </p>
</section>
```

- Minimum 100 words of original, user-facing content.
- Avoid generic or duplicate text.
- Explain what Upingi offers and why it’s trustworthy.

### 2. 📰 “From the Blog” Previews (Still Above the Fold)
Right after the hero section (still visible without scrolling on desktop), add blog previews to show that the site is active and informative.

Each preview includes:
- Title (link to full article)
- Short description (2–3 lines)
- Optional: featured image thumbnail

Example:
```html
<section class="blog-preview">
  <h2>From the Blog</h2>
  <article>
    <h3><a href="/blog/why-zoom-is-still-a-top-pick.html">Why Zoom is Still a Top Pick in 2025</a></h3>
    <p>Discover why Zoom continues to lead in remote communication tools—and how to get the most out of it.</p>
  </article>
</section>
```

---

## ⚠️ Ad Placement Rules

### 3. 📛 Clear Ad Labeling
For every ad button (like green "GET" or "Download" buttons), add the label:

```html
<p class="ad-label">Advertisement</p>
```

Style the label in `styles.css`:
```css
.ad-label {
  font-size: 12px;
  color: gray;
  margin-bottom: 4px;
}
```

### 4. 🟩 Slightly Modify Ad Buttons
Avoid deceptive practices. Modify styling of ad buttons slightly so they are not indistinguishable from real links (e.g., add a dotted border, icon, or label).

---

## 🧠 SEO & Metadata (Head Section)

```html
<title>Upingi – Top Free Software Downloads (No Malware)</title>
<meta name="description" content="Find the best free software downloads handpicked by Upingi. Fast, safe, and malware-free.">
```

Also, include JSON-LD structured data to describe the homepage:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Upingi",
  "url": "https://upingi.com",
  "description": "Free software download hub offering trusted productivity tools and games."
}
</script>
```

---

## 🦶 Footer Requirements

Include the following links in the footer:
- About Us
- Privacy Policy
- Terms of Service
- Disclaimer

And add this statement:
```html
<p>This site earns revenue through advertising and affiliate links. We do not host software, only link to official sources.</p>
```

---

## 📱 Mobile Optimization

Ensure all above-the-fold content is legible and navigable on mobile:
- Use readable font sizes (min 16px).
- Tap targets must be at least 48x48px.
- Stack content vertically on smaller screens.

---

## ✅ Summary Prompt for Cursor.ai

```
Revise index.html to improve AdSense eligibility.

1. Add a real welcome message with >100 words above the fold.
2. Include a “From the Blog” section with 3 real previews above the fold.
3. Clearly label all ads with “Advertisement”.
4. Modify ad buttons to avoid deceptive design.
5. Add SEO metadata and JSON-LD.
6. Ensure responsive, readable layout on mobile.
```
