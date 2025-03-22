document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="text"]');
    const minLength = localStorage.getItem('minLength') || 1;
    const maxLength = 1; // Set maxLength to 1 to allow only one letter
    const settingsSaved = localStorage.getItem('settingsSaved') === 'true';

    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = !settingsSaved;
    if (!settingsSaved) {
        submitButton.classList.add('disabled-button');
    } else {
        submitButton.classList.remove('disabled-button');
    }

    inputs.forEach((input, index) => {
        input.setAttribute('minlength', minLength);
        input.setAttribute('maxlength', maxLength);

        input.addEventListener('input', function() {
            if (this.value.length === this.maxLength) {
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();   
                }
            }
        });
    });

    const letterMatrixInputs = document.querySelectorAll('#letter-matrix input[type="text"]');
    
    letterMatrixInputs.forEach(input => {
        input.setAttribute('maxlength', 1); // Ensure only one letter is allowed
        input.addEventListener('input', () => {
            input.style.backgroundColor = 'pink';
            if (input.value.length > 1) {
                input.value = input.value.charAt(0); // Keep only the first character
            }
        });
    });

    document.getElementById('clear-button').addEventListener('click', () => {
        letterMatrixInputs.forEach(input => {
            input.value = '';
            input.style.backgroundColor = '';
        });
        if (letterMatrixInputs.length > 0) {
            letterMatrixInputs[0].focus();
        }
    });

    document.getElementById('submit-button').addEventListener('click', () => {
        const matrixValues = Array.from(letterMatrixInputs).map(input => input.value);
        console.log('Matrix Submitted:', matrixValues);
        // Add your submission logic here

         // Collect data from the matrix
        const matrix = [];
        const rows = document.querySelectorAll('#letter-matrix tr');
        rows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('input').forEach(input => {
                rowData.push(input.value);
            });
            matrix.push(rowData);
        });

        // Prepare the data to be sent
        const data = {
            "maxLength": localStorage.getItem('maxLength'),
            "maxWords": localStorage.getItem('maxWords'),
            "minLength": localStorage.getItem('minLength'),
            "lettersMatrix": matrix
        };

        // Make the HTTP request
        const endpoint = localStorage.getItem('serviceEndpoint');
        if (!endpoint) {
            console.error('Error: Service endpoint is not set.');
            alert('Service endpoint is not set. Please configure it in the settings.');
            return;
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);            
            displayResults(data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`Failed to submit matrix. Error: ${error.message}`);
        });


    });

    document.getElementById('settings-button').addEventListener('click', () => {
        window.location.href = 'settings.html';
    });


    function displayResults(data) {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = ''; // Clear previous results

        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            resultsList.appendChild(listItem);
        });
    }
});