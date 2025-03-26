document.addEventListener('DOMContentLoaded', () => {

    const minLengthInput = document.getElementById('min-length');
    const maxLengthInput = document.getElementById('max-length');
    const maxWordsInput = document.getElementById('max-words');
    const serviceEndpointInput = document.getElementById('service-endpoint');
    const testSettingInput = document.getElementById('test-setting'); // Get the test-setting element

    // Retrieve values from local storage
    const minLength = localStorage.getItem('minLength');
    const maxLength = localStorage.getItem('maxLength');
    const maxWords = localStorage.getItem('maxWords');
    const savedEndpoint = localStorage.getItem('serviceEndpoint');
    const testSetting = localStorage.getItem('testSetting'); // Retrieve test-setting value

    // Set the form fields with the retrieved values
    if (minLength !== null) minLengthInput.value = minLength;
    if (maxLength !== null) maxLengthInput.value = maxLength;
    if (maxWords !== null) maxWordsInput.value = maxWords;
    if (savedEndpoint) serviceEndpointInput.value = savedEndpoint;
    if (testSetting) testSettingInput.value = testSetting; // Set the test-setting value

    const settingsForm = document.getElementById('settings-form');

    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const minLength = document.getElementById('min-length').value;
        const maxLength = document.getElementById('max-length').value;
        const maxWords = document.getElementById('max-words').value;
        const endPoint = document.getElementById('service-endpoint').value;
        const testSetting = document.getElementById('test-setting').value; // Get the test-setting value

        // Save values to local storage
        localStorage.setItem('minLength', minLength);
        localStorage.setItem('maxLength', maxLength);
        localStorage.setItem('maxWords', maxWords);
        localStorage.setItem('settingsSaved', 'true');
        localStorage.setItem('serviceEndpoint', endPoint);
        localStorage.setItem('testSetting', testSetting); // Save the test-setting value

        window.location.href = 'index.html';
    });

    // Add functionality to the back button
    document.getElementById('back-button').addEventListener('click', () => {
        history.back(); // Navigate back one page
    });
});