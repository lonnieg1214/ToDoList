
export class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }

    _commit(todos) {
        this.onTodoListChanged(todos)
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    addTodo(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            text: todoText,
            complete: false
        }

        this.todos.push(todo);

        this._commit(this.todos);
        this.onTodoListChanged(this.todos);
    }
    editTodo(id, newText) {
        const todoToEdit = this.todos[id - 1];
        todoToEdit.text = newText;

        this._commit(this.todos);
        this.onTodoListChanged(this.todos);
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);

        this._commit(this.todos);
        this.onTodoListChanged(this.todos);
    }

    toggleTodo(id) {
        const toDoElement = this.todos[id - 1];
        if (toDoElement.complete)
            toDoElement.complete = false;

        else
            toDoElement.complete = true;


        this._commit(this.todos);
        this.onTodoListChanged(this.todos);
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }
}

