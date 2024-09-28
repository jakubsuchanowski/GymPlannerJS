document.addEventListener('DOMContentLoaded', function() {
    const userToken = localStorage.getItem('token');
    const backButton = document.getElementById('back-button');
    const addPlanForm = document.getElementById('add-plan-form');
    const addExerciseButton = document.getElementById('add-exercise-button');
    const selectedExercisesList = document.getElementById('selected-exercises-list')
    const filterButton=documnt.getElementById('bodypart-filter-button')

    // Ładowanie ćwiczeń
    loadExercises();
    loadFilterExercises();

    // Obsługa powrotu do dashboardu
    backButton.addEventListener('click', function() {
        window.location.href = 'dashboard.html'; // Powrót do dashboardu
    });

    // Obsługa dodawania planu
    addPlanForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Zapobiega domyślnej akcji formularza
        addWorkoutPlan();
    });
    addExerciseButton.addEventListener('click', function() {
        addExercise();
    });


    function loadFilterExercises(){
        if (!selectedBodyPart) {
            alert('Proszę wybrać partię ciała.');
            return;
        }

        fetch(`http://localhost:8080/exercise/show/filter?bodyPart=${encodeURIComponent(selectedBodyPart)}`,{        
            method: 'GET',
            headers: {
            'Authorization': 'Bearer ' + userToken,
        }
    })
    .then(response=>{
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Nie udało się załadować ćwiczeń.');
        }
    })
    .then(data => {
        const exerciseSelect = document.getElementById('exercise-select');
        data.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.id;
            option.textContent = exercise.name,exercise.reps,exercise.series ? exercise.name : 'Nie podano nazwy';                
            exerciseSelect.appendChild(option);
            
        });
    })
    function getSelectedBodyPart() {
        // Assuming you have radio buttons for body parts
        const bodyParts = document.getElementsByName('bodyPart'); // Replace with your input name
        for (const part of bodyParts) {
            if (part.checked) {
                return part.value; // Return the value of the checked radio button
            }
        }
        return null; // Return null if no body part is selected
    }
    
    // Event listener to trigger filtering when a radio button is selected
    document.querySelectorAll('input[name="bodyPart"]').forEach(radio => {
        radio.addEventListener('change', loadFilterExercises);
    });

    function loadExercises() {
        fetch('http://localhost:8080/exercise/show', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + userToken,
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Nie udało się załadować ćwiczeń.');
            }
        })
        .then(data => {
            console.log('Dane ćwiczeń:', data);
            const exerciseSelect = document.getElementById('exercise-select');
            data.forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise.id;
                option.textContent = exercise.name,exercise.reps,exercise.series ? exercise.name : 'Nie podano nazwy';                
                exerciseSelect.appendChild(option);
            });
        })
        .catch(error => {
            alert(error.message);
            console.error('Błąd:', error);
        });
    }
    function addExercise() {
        const exerciseSelect = document.getElementById('exercise-select');
        const selectedOption = exerciseSelect.options[exerciseSelect.selectedIndex];
        if (selectedOption) {
            const exerciseId = selectedOption.value;
            const exerciseName = selectedOption.textContent;

            const listItem = document.createElement('li');
            listItem.textContent = exerciseName;
            listItem.dataset.exerciseId = exerciseId; // Przechowuje ID ćwiczenia

            selectedExercisesList.appendChild(listItem);
        } else {
            alert('Proszę wybrać ćwiczenie.');
        }
    }

    function addWorkoutPlan() {
        const planName = document.getElementById('plan-name').value;
        const selectedExercises = Array.from(selectedExercisesList.children)
            .map(item => parseInt(item.dataset.exerciseId));

        const workoutPlan = {
            name: planName,
            exerciseIds: selectedExercises
        };

        fetch('http://localhost:8080/workoutplan/new', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workoutPlan)
        })
        .then(response => {
            if (response.ok) {
                alert('Plan został dodany!');
                window.location.href = 'dashboard.html'; // Przekierowanie do dashboardu
            } else {
                throw new Error('Nie udało się dodać planu.');
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Błąd:', error);
        });
    }
});