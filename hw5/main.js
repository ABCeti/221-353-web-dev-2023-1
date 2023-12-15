'use strict';

function displayTask(taskInfo) {
    let liTemplate = document.getElementById('task-template').content.firstElementChild;
    let li = liTemplate.cloneNode(true);
    li.querySelector(".task-name").textContent = taskInfo.name;
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

let modal = document.getElementById("editModal");
modal.addEventListener('show.bs.modal', beforeOpenEditModal);

