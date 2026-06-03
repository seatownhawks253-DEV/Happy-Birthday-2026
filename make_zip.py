#!/usr/bin/env python3
"""Create a zip you can upload to Netlify Drop, Tiiny Host, etc."""

import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "happybirthday-site.zip"
FILES = ("index.html", "styles.css", "app.js", "netlify.toml", ".nojekyll")


def main() -> None:
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in FILES:
            path = ROOT / name
            if path.exists():
                zf.write(path, arcname=name)
    print(f"Created {OUT}")
    print("Upload this zip or drag the HappyBirthday folder to https://app.netlify.com/drop")


if __name__ == "__main__":
    main()
