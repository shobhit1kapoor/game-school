#!/usr/bin/env python3
"""Regenerate the 14 scene illustrations as painted PNGs via Gemini.

The site currently ships with handcrafted SVG scene art. This script
replaces it with AI-painted gouache illustrations once you have Gemini
API quota for an image model (the free tier has none for image models).

Usage:
    pip install google-genai
    export GEMINI_API_KEY=...
    python3 build/regenerate-images.py            # all scenes
    python3 build/regenerate-images.py rain ocean # specific scenes

After it finishes, point js/data.js at the PNGs:
    sed -i '' 's/\\.svg"/.png"/' js/data.js

Composition notes in each prompt are load-bearing: hotspot coordinates
in js/data.js assume the named elements sit roughly where the prompt
puts them. If you change a prompt's layout, update the hotspots too.
"""

import os
import sys

STYLE = (
    "Hand-painted naturalist illustration in the style of a national park "
    "interpretive sign, gouache and watercolor, realistic and richly detailed, "
    "gentle storybook warmth, full-bleed landscape. {scene} "
    "No text, no words, no labels, no borders."
)

# scene id -> composition description. Element positions match the
# hotspot percentages in js/data.js.
PROMPTS = {
    "rain": (
        "A rain shower over a lush green valley: a large soft gray rain cloud "
        "in the upper-left sky, visible streaks of falling rain in the center, "
        "a small cozy town with rooftops in the lower-right distance, and green "
        "meadowed hills below. Fresh, wet, hopeful mood."
    ),
    "cloud": (
        "The view from high in the sky among enormous puffy white cumulus "
        "clouds: a grand sunlit cloud in the upper-center, wind-swept wispy "
        "clouds streaming on the left, and a small flock of geese flying in "
        "formation on the middle-right. Blue sky, golden sunlight."
    ),
    "snow": (
        "Quiet snowfall on high mountain peaks: large delicate snowflakes "
        "drifting in the sky at the top-center, snow-laden pine trees in the "
        "lower-left, and a deep smooth blanket of snowpack on the slope to the "
        "right. Soft blue-white winter light, peaceful."
    ),
    "glacier": (
        "A massive blue glacier flowing between mountain peaks down toward the "
        "sea: deep crevasse cracks in the ice on the left, the glowing blue ice "
        "mass in the center-left, and white icebergs floating in dark teal "
        "water in the lower-right. Alaska mood, crisp cold light."
    ),
    "meadow": (
        "A wildflower meadow just after rain: colorful wildflowers in the left "
        "foreground, a small clear stream winding through the grass on the "
        "middle-right, and rich dark soil with raindrops soaking in at the "
        "bottom-center. Rolling green hills behind, sun breaking through."
    ),
    "groundwater": (
        "A cutaway cross-section of the earth: a green meadow surface with a "
        "tree on the upper-left whose roots reach down into brown soil layers, "
        "a stone well with a pitched roof on the surface at the upper-right, "
        "and below everything a luminous blue aquifer — groundwater glowing "
        "between rocks and gravel — across the lower-center. Secret, cool mood."
    ),
    "trees": (
        "A misty morning forest with golden sunbeams: a grand tree canopy in "
        "the center breathing out soft mist, more mist rising on the upper-left, "
        "and two deer in a clearing in the lower-right. Transpiration made "
        "visible: gentle vapor wisps above the treetops."
    ),
    "river": (
        "A lively river rushing through a forested valley with mountains "
        "behind: a salmon leaping from the water at the center-left, a great "
        "blue heron standing on the right bank, and smooth rounded river "
        "stones on the near bank in the lower-left. Sparkling water, white foam."
    ),
    "lake": (
        "A calm mirror-still lake at golden hour: a deer drinking at the left "
        "shore, a duck family paddling in the center, and reeds with cattails "
        "in the lower-right shallows. Soft hills reflected in the water."
    ),
    "ocean": (
        "A Northern California Pacific coastline: turquoise ocean with rolling "
        "white-foam waves on the left, a whale spout in the mid-distance at the "
        "center, and tall golden-brown cliffs with green scrub on the right, "
        "waves breaking at their base. Seagulls in a bright blue sky."
    ),
    "evaporation": (
        "A big warm radiant sun at the top-center shining down on a glittering "
        "sparkling sea below, with soft wavy wisps of water vapor visibly "
        "rising from the water on the right side, fading as they climb. "
        "Bright, warm, magical mood."
    ),
    "treatment": (
        "A friendly water treatment plant on a green riverside: large round "
        "clarifier pools with radial arms on the left, a tidy filter building "
        "with big pipes in the center-right, and a tall water tower on the "
        "right. Lawns, trees, and the river along the bottom. Welcoming, tidy."
    ),
    "tap": (
        "A cozy kitchen interior: a window over the sink showing green hills, "
        "an arched faucet pouring water into the sink at the center, a clear "
        "glass of water on the counter at the left, and a pot steaming on the "
        "stove at the right. Warm wood counters, a potted plant, soft light."
    ),
    "drain": (
        "A picture-book cutaway diagram under a small town street, drawn with "
        "simple, clear, easy-to-follow plumbing. On the left, a cross-section "
        "of a cozy two-story house: a kitchen sink upstairs and a toilet "
        "downstairs, each draining into one vertical pipe that runs down into "
        "a single large underground sewer pipe. In the middle, the rainy "
        "street surface: gutter water pours through a storm drain grate into "
        "a second, separate pipe. Both pipes run side by side through brown "
        "earth and exit off the right edge, blue water flowing right inside "
        "them. No dead ends, no extra pipes."
    ),
    "thunderstorm": (
        "A dramatic towering thundercloud over a green valley: a huge "
        "anvil-shaped dark storm cloud filling the upper sky, one bright "
        "lightning bolt striking down on the left, and a heavy gray curtain "
        "of rain falling on the right side of the valley. Distant trees "
        "bending in the wind. Thrilling but not scary."
    ),
    "beaver": (
        "A beaver dam of crisscrossed sticks and mud across a small forest "
        "stream: the stick dam center-right with water trickling over its "
        "top, a calm pond behind it on the left with a rounded beaver lodge "
        "mound, and a beaver swimming carrying a branch. Ducks near reeds, "
        "golden afternoon light."
    ),
    "cave": (
        "An underground crystal cave lit by a soft blue-teal glow: "
        "stalactites dripping single drops, stalagmites rising from the "
        "floor, a clear turquoise pool in the lower middle, and a small "
        "warmly glowing passage on the right. Magical, quiet, secret mood."
    ),
    "geyser": (
        "A tall white geyser erupting in a golden geothermal basin: a column "
        "of steam blasting high at the center, a colorful orange-and-"
        "turquoise hot spring pool in the left foreground, pale mineral "
        "terraces around, pine forest at the edges. Awe and wonder."
    ),
    "you": (
        "A friendly picture-book science diagram of a cheerful child "
        "drinking water, soft side-view cutaway: water flows down to a round "
        "friendly tummy, and simple subway-map tube paths carry tiny blue "
        "droplets toward the arms and legs. One sweat drop on the forehead. "
        "Soft pastels, simple rounded shapes, not realistic anatomy."
    ),
    "wastewater": (
        "A friendly wastewater treatment plant on a green riverside: a big "
        "pipe arrives from the left with murky gray-blue water, pouring into "
        "round open tanks fizzing with air bubbles, then calm rectangular "
        "settling pools, and on the right a clear outflow pipe releases "
        "clean sparkling water into a river along the right edge. Tidy cream "
        "buildings with terracotta roofs behind, lawns and small trees."
    ),
}


def main():
    from google import genai

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("Set GEMINI_API_KEY first.")
    client = genai.Client(api_key=api_key)

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    targets = sys.argv[1:] or list(PROMPTS)

    for scene_id in targets:
        if scene_id not in PROMPTS:
            print(f"skip {scene_id}: unknown scene")
            continue
        prompt = STYLE.format(scene=PROMPTS[scene_id])
        print(f"painting {scene_id}…")
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=prompt,
            config={"response_modalities": ["IMAGE"],
                    "image_config": {"aspect_ratio": "16:9"}},
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                out = os.path.join(repo_root, "assets", "scenes", f"{scene_id}.png")
                with open(out, "wb") as f:
                    f.write(part.inline_data.data)
                print(f"  saved {out}")
                break
        else:
            print(f"  no image returned for {scene_id}")


if __name__ == "__main__":
    main()
