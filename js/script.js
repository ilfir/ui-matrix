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
    });

    document.getElementById('settings-button').addEventListener('click', () => {
        window.location.href = 'settings.html';
    });
});