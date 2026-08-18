// Chat scaffold. Submitting a query appends a user bubble + canned assistant reply.
// Featured/pinned results are static HTML in index.html.

const transcript = document.getElementById('transcript');
const form = document.querySelector('.chat__composer');
const input = document.querySelector('#composer-input');

// Canned answer for the default test-optional question. Segments are typed in
// order; "link" segments produce an inline anchor.
const cannedAnswer = [
  { type: 'text', value: "Yes — the University of Maryland is currently test-optional through the Spring and Fall 2025 application cycles. First-year applicants may choose whether or not to submit SAT or ACT scores, and applications without scores receive equal consideration in the holistic review process. As part of the online application, you'll indicate your test-optional status; if you do submit scores, the Admissions Committee will consider them alongside your academic record, essays, and extracurricular involvement. For deadlines, required materials, and guidance on whether submitting scores is right for your application, see the " },
  { type: 'link', text: 'Freshman Application Requirements', href: 'https://admissions.umd.edu/apply/freshman-application-requirements' },
  { type: 'text', value: ' page.' }
];

function createAssistantBubble() {
  const article = document.createElement('article');
  article.className = 'msg msg--assistant';
  const avatar = document.createElement('img');
  avatar.className = 'msg__avatar';
  avatar.src = 'assets/chat-icon.png';
  avatar.alt = '';
  const bubble = document.createElement('div');
  bubble.className = 'msg__bubble umd-sans-larger';
  article.appendChild(avatar);
  article.appendChild(bubble);
  transcript.appendChild(article);
  return bubble;
}

function appendMessage(role, text) {
  const article = document.createElement('article');
  article.className = `msg msg--${role}`;
  const avatarSrc = role === 'assistant' ? 'assets/chat-icon.png' : 'assets/person-icon.svg';
  const bubbleClass = role === 'assistant' ? 'umd-sans-larger' : 'umd-sans-medium';

  const avatar = document.createElement('img');
  avatar.className = 'msg__avatar';
  avatar.src = avatarSrc;
  avatar.alt = '';

  const bubble = document.createElement('div');
  bubble.className = `msg__bubble ${bubbleClass}`;
  bubble.textContent = text;

  if (role === 'assistant') {
    article.appendChild(avatar);
    article.appendChild(bubble);
  } else {
    article.appendChild(bubble);
    article.appendChild(avatar);
  }
  transcript.appendChild(article);
}

// Type a list of segments into `bubble`, word-by-word, with a blinking caret.
// Returns a Promise that resolves when typing finishes.
function typeAnswer(bubble, segments, wordDelay = 60) {
  const caret = document.createElement('span');
  caret.className = 'typing-caret';
  caret.setAttribute('aria-hidden', 'true');
  bubble.appendChild(caret);

  // Flatten segments into word-level tokens. Text segments split on word
  // boundaries (each token includes trailing whitespace). Link segments are
  // inserted whole as a single token.
  const tokens = [];
  for (const seg of segments) {
    if (seg.type === 'text') {
      for (const word of (seg.value.match(/\S+\s*/g) || [])) {
        tokens.push({ type: 'text', value: word });
      }
    } else if (seg.type === 'link') {
      tokens.push(seg);
    }
  }

  return new Promise((resolve) => {
    let idx = 0;
    function step() {
      if (idx >= tokens.length) {
        caret.remove();
        resolve();
        return;
      }
      const tok = tokens[idx++];
      if (tok.type === 'text') {
        caret.insertAdjacentText('beforebegin', tok.value);
      } else if (tok.type === 'link') {
        const a = document.createElement('a');
        a.href = tok.href;
        a.textContent = tok.text;
        bubble.insertBefore(a, caret);
      }
      window.scrollTo({ top: document.body.scrollHeight });
      setTimeout(step, wordDelay);
    }
    step();
  });
}

function startDefaultAnswer(delay = 600) {
  setTimeout(() => {
    const bubble = createAssistantBubble();
    typeAnswer(bubble, cannedAnswer).then(revealLoadMoreBtn);
  }, delay);
}

function revealLoadMoreBtn() {
  const btn = document.getElementById('featured-load-more');
  if (btn) btn.hidden = false;
}

const params = new URLSearchParams(window.location.search);
const initialQ = params.get('q');

if (initialQ && initialQ.trim()) {
  // Replace static sample with the user's query, then type the canned answer
  // (demo always returns the test-optional response regardless of input).
  transcript.innerHTML = '';
  appendMessage('user', initialQ.trim());
  startDefaultAnswer();
} else {
  startDefaultAnswer();
}

// Load more featured results
const loadMoreBtn = document.getElementById('featured-load-more');
const moreList = document.getElementById('featured-list-more');
if (loadMoreBtn && moreList) {
  loadMoreBtn.addEventListener('click', () => {
    const expanded = !moreList.hidden;
    moreList.hidden = expanded;
    loadMoreBtn.textContent = expanded ? 'See more' : 'See less';
    loadMoreBtn.setAttribute('aria-expanded', String(!expanded));
    if (!expanded && window.UmdWebComponents && window.UmdWebComponents.LoadUmdComponents) {
      window.UmdWebComponents.LoadUmdComponents();
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  appendMessage('user', q);
  setTimeout(() => {
    const bubble = createAssistantBubble();
    typeAnswer(bubble, [
      { type: 'text', value: `(stub) You asked: "${q}". Backend not wired up yet.` }
    ]);
  }, 250);
  input.value = '';
});
