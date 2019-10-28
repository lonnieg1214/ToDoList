import { TodoList } from './TodoList';
import { View } from './View';
import { ToDoController } from './ToDoController';

const list = new TodoList();
const view = new View();

const controller = new ToDoController(list, view);


