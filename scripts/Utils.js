/**
 * A utility class containing various helper functions.
 */
class Utils {
	/**
	 * Generates a random array of the given size containing float numbers.
	 * @param {number} size - The size of the array to generate.
	 * @param {number} min - The minimum value of the elements.
	 * @param {number} max - The maximum value of the elements.
	 * @returns {number[]} The generated random array.
	 */
	static generateRandomArray(size) {
		const arr = new Float32Array(size);
		for (let i = 0; i < size; i++) {
			arr[i] = Math.random() * CanvasManager.height;
		}
		console.log(arr);
		return arr;
	}

	/**
	 * Normalizes the array elements to fit within the canvas height.
	 * @param {number[]} arr - The array of numbers to normalize.
	 * @returns {number} scaling factor
	 * @public
	 */
	static setNormalizeScale() {
		// Calculate the scaling factor based on the canvas height and the largest value in the array.
		const scale = CanvasManager.height / this.#findLargestNumber(ArrayData.array);
		Options.normalize_scale = scale;
		return scale;
	}

	/**
	 * Finds the largest number in the array.
	 * @param {number[]} arr - The array of numbers to search.
	 * @returns {number} The largest number in the array.
	 * @private
	 */
	static #findLargestNumber(arr) {
		let largest = 0;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] > largest) largest = arr[i];
		}
		return largest;
	}

	/**
	 * Swaps two elements in the array and updates swap points.
	 * @param {number} i1 - The index of the first element.
	 * @param {number} i2 - The index of the second element.
	 * @returns {Promise<void>} A Promise that resolves after the swap.
	 */
	static async swap(i, j) {
		if (i === j) return;

		CanvasManager.swapPositions = [i, j];
		CanvasManager.draw({ indices: [i, j] });

		if (Options.step_speed > 0) {
			await this.wait(Options.step_speed, Algorithms.abortSignal);
		}

		[ArrayData.array[i], ArrayData.array[j]] = [ArrayData.array[j], ArrayData.array[i]];

		CanvasManager.swapPositions = [];
		CanvasManager.draw({ indices: [i, j] });

		// if (Options.step_speed > 0) {
		// 	await this.wait(Options.step_speed, Algorithms.abortSignal);
		// }
	}

	/**
	 * Compares two elements in the array and updates compare points.
	 * @param {number} i1 - The index of the first element.
	 * @param {number} i2 - The index of the second element.
	 * @returns {Promise<number>} The difference between element1 and element2
	 */
	static async compare(i1, i2) {
		CanvasManager.comparePositions = [i1, i2];
		CanvasManager.draw({ indices: [i1, i2] });
		if (Options.step_speed > 0) {
			await this.wait(Options.step_speed, Algorithms.abortSignal);
		}
		CanvasManager.comparePositions = [];
		CanvasManager.draw({ indices: [i1, i2] });
		return ArrayData.array[i1] - ArrayData.array[i2];
	}

	/**
	 * Checks if the array is sorted in non-decreasing order.
	 * @returns {Promise<boolean>} True if the array is sorted, false otherwise.
	 */
	static async isSorted() {
		for (let i = 1; i < ArrayData.array.length; i++) {
			if ((await this.compare(i, i - 1)) < 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Shuffles the array using the Fisher-Yates algorithm.
	 * @returns {Promise<number[]>} A Promise that resolves with the shuffled array.
	 */
	static async shuffle() {
		var m = ArrayData.array.length,
			t,
			i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			t = ArrayData.array[m];
			ArrayData.array[m] = ArrayData.array[i];
			ArrayData.array[i] = t;
		}
		CanvasManager.draw();
		return ArrayData.array;
	}

	/**
	 * Generates a ranged array of integers.
	 * @param {number} start - The starting value of the range.
	 * @param {number} end - The ending value of the range (inclusive).
	 * @returns {number[]} The generated ranged array.
	 */
	static generateRangedArray(start, end) {
		return Array.from({ length: end - start + 1 }, (_, index) => start + index);
	}

	/**
	 * Creates a promise that resolves after the given amount of time.
	 * @param {number} ms - The time in milliseconds to wait.
	 * @param {AbortSignal} [signal] - An AbortSignal that can be used to cancel the wait operation.
	 * @returns {Promise<void>} A Promise that resolves after the delay.
	 */
	static wait(ms, signal) {
		return new Promise((resolve) => {
			const timeout = setTimeout(() => resolve(true), ms);

			signal?.addEventListener(
				"abort",
				() => {
					clearTimeout(timeout);
					resolve(false);
				},
				{ once: true }
			);
		});
	}
}
