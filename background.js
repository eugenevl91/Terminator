 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/background.js b/background.js
index c0ce41edf006c5076f909419c5a2372353b77042..908bd32b53e783563fc3406adf0446607bb180b7 100644
--- a/background.js
+++ b/background.js
@@ -1,40 +1,46 @@
 chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
 
   if (msg.type === "detect_context") {
-    let suggestions = [];
+    const defaultSuggestions = [
+      "Как исправить адаптив?",
+      "Сделать анимацию в Zero Block",
+      "Скрыть блок на мобайл?",
+      "Какие есть лучшие практики в Tilda?"
+    ];
 
-    if (sender.tab && sender.tab.url.includes("/page/")) {
+    let suggestions = defaultSuggestions;
+
+    if (sender.tab && sender.tab.url.includes("/page/") && sender.tab.url.includes("edit")) {
       suggestions = [
-        "Как исправить адаптив?",
-        "Скрыть блок на мобайл?",
-        "Сделать анимацию в Zero Block",
-        "Перенести блок наверх",
-        "Добавить видеофон"
+        "Как поправить сетку и отступы?",
+        "Сделать аккуратную анимацию",
+        "Добавить адаптивные стили",
+        "Проверить блоки перед публикацией"
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
-    .then(res => res.json())
+    .then(res => res.ok ? res.json() : Promise.reject())
     .then(data => sendResponse({ answer: data.answer }))
     .catch(() => sendResponse({answer: "Ошибка соединения с сервером"}));
 
     return true;
   }
 
 });
 
EOF
)
