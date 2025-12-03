chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "detect_context") {
    let suggestions = [];

    if (sender.tab && sender.tab.url.includes("/page/")) {
      suggestions = [
        "Как исправить адаптив?",
        "Скрыть блок на мобайл?",
        "Сделать анимацию в Zero Block",
        "Перенести блок наверх",
        "Добавить видеофон"
      ];
    }

    if (sender.tab && sender.tab.url.includes("/projects/")) {
      suggestions = [
        "Как улучшить структуру сайта?",
        "Как оптимизировать скорость загрузки?",
        "Проверить весь проект"
      ];
    }

    sendResponse({ suggestions });
  }

  if (msg.type === "ai_request") {
    fetch("https://your-backend.com/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: msg.payload })
    })
    .then(res => res.json())
    .then(data => sendResponse({ answer: data.answer }))
    .catch(() => sendResponse({answer: "Ошибка соединения с сервером"}));

    return true;
  }

});
