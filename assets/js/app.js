// switch to dark mode
document.querySelector('.theme-toggle-button').addEventListener('click', () => {
    document.body.classList.toggle('dark')
})

/**
 * afficher une tache saisie dans la liste => todo
 * marqué une tache comme complété avec un check, texte grisé et barré => checked
 * supprimer une tache en appuyant sur la croix
 *
 * affichage du nombres de taches restantes
 *
 * afficher toutes les taches => todo + checked
 * afficher les taches actives => todo
 * afficher les taches completees => checked
 *
 * suppression des taches completés
 *
 * drag and drop pour réarranger les taches
 */

const displayLS = JSON.parse(localStorage.getItem('todos')) || []
// console.log(displayLS)

const form = document.querySelector('form')
const input = document.querySelector('input')
const list = document.querySelectorAll('.todo-form li')
const nbr_items = document.querySelector('.nbr-items')
const itemsWhithOrWithoutS = document.querySelector('.oneItem')

// initialise le nombre d'item à zéro
nbr_items.innerHTML = 0

// add todo to the todo list
form.addEventListener('submit', e => {
    e.preventDefault();
        displayTodo()
})

//display todo in local storage
displayLS.forEach((data, index) => {
    displayTodo(data, index)
});

// display all tasks
function displayTodo(data, index) {
    const todo = input.value

    if (data) {
        newData = data.task
    }

    if (data || todo) {
        const li = document.createElement('li');
        li.setAttribute('data-index', index)
        document.querySelector('.todo-form').appendChild(li);

        const div = document.createElement('div')
        div.classList.add('draggable')
        div.setAttribute('draggable', true)
        li.appendChild(div)

        const para =  document.createElement('p')
        para.textContent = todo || newData
        div.appendChild(para)

        const figure = document.createElement('figure')
        figure.classList.add('cross')
        div.appendChild(figure)

        const img = document.createElement('img')
        img.src = "http://127.0.0.1:5502/assets/images/icon-cross.svg"
        img.alt = 'cross'
        img.classList.add('remove')
        figure.appendChild(img)

        const label = document.createElement('label')
        label.classList.add('label')
        label.setAttribute('for', 'checkbox')
        div.appendChild(label)

        const input = document.createElement('input')
        input.classList.add('checkbox')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('autocomplete', 'off')
        input.type = 'checkbox'
        if (data) {
            input.checked = data.done
        }
        label.appendChild(input)

        numberOfItems(1)

        li.addEventListener('change', e => {
            if (data !== undefined) {
                data.done = e.target.checked
                localStorage.setItem('todos', JSON.stringify(displayLS))
                if (data.done) {
                    li.classList.add('done')
                } else {
                    li.classList.remove('done')
                }
            } else {
                location.reload()
            }
        })

        if (data !== undefined) {
            if (data.done === true) {
                li.classList.add('done')
            }
        }

        // delete todo by clicking on the cross
        img.addEventListener('click', () => {
            const id = li.dataset.index
            displayLS.splice(id, 1)
            localStorage.setItem('todos', JSON.stringify(displayLS));
            location.reload()
        })

        saveLS(todo)
    }
}

// save into localStorage
function saveLS(todo) {
    if (todo !== '') {
        displayLS.push({
            task: todo,
            done: false
        })
        input.value = ''
        localStorage.setItem('todos', JSON.stringify(displayLS))
    }
}

// number of items left
function numberOfItems(number) {
    nbr_items.innerHTML =+ nbr_items.innerHTML + number

    if ((parseInt(nbr_items.innerHTML)) <= 1) {
        itemsWhithOrWithoutS.innerHTML = ' item left'
    } else {
        itemsWhithOrWithoutS.innerHTML = ' items left'
    }
}

// clear completed task
document.querySelector('.clear-completed').addEventListener('click', () => {
    let newLSAgain = displayLS.filter(t => t.done !== true)
    localStorage.setItem('todos', JSON.stringify(newLSAgain))
    location.reload()
})

// filter to diplay all tasks, active tasks or completed tasks
const selected = document.querySelectorAll('.select-container li')
selected.forEach(element => {
    element.addEventListener('click', e => {
        selected.forEach(el => {
            el.classList.remove('active')
        })
        element.classList.add('active')
        filterTodoItems(e.target.id)
    })
});

// filter to diplay all tasks, active tasks or completed tasks
function filterTodoItems(id) {
    const AllItems = document.querySelectorAll('.todo-form li')
    switch (id) {
        case 'completed':
            AllItems.forEach(element => {
                if (!element.classList.contains('done')) {
                    element.classList.add('hidden')
                } else {
                    element.classList.remove('hidden')
                }
            });
            break;

        case 'active':
            AllItems.forEach(element => {
                if (element.classList.contains('done')) {
                    element.classList.add('hidden')
                } else {
                    element.classList.remove('hidden')
                }
            });
            break;

        default:
            AllItems.forEach(element => {
                element.classList.remove('hidden')
            });
            break;
    }
}

