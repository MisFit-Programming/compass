// Get DOM elements
const compassContainer = document.getElementById('compass-area');
const imageSelector = document.getElementById('image-selector');
const imageUpload = document.getElementById('image-upload');
const dynamicImage = document.getElementById('dynamic-image');
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

// Update image based on dropdown selection (compass change)
imageSelector.addEventListener('change', function () {
    const selectedImage = this.value;
    dynamicImage.src = selectedImage; // Update the dynamic image src attribute
    console.log(`Image updated to: ${selectedImage}`); // Log the image change for debugging
});

// Handle image upload
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dynamicImage.src = e.target.result; // Set the new image source as base64
            console.log('Uploaded image updated successfully'); // Log the success of the upload
        };
        reader.readAsDataURL(file); // Convert the uploaded file to Data URL
    }
});

// Shape creation function
function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
    if (shape === 'erase' || !['circle', 'plus', 'check', 'vr', 'vc', 'ar', 'ac', 'kr', 'kc', 'ad'].includes(shape)) {
        return;
    }

    const shapeElement = document.createElement('div');
    shapeElement.classList.add('shape', shape);
    shapeElement.style.left = `${x}px`;
    shapeElement.style.top = `${y}px`;
    shapeElement.style.position = 'absolute';
    shapeElement.style.display = 'flex';
    shapeElement.style.justifyContent = 'center';
    shapeElement.style.alignItems = 'center';

    if (shape === 'circle') {
        shapeElement.style.width = `${size}px`;
        shapeElement.style.height = `${size}px`;
        shapeElement.style.backgroundColor = color;
        shapeElement.style.borderRadius = '50%';
    } else {
        shapeElement.textContent = shape === 'plus' ? '+' : shape === 'check' ? '✔' : shape.toUpperCase();
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`;
    }

    shapeElement.title = `Positive Adj: ${positiveAdj}, Negative Adj: ${negativeAdj}`;

    shapeElement.addEventListener('click', function (e) {
        if (shapeSelector.value === 'erase') {
            shapeElement.remove();
        }
    });

    compassContainer.appendChild(shapeElement);
}

// Event listener for adding shapes
compassContainer.addEventListener('click', function (e) {
    if (shapeSelector.value === 'erase') return;

    const selectedShape = shapeSelector.value;
    const selectedColor = colorPicker.value;
    const selectedSize = sizeSlider.value;
    const positiveAdj = positiveAdjInput.value;
    const negativeAdj = negativeAdjInput.value;

    const rect = compassContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createShape(x, y, selectedShape, selectedColor, selectedSize, positiveAdj, negativeAdj);
});

// Save the layout as an image (PNG)
document.getElementById('export-img-btn').addEventListener('click', function() {
    html2canvas(compassContainer, { useCORS: true, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'compass-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// Save the layout as a PDF
document.getElementById('export-pdf-btn').addEventListener('click', function() {
    html2canvas(compassContainer, { useCORS: true, scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('compass-layout.pdf');
    });
});
