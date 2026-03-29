const palette = [
    "#e07b7b","#7be0a0","#7baee0","#e0c97b","#c77be0",
    "#e0a07b","#7be0d4","#b0e07b","#e07bb5","#7b9ee0"
];
const memberColors = {};
const myName = "You";
const fakeUsers = ["Alice Wonderland","Bob Ross","Charles Boyle"];

const fakeChatMessages = [
    "anyone seen the bug on line 42?","pushing my changes now",
    "can someone review my PR?","I broke something, fixing...",
    "finally got the tests passing 🎉","who changed the config file??",
    "lunch break, brb","merged! check the latest build"
];

const fakeCodeSnippets = [
    { mode:"htmlmixed", text:'<div class="card">\n  <h2>Hello World</h2>\n  <p>Refactored layout</p>\n</div>' },
    { mode:"javascript", text:'function fetchData(url) {\n  return fetch(url)\n    .then(r => r.json())\n    .catch(err => console.error(err));\n}' },
    { mode:"css", text:'.container {\n  display: flex;\n  gap: 1rem;\n  padding: 20px;\n}' },
    { mode:"javascript", text:'// fixed null pointer\nconst value = obj?.data ?? "default";' },
    { mode:"htmlmixed", text:'<button onclick="submit()">\n  Push to main\n</button>' },
];

const modeLabels = {
    htmlmixed: "HTML",
    javascript: "JavaScript",
    css: "CSS",
    clike: "C++",
    null: "Plain text",
};

// ── Member circles ─────────────────────────────────────────────────────────
document.querySelectorAll(".member-circle").forEach((circle, i) => {
    const name = circle.getAttribute("title");
    const initials = name.split(" ").map(w => w[0]).join("");
    const color = palette[i % palette.length];
    memberColors[name] = color;
    circle.style.background = color;
    circle.style.color = "#1e2933";
    circle.style.setProperty("--tip-color", color);
    const tip = circle.querySelector(".tooltp");
    tip.textContent = name;
    tip.style.color = "#1e2933";
    circle.insertBefore(document.createTextNode(initials), circle.firstChild);
});

// ── CodeMirror main editor ─────────────────────────────────────────────────
const editor = CodeMirror.fromTextArea(document.getElementById("codeInput"), {
    mode: "htmlmixed",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
});

function changeMode() {
    const m = document.getElementById("modeSelect").value;
    editor.setOption("mode", m === "null" ? null : m);
}

// ── Post highlighted block ─────────────────────────────────────────────────
let editingBlockId = null;

function postCode() {
    const text = editor.getValue();
    if (!text.trim()) return;
    const mode = document.getElementById("modeSelect").value;

    if (editingBlockId) {
        const old = document.getElementById(editingBlockId);
        if (old && old._cmInstance) old._cmInstance.setValue(text);
        editingBlockId = null;
        editor.setValue("");
        editor.focus();
        return;
    }

    const output = document.getElementById("output");
    appendHighlightedBlock(output, myName, text, "#9dabb4", mode, true);
    output.scrollTop = output.scrollHeight;
    editor.setValue("");
    editor.focus();
}

function appendHighlightedBlock(container, name, text, color, mode, editable) {
    const id = "block-" + Date.now() + Math.random();

    const wrapper = document.createElement("div");
    wrapper.className = "posted-block";
    wrapper.id = id;
    wrapper.style.borderLeft = `4px solid ${color}`;

    // Header: name — Language
    const header = document.createElement("div");
    header.className = "posted-block-header";

    const label = document.createElement("small");
    label.textContent = name;
    label.style.color = color;
    header.appendChild(label);

    const badge = document.createElement("span");
    badge.className = "lang-badge";
    badge.textContent = modeLabels[mode] || mode;
    header.appendChild(badge);

    wrapper.appendChild(header);

    // Read-only CodeMirror (transparent bg)
    const cmHost = document.createElement("div");
    wrapper.appendChild(cmHost);

    const cmInst = CodeMirror(cmHost, {
        value: text,
        mode: mode === "null" ? null : mode,
        theme: "dracula",
        lineNumbers: true,
        readOnly: true,
        lineWrapping: true,
    });
    wrapper._cmInstance = cmInst;

    if (editable) {
        const editBtn = document.createElement("button");
        editBtn.className = "posted-block-edit-btn";
        editBtn.textContent = "✏ Edit";
        editBtn.onclick = () => {
            editor.setValue(text);
            const sel = document.getElementById("modeSelect");
            sel.value = mode;
            changeMode();
            editingBlockId = id;
            editor.focus();
        };
        wrapper.appendChild(editBtn);
    }

    container.appendChild(wrapper);
    setTimeout(() => cmInst.refresh(), 50);
    return wrapper;
}

