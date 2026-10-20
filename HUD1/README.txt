SIDEQUEST Terrain Lab

How to open
1. Unzip this folder.
2. Open a terminal in the folder and run:  python3 -m http.server 8000
3. Visit http://localhost:8000 in Chrome.

Opening index.html by double-clicking will not work: the browser blocks
the page from loading the terrain files from disk. It needs the small
local server above. An internet connection is also needed once, to load
three.js and the 3D Tiles renderer from cdn.jsdelivr.net.

Data: Curiosity "Dingo Gap" contextual mesh, NASA-AMMOS 3DTilesSampleData
(NASA/JPL-Caltech/MSSS; HiRISE NASA/JPL/UArizona).
