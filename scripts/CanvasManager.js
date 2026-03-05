class CanvasManager {
	static #canvas = document.getElementById("canvas");
	static #ctx = this.#canvas.getContext("2d");
	static #comparePositions = [];
	static #swapPositions = [];
	static #correctPositions = [];
	static #subArrayRange = { start: -1, end: -1 }; // red
	static height = this.#canvas.height;
	static width = this.#canvas.width;

	static setUpCanvas() {
		this.#ctx.fillStyle = "rgb(0,0,0)";
		this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
		this.#comparePositions = [];
		this.#swapPositions = [];
		this.#correctPositions = [];
		this.#subArrayRange = { start: -1, end: -1 }; // Reset range
		ArrayData.clearArray();
	}

	static draw({ forceGreen = false, indices = null, range = null } = {}) {
		const rectWidth = this.width / ArrayData.arraySize;

		if (!indices && !range) {
			this.#ctx.fillStyle = "rgb(0,0,0)";
			this.#ctx.fillRect(0, 0, this.width, this.height);
			for (let i = 0; i < ArrayData.array.length; i++) {
				this.#drawSingleBar(i, rectWidth, forceGreen);
			}
		} else if (range) {
			for (let i = range.start; i <= range.end; i++) {
				this.#drawSingleBar(i, rectWidth, forceGreen);
			}
		} else if (indices) {
			for (let i of indices) {
				this.#drawSingleBar(i, rectWidth, forceGreen);
			}
		}
	}

	static #drawSingleBar(i, rectWidth, padding, forceGreen) {
		const x = i * rectWidth;
		this.#ctx.fillStyle = "rgb(0,0,0)";
		this.#ctx.fillRect(x, 0, Math.ceil(rectWidth), this.height);

		if (this.#swapPositions.includes(i)) {
			this.#ctx.fillStyle = "blue";
		} else if (this.#comparePositions.includes(i)) {
			this.#ctx.fillStyle = "yellow";
		} else if (this.#correctPositions.includes(i) || forceGreen) {
			this.#ctx.fillStyle = "green";
		} else if (i >= this.#subArrayRange.start && i <= this.#subArrayRange.end) {
			this.#ctx.fillStyle = "red";
		} else {
			this.#ctx.fillStyle = "white";
		}

		const barHeight = ArrayData.array[i] * Options.normalize_scale;
		const drawWidth = rectWidth < 1 ? 1 : rectWidth;

		this.#ctx.fillRect(x, this.height - barHeight, drawWidth, barHeight);
	}

	/**
	 * Sets the subarray range.
	 * @param {{start: number, end: number}} range - The new subarray range to set.
	 * @public
	 */
	static set subArrayRange(range) {
		if (range && typeof range.start === "number" && typeof range.end === "number") {
			this.#subArrayRange = range;
		} else {
			console.error("Invalid range. Expecting {start: number, end: number}");
		}
	}

	/**
	 * Get the positions of subarrays during the sorting process.
	 * @returns {{start: number, end: number}} An object representing subarray range.
	 */
	static get subArrayRange() {
		return this.#subArrayRange;
	}

	/**
	 * Adds correct positions.
	 * @param {number[]} newPositions - The new correct positions to add.
	 * @public
	 */
	static addCorrectPositions(newPositions) {
		if (this.#isValidIntArray(newPositions)) {
			this.#correctPositions.push(...newPositions);
		} else {
			console.error("Invalid input for correctPositions. Expecting an array of integers.");
		}
	}

	/**
	 * Sets the comparison positions.
	 * @param {number[]} newPositions - The new comparison positions to set.
	 * @public
	 */
	static set comparePositions(newPositions) {
		if (this.#isValidIntArray(newPositions)) {
			this.#comparePositions = newPositions;
		} else {
			console.error("Invalid input for comparePositions. Expecting an array of integers.");
		}
	}

	/**
	 * Get the positions of elements being compared.
	 * @returns {Array<number>} An array of indices representing the elements being compared.
	 */
	static get comparePositions() {
		return this.#comparePositions;
	}

	/**
	 * Sets the swapping positions.
	 * @param {number[]} newPositions - The new swapping positions to set.
	 * @public
	 */
	static set swapPositions(newPositions) {
		if (this.#isValidIntArray(newPositions)) {
			this.#swapPositions = newPositions;
		} else {
			console.error("Invalid input for swapPositions. Expecting an array of integers.");
		}
	}

	/**
	 * Get the positions of elements being swapped.
	 * @returns {Array<number>} An array of indices representing the elements being swapped.
	 */
	static get swapPositions() {
		return this.#swapPositions;
	}

	/**
	 * Sets the correct positions.
	 * @param {number[]} newPositions - The new correct positions to set.
	 * @public
	 */
	static set correctPositions(newPositions) {
		if (this.#isValidIntArray(newPositions)) {
			this.#correctPositions = newPositions;
		} else {
			console.error("Invalid input for correctPositions. Expecting an array of integers.");
		}
	}

	/**
	 * Get the positions of elements that are in their correct sorted positions.
	 * @returns {Array<number>} An array of indices representing the elements in their correct positions.
	 */
	static get correctPositions() {
		return this.#correctPositions;
	}

	static #isValidIntArray(input) {
		if (!Array.isArray(input)) return false;
		return input.every((value) => Number.isInteger(value));
	}
}
