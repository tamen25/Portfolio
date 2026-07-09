# 11 CHISEL — build notes

## Concept (capability showpiece)
Text → image → REAL 3D MESH → interactive chiaroscuro. A veiled-marble bust generated
with soul_2, lifted to a 30,986-triangle GLB via Higgsfield image_to_3d (20 credits,
untextured on purpose — the browser gives it a marble PBR skin), loaded with
GLTFLoader, lit by a SpotLight that rides a dome mapped to the visitor's cursor.
Drag orbits the piece; the veil's drapery survives from every angle.
The placard shows REAL data (triangle count, bounding-box dimensions) and the GLB
is downloadable — "take the marble".

## Type / palette
Italiana (hairline display) + Figtree + Fragment Mono.
Room #0F0F11 · marble #EDEDEA · brass #B98A44 · warm key #FFD9A8 · cool rim #7C90C8.

## Iteration log
- PASS 1: mesh loads, auto-centers/scales via Box3; cursor swings the key light —
  verified two lighting states with opposite shadow directions.
- PASS 2: plinth top caught a blue cast from the rim light → desaturated ambient,
  darkened/roughened plinth, rim .5→.35; marble roughness .42→.5 to calm veil speckle.
- PASS 3: placard fills with live mesh truths (30,986 triangles, 30×52×22 cm);
  loading veil fades once GLTF resolves; graceful failure copy if the GLB ever 404s.
  Mobile: camera distance auto-increases below .9 aspect.
- Credits: ~20.2 (image 0.12 + 3D 20). GLB 0.92MB — shippable.
