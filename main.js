let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let completedTasks = document.querySelector(".completed-tasks");

// Empty Array To Store The Tasks
let arrayOfTasks = [];

// Check if There is Tasks In Local Storage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

// Get Data From Local Storage
getDataFromLocalSt();

// Add task
submit.onclick = function () {
  if (input.value.trim() !== "") {
    addTaskToArray(input.value); // Add Task To Array Of Tasks
    input.value = ""; // Empty Input Field
  }
};

// Handle Enter Button
input.onkeydown = function (event) {
  if (event.key == "Enter") {
    if (input.value.trim() !== "") {
      addTaskToArray(input.value); // Add Task To Array Of Tasks
      input.value = ""; // Empty Input Field
    }
  }
};

// Click On Task Element
tasksDiv.addEventListener("click", (e) => {
  // Delete Button
  if (e.target.className === "del") {
    // Remove Task From Local Storage
    deleteTask(e.target.parentElement.dataset.id);
    // Remove Element From Page
    e.target.parentElement.remove();
  }
  // Task Element
  if (e.target.classList.contains("task")) {
    // Toggle Completed For The Task
    toggleStatusTask(e.target.dataset.id);
    // Toggle Done Class
    e.target.classList.toggle("done");
    e.target.firstElementChild.classList.toggle("done");
  }
  // The Child div of Task Element
  if (e.target.classList.contains("task-text")) {
    // Toggle Completed For The Task
    toggleStatusTask(e.target.parentElement.dataset.id);
    // Toggle Done Class
    e.target.parentElement.classList.toggle("done");
    e.target.classList.toggle("done");
  }
});

function addTaskToArray(taskText) {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // push Task To Array Of Tasks
  arrayOfTasks.push(task);
  // Add Tasks To Page
  addElementsToPage(arrayOfTasks);
  // Add Tasks To Local Storage
  addDataToLocalSt(arrayOfTasks);
}

function addElementsToPage(arrayOfTasks) {
  // Empty Tasks Div
  tasksDiv.innerHTML = "";
  // Looping On Array Of Tasks
  arrayOfTasks.forEach((task) => {
    // Create Main Div
    let div = document.createElement("div");
    div.className = "task";
    div.dataset.id = task.id;
    let divText = document.createElement("div");
    divText.className = "task-text";
    divText.innerHTML = task.title;
    div.appendChild(divText);
    // Check If Task Is Done
    if (task.completed) {
      div.classList.add("done");
      divText.classList.add("done");
    }
    // Create Delete Button
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));
    // Append Button To Main Div
    div.appendChild(span);
    // Add Main Div To Tasks Div
    tasksDiv.appendChild(div);
  });
  // Add Delete All Button
  if (arrayOfTasks.length > 1) {
    createDeleteAllBtn();
  }
}

function addDataToLocalSt(arrayOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalSt() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPage(tasks);
  }
}

function deleteTask(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalSt(arrayOfTasks);
  if (arrayOfTasks.length <= 1) {
    tasksDiv.lastElementChild.remove();
  }
}

function toggleStatusTask(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].completed = !arrayOfTasks[i].completed;
    }
  }
  addDataToLocalSt(arrayOfTasks);
}

function createDeleteAllBtn() {
  let button = document.createElement("button");
  button.classList.add("del-all");
  button.innerHTML = "Delete All";
  tasksDiv.append(button);
}

document.addEventListener("click", (event) => {
  if (event.target.className == "del-all") {
    arrayOfTasks = [];
    tasksDiv.innerHTML = "";
    window.localStorage.removeItem("tasks");
  }
});
