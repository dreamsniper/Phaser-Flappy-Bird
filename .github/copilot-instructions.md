## Purpose
Short, focused guidance to help an AI coding agent become productive in this Phaser Flappy Bird clone.

## Big picture
- This is a small Phaser 3 game (no build tool). Entry is `index.html` which loads `main.js` as an ES module and pulls Phaser from CDN.
- Scene-based architecture: `StartMenuScene`, `GameScene` (active gameplay), and an unused/empty `GameOverScene.js` file. Scenes are in `scenes/`.
- Assets are under `assets/images/` (backgrounds, `pipe.png`, `bird-spritesheet.png`).

## Key files and roles
- `index.html` — static entry; open in browser or serve from a static server.
- `main.js` — Phaser config and scene registration. Change canvas size, physics settings, or scene order here.
- `scenes/StartMenuScene.js` — shows current level, highscore (reads `localStorage.flappyHighscore`), and starts `GameScene` with a `level` in `scene.start`.
- `scenes/GameScene.js` — core gameplay: loads sprites, spawns pipes with `this.time.addEvent`, handles input (`SPACE`), scoring (score zones), level progression, and writes `localStorage.flappyHighscore`.
- `scenes/GameOverScene.js` — present in the tree but currently empty. Not wired in `main.js` scenes array.

## Project-specific conventions & patterns
- Level data is duplicated: both `StartMenuScene` and `GameScene` define a `levels` array with same shape. If adding levels, update both files and add background images named `background-*.png` and keys like `bg-morning`.
- Background keys follow `bg-<name>` and are loaded in `GameScene.preload`. Level-to-background mapping is index-based using `level - 1`.
- Pipes are created in a physics group (`this.pipes = this.physics.add.group()`); velocity is set via `body.setVelocityX(this.currentLevel.pipeSpeed)` and gravity is disabled on pipes.
- Score detection uses invisible physics `Zone` objects that move with the pipes; when overlapped the zone is destroyed to avoid double scoring.
- Highscore persistence uses `localStorage` key `flappyHighscore` and stores plain integers.

## How to run locally (quick)
1) Easiest: open `index.html` in a modern browser that supports ES modules. For local file access the browser may block module loads; use a static server.
2) Recommended (from project root):
   - Python: `python3 -m http.server 8000`
   - Node (if installed): `npx serve .` or `npx http-server -p 8000`
   Then open `http://localhost:8000`.

## Debugging tips
- Use browser devtools console & Sources to set breakpoints in `scenes/GameScene.js` and `main.js`.
- Watch Phaser's arcade physics values: inspect `this.bird.body.velocity` and `this.pipes` group during runtime.
- To reproduce level progression bugs, set `level` explicitly when starting the `GameScene` in `StartMenuScene` or using `this.scene.start('GameScene', { level: 2 })` in the console.

## Adding content or features — concrete examples
- Add a new level: add an image `assets/images/background-dusk.png`, push a level object into both `levels` arrays in `StartMenuScene.js` and `GameScene.js` (maintain same index), and update `pipeSpeed`/`pointsNeeded` in `GameScene`.
- Change bird animation frames: edit `frameWidth`/`frameHeight` and the spritesheet file path in `GameScene.preload`.
- Replace pipe spawning cadence: modify `delay` in `this.time.addEvent` inside `GameScene.create`.

## Integration points & external dependencies
- Phaser is loaded from CDN in `index.html` (script tag to jsdelivr). No npm dependencies or build step present.
- Persistence is only `localStorage` (key `flappyHighscore`). No external APIs.

## Known issues / housekeeping
- `scenes/GameOverScene.js` exists but is empty — likely safe to remove or implement if you want a dedicated game over flow.
- Level data duplication between StartMenu and GameScene is a maintainability smell; prefer centralizing `levels` into a single module if modifying more than once.

## Suggested lints/automation for contributors
- Small project: add a simple `package.json` with `start` script (`serve` or `http-server`) if you want consistent local-run commands. Not required to edit for small PRs.

## Questions for the human maintainer
- Should `GameOverScene.js` be implemented or removed? If implemented, how should it differ from returning to `StartMenuScene`?
- Do you want `levels` centralized into one module (e.g., `data/levels.js`)?

If anything here looks wrong, unclear, or incomplete, tell me which area to expand and I'll iterate.
