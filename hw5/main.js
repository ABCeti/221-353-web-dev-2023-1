'use strict';

function displayTask(taskInfo) {
    let liTemplate = document.getElementById('task-template').content.firstElementChild;
    let li = liTemplate.cloneNode(true);
    li.querySelector(".task-name").innerText = taskInfo.name;
    li.id = taskInfo.id;
    let list = document.getElementById(`${taskInfo.status}-list`);
    list.append(li);
}

function displayAllTask() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (!key.startsWith('task-'))
            continue;
        let value = localStorage.getItem(key);
        displayTask(JSON.parse(value));
    }
}

function showTask(event) {
    let button = event.relatedTarget;
    let taskNum = button.closest('.task').id;
    let taskInfo = JSON.parse(localStorage.getItem(taskNum));
    let form = document.getElementById('showTaskForm');
    form.elements['taskName'].value = taskInfo.name;
    form.elements['taskDescription'].value = taskInfo.description;
    form.elements['taskStatus'].value = taskInfo.status;
}

let showButton = document.getElementById('showskButton');
showButton.addEventListener('click', showTask);

function moveTask(event) {
    let button = event.target;
    let taskNum = button.closest('.task').id;
    let taskInfo = JSON.parse(localStorage.getItem(taskNum));

    let newStatus = button.classList.contains('move-to-do') ? 'to-do' : 'done';

    taskInfo.status = newStatus;
    localStorage.setItem(taskNum, JSON.stringify(taskInfo));

    let listItem = document.getElementById(taskNum);
    let newList = document.getElementById(`${newStatus}-list`);
    newList.appendChild(listItem);
}

document.querySelectorAll('.task .move-to-do, .task .move-done').forEach(function (button) {
    button.addEventListener('click', moveTask);
});

function deleteTask(event) {
    let button = event.target;
    let taskNum = button.closest('.task').id;

    // Удаление задачи из localStorage
    localStorage.removeItem(taskNum);

    // Удаление задачи из DOM
    let listItem = document.getElementById(taskNum);
    listItem.remove();
}

// Обработчики событий для кнопок удаления
document.querySelectorAll('.task .fa-trash-o').forEach(function (button) {
    button.addEventListener('click', deleteTask);
});

function createTask(event) {
    let form = document.getElementById("newTaskForm");
    let taskName = form.elements['taskName'].value;
    let taskDescription = form.elements['taskDescription'].value;
    let taskStatus = form.elements['taskStatus'].value;
    let taskNum = Number(localStorage.getItem('taskNum'));
    let taskInfo = {
        id: `task-${taskNum}`,
        name: taskName,
        description: taskDescription,
        status: taskStatus 
    };
    localStorage.setItem(taskInfo.id, JSON.stringify(taskInfo));
    localStorage.setItem('taskNum', taskNum + 1);
    displayTask(taskInfo);
    form.reset();
}

function saveTask(event) {
    let form = document.getElementById("editTaskForm");
    let taskName = form.elements['taskName'].value;
    let taskDescription = form.elements['taskDescription'].value;
    let taskStatus = form.elements['taskStatus'].value;
    let taskNum = form.dataset.id;
    let taskInfo = {
        id: taskNum,
        name: taskName,
        description: taskDescription,
        status: taskStatus 
    };

    localStorage.setItem(taskInfo.id, JSON.stringify(taskInfo));

    let listItem = document.getElementById(taskInfo.id);
    console.log(listItem)
    listItem.querySelector(".task-name").innerHTML = taskInfo.name;
}

function beforeOpenEditModal(event) {
    let button = event.relatedTarget;
    let taskNum = button.closest('.task').id;
    let taskInfo = JSON.parse(localStorage.getItem(taskNum));
    let form = event.target.querySelector('#editTaskForm');
    form.elements['taskName'].value = taskInfo.name;
    form.elements['taskDescription'].value = taskInfo.description;
    form.elements['taskStatus'].value = taskInfo.status;
    form.dataset.id = taskNum;
}

if (!localStorage.getItem('taskNum')) {
    localStorage.setItem('taskNum', 0);
}

let createButton = document.getElementById("createTaskButton");
createButton.onclick = createTask;
window.onload = displayAllTask;

let editsaveButton = document.getElementById("saveTaskButton");
editsaveButton.onclick = saveTask;

let editModal = document.getElementById("editModal");
editModal.addEventListener('show.bs.modal', beforeOpenEditModal);

