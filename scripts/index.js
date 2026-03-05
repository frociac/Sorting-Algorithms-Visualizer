document.addEventListener("DOMContentLoaded", () => {
  // starts canvas in utils.js and stores context
  CanvasManager.setUpCanvas();

  /** fullscreen handler */
  const canvas = document.getElementById("canvas");
  document.addEventListener("keydown", (event) => {
    if (event.key === "f") {
      if (canvas.requestFullscreen) canvas.requestFullscreen();
      else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
      else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
    }
  });
  /**end of fullscreen handler */

  /** slider handler */
  const slider = document.getElementById("speed");
  const valueDisplay = document.getElementById("value-display");

  // update the value display when the slider value changes
  slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
    Options.step_speed = slider.value;
  });
  /** end of slider handler */

  /** sorting buttons handler */
  const buttonContainer = document.getElementById("left");
  const controlButton = document.getElementById("start-end");
  const pauseButton = document.getElementById("pause");
  // adds an event listener to the div containing buttons
  buttonContainer.addEventListener("click", (event) => {
    // ensures the button was pressed and not the div
    let target = event.target;
    if (target.classList.contains("choice-button")) {
      controlButton.classList.remove("disabled");
      if (target.id == "random") {
        Options.random_click_count++;
        target = buttonContainer.children[Math.floor(Math.random() * (buttonContainer.children.length -1))];
      }
      Options.selectedAlgorithm = target.id;
      target.classList.add("clicked");
      // removes clicked class from previously clicked button (makes all other buttons turn red)
      for (let i = 0; i < buttonContainer.children.length; i++) {
        let childButton = buttonContainer.children[i];
        if (childButton.id != target.id) {
          childButton.classList.remove("clicked");
        }
      }
    }
  });
  /** end of sorting buttons handler */

  /** input handler */
  const elementsInput = document.getElementById("elements");
  const sizeInput = document.getElementById("size");
  controlButton.addEventListener("click", async (event) => {
    if (Options.has_started) {
      Options.has_started = false;
      controlButton.disabled = true; 
      await Algorithms.stop();
      controlButton.disabled = false;
      controlButton.classList.add("clicked");
      controlButton.textContent = "Start Sort";
      pauseButton.classList.add("disabled");
      for (let i = 0; i < buttonContainer.children.length; i++) {
        let childButton = buttonContainer.children[i];
        childButton.classList.remove("disabled");
      }
    } else {
      Options.has_started = true;
      Options.user_array_size = sizeInput.value; 
      ArrayData.array = elementsInput.value;
      controlButton.classList.remove("clicked");
      controlButton.textContent = "Stop Sort";
      pauseButton.classList.remove("disabled");
      for (let i = 0; i < buttonContainer.children.length; i++) {
        let childButton = buttonContainer.children[i];
        childButton.classList.add("disabled");
      }
      Algorithms.startSort();
    };
  })
  pauseButton.addEventListener("click", (event) => {
    Options.is_paused = true;
  })
  /** end of input handler */
});