// ── Tab switching ──────────────────────────────────────────────────────────
function switchTab(tab, clickedBtn) {
    document.getElementById("tab-groupchat").style.display = tab === "groupchat" ? "flex" : "none";
    document.getElementById("tab-ai").style.display = tab === "ai" ? "flex" : "none";
    document.querySelectorAll(".btn button").forEach(b => b.classList.remove("active"));
    clickedBtn.classList.add("active");
}

// ── Chat ───────────────────────────────────────────────────────────────────
function appendChatMessage(container, name, text, side, color = "#9dabb4", editable = true) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex; flex-direction:column; align-items:${side==="right"?"flex-end":"flex-start"}; margin-bottom:10px;`;

    const label = document.createElement("small");
    label.textContent = name;
    label.style.cssText = `margin-bottom:3px; font-size:0.75rem; color:${color};`;

    const bubble = document.createElement("div");
    bubble.textContent = text;
    const bg = side==="right" ? "#3a5a6f" : editable ? "#1e2933" : "#2a1f35";
    bubble.style.cssText = `
        background:${bg}; padding:8px 12px;
        border-radius:${side==="right"?"16px 16px 4px 16px":"16px 16px 16px 4px"};
        max-width:80%; word-wrap:break-word; border-left:3px solid ${color};`;

    wrapper.appendChild(label);
    wrapper.appendChild(bubble);

    if (editable && side==="right") {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.cssText = "font-size:0.7rem; margin-top:3px; background:#2c3943; border:none; border-bottom:2px solid #1a252f; color:#9dabb4; border-radius:5px; padding:3px 10px; cursor:pointer;";
        editBtn.onclick = () => {
            const inp = document.getElementById(container.id==="chat-output"?"chat-input":"ai-input");
            inp.value = text; inp.focus(); wrapper.remove();
        };
        wrapper.appendChild(editBtn);
    }
    container.appendChild(wrapper);
}

function postChat() {
    const input = document.getElementById("chat-input");
    const output = document.getElementById("chat-output");
    if (!input.value.trim()) return;
    appendChatMessage(output, myName, input.value, "right", "#9dabb4", true);
    output.scrollTop = output.scrollHeight;
    input.value = "";
}

function postAI() {
    const input = document.getElementById("ai-input");
    const output = document.getElementById("ai-output");
    if (!input.value.trim()) return;
    appendChatMessage(output, "You", input.value, "right", "#9dabb4", true);
    output.scrollTop = output.scrollHeight;
    input.value = "";
    setTimeout(() => {
        appendChatMessage(output, "🤖 AI", "I'm not implemented yet!", "left", "#7be0a0", false);
        output.scrollTop = output.scrollHeight;
    }, 600);
}

// ── Fake activity ──────────────────────────────────────────────────────────
function fakeActivity() {
    const name = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const color = memberColors[name] || "#9dabb4";

    if (Math.random() > 0.4) {
        const output = document.getElementById("output");
        const snippet = fakeCodeSnippets[Math.floor(Math.random() * fakeCodeSnippets.length)];
        appendHighlightedBlock(output, name, snippet.text, color, snippet.mode, false);
        output.scrollTop = output.scrollHeight;
    }

    if (Math.random() > 0.3) {
        const text = fakeChatMessages[Math.floor(Math.random() * fakeChatMessages.length)];
        const chatOutput = document.getElementById("chat-output");
        appendChatMessage(chatOutput, name, text, "left", color, false);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
}

function startFakeActivity() {
    const delay = 4000 + Math.random() * 4000;
    setTimeout(() => { fakeActivity(); startFakeActivity(); }, delay);
}
startFakeActivity();

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("light")) {
    body.classList.replace("light", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.replace("dark", "light");
    localStorage.setItem("theme", "light");
  }
}

window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
};