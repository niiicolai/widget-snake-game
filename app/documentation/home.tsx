export default function Home() {
  const widgetUrl = `http://localhost:5173/#/snake`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Snake Game Widget
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        A classic Snake game built with React and Canvas API. Perfect for embedding in websites as a fun, nostalgic gaming widget.
      </p>
      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <div>Start Date: 29/01/2025</div>
        <div>Last Update: 29/01/2025</div>
      </div>

      <a
        href="https://github.com/niiicolai/widget-snake-game"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors mb-3 inline-block"
      >
        GitHub Repository
      </a>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Demo
        </h2>
        <iframe src={widgetUrl} width="100%" height="810px" className="rounded-xl border border-gray-300 dark:border-gray-600"></iframe>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Classic Snake gameplay with smooth controls</li>
          <li>Progressive difficulty with speed increases</li>
          <li>Bonus food items for extra points</li>
          <li>High score tracking with localStorage</li>
          <li>Responsive design that adapts to different screen sizes</li>
          <li>Touch and swipe controls for mobile devices</li>
          <li>Keyboard controls (Arrow keys or WASD)</li>
          <li>Pause/Resume functionality</li>
          <li>Grid-based movement system</li>
          <li>Dark/light theme support</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Controls
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Keyboard Controls</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">W</kbd> - Move up</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">S</kbd> - Move down</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">←</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">A</kbd> - Move left</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">→</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">D</kbd> - Move right</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Space</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">P</kbd> - Pause/Resume</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">R</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> - Restart</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile Controls</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Swipe up - Move up</li>
              <li>Swipe down - Move down</li>
              <li>Swipe left - Move left</li>
              <li>Swipe right - Move right</li>
              <li>Touch and drag for precise control</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Gameplay
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scoring System</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Normal food: 10 points</li>
              <li>Bonus food (golden): 50 points</li>
              <li>Level up every 50 points</li>
              <li>Speed increases with each level</li>
              <li>High score saved automatically</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Game Rules</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Guide the snake to eat food</li>
              <li>Avoid hitting walls</li>
              <li>Avoid hitting your own tail</li>
              <li>Snake grows longer when eating</li>
              <li>Game ends on collision</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Setup
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Add this iframe to your website:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          {`<iframe 
  src="https://niiicolai.github.io/widget-snake-game/#/snake" 
  height="810px"
  width="100%"
  frameborder="0"
  scrolling="no">
</iframe>`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Technical Details
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>React 19 with TypeScript</li>
              <li>HTML5 Canvas API</li>
              <li>Tailwind CSS for styling</li>
              <li>Vite for build tooling</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Smooth 60 FPS gameplay</li>
              <li>Optimized collision detection</li>
              <li>Responsive canvas sizing</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8 p-4 border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200 font-medium">
          💡 Tip: For the best loading speed and reliability, I highly recommend self-hosting this widget on your own domain or infrastructure.
        </p>
        <p className="mt-2 text-blue-700 dark:text-blue-300 text-sm">
          You can easily fork the project and deploy it yourself using GitHub Pages or a similar service.
          <a
            href="https://github.com/niiicolai/widget-snake-game/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold ml-1"
          >
            Fork the project here.
          </a>
        </p>
      </section>
    </div>
  );
}