// Get DOM elements
const compassContainer = document.querySelector('.compass-container');
const shapeSelector = document.getElementById('shape-selector');
const colorPicker = document.getElementById('color-picker');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');
const positiveAdjInput = document.getElementById('positive-adj');
const negativeAdjInput = document.getElementById('negative-adj');

// Modal-related DOM elements
const helpModal = document.getElementById('helpModal');
const closeBtn = document.querySelector('.close-btn');
const helpText = document.getElementById('helpText');
const helpIcons = document.querySelectorAll('.help-icon');

// Update size value text when slider is moved
sizeSlider.addEventListener('input', function () {
    sizeValue.textContent = sizeSlider.value;  // Update the label with the current slider value
});

// Shape creation function
function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
    const shapeElement = document.createElement('div');
    shapeElement.classList.add('shape', shape);

    // Set position (use absolute positioning to place it based on click)
    shapeElement.style.left = `${x}px`;
    shapeElement.style.top = `${y}px`;

    // Handle different shape types
    if (shape === 'circle') {
        // Set size and color for circles
        shapeElement.style.width = `${size}px`;
        shapeElement.style.height = `${size}px`;
        shapeElement.style.backgroundColor = color;
    } else if (shape === 'plus') {
        // Plus sign
        shapeElement.textContent = '+';
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`; // Dynamically adjust font size
    } else if (shape === 'check') {
        // Check mark
        shapeElement.textContent = '✔';
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`; // Dynamically adjust font size
    } else {
        // Other text-based shapes
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

// Function to append text areas to the compass area before saving
function appendTextToCanvas() {
    const posText = document.createElement('div');
    posText.textContent = `Positive Adj: ${positiveAdjInput.value}`;
    posText.style.position = 'absolute';
    posText.style.bottom = '10px'; // Position it at the bottom of the canvas
    posText.style.left = '10px';
    posText.style.color = '#ff0000'; // Red text to match the theme
    posText.style.fontSize = '16px';
    posText.classList.add('text-on-canvas'); // Add a class to remove it later

    const negText = document.createElement('div');
    negText.textContent = `Negative Adj: ${negativeAdjInput.value}`;
    negText.style.position = 'absolute';
    negText.style.bottom = '30px'; // Position it slightly above Positive Adj
    negText.style.left = '10px';
    negText.style.color = '#ff0000';
    negText.style.fontSize = '16px';
    negText.classList.add('text-on-canvas');

    compassContainer.appendChild(posText);
    compassContainer.appendChild(negText);
}

// Function to clean up added text areas after saving
function removeTextFromCanvas() {
    document.querySelectorAll('.text-on-canvas').forEach(el => el.remove());
}

// Export the compass area as an Image (PNG/JPG)
document.getElementById('export-img-btn').addEventListener('click', function () {
    appendTextToCanvas();

    html2canvas(compassContainer).then(function (canvas) {
        // Convert the canvas to an image and download it
        const link = document.createElement('a');
        link.download = 'compass-image.png'; // Filename for the download
        link.href = canvas.toDataURL('image/png'); // Convert canvas to PNG format
        link.click(); // Trigger the download

        removeTextFromCanvas(); // Clean up added text after saving
    });
});

// Export the compass area as a PDF
document.getElementById('export-pdf-btn').addEventListener('click', function () {
    appendTextToCanvas();

    html2canvas(compassContainer).then(function (canvas) {
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 page width in mm
        const pageHeight = 297; // A4 page height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate the image height proportionally
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('compass.pdf');

        removeTextFromCanvas(); // Clean up added text after saving
    });
});

// Image selector functionality
document.getElementById('image-selector').addEventListener('change', function() {
    const selectedImage = this.value;  // Get the selected image filename
    document.getElementById('dynamic-image').src = selectedImage;  // Update the image src
});

// Show modal with help text when a help icon is clicked
helpIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const helpMessage = this.getAttribute('data-help');
        helpText.textContent = helpMessage;
        helpModal.style.display = 'block';
    });
});

// Close modal when the close button is clicked
closeBtn.addEventListener('click', function() {
    helpModal.style.display = 'none';
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});
