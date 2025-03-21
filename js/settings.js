document.addEventListener('DOMContentLoaded', () => {

    const minLengthInput = document.getElementById('min-length');
    const maxLengthInput = document.getElementById('max-length');
    const maxWordsInput = document.getElementById('max-words');

    // Retrieve values from local storage
    const minLength = localStorage.getItem('minLength');
    const maxLength = localStorage.getItem('maxLength');
    const maxWords = localStorage.getItem('maxWords');

    // Set the form fields with the retrieved values
    if (minLength !== null) minLengthInput.value = minLength;
    if (maxLength !== null) maxLengthInput.value = maxLength;
    if (maxWords !== null) maxWordsInput.value = maxWords;

    const settingsForm = document.getElementById('settings-form');

    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const minLength = document.getElementById('min-length').value;
        const maxLength = document.getElementById('max-length').value;
        const maxWords = document.getElementById('max-words').value;

        localStorage.setItem('minLength', minLength);
        localStorage.setItem('maxLength', maxLength);
        localStorage.setItem('maxWords', maxWords);
        localStorage.setItem('settingsSaved', 'true');

        window.location.href = 'index.html';
    });
});