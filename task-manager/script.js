class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderAllTasks();
        this.updateStats();
        this.setupKeyboardShortcuts();
        this.setupDragAndDrop();
    }

    loadTasks() {
        const stored = localStorage.getItem('brutalTasks');
        return stored ? JSON.parse(stored) : [];
    }

    saveTasks() {
        localStorage.setItem('brutalTasks', JSON.stringify(this.tasks));
    }

    addTask(title, priority = 'medium') {
        const task = {
            id: Date.now(),
            title: title.trim(),
            priority: priority,
            status: 'todo',
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderAllTasks();
        this.updateStats();
        this.showToast('Task added successfully!');
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderAllTasks();
        this.updateStats();
        this.showToast('Task deleted!');
    }

    toggleComplete(taskId) {
        this.tasks = this.tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed,
                    status: !task.completed ? 'done' : 'todo'
                };
            }
            return task;
        });
        this.saveTasks();
        this.renderAllTasks();
        this.updateStats();
    }

    togglePriority(taskId) {
        const priorityOrder = ['low', 'medium', 'high'];
        this.tasks = this.tasks.map(task => {
            if (task.id === taskId) {
                const currentIndex = priorityOrder.indexOf(task.priority);
                const nextIndex = (currentIndex + 1) % priorityOrder.length;
                return { ...task, priority: priorityOrder[nextIndex] };
            }
            return task;
        });
        this.saveTasks();
        this.renderAllTasks();
        this.showToast('Priority updated!');
    }

    moveTask(taskId, newStatus) {
        this.tasks = this.tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    status: newStatus,
                    completed: newStatus === 'done'
                };
            }
            return task;
        });
        this.saveTasks();
        this.renderAllTasks();
        this.updateStats();
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        } else if (['low', 'medium', 'high'].includes(this.currentFilter)) {
            filtered = filtered.filter(task => task.priority === this.currentFilter);
        }

        return filtered;
 
    getTasksByStatus(status) {
        return this.getFilteredTasks().filter(task => task.status === status);
    }

    renderAllTasks() {
        this.renderTaskList('todoList', 'todo');
        this.renderTaskList('inProgressList', 'inProgress');
        this.renderTaskList('doneList', 'done');
    }

    renderTaskList(listId, status) {
        const list = document.getElementById(listId);
        const tasks = this.getTasksByStatus(status);

        const statusIcons = {
            'todo': `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                    </svg>`,
            'inProgress': `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>`,
            'done': `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>`
        };

        list.innerHTML = tasks.map(task => `
                    <div 
                        class="task-card priority-${task.priority} ${task.completed ? 'completed' : ''}"
                        draggable="true"
                        data-task-id="${task.id}"
                        ondragstart="handleDragStart(event)"
                        ondragend="handleDragEnd(event)"
                    >
                        <div class="task-header">
                            <div style="display: flex; align-items: center;">
                                <span class="priority-indicator"></span>
                                <span class="task-priority-badge">${task.priority}</span>
                            </div>
                            <span class="task-priority-badge">
                                ${statusIcons[task.status]}
                                ${task.status}
                            </span>
                        </div>
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <div class="task-actions">
                            <button class="task-btn" onclick="taskManager.toggleComplete(${task.id})">
                                ${task.completed ?
                `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="1 4 1 10 7 10"/>
                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                                    </svg> Undo` :
                `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg> Done`
            }
                            </button>
                            <button class="task-btn btn-priority" onclick="taskManager.togglePriority(${task.id})">
                                <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 4 23 10 17 10"/>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                                Priority
                            </button>
                            <button class="task-btn btn-delete" onclick="taskManager.deleteTask(${task.id})">
                                <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('');

        document.getElementById(`${status}Count`).textContent = tasks.length;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').innerHTML = `
                    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                        <rect x="9" y="3" width="6" height="4" rx="1"/>
                    </svg>
                    Total: ${total}
                `;
        document.getElementById('completedTasks').innerHTML = `
                    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Done: ${completed}
                `;
        document.getElementById('pendingTasks').innerHTML = `
                    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Pending: ${pending}
                `;
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
            this.tasks = [];
            this.saveTasks();
            this.renderAllTasks();
            this.updateStats();
            this.showToast('All tasks cleared!');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.innerHTML = `
                    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    ${message}
                `;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    setupDragAndDrop() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('taskInput').focus();
            }

            if (e.key === 'Escape') {
                document.getElementById('taskInput').blur();
            }
        });
    }
}

const taskManager = new TaskManager();

function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('prioritySelect').value;
    const title = input.value.trim();

    if (title === '') {
        input.focus();
        taskManager.showToast('Please enter a task title!');
        return;
    }

    taskManager.addTask(title, priority);
    input.value = '';
    input.focus();
}

function filterTasks(filter) {
    taskManager.currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const buttons = document.querySelectorAll('.filter-btn');
    const filterMap = {
        'all': 0,
        'low': 1,
        'medium': 2,
        'high': 3,
        'completed': 4
    };

    if (buttons[filterMap[filter]]) {
        buttons[filterMap[filter]].classList.add('active');
    }

    taskManager.renderAllTasks();
}

function clearAllTasks() {
    taskManager.clearAllTasks();
}

let draggedTaskId = null;

function handleDragStart(event) {
    draggedTaskId = event.target.dataset.taskId;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    draggedTaskId = null;

    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.target.closest('.task-list').classList.add('drag-over');
}

function handleDrop(event, status) {
    event.preventDefault();

    const taskList = event.target.closest('.task-list');
    if (taskList) {
        taskList.classList.remove('drag-over');
    }

    const taskId = parseInt(event.dataTransfer.getData('text/plain'));
    if (taskId && status) {
        taskManager.moveTask(taskId, status);
        taskManager.showToast(`Task moved to ${status}!`);
    }

    draggedTaskId = null;
}

document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

if (taskManager.tasks.length === 0) {
    taskManager.addTask('Design new landing page', 'high');
    taskManager.addTask('Fix navigation bug', 'medium');
    taskManager.addTask('Update documentation', 'low');
    taskManager.addTask('Code review PR #123', 'high');
    taskManager.addTask('Weekly team meeting', 'medium');
}