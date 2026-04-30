// Chat scaffold. Submitting a query appends a user bubble + canned assistant reply.
// Featured/pinned results are static HTML in index.html.

const transcript = document.getElementById('transcript');
const form = document.querySelector('.chat__composer');
const input = document.querySelector('#composer-input');

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
  transcript.scrollTop = transcript.scrollHeight;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  appendMessage('user', q);
  setTimeout(() => {
    appendMessage('assistant', `(stub) You asked: "${q}". Backend not wired up yet.`);
  }, 250);
  input.value = '';
});
