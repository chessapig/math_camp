// "Show all notes" toggle for facilitation dropdowns.
document.querySelectorAll("[data-toggle-notes]").forEach((button) => {
  button.addEventListener("click", () => {
    const notes = document.querySelectorAll("details.facilitation");
    const open = [...notes].some((d) => !d.open);
    notes.forEach((d) => (d.open = open));
    button.textContent = open ? "Hide all notes" : "Show all notes";
  });
});

// Printed pages always include the facilitation notes.
let closedBeforePrint = [];
window.addEventListener("beforeprint", () => {
  closedBeforePrint = [...document.querySelectorAll("details:not([open])")];
  closedBeforePrint.forEach((d) => (d.open = true));
});
window.addEventListener("afterprint", () => {
  closedBeforePrint.forEach((d) => (d.open = false));
});
