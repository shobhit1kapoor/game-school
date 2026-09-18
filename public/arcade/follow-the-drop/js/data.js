// Scene graph for Follow the Drop.
// Each scene is a node. `next` = forward choices ("where does the water go?"),
// `back` = backward choices ("where did the water come from?").
// Hotspot x/y are percentages of the scene image (left/top).

const SCENES = {

  rain: {
    title: "Rain Falls!",
    emoji: "🌧️",
    stamp: "Rainy Valley",
    image: "assets/scenes/rain.png",
    state: "liquid",
    effect: "rain",
    residence: { label: "about 10 minutes falling", years: 0.00002 },
    longAgo: "This very drop has fallen as rain millions of times before — once, maybe, onto the back of a thirsty dinosaur. Rain is the oldest traveler on Earth.",
    body: "Drip! Drop! You are a tiny drop of water, falling from a big gray cloud. Down, down, down you go — past the hills, toward the green valley below.",
    hotspots: [
      { x: 16, y: 14, label: "The cloud",
        fact: "A cloud is made of millions and millions of tiny water drops, all floating together. When the drops get too big and heavy, they fall — that's rain!" },
      { x: 30, y: 34, label: "Falling drops",
        fact: "A raindrop falls about as fast as you ride a bike. It can take a drop ten whole minutes to fall from a tall cloud to the ground!" },
      { x: 60, y: 74, label: "The little town",
        fact: "Rain waters gardens, fills creeks, and washes the streets. The people down there need rain just as much as the plants do." }
    ],
    next: [
      { to: "meadow", label: "Splash into the meadow", question: "Where will you land?", x: 75, y: 57 }
    ],
    back: [
      { to: "cloud", label: "Up in the cloud", question: "Where did you come from?", x: 34, y: 11 },
      { to: "thunderstorm", label: "A wild thunderstorm", question: "", x: 62, y: 20 }
    ]
  },

  cloud: {
    title: "Inside a Cloud",
    emoji: "☁️",
    stamp: "Cloud Castle",
    image: "assets/scenes/cloud.png",
    state: "vapor",
    effect: "mist",
    residence: { label: "about 9 days in the sky", years: 0.025 },
    longAgo: "Clouds have crossed this sky since before there were any eyes to watch them. The water in this cloud once floated over volcanoes, dinosaurs, and the very first forests.",
    body: "Whoosh! You float high in the sky inside a puffy white cloud. You are so tiny and light up here. Brrr — as the air gets colder, you squeeze together with other drops and grow bigger and bigger…",
    hotspots: [
      { x: 40, y: 40, label: "Puffy cloud",
        fact: "When water vapor in the sky gets cold, it turns back into tiny drops. That's called condensation. You can see it happen on a cold glass of juice!" },
      { x: 8, y: 25, label: "The wind",
        fact: "Wind pushes clouds across the sky like big slow ships. A cloud can travel over mountains and oceans before its rain falls." },
      { x: 75, y: 13, label: "Birds flying by",
        fact: "Some birds fly as high as the clouds! Geese have been seen flying higher than the tallest mountains on Earth." }
    ],
    next: [
      { to: "rain", label: "Fall as rain", question: "You're getting heavy! What happens next?", x: 55, y: 70 },
      { to: "snow", label: "Freeze into snow", question: "", x: 87, y: 35 },
      { to: "thunderstorm", label: "Grow into a thundercloud", question: "", x: 38, y: 78 }
    ],
    back: [
      { to: "evaporation", label: "Rising from the sea", question: "How did you get up here?", x: 65, y: 86 },
      { to: "trees", label: "Breathed out by trees", question: "", x: 15, y: 60 },
      { to: "geyser", label: "Blasted up by a geyser", question: "", x: 45, y: 88 }
    ]
  },

  snow: {
    title: "Snow on the Mountains",
    emoji: "❄️",
    stamp: "Snowy Peaks",
    image: "assets/scenes/snow.png",
    state: "ice",
    effect: "snow",
    residence: { label: "a whole winter on the mountain", years: 0.5 },
    longAgo: "Some snow that fell while woolly mammoths walked the Earth is still frozen deep inside glaciers today. Winter keeps very old secrets.",
    body: "It's so cold up here that you froze into a beautiful snowflake! You drift down softly and land on a mountain top. Now you rest in a thick white blanket of snow, waiting for spring.",
    hotspots: [
      { x: 45, y: 14, label: "Snowflakes",
        fact: "Every snowflake has six sides, but no two snowflakes are exactly the same. Each one is a tiny frozen piece of art!" },
      { x: 12, y: 55, label: "Pine trees",
        fact: "Pine trees stay green all winter. Their branches bend like springs so heavy snow slides right off." },
      { x: 70, y: 38, label: "The snowpack",
        fact: "Mountain snow is like a giant water savings bank. It melts slowly in spring and gives rivers water all summer long." }
    ],
    next: [
      { to: "glacier", label: "Get packed into a glacier", question: "Spring is coming. What happens to you?", x: 88, y: 60 },
      { to: "river", label: "Melt and rush downhill", question: "", x: 52, y: 85 }
    ],
    back: [
      { to: "cloud", label: "Up in the cloud", question: "Where did you come from?", x: 65, y: 8 }
    ]
  },

  glacier: {
    title: "Rivers of Ice",
    emoji: "🧊",
    stamp: "Glacier Gap",
    image: "assets/scenes/glacier.png",
    state: "ice",
    effect: "snow",
    residence: { label: "a hundred years frozen — sometimes thousands!", years: 100 },
    longAgo: "The deepest glacier ice froze before the pyramids were built. Scientists drill it out and read it like a frozen history book of Earth's air.",
    body: "You've been squeezed into a glacier — a giant river of ice that moves sooo slowly. You might stay frozen here for a hundred years! Glaciers creep down the mountain just a tiny bit every day.",
    hotspots: [
      { x: 25, y: 45, label: "Blue ice",
        fact: "Glacier ice looks blue because it is squeezed so tight. It's some of the oldest water on Earth — older than your great-great-great grandparents!" },
      { x: 55, y: 82, label: "Icebergs",
        fact: "When a glacier reaches the sea, big chunks crack off and float away. Those are icebergs! Most of an iceberg hides under the water." },
      { x: 15, y: 32, label: "Cracks in the ice",
        fact: "Glaciers groan, pop, and crack as they move. Scientists listen to the sounds to learn how fast the ice is going." }
    ],
    next: [
      { to: "river", label: "Melt into a rushing river", question: "After many years, you melt! Where do you go?", x: 45, y: 90 },
      { to: "ocean", label: "Float to the sea as an iceberg", question: "", x: 85, y: 88 }
    ],
    back: [
      { to: "snow", label: "Snow on the peaks", question: "How did you get here?", x: 62, y: 12 }
    ]
  },

  meadow: {
    title: "Down on the Ground",
    emoji: "🌼",
    stamp: "Wildflower Meadow",
    image: "assets/scenes/meadow.png",
    state: "liquid",
    effect: null,
    residence: { label: "a day soaking into the ground", years: 0.003 },
    longAgo: "Long before farms, rain fed wild meadows where mammoths and giant sloths grazed. Same rain, same soil recipe — for millions of years.",
    body: "Plip! You land in a meadow full of wildflowers. Now you have a big choice. You can sink down into the soft soil… or roll downhill and join the stream. Which way will you go?",
    hotspots: [
      { x: 8, y: 52, label: "Wildflowers",
        fact: "Flowers drink rain through their roots like you drink through a straw. After rain, a meadow gets extra colorful!" },
      { x: 72, y: 72, label: "The stream",
        fact: "Little streams join other streams to make big rivers — like small roads joining a highway. Water always flows downhill." },
      { x: 58, y: 49, label: "The soil",
        fact: "Soil is full of tiny holes, like a sponge. Rain slips through the holes and sinks deep underground." }
    ],
    next: [
      { to: "groundwater", label: "Sink into the soil", question: "Which way will you go?", x: 52, y: 88 },
      { to: "river", label: "Flow down into the stream", question: "", x: 80, y: 60 },
      { to: "beaver", label: "Go upstream to meet the builders!", question: "", x: 88, y: 74 }
    ],
    back: [
      { to: "rain", label: "Falling rain", question: "How did you get here?", x: 50, y: 10 }
    ]
  },

  groundwater: {
    title: "The Hidden Water Underground",
    emoji: "🪨",
    stamp: "Secret Aquifer",
    image: "assets/scenes/groundwater.png",
    state: "liquid",
    effect: "bubbles",
    residence: { label: "hundreds of years in the dark", years: 300 },
    longAgo: "Some water under your feet has been hiding there since the Ice Age. Drink from a very deep well and you might sip water older than the last mammoth.",
    body: "Shhh… you're in a secret world under the ground! You trickle down between rocks and sand until you join a huge hidden pool called an aquifer. It's dark, cool, and very quiet down here.",
    hotspots: [
      { x: 10, y: 38, label: "Roots",
        fact: "Tree roots reach down into the wet soil to drink. A big oak tree can drink a whole bathtub of water every day!" },
      { x: 38, y: 66, label: "The aquifer",
        fact: "An aquifer is water hiding in the spaces between underground rocks and sand. There is more fresh water underground than in all the world's rivers and lakes!" },
      { x: 12, y: 19, label: "The well",
        fact: "People dig wells to reach the water underground. A pump pulls it up so families and farms can use it." }
    ],
    next: [
      { to: "trees", label: "Get drunk up by tree roots", question: "Where do you go from down here?", x: 20, y: 48 },
      { to: "river", label: "Bubble out of a spring", question: "", x: 64, y: 70 },
      { to: "treatment", label: "Get pumped up a well", question: "", x: 27, y: 10 },
      { to: "cave", label: "Drip into a hidden cave", question: "", x: 40, y: 85 }
    ],
    back: [
      { to: "meadow", label: "Soaking through the meadow", question: "How did you get here?", x: 50, y: 8 }
    ]
  },

  trees: {
    title: "Trees Drink Too",
    emoji: "🌲",
    stamp: "Whispering Forest",
    image: "assets/scenes/trees.png",
    state: "vapor",
    effect: "mist",
    residence: { label: "three days inside a tree", years: 0.008 },
    longAgo: "Three hundred million years ago, giant forests breathed out water just like this one — and those ancient trees slowly became the coal we find underground today.",
    body: "Sluuurp! A tall tree drinks you up through its roots. You climb up, up, up inside the trunk, all the way to a leaf. Then — whoosh — the leaf breathes you out into the air as invisible water vapor!",
    hotspots: [
      { x: 68, y: 28, label: "The leaves",
        fact: "Leaves have teeny tiny doors that open to let water out. This is called transpiration — it means trees breathe out water!" },
      { x: 20, y: 30, label: "Morning mist",
        fact: "That misty fog over a forest in the morning? A lot of it is water that the trees breathed out. A whole forest can make its own clouds!" },
      { x: 58, y: 82, label: "Forest animals",
        fact: "Deer, squirrels, and birds all need the forest's water. Animals can smell rain coming before it arrives!" }
    ],
    next: [
      { to: "cloud", label: "Float up and join a cloud", question: "You're vapor now! Where to?", x: 88, y: 12 }
    ],
    back: [
      { to: "groundwater", label: "Underground, with the roots", question: "How did you get here?", x: 78, y: 90 }
    ]
  },

  river: {
    title: "Ride the River",
    emoji: "🏞️",
    stamp: "Rushing River",
    image: "assets/scenes/river.png",
    state: "liquid",
    effect: null,
    residence: { label: "two weeks racing to the sea", years: 0.04 },
    longAgo: "This river has been carving its valley for a million years. Your drop is riding a road that was built, splash by splash, by its great-great-grand-drops.",
    body: "Wheee! You're riding a rushing river, tumbling over rocks and zooming around bends. Fish dart below you, and a heron watches from the bank. Rivers are nature's water highways!",
    hotspots: [
      { x: 30, y: 45, label: "Jumping salmon",
        fact: "Salmon are amazing swimmers. They swim up the river — against the current! — to lay their eggs in the same stream where they were born." },
      { x: 80, y: 38, label: "The heron",
        fact: "A heron stands very, very still in the water, then — snap! — catches a fish with its long beak. Rivers are full of food for birds." },
      { x: 55, y: 82, label: "Smooth stones",
        fact: "River rocks are smooth because water has been rolling and rubbing them for thousands of years. Water is soft, but it can shape stone!" }
    ],
    next: [
      { to: "lake", label: "Rest in a calm lake", question: "Where does the river take you?", x: 62, y: 33 },
      { to: "ocean", label: "Race all the way to the ocean", question: "", x: 40, y: 78 },
      { to: "treatment", label: "Get scooped up for the town", question: "", x: 90, y: 58 }
    ],
    back: [
      { to: "meadow", label: "A stream in the meadow", question: "Where did the river start?", x: 8, y: 30 },
      { to: "snow", label: "Melting mountain snow", question: "", x: 35, y: 8 },
      { to: "wastewater", label: "Cleaned water from the town", question: "", x: 78, y: 10 }
    ]
  },

  lake: {
    title: "Resting in the Lake",
    emoji: "🦆",
    stamp: "Mirror Lake",
    image: "assets/scenes/lake.png",
    state: "liquid",
    effect: "sparkle",
    residence: { label: "ten years resting", years: 10 },
    longAgo: "The oldest lake on Earth, Lake Baikal, is 25 million years old. Fish live there that exist nowhere else — raised by the same patient water, generation after generation.",
    body: "Ahhh. The river slows down and spreads out into a calm, quiet lake. The water is so still it looks like a mirror. All around the edges, animals come to drink. You're helping everyone!",
    hotspots: [
      { x: 16, y: 52, label: "Deer drinking",
        fact: "Deer visit the lake in the early morning and evening to drink. A deer drinks water just like a dog does — lap, lap, lap with its tongue." },
      { x: 45, y: 55, label: "Duck family",
        fact: "Ducks have special oil on their feathers that makes water roll right off. That's why they never get soggy!" },
      { x: 82, y: 68, label: "The reeds",
        fact: "Reeds and cattails grow where the water is shallow. They are like an apartment building for frogs, dragonflies, and baby fish." }
    ],
    next: [
      { to: "evaporation", label: "Warm up in the sun and rise", question: "Where do you go from the lake?", x: 60, y: 15 },
      { to: "river", label: "Slip out where the river leaves", question: "", x: 72, y: 33 }
    ],
    back: [
      { to: "river", label: "The rushing river", question: "How did you get here?", x: 10, y: 25 }
    ]
  },

  ocean: {
    title: "The Big Blue Ocean",
    emoji: "🌊",
    stamp: "Pacific Point",
    image: "assets/scenes/ocean.png",
    state: "liquid",
    effect: "sparkle",
    residence: { label: "three thousand years at sea", years: 3000 },
    longAgo: "Every drop of the ocean has been here for about 4 billion years. The water you swim in once rained on dinosaurs, froze in ice ages, and rode clouds over ancient seas.",
    body: "You made it to the ocean — the biggest water on Earth! Waves crash against the cliffs and seabirds soar above you. Almost all of the world's water lives here in the salty sea.",
    hotspots: [
      { x: 25, y: 60, label: "The waves",
        fact: "The ocean holds 97 out of every 100 drops of water on Earth. But it's salty — too salty to drink!" },
      { x: 47, y: 30, label: "A whale spout",
        fact: "That puff of mist is a whale breathing out! Whales are the biggest animals that have ever lived, and the ocean is their whole world." },
      { x: 82, y: 45, label: "The cliffs",
        fact: "Waves have been carving these cliffs for millions of years, one splash at a time. The beach's sand is made of tiny pieces of broken-down rock and shell." }
    ],
    next: [
      { to: "evaporation", label: "Warm up in the sunshine", question: "The sun is shining on you. What happens?", x: 18, y: 12 }
    ],
    back: [
      { to: "river", label: "A river reaching the sea", question: "How did you get here?", x: 60, y: 10 },
      { to: "glacier", label: "An iceberg, melting", question: "", x: 38, y: 78 }
    ]
  },

  evaporation: {
    title: "Up, Up, Up!",
    emoji: "☀️",
    stamp: "Sunbeam Lift",
    image: "assets/scenes/evaporation.png",
    state: "vapor",
    effect: "sparkle",
    residence: { label: "a few sparkling minutes rising", years: 0.00001 },
    longAgo: "The sun has lifted water into the sky every single day for 4 billion years — and it has never once missed a day of work.",
    body: "The warm sun shines down on you, and something magical happens — you turn into vapor! You're invisible now, lighter than air, floating up into the big blue sky like a balloon.",
    hotspots: [
      { x: 50, y: 18, label: "The sun",
        fact: "The sun is the engine of the whole water cycle. Its warmth lifts billions of drops into the sky every single day — for free!" },
      { x: 35, y: 65, label: "Sparkling water",
        fact: "When water turns into vapor, that's called evaporation. It happens to puddles, pools, and even your wet swimsuit on a sunny day." },
      { x: 76, y: 45, label: "Invisible vapor",
        fact: "Water vapor is real water, but the pieces are too tiny to see. Right now there is invisible water floating in the air all around you!" }
    ],
    next: [
      { to: "cloud", label: "Cool off and become a cloud", question: "You float higher and higher. Then what?", x: 20, y: 12 }
    ],
    back: [
      { to: "ocean", label: "The sunny ocean", question: "Where were you before?", x: 55, y: 85 },
      { to: "lake", label: "The calm lake", question: "", x: 88, y: 78 },
      { to: "you", label: "Sweat from a playing kid", question: "", x: 82, y: 18 }
    ]
  },

  treatment: {
    title: "The Water-Cleaning Factory",
    emoji: "🏭",
    stamp: "Clean Water Works",
    image: "assets/scenes/treatment.png",
    state: "liquid",
    effect: "bubbles",
    residence: { label: "a day getting squeaky clean", years: 0.003 },
    longAgo: "The ancient Romans built stone aqueducts to carry clean water to their cities 2,000 years ago. Some still stand today — and a few still carry water!",
    body: "You've been scooped up and sent to a water treatment plant! Here, friendly workers and big machines clean you until you sparkle. You get filtered, swirled, and checked — now you're safe to drink!",
    hotspots: [
      { x: 15, y: 55, label: "The round pools",
        fact: "In these big pools, dirt and tiny bits get stuck together and sink to the bottom. The clean water on top moves on to the next step." },
      { x: 42, y: 38, label: "The filters",
        fact: "The water passes through layers of sand and charcoal, like the world's fanciest strainer. Even teeny tiny specks get caught!" },
      { x: 88, y: 28, label: "The water tower",
        fact: "Clean water gets pumped up into tall towers. Being up high gives the water a push, so it can zoom through pipes to every house in town." }
    ],
    next: [
      { to: "tap", label: "Zoom through pipes to a kitchen", question: "You're clean and ready! Where to?", x: 58, y: 62 }
    ],
    back: [
      { to: "river", label: "Scooped from the river", question: "How did you get here?", x: 72, y: 88 },
      { to: "groundwater", label: "Pumped up from a well", question: "", x: 8, y: 18 }
    ]
  },

  tap: {
    title: "Water at Home",
    emoji: "🚰",
    stamp: "Kitchen Sink",
    image: "assets/scenes/tap.png",
    state: "liquid",
    effect: null,
    residence: { label: "an hour zooming through pipes", years: 0.0001 },
    longAgo: "Before pipes, kids your age carried every drop home in buckets from the village well. One bath took twenty trips!",
    body: "Squeak! Someone turns the faucet, and out you pour — right into a glass in a cozy kitchen. You help people drink, cook noodles, wash hands, and water the plants on the windowsill. Busy day!",
    hotspots: [
      { x: 42, y: 52, label: "The faucet",
        fact: "Water travels through pipes under the streets to reach your house, like a secret underground delivery service that never stops." },
      { x: 7, y: 50, label: "The glass of water",
        fact: "Your body is more than half water! Drinking water keeps you strong, helps you think, and even helps you grow." },
      { x: 84, y: 60, label: "The cooking pot",
        fact: "We use water for almost everything in the kitchen — boiling pasta, making soup, rinsing strawberries, and washing the dishes after." }
    ],
    next: [
      { to: "drain", label: "Swirl down the drain", question: "Glug! Where do you go after the sink?", x: 50, y: 82 },
      { to: "you", label: "Get gulped by a thirsty kid", question: "", x: 25, y: 48 }
    ],
    back: [
      { to: "treatment", label: "The water-cleaning factory", question: "How did you get here?", x: 55, y: 20 }
    ]
  },

  drain: {
    title: "Down the Drain",
    emoji: "🕳️",
    stamp: "Pipe Maze",
    image: "assets/scenes/drain.png",
    state: "liquid",
    effect: "bubbles",
    residence: { label: "a day in the pipes", years: 0.003 },
    longAgo: "Five hundred years ago, towns had no drains at all — people threw used water right out the window! Pipes under the street are one of the best inventions ever.",
    body: "Glug glug glug! Down you go, into the secret world of pipes under the street. Water from the sink and toilet rides the sewer pipe. Rain that washes off the street falls through the storm drain. Two pipes, two different adventures!",
    hotspots: [
      { x: 14, y: 48, label: "The house pipes",
        fact: "Every sink, tub, and toilet in the house empties into one big pipe — the sewer pipe. It carries the used water away to get cleaned." },
      { x: 43, y: 50, label: "The storm drain",
        fact: "That metal grate is a storm drain. When rain washes the street, the water falls right in — so the streets don't turn into rivers!" },
      { x: 58, y: 72, label: "Where does it all go?",
        fact: "Sewer water goes to the wastewater plant for a good scrubbing. But storm water usually is not cleaned — it flows straight to the creek! That's why we never pour yucky stuff down a storm drain." }
    ],
    next: [
      { to: "wastewater", label: "Ride the sewer pipe to get cleaned", question: "Two pipes, two paths! Which one are you riding?", x: 72, y: 42 },
      { to: "river", label: "Rush out with the storm water", question: "", x: 86, y: 84 }
    ],
    back: [
      { to: "tap", label: "The kitchen sink", question: "How did you get here?", x: 8, y: 12 },
      { to: "rain", label: "Rain falling on the street", question: "", x: 55, y: 10 },
      { to: "you", label: "Flushed by somebody!", question: "", x: 30, y: 9 }
    ]
  },

  wastewater: {
    title: "The Big Clean-Up",
    emoji: "🫧",
    stamp: "Bubble Works",
    image: "assets/scenes/wastewater.png",
    state: "liquid",
    effect: "bubbles",
    residence: { label: "a day getting scrubbed", years: 0.003 },
    longAgo: "The tiny helpful germs cleaning this water are an ancient family — their ancestors have been eating gunk in swamps for billions of years. Now they have a job in town.",
    body: "Phew — you made it to the wastewater plant, the bath house for dirty water! Machines stir you, bubbles fizz all around you, and billions of tiny helpful germs gobble up the yucky bits. Soon you're fresh enough to go back to nature.",
    hotspots: [
      { x: 33, y: 60, label: "The bubble tanks",
        fact: "Air bubbles fizz through the water like a giant soda. The bubbles help tiny helpful germs breathe while they eat up the dirt." },
      { x: 50, y: 34, label: "The settling pools",
        fact: "In these quiet pools the water slows down and rests. The last bits of gunk sink to the bottom, and the clean water floats on top." },
      { x: 79, y: 60, label: "The way out",
        fact: "Checked, cleaned, and approved! The water flows back to the river much cleaner than it arrived. Nature gets its water back." }
    ],
    next: [
      { to: "river", label: "Flow back to the river, clean!", question: "You're clean again! Where now?", x: 85, y: 72 }
    ],
    back: [
      { to: "drain", label: "The pipes under the street", question: "How did you get here?", x: 10, y: 16 }
    ]
  },

  thunderstorm: {
    title: "The Big Storm",
    emoji: "⛈️",
    stamp: "Thunder Ridge",
    image: "assets/scenes/thunderstorm.png",
    state: "vapor",
    effect: "storm",
    residence: { label: "one wild stormy hour", years: 0.0001 },
    longAgo: "When lightning strikes sand, it melts it into twisty glass tubes called fulgurites. Scientists have found one that is 250 million years old — a fossil of a single flash!",
    body: "Rumble… RUMBLE… You've grown into a giant thundercloud! Lightning flashes below you and thunder shakes the sky. Hold on tight, little drop — storms are the wildest ride in the whole water cycle!",
    hotspots: [
      { x: 9, y: 40, label: "Lightning",
        fact: "A lightning bolt is five times hotter than the surface of the sun! It heats the air so fast that the air booms — and that boom is thunder." },
      { x: 50, y: 12, label: "The anvil top",
        fact: "Thunderclouds grow taller than the tallest mountains on Earth. The flat top spreads out like a giant anvil where the sky gets too thin to climb." },
      { x: 58, y: 58, label: "The rain curtain",
        fact: "See that gray curtain? That's millions of drops falling together. A big storm can drop a whole swimming pool of water on every backyard in town." }
    ],
    next: [
      { to: "rain", label: "Pour down in the storm", question: "The cloud can't hold you any longer!", x: 70, y: 80 }
    ],
    back: [
      { to: "cloud", label: "A calm white cloud", question: "What were you before?", x: 87, y: 14 }
    ]
  },

  beaver: {
    title: "The Beaver Dam",
    emoji: "🦫",
    stamp: "Beaver Lodge",
    image: "assets/scenes/beaver.png",
    state: "liquid",
    effect: null,
    residence: { label: "a season resting in the pond", years: 0.25 },
    longAgo: "Ice-age beavers were as big as bears! Beavers have been building dams and making ponds for millions of years — they were shaping rivers long before people built their first bridge.",
    body: "Thump! Your stream bumps into a wall of sticks and mud — a beaver dam! The busy builders slowed the water down and made a calm pond. Frogs, ducks, and fish all moved in. Beavers build homes for everyone!",
    hotspots: [
      { x: 75, y: 38, label: "The dam",
        fact: "Beavers build dams with sticks, stones, and mud — using only their teeth and paws! A beaver's front teeth never stop growing, so chewing trees keeps them just right." },
      { x: 27, y: 53, label: "The beaver",
        fact: "Beavers can hold their breath for 15 minutes and their flat tails work like rudders. They slap the water — smack! — to warn their family of danger." },
      { x: 16, y: 43, label: "The lodge",
        fact: "That mound is the beaver's house, called a lodge. The front door is hidden underwater, so the beaver family stays safe and cozy inside." }
    ],
    next: [
      { to: "river", label: "Spill over the top of the dam", question: "The pond is full! Where to now?", x: 66, y: 62 },
      { to: "groundwater", label: "Sink into the soggy wetland", question: "", x: 42, y: 88 }
    ],
    back: [
      { to: "meadow", label: "The little stream", question: "How did you get here?", x: 8, y: 12 }
    ]
  },

  cave: {
    title: "The Crystal Cave",
    emoji: "💎",
    stamp: "Echo Cavern",
    image: "assets/scenes/cave.png",
    state: "liquid",
    effect: "sparkle",
    residence: { label: "a thousand patient years dripping", years: 1000 },
    longAgo: "Each stone icicle in a cave grows about as fast as your fingernails. The biggest ones started dripping before anyone on Earth had invented writing.",
    body: "Drip… drip… echo! You've trickled into a secret cave deep underground. Every drop that falls from the ceiling leaves behind a tiny speck of stone. Drop by drop, water is building stone icicles in the dark!",
    hotspots: [
      { x: 25, y: 12, label: "Stalactites",
        fact: "The stone icicles hanging from the ceiling are stalactites — they hold on tight! The ones growing up from the floor are stalagmites — they might reach the top someday." },
      { x: 50, y: 78, label: "The cave pool",
        fact: "Cave pools are some of the clearest water on Earth, filtered drip by drip through the rock. Blind cave fish and pale crayfish live in pools like this!" },
      { x: 80, y: 42, label: "The glowing passage",
        fact: "Caves can go on for miles and miles. The longest cave in the world has more than 400 miles of tunnels — and water carved every single one." }
    ],
    next: [
      { to: "geyser", label: "Trickle toward the hot rocks", question: "Deeper or out? Choose your path!", x: 72, y: 68 },
      { to: "river", label: "Ride an underground stream out", question: "", x: 40, y: 58 }
    ],
    back: [
      { to: "groundwater", label: "The aquifer above", question: "How did you get here?", x: 50, y: 7 }
    ]
  },

  geyser: {
    title: "The Geyser!",
    emoji: "🌋",
    stamp: "Old Faithful",
    image: "assets/scenes/geyser.png",
    state: "vapor",
    effect: "mist",
    residence: { label: "weeks underground… then one wild minute", years: 0.04 },
    longAgo: "Old Faithful, the most famous geyser in the world, has been erupting on schedule for thousands of years — long before anyone was there to give it a name.",
    body: "It's getting hot down here! Volcano-warmed rocks boil you until — WHOOSH! — you blast out of the ground and shoot higher than a house, riding a tower of steam into the sky. What a way to fly!",
    hotspots: [
      { x: 38, y: 32, label: "The eruption",
        fact: "A geyser is like a teapot buried in the ground. Hot rock boils the water below until the steam pushes it out in a giant whoosh — some geysers shoot ten stories high!" },
      { x: 60, y: 78, label: "The rainbow pool",
        fact: "Hot spring pools get their amazing orange and turquoise colors from billions of tiny heat-loving creatures. Each color likes a different temperature!" },
      { x: 85, y: 82, label: "The stone terraces",
        fact: "The pale rock around a geyser was built by the water itself — every splash leaves a little mineral behind, layer after layer, for thousands of years." }
    ],
    next: [
      { to: "cloud", label: "Blast into the sky as steam!", question: "Whoosh! Where does the steam go?", x: 40, y: 6 }
    ],
    back: [
      { to: "cave", label: "The crystal cave", question: "Where were you before?", x: 88, y: 28 }
    ]
  },

  you: {
    title: "Inside You!",
    emoji: "🧒",
    stamp: "Part of You",
    image: "assets/scenes/you.png",
    state: "liquid",
    effect: null,
    residence: { label: "about a week inside a kid", years: 0.02 },
    longAgo: "Every person who ever lived borrowed their water from the same sky and rivers — knights, pharaohs, cave-painters, and now you. You are partly made of very famous water.",
    body: "Gulp! A thirsty kid drinks you in one big sip — and now you're part of them! You ride to the tummy, hop into the blood, and zoom around delivering goodness. More than half of a kid is water… and right now, that's you!",
    hotspots: [
      { x: 60, y: 66, label: "The tummy",
        fact: "Your tummy passes water into your blood in just a few minutes. That's why a drink of water makes you feel better so fast!" },
      { x: 72, y: 50, label: "The blood highway",
        fact: "Blood is mostly water! It rides around your whole body about once a minute, delivering oxygen and snacks to every finger and toe." },
      { x: 84, y: 33, label: "Escape drops",
        fact: "When you run and play, your body sweats to cool you down — tiny drops escape and evaporate right off your skin. You make your own water cycle!" }
    ],
    next: [
      { to: "evaporation", label: "Escape as a drop of sweat", question: "How will you get out?", x: 88, y: 14 },
      { to: "drain", label: "Whoooosh — get flushed!", question: "", x: 85, y: 86 }
    ],
    back: [
      { to: "tap", label: "The glass of water", question: "How did you get here?", x: 40, y: 12 }
    ]
  }

};

const START_SCENE = "rain";
const SCENE_ORDER = [
  "cloud", "thunderstorm", "rain", "snow", "glacier", "meadow", "beaver",
  "groundwater", "cave", "geyser", "trees", "river", "lake", "ocean",
  "evaporation", "treatment", "tap", "you", "drain", "wastewater"
];
