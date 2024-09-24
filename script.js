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

// Shape creation function with debugging
function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
    // Prevent creating shapes if 'erase' is selected or if it's an invalid shape
    if (shape === 'erase' || !['circle', 'plus', 'check', 'vr', 'vc', 'ar', 'ac', 'kr', 'kc', 'ad'].includes(shape)) {
        return;
    }

    const shapeElement = document.createElement('div');
    shapeElement.classList.add('shape', shape);

    // Set position (use absolute positioning to place it based on click)
    shapeElement.style.left = `${x}px`;
    shapeElement.style.top = `${y}px`;
    shapeElement.style.position = 'absolute';
    shapeElement.style.display = 'flex';
    shapeElement.style.justifyContent = 'center';
    shapeElement.style.alignItems = 'center';
    shapeElement.style.backgroundColor = 'transparent';  // Ensure transparent background by default

    // Debugging: Log the shape details
    console.log(`Creating shape: ${shape}, Size: ${size}, Color: ${color}, Position: (${x}, ${y})`);

    // Handle graphical shapes
    if (shape === 'circle') {
        shapeElement.style.width = `${size}px`;
        shapeElement.style.height = `${size}px`;
        shapeElement.style.backgroundColor = color;
        shapeElement.style.borderRadius = '50%';
        shapeElement.style.border = `2px solid ${color}`;  // Add border for better visibility

        // Debugging: Visual aid for circles
        shapeElement.style.border = '2px dashed yellow'; // Make it visually different

    } else if (shape === 'plus') {
        shapeElement.textContent = '+';
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`;
        shapeElement.style.width = 'auto';  // Text-based shapes should not have a fixed width
        shapeElement.style.height = 'auto';  // Text-based shapes should not have a fixed height

    } else if (shape === 'check') {
        shapeElement.textContent = '✔';
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`;
        shapeElement.style.width = 'auto';
        shapeElement.style.height = 'auto';

    // Handle text-based shapes (vr, vc, ar, etc.)
    } else if (['vr', 'vc', 'ar', 'ac', 'kr', 'kc', 'ad'].includes(shape)) {
        shapeElement.textContent = shape.toUpperCase();
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`;
        shapeElement.style.backgroundColor = 'transparent';  // Ensure no background for text
        shapeElement.style.width = 'auto';
        shapeElement.style.height = 'auto';
        shapeElement.style.padding = '0';  // Ensure no padding for text
        shapeElement.style.border = 'none';  // Ensure no border for text shapes
    }

    // Tooltip for Positive and Negative Adj (on hover)
    shapeElement.title = `Positive Adj: ${positiveAdj}, Negative Adj: ${negativeAdj}`;

    // Add click-to-remove functionality
    shapeElement.addEventListener('click', function (e) {
        e.stopPropagation();  // Prevents removing on parent click
        if (shapeSelector.value === 'erase') {
            shapeElement.remove();  // Only remove shape if 'Erase' is selected
            console.log(`Shape removed at position: (${x}, ${y})`); // Debugging: Log when a shape is removed
        }
    });

    // Add the shape to the container
    compassContainer.appendChild(shapeElement);
}

// Event listener for adding or erasing shapes
compassContainer.addEventListener('click', function (e) {
    if (shapeSelector.value === 'erase') {
        // If clicking on a shape while in "Erase" mode, remove the shape
        if (e.target !== compassContainer && e.target.classList.contains('shape')) {
            e.target.remove();  // Remove the clicked shape
            console.log('Shape removed!');  // Debugging: Log when a shape is removed
        }
        return;  // Exit after erasing
    }

    // Get the selected shape, color, and size for adding shapes
    const selectedShape = shapeSelector.value;
    const selectedColor = colorPicker.value;
    const selectedSize = sizeSlider.value;
    const positiveAdj = positiveAdjInput.value;
    const negativeAdj = negativeAdjInput.value;

    // Prevent creating shapes if 'erase' is selected or invalid shapes
    if (selectedShape === 'erase' || !['circle', 'plus', 'check', 'vr', 'vc', 'ar', 'ac', 'kr', 'kc', 'ad'].includes(selectedShape)) return;

    // Get the coordinates relative to the container
    const rect = compassContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create the shape at the clicked position if not in "Erase" mode
    createShape(x, y, selectedShape, selectedColor, selectedSize, positiveAdj, negativeAdj);
});

// Save the layout as an image (PNG)
document.getElementById('export-img-btn').addEventListener('click', function() {
    html2canvas(compassContainer, {
        useCORS: true, // Allows cross-origin images to be included
        scale: 2       // Higher scale for better resolution on export
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'compass-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// Save the layout as a PDF
document.getElementById('export-pdf-btn').addEventListener('click', function() {
    html2canvas(compassContainer, {
        useCORS: true, // Allows cross-origin images to be included
        scale: 2       // Higher scale for better resolution on export
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('compass-layout.pdf');
    });
});
