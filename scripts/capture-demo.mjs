import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const out = 'C:/Users/shobh/Documents/Codex/2026-09-18/we-re-building-a-k-5/outputs/demo/frames';
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
  await cdp('Page.navigate', { url });
  await sleep(1100);
  await clickText('Enter Game School');
  await sleep(450);
  await clickText('Games');
  await snap('07-arcade-subjects');
  await clickText('Math Mountain');
  await snap('08-math-games');
  await cdp('Page.navigate', { url: 'https://game-school.shobhit1kapoor.chatgpt.site/arcade/number-road/index.html' });
  await sleep(2500);
  await clickText('Skip');
  await sleep(450);
  await clickText('Play');
  await sleep(900);
  await snap('09-number-road');
  await cdp('Page.navigate', { url: 'https://game-school.shobhit1kapoor.chatgpt.site/arcade/flowspark-kids/index.html' });
  await sleep(2500);
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: 610, y: 350, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 610, y: 350, button: 'left', clickCount: 1 });
  await sleep(900);
  await snap('10-water-workshop');
  await cdp('Page.navigate', { url });
  await sleep(1300);
  await clickText('Enter Game School');
  await sleep(500);
  await clickText('Rewards');
  await snap('11-rewards');
  await clickText('Leaderboard');
  await snap('12-leaderboard');
} finally {
  socket.close();
  browser.kill();
}
