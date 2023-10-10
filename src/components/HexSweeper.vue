<template>
  <div class="eox-minesweeper">
    <!-- SVG Element to represent the Minesweeper Board -->
    <svg ref="canvas" id="hexagonSVG" xmlns="http://www.w3.org/2000/svg"></svg>

    <div class="control-box">
      <label for="scaleSlider">Scale Factor:</label>
      <input
        id="scaleSlider"
        type="range"
        min="1"
        max="4"
        step="0.0001"
        v-model="scaleFactor"
        @input="requestDrawBoard"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "HexSweeper",
  data() {
    return {
      width: 20,
      height: 10,
      board: [],
      difficulty: 0.2,
      scaleFactor: 2.0,
    };
  },
  mounted() {
    // Populate the board on component creation
    this.initializeBoard();
    this.drawBoard();
  },
  methods: {
    initializeBoard() {
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          row.push({
              isMine: Math.random() < this.difficulty, // Randomly decide if the tile is a mine
              adjacentMines: 0,
              revealed: false,
              flagged: false,
              element: null,
          });
        }
        this.board.push(row);
      }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            this.board[y][x].adjacentMines = this.calculateAdjacentMines(x, y);
        }
      }
    },

    requestDrawBoard() {
      requestAnimationFrame(this.drawBoard);
    },

    drawBoard() {
      const svg = this.$refs.canvas;
      const hexWidth = 43.3012684 * this.scaleFactor;
      const hexHeight = 50 * this.scaleFactor;
      const staggeredOffset = hexWidth / 2;
      const verticalGap = 37.5 * this.scaleFactor;

      // Calculate total dimensions:
      const totalWidth = this.width * hexWidth;
      const totalHeight = hexHeight + (this.height - 1) * (hexHeight * 0.75) + 20;

      // Calculate centering offsets:
      const xOffset = (svg.clientWidth - totalWidth) / 2;
      const yOffset = (svg.clientHeight - totalHeight) / 2;

      // Clear previous drawings
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
      }

      if (svg === undefined) {
        console.error(`Cannot find SVG element with ref="canvas"`);
      }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const tile = this.board[y][x];
          const hexElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );
          const hexPath = `
            M${21.6506342 * this.scaleFactor},0 
            L${43.3012684 * this.scaleFactor},${12.5 * this.scaleFactor}
            L${43.3012684 * this.scaleFactor},${37.5 * this.scaleFactor}
            L${21.6506342 * this.scaleFactor},${50 * this.scaleFactor}
            L0,${37.5 * this.scaleFactor}
            L0,${12.5 * this.scaleFactor}
            L${21.6506342 * this.scaleFactor},0
          `;

          hexElement.setAttribute('d', hexPath);
          const actualOffset = y % 2 === 0 ? staggeredOffset : 0;

          hexElement.setAttribute(
            'transform',
            `translate(${x * hexWidth + xOffset + actualOffset}, ${y * verticalGap + yOffset})`
          );

          hexElement.classList.add('hexagon');
          if (tile.isMine) {
            hexElement.classList.add('mine');
          }
          hexElement.addEventListener("click", () => this.revealTile(x, y));
          tile.element = hexElement;
          svg.appendChild(hexElement);

          if (!tile.isMine) {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            hexElement.classList.add('mine-number');
            // Update textElement positioning with offsets:
            textElement.setAttribute('x', x * hexWidth + xOffset + staggeredOffset + hexWidth / 2);
            textElement.setAttribute('y', y * verticalGap + yOffset + hexHeight / 2);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.textContent = tile.adjacentMines.toString();
            textElement.style.visibility = 'hidden'; // Hide the number initially
            tile.textElement = textElement;
            svg.appendChild(textElement);
          }
        }
      }

      // Set SVG dimensions
      svg.style.width = `${totalWidth}px`;
      svg.style.height = `${totalHeight}px`;
    },
    revealTile(x, y) {
      const tile = this.board[y][x];
      if (tile.revealed || tile.flagged) return;
      tile.revealed = true;
      tile.element.style.fill = tile.isMine ? '#f55' : '#cccccc';

      if (!tile.isMine) {
        tile.textElement.style.visibility = 'visible'; // Show the number
      }
    },
    calculateAdjacentMines(x, y) {
      let count = 0;

      const neighbors = y % 2 === 0
        ? [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]]
        : [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]];

      for (let [dx, dy] of neighbors) {
          let nx = x + dx;
          let ny = y + dy;

          if (nx >= 0 
            && nx < this.width
            && ny >= 0
            && ny < this.height
            && this.board[ny]
            && this.board[ny][nx].isMine
          ) {
              count++;
              console.log(`Mine detected at ${nx}, ${ny} when checking neighbors of ${x}, ${y}`);
          }
      }

      return count;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
svg {
  display: block;
  position: relative;
/*
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
*/
}
.hexagon {
  transition: fill 0.3s ease;
  fill: var(--color-background);
  stroke: #99b;
  stroke-width: 2px;
}
.hexagon:hover {
  fill: #ffcc66;
}
.mine {
  fill: transparent;
}

text {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 500;
}

.eox-minesweeper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.mine::before {
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAACbUlEQVR4nO2azU4bMRRGzybsStV2V9Q36a4EAlJaqgryLJRXocCi8Ar8bKouWtjRJYtQ2pAuWn5eACFXlu5IyJohOPH1mJk50rcAEq5PPLFnbENDQ0ODH++Af8Bf4C014A9gJENqgHFSeUyVhaeADvAR2AGOc4SP5W/2NfPynkfHHLAFXOcIjop9zybQ5hHwGvg6hmRRjoBumUILwDnwS6aXjBngIKCom32pkbEEDIDf8pVRY3CnETdAT4pfKspmuZRaPamd/d5KqzF0GnEbQdSMqGk7QY33zqdbdm6kTar0SurZvJ62bVFnKQHZLMvasjORBiifOfuVpvBBApJu9jTvnkyieaMhfOTRADtVfACeSOz3/kRR+Hto2ban7POc//HMuXFJupe3PArbni1iWVF4I5TslOdTj72Ei5hWFL4CWiGEO56F7xN+qihsZGCdmDXPonaAKmJFWXg1hPC2Z9ETGaBcXsijpabw5xDCP8YoPJABalqyEkHWSFu9WQTOIjROO9bBLliMRHOujJ1hI5yDvQx+JtA7k8Y6dGINWmXFrnFPzE4CIlGnpbUERKLeeMwnIPLQBNmtaMmNuUk81yH3pTYTEBqVdUpaADBVWeY5TECqKN9QYK5OvZuxn4Ccm12UF+IvEpCMthBfu62W2m2mdRPcLlU9EnGa8ymX0bN3f+5rCvcLjjzEGMguCo48qArPSoFT51J6Kbt4mlOPrZHRlTb0pU2lHlv6ElD0sOxjSw9lVvZ6xnnKsu/5pHn3pElLbklXZUG/6OjhtrymHWp/KCWMk8pj6iZ85iylVp4F2Wc61z4n2dDQQOX4D/PeJo3dzP7FAAAAAElFTkSuQmCC");
  filter: invert(100%);
  height: 36px;
  width: 36px;
}

.control-box {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
