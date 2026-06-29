const promptEl = document.querySelector('#prompt');
const styleEl = document.querySelector('#style');
const sizeEl = document.querySelector('#size');
const countEl = document.querySelector('#count');
const countOut = document.querySelector('#countOut');
const generate = document.querySelector('#generate');
const cards = document.querySelector('#cards');
const statusEl = document.querySelector('#status');

countEl.addEventListener('input', () => {
  countOut.textContent = `${countEl.value}枚`;
});

generate.addEventListener('click', async () => {
  const prompt = promptEl.value.trim() || '未入力の画像プロンプト';
  const style = styleEl.value;
  const size = sizeEl.value;
  const count = Number(countEl.value);
  generate.disabled = true;
  generate.textContent = '生成中...';
  statusEl.textContent = '処理中';
  await new Promise(resolve => setTimeout(resolve, 650));
  cards.className = 'cards';
  cards.innerHTML = Array.from({ length: count }, (_, index) => `
    <article class="card">
      <div class="thumb">${['🎨','🌃','🤖','✨'][index % 4]}</div>
      <div class="meta">
        <strong>${style} / ${size}</strong>
        <small>${escapeHtml(prompt).slice(0, 72)}${prompt.length > 72 ? '...' : ''}</small>
      </div>
    </article>
  `).join('');
  statusEl.textContent = `${count}件生成済み`;
  generate.disabled = false;
  generate.textContent = '画像を生成する';
});

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
