import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, CircleHelp, Gamepad2, Gift, Home, Map, Medal, Music2, Play, ShieldCheck, Sparkles, Star, Trophy, UsersRound } from 'lucide-react';
import brightpathLogo from './assets/brightpath-logo.png';
import worldMarkers from './assets/world-markers.png';
import worldMap from './assets/questwood-world-map.png';
import arcadeScenes from './assets/arcade-subject-scenes.png';
import mathGameCovers from './assets/math-game-covers.png';
import arcadeGameCovers from './assets/arcade-game-covers.png';
import socialGameCovers from './assets/social-game-covers.png';
import mathLevelCovers from './assets/math-level-covers.png';
import mathLessonCovers from './assets/math-lesson-covers.png';
import englishLessonCovers from './assets/english-lesson-covers.png';
import scienceLessonCovers from './assets/science-lesson-covers.png';
import socialLessonCovers from './assets/social-lesson-covers.png';
import landingHero from './assets/brightpath-landing-hero.png';
import landingSubjectWorlds from './assets/landing-subject-worlds.png';
import { GRADES, levelsFor, levelsForGrade, STAGES, SUBJECTS } from './content/catalog';
import { gradeWillBeComplete, nextGradeAfter } from './domain/gradeProgression';
import { commitAttempt, levelState, markLessonLearned, starsForResult } from './domain/progression';
import type { GameResult, Grade, LevelDefinition, QuestwoodState, SubjectId } from './domain/types';
import { GameHost } from './games/GameHost';
import { createInitialState, loadPersistentState, resetState, savePersistentState } from './persistence/store';
import { enableBrightpathClickSounds, playSound } from './lib/sound';

type View = 'home' | 'map' | 'subjects' | 'games' | 'collection' | 'leaderboard' | 'grownups';

const NAVIGATION: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home }, { id: 'map', label: 'World Map', icon: Map }, { id: 'subjects', label: 'My Subjects', icon: BookOpen }, { id: 'games', label: 'Games', icon: Gamepad2 }, { id: 'collection', label: 'Rewards', icon: Gift }, { id: 'leaderboard', label: 'Leaderboard', icon: Medal }, { id: 'grownups', label: 'Grown-ups', icon: UsersRound },
];

