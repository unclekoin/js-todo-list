// Data
const tasks = [
  {
    id: 1,
    completed: false,
    text: 'Watch the new JavaScript tutorial',
  },
  {
    id: 2,
    completed: false,
    text: 'Take the test after the lesson',
  },
  {
    id: 3,
    completed: false,
    text: 'Do your homework after lesson',
  },
];

// Global variables & function calls
const body = document.body;
const rootElement = body.querySelector('#tasks');
createHTML(rootElement);
createNewTask(tasks);
printTasks(tasks);
createModal(body);
openModal(tasks);
closeModal();

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
function printTasks(tasks) {
  tasks.forEach((task) => {
    createTaskHTML(task);
  });
}

// Function creates new task
function createNewTask(tasks) {
  const tasksList = rootElement.querySelector('.tasks-list');
  document
    .querySelector('.create-task-block')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const { target } = event;
      const input = target.taskName;
      const id = tasks[tasks.length - 1].id + 1;

      removerErrorMessage();

      if (checkValidInput(input.value, tasks)) {
        tasks.push({
          id,
          completed: false,
          text: input.value,
        });

        tasksList.innerHTML = '';
        printTasks(tasks);
      }

      input.value = '';
    });
}

// Input task validation, prints error message, delete error message
function checkValidInput(text, tasks) {
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

function removerErrorMessage() {
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

function openModal(tasks) {
  rootElement
    .querySelector('.tasks-list')
    .addEventListener('click', (event) => {
      const { target } = event;
      if (target.closest('.task-item__delete-button')) {
        body
          .querySelector('.modal-overlay')
          .classList.remove('modal-overlay_hidden');
        // deleteTask(target.dataset.deleteTaskId, tasks);
      }
    });
}


function closeModal() {
  body.querySelector('.delete-modal__buttons').addEventListener('click', (event) => {
    const { target } = event;
    if (target.closest('.delete-modal__button'))
      body
        .querySelector('.modal-overlay')
        .classList.add('modal-overlay_hidden');
  });
}
