/**
 * Portfolio Website - Core Script
 * Features: High-performance Vanilla JS Typewriter effect for Hero Tagline
 */

class Typewriter {
  /**
   * @param {HTMLElement} element - The target DOM element
   * @param {Array<string>} words - Array of strings to type out
   * @param {number} wait - Wait time before deleting (ms)
   */
  constructor(element, words, wait = 2000) {
    this.element = element;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.isDeleting = false;
    this.timeoutId = null;

    // Inject necessary cursor styling dynamically
    this.injectStyles();
    
    // Start typing loop
    this.type();
  }

  /**
   * Injects keyframe animations for the blinking typewriter cursor
   */
  injectStyles() {
    if (document.getElementById('typewriter-styles')) return;

    const style = document.createElement('style');
    style.id = 'typewriter-styles';
    style.textContent = `
      .typewriter-cursor {
        border-right: 0.08em solid currentColor;
        animation: typewriter-blink 0.75s step-end infinite;
        margin-left: 2px;
      }
      @keyframes typewriter-blink {
        from, to { border-color: transparent }
        50% { border-color: currentColor }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Core typewriter logic loop
   */
  type() {
    const currentWordIndex = this.wordIndex % this.words.length;
    const fullTxt = this.words[currentWordIndex];

    // Determine state and calculate character change
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert text into element with cursor
    this.element.innerHTML = `<span class="typewriter-text">${this.txt}</span><span class="typewriter-cursor" aria-hidden="true"></span>`;

    // Calculate dynamic typing speed
    let typeSpeed = 80 - Math.random() * 40; // Typing speed variation

    if (this.isDeleting) {
      typeSpeed /= 2; // Erase faster than typing
    }

    // Check if word is fully typed
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait; // Pause at end of word
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++; // Move to next word
      typeSpeed = 500;  // Brief pause before typing next word
    }

    this.timeoutId = setTimeout(() => this.type(), typeSpeed);
  }

  /**
   * Safe cleanup method to prevent memory leaks if component unmounts
   */
  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// Initialize when DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  const taglineElement = document.querySelector('.hero-tagline-dynamic');
  
  if (taglineElement) {
    // Read parameters from data attributes, falling back to sensible defaults
    const words = JSON.parse(taglineElement.getAttribute('data-words') || '["Developer", "Designer", "Creator"]');
    const wait = taglineElement.getAttribute('data-wait') || 2500;

    // Instantiate effect
    new Typewriter(taglineElement, words, wait);
  }
});