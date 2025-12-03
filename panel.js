const messagesDiv = document.getElementById("messages");
const suggestionsDiv = document.getElementById("suggestions");

const HISTORY_KEY = "tildaAiHistory";
const chatHistory = [];
let isSending = false;

document.getElementById("sendBtn").onclick = sendMessage;
document.getElementById("userInput").onkeypress = e => {
  if (e.key === "Enter") sendMessage();
};

restoreHistory();

// === 1. Подгружаем готовые вопросы в зависимости от того,
// где пользователь находится в Tilda
chrome.runtime.sendMessage({ type: "detect_context" }, (context) => {
  const suggestions = (context && context.suggestions && context.suggestions.length)
    ? context.suggestions
    : [
        "Как исправить адаптив?",
        "Добавить плавную анимацию",
        "Как упростить структуру блоков?",
        "Как оптимизировать шрифты?"
      ];

  renderSuggestions(suggestions);
});

function renderSuggestions(suggs) {
  suggestionsDiv.innerHTML = "";
  suggs.forEach(s => {
    const btn = document.createElement("div");
    btn.className = "suggestion-btn";
    btn.innerText = s;
    btn.onclick = () => {
      document.getElementById("userInput").value = s;
      sendMessage();
    };
    suggestionsDiv.appendChild(btn);
  });
}

// === 2. Отправка сообщения AI
function sendMessage() {
  if (isSending) return;
  
  const text = document.getElementById("userInput").value.trim();
  if (!text) return;

  addMessage(text, "user");
  document.getElementById("userInput").value = "";

  setSendingState(true);

  const pending = addMessage("…", "ai", false);
  const failSafe = setTimeout(() => {
    if (!isSending) return;
    pending.innerHTML = "Ответ не пришёл. Попробуйте ещё раз.";
    setSendingState(false);
  }, 15000);

  chrome.runtime.sendMessage(
    { type: "ai_request", payload: text },
    (res) => {
      const answer = (!res || !res.answer || chrome.runtime.lastError)
        ? "Не удалось получить ответ от сервера. Попробуйте позже."
        : res.answer;

      pending.innerHTML = answer;
      chatHistory.push({ text: answer, role: "ai" });
      persistHistory();
      setSendingState(false);
      clearTimeout(failSafe);
    }
  );
}

function addMessage(text, role, persist = true) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

    if (persist) {
    chatHistory.push({ text, role });
    persistHistory();
  }

  return div;
}

function restoreHistory() {
  chrome.storage.local.get([HISTORY_KEY], (res) => {
    const saved = Array.isArray(res[HISTORY_KEY]) ? res[HISTORY_KEY] : [];
    saved.forEach(({ text, role }) => {
      chatHistory.push({ text, role });
      addMessage(text, role, false);
    });
  });
}

function persistHistory() {
  const trimmedHistory = chatHistory.slice(-50);
  chrome.storage.local.set({ [HISTORY_KEY]: trimmedHistory });
}

function setSendingState(state) {
  isSending = state;
  const sendBtn = document.getElementById("sendBtn");
  sendBtn.disabled = state;
  sendBtn.innerText = state ? "…" : "→";

}
