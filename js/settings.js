document.addEventListener('DOMContentLoaded', function() {

      // Get input elements
    var minLengthInput = document.getElementById('min-length');
    var maxLengthInput = document.getElementById('max-length');
    var maxWordsInput = document.getElementById('max-words');
    var serviceEndpointInput = document.getElementById('service-endpoint');
    var testSettingInput = document.getElementById('test-setting');
    var updateEndpointInput = document.getElementById('update-endpoint');
    var queryEndpointInput = document.getElementById('query-endpoint');
    var lookupEndpointInput = document.getElementById('lookup-endpoint');

      // Load saved values from storage
    if (Storage.get('minLength')) minLengthInput.value = Storage.get('minLength');
    if (Storage.get('maxLength')) maxLengthInput.value = Storage.get('maxLength');
    if (Storage.get('maxWords')) maxWordsInput.value = Storage.get('maxWords');
    if (Storage.get('serviceEndpoint')) serviceEndpointInput.value = Storage.get('serviceEndpoint');
    if (Storage.get('testSetting')) testSettingInput.value = Storage.get('testSetting');
    if (Storage.get('updateEndpoint')) updateEndpointInput.value = Storage.get('updateEndpoint');
    if (Storage.get('queryEndpoint')) queryEndpointInput.value = Storage.get('queryEndpoint');
    if (Storage.get('lookupEndpoint')) lookupEndpointInput.value = Storage.get('lookupEndpoint');

      // Settings form submission
    var settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();

        Storage.set('minLength', document.getElementById('min-length').value);
        Storage.set('maxLength', document.getElementById('max-length').value);
        Storage.set('maxWords', document.getElementById('max-words').value);
        Storage.set('settingsSaved', 'true');
        Storage.set('serviceEndpoint', document.getElementById('service-endpoint').value);
        Storage.set('testSetting', document.getElementById('test-setting').value);
        Storage.set('updateEndpoint', document.getElementById('update-endpoint').value);
        Storage.set('queryEndpoint', document.getElementById('query-endpoint').value);
        Storage.set('lookupEndpoint', document.getElementById('lookup-endpoint').value);

        window.location.href = 'index.html';
          });

      // Back button
    document.getElementById('back-button').addEventListener('click', function() {
        history.back();
          });

      // Send dictionary value button
    document.getElementById('send-dictionary-value').addEventListener('click', function() {
        var includeExclude = document.getElementById('include-exclude').value;
        var dictionaryValue = document.getElementById('dictionary-value').value;

         Api.updateDictionary(dictionaryValue, includeExclude)
         .then(function() {
            Utils.showNotification('Value sent successfully.', 'success');
              })
         .catch(function(error) {
            Utils.showNotification('An error occurred while sending the value.', 'error');
              });
          });

      // Query dictionary button
    document.getElementById('send-query').addEventListener('click', function() {
        var includeExclude = document.getElementById('query-include-exclude').value;
        var queryResultsTableBody = document.getElementById('list-results-table').querySelector('tbody');
        var listTable = document.getElementById('list-results-table');
        var lookupTable = document.getElementById('lookup-results-table');

         listTable.style.display = 'table';
        lookupTable.style.display = 'none';

         Api.queryDictionary(includeExclude)
         .then(function(data) {
                queryResultsTableBody.innerHTML = '';

                data.forEach(function(item) {
                    var row = document.createElement('tr');
                    row.innerHTML = '<td>' + item + '</td>';
                    queryResultsTableBody.appendChild(row);
                      });
                 Utils.showNotification('Query completed successfully.', 'success');
                  })
         .catch(function(error) {
            Utils.showNotification('An error occurred while querying the dictionary.', 'error');
              });
          });

      // Lookup/search button
    document.getElementById('serch-query').addEventListener('click', function() {
        var queryText = document.getElementById('query-text').value;
        var exactMatch = document.getElementById('query-exact').value === 'true';
        var lookupResultsTableBody = document.getElementById('lookup-results-table').querySelector('tbody');
        var listTable = document.getElementById('list-results-table');
        var lookupTable = document.getElementById('lookup-results-table');

         listTable.style.display = 'none';
        lookupTable.style.display = 'table';

         Api.lookupWord(queryText, exactMatch)
         .then(function(data) {
                if (data.length === 1 && data[0].location === 'Error') {
                    Utils.showNotification(data[0].word, 'error');
                    return;
                      }

                    var wordMap = new Map();
                data.forEach(function(item) {
                    if (!wordMap.has(item.word)) {
                        wordMap.set(item.word, new Set());
                          }
                        wordMap.get(item.word).add(item.location);
                      });

                        lookupResultsTableBody.innerHTML = '';
                wordMap.forEach(function(locations, word) {
                        var row = document.createElement('tr');
                    row.innerHTML = 
                         '<td>' + word + '</td>'
                       + '<td>' + (locations.has('Included') ? '✔' : '') + '</td>'
                        + '<td>' + (locations.has('Excluded') ? '✔' : '') + '</td>'
                        + '<td>' + (locations.has('Dictionary') ? '✔' : '') + '</td>'
                        + '<td>' + (locations.has('Merged') ? '✔' : '') + '</td>'
                       ;
                    lookupResultsTableBody.appendChild(row);
                      });

                 Utils.showNotification('Search completed successfully.', 'success');
                  })
         .catch(function(error) {
            Utils.showNotification('An error occurred while performing the lookup.', 'error');
              });
          });
        });
