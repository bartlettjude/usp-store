# Global Navigation & Footer — unionstagepresents.com

Reference for recreating the **site-wide top navigation and footer**. These appear on every page (Webflow symbols). Global design tokens (colors/fonts) are documented separately.

> Source: `/Users/judebartlett/usp-store/homepage.html`.

---

## 1. Top navigation

Container: `<div role="banner" class="main-nav-container w-nav">` — a Webflow nav with `data-collapse="medium"` (collapses to hamburger at the "medium" breakpoint, ~tablet & below) and `data-duration="400"` ease animation. Inner wrapper `.main-nav`.

### 1a. Layout (left → right, desktop)

```
[ logo ]                          [ About  Contact  Private Events  Careers  FAQ ]  [ social icons ]  [ ☰ ]
─────────────────────────────────────────────────────────────────────────────────────────────────────────
[ Union Stage ][ Jammin Java ][ Pearl Street ][ The Howard ][ Miracle Theatre ][ Capital Turnaround ][ Nationals Park ]   ← venue sub-nav strip
```

The primary menu links, venue sub-nav (mobile copy), and social icons all live inside `.right-top-nav-container` > `nav.uui-navbar07_menu`. A second, **desktop** copy of the venue sub-nav (`.main-sub-nav`, not `.mobile-sub-nav`) sits below the nav bar.

### 1b. Skip link & logo

```html
<a href="#main-content" class="skip-link">Skip to Main Content</a>
<a href="/" aria-label="Home" aria-current="page" class="uui-navbar07_logo-link w-nav-brand">
  <img alt="Union Stage Presents Logo"
       src="...USP_logo_white.webp" loading="eager" class="uui-logo_image">
</a>
```

- Accessibility skip link: **"Skip to Main Content"** → `#main-content`.
- Logo: white WebP wordmark (`USP_logo_white.webp`), links to `/`, eager-loaded.

### 1c. Primary menu links (`.uui-navbar07_menu-left`)

No dropdowns — all flat links.

| Label | Href |
|-------|------|
| `About` | `/about` |
| `Contact` | `/contact` |
| `Private Events` | `/private-events` |
| `Careers` | `/careers` |
| `FAQ` | `/faqs` |

### 1d. Venue sub-nav (colored pills)

The venue links act as the site's CTA row. Each is `a.venue-link.<code>-bg.full-opacity` and carries that venue's brand color background.

| Label | Href | BG class |
|-------|------|----------|
| `Union Stage` | `/union-stage/shows` | `us-bg` |
| `Jammin Java` | `/jammin-java/shows` | `jj-bg` |
| `Pearl Street` | `/pearl-street/shows` | `ps-bg` |
| `The Howard` | `/the-howard/shows` | `th-bg` |
| `Miracle Theatre` | `/miracle-theatre/shows` | `mt-bg` |
| `Capital Turnaround` | `/capital-turnaround/shows` | `ct-bg` |
| `Nationals Park` | `/nationals-park/shows` | `np-bg` |

This row exists **twice** in markup:
- `.main-sub-nav` (desktop, below the bar)
- `.main-sub-nav.mobile-sub-nav` inside `.sub-nav-mobile-container` (revealed in the open mobile menu).

### 1e. Header social icons (`.header-social-list`)

A Webflow CMS Collection List of social links (`.uui-footer02_social-link`). On the homepage header the rendered set is:

| Icon | Href | Notes |
|------|------|-------|
| Instagram | `https://www.instagram.com/unionstagepresents` | `target="_blank"` |
| Email / envelope | `#wf-form-Newsletter-Form` | Jumps to footer newsletter form |
| Spotify | `#` | `.hide-social-link` (hidden) |
| YouTube | `#` | `.hide-social-link` (hidden) |
| TikTok | `#` | `.w-condition-invisible` (hidden) |

Only Instagram + Email show; the rest are CMS placeholders hidden via classes.

### 1f. Hamburger / mobile behavior

```html
<div class="uui-navbar07_menu-button w-nav-button">
  <div class="menu-icon_component">
    <div class="menu-icon_line-top"></div>
    <div class="menu-icon_line-middle"><div class="menu-icon_line-middle-inner"></div></div>
    <div class="menu-icon_line-bottom"></div>
  </div>
</div>
```

- Custom **3-line hamburger** (`.menu-icon_component`) that animates between bars and an X via the inner-line elements.
- Standard Webflow nav (`w-nav`) collapse at `data-collapse="medium"`; tapping the button opens `nav.w-nav-menu`, which on mobile contains the primary links plus the **mobile venue sub-nav** (`.sub-nav-mobile-container`) and social icons.
- Open/close animation duration 400ms, ease.

### 1g. Sticky behavior

