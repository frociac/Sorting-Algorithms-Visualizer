/**
 * A class for managing application options and state.
 */
class Options {
	static selectedAlgorithm = "";
	static random_click_count = 0;
	static #user_array_size = 5;
	static normalize_scale = 1;
	static #step_speed = 250;
	static has_started = false;
	static is_randomly_generated = false;
	static is_paused = false;
	static should_normalize_array = true;

	/**
	 * @param {number | string} speed (in ms)
	 */
	static set step_speed(speed) {
		if (speed) this.#step_speed = parseFloat(speed);
	}
	/**
	 * Gets the step speed
	 */
	static get step_speed() {
		return this.#step_speed;
	}
	/**
	 * Sets the user-defined array size.
	 * @param {number|string} size - The new array size.
	 */
	static set user_array_size(size) {
		if (size) this.#user_array_size = parseInt(size);
	}

	/**
	 * Gets the user-defined array size.
	 */
	static get user_array_size() {
		return this.#user_array_size;
	}
}
