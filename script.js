//Making an object with default value
const defaultObject = {
"Tutorial": {
    "To-Do": {
        "001": "Add a new category",
        "002": "Click over that category"
    },
    "Completed": {
        "003": "Open Focus Now"
    }
}
}

//If there is localStorage then set that as categoryObject else defaultObject
let categoryObject;
try {
  categoryObject = JSON.parse(localStorage.getItem("tasksList")) || defaultObject;
} catch (e) {
  categoryObject = defaultObject;
}

//Initial value of active
let active = ""

//----------------------------------------------------------------------------------------------------------

/*Script for adding task */
const tasks = document.querySelector(".tasks")
const taskInput = document.querySelector(".task-input") 
const addTask = document.getElementById("addTask")
const cancelTask = document.querySelector(".cancel-task")
const submitTask = document.querySelector(".submit-task")
const completedTasks = document.querySelector(".completed-lists")

addTask.addEventListener("click", showTaskInput)
cancelTask.addEventListener("click", removeTaskInput)
submitTask.addEventListener("click", addInList)
tasks.addEventListener("click", doneAndRemove)
completedTasks.addEventListener("click", doneAndRemove)

//----------------------------------------------------------------------------------------------------------

/*Script for adding Category*/
const addCategory = document.getElementById("addCategories")
const categoryInput = document.querySelector(".category-input")
const cancelCategory = document.querySelector(".cancel-category")
const submitCategory = document.querySelector(".submit-category")
const cateList = document.querySelector(".cate-list")

addCategory.addEventListener("click", showCategoryInput)
cancelCategory.addEventListener("click", removeCategoryInput)
submitCategory.addEventListener("click", addInCategory)
cateList.addEventListener("click", removeCategory)
/*Rendering each category to-do and completed tasks*/
cateList.addEventListener("click", renderCategoryTasks)

//----------------------------------------------------------------------------------------------------------

//Adds the task to the specific category and displays it
function addInList(){
    const inputT = document.getElementById("task")
    if (!inputT.value) return
    const p = document.createElement("p")
    p.textContent = inputT.value
    p.dataset.originalText = p.textContent

    //Adding in the categoryObject to its active category
    let uniqueId = Math.floor(Math.random() * 1000) + 1
    while(Object.hasOwn(categoryObject[active]["To-Do"], uniqueId)){
        uniqueId = Math.floor(Math.random() * 1000) + 1
    }

    categoryObject[active]["To-Do"][uniqueId] = p.textContent

    //Creating done and remove button
    const done = document.createElement("button")
    const remove = document.createElement("button")
    done.textContent = "✔"
    remove.textContent = "✘"
    done.classList.add("done")
    remove.classList.add("remove")

    p.append(done)
    p.append(remove)

    tasks.append(p)
    inputT.value = ""

    removeTaskInput()
    setItem()
}

//Helper function to hide the input and show the add button again
function removeTaskInput(){
    addTask.style.display = "block";
    taskInput.style.display = "none";
}

//Helper function to show the input container but only if there is a active category
function showTaskInput(){
    //If nothing is active then don't allow to input
    if (!active){
        alert("Please add category first")
        return
    }
    addTask.style.display = "none";
    taskInput.style.display = "flex";
}

//Adds category in the category list and also in the object
function addInCategory(){
    const inputC = document.getElementById("category")
    if (!inputC.value || Object.hasOwn(categoryObject, inputC.value)) return
    const p = document.createElement("p")
    p.classList.add("paragraphCategory")
    p.textContent = inputC.value;
    p.dataset.originalText = p.textContent

    //Adding in category object
    categoryObject[p.dataset.originalText] = {}
    categoryObject[p.dataset.originalText]["To-Do"] = {} //Storing new tasks with unique id
    categoryObject[p.dataset.originalText]["Completed"] = {}

    const button = document.createElement("button")
    button.textContent = "✘"
    button.classList.add("removeCategory")

    p.append(button)
    cateList.append(p)
    inputC.value = ""

    if (!active){
        active = p.dataset.originalText
        p.classList.add("is-active")
    }

    removeCategoryInput()
    setItem()
}

//Helper function to remove the input container from category section
function removeCategoryInput(){
    const inputC = document.getElementById("category")
    addCategory.style.display = "block"
    categoryInput.style.display = "none"
    inputC.value = ""
}

//Helper function to show the input contianer from category section
function showCategoryInput(){
    addCategory.style.display = "none"
    categoryInput.style.display = "flex"
}

