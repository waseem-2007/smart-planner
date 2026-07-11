const STORAGE_KEY = 'smart-planner-state';
const state = loadState();
const notesBox = document.getElementById('notes-box');
const saveNotesBtn = document.getElementById('save-notes-btn');
const notesStatus = document.getElementById('notes-status');

function loadState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tasks":[],"notes":"","medicines":[],"timings":[],"routines":[{"id":1,"name":"Wake up early","done":false},{"id":2,"name":"Study session","done":false},{"id":3,"name":"Exercise","done":false},{"id":4,"name":"Sleep on time","done":false}],"startDate":"' + new Date().toISOString() + '"}');
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderNotes() {
    notesBox.value = state.notes || '';
}

function saveNotes() {
    state.notes = notesBox.value;
    saveState();
    notesStatus.textContent = 'Notes saved successfully';
    setTimeout(() => { notesStatus.textContent = ''; }, 1500);
}

saveNotesBtn.addEventListener('click', saveNotes);
renderNotes();
