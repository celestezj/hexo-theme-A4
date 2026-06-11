// 防重复请求锁
let isLoading = false;

function getHitokoto() {
  if (isLoading) return;
  const quote = document.getElementById('quote');
  if (!quote) return;

  isLoading = true;
  quote.innerText = "";

//   console.log("get index.hitokoto");
  fetch(`https://v1.hitokoto.cn/?c=k&_t=${Date.now()}`) // 具体接口信息：https://developer.hitokoto.cn/sentence/
    .then(res => res.json())
    .then(data => {
      if (quote) quote.innerText = data.hitokoto;
    })
    .catch(err => {
    //   console.error(err);
      if (quote) quote.innerText = "一言加载失败";
    })
    .finally(() => {
      isLoading = false;
    });
}

document.addEventListener('DOMContentLoaded', getHitokoto);