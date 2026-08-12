/**
 * DevTools & Console Protection Module
 * Restricts DevTools shortcuts, right-click context menu, and silences console output.
 */

export const initializeSecurityProtections = () => {
  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Cmd+Opt+I/J/C)
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I (Inspector), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Picker)
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && ['U', 'u'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // macOS Cmd+Option+I / Cmd+Option+J / Cmd+Option+C / Cmd+U
    if (e.metaKey && e.altKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (e.metaKey && ['U', 'u'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // 3. Console Log Silencer & Security Warning
  const noop = () => {};
  if (import.meta.env.PROD || true) {
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.warn = noop;
  }
};
