import type { Grade, LevelDefinition, SubjectId } from '../domain/types';

export const GRADES: Grade[] = ['K', '1', '2', '3', '4', '5'];

export const SUBJECTS: Record<SubjectId, { subjectName: string; label: string; emoji: string; color: string; description: string }> = {
  math: { subjectName: 'Math', label: 'Math Mountain', emoji: '⛰️', color: '#1677d2', description: 'Build number power and solve clever challenges.' },
  english: { subjectName: 'English', label: 'Story Forest', emoji: '📖', color: '#168e61', description: 'Read, spell, and bring stories to life.' },
  science: { subjectName: 'Science', label: 'Discovery Island', emoji: '🔭', color: '#7356d8', description: 'Experiment, observe, and discover why.' },
  social: { subjectName: 'Social Studies', label: 'Community Town', emoji: '🏛️', color: '#e76b4c', description: 'Explore maps, people, places, and time.' },
};

type Quiz = { prompt: string; choices: string[]; correct: number };
type Seed = { title: string; concept: string; gameType: LevelDefinition['gameType']; config?: Record<string, unknown> };
export type StageSyllabus = { name: string; mission: string; skills: string[] };
const quiz = (questions: Quiz[]) => ({ questions });

const mathQuestions: Record<Grade, Quiz[]> = {
  K: [{ prompt: 'Which group has more?', choices: ['3 apples', '6 apples', '4 apples'], correct: 1 }, { prompt: 'What number comes after 4?', choices: ['3', '5', '6'], correct: 1 }, { prompt: 'Which shape has 3 sides?', choices: ['circle', 'triangle', 'square'], correct: 1 }],
  '1': [{ prompt: 'What is 8 + 5?', choices: ['12', '13', '15'], correct: 1 }, { prompt: 'What is 16 − 7?', choices: ['9', '8', '10'], correct: 0 }, { prompt: 'Which number is greater?', choices: ['19', '16', '11'], correct: 0 }],
  '2': [{ prompt: 'Which number has more value?', choices: ['47', '74', '44'], correct: 1 }, { prompt: 'What is 30 + 7?', choices: ['37', '307', '10'], correct: 0 }, { prompt: 'Which shows seven tens?', choices: ['7', '70', '700'], correct: 1 }],
  '3': [{ prompt: 'What is 4 groups of 6?', choices: ['10', '24', '46'], correct: 1 }, { prompt: 'What is 36 ÷ 4?', choices: ['8', '9', '12'], correct: 1 }, { prompt: 'Which fraction is one half?', choices: ['1/2', '1/3', '2/3'], correct: 0 }],
  '4': [{ prompt: 'Which fraction is equal to 1/2?', choices: ['2/4', '2/3', '3/4'], correct: 0 }, { prompt: 'What is 3.6 + 0.4?', choices: ['3.10', '4.0', '3.8'], correct: 1 }, { prompt: 'How many right angles does a rectangle have?', choices: ['2', '3', '4'], correct: 2 }],
  '5': [{ prompt: 'What is 2.5 × 4?', choices: ['6', '10', '25'], correct: 1 }, { prompt: 'Which point is on x = 3?', choices: ['(3, 1)', '(1, 3)', '(0, 3)'], correct: 0 }, { prompt: 'A box is 2 × 3 × 4. What is its volume?', choices: ['9', '24', '12'], correct: 1 }],
};

