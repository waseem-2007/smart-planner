const STORAGE_KEY = 'smart-planner-state';
const state = loadState();
const routineList = document.getElementById('routine-list');
const routineInput = document.getElementById('routine-input');
const addRoutineBtn = document.getElementById('add-routine-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

function loadState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tasks":[],"notes":"","medicines":[],"timings":[],"routines":[{"id":1,"name":"Wake up early","done":false},{"id":2,"name":"Study session","done":false},{"id":3,"name":"Exercise","done":false},{"id":4,"name":"Sleep on time","done":false}],"startDate":"' + new Date().toISOString() + '"}');
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderRoutines() {
    routineList.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'routine-table';

    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Status</th><th>Routine</th><th>Progress</th></tr>';
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    state.routines.forEach((routine) => {
        const row = document.createElement('tr');
        if (routine.done) row.classList.add('done-row');

        const statusCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = routine.done;
        checkbox.dataset.id = routine.id;
        statusCell.appendChild(checkbox);

        const nameCell = document.createElement('td');
        nameCell.textContent = routine.name;

        const progressCell = document.createElement('td');
        progressCell.textContent = routine.done ? 'Completed' : 'Pending';

        row.appendChild(statusCell);
        row.appendChild(nameCell);
        row.appendChild(progressCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    routineList.appendChild(table);

    const completed = state.routines.filter((routine) => routine.done).length;
    const percent = state.routines.length ? Math.round((completed / state.routines.length) * 100) : 0;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${completed} of ${state.routines.length} completed`;
}

function addRoutine() {
    const name = routineInput.value.trim();
    if (!name) {
        alert('Please enter a routine');
        return;
    }

    state.routines.push({ id: Date.now(), name, done: false });
    routineInput.value = '';
    saveState();
    renderRoutines();
}

function toggleRoutine(id) {
    state.routines = state.routines.map((routine) => routine.id === id ? { ...routine, done: !routine.done } : routine);
    saveState();
    renderRoutines();
}

addRoutineBtn.addEventListener('click', addRoutine);
routineInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addRoutine();
});

routineList.addEventListener('change', (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
        toggleRoutine(Number(event.target.dataset.id));
    }
});

renderRoutines();
