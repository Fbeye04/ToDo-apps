const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id == todoId) {
            return todoItem;
        }
    }

    return null;
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }

    return -1;
}

// Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
function isStorageExist() /*boolean*/ {
    if(typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

// fungsi ini digunakan untuk menyimpan data ke localStorage berdasarkan KEY yang sudah ditetapkan sebelumnya
function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// fungsi ini digunakan untuk memuat data dari localStorage dan memasukkan data hasil parsing ke variabel
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data != null) {
        for(const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject) {
    const {id, task, timestamp, isCompleted} = todoObject;
  
    const textTitle = document.createElement('h2');
    textTitle.innerText = task;
  
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = timestamp;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
  
    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `todo-${id}`);
  
    if (isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(id);
      });
  
      container.append(undoButton, trashButton);
    } else {
  
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(id);
      });
  
      container.append(checkButton);
    }
  
    return container;
  }

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Data berhasil ditambahkan");
}

function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("data berhasil dihapus");
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    });

    if(isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            uncompletedTODOList.append(todoElement);  
        } else {
            completedTODOList.append(todoElement);
        }
    }
});



/*
Macam-macam Event:
    Window Event
    Form Event
    Keyboard Event
    Clipboard Event
    Mouse Event

Menambahkan Event Handler pada HTML Element:
    Menggunakan method element.addEventListerner

Custom Event:
    Merupakan Event yang nama dan cara membangkitkannya ditentukan oleh kita sendiri.

Konsep Event Bubbling dan Event Capturing:
    Event Bubbling: Event yang terjadi dari element dalam ke element luar.
    Event Capturing: Event yang terjadi dari element luar ke element dalam.

Event pada elemen <form>:
    onSubmit: Event yang dibangkitkan ketika tombol submit pada form ditekan.

Event pada elemen <input>:
    onInput:  Event yang dibangkitkan setiap kali menulis atau menghapus nilai pada elemen input.
    onFocus: Event yang dibangkitkan ketika elemen input dalam keadaan fokus.
    onBlur: Event yang dibangkitkan ketika elemen input dalam keadaan fokus berubah menjadi tidak fokus.
    onChange: Event yang dibangkitkan ketika nilai elemen input berubah.
    onCopy: Event yang dibangkitkan ketika pengguna men-copy nilai dari input.
    onPaste: Event yang dibangkitkan ketika pengguna men-paste nilai pada input.
*/