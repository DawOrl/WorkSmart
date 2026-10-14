"""WorkSmart signature render: "Dopasowanie" (the fit).

A plaster block with a carved requirement profile (slots of different depth,
like a bar chart of what an offer asks for) and a pine-green key piece whose
teeth are the exact inverse, hovering just above it. It is the product idea in
one object: your profile against the offer's profile.

Fully procedural, no external assets. Run headless:

  blender --background --factory-startup --python-exit-code 1 \
    --python scripts/blender/dopasowanie.py -- --out /path/out.png [--preview] [--variant hero|fitted]

--preview renders at half resolution with fewer samples.
--variant fitted lowers the key into the block (used on the sign-in screen).
"""

import math
import sys

import bmesh
import bpy
from mathutils import Vector

# ---------------------------------------------------------------- arguments
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def arg(name, default=None):
    if name in argv:
        i = argv.index(name)
        if i + 1 < len(argv) and not argv[i + 1].startswith("--"):
            return argv[i + 1]
        return True
    return default


OUT = arg("--out", "//dopasowanie.png")
PREVIEW = bool(arg("--preview", False))
VARIANT = arg("--variant", "hero")

# ---------------------------------------------------------------- palette
# Linear-ish values tuned by eye under AgX to land near the site tokens:
# plaster ~ #E6E0D3, pine ~ #1E5B47.
PLASTER = (0.77, 0.71, 0.60, 1.0)
PINE = (0.016, 0.105, 0.068, 1.0)

# ---------------------------------------------------------------- geometry
W = 3.2          # block width (x)
D = 1.25         # block depth (y)
H = 1.05         # block height (z)
SLOT_W = 0.30    # slot width
CLEAR = 0.025    # clearance between tooth and slot wall
DEPTHS = [0.62, 0.30, 0.78, 0.46, 0.66, 0.24]  # the "requirement profile"
BAR_H = 0.34     # key bar thickness


def slot_centers():
    n = len(DEPTHS)
    margin = 0.34
    span = W - 2 * margin - SLOT_W
    return [-W / 2 + margin + SLOT_W / 2 + span * i / (n - 1) for i in range(n)]


def extrude_profile(name, pts, depth):
    """pts: list of (x, z) in order (counter-clockwise seen from -Y)."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    verts = [bm.verts.new((x, -depth / 2, z)) for x, z in pts]
    face = bm.faces.new(verts)
    bmesh.ops.recalc_face_normals(bm, faces=[face])
    res = bmesh.ops.extrude_face_region(bm, geom=[face])
    new_verts = [g for g in res["geom"] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=new_verts, vec=Vector((0, depth, 0)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def soften(obj, width=0.03, segments=4):
    bev = obj.modifiers.new("Bevel", "BEVEL")
    bev.width = width
    bev.segments = segments
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(40)
    bev.harden_normals = True
    for poly in obj.data.polygons:
        poly.use_smooth = True


def base_profile():
    centers = slot_centers()
    pts = [(-W / 2, 0.0), (W / 2, 0.0), (W / 2, H)]
    for c, d in reversed(list(zip(centers, DEPTHS))):
        xr, xl = c + SLOT_W / 2, c - SLOT_W / 2
        pts += [(xr, H), (xr, H - d), (xl, H - d), (xl, H)]
    pts.append((-W / 2, H))
    return pts


def key_profile(bottom):
    """Bar sits on top, teeth hang down to `bottom`."""
    centers = slot_centers()
    deepest = max(DEPTHS)
    bar_bottom = bottom + deepest - 0.02
    top = bar_bottom + BAR_H
    pts = [(-W / 2, top), (-W / 2, bar_bottom)]
    for c, d in zip(centers, DEPTHS):
        tw = SLOT_W / 2 - CLEAR
        tooth_len = d - 0.02
        pts += [(c - tw, bar_bottom), (c - tw, bar_bottom - tooth_len),
                (c + tw, bar_bottom - tooth_len), (c + tw, bar_bottom)]
    pts += [(W / 2, bar_bottom), (W / 2, top)]
    return pts


# ---------------------------------------------------------------- scene
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, color, rough, coat=0.0, bump=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = rough
    if coat:
        bsdf.inputs["Coat Weight"].default_value = coat
        bsdf.inputs["Coat Roughness"].default_value = 0.35
    if bump:
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 60.0
        noise.inputs["Detail"].default_value = 8.0
        bmp = nt.nodes.new("ShaderNodeBump")
        bmp.inputs["Strength"].default_value = bump
        bmp.inputs["Distance"].default_value = 0.02
        nt.links.new(noise.outputs["Fac"], bmp.inputs["Height"])
        nt.links.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def area_light(name, loc, target, size, energy, color=(1, 1, 1)):
    data = bpy.data.lights.new(name, "AREA")
    data.size = size
    data.energy = energy
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    direction = Vector(target) - Vector(loc)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj


def build():
    reset()
    scene = bpy.context.scene

    plaster = material("Plaster", PLASTER, 0.86, bump=0.04)
    pine = material("Pine", PINE, 0.68)

    base = extrude_profile("Block", base_profile(), D)
    soften(base, 0.035)
    base.data.materials.append(plaster)

    # Hero: the deepest tooth hovers just above the block, every tooth over its slot.
    # Fitted: the bar rests on the block top, teeth seated in their slots.
    deepest = max(DEPTHS)
    tip = H + 0.32 if VARIANT == "hero" else H - deepest + 0.02
    key = extrude_profile("Key", key_profile(tip), D)
    soften(key, 0.03)
    key.data.materials.append(pine)

    # Shadow catcher floor.
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.name = "Floor"
    floor.is_shadow_catcher = True

    # World: warm paper ambience, low.
    world = bpy.data.worlds.new("Paper")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.86, 0.83, 0.77, 1.0)
    bg.inputs["Strength"].default_value = 0.32
    scene.world = world

    # Lights: soft key from upper left, fill right, rim from behind.
    area_light("Key", (-5.0, -4.2, 6.2), (0, 0, 0.8), 4.0, 760)
    area_light("Fill", (6.0, -3.5, 2.6), (0, 0, 0.8), 6.0, 170, (1.0, 0.97, 0.92))
    area_light("Rim", (1.5, 6.0, 4.5), (0, 0, 1.0), 3.0, 520)

    # Camera: three-quarter view, long lens for a calm, compressed perspective.
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 78
    cam = bpy.data.objects.new("Camera", cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = (-6.6, -9.8, 4.7)
    target = Vector((0.05, 0.0, 1.38 if VARIANT == "hero" else 0.72))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam

    # Render settings.
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    try:
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for dev in prefs.devices:
            dev.use = True
        scene.cycles.device = "GPU"
    except Exception as exc:  # CPU fallback keeps the script reproducible anywhere
        print("[dopasowanie] GPU unavailable, using CPU:", exc)
        scene.cycles.device = "CPU"

    scene.cycles.samples = 40 if PREVIEW else 128
    scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1400
    scene.render.resolution_percentage = 50 if PREVIEW else 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "AgX"
    scene.render.filepath = OUT


build()
bpy.ops.render.render(write_still=True)
print("[dopasowanie] wrote", OUT)
