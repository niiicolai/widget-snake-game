import type { Controls } from './snakeTypes';

export class SnakeControlsManager {
  private controls: Controls = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  private onDirectionChange: (direction: 'up' | 'down' | 'left' | 'right') => void;
  private onPauseToggle: () => void;
  private onRestart: () => void;

  constructor(
    onDirectionChange: (direction: 'up' | 'down' | 'left' | 'right') => void,
    onPauseToggle: () => void,
    onRestart: () => void
  ) {
    this.onDirectionChange = onDirectionChange;
    this.onPauseToggle = onPauseToggle;
    this.onRestart = onRestart;
    this.setupKeyboardControls();
    this.setupTouchControls();
  }

  private setupKeyboardControls(): void {
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (!this.controls.up) {
            this.controls.up = true;
            this.onDirectionChange('up');
          }
          e.preventDefault();
          break;
        case 'arrowdown':
        case 's':
          if (!this.controls.down) {
            this.controls.down = true;
            this.onDirectionChange('down');
          }
          e.preventDefault();
          break;
        case 'arrowleft':
        case 'a':
          if (!this.controls.left) {
            this.controls.left = true;
            this.onDirectionChange('left');
          }
          e.preventDefault();
          break;
        case 'arrowright':
        case 'd':
          if (!this.controls.right) {
            this.controls.right = true;
            this.onDirectionChange('right');
          }
          e.preventDefault();
          break;
        case ' ':
        case 'p':
          this.onPauseToggle();
          e.preventDefault();
          break;
        case 'r':
        case 'enter':
          this.onRestart();
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          this.controls.up = false;
          break;
        case 'arrowdown':
        case 's':
          this.controls.down = false;
          break;
        case 'arrowleft':
        case 'a':
          this.controls.left = false;
          break;
        case 'arrowright':
        case 'd':
          this.controls.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  private setupTouchControls(): void {
    let touchStartX: number | null = null;
    let touchStartY: number | null = null;

    const handleTouchStart = (e: TouchEvent): void => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent): void => {
      if (!touchStartX || !touchStartY || e.changedTouches.length !== 1) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            this.onDirectionChange('right');
          } else {
            this.onDirectionChange('left');
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            this.onDirectionChange('down');
          } else {
            this.onDirectionChange('up');
          }
        }
      }
      
      touchStartX = null;
      touchStartY = null;
    };

    // Add touch controls
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Also handle mouse controls for desktop
    let mouseDown = false;

    const handleMouseDown = (e: MouseEvent): void => {
      mouseDown = true;
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent): void => {
      if (!mouseDown || !touchStartX || !touchStartY) return;

      const deltaX = e.clientX - touchStartX;
      const deltaY = e.clientY - touchStartY;
      
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          this.onDirectionChange(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          this.onDirectionChange(deltaY > 0 ? 'down' : 'up');
        }
      }
      
      mouseDown = false;
      touchStartX = null;
      touchStartY = null;
    };

    const handleMouseLeave = (): void => {
      mouseDown = false;
      touchStartX = null;
      touchStartY = null;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
  }

  getControls(): Controls {
    return this.controls;
  }

  resetControls(): void {
    this.controls = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }

  cleanup(): void {
  }
}