document.addEventListener('DOMContentLoaded', () => {

    const minLengthInput = document.getElementById('min-length');
    const maxLengthInput = document.getElementById('max-length');
    const maxWordsInput = document.getElementById('max-words');
    const serviceEndpointInput = document.getElementById('service-endpoint');

    // Retrieve values from local storage
    const minLength = localStorage.getItem('minLength');
    const maxLength = localStorage.getItem('maxLength');
    const maxWords = localStorage.getItem('maxWords');
    const savedEndpoint = localStorage.getItem('serviceEndpoint');

    // Set the form fields with the retrieved values
    if (minLength !== null) minLengthInput.value = minLength;
    if (maxLength !== null) maxLengthInput.value = maxLength;
    if (maxWords !== null) maxWordsInput.value = maxWords;
    if (savedEndpoint) serviceEndpointInput.value = savedEndpoint;

    const settingsForm = document.getElementById('settings-form');

    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const minLength = document.getElementById('min-length').value;
        const maxLength = document.getElementById('max-length').value;
        const maxWords = document.getElementById('max-words').value;
        const endPoint = document.getElementById('service-endpoint').value;

        localStorage.setItem('minLength', minLength);
        localStorage.setItem('maxLength', maxLength);
        localStorage.setItem('maxWords', maxWords);
        localStorage.setItem('settingsSaved', 'true');
        localStorage.setItem('serviceEndpoint', endPoint);

        window.location.href = 'index.html';
    });
});