export default function App() {
  const [state, setState] = useState<QuestwoodState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>('home');
  const [subject, setSubject] = useState<SubjectId>('math');
  const [activeLevel, setActiveLevel] = useState<LevelDefinition | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [music, setMusic] = useState('Quiet forest');
  const [arcadeSubject, setArcadeSubject] = useState<SubjectId | null>(null);
  const [showAcademy, setShowAcademy] = useState(false);
  const grade = state.profile.selectedGrade;
  const levels = useMemo(() => levelsFor(grade, subject), [grade, subject]);
  const completed = Object.values(state.progress).filter((item) => item.state === 'complete').length;

  useEffect(() => { void loadPersistentState().then((loaded) => { setState(loaded); setHydrated(true); }); }, []);
  useEffect(() => { if (hydrated) void savePersistentState(state); }, [hydrated, state]);
  useEffect(() => enableBrightpathClickSounds(), []);

  const switchGrade = (next: Grade) => setState((current) => ({ ...current, profile: { ...current.profile, selectedGrade: next } }));
  const finishLevel = (result: GameResult) => {
    if (!activeLevel) return;
    const completesGrade = gradeWillBeComplete(state, activeLevel, result.accuracy);
    const nextGrade = nextGradeAfter(activeLevel.grade);
    setState((current) => {
      const updated = commitAttempt(current, activeLevel, result, crypto.randomUUID());
      return completesGrade && nextGrade ? { ...updated, profile: { ...updated.profile, selectedGrade: nextGrade } } : updated;
    });
    const earned = starsForResult(result);
    if (earned) playSound('reward');
    setNotice(completesGrade && nextGrade ? `Grade ${activeLevel.grade} is complete! Welcome to Grade ${nextGrade}.` : completesGrade ? 'You finished Grade 5! You completed the Brightpath journey.' : earned ? `Wonderful work! You earned ${earned} stars for learning and completing this lesson.` : 'Good exploring. Try this level again whenever you feel ready.');
    setActiveLevel(null);
  };
  const chooseSubject = (next: SubjectId) => { setSubject(next); setView('subjects'); };
  const learnLesson = (level: LevelDefinition) => { playSound('reward'); setState((current) => markLessonLearned(current, level)); };

  if (!showAcademy) return <LandingPage onEnter={() => setShowAcademy(true)} />;

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><img src={brightpathLogo} alt="" /></span><span>Bright<br />path</span></div>
      <nav aria-label="Main navigation">{NAVIGATION.map(({ id, label, icon: Icon }) => <button className={view === id ? 'nav-item active' : 'nav-item'} onClick={() => setView(id)} key={id}><Icon size={23} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="safe-note"><ShieldCheck size={18} /><span>Local progress<br />saved on this device</span></div><button className="help-button"><CircleHelp size={19} /> Help</button></div>
    </aside>
    <section className="main-content">
      <header className="topbar"><label className="grade-picker">Grade <select value={grade} onChange={(event) => switchGrade(event.target.value as Grade)}>{GRADES.map((item) => <option key={item} value={item}>{item === 'K' ? 'Kindergarten' : item}</option>)}</select><ChevronDown size={17} /></label><div className="profile-bar"><label className="music-picker"><Music2 size={18} /><select aria-label="Background music" value={music} onChange={(event) => setMusic(event.target.value)}><option>Quiet forest</option><option>Mountain breeze</option><option>Ocean sparkle</option><option>Music off</option></select></label><button className="profile-edit" onClick={() => setEditingProfile(true)}><span className="avatar">{state.profile.avatar}</span><strong>{state.profile.name}</strong></button><span className="star-count"><Star size={18} fill="currentColor" /> {state.profile.stars} stars</span></div></header>
      {view === 'home' && <HomeView state={state} grade={grade} subject={subject} levels={levels} onSubject={chooseSubject} onPlay={setActiveLevel} onMap={() => setView('map')} />}
      {view === 'map' && <MapView grade={grade} onSubject={chooseSubject} />}
      {view === 'subjects' && <SubjectView subject={subject} levels={levels} state={state} onSubject={setSubject} onPlay={setActiveLevel} onArcade={(nextSubject) => { setArcadeSubject(nextSubject); setView('games'); }} />}
      {view === 'games' && <GamesView subject={arcadeSubject} onChooseSubject={setArcadeSubject} />}
      {view === 'collection' && <CollectionView completed={completed} profile={state.profile} />}
      {view === 'leaderboard' && <LeaderboardView profile={state.profile} />}
      {view === 'grownups' && <GrownupsView state={state} onReset={() => { setState(resetState()); setNotice('Local demo profile reset.'); }} />}
    </section>
    {activeLevel && <div className="modal-backdrop"><GameHost level={activeLevel} onLearned={() => learnLesson(activeLevel)} onFinish={finishLevel} onExit={() => setActiveLevel(null)} /></div>}
    {notice && <div className="toast" role="status"><Sparkles size={19} />{notice}<button onClick={() => setNotice(null)} aria-label="Dismiss message">×</button></div>}
    {editingProfile && <ProfileEditor profile={state.profile} onClose={() => setEditingProfile(false)} onSave={(name, age, avatar) => { setState((current) => ({ ...current, profile: { ...current.profile, name, age, avatar } })); setEditingProfile(false); }} />}
  </main>;
}

function LandingPage({ onEnter }: { onEnter: () => void }) {
  const scrollToHow = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <main className="landing-page">
    <header className="landing-nav"><button className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><img src={brightpathLogo} alt="" /><span>Bright<br />path</span></button><nav aria-label="Landing navigation"><button onClick={scrollToHow}>How it works</button><button onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })}>Subjects</button></nav><button className="landing-login" onClick={onEnter}>Enter academy <Play size={16} fill="currentColor" /></button></header>
    <section className="landing-hero"><img src={landingHero} alt="Children and an owl guide walking toward Brightpath learning worlds" /><div className="landing-hero-copy"><p>Learning feels like an adventure.</p><h1>A K–5 school built like a world to explore.</h1><p className="landing-lede">Brightpath turns school into a clear, child-friendly journey: choose a grade, enter a subject world, learn one concept at a time, then show what you know through playful practice and games.</p><div className="landing-actions"><button className="landing-primary" onClick={onEnter}>Start exploring <Play size={18} fill="currentColor" /></button><button className="landing-secondary" onClick={scrollToHow}>See how Brightpath works</button></div><div className="landing-trust"><span>✦ Kindergarten–Grade 5</span><span>✦ 240 lessons</span><span>✦ 14 local games</span><span>✦ No ads</span></div></div></section>
    <section className="landing-intro" id="how-it-works"><p>Brightpath makes the next step feel clear.</p><h2>A school journey with stages, lessons, and game checkpoints.</h2><p className="landing-detail">Each grade is a school stage. Inside every stage, children choose Math, English, Science, or Social Studies. Every subject has 10 lessons; each lesson is a class with a guided explanation, a worked example, and 10 practice parts. There are no traditional exams—students demonstrate growth by completing an end-of-stage game and building a personal high score.</p><div className="landing-steps"><article><span>01</span><strong>Choose a grade</strong><p>Start in Kindergarten or Grades 1–5. Content, vocabulary, and challenge rise with the learner.</p></article><article><span>02</span><strong>Learn one lesson</strong><p>Each lesson explains one idea first, then offers a calm 10-part interactive practice round.</p></article><article><span>03</span><strong>Play the checkpoint</strong><p>Complete a stage, play a subject game, earn a high score, stars, badges, and leaderboard progress.</p></article></div></section>
    <section className="landing-subjects" id="subjects" style={{ '--landing-subject-worlds': `url(${landingSubjectWorlds})` } as React.CSSProperties}><div><p>Four worlds. So many discoveries.</p><h2>Every subject is a place children want to visit.</h2><span className="landing-section-note">Explore Math Mountain, Story Forest, Discovery Island, and Community Town. More local game adventures are being added.</span></div><div className="landing-subject-list">{(Object.keys(SUBJECTS) as SubjectId[]).map((id) => <button key={id} className={`landing-subject ${id}`} onClick={onEnter}><i className="landing-subject-art" aria-hidden="true" /><span>{SUBJECTS[id].emoji}</span><strong>{SUBJECTS[id].subjectName}</strong><small>{SUBJECTS[id].label}</small><em>{id === 'math' ? 'Numbers, patterns, and problem-solving' : id === 'english' ? 'Reading, writing, and language' : id === 'science' ? 'Experiments, nature, and discovery' : 'Maps, communities, and history'}</em><b>Explore this world →</b></button>)}</div></section>
    <section className="landing-cta"><div><p>Ready when they are.</p><h2>Let curiosity lead the way.</h2><span>Start with one world. There is always another adventure waiting.</span></div><button className="landing-primary" onClick={onEnter}>Enter Brightpath <Play size={18} fill="currentColor" /></button></section>
    <footer className="landing-footer"><span>© Brightpath Academy</span><span>Learning made with wonder.</span></footer>
  </main>;
}

