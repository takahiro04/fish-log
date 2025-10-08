const repo = "takahiro04/fish-log";
const path = "data/log.json";
const apiBase = `https://api.github.com/repos/${repo}/contents/${path}`;

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveNote);

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", loadNotes);
});

async function saveNote() {
  const token = document.getElementById("token").value.trim();
  const note = document.getElementById("note").value.trim();
  const date = document.getElementById("date").value;
  const status = document.getElementById("status");

  if (!token || !note) {
    status.textContent = "⚠️ Vui lòng nhập token và nội dung.";
    return;
  }

  status.textContent = "⏳ Đang lưu...";
  try {
    // Lấy file log.json hiện có
    const res = await fetch(apiBase, {
      headers: { Authorization: `token ${token}` },
    });
    let log = {};
    let sha = null;

    if (res.ok) {
      const data = await res.json();
      log = JSON.parse(atob(data.content));
      sha = data.sha;
    }

    // Ghi nhật ký mới
    log[date] = note;

    const newContent = btoa(JSON.stringify(log, null, 2));
    const body = {
      message: `update log ${date}`,
      content: newContent,
      sha: sha || undefined,
    };

    // Commit lên GitHub
    const upload = await fetch(apiBase, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (upload.ok) {
      status.textContent = "✅ Đã lưu nhật ký thành công!";
      document.getElementById("note").value = "";
    } else {
      status.textContent = "❌ Lưu thất bại. Kiểm tra token hoặc quyền truy cập.";
    }
  } catch (err) {
    status.textContent = "⚠️ Lỗi kết nối: " + err.message;
  }
}

async function loadNotes() {
  const searchDate = document.getElementById("searchDate").value;
  const container = document.getElementById("entries");
  container.innerHTML = "⏳ Đang tải...";

  try {
    const res = await fetch(`https://raw.githubusercontent.com/${repo}/main/${path}`);
    if (!res.ok) throw new Error("Không thể đọc dữ liệu.");
    const log = await res.json();

    container.innerHTML = "";
    const keys = Object.keys(log).sort((a, b) => b.localeCompare(a));

    for (const date of keys) {
      if (!searchDate || date === searchDate) {
        const div = document.createElement("div");
        div.className = "border rounded-lg p-3 bg-gray-50";
        div.innerHTML = `<b>${date}</b><p class="mt-1 whitespace-pre-line">${log[date]}</p>`;
        container.appendChild(div);
      }
    }

    if (container.innerHTML === "") container.innerHTML = "Không có nhật ký cho ngày này.";
  } catch (err) {
    container.innerHTML = "⚠️ Lỗi tải dữ liệu: " + err.message;
  }
}
