const STORAGE_KEY = 'smart-planner-state';
const themeToggle = document.getElementById('theme-toggle');

const defaultRoutines = [
    { id: 1, name: 'Wake up early', done: false },
    { id: 2, name: 'Study session', done: false },
    { id: 3, name: 'Exercise', done: false },
    { id: 4, name: 'Sleep on time', done: false }
];

const state = loadState();

const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const addTaskBtn = document.getElementById('add-task-btn');
const notesBox = document.getElementById('notes-box');
const saveNotesBtn = document.getElementById('save-notes-btn');
const notesStatus = document.getElementById('notes-status');
const medicineNameInput = document.getElementById('medicine-name');
const medicineTimeInput = document.getElementById('medicine-time');
const addMedicineBtn = document.getElementById('add-medicine-btn');
const medicineList = document.getElementById('medicine-list');
const timingTitleInput = document.getElementById('timing-title');
const timingTimeInput = document.getElementById('timing-time');
const addTimingBtn = document.getElementById('add-timing-btn');
const timingList = document.getElementById('timing-list');
const routineList = document.getElementById('routine-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const daysTracked = document.getElementById('days-tracked');
const monthsTracked = document.getElementById('months-tracked');
const yearsTracked = document.getElementById('years-tracked');

function loadState() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

    if (saved) {
        return {
            tasks: Array.isArray(saved.tasks) ? saved.tasks : [],
            notes: saved.notes || '',
            medicines: Array.isArray(saved.medicines) ? saved.medicines : [],
            timings: Array.isArray(saved.timings) ? saved.timings : [],
            routines: Array.isArray(saved.routines) && saved.routines.length ? saved.routines : defaultRoutines,
            startDate: saved.startDate || new Date().toISOString()
        };
    }

    return {
        tasks: [],
        notes: '',
        medicines: [],
        timings: [],
        routines: defaultRoutines,
        startDate: new Date().toISOString()
    };
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme() {
    const isDark = localStorage.getItem('planner-theme') === 'dark';
    document.body.classList.toggle('dark', isDark);
    if (themeToggle) {
        themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('planner-theme', isDark ? 'light' : 'dark');
    applyTheme();
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderTasks() {
    listContainer.innerHTML = '';

    if (state.tasks.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No tasks yet. Add one above.';
        listContainer.appendChild(empty);
        return;
    }

    state.tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'checked' : ''}`;

        const span = document.createElement('span');
        span.textContent = task.text;

        const actions = document.createElement('div');

        const doneBtn = document.createElement('button');
        doneBtn.className = 'small-btn';
        doneBtn.textContent = task.done ? 'Undo' : 'Done';
        doneBtn.dataset.id = task.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'small-btn delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = task.id;

        actions.appendChild(doneBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(actions);
        listContainer.appendChild(li);
    });
}

function renderNotes() {
    notesBox.value = state.notes;
}

function renderMedicines() {
    medicineList.innerHTML = '';

    if (state.medicines.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No medicine reminders yet.';
        medicineList.appendChild(empty);
        return;
    }

    state.medicines.forEach((item) => {
        const li = document.createElement('li');
        li.className = `reminder-item ${item.done ? 'done' : ''}`;

        const info = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = item.name;
        const time = document.createElement('div');
        time.textContent = item.time;
        info.appendChild(name);
        info.appendChild(time);

        const actions = document.createElement('div');
        const doneBtn = document.createElement('button');
        doneBtn.className = 'small-btn';
        doneBtn.textContent = item.done ? 'Taken' : 'Mark Taken';
        doneBtn.dataset.id = item.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'small-btn delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = item.id;

        actions.appendChild(doneBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        medicineList.appendChild(li);
    });
}

function renderTimings() {
    timingList.innerHTML = '';

    if (state.timings.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No important timings yet.';
        timingList.appendChild(empty);
        return;
    }

    state.timings.forEach((item) => {
        const li = document.createElement('li');
        li.className = `timing-item ${item.done ? 'done' : ''}`;

        const info = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = item.title;
        const time = document.createElement('div');
        time.textContent = item.time;
        info.appendChild(title);
        info.appendChild(time);

        const actions = document.createElement('div');
        const doneBtn = document.createElement('button');
        doneBtn.className = 'small-btn';
        doneBtn.textContent = item.done ? 'Done' : 'Mark Done';
        doneBtn.dataset.id = item.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'small-btn delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = item.id;

        actions.appendChild(doneBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        timingList.appendChild(li);
    });
}

function renderRoutines() {
    routineList.innerHTML = '';

    state.routines.forEach((routine) => {
        const label = document.createElement('label');
        label.className = 'routine-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = routine.done;
        checkbox.dataset.id = routine.id;

        const span = document.createElement('span');
        span.textContent = routine.name;

        label.appendChild(checkbox);
        label.appendChild(span);
        routineList.appendChild(label);
    });

    const completed = state.routines.filter((routine) => routine.done).length;
    const percent = state.routines.length ? Math.round((completed / state.routines.length) * 100) : 0;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${completed} of ${state.routines.length} completed`;
}

function renderStats() {
    const start = new Date(state.startDate);
    const today = new Date();
    const diffDays = Math.max(1, Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1);

    daysTracked.textContent = diffDays;
    monthsTracked.textContent = (diffDays / 30).toFixed(1);
    yearsTracked.textContent = (diffDays / 365).toFixed(1);
}

function renderAll() {
    renderTasks();
    renderNotes();
    renderMedicines();
    renderTimings();
    renderRoutines();
    renderStats();
}

function addTask() {
    const taskText = inputBox.value.trim();

    if (!taskText) {
        alert('Please enter a task');
        return;
    }

    state.tasks.unshift({ id: Date.now(), text: taskText, done: false });
    inputBox.value = '';
    saveState();
    renderTasks();
}

function saveNotes() {
    state.notes = notesBox.value;
    saveState();
    notesStatus.textContent = 'Notes saved successfully';
    setTimeout(() => {
        notesStatus.textContent = '';
    }, 1500);
}

function addMedicine() {
    const name = medicineNameInput.value.trim();
    const time = medicineTimeInput.value;

    if (!name || !time) {
        alert('Please fill medicine name and time');
        return;
    }

    state.medicines.unshift({ id: Date.now(), name, time, done: false });
    medicineNameInput.value = '';
    medicineTimeInput.value = '';
    saveState();
    renderMedicines();
}

function addTiming() {
    const title = timingTitleInput.value.trim();
    const time = timingTimeInput.value;

    if (!title || !time) {
        alert('Please fill timing title and time');
        return;
    }

    state.timings.unshift({ id: Date.now(), title, time, done: false });
    timingTitleInput.value = '';
    timingTimeInput.value = '';
    saveState();
    renderTimings();
}

function toggleTask(id) {
    state.tasks = state.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
    saveState();
    renderTasks();
}

function deleteTask(id) {
    state.tasks = state.tasks.filter((task) => task.id !== id);
    saveState();
    renderTasks();
}

function toggleMedicine(id) {
    state.medicines = state.medicines.map((item) => item.id === id ? { ...item, done: !item.done } : item);
    saveState();
    renderMedicines();
}

function deleteMedicine(id) {
    state.medicines = state.medicines.filter((item) => item.id !== id);
    saveState();
    renderMedicines();
}

function toggleTiming(id) {
    state.timings = state.timings.map((item) => item.id === id ? { ...item, done: !item.done } : item);
    saveState();
    renderTimings();
}

function deleteTiming(id) {
    state.timings = state.timings.filter((item) => item.id !== id);
    saveState();
    renderTimings();
}

function toggleRoutine(id) {
    state.routines = state.routines.map((routine) => routine.id === id ? { ...routine, done: !routine.done } : routine);
    saveState();
    renderRoutines();
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

applyTheme();

addTaskBtn.addEventListener('click', addTask);
inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

saveNotesBtn.addEventListener('click', saveNotes);
addMedicineBtn.addEventListener('click', addMedicine);
addTimingBtn.addEventListener('click', addTiming);

listContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.dataset.id);
    if (button.classList.contains('delete-btn')) {
        deleteTask(id);
    } else {
        toggleTask(id);
    }
});

medicineList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.dataset.id);
    if (button.classList.contains('delete-btn')) {
        deleteMedicine(id);
    } else {
        toggleMedicine(id);
    }
});

timingList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.dataset.id);
    if (button.classList.contains('delete-btn')) {
        deleteTiming(id);
    } else {
        toggleTiming(id);
    }
});

routineList.addEventListener('change', (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
        toggleRoutine(Number(event.target.dataset.id));
    }
});

renderAll();
