(function() {
  const isTildaEditor = /\/page\/.*\/edit/.test(location.pathname) || /\/page\/.*edit/.test(location.href);
  if (!isTildaEditor) return;

  if (document.getElementById("tilda-ai-ball")) return;


  // === 1. Создаём шар ===
  const ball = document.createElement("div");
  ball.id = "tilda-ai-ball";

  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("icons/ai-ball.png");
  ball.appendChild(icon);

  document.body.appendChild(ball);

  // === 2. Создаём окно чата ===
  const win = document.createElement("div");
  win.id = "tilda-ai-window";

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("panel.html");

  win.appendChild(iframe);
  document.body.appendChild(win);

  let isDragging = false;
  let offsetX, offsetY;

  // === 3. Открыть/закрыть окно чата ===
  ball.addEventListener("click", () => {
    if (isDragging) return;
    win.style.display = win.style.display === "none" ? "block" : "none";
  });

  // === 4. Перетаскивание шара ===
  ball.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - ball.getBoundingClientRect().left;
    offsetY = e.clientY - ball.getBoundingClientRect().top;
    ball.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    ball.style.left = `${e.clientX - offsetX}px`;
    ball.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    setTimeout(() => isDragging = false, 50);
    ball.style.cursor = "grab";
  });

})();
