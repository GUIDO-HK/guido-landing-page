# GUIDO landing page

This static site introduces the GUIDO smart navigation cane and companion app.

## Preview locally

From this directory, run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. The site can be served from a static host or a GitHub Pages repository subpath. No build step is required.

## Update the team

In `index.html`, copy a team card in the `#team` section. Update the name, major, role and short bio as available, and place the portrait in `assets/`.

The product concepts and portraits are from the GUIDO pitch deck. The award photos are from Orbis Hong Kong and the HKU Innovation Academy. Bootstrap 5.3.8 provides the grid, cards and button primitives.

## Update the route guide

The site serves the compiled Rail TOC directly. If you edit the guide’s section labels in `route-rail/main.tsx` or update its React component, run `npm ci` and `npm run build` from `route-rail/`.

The guide uses [Rail TOC by Rare UI](https://www.rareui.com/components/railtoc). Its license is included in `route-rail/`.