const wordQuestions: Record<Grade, Quiz[]> = {
  K: [{ prompt: 'Which word starts with the /m/ sound?', choices: ['moon', 'sun', 'fish'], correct: 0 }, { prompt: 'Which word rhymes with cat?', choices: ['map', 'hat', 'dog'], correct: 1 }, { prompt: 'Choose a word you can read.', choices: ['I', '&&', '!?'], correct: 0 }],
  '1': [{ prompt: 'Choose the word with the long a sound.', choices: ['cake', 'cat', 'can'], correct: 0 }, { prompt: 'Choose the word that means big.', choices: ['tiny', 'large', 'slow'], correct: 1 }, { prompt: 'Choose a complete sentence.', choices: ['We play.', 'play We', 'We play? ball'], correct: 0 }],
  '2': [{ prompt: 'Choose the word that starts with the /sh/ sound.', choices: ['ship', 'sun', 'tap'], correct: 0 }, { prompt: 'Choose the word that means happy.', choices: ['glad', 'sad', 'cold'], correct: 0 }, { prompt: 'Choose a complete sentence.', choices: ['The dog runs.', 'dog the runs', 'runs dog the'], correct: 0 }],
  '3': [{ prompt: 'Which word means almost the same as brave?', choices: ['courageous', 'sleepy', 'tiny'], correct: 0 }, { prompt: 'A main idea tells the…', choices: ['big point', 'page number', 'author name'], correct: 0 }, { prompt: 'Choose the correct sentence.', choices: ['We walked home.', 'We walk yesterday.', 'We walking home.'], correct: 0 }],
  '4': [{ prompt: 'Which word means to look closely?', choices: ['examine', 'ignore', 'forget'], correct: 0 }, { prompt: 'Text evidence is…', choices: ['proof from the text', 'a guess', 'a picture only'], correct: 0 }, { prompt: 'Choose a strong topic sentence.', choices: ['Rainforests are important homes for many living things.', 'Rainforests.', 'I like trees maybe.'], correct: 0 }],
  '5': [{ prompt: 'Which word means to explain clearly?', choices: ['clarify', 'hide', 'wander'], correct: 0 }, { prompt: 'An argument needs…', choices: ['reasons and evidence', 'only a title', 'a longer word'], correct: 0 }, { prompt: 'Which is a reliable source?', choices: ['a museum website', 'a random rumor', 'an untitled post'], correct: 0 }],
};

const mapQuestions: Record<Grade, Quiz[]> = {
  K: [{ prompt: 'Who helps put out fires?', choices: ['firefighter', 'baker', 'librarian'], correct: 0 }, { prompt: 'Which place has books to borrow?', choices: ['library', 'park', 'garage'], correct: 0 }, { prompt: 'A map can show…', choices: ['places', 'dreams', 'smells'], correct: 0 }],
  '1': [{ prompt: 'Which rule helps everyone stay safe?', choices: ['take turns', 'push ahead', 'shout indoors'], correct: 0 }, { prompt: 'North is usually at the…', choices: ['top of a map', 'bottom of a map', 'middle of a map'], correct: 0 }, { prompt: 'Past means…', choices: ['long ago', 'tomorrow', 'right now'], correct: 0 }],
  '2': [{ prompt: 'Which symbol helps you understand a map?', choices: ['legend', 'recipe', 'diary'], correct: 0 }, { prompt: 'Which direction is at the top of most maps?', choices: ['north', 'south', 'west'], correct: 0 }, { prompt: 'A map key explains…', choices: ['symbols', 'jokes', 'weather'], correct: 0 }],
  '3': [{ prompt: 'Which is a civic responsibility?', choices: ['follow fair rules', 'ignore neighbors', 'waste resources'], correct: 0 }, { prompt: 'A continent is…', choices: ['a large land area', 'a type of cloud', 'a small town'], correct: 0 }, { prompt: 'Money helps people…', choices: ['trade for goods', 'change weather', 'grow taller'], correct: 0 }],
  '4': [{ prompt: 'A region is an area with…', choices: ['shared features', 'one single house', 'no location'], correct: 0 }, { prompt: 'A state government helps with…', choices: ['state services', 'all world laws', 'the weather'], correct: 0 }, { prompt: 'A map scale helps show…', choices: ['distance', 'sound', 'taste'], correct: 0 }],
  '5': [{ prompt: 'The Constitution helps describe…', choices: ['how government works', 'how to bake bread', 'how planets move'], correct: 0 }, { prompt: 'A primary source comes from…', choices: ['the time being studied', 'a made-up future', 'a game score'], correct: 0 }, { prompt: 'Culture can include…', choices: ['traditions and art', 'only weather', 'only numbers'], correct: 0 }],
};

