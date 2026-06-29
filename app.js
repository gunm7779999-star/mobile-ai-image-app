const form = document.querySelector('#generatorForm');
const promptEl = document.querySelector('#prompt');
const promptCount = document.querySelector('#promptCount');
const examplePrompt = document.querySelector('#examplePrompt');
const generateButton = document.querySelector('#generateButton');
const cards = document.querySelector('#cards');
const statusEl = document.querySelector('#status');
const formError = document.querySelector('#formError');

const selection = { style: '写真', size: '1024x1024', count: 1 };
const example = '雨上がりの東京、ネオンが水たまりに反射する静かな路地。映画のワンシーンのような光と構図。';

document.querySelectorAll('.choice').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.dataset.group;
    selection[group] = group === 'count' ? Number(button.dataset.value) : button.dataset.value;
    document.querySelectorAll(`[data-group="${group}"]`).forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

promptEl.addEventListener('input', () => {
  promptCount.textContent = `${promptEl.value.length} / 2000`;
  hideError();
});

examplePrompt.addEventListener('click', () => {
  promptEl.value = example;
  promptEl.dispatchEvent(new Event('input'));
  promptEl.focus();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptEl.value.trim();
  if (!prompt) {
    showError('作りたい画像の説明を入力してください。');
    promptEl.focus();
    return;
  }

  setLoading(true);
  renderSkeletons(selection.count);
  hideError();

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...selection }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || '画像を生成できませんでした。');
    if (!Array.isArray(payload.images) || payload.images.length === 0) throw new Error('画像データが返されませんでした。');
    renderImages(payload.images, prompt);
    statusEl.textContent = `${payload.images.length}枚生成済み`;
  } catch (error) {
    showError(error instanceof Error ? error.message : '通信エラーが発生しました。');
    renderEmpty();
    statusEl.textContent = '生成失敗';
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  generateButton.disabled = loading;
  generateButton.classList.toggle('loading', loading);
  generateButton.lastChild.textContent = loading ? '生成しています…' : '画像を生成する';
  if (loading) statusEl.textContent = '処理中';
}

function renderSkeletons(count) {
  cards.className = 'cards';
  cards.replaceChildren(...Array.from({ length: count }, () => {
    const item = document.createElement('div');
    item.className = 'skeleton';
    return item;
  }));
}

function renderImages(images, prompt) {
  cards.className = 'cards';
  const nodes = images.map((image, index) => {
    const article = document.createElement('article');
    article.className = 'image-card';
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = `${prompt}の生成結果 ${index + 1}`;
    img.loading = 'lazy';
    const meta = document.createElement('div');
    meta.className = 'image-meta';
    const description = document.createElement('p');
    description.textContent = prompt;
    const download = document.createElement('a');
    download.className = 'download';
    download.href = image.url;
    download.download = `mira-image-${index + 1}.jpg`;
    download.textContent = '画像を保存';
    meta.append(description, download);
    article.append(img, meta);
    return article;
  });
  cards.replaceChildren(...nodes);
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderEmpty() {
  cards.className = 'cards empty';
  cards.innerHTML = '<div class="empty-icon" aria-hidden="true">✦</div><strong>画像を表示できませんでした</strong><p>設定を確認して、もう一度お試しください。</p>';
}

function showError(message) { formError.textContent = message; formError.hidden = false; }
function hideError() { formError.hidden = true; formError.textContent = ''; }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('Service Worker registration failed:', error)));
}
