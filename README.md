# Memory Match (Demo)

A card-flip matching game with three difficulty levels, a timer, a move counter and a saved best score.

## Overview
Classic pairs game: flip two cards, keep them face-up if they match, flip them back if they don't, clear the board in as few moves as possible.

## Live Demo
🔗 Add the link here once this repo is deployed on GitHub Pages
(Settings → Pages → Deploy from branch → main → / (root))

## Features
- **Three difficulties** — Easy (4×4), Medium (4×6), Hard (6×6), each with its own saved best score
- **Timer & move counter** — live while you play
- **Best score per difficulty** — saved in `localStorage`, so switching difficulty shows that mode's own record
- **Smooth flip animation** — a real CSS 3D flip (`rotateY`), not just a swapped image

## Tech Stack
- HTML5, CSS3 (3D transforms), vanilla JavaScript — no framework, no build step
- Data stored in the browser (`localStorage`)

## How It Works — Code Walkthrough
- **Building the deck**: `newGame()` picks `pairsNeeded = totalCards / 2` random symbols from a fixed emoji list, duplicates them, and shuffles the combined list with a **Fisher–Yates shuffle** (`shuffle()`) — the standard unbiased way to randomize an array in place.
- **Flip state**: each card object tracks its own `matched` flag; which cards are currently face-up (but not yet confirmed as a match) lives in a separate `flipped` array of IDs, rather than a property on the card — this keeps "temporarily showing" and "permanently matched" as two clearly different states.
- **Turn logic**: `handleFlip(id)` ignores clicks while `locked` is true (during the brief pause after a wrong guess) or on a card that's already matched or already flipped. Once two cards are flipped, it compares their symbols: a match sets both to `matched` and unlocks immediately; a mismatch waits 700ms (so the player can see both cards) before clearing `flipped` and unlocking.
- **The flip animation**: each tile has a `.card-inner` with `transform-style: preserve-3d` and two absolutely-positioned faces (`.card-back`, `.card-front`) rotated 180° apart with `backface-visibility: hidden`. Adding the `flipped` (or `matched`) class just rotates `.card-inner` by 180° — the CSS `transition` handles the animation, no JavaScript animation code needed.
- **Timer**: starts on the very first flip (`started` flag) via `setInterval`, and stops the moment all pairs are matched (`onWin()`), so idle time before the first move never counts against the player.
- **Best score**: keyed per difficulty (`memorymatch_best_4x4`, `..._4x6`, `..._6x6`) so Easy and Hard don't share a single meaningless "best".

## Run Locally
Just open `index.html` in any modern browser — no server or build step required.

## Notes
- This is an original demo project built for portfolio purposes.