const scienceQuestions: Record<Grade, Quiz[]> = {
  K: [{ prompt: 'What do plants need to grow?', choices: ['sunlight and water', 'video games', 'a backpack'], correct: 0 }, { prompt: 'Which is a living thing?', choices: ['a puppy', 'a rock', 'a spoon'], correct: 0 }, { prompt: 'Which weather tool helps you see rain?', choices: ['rain gauge', 'crayon', 'book'], correct: 0 }],
  '1': [{ prompt: 'Sound starts when something…', choices: ['vibrates', 'hides', 'melts'], correct: 0 }, { prompt: 'Which animal has a habitat in water?', choices: ['fish', 'camel', 'eagle'], correct: 0 }, { prompt: 'Water can become ice when it gets…', choices: ['cold', 'loud', 'dark'], correct: 0 }],
  '2': [{ prompt: 'A butterfly begins life as a…', choices: ['egg', 'kitten', 'seed'], correct: 0 }, { prompt: 'Which is a solid?', choices: ['ice cube', 'juice', 'steam'], correct: 0 }, { prompt: 'Wind can move…', choices: ['a kite', 'a mountain', 'a calendar date'], correct: 0 }],
  '3': [{ prompt: 'A push or pull is called a…', choices: ['force', 'fraction', 'sentence'], correct: 0 }, { prompt: 'A group of living things and their home is an…', choices: ['ecosystem', 'equation', 'alphabet'], correct: 0 }, { prompt: 'Heating water can change it into…', choices: ['water vapor', 'a rock', 'soil'], correct: 0 }],
  '4': [{ prompt: 'Energy of motion is called…', choices: ['kinetic energy', 'a map key', 'a paragraph'], correct: 0 }, { prompt: 'Which process can form sedimentary rock?', choices: ['layers pressing together', 'spelling words', 'turning on a lamp'], correct: 0 }, { prompt: 'An organism’s role in its habitat is its…', choices: ['niche', 'zip code', 'bookmark'], correct: 0 }],
  '5': [{ prompt: 'Matter is made of tiny particles called…', choices: ['atoms', 'chapters', 'continents'], correct: 0 }, { prompt: 'Plants use sunlight to make food through…', choices: ['photosynthesis', 'erosion', 'evaporation'], correct: 0 }, { prompt: 'An engineering solution should be…', choices: ['tested and improved', 'hidden forever', 'guessed once'], correct: 0 }],
};

