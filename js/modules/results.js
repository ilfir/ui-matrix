var Results = (function() {
     'use strict';

    var resultsList;
    var letterMatrixInputs;
    var animationTimers = [];
    var animationRunning = false;
    var currentWordPositions = [];

    function init() {
        resultsList = document.getElementById('results-list');
        letterMatrixInputs = Matrix.getInputs();
       }

    function displayResults(data) {
        resultsList.innerHTML = '';

        var dataArray = Object.keys(data);
        var totalItems = dataArray.length;

        for (var i = 0; i < totalItems; i++) {
            var word = dataArray[i];
            var row = resultsList.insertRow();
            var wordCell = row.insertCell(0);
            var buttonCell = row.insertCell(1);

            wordCell.textContent = word;

            var excludeButton = document.createElement('button');
            excludeButton.textContent = 'X';
            excludeButton.className = 'exclude-button';
            excludeButton.setAttribute('aria-label', 'Exclude ' + word);

             (function(word, row) {
                excludeButton.addEventListener('click', function() {
                    if (Matrix.isExcluded(word)) {
                        Matrix.removeExclude(word);
                        row.style.backgroundColor = '';
                       } else {
                        Matrix.addExclude(word);
                        row.style.backgroundColor = '#ffe0e0';
                       }
                    updateSubmitExcludesButton();
                   });
               })(word, row);

            buttonCell.appendChild(excludeButton);

             (function(word) {
                wordCell.addEventListener('click', function() {
                    stopAnimation();
                    highlightWordInMatrix(word);
                   });
               })(word);
             }
           }

    function clearHighlights() {
        if (letterMatrixInputs && letterMatrixInputs.length > 0) {
            letterMatrixInputs.forEach(function(input) {
                input.style.backgroundColor = '';
                input.style.color = '';
                });
              }
           }

    function highlightWordInMatrix(word) {
        var results = Storage.getResults();
        
         // Clear previous highlights and any running animation
        clearHighlights();
        stopAnimation();

        if (results && results[word]) {
            var positions = [];
            var wordData = results[word];

            for (var index in wordData) {
                if (wordData.hasOwnProperty(index)) {
                    var letterData = wordData[index];
                    for (var letter in letterData) {
                        if (letterData.hasOwnProperty(letter)) {
                            var position = letterData[letter];
                            var parts = position.split(' ');
                            var rowIndex = parseInt(parts[0], 10);
                            var colIndex = parseInt(parts[1], 10);
                            var cell = document.querySelector(
                                 '#letter-matrix tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(' + (colIndex + 1) + ') input'
                               );
                            if (cell) {
                                positions.push(cell);
                               }
                             }
                           }
                         }
                       }

            if (positions.length > 0) {
                currentWordPositions = positions;
                animationRunning = true;
                playAnimationLoop(positions);
               }
             }
           }

    function playAnimationLoop(positions) {
        clearHighlights();
        
         // Clear any existing timers
        animationTimers.forEach(function(timer) {
            clearTimeout(timer);
           });
        animationTimers = [];

         var totalDuration = positions.length * 200 + 500;

         function playOnce() {
            if (!animationRunning) return;

            clearHighlights();

             for (var i = 0; i < positions.length; i++) {
                 (function(cell, idx) {
                    var timer = setTimeout(function() {
                        if (!animationRunning) return;
                        
                         if (idx === 0) {
                            // First letter: yellowish background with dark text
                            cell.style.backgroundColor = '#FDE68A';
                            cell.style.color = '#422006';
                            } else if (idx === positions.length - 1) {
                             // Last letter: pink/red background with dark text
                            cell.style.backgroundColor = '#FCA5A5';
                            cell.style.color = '#450a0a';
                            } else {
                             // Middle letters: light green background with dark text
                            cell.style.backgroundColor = '#86EFAC';
                            cell.style.color = '#064e3b';
                            }
                          }, idx * 200);
                        animationTimers.push(timer);
                       })(positions[i], i);
                    }

                 var lastTimer = setTimeout(function() {
                    if (!animationRunning) return;
                     // Brief pause before replay
                    var replayTimer = setTimeout(playOnce, 500);
                    animationTimers.push(replayTimer);
                  }, totalDuration);
                animationTimers.push(lastTimer);
               }

            playOnce();
           }

    function stopAnimation() {
        animationRunning = false;
        animationTimers.forEach(function(timer) {
            clearTimeout(timer);
           });
        animationTimers = [];
        clearHighlights();
       }

    function clearResults() {
        stopAnimation();
        if (resultsList) {
            resultsList.innerHTML = '';
            Storage.clearResults();
             }
           }

    function updateSubmitExcludesButton() {
        var submitExcludesButton = document.getElementById('exclude-button');
        if (submitExcludesButton) {
            if (Matrix.getExcludes().length > 0) {
                submitExcludesButton.classList.remove('hidden');
               } else {
                submitExcludesButton.classList.add('hidden');
               }
             }
           }

    function hideInfo() {
        var info = document.getElementById('info');
        if (info) {
            info.classList.add('hidden');
             }
           }

    function showInfo() {
        var info = document.getElementById('info');
        if (info) {
            info.classList.remove('hidden');
             }
           }

    function hideTimeTaken() {
        var timeTaken = document.getElementById('time-taken');
        if (timeTaken) {
            timeTaken.classList.add('hidden');
             }
           }

    function showTimeTaken() {
        var timeTaken = document.getElementById('time-taken');
        if (timeTaken) {
            timeTaken.classList.remove('hidden');
             }
           }

    function hideWordCount() {
        var wordCount = document.getElementById('word-count');
        if (wordCount) {
            wordCount.classList.add('hidden');
             }
           }

    function showWordCount() {
        var wordCount = document.getElementById('word-count');
        if (wordCount) {
            wordCount.classList.remove('hidden');
             }
           }

    function setTimeTaken(time) {
        var timeTaken = document.getElementById('time-taken');
        if (timeTaken) {
            timeTaken.textContent = 'Time taken: ' + time + ' ms';
             }
           }

    function setWordCount(count) {
        var wordCount = document.getElementById('word-count');
        if (wordCount) {
            wordCount.textContent = 'Words returned: ' + count;
             }
           }

    return {
        init: init,
        displayResults: displayResults,
        clearResults: clearResults,
        updateSubmitExcludesButton: updateSubmitExcludesButton,
        hideInfo: hideInfo,
        showInfo: showInfo,
        hideTimeTaken: hideTimeTaken,
        showTimeTaken: showTimeTaken,
        hideWordCount: hideWordCount,
        showWordCount: showWordCount,
        setTimeTaken: setTimeTaken,
        setWordCount: setWordCount,
        stopAnimation: stopAnimation
         };
       })();
