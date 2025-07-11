let tasks = [];
let editTaskId = null;

// Tambah atau update tugas
function addTask() {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const taskValue = taskInput.value.trim();
    const dateValue = dueDateInput.value;

    // Validasi kosong
    if (taskValue === '' || dateValue === '') {
        showMessage('Silakan isi nama tugas dan tanggal!');
        return;
    }

    //  Validasi task hanya huruf A-Z a-z dan spasi
    const taskRegex = /^[a-zA-Z\s]+$/;
    if (!taskRegex.test(taskValue)) {
        showMessage('Task hanya boleh berisi huruf A-Z atau a-z');
        return;
    }

    //  Validasi format tanggal
    const selectedDate = new Date(dateValue);
    const isValidDate = !isNaN(selectedDate.getTime());
    if (!isValidDate) {
        showMessage('Tanggal tidak valid!');
        return;
    }

    //  Validasi tahun maksimal
    const selectedYear = selectedDate.getFullYear();
    if (selectedYear > 2100) {
        showMessage('Tahun terlalu jauh ke depan! Maksimal 2100.');
        return;
    }

    //  Validasi tidak boleh tanggal masa lalu
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset jam
    if (selectedDate < today) {
        showMessage('Tanggal tidak boleh di masa lalu!');
        return;
    }

    // Validasi duplikat (jika tidak sedang edit)
    if (!editTaskId) {
        const isDuplicate = tasks.some(
            (t) => t.task === taskValue && t.dueDate === dateValue
        );
        if (isDuplicate) {
            showMessage('Tugas dengan nama dan tanggal yang sama sudah ada!');
            return;
        }
    }

    // Tambah atau update
    if (editTaskId !== null) {
        const task = tasks.find(t => t.id === editTaskId);
        if (task) {
            task.task = taskValue;
            task.dueDate = dateValue;
            showMessage('Tugas berhasil diperbarui');
        }
        editTaskId = null;

        // Ganti kembali ke ikon plus setelah update
        document.getElementById('submit-button').innerHTML = '<i class="fa-solid fa-plus"></i>';
    } else {
        const newTask = {
            id: Date.now(),
            task: taskValue,
            dueDate: dateValue,
            completed: false
        };
        tasks.push(newTask);
        showMessage('Tugas berhasil ditambahkan');
    }

    // Reset input dan tampilkan ulang
    taskInput.value = '';
    dueDateInput.value = '';
    displayTasks(currentFilter);
}

let currentFilter = 'all'; // menyimpan filter aktif

// Tampilkan daftar tugas
function displayTasks(filter = 'all') {
    currentFilter = filter;
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<tr><td colspan="4">No tasks found.</td></tr>`;
        return;
    }

    filteredTasks.forEach(task => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', task.id);

        row.innerHTML = `
            <td>${task.task}</td>
            <td>${task.dueDate}</td>
            <td>
                <span class="${task.completed ? 'status-done' : 'status-pending'}">
                    ${task.completed ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td>
                <button class="btn-edit" onclick="editTask(${task.id})">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="btn-toggle" onclick="toggleTaskCompletion(${task.id})">
                    ${task.completed
                        ? '<i class="fa-solid fa-rotate-left"></i>'
                        : '<i class="fa-solid fa-check"></i>'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// Dropdown toggle logic
document.addEventListener('click', function (e) {
    const dropdown = document.querySelector('.dropdown');
    const btn = dropdown.querySelector('.dropdown-btn');
    
    if (btn.contains(e.target)) {
        dropdown.classList.toggle('show');
    } else {
        dropdown.classList.remove('show');
    }
});

// Fungsi pemicu filter dari dropdown
function filterTasks(filter) {
    displayTasks(filter);
}

// Isi form untuk mengedit
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('task-input').value = task.task;
    document.getElementById('due-date-input').value = task.dueDate;
    editTaskId = id;

    // Ganti ikon tombol ke check
    const submitBtn = document.getElementById('submit-button');
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
}

// Hapus tugas tertentu
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    displayTasks(currentFilter);
    showMessage('Tugas berhasil dihapus');
}

// Hapus semua tugas
function deleteAllTasks() {
    if (tasks.length === 0) {
        showMessage('Tidak ada tugas untuk dihapus');
        return;
    }

    tasks = [];
    displayTasks(currentFilter);
    showMessage('Semua tugas berhasil dihapus');
}

// Toggle status selesai/belum
function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        displayTasks(currentFilter);
        showMessage(`Tugas ditandai sebagai ${task.completed ? 'selesai' : 'belum selesai'}`);
    }
}

// Tampilkan notifikasi seperti toast
function showMessage(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

// Tampilkan daftar kosong saat pertama kali dibuka
document.addEventListener('DOMContentLoaded', function () {
    displayTasks(); // filter default = 'all'
});
