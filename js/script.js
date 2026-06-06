document.addEventListener('DOMContentLoaded', function() {

     // Initialize modules
    Matrix.init();
    Results.init();

     // Show or hide test buttons based on settings
    var testSetting = Storage.get('testSetting') === 'true';
    var testButtonDiv = document.getElementById('test-buttons');
    if (testSetting) {
        testButtonDiv.classList.remove('hidden');
         } else {
            testButtonDiv.classList.add('hidden');
             }

         // Disable submit button if settings not saved
    var settingsSaved = Storage.get('settingsSaved') === 'true';
    var submitButton = document.getElementById('submit-button');
    submitButton.disabled = !settingsSaved;
    if (!settingsSaved) {
        submitButton.classList.add('disabled-button');
         } else {
            submitButton.classList.remove('disabled-button');
             }

             // Submit button click handler
            submitButton.addEventListener('click', function() {
                var matrixValues = Matrix.getValues();
                 var matrixArray = Matrix.getMatrixArray();

                    // Clear previous results
                Results.clearResults();
                Results.hideInfo();
                 Matrix.getInputs().forEach(function(input) {
                    input.style.backgroundColor = '';
                     });

                    // Make API call
                var startTime = Date.now();
                 Api.searchWords(matrixArray)
                .then(function(data) {
                    var endTime = Date.now();
                    var timeTaken = endTime - startTime;
                    var wordCount = Object.keys(data).length;

                        Results.displayResults(data);
                    Storage.setResults(data);

                        Results.setTimeTaken(timeTaken);
                    Results.setWordCount(wordCount);
                    Results.showInfo();
                    Results.showTimeTaken();
                    Results.showWordCount();

                    Utils.showNotification('Matrix submitted successfully!', 'success');
                     })
                .catch(function(error) {
                    Utils.showNotification('Error: ' + error.message, 'error');
                    Results.hideTimeTaken();
                    Results.hideWordCount();
                    Utils.playBeep();
                     });
                 });

             // Settings button click handler
            document.getElementById('settings-button').addEventListener('click', function() {
                window.location.href = 'settings.html';
                 });

             // Clear button click handler
            document.getElementById('clear-button').addEventListener('click', function() {
                Matrix.clear();
                Results.clearResults();
                Results.hideInfo();
                 Matrix.clearExcludes();
                Results.updateSubmitExcludesButton();
                 });

             // Populate matrix button click handler
            document.getElementById('populate-matrix-button').addEventListener('click', function() {
                Matrix.populateRandom();
                 });

             // Randomize matrix button click handler
            document.getElementById('randomize-matrix-button').addEventListener('click', function() {
                Matrix.randomize();
                 });

             // Submit excludes button click handler
            document.getElementById('exclude-button').addEventListener('click', function() {
                var excludes = Matrix.getExcludes();
                 Api.submitExcludes(excludes)
                .then(function(responseData) {
                    Utils.showNotification('Excludes submitted successfully!', 'success');
                     })
                .catch(function(error) {
                    Utils.showNotification('Error submitting excludes: ' + error.message, 'error');
                     });
                 });

             // Clear excludes on relevant button clicks
            ['clear-button', 'submit-button', 'settings-button', 'populate-matrix-button', 'randomize-matrix-button'].forEach(function(buttonId) {
                var button = document.getElementById(buttonId);
                if (button) {
                    button.addEventListener('click', function() {
                        Matrix.clearExcludes();
                        Results.updateSubmitExcludesButton();
                         });
                     }
                  });
               });
