// Modern Notification System
class Notification {
  constructor(options = {}) {
    this.message = options.message || '';
    this.type = options.type || 'info'; // success, error, warning, info
    this.duration = options.duration || 3000;
    this.position = options.position || 'top-right'; // top-right, top-left, bottom-right, bottom-left
    this.icon = options.icon || this.getDefaultIcon();
    this.sound = options.sound || false;
    this.container = null;
  }

  getDefaultIcon() {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this.type] || '•';
  }

  createNotificationElement() {
    const notification = document.createElement('div');
    notification.className = `notification notification-${this.type} notification-${this.position}`;
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <span class="icon-symbol">${this.icon}</span>
        </div>
        <div class="notification-message">
          <p>${this.message}</p>
        </div>
        <button class="notification-close" aria-label="Close notification">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="notification-progress"></div>
    `;

    return notification;
  }

  getOrCreateContainer() {
    let container = document.querySelector(`.notification-container-${this.position}`);
    
    if (!container) {
      container = document.createElement('div');
      container.className = `notification-container notification-container-${this.position}`;
      document.body.appendChild(container);
    }
    
    return container;
  }

  playSound() {
    if (this.sound) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = {
        success: 800,
        error: 300,
        warning: 600,
        info: 500
      };
      
      const frequency = frequencies[this.type] || 500;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }

  show() {
    this.playSound();
    const container = this.getOrCreateContainer();
    const notification = this.createNotificationElement();
    
    container.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.remove(notification));

    if (this.duration > 0) {
      setTimeout(() => this.remove(notification), this.duration);
    }

    return notification;
  }

  remove(element) {
    element.classList.remove('show');
    
    setTimeout(() => {
      element.remove();
    }, 300);
  }
}

// Helper functions untuk kemudahan penggunaan
function showSuccess(message, options = {}) {
  return new Notification({
    message,
    type: 'success',
    ...options
  }).show();
}

function showError(message, options = {}) {
  return new Notification({
    message,
    type: 'error',
    ...options
  }).show();
}

function showWarning(message, options = {}) {
  return new Notification({
    message,
    type: 'warning',
    ...options
  }).show();
}

function showInfo(message, options = {}) {
  return new Notification({
    message,
    type: 'info',
    ...options
  }).show();
}

// Custom notification dengan opsi lengkap
function showNotification(message, type = 'info', options = {}) {
  return new Notification({
    message,
    type,
    ...options
  }).show();
}
