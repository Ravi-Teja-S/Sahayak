const infoBtn = document.getElementById("info-btn");
const welcome = document.querySelector(".welcome-screen");
const mainInterface = document.querySelector(".main-interface");
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

let contextPrompt = "You are a helpful assistant.";

infoBtn.addEventListener("click", () => {
  welcome.classList.add("hidden");
  mainInterface.classList.remove("hidden");
});

document.querySelectorAll(".category-buttons button").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    switch (type) {
      case "religion":
        contextPrompt = "You are an expert in world religions. Ask any religious information.";
        break;
      case "wellbeing":
        contextPrompt = "You are a wellbeing advisor. Ask for health and mental wellness tips.";
        break;
      case "scheme":
        contextPrompt = "You are a guide for Indian government schemes. Ask any scheme-related questions.";
        break;
      case "general":
        contextPrompt = "You are a helpful assistant. Ask anything.";
        break;
    }
    appendMessage("bot", contextPrompt);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("user", userText);
  input.value = "";

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: userText,
        context: contextPrompt
      }),
    });

    const data = await res.json();
    appendMessage("bot", data.response || "No response from assistant.");
  } catch (err) {
    appendMessage("bot", "❌ Assistant failed to respond.");
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
