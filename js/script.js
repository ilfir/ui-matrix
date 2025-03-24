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

        // Clear the results table
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';

        localStorage.setItem('results','');
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
            localStorage.setItem('results', JSON.stringify(data));
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
    
        const dataArray = Object.keys(data);
        const totalItems = dataArray.length;
        const itemsPerColumn = Math.ceil(totalItems / 3);
    
        for (let i = 0; i < itemsPerColumn; i++) {
            const row = resultsList.insertRow();
    
            for (let j = 0; j < 3; j++) {
                const cell = row.insertCell(j);
                const dataIndex = i + j * itemsPerColumn;
    
                if (dataIndex < totalItems) {
                    const word = dataArray[dataIndex];
                    cell.textContent = word;
    
                    // Add click event listener to call a function with the cell item
                    cell.addEventListener('click', () => {
                        handleListItemClick(cell);
                    });
                }
            }
        }
    }

    function handleListItemClick(listItem) {
        console.log('List item clicked:', listItem.textContent);

        // Highlight the clicked LI item with light green background
        const listItems = document.querySelectorAll('#results-list li');
        listItems.forEach(item => {
            item.style.backgroundColor = ''; // Reset background color of all items
        });
        listItem.style.backgroundColor = 'lightgreen'; // Highlight the clicked item

        // Reset all cells to their previous color
        letterMatrixInputs.forEach(input => {
            input.style.backgroundColor = ''; // Reset background color of all cells
        });

        // Pull JSON data from local storage
        const results = JSON.parse(localStorage.getItem('results'));
        const word = listItem.textContent;

        if (results && results[word]) {
            // Highlight the corresponding cells
            let delay = 0;
            for (const index in results[word]) {
                if (results[word].hasOwnProperty(index)) {
                    const letterData = results[word][index];
                    // alert(JSON.stringify(letterData));
                    for (const letter in letterData) {
                        if (letterData.hasOwnProperty(letter)) {
                            const position = letterData[letter];
                            const [rowIndex, colIndex] = position.split(' ').map(Number);
                            const cell = document.querySelector(`#letter-matrix tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1}) input`);
                            setTimeout(() => {
                                cell.style.backgroundColor = 'lightgreen';
                            }, delay);
                            delay += 200; // Increase delay for the next cell
                        }
                    }
                }
            }
        }
    }

    function addResult(column1, column2, column3) {
        const table = document.getElementById('results-list');
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.textContent = column1;
        cell2.textContent = column2;
        cell3.textContent = column3;
    }
});