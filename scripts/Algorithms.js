/**
 * A static class containing various sorting algorithms.
 */
class Algorithms {
	static isRunning = false;
	static #resolveStop = null;
	static #abortController = null;
	/**
	 * Start the sorting process based on the selected algorithm.
	 */
	static async startSort() {
		if (this.isRunning) return;
		this.isRunning = true;
		this.#abortController = new AbortController();

		try {
			CanvasManager.draw();

			let generator;
			switch (Options.selectedAlgorithm) {
				case "selection":
					generator = this.#selectionSort();
					break;
				case "bubble":
					generator = this.#bubbleSort();
					break;
				case "insertion":
					generator = this.#insertionSort();
					break;
				case "merge":
					generator = this.#mergeSort();
					break;
				case "quick":
					// generator = this.#quickSort();
					break;
				case "heap":
					// generator = this.#heapSort();
					break;
				case "shell":
					// generator = this.#shellSort();
					break;
				case "bogo":
					generator = this.#bogoSort();
					break;
				default:
					console.warn("No valid algorithm selected.");
			}

			if (generator) {
				let isDone = false;

				while (this.isRunning) {
					const { done } = await generator.next();
					if (done) {
						isDone = true;
						break;
					}
					if (Options.step_speed === 0) {
						await new Promise((r) => setTimeout(r, 0));
					}
				}
			}
		} finally {
			CanvasManager.comparePositions = [];
			CanvasManager.swapPositions = [];
			CanvasManager.subArrayRange = { start: -1, end: -1 };

			CanvasManager.draw();

			this.isRunning = false;
			if (this.#resolveStop) {
				this.#resolveStop();
				this.#resolveStop = null;
			}
		}
	}

	static async stop() {
		if (this.isRunning) {
			this.isRunning = false;
			this.#abortController?.abort();

			if (this.#resolveStop) {
				await new Promise((r) => {
					const original = this.#resolveStop;
					this.#resolveStop = () => {
						original();
						r();
					};
				});
			}
		}

		CanvasManager.setUpCanvas();
	}

	/**
	 * Performs the Bogo Sort algorithm.
	 * @async
	 */
	static async *#bogoSort() {
		let isSorted = false;
		while (true) {
			isSorted = true;
			for (let i = 1; i < ArrayData.array.length; i++) {
				if ((await Utils.compare(i, i - 1)) < 0) {
					isSorted = false;
					break;
				}
				yield;
			}
			if (isSorted) break;
			ArrayData.array = await Utils.shuffle();
			CanvasManager.draw();
			yield;
		}
	}

	/**
	 * Performs the Selection Sort algorithm.
	 * @async
	 */
	static async *#selectionSort() {
		for (let i = 0; i <= ArrayData.array.length - 1; i++) {
			let minIndex = i;
			for (let j = i + 1; j < ArrayData.array.length; j++) {
				if ((await Utils.compare(minIndex, j)) > 0) minIndex = j;
				yield;
			}
			// array[minIndex] > array[j]
			await Utils.swap(minIndex, i);
			yield;
			CanvasManager.addCorrectPositions([i]);
			CanvasManager.draw({ indices: [i] });
			yield;
		}
	}

	/**
	 * Performs the Bubble Sort algorithm.
	 * @async
	 */
	static async *#bubbleSort() {
		for (let i = 0; i < ArrayData.array.length; i++) {
			for (let j = 0; j < ArrayData.array.length - i - 1; j++) {
				if ((await Utils.compare(j, j + 1)) > 0) await Utils.swap(j, j + 1);
				yield;
			}
			const correctPosition = ArrayData.array.length - i - 1;
			CanvasManager.addCorrectPositions([correctPosition]);
			CanvasManager.draw({ indices: [correctPosition] });
			yield;
		}
	}

	/**
	 * Performs the Insertion Sort algorithm.
	 * @async
	 */
	static async *#insertionSort() {
		let i;
		let j;
		for (i = 1; i < ArrayData.array.length; i++) {
			j = i - 1;
			while (j >= 0) {
				if ((await Utils.compare(j, j + 1)) > 0) {
					await Utils.swap(j, j + 1);
				}
				if (i == ArrayData.array.length - 1) {
					CanvasManager.addCorrectPositions([j + 1]);
				}
				j--;
				yield;
			}
			yield;
		}
	}
	/**
	 * Performs the Merge Sort algorithm.
	 * @async
	 */
	static async *#mergeSort(start = 0, end = ArrayData.array.length - 1) {
		if (start >= end) return;

		const mid = Math.floor((start + end) / 2);

		yield* this.#mergeSort(start, mid);
		yield* this.#mergeSort(mid + 1, end);
		yield* this.#merge(start, mid, end);
	}

	/**
	 * Performs an In-Place Merge.
	 */
	static async *#merge(start, mid, end) {
		let rightStart = mid + 1;
		const isFinalMerge = start === 0 && end === ArrayData.array.length - 1;
		CanvasManager.subArrayRange = { start, end };
		CanvasManager.draw({ range: { start, end } });

		yield;

		if ((await Utils.compare(mid, rightStart)) <= 0) {
			if (isFinalMerge) {
				for (let k = start; k <= end; k++) CanvasManager.addCorrectPositions([k]);
			}
			CanvasManager.subArrayRange = { start: -1, end: -1 };
			CanvasManager.draw({ range: { start, end } });
			return;
		}

		while (start <= mid && rightStart <= end) {
			if ((await Utils.compare(start, rightStart)) <= 0) {
				if (isFinalMerge) {
					CanvasManager.addCorrectPositions([start]);
					CanvasManager.draw({ indices: [start] });
				}
				start++;
			} else {
				let currentIndex = rightStart;

				while (currentIndex !== start) {
					await Utils.swap(currentIndex, currentIndex - 1);
					currentIndex--;
					yield;
				}
				if (isFinalMerge) {
					CanvasManager.addCorrectPositions([start]);
					CanvasManager.draw({ indices: [start] });
				}
				start++;
				mid++;
				rightStart++;
			}
		}
		if (isFinalMerge) {
			for (let k = start; k <= end; k++) {
				CanvasManager.addCorrectPositions([k]);
			}
		}
		const finalRange = {
			start: CanvasManager.subArrayRange.start,
			end: CanvasManager.subArrayRange.end
		};
		CanvasManager.subArrayRange = { start: -1, end: -1 };
		CanvasManager.draw({ range: finalRange });
	}
	static get abortSignal() {
		return this.#abortController?.signal;
	}
}