const ARCADE_GAMES: Record<SubjectId, Array<{ title: string; note: string; href?: string; art?: number; cover?: 'math' | 'arcade' | 'social' }>> = {
  math: [{ title: 'Cannon Target', note: 'Aim at the right number', art: 0, cover: 'math' }, { title: 'Number Road', note: 'Drive to the right answer', href: '/arcade/number-road/index.html', art: 1, cover: 'math' }, { title: 'Puzzle Playground', note: 'Solve colorful math puzzles', href: '/arcade/mathivities/index.html', art: 2, cover: 'math' }, { title: 'Deep Sea Numbers', note: 'Explore number oceans', href: '/arcade/ocean-math-quest/index.html', art: 3, cover: 'math' }, { title: 'Multiply Island', note: 'A multiplication treasure trip', href: '/arcade/multiply-island/index.html', art: 4, cover: 'math' }, { title: 'Number Nest', note: 'Light stars by solving number puzzles', href: '/arcade/number-nest/index.html', art: 5, cover: 'math' }],
  science: [{ title: 'Water Workshop', note: 'Build and test tiny experiments', href: '/arcade/flowspark-kids/index.html', art: 2, cover: 'arcade' }, { title: 'Space Explorer', note: 'English version coming soon' }, { title: 'Water Drop Journey', note: 'Travel through the water cycle', href: '/arcade/follow-the-drop/index.html', art: 3, cover: 'arcade' }, { title: 'Science Mix Lab', note: 'Mix, discover, and learn', href: '/arcade/chemicraft/index.html', art: 4, cover: 'arcade' }, { title: 'Animal Safari', note: 'Meet animals from around the world' }, { title: 'Space Pals', note: 'A space science adventure' }],
  social: [{ title: 'History Delivery', note: 'Carry important messages through time', href: '/arcade/time-travel-courier/index.html', art: 0, cover: 'social' }, { title: 'Community Choices', note: 'Learn how a town works' }, { title: 'World Chase', note: 'Discover places and maps', href: '/arcade/world-chase/index.html', art: 1, cover: 'social' }, { title: 'Around the World', note: 'Explore countries and landmarks' }, { title: 'Time Trail', note: 'Put history in order', href: '/arcade/time-trail/index.html', art: 2, cover: 'social' }, { title: 'Secret History Codes', note: 'Solve history puzzles', href: '/arcade/secret-history-codes/index.html', art: 3, cover: 'social' }],
  english: [{ title: 'Word Wizard', note: 'Spell words in magical worlds', href: '/arcade/wordquest/index.html', art: 0, cover: 'arcade' }, { title: 'Reading Trail', note: 'A phonics reading journey' }, { title: 'Sound & Picture', note: 'Match first sounds to pictures', href: '/arcade/pic-phonics/index.html', art: 1, cover: 'arcade' }, { title: 'Word Garden', note: 'Grow your vocabulary' }, { title: 'Grammar Castle', note: 'Build strong sentences' }, { title: 'Story Adventure', note: 'Read and explore stories' }],
};
function GamesView({ subject, onChooseSubject }: { subject: SubjectId | null; onChooseSubject: (subject: SubjectId | null) => void }) {
  if (!subject) return <div className="simple-page games-page" style={{ '--arcade-scenes': `url(${arcadeScenes})` } as React.CSSProperties}><h1>Game Arcade</h1><p className="intro">Choose a subject to see its games.</p><section className="arcade-subject-grid">{(Object.keys(SUBJECTS) as SubjectId[]).map((id) => <button className={`arcade-subject-card ${id}`} onClick={() => onChooseSubject(id)} key={id}><i className="arcade-art" /><strong>{SUBJECTS[id].subjectName}</strong><small>{SUBJECTS[id].label}</small></button>)}</section></div>;
  const info = SUBJECTS[subject];
  return <div className="simple-page games-page" style={{ '--math-game-covers': `url(${mathGameCovers})`, '--arcade-game-covers': `url(${arcadeGameCovers})`, '--social-game-covers': `url(${socialGameCovers})` } as React.CSSProperties}>
    <button className="link-button arcade-back" onClick={() => onChooseSubject(null)}>← All subjects</button><h1>{info.subjectName} Games</h1><p className="intro">{info.label}: choose a game to play.</p>
    <section className="game-block-grid">{ARCADE_GAMES[subject].filter((game) => game.href).map((game) => <article className={`game-block ${subject}`} key={game.title}>
      {game.art !== undefined ? <i className={`game-cover ${game.cover === 'math' ? 'math-cover' : game.cover === 'social' ? 'social-game-cover' : 'arcade-game-cover'} cover-${game.art}`} /> : <span>{info.emoji}</span>}
      <h2>{game.title}</h2><p>{game.note}</p><a className="primary-button" href={game.href}>Play game</a>
    </article>)}</section>
  </div>;
}
function ProfileEditor({ profile, onClose, onSave }: { profile: QuestwoodState['profile']; onClose: () => void; onSave: (name: string, age: number, avatar: string) => void }) { const [name, setName] = useState(profile.name); const [age, setAge] = useState(profile.age ?? 7); const [avatar, setAvatar] = useState(profile.avatar); const avatars = ['🦉', '🦊', '🐰', '🐼', '🐱', '🦦']; return <div className="modal-backdrop"><section className="profile-editor" role="dialog" aria-modal="true"><button className="icon-button" onClick={onClose}>×</button><h2>My profile</h2><label>My name<input value={name} maxLength={24} onChange={(event) => setName(event.target.value)} /></label><label>My age<input type="number" min="4" max="12" value={age} onChange={(event) => setAge(Number(event.target.value))} /></label><p>Choose your helper</p><div className="avatar-choices">{avatars.map((item) => <button className={avatar === item ? 'selected' : ''} onClick={() => setAvatar(item)} key={item}>{item}</button>)}</div><button className="primary-button" onClick={() => onSave(name.trim() || profile.name, Math.max(4, Math.min(12, age || 7)), avatar)}>Save my profile</button></section></div>; }

