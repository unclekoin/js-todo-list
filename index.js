// Data
const tasks = [
  {
    id: '1',
    completed: false,
    text: 'Watch the new JavaScript tutorial',
  },
  {
    id: '2',
    completed: false,
    text: 'Take the test after the lesson',
  },
  {
    id: '3',
    completed: false,
    text: 'Do your homework after lesson',
  },
];

// Global variables & function calls
const body = document.body;
const rootElement = body.querySelector('#tasks');
const currentTask = {};
let isLight = true;
createHTML(rootElement);
createNewTask();
printTasks();
createModal(body);
openModal();
closeModal();
deleteTask();

// Element creation function
function createElement(tag, parent, options = {}, to = 'append') {
  const { cls = [], attr = {}, text = '' } = options;
  const el = document.createElement(tag);

  if (cls.length) el.classList.add(...cls);

  if (Object.keys(attr).length) {
    Object.entries(attr).forEach(([key, value]) => el.setAttribute(key, value));
  }

  if (text) el.textContent = text;

  to === 'append' ? parent.append(el) : parent.prepend(el);
  return el;
}

// Function creating HTML layout
function createHTML(root) {
  const wrapper = createElement('div', root, {
    cls: ['tasks__wrapper'],
  });

  // add task form
  const addTaskForm = createElement('form', wrapper, {
    cls: ['create-task-block'],
  });

  createElement('input', addTaskForm, {
    cls: ['create-task-block__input', 'default-text-input'],
    attr: {
      name: 'taskName',
      type: 'text',
      placeholder: 'Create a new task',
      value: '',
    },
  });
  createElement('button', addTaskForm, {
    cls: ['create-task-block__button', 'default-button'],
    attr: { type: 'submit' },
    text: 'Create',
  });

  // Add tasks list
  createElement('div', wrapper, {
    cls: ['tasks-list'],
  });
}

// Function creating HTML layout for task
function createTaskHTML(task) {
  const tasksList = rootElement.querySelector('.tasks-list');

  const item = createElement('div', tasksList, {
    cls: ['task-item'],
    attr: { 'data-task-id': task.id },
  });
  const container = createElement('div', item, {
    cls: ['task-item__main-container'],
  });
  const content = createElement('div', container, {
    cls: ['task-item__main-content'],
  });
  const form = createElement('form', content, {
    cls: ['checkbox-form'],
  });
  createElement('input', form, {
    cls: ['checkbox-form__checkbox'],
    attr: { type: 'checkbox', id: `task-${task.id}` },
  });
  createElement('label', form, { attr: { for: `task-${task.id}` } });
  createElement('span', content, {
    cls: ['task-item__text'],
    text: task.text,
  });
  createElement('button', container, {
    cls: ['task-item__delete-button', 'default-button', 'delete-button'],
    attr: { 'data-delete-task-id': task.id },
    text: 'Delete',
  });
}

// Function prints tasks
function printTasks() {
  tasks.forEach((task) => {
    createTaskHTML(task);
  });
}

// Function creates new task
function createNewTask() {
  const tasksList = rootElement.querySelector('.tasks-list');
  document
    .querySelector('.create-task-block')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const { target } = event;
      const input = target.taskName;
      const id = Math.random().toString(16).slice(-4);

      removeErrorMessage();

      if (checkValidInput(input.value)) {
        tasks.unshift({
          id,
          completed: false,
          text: input.value,
        });

        tasksList.innerHTML = '';
        printTasks();
        changeThemeHandler(event, true);
      }

      input.value = '';
    });
}

// Input task validation, prints error message, delete error message
function checkValidInput(text) {
  let msg;

  if (!text.trim()) {
    msg = 'The task name should not be empty.';
    printErrorMessage(msg);
  } else if (tasks.find((task) => task.text === text.trim())) {
    msg = 'A task with this name already exists.';
    printErrorMessage(msg);
  }

  return !msg;
}

function printErrorMessage(msg) {
  const form = document.querySelector('.create-task-block');
  createElement('span', form, {
    cls: ['error-message-block'],
    text: msg,
  });
}

function removeErrorMessage() {
  const element = document.querySelector('.error-message-block');
  if (!!element) element.remove();
}

function createModal(root) {
  const overlay = createElement(
    'div',
    root,
    {
      cls: ['modal-overlay', 'modal-overlay_hidden'],
    },
    'prepend'
  );
  const modal = createElement('div', overlay, {
    cls: ['delete-modal'],
  });
  createElement('h3', modal, {
    cls: ['delete-modal__question'],
    text: 'Are you sure you want to delete this task?',
  });
  const buttons = createElement('div', modal, {
    cls: ['delete-modal__buttons'],
  });
  createElement('button', buttons, {
    cls: ['delete-modal__button', 'delete-modal__cancel-button'],
    text: 'Cancel',
  });
  createElement('button', buttons, {
    cls: ['delete-modal__button', 'delete-modal__confirm-button'],
    text: 'Delete',
  });
}

function openModal() {
  rootElement
    .querySelector('.tasks-list')
    .addEventListener('click', (event) => {
      const { target } = event;

      if (target.closest('.task-item__delete-button')) {
        const id = target.closest('.task-item').dataset.taskId;
        body
          .querySelector('.modal-overlay')
          .classList.remove('modal-overlay_hidden');

        console.log(currentTask);

        Object.assign(currentTask, ...tasks.filter((task) => task.id === id));
        body.querySelector(
          '.delete-modal__question'
        ).innerHTML = `Are you sure you want to delete this task:<br/> ${currentTask.text}?`;
      }
    });
}

function deleteTask() {
  const confirmButton = body.querySelector('.delete-modal__confirm-button');
  if (confirmButton) {
    confirmButton.addEventListener('click', (event) => {
      const index = tasks.findIndex((task) => task.id === currentTask.id);
      tasks.splice(index, 1);
      rootElement.querySelector('.tasks-list').textContent = '';

      printTasks(tasks);
      changeThemeHandler(event, true);
    });
  }
}

function closeModal() {
  const deleteButton = body.querySelector('.delete-modal__buttons');
  if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      const { target } = event;
      if (target.closest('.delete-modal__button'))
        body
          .querySelector('.modal-overlay')
          .classList.add('modal-overlay_hidden');
    });
  }
}

// Change theme
const changeThemeHandler = (event, trigger = false) => {
  const buttons = body.querySelectorAll('button');
  const labels = rootElement.querySelectorAll('label');
  if (event.key === 'Tab') event.preventDefault();

  if ((event.key === 'Tab' && isLight) || (trigger && !isLight)) {
    isLight = false;
    body.style.backgroundColor = '#24292E';
    rootElement.style.color = '#FFFFFF';
    buttons.forEach((button) => (button.style.border = '1px solid #FFFFFF'));
    labels.forEach((label) =>
      label.style.setProperty('--checkbox-border-color', '#FFFFFF')
    );
  } else if ((event.key === 'Tab' && !isLight) || (trigger && isLight)) {
    isLight = true;
    body.style.backgroundColor = '#FFFFFF';
    rootElement.style.color = '#000000';
    buttons.forEach(
      (button) => (button.style.border = '1px solid transparent')
    );
    body.querySelector('.delete-modal__cancel-button').style.borderColor =
      '#FFFFFF';
    labels.forEach((label) =>
      label.style.setProperty('--checkbox-border-color', '#000000')
    );
  }
};

document.addEventListener('keydown', changeThemeHandler);
