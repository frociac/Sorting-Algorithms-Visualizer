/**
 * A static class containing various sorting algorithms.
 */
class Algorithms {
  static isRunning = false;
  static #resolveStop = null;
  /**
   * Start the sorting process based on the selected algorithm.
   */
  static async startSort() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      await CanvasManager.draw();

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
        while (this.isRunning) {
          console.log(this.isRunning);
          const { done } = await generator.next();
          if (done) break;
        }
        if (this.isRunning) {
          await CanvasManager.draw({ forceGreen: true });
        }
      }
    } finally {
      this.isRunning = false;
      if (this.#resolveStop) {
        this.#resolveStop();
        this.#resolveStop = null;
      }
    }
  }

  static async stop() {
    if (!this.isRunning) {
      CanvasManager.setUpCanvas();
      return;
    }
    this.isRunning = false;
    await new Promise((resolve) => {
      this.#resolveStop = resolve;
    });
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
      await CanvasManager.draw(ArrayData.array);
      yield;
    }
  }

  /**
   * Performs the Selection Sort algorithm.
   * @async
   */
  static async *#selectionSort() {
    for (let i = 0; i < ArrayData.array.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < ArrayData.array.length; j++) {
        if ((await Utils.compare(minIndex, j)) > 0) minIndex = j;
        yield;
      }
      // array[minIndex] > array[j]
      await Utils.swap(minIndex, i);
      CanvasManager.addCorrectPositions([i]);
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
      CanvasManager.addCorrectPositions([ArrayData.array.length - i - 1]);
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

  static async *#merge(start, mid, end) {
    CanvasManager.subArrayPositions = Utils.generateRangedArray(start, end);
    await CanvasManager.draw();
    yield;

    let left = ArrayData.array.slice(start, mid + 1);
    let right = ArrayData.array.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        ArrayData.array[k] = left[i];
        i++;
      } else {
        ArrayData.array[k] = right[j];
        j++;
      }
      await CanvasManager.draw();
      yield;
      k++;
    }

    while (i < left.length) {
      ArrayData.array[k] = left[i];
      i++;
      k++;
      await CanvasManager.draw();
      yield;
    }

    while (j < right.length) {
      ArrayData.array[k] = right[j];
      j++;
      k++;
      await CanvasManager.draw();
      yield;
    }
    CanvasManager.subArrayPositions = [];
  }
}
