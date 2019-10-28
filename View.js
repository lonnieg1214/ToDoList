const _initLocalListeners = new WeakMap();
const _temporaryTodoText = new WeakMap();

export class View {
    constructor() {
        this.app = this.getElement('body');



        //the title of the app
        this.title = this.createElement('h1');
        this.title.textContent = 'To-dos';


        /**
         * the form, with a[type='text']
         * input, and a submit button
         */
        this.createFormSection();

        //visual representation of the todo list
        this.todoList = this.createElement('ul', 'todo-list');

        //append the input and submit button to the form
        this.app.append(this.title, this.form, this.todoList);
        _temporaryTodoText.set(this);

        Object.defineProperty(this, 'temporaryTodoText', {
            get: _temporaryTodoText.get(this)
        });

        _initLocalListeners.set(this, () => {
            this.todoList.addEventListener('input', event => {
                if (event.target.className === 'editable') {
                    this.temporaryTodoText = event.target.innerText;
                }
            });
        });
    }

    createFormSection() {
        this.form = this.createElement('form');
        this.input = this.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Add todo';
        this.input.name = 'todo';
        this.submitButton = this.createElement('button');
        this.submitButton.textContent = 'Add';

        this.form.append(this.input, this.submitButton);
    }

    get initLocalListeners() {
        return _initLocalListeners.get(this);
    }

    get temporaryTodoText() {
        return _temporaryTodoText.get(this);
    }

    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);

        return element
    }

    getElement(selector) {
        const element = document.querySelector(selector);

        return element;
    }

    get _todoText() {
        return this.input.value;
    }

    _resetInput() {
        this.input.value = '';
    }

    displayTodos(todos) {
        while (this.todoList.firstChild)
            this.todoList.removeChild(this.todoList.firstChild);

        //show default when there are no tasks
        if (todos.length === 0) {
            const p = this.createElement('p')
            p.textContent = 'Nothing to do! Add a task?';
            this.todoList.append(p);
        } else {
            todos.forEach(todo => {
                const li = this.createElement('li');
                li.id = todo.id;

                //each todo has a check box toggle
                const checkbox = this.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.complete;

                //the todo item text is in a contenteditable span
                const span = this.createElement('span', 'editable');
                span.contentEditable = true;

                //if the todo is complete, it will have a strikethrough
                if (todo.complete) {
                    const strike = this.createElement('s');
                    strike.textContent = todo.text;
                    span.append(strike);
                } else {
                    span.textContent = todo.text;
                }

                //the todos will also have a delete button
                const deleteButton = this.createElement('button', 'delete');
                deleteButton.textContent = 'Delete';
                li.append(checkbox, span, deleteButton);

                //append nodes to the todo list
                this.todoList.append(li);
            });
        }
    }

    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this._todoText) {
                handler(this._todoText);
                this._resetInput();
            }
        });
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id);
                handler(id);
            }
        });
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id);

                handler(id);
            }
        });
    }

    bindEditTodo(handler) {
        this.todoList.addEventListener('focusout', event => {
            if (this.temporaryTodoText) {
                const id = parseInt(event.target.parentElement.id)

                handler(id, this._temporaryTodoText);
                this.temporaryTodoText = '';
            }
        });
    }


}