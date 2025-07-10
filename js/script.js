// Global task list
let tasks = [];

// Tambah tugas baru
function addTask() {
    event.preventDefault(); // Hindari reload form

    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');

    if (taskInput.value.trim() === '' || dueDateInput.value === '') {
        alert('Please fill in both task and due date.');
        return;
    }

    const newTask = {
        id: Date.now(),
        task: taskInput.value.trim(),
        dueDate: dueDateInput.value,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = '';
    dueDateInput.value = '';

    displayTasks();
}

// Tampilkan daftar tugas
function displayTasks(filter = 'all') {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true; // show all
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<tr><td colspan="4">No tasks found.</td></tr>`;
        return;
    }

    filteredTasks.forEach(task => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.task}</td>
            <td>${task.dueDate}</td>
            <td>
                <span class="${task.completed ? 'status-done' : 'status-pending'}">
                    ${task.completed ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td>
                <button class="btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-toggle" onclick="toggleTaskCompletion(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// Edit tugas tertentu
function editTask(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const task = tasks.find(t => t.id === id);

    if (!task || !row) return;

    // Buat form edit langsung di baris
    row.innerHTML = `
        <td><input type="text" id="edit-task-${id}" value="${task.task}" /></td>
        <td><input type="date" id="edit-date-${id}" value="${task.dueDate}" /></td>
        <td>${task.completed ? 'Completed' : 'Pending'}</td>
        <td>
            <button onclick="saveTask(${id})">Save</button>
            <button onclick="displayTasks()">Cancel</button>
        </td>
    `;
}


// Hapus tugas tertentu
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    const filter = document.getElementById('filter-tasks').value;
    displayTasks(filter);
}

// Hapus semua tugas
function deleteAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        displayTasks();
    }
}

// Toggle status selesai/belum
function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        const filter = document.getElementById('filter-tasks').value;
        displayTasks(filter);
    }
}

// Filter tugas
function filterTasks() {
    const filter = document.getElementById('filter-tasks').value;
    displayTasks(filter);
}