function HomeView({ state, grade, subject, levels, onSubject, onPlay, onMap }: { state: QuestwoodState; grade: Grade; subject: SubjectId; levels: LevelDefinition[]; onSubject: (value: SubjectId) => void; onPlay: (level: LevelDefinition) => void; onMap: () => void }) {
  const next = levels.find((level) => levelState(level, state) !== 'locked' && levelState(level, state) !== 'complete') ?? levels[0];
  const allGradeLevels = levelsForGrade(grade); const gradeComplete = allGradeLevels.filter((level) => state.progress[level.id]?.state === 'complete').length;
  return <div className="home-view">
    <section className="welcome-row"><div><h1>What would you like to explore today, {state.profile.name}?</h1><p className="intro">Choose a world, follow your curiosity, and build your way through Grade {grade}.</p></div></section>
    <section className="home-atlas">
      <section className="world-card" style={{ '--world-markers': `url(${worldMarkers})` } as React.CSSProperties}><img src={worldMap} alt="Brightpath world with mountains, forest, laboratory island and community town" /><div className="map-heading"><span>Grade {grade} World</span><strong>Choose a subject</strong></div><button className="world-pin pin-math" onClick={() => onSubject('math')}><i className="world-marker marker-math" aria-hidden="true" /> Math Mountain</button><button className="world-pin pin-english" onClick={() => onSubject('english')}><i className="world-marker marker-english" aria-hidden="true" /> Story Forest</button><button className="world-pin pin-science" onClick={() => onSubject('science')}><i className="world-marker marker-science" aria-hidden="true" /> Discovery Island</button><button className="world-pin pin-social" onClick={() => onSubject('social')}><i className="world-marker marker-social" aria-hidden="true" /> Community Town</button><button className="map-link" onClick={onMap}>Open full map <Map size={17} /></button></section>
      <aside className="home-rail"><div className="owl-note"><span className="owl">🦉</span><div><strong>Curiosity opens new worlds.</strong><p>Pick any path that feels exciting.</p></div></div><div className="next-quest"><p className="overline">CONTINUE LEARNING</p><div className="section-title"><h2>{SUBJECTS[subject].emoji} {next.title}</h2></div><p>{next.concept}</p><button className="primary-button" onClick={() => onPlay(next)}><Play size={18} fill="currentColor" /> Start lesson</button><div className="grade-progress"><span>Grade {grade} journey</span><strong>{gradeComplete} of {allGradeLevels.length}</strong><progress max={allGradeLevels.length} value={gradeComplete} /></div></div><div className="today-card"><div className="section-title"><h2>Today’s little wins</h2><Trophy color="#e7ad24" /></div><ul><li><span>✓</span> Explore any lesson</li><li><span>○</span> Earn 3 stars</li></ul><p className="small-copy">{state.completedToday} quest{state.completedToday === 1 ? '' : 's'} completed today.</p></div></aside>
    </section>
    <section className="learning-guide" aria-labelledby="learning-guide-title"><div><h2 id="learning-guide-title">Your Grade {grade} learning guide</h2><p>Pick any subject, read the mini-lesson, answer 10 practice parts, then earn stars for completing the lesson.</p></div><ol><li><span>1</span><strong>Choose a world</strong><small>Math, English, Science, or Social Studies</small></li><li><span>2</span><strong>Learn the idea</strong><small>A clear example comes before practice</small></li><li><span>3</span><strong>Play 10 parts</strong><small>Use what you learned, at your own pace</small></li><li><span>4</span><strong>Earn stars</strong><small>Completion, accuracy, and steady speed count</small></li></ol><p className="guide-progress"><strong>{gradeComplete} / {allGradeLevels.length}</strong> Grade {grade} lessons completed</p></section>
  </div>;
}

