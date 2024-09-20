// Get DOM elements
const compassContainer = document.querySelector('.compass-container');
const shapeSelector = document.getElementById('shape-selector');
const colorPicker = document.getElementById('color-picker');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');
const positiveAdjInput = document.getElementById('positive-adj');
const negativeAdjInput = document.getElementById('negative-adj');

// Update size value text when slider is moved
sizeSlider.addEventListener('input', function () {
    sizeValue.textContent = sizeSlider.value;  // Update the label with the current slider value
});

// Shape creation function
function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
    const shapeElement = document.createElement('div');
    shapeElement.classList.add('shape', shape);

    // Set size (width and height)
    shapeElement.style.width = `${size}px`;
    shapeElement.style.height = `${size}px`;

    // Set position
    shapeElement.style.left = `${x}px`;
    shapeElement.style.top = `${y}px`;

    // Set background color for circles, or text and color for others
    if (shape === 'circle') {
        shapeElement.style.backgroundColor = color;
    } else if (shape === 'plus') {
        shapeElement.textContent = '+';
        shapeElement.style.color = color;
    } else {
        shapeElement.textContent = shape.toUpperCase();
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size / 2}px`;  // Adjust font size for text-based shapes
    }

    // Tooltip for Positive and Negative Adj (on hover)
    shapeElement.title = `Positive Adj: ${positiveAdj}, Negative Adj: ${negativeAdj}`;

    // Click to remove shape
    shapeElement.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevents removing on parent click
        shapeElement.remove();
    });

    // Add the shape to the container
    compassContainer.appendChild(shapeElement);
}

// Event listener for adding shapes
compassContainer.addEventListener('click', function (e) {
    if (e.target !== compassContainer) return; // Prevent adding on existing shape

    // Get the selected shape, color, and size
    const selectedShape = shapeSelector.value;
    const selectedColor = colorPicker.value;
    const selectedSize = sizeSlider.value;
    const positiveAdj = positiveAdjInput.value;
    const negativeAdj = negativeAdjInput.value;

    // Get the coordinates relative to the container
    const rect = compassContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`Shape: ${selectedShape}, Color: ${selectedColor}, Size: ${selectedSize}px, Positive Adj: ${positiveAdj}, Negative Adj: ${negativeAdj}`);

    // Create the shape at the clicked position
    createShape(x, y, selectedShape, selectedColor, selectedSize, positiveAdj, negativeAdj);
});
