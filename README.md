# fitrim1411.github.io

Personal portfolio — single-file static site, no build step.

**Live:** https://fitrim1411.github.io

## Cara edit

Semua konten ada di object `CONFIG` di bagian atas `<script>` dalam `index.html`.
Edit → save → refresh browser.

- **Foto carousel** → taruh file foto di root repo, tulis namanya di `photos: []`
- **CV** → taruh PDF di root, ganti `resumeFile: "..."` sesuai nama file
- **Screenshot project** → isi `image: "nama-file.png"` di tiap project

## Deploy

Push ke `main` — GitHub Pages otomatis publish dalam ~1 menit.

```
git add -A && git commit -m "update" && git push
```
