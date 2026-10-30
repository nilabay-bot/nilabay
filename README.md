# nilabay

The public website for [nilabay](https://nilabay.com): practical engineering, connected systems, and better ways for small businesses to work.

## Site files

- `index.html` — homepage.
- `services.html` — services and how engagements work.
- `founders.html` — About page and the nilabay story (existing URL retained).
- `css/marketing.css` — shared layout, navigation, typography, and footer.
- `css/banners.css` — shared headline-only banners and wonder gradient.
- `css/booking.css` and `js/booking.js` — in-site booking dialog and new-tab fallback.
- `js/navigation.js` — mobile navigation.
- `images/nilabay-*.svg` — brand assets.
- `CNAME`, `robots.txt`, and `sitemap.xml` — domain and search configuration.

## Local preview

This is a static HTML/CSS/JavaScript site with no build or dependency-install step. Serve the repository root with a static web server, such as `python -m http.server 8000`, then open `http://localhost:8000`.

Use a web server rather than opening HTML files directly: shared assets use paths relative to the site root.

## Deployment

Changes go through a pull request into `main`. GitHub Pages publishes the site at `nilabay.com`; check the Pages deployment result after merging. Preserve `CNAME` and the existing domain configuration.

Before merging, review the changed pages on desktop and phone, check local links and navigation, and verify booking opens correctly. The booking dialog loads the public Google Calendar schedule on demand; the fallback opens the same booking destination in a new tab. No booking API credentials are stored in this repository.

## Public repository

Keep this repository limited to the website and its required assets. Do not commit credentials, customer information, internal prototypes, local exports, or backup archives. Development branches should be removed after their work is merged or explicitly retired.

Legacy studio, time-tracker, and preview assets have been retired from the published tree. Git history is retained.
