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

// Type a list of segments into `bubble`, char-by-char, with a blinking caret.
// Returns a Promise that resolves when typing finishes.
function typeAnswer(bubble, segments, charDelay = 14) {
  const caret = document.createElement('span');
  caret.className = 'typing-caret';
  caret.setAttribute('aria-hidden', 'true');
  bubble.appendChild(caret);

  return new Promise((resolve) => {
    let segIdx = 0;
    let charIdx = 0;
    let currentTarget = bubble;

    function step() {
      if (segIdx >= segments.length) {
        caret.remove();
        resolve();
        return;
      }
      const seg = segments[segIdx];
      if (seg.type === 'text') {
        if (charIdx < seg.value.length) {
          caret.insertAdjacentText('beforebegin', seg.value[charIdx]);
          charIdx++;
        } else {
          segIdx++;
          charIdx = 0;
          currentTarget = bubble;
        }
      } else if (seg.type === 'link') {
        if (charIdx === 0) {
          const a = document.createElement('a');
          a.href = seg.href;
          bubble.insertBefore(a, caret);
          currentTarget = a;
        }
        if (charIdx < seg.text.length) {
          currentTarget.appendChild(document.createTextNode(seg.text[charIdx]));
          charIdx++;
        } else {
          segIdx++;
          charIdx = 0;
          currentTarget = bubble;
        }
      }
      window.scrollTo({ top: document.body.scrollHeight });
      setTimeout(step, charDelay);
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