const gradeNames: Record<Grade, Record<SubjectId, string[]>> = {
  K: { math: ['Count and Compare', 'Number Friends', 'Shape Builder', 'Pattern Parade', 'Measure Around Us', 'Math Story Time', 'Numbers to 10', 'Sort and Match', 'Build with Shapes', 'Kindergarten Math Party'], english: ['Letter Friends', 'Sound Safari', 'Rhyme Time', 'Word Builders', 'Tiny Reader', 'Story Talk', 'Alphabet Trail', 'Picture Clues', 'Sentence Stars', 'My Story'], science: ['Little Scientist', 'Plant Pals', 'Animal Homes', 'Weather Watch', 'Water Wonders', 'Sky Watch', 'Five Senses Lab', 'Push and Pull', 'Earth Helpers', 'Science Celebration'], social: ['Our Helpers', 'My Classroom', 'Our Rules', 'My First Map', 'Then and Now', 'Family Traditions', 'My Community', 'Map Symbols', 'Special Places', 'Community Celebration'] },
  '1': { math: ['Number Friends', 'Add It Up', 'Take Away Trail', 'Shape Detectives', 'Measure and Tell Time', 'Problem Solvers', 'Place Value Pals', 'Fact Family Fun', 'Time Trail', 'Math Mission'], english: ['Sound Builders', 'Word Family Fun', 'Sight Word Trail', 'Sentence Stars', 'Story Clues', 'Write a Thought', 'Phonics Path', 'Reading Pictures', 'Question Detectives', 'Author Adventure'], science: ['Light and Sound', 'Animal Homes', 'Plant Needs', 'Sky Watch', 'Water Moves', 'Earth Materials', 'Season Scientists', 'Build and Test', 'Life Cycle Loop', 'Science Showcase'], social: ['Our Neighborhood', 'Rules That Help', 'Map Directions', 'Then and Now', 'People at Work', 'Traditions Together', 'Good Citizens', 'Land and Water', 'Community Stories', 'First Grade Journey'] },
  '2': { math: ['Place Value Peak', 'Add and Subtract', 'Money Mission', 'Shape Builders', 'Measure It', 'Problem-Solving Path', 'Skip Count Steps', 'Time and Graphs', 'Equal Groups', 'Math Adventure'], english: ['Sound and Word Patterns', 'Word Meaning Trail', 'Reading for Meaning', 'Sentence Studio', 'Main Idea Clues', 'Writing Workshop', 'Fluency Forest', 'Text Features', 'Opinion Builder', 'Reading Celebration'], science: ['Water Lab', 'Life Cycle Quest', 'Matter Around Us', 'Weather Watch', 'Earth Change', 'Science Story', 'Habitats Home', 'Force Fair', 'Plant Patterns', 'Science Expedition'], social: ['Community Map', 'Map Makers', 'Helpers and Services', 'Culture Stories', 'Past and Present', 'Smart Choices', 'Government Helpers', 'Goods and Needs', 'Geography Quest', 'Community Quest'] },
  '3': { math: ['Multiply Mountain', 'Division Trail', 'Fair Share Fractions', 'Data Detectives', 'Perimeter Park', 'Word Problem Quest', 'Place Value Power', 'Area Adventure', 'Time and Money', 'Math Summit'], english: ['Vocabulary Trail', 'Main Idea Mission', 'Story Structure', 'Grammar Garage', 'Writing Workshop', 'Reading Evidence', 'Fluency Flight', 'Research Roots', 'Opinion Power', 'Author Studio'], science: ['Force and Motion', 'Ecosystem Explorer', 'Weather Station', 'Matter Changes', 'Life Cycles', 'Earth Patterns', 'Engineering Ideas', 'Light Lab', 'Nature Networks', 'Science Summit'], social: ['Civics City', 'Continent Quest', 'Map Skills', 'History Clues', 'Economy Exchange', 'Culture Connections', 'Government Voices', 'Geography Stories', 'Local History', 'Social Studies Summit'] },
  '4': { math: ['Fraction Forge', 'Decimal Docks', 'Multi-Step Math', 'Geometry Gallery', 'Measurement Lab', 'Data Stories', 'Place Value Pro', 'Factors and Multiples', 'Angle Adventure', 'Math Mastery'], english: ['Word Power', 'Evidence Explorer', 'Text Structure', 'Grammar Studio', 'Essay Builder', 'Research Skills', 'Poetry Path', 'Compare Texts', 'Revision Workshop', 'Publishing Party'], science: ['Energy Lab', 'Matter Makers', 'Earth and Space', 'Living Systems', 'Weather Patterns', 'Design Challenge', 'Waves Workshop', 'Ecosystem Engineers', 'Rock Detectives', 'Science Mastery'], social: ['Region Rangers', 'State Government', 'Map Scale Mission', 'History Detectives', 'Money and Trade', 'Culture Stories', 'Civic Voices', 'Resource Routes', 'State History', 'Social Studies Mastery'] },
  '5': { math: ['Decimal Domain', 'Coordinate Command', 'Fraction Strategies', 'Volume Valley', 'Data Detectives', 'Real-World Math', 'Number System', 'Expressions Explorer', 'Geometry Challenge', 'Math Mastery'], english: ['Academic Words', 'Argument Arena', 'Close Reading', 'Grammar Workshop', 'Research Ranger', 'Strong Writing', 'Theme Trackers', 'Compare Sources', 'Revision Lab', 'Publishing Studio'], science: ['Earth Systems', 'Matter and Energy', 'Water Journey', 'Living Systems', 'Space Explorer', 'Engineering Challenge', 'Ecosystem Balance', 'Waves and Information', 'Design Solutions', 'Science Mastery'], social: ['Democracy District', 'History Detectives', 'Geography Challenge', 'Economy Exchange', 'Culture Connections', 'Civic Action', 'Constitution Quest', 'Global Connections', 'Historical Evidence', 'Social Studies Mastery'] },
};

