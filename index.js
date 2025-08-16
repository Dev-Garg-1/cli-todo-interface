import { Command } from 'commander'; 
import fs from 'fs'
import chalk from 'chalk';

const program = new Command();

// helper function
const initFileWithFirstTodo = (todo) => {
    let initialTodoArr = [];

    const firstTodo = {
        "id": 1,
        "title": todo
    }

    initialTodoArr.push(firstTodo)

    const todoToBeAdded = JSON.stringify(initialTodoArr, null, 2)

    fs.writeFile('Todo-list.json', todoToBeAdded, 'utf-8',  err => {
        if(err) {
            console.log("Something went wrong while adding the todo in the list !!")
        }else {
            console.log("todo added successfully !!");
        }
    })
}

program
  .name('cli-todo-interface')
  .description('CLI to alter todo list.')
  .version('1.0.0');

// code to add a todo in the Todo-list.json file
program.command('add')
  .description('Add the given todo in the todo list')
  .argument('<string>', 'todo to be added')
  .action((todo) => {
    fs.readFile('Todo-list.json', 'utf-8', (err, data) => {
        if(err) {
            if(err.code === "ENOENT") {
                initFileWithFirstTodo(todo);
            }else {
                console.log("Error in reading the file !!");
            }
        }else {
            if(data.trim() === "") {
                initFileWithFirstTodo(todo);
            }else {
                let todoData = JSON.parse(data)
            
                const maxId = todoData.length === 0 ? 0 : todoData[todoData.length - 1].id;

                const newTodo = {
                    "id": maxId + 1,
                    "title": todo
                }

                todoData.push(newTodo)

                const todoToBeAdded = JSON.stringify(todoData, null, 2)

                fs.writeFile('Todo-list.json', todoToBeAdded, 'utf-8',  err => {
                    if(err) {
                        console.log("Something went wrong while adding the todo in the list !!")
                    }else {
                        console.log("todo added successfully !!");
                    }
                })
            }
        }
    })
  });

// code to delete a todo in the Todo-list.json file
program.command('delete')
  .description('delete the given todo id from the todo list')
  .argument('<number>', 'todo id to be deleted')
  .action((todoId) => {
    fs.readFile('Todo-list.json', 'utf-8', (err, data) => {
        if(err) {
            console.log("Error in reading the file !!")
        }else {
            if(data.trim() === "") {
                console.log("The file is completey empty. Pls first add a todo to delete it.")
                return;
            }

            let todoData = JSON.parse(data);

            if(todoData.length === 0) {
                console.log("There is nothing to delete in the todo list.")
                return;
            }

            let newTodoArr = []

            let todoIdFoundFlag = false;

            for(let i = 0; i < todoData.length; i++) {
                if(todoData[i].id !== Number(todoId)) {
                    newTodoArr.push(todoData[i]);
                }else if(todoData[i].id === Number(todoId)) {
                    todoIdFoundFlag = true;
                }
            }

            if(todoIdFoundFlag === false) {
                console.log("There is no such todo id that exist in the todo list.");
                return;
            }

            const newTodoArrToBeAdded = JSON.stringify(newTodoArr, null, 2);

            fs.writeFile('Todo-list.json', newTodoArrToBeAdded, 'utf-8',  err => {
                if(err) {
                    console.log("Something went wrong while deleteing the todo from the list !!")
                }else {
                    console.log("todo item deleted successfully !!");
                }
            })
        }
    })
  });

// code to update a todo in the ouptut.json file
program.command('update')
  .description('update the given todo id in the todo list')
  .argument('<number>', 'todo id to be updated')
  .argument('<string>', 'new todo which is to be updated')
  .action((todoId, updatedTodo) => {
    fs.readFile('Todo-list.json', 'utf-8', (err, data) => {
        if(err) {
            console.log("Error in reading the file !!")
        }else {
            if(data.trim() === "") {
                console.log("The file is completey empty. Pls first add a todo in it.")
                return;
            }

            let todoData = JSON.parse(data);

            if(todoData.length === 0) {
                console.log("There is nothing in the todo list.")
                return;
            }

            let todoIdFoundFlag = false;

            for(let i = 0; i < todoData.length; i++) {
                if(todoData[i].id === Number(todoId)) {
                    todoData[i].title = updatedTodo;
                    todoIdFoundFlag = true
                }
            }

            if(todoIdFoundFlag === false) {
                console.log("There is no such todo with this id !!");
                return;
            }

            const newTodoArrToBeAdded = JSON.stringify(todoData, null, 2);

            fs.writeFile('Todo-list.json', newTodoArrToBeAdded, 'utf-8',  err => {
                if(err) {
                    console.log("Something went wrong while updating the todo !!")
                }else {
                    console.log("todo item updated successfully !!");
                }
            })
        }
    })
  });

// code to show all the todo's present in the todo-list
program.command('show')
  .description('show all the todo in the todo-list')
  .action(() => {
    fs.readFile('Todo-list.json', 'utf-8', (err, data) => {
        if(err) {
            console.log("Error in reading the file !!")
        }else {
            if(data.trim() === "") {
                console.log("The file is completey empty. So nothing to show !!")
                return;
            }

            let todoData = JSON.parse(data);

            if(todoData.length === 0) {
                console.log("There is nothing in the todo list.")
                return;
            }

            console.log("-----------------------------------------------------------------")
            console.log(chalk.green.underline.bold("ToDo - List\n"));

            for(let i = 0; i < todoData.length; i++) {
                console.log(i + 1, ") (id: ",todoData[i].id, ")", todoData[i].title);
            }

            console.log("-----------------------------------------------------------------")
        }
    })
  });

program.parse();