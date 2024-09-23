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

// Export the compass area as an Image (PNG/JPG)
document.getElementById('export-img-btn').addEventListener('click', function () {
    const compassArea = document.getElementById('compass-area');

    html2canvas(compassArea).then(function (canvas) {
        // Convert the canvas to an image and download it
        const link = document.createElement('a');
        link.download = 'compass-image.png'; // Filename for the download
        link.href = canvas.toDataURL('image/png'); // Convert canvas to PNG format
        link.click(); // Trigger the download
    });
});

// Export the compass area as a PDF
document.getElementById('export-pdf-btn').addEventListener('click', function () {
    const compassArea = document.getElementById('compass-area');

    html2canvas(compassArea).then(function (canvas) {
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Convert canvas to an image and add it to the PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 page width in mm (for landscape)
        const pageHeight = 297; // A4 page height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate the image height proportionally
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add image to PDF
        
        // Save the generated PDF
        pdf.save('compass.pdf');
    });
});

// Image selector functionality
document.getElementById('image-selector').addEventListener('change', function() {
    const selectedImage = this.value;  // Get the selected image filename
    document.getElementById('dynamic-image').src = selectedImage;  // Update the image src
});