export const STAGES: Record<SubjectId, StageSyllabus[]> = {
  math: [{ name: 'Number Trail', mission: 'Build number confidence.', skills: ['counting', 'place value'] }, { name: 'Operation Ridge', mission: 'Add, subtract, multiply, and divide.', skills: ['operations', 'fact strategies'] }, { name: 'Shape Pass', mission: 'Notice shapes and space.', skills: ['geometry', 'patterns'] }, { name: 'Measure Meadow', mission: 'Measure the real world.', skills: ['measurement', 'time', 'data'] }, { name: 'Problem Peak', mission: 'Use math to solve a story.', skills: ['reasoning', 'models'] }],
  english: [{ name: 'Sound Grove', mission: 'Hear, read, and spell words.', skills: ['phonics', 'word patterns'] }, { name: 'Reading Trail', mission: 'Understand what you read.', skills: ['fluency', 'main idea'] }, { name: 'Story Clearing', mission: 'Meet characters and ideas.', skills: ['story structure', 'evidence'] }, { name: 'Sentence Workshop', mission: 'Build clear sentences.', skills: ['grammar', 'vocabulary'] }, { name: 'Author Canopy', mission: 'Plan, revise, and share.', skills: ['writing', 'research'] }],
  science: [{ name: 'Wonder Shore', mission: 'Ask and observe.', skills: ['questions', 'observations'] }, { name: 'Life Lagoon', mission: 'Explore living things.', skills: ['plants', 'animals', 'habitats'] }, { name: 'Matter Cove', mission: 'Investigate materials.', skills: ['matter', 'energy'] }, { name: 'Earth Lookout', mission: 'Study weather and Earth.', skills: ['weather', 'Earth systems'] }, { name: 'Design Dock', mission: 'Test and improve ideas.', skills: ['engineering', 'evidence'] }],
  social: [{ name: 'Community Square', mission: 'Learn how communities work.', skills: ['helpers', 'rules'] }, { name: 'Map Market', mission: 'Read places and maps.', skills: ['maps', 'geography'] }, { name: 'History Lane', mission: 'Explore then and now.', skills: ['timeline', 'sources'] }, { name: 'Civic Hall', mission: 'Practice being a citizen.', skills: ['government', 'responsibility'] }, { name: 'World Festival', mission: 'Connect people, cultures, and choices.', skills: ['culture', 'economics'] }],
};