function MapView({ grade, onSubject }: { grade: Grade; onSubject: (subject: SubjectId) => void }) { return <div className="map-page"><div className="page-title"><p className="overline">GRADE {grade} WORLD</p><h1>Every path leads to a discovery.</h1><p>Choose a subject district to see its current quests.</p></div><section className="world-card large-map" style={{ '--world-markers': `url(${worldMarkers})` } as React.CSSProperties}><img src={worldMap} alt="Brightpath world map" />{(Object.keys(SUBJECTS) as SubjectId[]).map((id) => <button className={`world-pin pin-${id}`} key={id} onClick={() => onSubject(id)}><i className={`world-marker marker-${id}`} aria-hidden="true" /> {SUBJECTS[id].subjectName} · {SUBJECTS[id].label}</button>)}</section></div>; }

function SubjectView({ subject, levels, state, onSubject, onPlay, onArcade }: { subject: SubjectId; levels: LevelDefinition[]; state: QuestwoodState; onSubject: (value: SubjectId) => void; onPlay: (level: LevelDefinition) => void; onArcade: (value: SubjectId) => void }) {
  const info = SUBJECTS[subject];
  return <div className="subject-page" style={{ '--math-level-covers': `url(${mathLevelCovers})`, '--math-lesson-covers': `url(${mathLessonCovers})`, '--english-lesson-covers': `url(${englishLessonCovers})`, '--science-lesson-covers': `url(${scienceLessonCovers})`, '--social-lesson-covers': `url(${socialLessonCovers})`, '--arcade-scenes': `url(${arcadeScenes})` } as React.CSSProperties}>
    <div className="subject-header" style={{ '--subject-color': info.color } as React.CSSProperties}><span>{info.emoji}</span><div><p className="overline">YOUR SUBJECT DISTRICT</p><h1>{info.subjectName} · {info.label}</h1><p>{info.description} Every stage includes two guided lessons and an optional game checkpoint.</p></div></div>
    <div className="subject-tabs">{(Object.keys(SUBJECTS) as SubjectId[]).map((id) => <button className={subject === id ? 'selected' : ''} onClick={() => onSubject(id)} key={id}>{SUBJECTS[id].emoji} {SUBJECTS[id].subjectName}</button>)}</div>
    <section className="stage-list">{STAGES[subject].map((stage, stageIndex) => {
      const stageLevels = levels.slice(stageIndex * 2, stageIndex * 2 + 2);
      const stageDone = stageLevels.every((level) => state.progress[level.id]?.state === 'complete');
      return <section className="stage-section" key={stage.name}><header><div><span>Stage {stageIndex + 1}</span><h2>{stage.name}</h2><p>{stage.mission}</p></div><p className="stage-skills">{stage.skills.join(' · ')}</p></header><div className="level-rail">{stageLevels.map((level, offset) => { const index = stageIndex * 2 + offset; const current = levelState(level, state); const mastery = state.mastery[level.skillId]?.score ?? 0; const cover = subject === 'math' ? `math-lesson-cover lesson-${index}` : subject === 'english' ? `english-lesson-cover lesson-${index}` : subject === 'science' ? `science-lesson-cover lesson-${index}` : `social-lesson-cover lesson-${index}`; return <article className={`level-card ${current}`} key={level.id}><i className={`level-cover ${cover}`} /><div className="level-card-content"><div className="level-number">{current === 'complete' ? '✓' : index + 1}</div><p className="overline">Lesson {index + 1} · 10 parts</p><h2>{level.title}</h2><h3>{level.concept}</h3><p>{current === 'complete' ? `Mastery: ${mastery}%` : 'Guided concept lesson, then 10 original practice parts.'}</p><button className={current === 'complete' ? 'secondary-button' : 'primary-button'} onClick={() => onPlay(level)}>{current === 'complete' ? 'Play again' : <><Play size={17} fill="currentColor" /> Learn &amp; play</>}</button></div></article>; })}</div><aside className={`stage-checkpoint ${stageDone ? 'complete' : ''}`}><div><span>{stageDone ? 'Stage complete' : 'Optional stage game'}</span><strong>{stageDone ? 'Put your learning into play!' : 'A game checkpoint is ready whenever you are.'}</strong><p>{stageDone ? 'Set a personal high score in a subject game and keep collecting stars.' : 'Finish both lessons to mark this stage complete. Games are always available—there are no locked game doors.'}</p></div><button className={stageDone ? 'primary-button' : 'secondary-button'} onClick={() => onArcade(subject)}><Gamepad2 size={18} /> {stageDone ? 'Play for a high score' : 'Browse games'}</button></aside></section>;
    })}</section>
  </div>;
}

