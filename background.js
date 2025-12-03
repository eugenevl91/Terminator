chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "detect_context") {
      const defaultSuggestions = [
      "Как исправить адаптив?",
      "Сделать анимацию в Zero Block",
      "Скрыть блок на мобайл?",
      "Какие есть лучшие практики в Tilda?"
    ];

    let suggestions = defaultSuggestions;
   
    if (sender.tab && sender.tab.url.includes("/page/") && sender.tab.url.includes("edit")) {
      suggestions = [
        "Как поправить сетку и отступы?",
        "Сделать аккуратную анимацию",
        "Добавить адаптивные стили",
        "Проверить блоки перед публикацией"
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
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => sendResponse({ answer: data.answer }))
    .catch(() => sendResponse({answer: "Ошибка соединения с сервером"}));

    return true;
  }

});
