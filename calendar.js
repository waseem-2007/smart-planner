const STORAGE_KEY = 'smart-planner-state';
const calendar = document.getElementById('calendar');
const monthTitle = document.getElementById('calendar-month');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const disciplineRoutines = document.getElementById('discipline-routines');
const analysisSummary = document.getElementById('analysis-summary');
const analysisStreak = document.getElementById('analysis-streak');
const analysisTotal = document.getElementById('analysis-total');
const analysisMessage = document.getElementById('analysis-message');

const defaultState = {
    tasks: [],
    notes: '',
    medicines: [],
    timings: [],
    routines: [
        { id: 1, name: 'Wake up early', done: false },
        { id: 2, name: 'Study session', done: false },
        { id: 3, name: 'Exercise', done: false },
        { id: 4, name: 'Sleep on time', done: false }
    ],
    completedDays: {},
    startDate: new Date().toISOString()
};

let currentDate = new Date();
let state = loadState();

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return defaultState;
    }

    try {
        const parsed = JSON.parse(saved);
        return {
            ...defaultState,
            ...parsed,
            routines: Array.isArray(parsed.routines) && parsed.routines.length ? parsed.routines : defaultState.routines,
            completedDays: parsed.completedDays || {}
        };
    } catch (error) {
        return defaultState;
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderDisciplineRoutines() {
    disciplineRoutines.innerHTML = '';
    state.routines.forEach((routine) => {
        const item = document.createElement('button');
        item.className = 'discipline-item';
        item.textContent = routine.name;
        disciplineRoutines.appendChild(item);
    });
}

function getDayKey(date, day) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getCurrentStreak() {
    let streak = 0;
    const cursor = new Date();

    while (true) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
        if (state.completedDays[key]) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

function renderAnalysis() {
    const monthCompleted = Object.keys(state.completedDays).filter((key) => key.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-`)).length;
    const totalCompleted = Object.keys(state.completedDays).length;
    const streak = getCurrentStreak();

    analysisSummary.textContent = totalCompleted === 0
        ? 'No discipline marks yet. One small win today can start your streak.'
        : streak >= 5
            ? `Amazing focus! Your streak is ${streak} days strong.`
            : `You have ${monthCompleted} completed day(s) in this month and ${totalCompleted} in total.`;

    analysisStreak.textContent = streak;
    analysisTotal.textContent = monthCompleted;
    analysisMessage.textContent = streak >= 3
        ? 'Your discipline is building momentum. Keep the routine alive.'
        : 'A steady routine starts with one good day.';
}

function renderCalendar(date) {
    calendar.innerHTML = '';
    monthTitle.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach((day) => {
        const cell = document.createElement('div');
        cell.className = 'day-name';
        cell.textContent = day;
        calendar.appendChild(cell);
    });

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.className = 'calendar-cell';
        blank.innerHTML = '<span class="day-number"></span>';
        calendar.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        const dayKey = getDayKey(date, day);
        if (state.completedDays[dayKey]) {
            cell.classList.add('done-day');
        }
        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            cell.classList.add('today');
        }
        const button = document.createElement('button');
        button.className = 'day-toggle';
        button.textContent = '✓';
        button.dataset.day = day;
        button.addEventListener('click', () => {
            state.completedDays[dayKey] = !state.completedDays[dayKey];
            saveState();
            renderCalendar(date);
            renderAnalysis();
        });
        cell.innerHTML = `<span class="day-number">${day}</span>`;
        cell.appendChild(button);
        calendar.appendChild(cell);
    }

    renderAnalysis();
}

prevBtn.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar(currentDate);
});

disciplineRoutines.addEventListener('click', (event) => {
    const buttons = disciplineRoutines.querySelectorAll('button');
    buttons.forEach((btn) => btn.classList.remove('active'));
    if (event.target.matches('button')) {
        event.target.classList.add('active');
    }
});

renderDisciplineRoutines();
renderCalendar(currentDate);
