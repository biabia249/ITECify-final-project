/* ---------------- CHAT BOX ANIMATION ---------------- */
const chatBox = document.querySelector('.chat');
let isOpen = false;

chatBox.addEventListener('click', function () {
  if (!isOpen) {
    this.classList.add('active');
    this.style.animation = 'slidein 0.4s forwards';
  } else {
    this.style.animation = 'slideout 0.4s forwards';
    this.classList.remove('active');
  }
  isOpen = !isOpen;
});


/* ---------------- SYNTAX HIGHLIGHTER ---------------- */
function syntaxHighlight(text) {
  // Escape HTML
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const placeholders = [];
  let i = 0;

  function protect(regex, cls) {
    text = text.replace(regex, match => {
      const key = `___PLACEHOLDER_${i++}___`;
      placeholders.push({
        key,
        value: `<span class="${cls}">${match}</span>`
      });
      return key;
    });
  }

  // ORDER MATTERS
  protect(/(\/\*[\s\S]*?\*\/)/g, "comment");
  protect(/(\/\/[^\n]*)/g, "comment");
  protect(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, "string");

  // Now safe to run normal replaces
  text = text.replace(/\b(\d+(?:\.\d+)?)\b/g,
    '<span class="number">$1</span>');

  text = text.replace(/\b(function|return|let|const|var|if|else|for|while|class|new|this)\b/g,
    '<span class="keyword">$1</span>');

  text = text.replace(/(\b[a-zA-Z_]\w*)(?=\s*\()/g,
    '<span class="function">$1</span>');

  // Restore protected parts
  placeholders.forEach(p => {
    text = text.replace(p.key, p.value);
  });

  return text;
}


/* ---------------- POST FUNCTION ---------------- */
function postText() {
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const code = input.value.trim();
  if (!code) return;

  // Create highlighted block
  const id = "block-" + Date.now();
  const block = document.createElement("pre");
  block.id = id;
  block.innerHTML = syntaxHighlight(code);

  // Add edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editText(id);

  const wrapper = document.createElement("div");
  wrapper.appendChild(block);
  wrapper.appendChild(editBtn);

  output.appendChild(wrapper);
  input.value = "";
}


/* ---------------- EDIT FUNCTION ---------------- */
function editText(id) {
  const input = document.getElementById("input");
  const block = document.getElementById(id);
  const plainText = block.textContent || block.innerText;
  input.value = plainText;
  input.dataset.editingId = id;
  input.placeholder = "Editing...";
  input.focus();
}


/* ---------------- TAB SWITCHER ---------------- */
function switchTab(tab, clickedBtn) {
  document.getElementById("tab-groupchat").style.display =
    tab === "groupchat" ? "block" : "none";
  document.getElementById("tab-ai").style.display =
    tab === "ai" ? "block" : "none";

  document.querySelectorAll(".btn button").forEach(btn =>
    btn.classList.remove("active"));
  clickedBtn.classList.add("active");
}


/* ---------------- MEMBER INITIALS ---------------- */
document.querySelectorAll(".member-circle").forEach(circle => {
  const name = circle.getAttribute("title");
  const initials = name
    .split(" ")
    .map(w => w[0])
    .join("");
  circle.childNodes[0].textContent = initials;
  circle.querySelector(".tooltp").textContent = name;
});
