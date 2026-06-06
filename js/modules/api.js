const Api = (function() {
    'use strict';

    function searchWords(matrixData) {
        var endpoint = Storage.get('serviceEndpoint');
        
        if (!endpoint || !endpoint.trim()) {
            Utils.showNotification('Service endpoint is not set. Please configure it in the settings.', 'error');
            return Promise.reject(new Error('Service endpoint not configured'));
          }

        var data = {
            maxLength: Storage.get('maxLength'),
            maxWords: Storage.get('maxWords'),
            minLength: Storage.get('minLength'),
            lettersMatrix: matrixData
          };

        return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
            body: JSON.stringify(data)
          })
          .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
              }
            return response.json();
          });
      }

    function submitExcludes(excludes) {
        var updateEndpoint = Storage.get('updateEndpoint');
        
        if (!updateEndpoint || !updateEndpoint.trim()) {
            Utils.showNotification('Update endpoint is not set. Please configure it in the settings.', 'error');
            return Promise.reject(new Error('Update endpoint not configured'));
          }

        var data = {
            words: excludes,
            include: false
          };

        return fetch(updateEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
            body: JSON.stringify(data)
          })
          .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
              }
            return response.json();
          });
      }

    function updateDictionary(value, includeExclude) {
        var updateEndpoint = Storage.get('updateEndpoint');
        
        if (!updateEndpoint || !updateEndpoint.trim()) {
            Utils.showNotification('Please provide an update endpoint.', 'error');
            return Promise.reject(new Error('Update endpoint not configured'));
          }

        if (!value || !value.trim()) {
            Utils.showNotification('Please enter a value.', 'error');
            return Promise.reject(new Error('Value is required'));
          }

        return fetch(updateEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                include: includeExclude === 'include',
                words: [value]
              })
          })
          .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
              }
            return response.json();
          });
      }

    function queryDictionary(includeExclude) {
        var queryEndpoint = Storage.get('queryEndpoint');
        
        if (!queryEndpoint || !queryEndpoint.trim()) {
            Utils.showNotification('Please provide a query endpoint.', 'error');
            return Promise.reject(new Error('Query endpoint not configured'));
          }

        return fetch(queryEndpoint + '?include=' + (includeExclude === 'include' ? 'true' : 'false'), {
            method: 'GET'
          })
          .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
              }
            return response.json();
          });
      }

    function lookupWord(queryText, exactMatch) {
        var lookupEndpoint = Storage.get('lookupEndpoint');
        
        if (!lookupEndpoint || !lookupEndpoint.trim()) {
            Utils.showNotification('Please provide a lookup endpoint.', 'error');
            return Promise.reject(new Error('Lookup endpoint not configured'));
          }

        if (!queryText || !queryText.trim()) {
            Utils.showNotification('Please enter a search text.', 'error');
            return Promise.reject(new Error('Query text is required'));
          }

        return fetch(lookupEndpoint + '?word=' + encodeURIComponent(queryText) + '&exactMatch=' + exactMatch, {
            method: 'GET'
          })
          .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
              }
            return response.json();
          });
      }

    return {
        searchWords: searchWords,
        submitExcludes: submitExcludes,
        updateDictionary: updateDictionary,
        queryDictionary: queryDictionary,
        lookupWord: lookupWord
      };
})();
