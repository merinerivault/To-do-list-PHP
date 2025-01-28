// Début Frontend
document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments HTML
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const API_URL = 'api/tasks.php'; // Centralisation de l'URL du backend

    // Charger les tâches depuis le backend au démarrage
    loadTasksFromBackend();

    // Fonction pour ajouter une tâche
    async function addTask() {
        const taskValue = taskInput.value.trim();

        if (taskValue === '') {
            alert('Veuillez entrer une tâche.');
            return;
        }

        // Vérifier si la tâche existe déjà dans la liste
        if (Array.from(taskList.children).some(li => li.textContent.includes(taskValue))) {
            alert('Cette tâche existe déjà.');
            return;
        }

        const li = createTaskElement(taskValue);
        taskList.appendChild(li);
        setTimeout(() => li.classList.add('show'), 10);

        // Sauvegarder la tâche dans le backend
        const success = await saveTaskToBackend(taskValue, false);

        if (!success) {
            alert('Erreur lors de la sauvegarde de la tâche.');
            li.remove();
        }

        taskInput.value = ''; // Effacer le champ de saisie
    }

    // Fonction pour créer un élément <li> pour une tâche
    function createTaskElement(taskValue, completed = false) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Conteneur pour la checkbox et le texte
        const taskContainer = document.createElement('div');
        taskContainer.className = 'd-flex align-items-center';

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2';
        checkbox.checked = completed;

        // Ajouter l'événement pour barrer le texte
        checkbox.addEventListener('change', async () => {
            li.classList.toggle('text-decoration-line-through', checkbox.checked);
            const success = await updateTaskInBackend(taskValue, checkbox.checked);
            if (!success) {
                alert('Erreur lors de la mise à jour de la tâche.');
                checkbox.checked = !checkbox.checked; // Annuler le changement
                li.classList.toggle('text-decoration-line-through', checkbox.checked);
            }
        });

        // Texte de la tâche
        const taskText = document.createElement('span');
        taskText.textContent = taskValue;
        enableTaskEditing(taskText);

        // Ajouter la checkbox et le texte au conteneur
        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(taskText);

        // Bouton Supprimer
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Supprimer';

        deleteBtn.addEventListener('click', async () => {
            li.classList.remove('show');
            setTimeout(async () => {
                li.remove();
                const success = await deleteTaskFromBackend(taskValue);
                if (!success) alert('Erreur lors de la suppression de la tâche.');
            }, 300);
        });

        // Ajouter le conteneur et le bouton au <li>
        li.appendChild(taskContainer);
        li.appendChild(deleteBtn);

        if (completed) li.classList.add('text-decoration-line-through');
        return li;
    }

    // Permettre la modification de la tâche avec un double-clic
    function enableTaskEditing(taskText) {
        taskText.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskText.textContent;
            input.className = 'form-control';

            taskText.replaceWith(input);

            input.addEventListener('blur', async () => {
                const updatedValue = input.value.trim() || taskText.textContent;
                taskText.textContent = updatedValue;
                input.replaceWith(taskText);

                const isCompleted = taskText.parentElement.querySelector('input[type="checkbox"]').checked;
                const success = await updateTaskInBackend(updatedValue, isCompleted);
                if (!success) alert('Erreur lors de la mise à jour de la tâche.');
            });

            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    input.blur(); // Simuler le blur sur "Enter"
                }
            });
        });
    }

    // Charger les tâches depuis le backend
    async function loadTasksFromBackend() {
        try {
            const response = await fetch(`${API_URL}?action=read`);
            const tasks = await response.json();

            tasks.forEach(task => {
                const li = createTaskElement(task.text, task.completed);
                taskList.appendChild(li);
                setTimeout(() => li.classList.add('show'), 10);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des tâches :', error);
        }
    }

    // Sauvegarder une tâche dans le backend
    async function saveTaskToBackend(taskValue, completed) {
        try {
            const response = await fetch(`${API_URL}?action=create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskValue, completed }),
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la tâche :', error);
            return false;
        }
    }

    // Mettre à jour une tâche dans le backend
    async function updateTaskInBackend(taskValue, completed) {
        try {
            const response = await fetch(`${API_URL}?action=update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskValue, completed }),
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche :', error);
            return false;
        }
    }

    // Supprimer une tâche dans le backend
    async function deleteTaskFromBackend(taskValue) {
        try {
            const response = await fetch(`${API_URL}?action=delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskValue }),
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche :', error);
            return false;
        }
    }

    // Écouteurs d'événements
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});

// Fin Frontend



  