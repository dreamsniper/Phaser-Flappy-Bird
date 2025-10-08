# Phaser-Flappy-Bird
A Flappy Bird Clone created using the Phaser Game engine

Run locally:

```bash
# Recommended: start a static server and open http://localhost:8000
npm start  # runs `npx http-server -p 8000`
```

Notes:
- Levels are centralized in `data/levels.js` — update that file when adding or changing levels.
- A simple `GameOverScene` exists at `scenes/GameOverScene.js`; gameplay now goes there on death.
