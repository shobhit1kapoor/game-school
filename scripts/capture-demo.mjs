import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const out = 'C:/Users/shobh/Documents/Codex/2026-09-18/we-re-building-a-k-5/outputs/demo/detailed-frames';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = 'https://game-school.shobhit1kapoor.chatgpt.site/';
await mkdir(out, { recursive: true });

const browser = spawn(chrome, ['--headless=new', '--remote-debugging-port=9229', '--user-data-dir=C:/Users/shobh/AppData/Local/Temp/game-school-demo-chrome', '--window-size=1280,720', url], { stdio: 'ignore', windowsHide: true });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let page;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const pages = await (await fetch('http://127.0.0.1:9229/json')).json();
    page = pages.find((entry) => entry.type === 'page');
    if (page) break;
  } catch { /* Chrome is still starting. */ }
  await sleep(250);
}
if (!page) throw new Error('Headless Chrome did not start');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let nextId = 1;
const pending = new Map();
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  }
};
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
const clickText = (text) => evaluate(`(() => { const el = [...document.querySelectorAll('button,a')].find(x => x.textContent.trim() === ${JSON.stringify(text)} || x.textContent.includes(${JSON.stringify(text)})); if (!el) throw new Error('Missing control: ' + ${JSON.stringify(text)}); el.click(); })()`);
const clickIfPresent = (text) => evaluate(`(() => { const el = [...document.querySelectorAll('button,a')].find(x => x.textContent.trim() === ${JSON.stringify(text)} || x.textContent.includes(${JSON.stringify(text)})); if (el) el.click(); return Boolean(el); })()`);
const navigate = async (path = '') => { await cdp('Page.navigate', { url: path.startsWith('http') ? path : `${url}${path}` }); await sleep(1800); };
const playFirstControl = () => evaluate(`(() => { const controls = [...document.querySelectorAll('button,a')].filter(x => !x.disabled && x.offsetParent); const preferred = controls.find(x => /play|start|go|begin|skip|continue/i.test(x.textContent)); (preferred || controls[0])?.click(); })()`);
const snap = async (name) => {
  await sleep(800);
  const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(join(out, `${name}.png`), Buffer.from(data, 'base64'));
};

try {
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  await sleep(1800);
  await snap('01-landing');
  await clickText('Start exploring');
  await snap('02-home');
  await clickText('Avery');
  await snap('03-profile');
  await clickText('Save my profile');
  await clickText('World Map');
  await snap('04-world-map');
  await clickText('Math Mountain');
  await snap('05-math-stage');
  await clickText('Learn & play');
  await snap('06-concept-lesson');
  await clickText('Start 10-part practice');
  await snap('07-quiz-question-1');
  await clickText('74');
  await sleep(180);
  await snap('08-quiz-feedback-1');
  await sleep(520);
  await snap('09-quiz-question-2');
  await clickText('37');
  await sleep(180);
  await snap('10-quiz-feedback-2');
  await sleep(520);
  await snap('11-quiz-question-3');
  await clickText('70');
  await sleep(180);
  await snap('12-quiz-feedback-3');
  await sleep(520);
  // Finish the remaining parts with their correct answer pattern so the tour shows completion.
  for (const answer of ['74', '37', '70', '74', '37', '70', '74']) { await clickText(answer); await sleep(560); }
  await snap('13-lesson-complete');
  await navigate();
  await clickText('Enter Game School');
  await sleep(450);
  await clickText('Games');
  await snap('14-arcade-subjects');
  await clickText('Math Mountain');
  await snap('15-math-games');
  await navigate('arcade/number-road/index.html');
  await sleep(1000);
  await clickIfPresent('Skip');
  await sleep(450);
  await clickIfPresent('Play');
  await sleep(900);
  await snap('16-number-road');
  await navigate('arcade/ocean-math-quest/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('17-deep-sea-numbers');
  await navigate('arcade/mathivities/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('18-puzzle-playground');
  await navigate('arcade/multiply-island/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('19-multiply-island');
  await navigate('arcade/number-nest/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('20-number-nest');
  await navigate('arcade/flowspark-kids/index.html');
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: 610, y: 350, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 610, y: 350, button: 'left', clickCount: 1 });
  await sleep(900);
  await snap('21-water-workshop');
  await navigate('arcade/follow-the-drop/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('22-water-drop-journey');
  await navigate('arcade/chemicraft/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('23-science-mix-lab');
  await navigate('arcade/wordquest/index.html');
  await clickIfPresent('Continue quest');
  await sleep(700);
  await snap('24-word-wizard');
  await navigate('arcade/pic-phonics/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('25-sound-picture');
  await navigate('arcade/time-travel-courier/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('26-history-delivery');
  await navigate('arcade/world-chase/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('27-world-chase');
  await navigate('arcade/time-trail/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('28-time-trail');
  await navigate('arcade/secret-history-codes/index.html');
  await playFirstControl();
  await sleep(700);
  await snap('29-secret-history-codes');
  await navigate();
  await clickText('Enter Game School');
  await sleep(500);
  await clickText('Rewards');
  await snap('30-rewards');
  await clickText('Leaderboard');
  await snap('31-leaderboard');
} finally {
  socket.close();
  browser.kill();
}
