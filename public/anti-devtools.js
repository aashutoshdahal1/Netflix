// Anti-DevTools Protection
// Detects when browser DevTools/console is opened and blocks network requests

(function() {
  // Skip protection in local development
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('local');
  
  if (isLocal) {
    console.log('%c🔓 Anti-DevTools: Disabled in local development', 'color: green; font-size: 12px;');
    return;
  }

  let devtoolsOpen = false;
  const threshold = 160;
  
  // Store original fetch and XMLHttpRequest
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // Detection method 1: Check window size difference
  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : heightThreshold ? 'horizontal' : false;
    
    if (orientation || (widthThreshold && heightThreshold)) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        console.clear();
        console.log('%c⚠️ Developer Tools Detected', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cNetwork requests are blocked while DevTools is open.', 'color: orange; font-size: 14px;');
      }
    } else {
      devtoolsOpen = false;
    }
  }

  // Detection method 2: debugger statement timing
  let checkStatus;
  function detectDebugger() {
    const before = new Date();
    debugger;
    const after = new Date();
    if (after - before > 100) {
      devtoolsOpen = true;
    }
  }

  // Detection method 3: toString override
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function() {
      devtoolsOpen = true;
      throw new Error('DevTools detected');
    }
  });

  // Override fetch to block requests when DevTools is open
  window.fetch = function(...args) {
    if (devtoolsOpen) {
      console.warn('🚫 Network request blocked - DevTools detected');
      return Promise.reject(new Error('Network blocked: Close DevTools to continue'));
    }
    return originalFetch.apply(this, args);
  };

  // Override XMLHttpRequest to block requests when DevTools is open
  XMLHttpRequest.prototype.open = function(...args) {
    this._devtoolsCheckUrl = args[1];
    return originalXHROpen.apply(this, args);
  };

  XMLHttpRequest.prototype.send = function(...args) {
    if (devtoolsOpen) {
      console.warn('🚫 XHR request blocked - DevTools detected');
      this.abort();
      const error = new Error('Network blocked: Close DevTools to continue');
      if (this.onerror) this.onerror(error);
      throw error;
    }
    return originalXHRSend.apply(this, args);
  };

  // Continuous detection
  setInterval(detectDevTools, 500);
  
  // Periodic debugger check (less frequent to avoid performance impact)
  setInterval(detectDebugger, 2000);

  // Console warning trap
  setInterval(() => {
    console.log(element);
    console.clear();
  }, 1000);

  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable common DevTools shortcuts
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (view source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    // Cmd+Option+I (Mac)
    if (e.metaKey && e.altKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent text selection
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Clear console periodically
  setInterval(() => {
    console.clear();
  }, 100);

  console.log('%c⚠️ STOP!', 'color: red; font-size: 50px; font-weight: bold;');
  console.log('%cThis is a browser feature intended for developers.', 'font-size: 16px;');
  console.log('%cIf someone told you to copy-paste something here, it is a scam.', 'font-size: 14px; color: red;');
  
})();
