//Debut Frontend

document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments HTML
    const taskInput = document.getElementById('taskInput');  // Champ de saisie pour la tâche
    const addTaskBtn = document.getElementById('addTaskBtn');  // Bouton "Ajouter"
    const taskList = document.getElementById('taskList');  // Liste des tâches
  
    // Charger les tâches depuis le localStorage au démarrage
    loadTasksFromLocalStorage();

    // Fonction pour ajouter une tâche
    function addTask() {
      const taskValue = taskInput.value.trim();
  
      if (taskValue === '') {
        alert('Veuillez entrer une tâche.');
        return;
      }
  
      const li = createTaskElement(taskValue); // Crée un élément <li> pour la tâche
      taskList.appendChild(li); // Ajoute le <li> à la liste des tâches
  
      setTimeout(() => li.classList.add('show'), 10); // Animation d'apparition
      saveTasksToLocalStorage(); // Sauvegarde après ajout
      taskInput.value = ''; // Efface le champ de saisie
    }

      function createTaskElement(taskValue, completed = false) {  // Crée un élément <li> pour une tâche
        const li = document.createElement('li');   // Crée un élément <li>
        li.className = 'list-group-item d-flex justify-content-between align-items-center';  // Ajoute des classes CSS pour la mise en page
  
      // Créer une div pour contenir la checkbox et le texte
      const taskContainer = document.createElement('div');  // Crée une div pour contenir la checkbox et le texte
      taskContainer.className = 'd-flex align-items-center';  // Ajoute des classes CSS pour la mise en page
  
      // Ajouter une checkbox
      const checkbox = document.createElement('input');  // Crée une checkbox
      checkbox.type = 'checkbox';   // Définit le type de l'élément comme une checkbox
      checkbox.className = 'form-check-input me-2';  // Ajoute des classes CSS pour la mise en page
      checkbox.checked = completed;  // Définit la checkbox comme cochée si la tâche est terminée
  
      // Ajouter un événement pour barrer le texte lorsqu'il est coché
      checkbox.addEventListener('change', () => {   // Ajoute un événement pour barrer le texte lorsqu'il est coché
        li.classList.toggle('text-decoration-line-through', checkbox.checked);   // Ajoute une classe CSS pour barrer le texte lorsqu'il est coché
        saveTasksToLocalStorage();  // Sauvegarde les tâches dans le localStorage après avoir modifié la checkbox
      });
  
      // Ajouter le texte de la tâche
      const taskText = document.createElement('span');  // Crée un élément <span> pour le texte de la tâche
      taskText.textContent = taskValue;  // Définit le texte de la tâche
      
      // Permettre la modification de la tâche avec un double-clic
      enableTaskEditing(taskText);

  
      // Ajouter le texte et la checkbox dans la div
      taskContainer.appendChild(checkbox);  // Ajoute la checkbox à la div
      taskContainer.appendChild(taskText);  // Ajoute le texte de la tâche à la div
  
      // Ajouter le bouton "Supprimer"
      const deleteBtn = document.createElement('button');  // Crée un bouton "Supprimer"
      deleteBtn.className = 'btn btn-danger btn-sm';   // Ajoute des classes CSS pour la mise en page
      deleteBtn.textContent = 'Supprimer';   // Définit le texte du bouton "Supprimer"
      deleteBtn.addEventListener('click', () => {   // Ajoute un événement pour supprimer la tâche lorsque le bouton "Supprimer" est cliqué
        li.classList.remove('show');   // Supprime la tâche de la liste
        setTimeout(() => {   // Supprime la tâche après un court délai
          li.remove();    // Supprime la tâche de la liste
          saveTasksToLocalStorage(); // Sauvegarde après la suppression
        }, 300);   // Délai de 300 millisecondes pour la suppression
      });
  
      // Ajouter la div et le bouton "Supprimer" au <li>
      li.appendChild(taskContainer);   // Ajoute la div à la liste
      li.appendChild(deleteBtn);   // Ajoute le bouton "Supprimer" à la liste
  
      // Ajouter le <li> à la liste des tâches
      if (completed) li.classList.add('text-decoration-line-through');   // Ajoute une classe CSS pour barrer le texte si la tâche est terminée
      return li;   // Retourne le <li> créé
    }
  

      function enableTaskEditing(taskText) {   // Permet la modification de la tâche avec un double-clic
        taskText.addEventListener('dblclick', () => {    // Ajoute un événement pour permettre la modification de la tâche avec un double-clic
          // Créer un champ de saisie pour modifier la tâche
          const input = document.createElement('input');  // Crée un champ de saisie pour modifier la tâche
          input.type = 'text';   // Définit le type de l'élément comme un champ de saisie
          input.value = taskText.textContent;   // Définit la valeur du champ de saisie avec le texte de la tâche
          input.className = 'form-control';   // Ajoute des classes CSS pour la mise en page
      
          // Remplacer le texte par le champ de saisie
          taskText.replaceWith(input);
      
          // Sauvegarder la modification lorsqu'on perd le focus ou appuie sur Entrée
          input.addEventListener('blur', () => saveTaskEdit(input, taskText));  // Sauvegarde la modification lorsqu'on perd le focus ou appuie sur Entrée
          input.addEventListener('keypress', (e) => {   // Sauvegarde la modification lorsqu'on perd le focus ou appuie sur Entrée
            if (e.key === 'Enter') saveTaskEdit(input, taskText);   // Sauvegarde la modification lorsqu'on perd le focus ou appuie sur Entrée
          });
        });
      }
      
      function saveTaskEdit(input, taskText) {    // Sauvegarde la modification lorsqu'on perd le focus ou appuie sur Entrée
        taskText.textContent = input.value.trim() || taskText.textContent;   // Met à jour le texte de la tâche avec la valeur du champ de saisie
        input.replaceWith(taskText);   // Remplace le champ de saisie par le texte de la tâche
        saveTasksToLocalStorage(); // Sauvegarde après modification du texte
      }
 
      function saveTasksToLocalStorage() {    // Sauvegarde les tâches dans le localStorage
        const tasks = [];    // Crée un tableau pour stocker les tâches
        document.querySelectorAll('#taskList li').forEach(li => {   // Parcourt toutes les tâches
          const taskText = li.querySelector('span').textContent;   // Récupère le texte de la tâche
          const isCompleted = li.querySelector('input[type="checkbox"]').checked;    // Récupère l'état de la tâche (terminée ou non)
          tasks.push({ text: taskText, completed: isCompleted });    // Ajoute la tâche au tableau
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));    // Sauvegarde le tableau dans le localStorage
      }

        // Charger les tâches depuis le localStorage
      function loadTasksFromLocalStorage() {   // Charger les tâches depuis le localStorage
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
          savedTasks.forEach(task => {
        const li = createTaskElement(task.text, task.completed);
          taskList.appendChild(li);
        setTimeout(() => li.classList.add('show'), 10); // Animation d'apparition
        });
      }

        // Écouter les événements sur le bouton "Ajouter"
      addTaskBtn.addEventListener('click', addTask);

        // Permettre l'ajout avec la touche "Entrée"
      taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addTask();
        }
        });
});

// Fin front end 

  