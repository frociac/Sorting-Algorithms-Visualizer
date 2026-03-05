/**
 * A class for managing array data
 */
class ArrayData {
	static #array = [];
	static #arraySize = 5;

	/**
	 * Clears the array.
	 * @public
	 */
	static clearArray() {
		this.#array = [];
	}

	/**
	 * Gets the main array.
	 * @returns {number[]} The main array data.
	 * @public
	 */
	static get array() {
		return this.#array;
	}

	/**
	 * Sets the main array data and array size.
	 * Attempts to convert string to array (if not valid uses randomly generated array)
	 * @param {number[] | string} newArray - The new array data ().
	 * @public
	 */
	static set array(newArray) {
		if (typeof newArray === "string") {
			if (this.#verifyArrayInput(newArray)) {
				this.#array = newArray.split(" ").map(Number);
				this.#arraySize = this.#array.length;
			} else {
				this.#array = Utils.generateRandomArray(Options.user_array_size);
				this.#arraySize = Options.user_array_size;
			}
		} else {
			this.#array = newArray;
			this.#arraySize = newArray.length;
		}
		Utils.setNormalizeScale();
	}

	/**
	 * Verifies if the input string contains only numbers separated by spaces.
	 * @param {string} arrayString - The input string representing an array.
	 * @returns {boolean} True if the input is valid, false otherwise.
	 * @private
	 */
	static #verifyArrayInput(arrayString) {
		return /^(\d+\s*)+$/.test(arrayString);
	}

	/**
	 * Gets the array size.
	 * @returns {number} The array size.
	 * @public
	 */
	static get arraySize() {
		return this.#arraySize;
	}
}
