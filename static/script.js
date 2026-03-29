function focusField(fieldId) {
  document.getElementById('btn-username').classList.remove('active');
  document.getElementById('btn-code').classList.remove('active');

  const btnId = fieldId === 'username' ? 'btn-username' : 'btn-code';
  document.getElementById(btnId).classList.add('active');
  document.getElementById(fieldId).focus();
}

function saveData() {
  const username    = document.getElementById("username").value.trim();
  const projectCode = document.getElementById("projectcode").value.trim();
  const button      = document.getElementById("submit");

  // 1. empty check
  if (username === "" || projectCode === "") {
    button.innerText = "Fill all fields!";
    shake(button);
    setTimeout(() => { button.innerText = "Enter"; }, 2000);
    return;
  }

  // 2. ✅ check project code (not username) for letters
  if (/[a-zA-Z]/.test(projectCode)) {
    button.innerText = "⚠ Invalid code!";
    shake(document.getElementById("submit"));
    setTimeout(() => { button.innerText = "Enter"; }, 2000);
    return;
  }

  // 3. all good — save and fade out
  localStorage.setItem("username", username);
  localStorage.setItem("projectCode", projectCode);

  button.innerText = "Saved!";
  const loginBox = document.querySelector(".login-box");
  loginBox.classList.add("fade-out");
  setTimeout(() => { loginBox.style.display = "none"; }, 550);
}

function shake(el) {
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(0)' }
  ], { duration: 320, easing: 'ease-in-out' });
}
const themeBtn = document.getElementById('theme-btn');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if (document.body.classList.contains('light-mode')) {
    themeBtn.textContent = '☀️';
  } else {
    themeBtn.textContent = '🌙';
  }
});
// Open/Close a button

let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  document.querySelector('.chat-panel').classList.toggle('open', chatOpen);
  document.getElementById('fab').classList.toggle('open', chatOpen);
  document.getElementById('fabLabel').textContent = chatOpen ? 'Close' : 'Chat';
}