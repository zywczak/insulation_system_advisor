(function() {
  'use strict';
  var BASE = window.EWI_CALCULATOR_BASE_URL || '';
  var container = document.getElementById('ewi-calculator');
  if (!container) {
    console.warn('[EWI Calculator] #ewi-calculator not found.');
    return;
  }
  var script = document.createElement('script');
  script.type = 'module';
  script.src = BASE + '/assets/embed-entry.js';
  script.onerror = function() {
    container.innerHTML = '<p style="color:red;padding:20px;">Failed to load calculator.</p>';
  };
  document.head.appendChild(script);
})();
