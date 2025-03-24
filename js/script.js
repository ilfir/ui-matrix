document.addEventListener('DOMContentLoaded', function() {
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
            alert('Service endpoint is not set. Please configure it in the settings.');
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
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('error').textContent = `Error: ${error.message}`;
            document.getElementById('info').classList.remove('hidden'); // Show error message
            document.getElementById('error').classList.remove('hidden'); // Show error message
            document.getElementById('error').classList.add('blink'); 
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
});