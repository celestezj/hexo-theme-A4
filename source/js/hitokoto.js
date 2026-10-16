const TIMEOUT_MS = 5000;
let activeQuote = null;
let requestSeq = 0;

function showFallback(quote) {
  const list = window.__HITOKOTO_FALLBACK || [];
  if (list.length) {
    quote.innerText = list[Math.floor(Math.random() * list.length)];
  } else {
    quote.innerText = "一言加载失败";
  }
}

function getHitokoto() {
  const quote = document.getElementById('quote');
  if (!quote || quote === activeQuote) return;

  activeQuote = quote;
  const seq = ++requestSeq;
  quote.innerText = "";

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  fetch(`https://v1.hitokoto.cn/?c=k&_t=${Date.now()}`, { signal: controller.signal }) // 具体接口信息：https://developer.hitokoto.cn/sentence/
    .then(res => res.json())
    .then(data => {
      if (requestSeq === seq) quote.innerText = data.hitokoto;
    })
    .catch(err => {
      if (requestSeq === seq && (timedOut || err.name !== 'AbortError')) showFallback(quote);
    })
    .finally(() => {
      if (requestSeq === seq) {
        clearTimeout(timer);
        activeQuote = null;
      }
    });
}

document.addEventListener('DOMContentLoaded', getHitokoto);
