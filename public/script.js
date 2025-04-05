const infoBtn = document.getElementById("info-btn");
const welcome = document.querySelector(".welcome-screen");
const mainInterface = document.querySelector(".main-interface");
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

let contextPrompt = "You are a helpful assistant.";

infoBtn.addEventListener("click", () => {
  // Hide the welcome screen and show the main interface
  welcome.classList.add("hidden");
  mainInterface.classList.remove("hidden");
});

document.querySelectorAll(".category-buttons button").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    // Adjust contextPrompt based on the chosen category
    switch (type) {
      case "religious":
        contextPrompt = "You are an expert in world religions. Ask about any religious information.";
        break;
      case "wellness":
        contextPrompt = "You are a wellbeing advisor. Ask for health and mental wellness tips.";
        break;
      case "scheme-info":
        contextPrompt = "You are a guide for Indian government schemes. Ask any scheme-related questions.";
        break;
      case "general":
        contextPrompt = "You are a helpful assistant. Ask anything.";
        break;
      case "order-assistance":
        contextPrompt = "You are an assistant for online shopping. Ask for order-related help.";
        break;
      default:
        contextPrompt = "You are a helpful assistant.";
    }
    appendMessage("bot", `Switched to: ${type.charAt(0).toUpperCase() + type.slice(1)} mode.`);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return; // Prevent empty submissions

  appendMessage("user", userText);
  input.value = ""; // Clear the input field

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
    appendMessage("bot", "❌ Assistant failed to respond. Please try again later.");
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight; // Ensure the latest message is visible
}