function rankingsFor(profile: QuestwoodState['profile']) { return [{ name: 'Noah', avatar: '🧒🏾', stars: 68 }, { name: 'Lily', avatar: '👩🏻‍🦰', stars: 54 }, { name: profile.name, avatar: profile.avatar, stars: profile.stars, current: true }, { name: 'Mateo', avatar: '🧑🏽‍🦱', stars: 31 }, { name: 'Zoe', avatar: '👧🏻', stars: 22 }].sort((a, b) => b.stars - a.stars); }

function FriendlyLeaderboard({ profile }: { profile: QuestwoodState['profile'] }) { const rankings = rankingsFor(profile); return <section className="leaderboard" aria-label="Friendly demo leaderboard"><div className="leaderboard-title"><div><p className="overline">DEMO FRIENDS</p><h2>Friendly leaderboard</h2></div><Medal /></div><ol>{rankings.map((entry, index) => <li className={entry.current ? 'current' : ''} key={entry.name}><b>{index + 1}</b><span className="rank-avatar">{entry.avatar}</span><strong>{entry.name}</strong><span><Star fill="currentColor" /> {entry.stars}</span></li>)}</ol><p>Local demo only—your own stars update when you finish lessons.</p></section>; }

function CollectionView({ completed, profile }: { completed: number; profile: QuestwoodState['profile'] }) { const badges = [{ icon: '🌱', title: 'First Spark', note: 'Earn your first star', unlocked: profile.stars >= 1 }, { icon: '📚', title: 'Lesson Explorer', note: 'Complete 3 quests', unlocked: completed >= 3 }, { icon: '🏔️', title: 'Trailblazer', note: 'Earn 25 stars', unlocked: profile.stars >= 25 }]; return <div className="simple-page rewards-page"><p className="overline">YOUR REWARDS</p><h1>Every small step earns a bright reward.</h1><p className="intro">Each completed lesson earns 5 stars, plus accuracy and steady-speed bonuses.</p><div className="reward-layout"><section className="reward-panel"><div className="reward-total"><Star fill="currentColor" /><div><strong>{profile.stars}</strong><span>stars earned</span></div></div><div className="reward-stats"><span><Trophy />{completed} quests</span><span><Sparkles />{Math.max(1, Math.ceil(profile.stars / 10))} bright badges</span></div><div className="badge-row">{badges.map((badge) => <article className={badge.unlocked ? 'badge-card unlocked' : 'badge-card'} key={badge.title}><span>{badge.icon}</span><strong>{badge.title}</strong><small>{badge.unlocked ? badge.note : 'Keep exploring to unlock'}</small></article>)}</div></section><FriendlyLeaderboard profile={profile} /></div></div>; }

function LeaderboardView({ profile }: { profile: QuestwoodState['profile'] }) { return <div className="simple-page leaderboard-page"><h1>Leaderboard</h1><p className="intro">Celebrate progress with a friendly local demo. Your position changes as you earn lesson stars.</p><FriendlyLeaderboard profile={profile} /></div>; }

function GrownupsView({ state, onReset }: { state: QuestwoodState; onReset: () => void }) { const records = Object.values(state.mastery); return <div className="simple-page grownups"><p className="overline">LOCAL GROWN-UPS VIEW</p><h1>Learning progress for {state.profile.name}</h1><p className="intro">This local view shows real saved practice from this device. There are no accounts, ads, or trackers.</p><div className="mastery-list">{records.length === 0 ? <p>No completed quests yet. Play a level to see mastery grow here.</p> : records.map((record) => <div key={record.skillId}><div><strong>{record.skillId.replaceAll('.', ' · ')}</strong><span>{record.score}% mastery</span></div><progress max="100" value={record.score} /></div>)}</div><button className="danger-button" onClick={onReset}>Reset local demo profile</button></div>; }
