const TASK_STORAGE_KEY = 'taskbossTasks';

function getStoredTasks() {
    const raw = localStorage.getItem(TASK_STORAGE_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

function deleteTask(taskId) {
    const tasks = getStoredTasks().filter(task => task.id !== taskId);
    saveTasks(tasks);
    renderTaskList(tasks);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderTaskList(tasks) {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    taskList.innerHTML = '';
    if (!tasks.length) {
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one to get started.</div>';
        return;
    }

    tasks.slice().reverse().forEach(task => {
        const card = document.createElement('article');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-card-header">
                <h2 class="task-card-title">${escapeHtml(task.title)}</h2>
                <div class="task-card-actions">
                    <span class="task-chip ${escapeHtml(task.urgency || 'Medium').toLowerCase()}">${escapeHtml(task.urgency || 'Medium')}</span>
                    <button type="button" class="task-delete-button" data-task-id="${task.id}">Delete</button>
                </div>
            </div>
            <div class="task-row">
                <div>
                    <span class="label">Assigned</span>
                    <span class="value">${escapeHtml(task.given)}</span>
                </div>
                <div>
                    <span class="label">Due</span>
                    <span class="value">${escapeHtml(task.due)}</span>
                </div>
            </div>
            <div class="task-row">
                <div style="grid-column: 1 / -1;">
                    <span class="label">Notes</span>
                    <span class="value">${escapeHtml(task.notes || '—')}</span>
                </div>
            </div>
        `;
        taskList.appendChild(card);
        const deleteButton = card.querySelector('.task-delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });
        }
    });
}

function handleTaskForm() {
    const taskForm = document.getElementById('task-form');
    if (!taskForm) return;

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = taskForm.title.value.trim();
        const given = taskForm.given.value;
        const due = taskForm.due.value;
        const urgency = taskForm.urgency.value;
        const notes = taskForm.notes.value.trim();

        if (!title || !given || !due) {
            return;
        }

        const tasks = getStoredTasks();
        tasks.push({
            id: Date.now(),
            title,
            given,
            due,
            urgency,
            notes,
        });
        saveTasks(tasks);
        window.location.href = 'taskboss.html';
    });
}

function initTaskbossPage() {
    const taskListContainer = document.getElementById('task-list');
    if (taskListContainer) {
        renderTaskList(getStoredTasks());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleTaskForm();
    initTaskbossPage();
});
