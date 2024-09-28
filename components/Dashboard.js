document.addEventListener('DOMContentLoaded', function() {
  const userEmail = localStorage.getItem('email');
  const userToken = localStorage.getItem('token');

  loadWorkoutPlans();


  document.getElementById('add-plan-button').addEventListener('click', function() {
      window.location.href = 'add_plan.html'; u
  });
});

function loadWorkoutPlans() {
  const userToken = localStorage.getItem('token');

  console.log(userToken);
  fetch('http://localhost:8080/workoutplan/show', {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + userToken,
      }
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Nie udało się załadować planów zajęć.');
      }
  })
  .then(async data => {
    const plansList = document.getElementById('workout-plans-list');
    plansList.innerHTML = ''; 

    for (const plan of data) {
        const exercisesList = plan.exercises.map(exercise => exercise.name || 'Nie podano nazwy').join(', ');
        const daysList = await getDaysForPlan(plan.id);

        const tr = document.createElement('tr');
        if (daysList && daysList.length > 0) {
            const daysString = daysList.join(', ');
          
            tr.innerHTML = `
                <td>${plan.name}</td>
                <td>${exercisesList}</td>
                <td>${daysString}</td>
                <td><button class="edit-days-button" data-plan-id="${plan.id}">Edytuj Dni</button></td>
            `;
        } else {
            
            tr.innerHTML = `
                <td>${plan.name}</td>
                <td>${exercisesList}</td>
                <td>Brak przypisanych dni</td>
                <td><button class="assign-day-button" data-plan-id="${plan.id}">Przypisz Dzień</button></td>
            `;
        }
        plansList.appendChild(tr);
    }

      const assignButtons = document.querySelectorAll('.assign-day-button');
      assignButtons.forEach(button => {
        button.addEventListener('click', function () {
          const planId = this.getAttribute('data-plan-id');
          openDaySelectionModal(planId); 
        });
      });
      const editButtons = document.querySelectorAll('.edit-days-button');
      editButtons.forEach(button => {
          button.addEventListener('click', function () {
              const planId = this.getAttribute('data-plan-id');
              openDayEditModal(planId); 
          });
      });
    })
   .catch(error => {
       alert(error.message);
       console.error('Błąd:', error);
   });
 }
 
 
 function openDaySelectionModal(planId) {
  const modal = document.getElementById('day-selection-modal');
  modal.style.display = 'flex';


  document.getElementById('close-modal').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  
  document.getElementById('day-selection-form').onsubmit = function(event) {
    event.preventDefault(); 

    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
                              .map(checkbox => checkbox.value);

    if (selectedDays.length > 0) {
      assignDaysToPlan(planId, selectedDays); 
      modal.style.display = 'none'; 
    } else {
      alert('Proszę wybrać przynajmniej jeden dzień.');
    }
  };
}

function assignDaysToPlan(planId, selectedDays) {
  const userToken = localStorage.getItem('token');
  fetch('http://localhost:8080/choose/workout/day', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    },
    body: JSON.stringify({ planId: planId, daysOfWeek: selectedDays })
  })
  .then(response => {
    if (response.ok) {
      alert('Dni zostały przypisane do planu.');
      loadWorkoutPlans(); 
      document.querySelectorAll('input[name="days"]').forEach(input => {
        input.checked = false; 
    });
    } else {
      throw new Error('Błąd podczas przypisywania dni.');
    }
  })
  .catch(error => {
    alert(error.message);
    console.error('Błąd:', error);
  });
}

function openDayEditModal(planId) {
  const modal = document.getElementById('day-selection-modal');
  modal.style.display = 'flex';

  document.getElementById('close-modal').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  document.getElementById('day-selection-form').onsubmit = function(event) {
    event.preventDefault();

    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
                              .map(checkbox => checkbox.value);

    if (selectedDays.length > 0) {
      updateDaysForPlan(planId, selectedDays); 
      modal.style.display = 'none'; 
    } else {
      alert('Proszę wybrać przynajmniej jeden dzień.');
    }
  };
}

function updateDaysForPlan(planId, selectedDays) {
  const userToken = localStorage.getItem('token');

  fetch('http://localhost:8080/choose/workout/day/edit', {
      method: 'PUT', 
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken
      },
      body: JSON.stringify({ planId: planId, daysOfWeek: selectedDays })
  })
  .then(response => {
      if (response.ok) {
          alert('Dni zostały zaktualizowane.');
          loadWorkoutPlans(); 
          document.querySelectorAll('input[name="days"]').forEach(input => {
            input.checked = false; // Ustaw wszystkie checkboxy na niezaznaczone
        });
      } else {
          throw new Error('Błąd podczas aktualizacji dni.');
      }
  })
  .catch(error => {
      alert(error.message);
      console.error('Błąd:', error);
  });
}

function getDaysForPlan(planId) {
  const userToken = localStorage.getItem('token');

  return fetch(`http://localhost:8080/choose/workout/day/show/${planId}`, {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + userToken,
      }
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Nie udało się pobrać przypisanych dni.');
      }
  })
  .then(data => {
  
    return data.map(day => day.dayOfWeek);
})
  .catch(error => {
      console.error('Błąd:', error);
      return [];
  });
}