const STORAGE_KEY = 'smart-planner-state';
const state = loadState();
const timingTitleInput = document.getElementById('timing-title');
const timingTimeInput = document.getElementById('timing-time');
const addTimingBtn = document.getElementById('add-timing-btn');
const timingList = document.getElementById('timing-list');

function loadState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tasks":[],"notes":"","medicines":[],"timings":[],"routines":[{"id":1,"name":"Wake up early","done":false},{"id":2,"name":"Study session","done":false},{"id":3,"name":"Exercise","done":false},{"id":4,"name":"Sleep on time","done":false}],"startDate":"' + new Date().toISOString() + '"}');
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderTimings() {
    timingList.innerHTML = '';

    if (state.timings.length === 0) {
        timingList.innerHTML = '<p>No important timings yet.</p>';
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

addTimingBtn.addEventListener('click', addTiming);

timingList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = Number(button.dataset.id);
    if (button.classList.contains('delete-btn')) deleteTiming(id);
    else toggleTiming(id);
});

renderTimings();
