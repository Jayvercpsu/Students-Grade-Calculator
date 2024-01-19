function calculateAverage() {
    // Get all input values
    var inputElements = document.querySelectorAll('.subject input');
    var numericValues = Array.from(inputElements).map(function (input) {
      return input.value.trim();
    });
  
    // Check if any entered value is non-numeric
    if (numericValues.some(function (value) {
      return !isNumeric(value) && value !== "";
    })) {
      document.getElementById("errorMessage").innerText = "Error: Enter valid numbers in all fields.";
      return;
    }
  
    // Filter out non-numeric values and convert to floats
    var numericValues = numericValues.filter(isNumeric).map(parseFloat);
  
    // Check if at least one numeric value is entered
    if (numericValues.length === 0) {
      document.getElementById("errorMessage").innerText = "Error: Enter at least one valid number.";
      return;
    }
  
    // Calculate average
    var total = numericValues.reduce(function (sum, value) {
      return sum + value;
    }, 0);
  
    var numberOfSubjects = numericValues.length;
  
    // Calculate average
    var average = total / numberOfSubjects;
  
    // Display average grade
    document.getElementById("averageGrade").innerText = average.toFixed(1);
  
    // Clear error message
    document.getElementById("errorMessage").innerText = "";
  }
  
  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  function validateInput(event, inputId) {
    // Validate and apply red border if non-numeric value
    var inputElement = document.getElementById(inputId);
    var inputValue = inputElement.value.trim();
  
    if (!isNumeric(inputValue) && inputValue !== "") {
      inputElement.classList.add("invalid");
    } else {
      inputElement.classList.remove("invalid");
    }
  }
  
  function resetForm() {
    // Reset all input fields, average grade, and error message
    var inputFields = document.querySelectorAll("input");
    inputFields.forEach(function (input) {
      input.value = "";
      input.classList.remove("invalid");
    });
  
    document.getElementById("averageGrade").innerText = "0";
    document.getElementById("errorMessage").innerText = "";
  }
  
  function nextInput(event, nextInputId) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(nextInputId).focus();
    }
  }
  
  // Edit subjects functionality
  var subjects = ['English', 'Math', 'Science', 'Filipino', 'MAPEH'];
  var currentSubjectIndex = 0;
  
  // Function to change the current subject index
  function changeSubject() {
    currentSubjectIndex = (currentSubjectIndex + 1) % subjects.length;
    updateSubjectLabels(); // Update the labels with the new subjects
  }
  
  // Function to update subject labels based on the current subjects
  function updateSubjectLabels() {
    // Select all labels with the class 'editable' within the '.subject' container
    var labels = document.querySelectorAll('.subject label.editable');
  
    // Iterate over the labels and update their text content and input placeholders
    labels.forEach(function (label, index) {
      var subjectKey = 'subject_' + (currentSubjectIndex + index) % subjects.length;
  
      // Retrieve subject name from local storage, defaulting to the original if not found
      //save task
      var subjectName = localStorage.getItem(subjectKey) || subjects[(currentSubjectIndex + index) % subjects.length];
  
      label.innerHTML = subjectName + ' <span style="font-size: 10px;">edit-sub</span> ✏️'; // Update text content
      label.onclick = function () {
        editSubject((currentSubjectIndex + index) % subjects.length);
      };
    });
  
    // Update input placeholders based on the current subjects
    var inputFields = document.querySelectorAll('.subject input');
    inputFields.forEach(function (input, index) {
      input.placeholder = subjects[(currentSubjectIndex + index) % subjects.length];
    });
  }
  
  // Function to edit the current subject
  function editSubject(subjectIndex) {
    // Prompt user to enter a new subject
    var newSubject = prompt("Change new subject:");
  
    // Update the subject if a new one is provided
    if (newSubject !== null) {
      var subjectKey = 'subject_' + subjectIndex;
      subjects[subjectIndex] = newSubject;
      localStorage.setItem(subjectKey, newSubject);
      updateSubjectLabels(); // Update the labels with the new subjects
    }
  }
  
  // Call the function to set initial subject labels
  updateSubjectLabels();
  
  // Function to add a new subject
  function addNewSubject() {
    var newSubject = prompt("Enter new subject:");
  
    if (newSubject !== null) {
      subjects.push(newSubject);
      updateSubjectLabels(); // Update the labels with the new subjects
  
      // Create a new label, input, and delete button for the new subject
      var subjectContainer = document.querySelector('.subject');
      var newLabel = document.createElement('label');
      newLabel.setAttribute('for', newSubject.toLowerCase());
      newLabel.classList.add('editable');
      newLabel.innerHTML = newSubject + ' <span style="font-size: 10px;">edit-sub</span> ✏️';
      newLabel.onclick = function () {
        editSubject(subjects.length - 1);
      };
  
      var newInput = document.createElement('input');
      newInput.setAttribute('type', 'text');
      newInput.setAttribute('id', newSubject.toLowerCase());
      newInput.setAttribute('placeholder', 'Enter grade');
      newInput.setAttribute('onkeydown', 'nextInput(event, \'' + newSubject.toLowerCase() + '\')');
      newInput.setAttribute('oninput', 'validateInput(event, \'' + newSubject.toLowerCase() + '\')');
  
      var newDeleteButton = document.createElement('button');
      newDeleteButton.setAttribute('onclick', 'deleteSubject(' + (subjects.length - 1) + ')');
      newDeleteButton.setAttribute('class', 'delete-button');
      newDeleteButton.innerHTML = '&#128465;';
  
      subjectContainer.appendChild(newLabel);
      subjectContainer.appendChild(newInput);
      subjectContainer.appendChild(newDeleteButton);
    }
  }
  
  //delete subject
  function deleteSubject(subjectIndex) {
    var confirmation = confirm("Are you sure you want to delete this subject?");
    if (confirmation) {
      // Remove the subject from the subjects array
      var deletedSubject = subjects.splice(subjectIndex, 1)[0];
  
      // Update subject labels
      updateSubjectLabels();
  
      // Remove all existing labels, inputs, and delete buttons
      var subjectContainer = document.getElementById('subjectContainer');
      subjectContainer.innerHTML = '';
  
      // Recreate label, input, and delete button elements for the remaining subjects
      for (var i = 0; i < subjects.length; i++) {
        var newLabel = document.createElement('label');
        newLabel.setAttribute('for', subjects[i].toLowerCase());
        newLabel.classList.add('editable');
        newLabel.innerHTML = subjects[i] + ' <span style="font-size: 10px;">edit-sub</span> ✏️';
        newLabel.onclick = (function (index) {
          return function () {
            editSubject(index);
          };
        })(i);
  
        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('id', subjects[i].toLowerCase());
        newInput.setAttribute('placeholder', 'Enter grade');
        newInput.setAttribute('onkeydown', 'nextInput(event, \'' + subjects[i].toLowerCase() + '\')');
        newInput.setAttribute('oninput', 'validateInput(event, \'' + subjects[i].toLowerCase() + '\')');
  
        var newDeleteButton = document.createElement('button');
        newDeleteButton.setAttribute('onclick', 'deleteSubject(' + i + ')');
        newDeleteButton.setAttribute('class', 'delete-button');
        newDeleteButton.innerHTML = '&#128465;';
  
        subjectContainer.appendChild(newLabel);
        subjectContainer.appendChild(newInput);
        subjectContainer.appendChild(newDeleteButton);
      }
      // Clear the input field of the deleted subject
      document.getElementById(deletedSubject.toLowerCase()).value = "";
    }
  }
  