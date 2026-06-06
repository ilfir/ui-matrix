const Storage = (function() {
    'use strict';

    function get(key) {
        return localStorage.getItem(key);
    }

    function set(key, value) {
        localStorage.setItem(key, String(value));
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    function clear() {
        localStorage.clear();
    }

    function getMatrixValues() {
        const stored = localStorage.getItem('matrixValues');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    function setMatrixValues(values) {
        localStorage.setItem('matrixValues', JSON.stringify(values));
    }

    function clearMatrixValues() {
        localStorage.removeItem('matrixValues');
    }

    function getResults() {
        const stored = localStorage.getItem('results');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return {};
            }
        }
        return {};
    }

    function setResults(results) {
        localStorage.setItem('results', JSON.stringify(results));
    }

    function clearResults() {
        localStorage.removeItem('results');
    }

    return {
        get: get,
        set: set,
        remove: remove,
        clear: clear,
        getMatrixValues: getMatrixValues,
        setMatrixValues: setMatrixValues,
        clearMatrixValues: clearMatrixValues,
        getResults: getResults,
        setResults: setResults,
        clearResults: clearResults
    };
})();
