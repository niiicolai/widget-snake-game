import { SNAKE_CONFIG } from './snakeConstants';
import type { Snake, Food, Position, GameDimensions } from './snakeTypes';

export class SnakeGameLogic {
  private dimensions: GameDimensions;

  constructor(dimensions: GameDimensions) {
    this.dimensions = dimensions;
  }

  // Initialize snake at center position
  createSnake(): Snake {
    const startX = Math.floor(this.dimensions.cols / 2);
    const startY = Math.floor(this.dimensions.rows / 2);
    
    const body: Position[] = [];
    for (let i = 0; i < SNAKE_CONFIG.INITIAL_SNAKE_LENGTH; i++) {
      body.push({
        x: startX - i,
        y: startY,
      });
    }

    return {
      body,
      direction: 'right',
      color: SNAKE_CONFIG.COLORS.SNAKE_HEAD,
    };
  }

  // Generate food at random position not occupied by snake
  generateFood(snakeBody: Position[]): Food {
    const isBonus = Math.random() < SNAKE_CONFIG.BONUS_FOOD_CHANCE;
    
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * this.dimensions.cols),
        y: Math.floor(Math.random() * this.dimensions.rows),
      };
    } while (this.isPositionOccupied(position, snakeBody));

    return {
      position,
      color: isBonus ? SNAKE_CONFIG.COLORS.FOOD_BONUS : SNAKE_CONFIG.COLORS.FOOD_NORMAL,
      type: isBonus ? 'bonus' : 'normal',
      points: isBonus ? SNAKE_CONFIG.BONUS_FOOD_POINTS : SNAKE_CONFIG.POINTS_PER_FOOD,
    };
  }

  // Check if position is occupied by snake body
  private isPositionOccupied(position: Position, snakeBody: Position[]): boolean {
    return snakeBody.some(segment => segment.x === position.x && segment.y === position.y);
  }

  // Move snake based on current direction
  moveSnake(snake: Snake): Snake {
    const head = { ...snake.body[0] };
    
    switch (snake.direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }

    const newBody = [head, ...snake.body];
    return {
      ...snake,
      body: newBody,
    };
  }

  // Remove tail segment (called when snake doesn't eat food)
  removeTail(snake: Snake): Snake {
    return {
      ...snake,
      body: snake.body.slice(0, -1),
    };
  }

  // Check if snake collides with walls
  checkWallCollision(snake: Snake): boolean {
    const head = snake.body[0];
    return (
      head.x < 0 ||
      head.x >= this.dimensions.cols ||
      head.y < 0 ||
      head.y >= this.dimensions.rows
    );
  }

  // Check if snake collides with itself
  checkSelfCollision(snake: Snake): boolean {
    const head = snake.body[0];
    return snake.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  // Check if snake eats food
  checkFoodCollision(snake: Snake, food: Food): boolean {
    const head = snake.body[0];
    return head.x === food.position.x && head.y === food.position.y;
  }

  // Check if new direction is valid (not opposite to current direction)
  isValidDirectionChange(newDirection: 'up' | 'down' | 'left' | 'right', currentDirection: 'up' | 'down' | 'left' | 'right'): boolean {
    if (currentDirection === 'up' && newDirection === 'down') return false;
    if (currentDirection === 'down' && newDirection === 'up') return false;
    if (currentDirection === 'left' && newDirection === 'right') return false;
    if (currentDirection === 'right' && newDirection === 'left') return false;
    return true;
  }

  // Calculate level based on score
  calculateLevel(score: number): number {
    return Math.floor(score / SNAKE_CONFIG.LEVEL_UP_THRESHOLD) + 1;
  }

  // Draw game elements on canvas
  drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = SNAKE_CONFIG.COLORS.GRID;
    ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= this.dimensions.width; x += this.dimensions.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.dimensions.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.dimensions.height; y += this.dimensions.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.dimensions.width, y);
      ctx.stroke();
    }
  }

  drawSnake(ctx: CanvasRenderingContext2D, snake: Snake): void {
    snake.body.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? SNAKE_CONFIG.COLORS.SNAKE_HEAD : SNAKE_CONFIG.COLORS.SNAKE_BODY;
      
      // Draw rounded rectangle for each segment
      const x = segment.x * this.dimensions.gridSize + 2;
      const y = segment.y * this.dimensions.gridSize + 2;
      const size = this.dimensions.gridSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
      
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = 'white';
        const eyeSize = 3;
        const eyeOffset = 5;
        
        switch (snake.direction) {
          case 'up':
            ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
            ctx.fillRect(x + size - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
            break;
          case 'down':
            ctx.fillRect(x + eyeOffset, y + size - eyeOffset - eyeSize, eyeSize, eyeSize);
            ctx.fillRect(x + size - eyeOffset - eyeSize, y + size - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
          case 'left':
            ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
            ctx.fillRect(x + eyeOffset, y + size - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
          case 'right':
            ctx.fillRect(x + size - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
            ctx.fillRect(x + size - eyeOffset - eyeSize, y + size - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
        }
      }
    });
  }

  drawFood(ctx: CanvasRenderingContext2D, food: Food): void {
    ctx.fillStyle = food.color;
    const x = food.position.x * this.dimensions.gridSize + this.dimensions.gridSize / 2;
    const y = food.position.y * this.dimensions.gridSize + this.dimensions.gridSize / 2;
    const radius = this.dimensions.gridSize / 3;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect for bonus food
    if (food.type === 'bonus') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = food.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  drawScore(ctx: CanvasRenderingContext2D, score: number, highScore: number, level: number): void {
    ctx.fillStyle = SNAKE_CONFIG.COLORS.TEXT;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`High Score: ${highScore}`, 10, 50);
    ctx.fillText(`Level: ${level}`, 10, 75);
  }

  drawGameOver(ctx: CanvasRenderingContext2D, score: number): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
    
    ctx.fillStyle = SNAKE_CONFIG.COLORS.GAME_OVER;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.dimensions.width / 2, this.dimensions.height / 2 - 30);
    
    ctx.fillStyle = SNAKE_CONFIG.COLORS.TEXT;
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, this.dimensions.width / 2, this.dimensions.height / 2 + 10);
  }

  drawPaused(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
    
    ctx.fillStyle = SNAKE_CONFIG.COLORS.TEXT;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', this.dimensions.width / 2, this.dimensions.height / 2);
  }

  // Update dimensions for responsive design
  updateDimensions(dimensions: GameDimensions): void {
    this.dimensions = dimensions;
  }
}