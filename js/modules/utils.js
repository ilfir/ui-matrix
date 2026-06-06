const Utils = (function() {
    'use strict';

    function showNotification(message, type) {
        type = type || 'info';
        var container = document.getElementById('notification-container');
        if (!container) return;

        var notification = document.createElement('div');
        notification.textContent = message;
        notification.style.padding = '10px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '5px';
        notification.style.color = '#fff';
        notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
        notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        notification.style.transition = 'opacity 0.3s ease';
        container.appendChild(notification);

        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                 }
             }, 300);
         }, 5000);
     }

    function playBeep(duration) {
        duration = duration || 400;
        try {
            var audioContext = new (window.AudioContext || window.webkitAudioContext)();
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);

            oscillator.start();
            setTimeout(function() {
                oscillator.stop();
                audioContext.close();
             }, duration / 2);
         } catch (e) {
            // Audio not available, silently fail
         }
     }

    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                func.apply(context, args);
             }, wait);
         };
     }

    function validateEndpoint(endpoint) {
        return endpoint && endpoint.trim() !== '';
     }

    function validateMatrix(matrix) {
        if (!Array.isArray(matrix)) return false;
        if (matrix.length !== 25) return false;
        return matrix.every(function(val) {
            return typeof val === 'string' && val.length <= 1;
         });
     }

    return {
        showNotification: showNotification,
        playBeep: playBeep,
        debounce: debounce,
        validateEndpoint: validateEndpoint,
        validateMatrix: validateMatrix
     };
})();
