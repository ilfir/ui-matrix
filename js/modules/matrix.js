const Matrix = (function() {
    'use strict';

    var MATRIX_SIZE = 5;
    var INPUTS_SELECTOR = '#letter-matrix input[type="text"]';
    var RUSSIAN_LETTERS = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';

    var inputs = [];
    var excludes = [];

    function init() {
        inputs = Array.from(document.querySelectorAll(INPUTS_SELECTOR));
        
        inputs.forEach(function(input, index) {
            input.setAttribute('minlength', '1');
            input.setAttribute('maxlength', '1');

            input.addEventListener('input', function() {
                input.value = input.value.toLowerCase();
                if (input.value.length === 1) {
                    var nextInput = inputs[index + 1];
                    if (nextInput) {
                        nextInput.focus();
                      }
                     // Save matrix state on every change
                      saveMatrixState();
                    }
                 });

            input.addEventListener('keydown', function(event) {
                if (event.key === 'Backspace' || event.key === 'Delete') {
                    input.value = '';
                    var prevInputIndex = index - 1;
                    if (prevInputIndex >= 0) {
                        inputs[prevInputIndex].focus();
                      }
                     // Save matrix state after clearing
                      saveMatrixState();
                    event.preventDefault();
                  }
               });
             });

        loadMatrixState();
      }

    function getValues() {
        return inputs.map(function(input) {
            return input.value;
          });
       }

    function clear() {
        inputs.forEach(function(input) {
            input.value = '';
            input.style.backgroundColor = '';
          });
        if (inputs.length > 0) {
            inputs[0].focus();
           }
        Storage.clearMatrixValues();
      }

    function populateRandom() {
        var matrix = [];
        for (var i = 0; i < MATRIX_SIZE; i++) {
            var row = [];
            for (var j = 0; j < MATRIX_SIZE; j++) {
                var randomIndex = Math.floor(Math.random() * RUSSIAN_LETTERS.length);
                row.push(RUSSIAN_LETTERS[randomIndex]);
               }
            matrix.push(row);
           }

        inputs.forEach(function(input, index) {
            var row = Math.floor(index / MATRIX_SIZE);
            var col = index % MATRIX_SIZE;
            input.value = matrix[row][col];
           });
         saveMatrixState();
       }

    function randomize() {
        var letters = inputs.map(function(input) {
            return input.value;
          }).filter(function(letter) {
            return letter !== '';
           });

        for (var i = letters.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
             var temp = letters[i];
            letters[i] = letters[j];
            letters[j] = temp;
           }

        inputs.forEach(function(input, index) {
            input.value = letters[index] || '';
           });
         saveMatrixState();
       }

    function getMatrixArray() {
        var matrix = [];
        var rows = document.querySelectorAll('#letter-matrix tr');
        rows.forEach(function(row) {
            var rowData = [];
            row.querySelectorAll('input').forEach(function(input) {
                rowData.push(input.value);
               });
            matrix.push(rowData);
           });
        return matrix;
       }

    function saveMatrixState() {
        var values = getValues();
        Storage.setMatrixValues(values);
      }

    function loadMatrixState() {
        var values = Storage.getMatrixValues();
        if (values && values.length > 0) {
            inputs.forEach(function(input, index) {
                if (values[index]) {
                    input.value = values[index];
                   }
                 });
             }
       }

    function getExcludes() {
        return excludes;
      }

    function clearExcludes() {
        excludes = [];
        return excludes;
      }

    function addExclude(word) {
        if (excludes.indexOf(word) === -1) {
            excludes.push(word);
           }
        return excludes;
      }

    function removeExclude(word) {
        excludes = excludes.filter(function(item) {
            return item !== word;
          });
        return excludes;
      }

    function isExcluded(word) {
        return excludes.indexOf(word) !== -1;
      }

    function getInputs() {
        return inputs;
      }

    return {
        init: init,
        getValues: getValues,
        clear: clear,
        populateRandom: populateRandom,
        randomize: randomize,
        getMatrixArray: getMatrixArray,
        getExcludes: getExcludes,
        clearExcludes: clearExcludes,
        addExclude: addExclude,
        removeExclude: removeExclude,
        isExcluded: isExcluded,
        getInputs: getInputs
       };
})();
