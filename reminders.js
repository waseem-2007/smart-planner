const STORAGE_KEY = 'smart-planner-state';
const state = loadState();
const medicineNameInput = document.getElementById('medicine-name');
const medicineTimeInput = document.getElementById('medicine-time');
const addMedicineBtn = document.getElementById('add-medicine-btn');
const medicineList = document.getElementById('medicine-list');

function loadState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tasks":[],"notes":"","medicines":[],"timings":[],"routines":[{"id":1,"name":"Wake up early","done":false},{"id":2,"name":"Study session","done":false},{"id":3,"name":"Exercise","done":false},{"id":4,"name":"Sleep on time","done":false}],"startDate":"' + new Date().toISOString() + '"}');
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderMedicines() {
    medicineList.innerHTML = '';

    if (state.medicines.length === 0) {
        medicineList.innerHTML = '<p>No medicine reminders yet.</p>';
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

addMedicineBtn.addEventListener('click', addMedicine);

medicineList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = Number(button.dataset.id);
    if (button.classList.contains('delete-btn')) deleteMedicine(id);
    else toggleMedicine(id);
});

renderMedicines();
