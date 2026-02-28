# Shadow Realm Runner 🏰

A dark fantasy endless runner built with [Phaser 3](https://phaser.io/) — no build step, no external assets, pure procedural graphics.

## Play

Open `index.html` in any modern browser, or visit: `https://<your-username>.github.io/shadow-realm-runner/`

## Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Jump | `SPACE` | Tap |
| Slide | `SHIFT` | Hold / Swipe down |
| Lane Up | `W` / `↑` | Swipe up |
| Lane Down | `S` / `↓` | Swipe down |

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files to `main` branch
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your game will be live at `https://<username>.github.io/<repo-name>/`

## Tech Stack

- **Phaser 3.80** via CDN (no npm install needed)
- All graphics procedurally generated (no image assets)
- Save system via `localStorage`
- Zero dependencies, zero build step
