document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const noteInput = document.getElementById("note");
  const saveBtn = document.getElementById("saveBtn");

  // Lấy ngày hiện tại
  const today = new Date();
  dateInput.value = today.toLocaleString("vi-VN");

  // Khi bấm lưu
  saveBtn.addEventListener("click", async () => {
    const note = noteInput.value.trim();
    if (!note) return alert("Vui lòng nhập ghi chú!");

    const entry = {
      date: today.toISOString(),
      note: note
    };

    alert("💾 Đã lưu tạm vào trình duyệt (demo).");
  });
});
