TypeNest Arcade deployment

Copy the contents of this folder into the TypeNest web root so the structure becomes:
/arcade/index.html
/arcade/css/arcade-core.css
/arcade/js/arcade-audio.js
/arcade/vocab-defender/index.html
/arcade/vocab-defender/game.js
/arcade/vocab-defender/words-data.js
/arcade/space-typer/index.html
/arcade/space-typer/space-engine.js
/arcade/speed-rush/index.html
/arcade/speed-rush/rush-engine.js
/arcade/ghost-racer/index.html
/arcade/ghost-racer/racer-engine.js

All game records are localStorage based. Audio is Web Audio API only. layout.js is loaded from /assets/js/layout.js.
