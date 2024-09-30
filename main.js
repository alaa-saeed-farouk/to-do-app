let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let separator = document.querySelector(".separator");
let completedTasksDiv = document.querySelector(".completed-tasks");
let deleteAll = document.querySelector(".del-all");

// Empty Array to Store the Uncompleted Tasks
let arrayOfTasks = [];

// Empty Array to Store the Completed Tasks
let arrayOfCompletedTasks = [];

// Check if There Are Uncompleted Tasks in Local Storage
if (localStorage.getItem("tasks")) {
  tasksDiv.style.display = "block";
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
  addElementsToPage(tasksDiv, arrayOfTasks);
}

// Check if There Are completed Tasks in local Storage
if (localStorage.getItem("completedTasks")) {
  completedTasksDiv.style.display = "block";
  separator.style.display = "block";
  arrayOfCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"));
  addElementsToPage(completedTasksDiv, arrayOfCompletedTasks);
}

// Add Disabled Attribute on Submit Button If the Input Value Is Empty
submit.disabled = true;
input.addEventListener("input", () => {
  if (input.value.trim() !== "") {
    submit.disabled = false;
  } else {
    submit.disabled = true;
  }
});

// Add task
submit.onclick = function () {
  checkInputValue();
};

// Handle Enter Button
input.onkeydown = function (event) {
  if (event.key == "Enter") {
    if (input.value.trim() !== "") {
      checkInputValue();
    } else {
      return false;
    }
  }
};

// Check The Input Field Value
function checkInputValue() {
  if (input.value.trim() !== "") {
    addTaskToArray(input.value, false, arrayOfTasks, tasksDiv, "tasks"); // Add Task To Array Of Tasks
    tasksDiv.style.display = "block";
    input.value = ""; // Empty Input Field
    submit.disabled = true; // Disabled Submit Button
  }
}

document.addEventListener("click", (e) => {
  // Delete Button
  if (e.target.className === "del") {
    // Remove Task From Array and Add The New Array To Local Storage
    if (e.target.parentElement.parentElement == completedTasksDiv) {
      deleteTask(
        e.target.parentElement.dataset.id,
        arrayOfCompletedTasks,
        "completedTasks"
      );
      checkArrayLength(arrayOfCompletedTasks, completedTasksDiv, separator);
    } else {
      deleteTask(e.target.parentElement.dataset.id, arrayOfTasks, "tasks");
      checkArrayLength(arrayOfTasks, tasksDiv);
    }
    // Remove Task Element From Page
    e.target.parentElement.remove();
  }

  // Check the Task Status Using the Checkbox Input
  if (e.target.classList.contains("checkbox")) {
    if (e.target.checked) {
      // Toggle Done Class
      e.target.parentElement.classList.toggle("done");
      completedTasksDiv.style.display = "block";
      separator.style.display = "block";
      addTaskToArray(
        e.target.nextElementSibling.textContent,
        true,
        arrayOfCompletedTasks,
        completedTasksDiv,
        "completedTasks"
      );
      // Delete the Completed Task From the Array
      deleteTask(e.target.parentElement.dataset.id, arrayOfTasks, "tasks");
      // Remove Task Element From Page
      e.target.parentElement.remove();
      document.getElementById("task-sound").play();
      checkArrayLength(arrayOfTasks, tasksDiv);
    } else {
      tasksDiv.style.display = "block";
      addTaskToArray(
        e.target.nextElementSibling.textContent,
        false,
        arrayOfTasks,
        tasksDiv,
        "tasks"
      );
      // Delete the Uncompleted Task From the Array
      deleteTask(
        e.target.parentElement.dataset.id,
        arrayOfCompletedTasks,
        "completedTasks"
      );
      // Remove Task Element From Page
      e.target.parentElement.remove();
      document.getElementById("task-sound").play();
      checkArrayLength(arrayOfCompletedTasks, completedTasksDiv, separator);
    }
  }
});

function addTaskToArray(taskText, status, array, element, locKey) {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: status,
  };
  // push Task To Array
  array.push(task);
  // Add Tasks To Page
  addElementsToPage(element, array);
  // Add Tasks To Local Storage
  addDataToLocalSt(locKey, array);
}

function addElementsToPage(element, array) {
  // Empty the Content of the Element
  element.innerHTML = "";
  // Looping On Array Of Tasks
  array.forEach((task) => {
    // Create Main Div
    let div = document.createElement("div");
    div.className = "task";
    div.dataset.id = task.id;
    let checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.className = "checkbox";
    div.appendChild(checkboxInput);
    let divText = document.createElement("div");
    divText.innerHTML = task.title;
    div.appendChild(divText);
    // Check If Task Is Done
    if (task.completed) {
      div.classList.add("done");
      checkboxInput.checked = true;
    } else {
      div.classList.remove("done");
      checkboxInput.checked = false;
    }
    // Create Delete Button
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));
    // Append Button To Main Div
    div.appendChild(span);
    // Add Main Div To Tasks Div
    element.appendChild(div);
  });
  // Add Delete All Button
  if (arrayOfTasks.length + arrayOfCompletedTasks.length > 1) {
    deleteAll.style.display = "block";
  }
}

function checkArrayLength(arr, ...elements) {
  if (!arr.length) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }
}

function addDataToLocalSt(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function deleteTask(taskId, arr, locKey) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == taskId) {
      arr.splice(i, 1);
      addDataToLocalSt(locKey, arr);
      if (!arr.length) window.localStorage.removeItem(locKey);
      break;
    }
  }
  if (arrayOfTasks.length + arrayOfCompletedTasks.length <= 1) {
    deleteAll.style.display = "none";
  }
}

document.addEventListener("click", (event) => {
  if (event.target.className == "del-all") {
    arrayOfTasks = [];
    arrayOfCompletedTasks = [];
    tasksDiv.innerHTML = "";
    completedTasksDiv.innerHTML = "";
    window.localStorage.removeItem("tasks");
    window.localStorage.removeItem("completedTasks");
    event.target.style.display = "none";
    tasksDiv.style.display = "none";
    separator.style.display = "none";
    completedTasksDiv.style.display = "none";
  }
});