const explanationFor = (title: string, subject: SubjectId, grade: Grade) => {
  const gradeLabel = grade === 'K' ? 'Kindergarten' : `Grade ${grade}`;
  const lessons = {
    math: {
      goal: `In ${title}, you will use models, pictures, and number clues to make one math idea feel visible before you solve it.`,
      example: `Try this routine: read the problem, circle the numbers or shapes that matter, choose a strategy, and check that your answer fits the story.`,
      strategy: 'Math thinkers can draw, count on, make a group, use a number line, or explain their thinking aloud.',
      vocabulary: 'number • model • strategy • explain',
    },
    english: {
      goal: `In ${title}, you will use sounds, word parts, sentence clues, and ideas from a text to become a stronger reader and writer.`,
      example: 'Pause at a clue. Say the word slowly, notice what the sentence is about, then choose the answer that makes the most sense.',
      strategy: 'Readers reread, use context, and point to evidence instead of guessing quickly.',
      vocabulary: 'sound • word • sentence • evidence',
    },
    science: {
      goal: `In ${title}, you will act like a scientist: observe carefully, make a prediction, and use evidence to explain what happens.`,
      example: 'First notice a pattern. Next make a prediction. Then compare what happened with what you thought might happen.',
      strategy: 'Good science answers name an observation and connect it to an idea about the natural world.',
      vocabulary: 'observe • predict • evidence • explain',
    },
    social: {
      goal: `In ${title}, you will use maps, timelines, community examples, and source clues to understand how people and places connect.`,
      example: 'Look for who, where, and when clues. Then decide which map, rule, event, or source best explains the situation.',
      strategy: 'Social scientists ask whose point of view is shown and use evidence before making a conclusion.',
      vocabulary: 'community • map • source • perspective',
    },
  }[subject];
  return { ...lessons, gradeLabel };
};

const practicePrompts = ['Warm up', 'Try another one', 'Look for a clue', 'Think it through', 'Show what you know', 'Keep exploring', 'Use your strategy', 'Try a challenge', 'Check your idea', 'Finish strong'];
const rotateChoices = (question: Quiz, offset: number): Quiz => {
  const choices = question.choices.map((_, index) => question.choices[(index + offset) % question.choices.length]);
  return { ...question, choices, correct: (question.correct - offset + question.choices.length) % question.choices.length };
};
/** Every level presents a calm ten-part practice round; answer positions rotate so memorizing a button never works. */
const tenPartRound = (questions: Quiz[], title: string): Quiz[] => Array.from({ length: 10 }, (_, index) => {
  const base = questions[index % questions.length];
  const round = rotateChoices(base, index % base.choices.length);
  return { ...round, prompt: `${practicePrompts[index]} — ${title}: ${round.prompt}` };
});

export const stageForLevel = (subject: SubjectId, levelIndex: number): StageSyllabus => STAGES[subject][Math.floor(levelIndex / 2)] ?? STAGES[subject][STAGES[subject].length - 1];

function subjectSeeds(grade: Grade, subject: SubjectId): Seed[] {
  const titles = gradeNames[grade][subject];
  if (subject === 'math') return titles.map((title) => ({
    title, concept: `Practice ${title.toLowerCase()}`, gameType: 'answer-dash',
    config: { ...explanationFor(title, subject, grade), ...quiz(tenPartRound(mathQuestions[grade], title)) },
  }));
  if (subject === 'english') return titles.map((title) => ({ title, concept: `Explore ${title.toLowerCase()}`, gameType: 'word-forge', config: { ...explanationFor(title, subject, grade), ...quiz(tenPartRound(wordQuestions[grade], title)) } }));
  if (subject === 'science') return titles.map((title, index) => ({ title, concept: index === 0 ? 'Ask, test, and observe' : `Explore ${title.toLowerCase()}`, gameType: 'answer-dash', config: { ...explanationFor(title, subject, grade), ...quiz(tenPartRound(scienceQuestions[grade], title)) } }));
  return titles.map((title) => ({ title, concept: `Explore ${title.toLowerCase()}`, gameType: 'map-explorer', config: { ...explanationFor(title, subject, grade), ...quiz(tenPartRound(mapQuestions[grade], title)) } }));
}

export function levelsFor(grade: Grade, subject: SubjectId): LevelDefinition[] {
  return subjectSeeds(grade, subject).map((seed, index) => ({
    id: grade + '-' + subject + '-' + index, grade, subject, title: seed.title, concept: seed.concept, gameType: seed.gameType,
    skillId: grade + '.' + subject + '.' + index, config: { ...seed.config, stage: stageForLevel(subject, index) },
  }));
}

export function levelsForGrade(grade: Grade): LevelDefinition[] { return (Object.keys(SUBJECTS) as SubjectId[]).flatMap((subject) => levelsFor(grade, subject)); }
