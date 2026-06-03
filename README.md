# Happy Birthday — DJ Party

A single-page birthday party website with club lights, DJ booth animations, confetti, and a sung **Happy Birthday** track (Web Audio melody + browser speech synthesis).

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
cd HappyBirthday
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Features

- Enter a name for personalized lyrics
- **Drop the Birthday Track** — spins vinyl, animates the EQ, plays the melody, and sings each line karaoke-style
- **Confetti Blast** — extra celebration
- **Sound On/Off** — mute toggle

Best experience: desktop Chrome or Safari with volume up. Speech uses your system’s built-in voices.

## Put it online (share a link)

See **[DEPLOY.md](DEPLOY.md)**. Quickest path:

1. Run `python3 make_zip.py` (or use the folder as-is).
2. Open [Netlify Drop](https://app.netlify.com/drop) and drag the folder or zip.
3. Share the `*.netlify.app` URL with anyone.