- After the nav, an empty spacer `<div id="top" class="top-nav-space">` provides the top scroll anchor. The nav itself is a Webflow `w-nav` banner; positioning/stickiness is driven by the (separately documented) CSS — visually it sits fixed/over the hero (logo is white to read over the hero image).
- A floating **scroll-to-top button** (`.jump-link`, MEMBERSCRIPT #114) appears once `pageYOffset > 300` and smooth-scrolls to top; otherwise hidden (`opacity/visibility` toggled).

---

## 2. Footer

Container: `<footer class="uui-footer02_component">` (Webflow UI-Kit "footer02"). Dark background, white logo. Structure: logo+social row → top wrapper (venue directory + newsletter) → bottom wrapper (legal + attribution).

### 2a. Logo + social row (`.footer-logo-container`)

- **Logo:** same white WebP wordmark, links to `/` (`alt="Lulu's Logo"` — leftover alt text).
- **Social list** (`.header-social-list`, same CMS list as header): Instagram (`https://www.instagram.com/unionstagepresents`), Email (`#wf-form-Newsletter-Form`), plus hidden Spotify (`http://spotify.com`), YouTube (`http://youtube.com`), TikTok (invisible).

### 2b. Venue directory (`.footer-venue-directory` → `.venue-directory-grid`)

A grid of **6 venue blocks** (Nationals Park is omitted here). Each `.venue-info-container` has: a linked venue title, address, and that venue's own social icons.

| Venue (link → shows) | Address | Per-venue socials |
|----------------------|---------|-------------------|
| `Union Stage` → `/union-stage/shows` | 740 Water Street SW, Washington, DC 20024 | IG `unionstagepresents` · FB `/unionstage` · Spotify `user/unionstage` |
| `Jammin Java` → `/jammin-java/shows` | 227 Maple Ave E, Vienna, VA 22180 | IG `jamminjava` · FB `/jamminjava` |
| `The Howard` → `/the-howard/shows` | 620 T Street NW, Washington, DC 20001 | IG `howardtheatre` · FB `/HowardTheatre` |
| `MIRACLE THEATRE` → `/miracle-theatre/shows` | 535 8th St SE, Washington, DC 20003 | IG `unionstagepresents` · FB `/unionstage` |
| `CAPITAL TURNAROUND` → `/capital-turnaround/shows` | 770 M St SE, Washington, DC 20003 | IG `unionstagepresents` · FB `/unionstage` |
| `PEARL STREET WAREHOUSE` → `/pearl-street/shows` | 33 Pearl Street SW, Washington, DC 20024 | IG `pearlstreet.dc` · FB `/PearlStreetWarehouse/` |

(Title casing is verbatim — some titles are uppercased in source.) Each title is `.footer-venue-title` inside an `<a class="venue-name-footer">`; address is `.footer-address` (with `<br>`).

### 2c. Newsletter signup (`.uui-footer02_right-wrapper`)

Heading: **"Subscribe to our mailing list"**

```html
<form id="wf-form-Newsletter-Form" method="post"
      action="https://heroku-recaptcha-49b596afbb76.herokuapp.com/union-stage-recaptcha"
      class="uui-footer02_form">
```

| Field | Type | Placeholder / label |
|-------|------|---------------------|
| Email | `input[type=email name="fan[email]"]` (required) | label `Email`, placeholder `Enter an email...` |
| Phone Number | `input[type=tel name="fan[phone_number]"]` (required) | label `Phone Number`, placeholder `Enter a phone number...`; JS strips non-digits, max 10 |
| SMS consent | checkbox `SMS-Agreement` (required) | long opt-in text (see below) |
| Terms consent | checkbox (required) | links to Terms / Privacy |
| Submit | `input[type=submit]` `.uui-button-secondary` | value **`Subscribe`** |

SMS consent copy (verbatim):
```
I agree to receive text messages from Union Stage Presents related to events I attend, including event
reminders, schedule updates, and venue information (such as parking, entry instructions, or delays).
These messages are informational and not promotional. Message frequency varies. Msg & data rates may
apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.
```

Terms consent copy:
```
I accept the Terms of Service and Privacy Policy
```
links → `https://www.unionstagepresents.com/terms` (Terms of Service), `https://www.unionstagepresents.com/privacy` (Privacy Policy).

Behavior:
- Submits to a Heroku reCAPTCHA endpoint (`fan[...]` fields = Opendate fan-subscribe API). Hidden inputs carry 7 `fan[venue_ids][]`, `fan[subscribe_to_marketing]=true`, `fan[tags][]=website`, reCAPTCHA `request` key, and `redirect_url=thanks`.
- On submit, JS prevents default and redirects to `/thanks` (with or without captcha).
- A hidden reCAPTCHA (`#hidden-captcha`) reveals itself once the email field receives input.
- Success message: **"Thank you! Your submission has been received!"** Error: **"Oops! Something went wrong while submitting the form."**

### 2d. Bottom bar (`.uui-footer02_bottom-wrapper`)

| Element | Content |
|---------|---------|
| Copyright | `© <current year>, Union Stage Presents` (year via `new Date().getFullYear()`) |
| Legal links | `Privacy` → `/privacy` · `Accessibility` → `/accessibility` |
| Attribution | `Powered by Opendate` → `http://www.opendate.io` (`target="_blank"`) |

---

## 3. Social handle reference (all unique links found)

| Network | URL |
|---------|-----|
| Instagram (brand) | https://www.instagram.com/unionstagepresents |
| Instagram (Jammin Java) | https://instagram.com/jamminjava |
| Instagram (Howard) | https://instagram.com/howardtheatre |
| Instagram (Pearl Street) | https://www.instagram.com/pearlstreet.dc |
| Facebook (Union Stage) | http://facebook.com/unionstage |
| Facebook (Jammin Java) | http://facebook.com/jamminjava |
| Facebook (Howard) | http://facebook.com/HowardTheatre |
| Facebook (Pearl Street) | https://www.facebook.com/PearlStreetWarehouse/ |
| Spotify (Union Stage) | https://open.spotify.com/user/unionstage |
| Email (jump) | #wf-form-Newsletter-Form |

---

## 4. Exact link-label list (quote-ready)

```
Primary nav:  About · Contact · Private Events · Careers · FAQ
Venue pills:  Union Stage · Jammin Java · Pearl Street · The Howard · Miracle Theatre · Capital Turnaround · Nationals Park
Skip link:    Skip to Main Content
Footer venues: Union Stage · Jammin Java · The Howard · MIRACLE THEATRE · CAPITAL TURNAROUND · PEARL STREET WAREHOUSE
Newsletter:   Subscribe to our mailing list  /  Subscribe (button)
Legal:        Privacy · Accessibility
Attribution:  Powered by Opendate
Copyright:    © <year>, Union Stage Presents
```
