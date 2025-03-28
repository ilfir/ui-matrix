document.addEventListener('DOMContentLoaded', function() {

    // Show or hide the div with the test button based on testSetting
    const testSetting = localStorage.getItem('testSetting') === 'true'; 
    const testButtonDiv = document.getElementById('test-buttons');
    if (testSetting) {
        testButtonDiv.classList.remove('hidden'); // Show the div
    } else {
        testButtonDiv.classList.add('hidden'); // Hide the div
    }

    const inputs = document.querySelectorAll('input[type="text"]');
    const settingsSaved = localStorage.getItem('settingsSaved') === 'true';

    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = !settingsSaved;
    if (!settingsSaved) {
        submitButton.classList.add('disabled-button');
    } else {
        submitButton.classList.remove('disabled-button');
    }

    inputs.forEach((input, index) => {
        input.setAttribute('minlength', 1);
        input.setAttribute('maxlength', 1);

        input.addEventListener('input', function() {
            input.value = input.value.toLowerCase();
            if (this.value.length === 1) {
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();   
                }
            }
        });

        input.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                input.value = '';
                const prevInput = inputs[index + 1];
                if (prevInput) {
                    prevInput.focus();
                }
                event.preventDefault(); // Prevent default behavior of backspace/delete
            }
        });
    });

    const letterMatrixInputs = document.querySelectorAll('#letter-matrix input[type="text"]');
    
    letterMatrixInputs.forEach(input => {
        input.setAttribute('maxlength', 1); // Ensure only one letter is allowed
        input.addEventListener('input', () => {
            if (input.value.length > 1) {
                input.value = input.value.charAt(0); // Keep only the first character
            }
        });
    });

    if (letterMatrixInputs.length > 0) {
        letterMatrixInputs[0].focus();
    }

    document.getElementById('clear-button').addEventListener('click', () => {
        letterMatrixInputs.forEach(input => {
            input.value = '';
            input.style.backgroundColor = '';
        });
        if (letterMatrixInputs.length > 0) {
            letterMatrixInputs[0].focus();
        }

        // Clear and hide stuff
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        localStorage.setItem('results','');
        document.getElementById('info').classList.add('hidden'); 
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
            showNotification('Service endpoint is not set. Please configure it in the settings.', 'error');
            return;
        }

        // Clear and hide stuff 
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        localStorage.setItem('results','');
        document.getElementById('info').classList.add('hidden'); 
        letterMatrixInputs.forEach(input => {           
            input.style.backgroundColor = '';
        });

        const startTime = Date.now(); // Start time
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
            const endTime = Date.now(); // End time
            const timeTaken = endTime - startTime; // Calculate time taken
            const wordCount = Object.keys(data).length; // Count the number of words

            console.log('Success:', data);            
            displayResults(data);
            localStorage.setItem('results', JSON.stringify(data));

            // Display time taken and word count in the UI
            document.getElementById('time-taken').textContent = `Time taken: ${timeTaken} ms`;
            document.getElementById('word-count').textContent = `Words returned: ${wordCount}`;
            document.getElementById('info').classList.remove('hidden'); // Show error message
            document.getElementById('error').classList.add('hidden'); // Hide error message            
            document.getElementById('time-taken').classList.remove('hidden'); 
            document.getElementById('word-count').classList.remove('hidden'); 
            playBeep();
            showNotification('Matrix submitted successfully!', 'success');
        })
        .catch((error) => {
            console.error('Error:', error);
            showNotification(`Error: ${error.message}`, 'error');
            document.getElementById('time-taken').classList.add('hidden'); 
            document.getElementById('word-count').classList.add('hidden'); 
            playBeep();
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
        console.log('Total items:', totalItems);

        for (let i = 0; i < totalItems; i++) {
            const row = resultsList.insertRow();
            const cell = row.insertCell(0); // Word cell
            const buttonCell = row.insertCell(1); // Button cell

            const word = dataArray[i];
            cell.textContent = word;

            // Add "X" button to toggle the word in the excludes list
            const excludeButton = document.createElement('button');
            excludeButton.textContent = 'X';
            excludeButton.classList.add('exclude-button'); // Add a class for styling
            excludeButton.addEventListener('click', () => {
                if (excludes.includes(word)) {
                    excludes = excludes.filter(item => item !== word); // Remove word from excludes
                    row.style.backgroundColor = ''; // Reset row background color
                } else {
                    excludes.push(word); // Add word to excludes
                    row.style.backgroundColor = 'red'; // Highlight entire row in red
                }
                updateSubmitExcludesButton();
            });
            buttonCell.appendChild(excludeButton);

            // Add click event listener to call a function with the cell item
            cell.addEventListener('click', () => {
                handleListItemClick(cell);
            });
        }
    }

    document.getElementById('populate-matrix-button').addEventListener('click', () => {
        const russianLetters = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
        const matrixSize = 5;
        const matrix = [];

        for (let i = 0; i < matrixSize; i++) {
            const row = [];
            for (let j = 0; j < matrixSize; j++) {
                const randomIndex = Math.floor(Math.random() * russianLetters.length);
                row.push(russianLetters[randomIndex]);
            }
            matrix.push(row);
        }

        const matrixUi = document.querySelectorAll('#letter-matrix td input');
        matrixUi.forEach((input, index) => {
            const row = Math.floor(index / matrixSize);
            const col = index % matrixSize;
            input.value = matrix[row][col]; // Populate input with matrix data
        });
    });

    // Add functionality to the Random button
    const randomizeButton = document.getElementById('randomize-matrix-button');
    randomizeButton.addEventListener('click', () => {
        const inputs = Array.from(document.querySelectorAll('#letter-matrix input'));
        const letters = inputs.map(input => input.value).filter(letter => letter !== ''); // Collect non-empty letters

        // Shuffle the letters array
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        // Populate the matrix with shuffled letters
        inputs.forEach((input, index) => {
            input.value = letters[index] || ''; // Fill with letters or leave empty
        });
    });

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
            const positions = [];

            for (const index in results[word]) {
                if (results[word].hasOwnProperty(index)) {
                    const letterData = results[word][index];
                    for (const letter in letterData) {
                        if (letterData.hasOwnProperty(letter)) {
                            const position = letterData[letter];
                            const [rowIndex, colIndex] = position.split(' ').map(Number);
                            const cell = document.querySelector(`#letter-matrix tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1}) input`);
                            positions.push(cell);
                        }
                    }
                }
            }

            positions.forEach((cell, idx) => {
                setTimeout(() => {
                    if (idx === 0) {
                        cell.style.backgroundColor = 'green'; // First cell green
                    } else if (idx === positions.length - 1) {
                        cell.style.backgroundColor = 'red'; // Last cell red
                    } else {
                        cell.style.backgroundColor = 'lightgreen'; // In-between cells light green
                    }
                }, delay);
                delay += 200; // Increase delay for the next cell
            });
        }
    }

    function playBeep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 400); // Play sound for 200ms
    }

    let excludes = []; // Array to store excluded words
    const submitExcludesButton = document.getElementById('submit-excludes-button');

    function updateSubmitExcludesButton() {
        if (excludes.length > 0) {
            submitExcludesButton.classList.remove('hidden');
        } else {
            submitExcludesButton.classList.add('hidden');
        }
    }

    // Clear excludes array on specific button presses
    ['clear-button', 'submit-button', 'settings-button', 'populate-matrix-button', 'randomize-matrix-button'].forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', () => {
            excludes = [];
            updateSubmitExcludesButton();
        });
    });

    // Handle Submit Excludes button click
    submitExcludesButton.addEventListener('click', () => {
        const updateEndpoint = localStorage.getItem('updateEndpoint');
        if (!updateEndpoint) {
            console.error('Error: Update endpoint is not set.');
            showNotification('Update endpoint is not set. Please configure it in the settings.', 'error');
            return;
        }

        const data = { 
            words: excludes,
            include: false }; // Prepare the data to be sent
        console.log('Submitting excludes:', excludes);

        fetch(updateEndpoint, {
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
        .then(responseData => {
            console.log('Excludes submitted successfully:', responseData);
            showNotification('Excludes submitted successfully!', 'success');
        })
        .catch(error => {
            console.error('Error submitting excludes:', error);
            showNotification(`Error submitting excludes: ${error.message}`, 'error');
        });
    });

    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.padding = '10px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '5px';
        notification.style.color = '#fff';
        notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545'; // Green for success, red for error
        notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        container.appendChild(notification);

        setTimeout(() => {
            container.removeChild(notification);
        }, 5000); // Remove notification after 5 seconds
    }
});