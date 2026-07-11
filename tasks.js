const STORAGE_KEY = 'smart-planner-state';
const state = loadState();
const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const addTaskBtn = document.getElementById('add-task-btn');

function loadState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tasks":[],"notes":"","medicines":[],"timings":[],"routines":[{"id":1,"name":"Wake up early","done":false},{"id":2,"name":"Study session","done":false},{"id":3,"name":"Exercise","done":false},{"id":4,"name":"Sleep on time","done":false}],"startDate":"' + new Date().toISOString() + '"}');
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderTasks() {
    listContainer.innerHTML = '';

    if (state.tasks.length === 0) {
        listContainer.innerHTML = '<p>No tasks yet. Add one above.</p>';
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

addTaskBtn.addEventListener('click', addTask);
inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTask();
});

listContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = Number(button.dataset.id);
    if (button.classList.contains('delete-btn')) deleteTask(id);
    else toggleTask(id);
});

renderTasks();
