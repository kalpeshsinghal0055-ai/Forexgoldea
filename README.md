# ForexGoldEA — Free XAUUSD Gold Trading EA for MT4 & MT5

**Live site: [https://forexgoldea.com](https://forexgoldea.com/)**

ForexGoldEA is an automated gold (XAU/USD) expert advisor for MetaTrader 4 & 5 with rules-based entries, a fixed stop-loss and take-profit on every trade, and user-controlled risk limits — no martingale, no grid without stops. The EA is free for traders who open an account through our partner broker. Built by BBFxAi LLC.

## Gold trading & EA guides

Educational guides published on the site:

- [How much money do you need to run a gold EA? ($100 vs $500 vs $1,000)](https://forexgoldea.com/how-much-money-to-run-gold-ea.html)
- [Best XAUUSD EA in 2026: our top gold trading robot pick](https://forexgoldea.com/best-xauusd-ea-2026.html)
- [Best prop firms for gold (XAUUSD) traders](https://forexgoldea.com/best-prop-firms-gold-xauusd-ea.html)
- [How ForexGoldEA trades XAU/USD: the strategy explained](https://forexgoldea.com/gold-ea-strategy.html)
- [What is an EA (expert advisor) and how does it work?](https://forexgoldea.com/what-is-an-ea-how-it-works.html)
- [What is a martingale grid EA? Pros, cons and risks](https://forexgoldea.com/what-is-martingale-grid-ea-pros-cons.html)
- [What moves XAUUSD? Key drivers of the gold price](https://forexgoldea.com/what-moves-xauusd-gold-price-drivers.html)
- [Best time to trade XAUUSD: gold sessions explained](https://forexgoldea.com/best-time-to-trade-xauusd-gold-sessions.html)
- [XAUUSD vs EUR/USD: which should a gold EA trade?](https://forexgoldea.com/xauusd-vs-eurusd-gold-ea.html)
- [How to set up a XAUUSD EA on MetaTrader 5](https://forexgoldea.com/xauusd-ea-mt5-setup.html)
- [How to install a gold EA on MT4 & MT5 in 5 minutes](https://forexgoldea.com/install-ea-mt4-mt5.html)
- [All guides →](https://forexgoldea.com/blog.html)

## Repo structure

Static HTML site deployed on GitHub Pages (custom domain via `CNAME`).

- `index.html` — homepage
- `blog.html` — blog listing (static, crawlable)
- `*.html` — individual guides and legal pages (`privacy-policy`, `terms`, `risk-disclaimer`, `404`)
- `posts.json` — post metadata
- `sitemap.xml`, `robots.txt`, `llms.txt` — crawl/discovery files
- `og-image.jpg` — 1200×630 social share image

## Publishing workflow

1. Write the article as a standalone `*.html` page (BlogPosting + FAQPage + BreadcrumbList JSON-LD, OG/Twitter tags, canonical).
2. Add a card to `blog.html`, an entry to `posts.json` and `sitemap.xml`.
3. Cross-link the article from 2–3 related guides ("Related guides" section).
4. Push to `main` — GitHub Pages deploys automatically.
5. Ping IndexNow with the new/updated URLs.

## Contact

- Telegram: [t.me/BBFx_Ai](https://t.me/BBFx_Ai) · Community: [t.me/BBFxAi_Community](https://t.me/BBFxAi_Community)

## Disclaimer

Nothing here is financial advice. Trading gold (XAU/USD) and CFDs on margin carries a high risk of loss — you can lose some or all of your invested capital. Past or backtested performance does not guarantee future results. Affiliate links may earn a commission at no extra cost to you.
