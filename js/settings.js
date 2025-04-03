document.addEventListener('DOMContentLoaded', () => {

    const minLengthInput = document.getElementById('min-length');
    const maxLengthInput = document.getElementById('max-length');
    const maxWordsInput = document.getElementById('max-words');
    const serviceEndpointInput = document.getElementById('service-endpoint');
    const testSettingInput = document.getElementById('test-setting'); // Get the test-setting element
    const updateEndpointInput = document.getElementById('update-endpoint');
    const queryEndpointInput = document.getElementById('query-endpoint');

    // Retrieve values from local storage
    const minLength = localStorage.getItem('minLength');
    const maxLength = localStorage.getItem('maxLength');
    const maxWords = localStorage.getItem('maxWords');
    const savedEndpoint = localStorage.getItem('serviceEndpoint');
    const testSetting = localStorage.getItem('testSetting'); // Retrieve test-setting value
    const updateEndpoint = localStorage.getItem('updateEndpoint');
    const queryEndpoint = localStorage.getItem('queryEndpoint');

    // Set the form fields with the retrieved values
    if (minLength !== null) minLengthInput.value = minLength;
    if (maxLength !== null) maxLengthInput.value = maxLength;
    if (maxWords !== null) maxWordsInput.value = maxWords;
    if (savedEndpoint) serviceEndpointInput.value = savedEndpoint;
    if (testSetting) testSettingInput.value = testSetting; // Set the test-setting value
    if (updateEndpoint) updateEndpointInput.value = updateEndpoint;
    if (queryEndpoint) queryEndpointInput.value = queryEndpoint;

    const settingsForm = document.getElementById('settings-form');

    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const minLength = document.getElementById('min-length').value;
        const maxLength = document.getElementById('max-length').value;
        const maxWords = document.getElementById('max-words').value;
        const endPoint = document.getElementById('service-endpoint').value;
        const testSetting = document.getElementById('test-setting').value; // Get the test-setting value
        const updateEndpoint = document.getElementById('update-endpoint').value;
        const queryEndpoint = document.getElementById('query-endpoint').value;

        // Save values to local storage
        localStorage.setItem('minLength', minLength);
        localStorage.setItem('maxLength', maxLength);
        localStorage.setItem('maxWords', maxWords);
        localStorage.setItem('settingsSaved', 'true');
        localStorage.setItem('serviceEndpoint', endPoint);
        localStorage.setItem('testSetting', testSetting); // Save the test-setting value
        localStorage.setItem('updateEndpoint', updateEndpoint);
        localStorage.setItem('queryEndpoint', queryEndpoint);

        window.location.href = 'index.html';
    });

    // Add functionality to the back button
    document.getElementById('back-button').addEventListener('click', () => {
        history.back(); // Navigate back one page
    });

    const sendButton = document.getElementById('send-dictionary-value');
    const includeExcludeSelect = document.getElementById('include-exclude');
    const dictionaryValueInput = document.getElementById('dictionary-value');

    const queryButton = document.getElementById('send-query');
    const queryIncludeExcludeSelect = document.getElementById('query-include-exclude');
    const queryResultsTableBody = document.getElementById('query-results-table').querySelector('tbody');

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

    sendButton.addEventListener('click', () => {
        const includeExclude = includeExcludeSelect.value;
        const dictionaryValue = dictionaryValueInput.value;
        const serviceEndpoint = serviceEndpointInput.value;

        if (!updateEndpoint) {
            showNotification('Please provide an update endpoint.', 'error');
            return;
        }

        if (!dictionaryValue) {
            showNotification('Please enter a value.', 'error');
            return;
        }

        fetch(updateEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                include: includeExclude === 'include',
                words: [dictionaryValue],
            }),
        })
        .then(response => {
            if (response.ok) {
                showNotification('Value sent successfully.', 'success');
            } else {
                showNotification('Failed to send value.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred while sending the value.', 'error');
        });
    });

    queryButton.addEventListener('click', () => {
        const include = queryIncludeExcludeSelect.value; // Get the dropdown value
        const queryEndpoint = queryEndpointInput.value;

        if (!queryEndpoint) {
            showNotification('Please provide a query endpoint.', 'error');
            return;
        }

        fetch(`${queryEndpoint}?include=${include === 'include' ? 'true' : 'false'}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            // Clear existing table rows
            queryResultsTableBody.innerHTML = '';

            // Populate table with query results
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item}</td>
                `;
                queryResultsTableBody.appendChild(row);
            });
            showNotification('Query completed successfully.', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred while querying the dictionary.', 'error');
        });
        document.getElementById('query-results-table').style.display = 'table';
    });
});