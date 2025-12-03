const messagesDiv = document.getElementById("messages");
const suggestionsDiv = document.getElementById("suggestions");

document.getElementById("sendBtn").onclick = sendMessage;
document.getElementById("userInput").onkeypress = e => {
  if (e.key === "Enter") sendMessage();
};

// === 1. Подгружаем готовые вопросы в зависимости от того,
// где пользователь находится в Tilda
chrome.runtime.sendMessage({ type: "detect_context" }, (context) => {
  renderSuggestions(context.suggestions);
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
  const text = document.getElementById("userInput").value.trim();
  if (!text) return;

  addMessage(text, "user");
  document.getElementById("userInput").value = "";

  chrome.runtime.sendMessage(
    { type: "ai_request", payload: text },
    (res) => addMessage(res.answer, "ai")
  );
}

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