/*
* Helper function to remove the category while deleting that category from the object
* Also checks the edge cases like is it the active one, is there another category available
*/
function removeCategory(e){
    if (e.target.closest("button")){
        const category = e.target.closest("p")
        const title = category.dataset.originalText
        delete categoryObject[title]
        if (active === title){
            active = Object.keys(categoryObject)[0]
            if (!active){
                active = ""
                tasks.innerHTML = ""
                completedTasks.innerHTML = ""
            }else{
                const p = cateList.querySelectorAll("p")
                p.forEach(element => {
                    if (element.dataset.originalText === active){
                        element.classList.add("is-active")
                    }
                })
                renderTasks(active)
            }
        }

        category.remove()
        setItem()
    }
}

/*Removing Task & Events for completing task*/
function doneAndRemove(e){
    const task = e.target.closest("p")
    const dataId = task.dataset.id
    const pendingTask = categoryObject[active]["To-Do"]
    const completedTask = categoryObject[active]["Completed"]
    if (e.target.closest(".done")){
        const p = document.createElement("p")
        p.textContent = task.dataset.originalText

        //Adding inside the categoryObject to its respective active category
        if (categoryObject[active]){
            delete pendingTask[dataId]
            completedTask[dataId] = p.textContent
        }

        const button = document.createElement("button")
        button.textContent = "✘"
        button.classList.add("remove")

        p.append(button)
        completedTasks.append(p)

        task.remove()
        setItem()
    }
    if (e.target.closest(".remove")){
        if (Object.hasOwn(pendingTask, dataId)){
            delete pendingTask[dataId]
        }
        if (Object.hasOwn(completedTask, dataId)){
            delete completedTask[dataId]
        }
        task.remove()
        setItem()
    }
}

//Helper function to render the tasks list
function renderTasks(value){
    //Removing the currenlty displayed pending and completed tasks.
    tasks.innerHTML = ""
    completedTasks.innerHTML = ""

    renderToDoAndCompleted(value)
}

//Render the pending and completed task when it is clicked to a category
function renderCategoryTasks(e){
    const category = e.target.closest("p")
    if (!category) return
    const allParagraph = cateList.querySelectorAll("p")

    if (e.target.matches(".paragraphCategory")){
        allParagraph.forEach(p => {
        p.classList.remove("is-active")
        })
        category.classList.add("is-active")
        if (active === category.dataset.originalText) return
        active = category.dataset.originalText

        renderTasks(category.dataset.originalText)
    }
}

//Helper function to display the pending and completed task
function renderToDoAndCompleted(objKey){
    const toDoList = categoryObject[objKey]["To-Do"]
    const completed = categoryObject[objKey]["Completed"]

    for (let [key, value] of Object.entries(toDoList)){
        const p = document.createElement("p")
        p.textContent = value
        p.dataset.originalText = p.textContent
        p.dataset.id = key

        const done = document.createElement("button")
        const remove = document.createElement("button")
        done.textContent = "✔"
        remove.textContent = "✘"
        done.classList.add("done")
        remove.classList.add("remove")

        p.append(done)
        p.append(remove)

        //tasks is the variable we store our pending task which is already declared in the beginning
        tasks.append(p)
    }

    for (let [key, value] of Object.entries(completed)){
        const p = document.createElement("p")
        p.textContent = value
        p.dataset.originalText = value
        p.dataset.id = key

        const button = document.createElement("button")
        button.textContent = "✘"
        button.classList.add("remove")

        p.append(button)

        //completedTasks is where we append our tasks which is completed(Variable already declared)
        completedTasks.append(p)
    }
}

//Function to set the object to localStorage
function setItem(){
    localStorage.setItem("tasksList", JSON.stringify(categoryObject))
}

//Function to render the the localStorage
function renderLocalStorage(){
    const keys = Object.keys(categoryObject)
    if (!keys) return //If there isn't anything to render simply return or do nothing.
    keys.forEach(key => {
        const p = document.createElement("p")
        p.classList.add("paragraphCategory")
        p.textContent = key;
        p.dataset.originalText = p.textContent

        const button = document.createElement("button")
        button.textContent = "✘"
        button.classList.add("removeCategory")

        p.append(button)
        cateList.append(p)
    })

    const firstKey = keys[0]
    renderToDoAndCompleted(firstKey)

    if (!active){
        //This will target the first p element which is the active one.
        const p = document.querySelector("p") 
        active = p.dataset.originalText
        p.classList.add("is-active")}
}

//Calling out localStorage for the first time when the page is loaded or re-loaded
renderLocalStorage()