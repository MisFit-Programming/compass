document.addEventListener('DOMContentLoaded', function() {
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
    const notesBtoeInput = document.getElementById('notes-btoe');
    const eraseBtn = document.getElementById('erase-btn');
    const eraseAllBtn = document.getElementById('erase-all-btn');

    // Check if elements are present
    if (!compassContainer) console.error('compass-area element not found');
    if (!imageSelector) console.error('image-selector element not found');
    if (!imageUpload) console.error('image-upload element not found');
    if (!dynamicImage) console.error('dynamic-image element not found');
    if (!shapeSelector) console.error('shape-selector element not found');
    if (!colorPicker) console.error('color-picker element not found');
    if (!sizeSlider) console.error('size-slider element not found');
    if (!sizeValue) console.error('size-value element not found');
    if (!positiveAdjInput) console.error('positive-adj element not found');
    if (!negativeAdjInput) console.error('negative-adj element not found');
    if (!notesBtoeInput) console.error('notes-btoe element not found');
    if (!eraseBtn) console.error('erase-btn element not found');
    if (!eraseAllBtn) console.error('erase-all-btn element not found');

    // Only proceed if all elements are present
    if (
        compassContainer &&
        imageSelector &&
        imageUpload &&
        dynamicImage &&
        shapeSelector &&
        colorPicker &&
        sizeSlider &&
        sizeValue &&
        positiveAdjInput &&
        negativeAdjInput &&
        notesBtoeInput &&
        eraseBtn &&
        eraseAllBtn
    ) {
        let isErasing = false; // State for erasing mode

        // Update size value text when slider is moved
        sizeSlider.addEventListener('input', function () {
            sizeValue.textContent = sizeSlider.value;
        });

        // Update image based on dropdown selection (compass change)
        imageSelector.addEventListener('change', function () {
            const selectedImage = this.value;
            dynamicImage.src = selectedImage; // Update the dynamic image src attribute
        });

        // Handle image upload
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    dynamicImage.src = e.target.result; // Set the new image source as base64
                };
                reader.readAsDataURL(file); // Convert the uploaded file to Data URL
            }
        });

        // Function to create shapes
        function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
            console.log(`Creating shape: ${shape}, at position (${x}, ${y})`);

            if (isErasing || !['circle', 'plus', 'minus', 'equal', 'check', 'vr', 'vc', 'ar', 'ac', 'kr', 'kc', 'ad'].includes(shape)) {
                console.log('Invalid shape or in erasing mode');
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
            } else if (shape === 'plus') {
                shapeElement.textContent = '+';
                shapeElement.style.color = color;
                shapeElement.style.fontSize = `${size}px`;
            } else if (shape === 'minus') {
                shapeElement.textContent = '-';
                shapeElement.style.color = color;
                shapeElement.style.fontSize = `${size}px`;
            } else if (shape === 'equal') {
                shapeElement.textContent = '=';
                shapeElement.style.color = color;
                shapeElement.style.fontSize = `${size}px`;
            } else {
                shapeElement.textContent = shape === 'check' ? '✔' : shape.toUpperCase();
                shapeElement.style.color = color;
                shapeElement.style.fontSize = `${size}px`;
            }

            shapeElement.title = `Positive Adj: ${positiveAdj}, Negative Adj: ${negativeAdj}`;

            shapeElement.addEventListener('click', function () {
                if (isErasing) {
                    shapeElement.remove(); // Remove shape if in erasing mode
                    console.log('Shape removed');
                }
            });

            compassContainer.appendChild(shapeElement);
        }

        // Event listener for adding shapes
        compassContainer.addEventListener('click', function (e) {
            if (isErasing) {
                console.log('In erasing mode, skipping shape creation');
                return;
            }

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

        // Erase Button functionality (toggle erasing mode)
        eraseBtn.addEventListener('click', function () {
            isErasing = !isErasing; // Toggle erasing mode
            eraseBtn.textContent = isErasing ? 'Stop Erasing' : 'Erase'; // Update button text
            console.log('Erasing mode:', isErasing);
        });

        // Erase All Button functionality
        eraseAllBtn.addEventListener('click', function () {
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => shape.remove()); // Remove all shapes
            console.log('All shapes removed');
        });

        // Helper function to append text areas to the bottom of the compass container
        function appendTextToBottom() {
            const containerWidth = compassContainer.offsetWidth;

            // Append Positive Adj
            const posText = document.createElement('div');
            posText.textContent = `Positive Adj:\n${positiveAdjInput.value}`;
            posText.style.width = `${containerWidth}px`;
            posText.style.textAlign = 'left';
            posText.style.padding = '10px';
            posText.style.color = '#ff0000';
            posText.style.fontSize = '16px';
            posText.style.whiteSpace = 'pre-wrap'; // Handle new lines and white spaces correctly
            posText.classList.add('text-on-canvas');

            // Append Negative Adj
            const negText = document.createElement('div');
            negText.textContent = `Negative Adj:\n${negativeAdjInput.value}`;
            negText.style.width = `${containerWidth}px`;
            negText.style.textAlign = 'left';
            negText.style.padding = '10px';
            negText.style.color = '#ff0000';
            negText.style.fontSize = '16px';
            negText.style.whiteSpace = 'pre-wrap'; // Handle new lines and white spaces correctly
            negText.classList.add('text-on-canvas');

            // Append Notes / BToE
            const notesText = document.createElement('div');
            notesText.textContent = `Notes / BToE:\n${notesBtoeInput.value}`;
            notesText.style.width = `${containerWidth}px`;
            notesText.style.textAlign = 'left';
            notesText.style.padding = '10px';
            notesText.style.color = '#ff0000';
            notesText.style.fontSize = '16px';
            notesText.style.whiteSpace = 'pre-wrap'; // Handle new lines and white spaces correctly
            notesText.classList.add('text-on-canvas');

            const textContainer = document.createElement('div');
            textContainer.style.width = '100%';
            textContainer.style.marginTop = '10px';
            textContainer.style.borderTop = '2px solid #ff0000';  // Add a border to separate the text
            textContainer.appendChild(posText);
            textContainer.appendChild(negText);
            textContainer.appendChild(notesText);  // Add the Notes/BToE to the text container

            compassContainer.appendChild(textContainer);
        }

        // Helper function to remove the appended text after export
        function removeTextFromCompass() {
            document.querySelectorAll('.text-on-canvas').forEach(el => el.remove());
        }

        // Save the layout as an image (PNG)
        document.getElementById('export-img-btn').addEventListener('click', function() {
            appendTextToBottom();  // Add text to the bottom of the canvas

            html2canvas(compassContainer, { useCORS: true, scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'compass-image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();

                removeTextFromCompass();  // Remove text after export
            });
        });

        // Save the layout as a PDF
        document.getElementById('export-pdf-btn').addEventListener('click', function() {
            appendTextToBottom();  // Add text to the bottom of the canvas

            html2canvas(compassContainer, { useCORS: true, scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('portrait', 'mm', 'a4');
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('compass-layout.pdf');

                removeTextFromCompass();  // Remove text after export
            });
        });
    }
});
