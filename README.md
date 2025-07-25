Nexayana – Astrology Web App

This is the frontend UI for **Nexayana**, a modern astrology engine. It calculates zodiac signs, matches kundalis, and lets users connect with top-rated astrology gurus.

📁 Project Structure:

- index.html                → Main landing page
- /assets/
    - /css/                 → All stylesheets (e.g., main.css)
    - /images/              → Zodiac icons, guru photos, UI icons
    - /js/                  → Any static JS dependencies
- /src/
    - /controllers/         → Modules for API interactions, GitHub storage, guru connect
    - /models/              → JS model structure for zodiac, kundali, guru, etc.
    - /views/               → DOM rendering, event-based UI
    - /utils/               → Helper libs: base64 encoder, time calc, converters
- /data/
    - /clients/             → Raw user input (date, place, time)
    - /userkundali/         → Generated kundali JSONs
    - /astrogurus/          → Astro guru data: name, rating, price/min, reviews
    - /zodiaclogic/         → Compatibility charts, trait mapping
    - /systemconfig/        → App-level config flags, versions
- /static/
    - favicon.ico           → Site icon

📦 Usage Notes:

- Keep file paths lowercase and consistent (`assets/css/`, not `assets\css\`)
- Kundali files are stored per-user under `/data/userkundali/`
- Guru info should be managed under `/data/astrogurus/` as JSON files

🌐 Live Deployment:

- You can use [GitHub Pages](https://pages.github.com/) for static hosting
- Recommended folder: `/docs` if deploying from main branch
- Direct link (when published): `https://surajit93.github.io/nexayana/`

📌 Planned Features:

- Zodiac compatibility match
- Daily predictions from JSON data
- Astro guru connect system with rating/review logic
- Chat UI for guru interaction (future scope)

🔧 Maintained by:
Surajit (https://github.com/surajit93)
🚫 License & Usage Restrictions:

All code, assets, and data in this repository are © 2025 Surajit.  
Unauthorized copying, redistribution, or usage of any part of this project is strictly prohibited.

You **must obtain written permission** before using this codebase for any personal, educational, or commercial purpose.

Legal actions will be taken against any violation under applicable copyright laws.
