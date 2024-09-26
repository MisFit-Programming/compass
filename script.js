document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const compassContainer = document.getElementById('compass-area');
    const dynamicImage = document.getElementById('dynamic-image');
    const imageSelector = document.getElementById('image-selector');
    const imageUpload = document.getElementById('image-upload');
    const shapeSelector = document.getElementById('shape-selector');
    const colorPicker = document.getElementById('color-picker');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const positiveAdjInput = document.getElementById('positive-adj');
    const negativeAdjInput = document.getElementById('negative-adj');
    const notesBtoeInput = document.getElementById('notes-btoe');
    const eraseBtn = document.getElementById('erase-btn');
    const eraseAllBtn = document.getElementById('erase-all-btn');
    const highlighterToggle = document.getElementById('highlighter-toggle');
    const highlighterColor = document.getElementById('highlighter-color');
    const highlighterOpacity = document.getElementById('highlighter-size');
    const highlighterCanvas = document.createElement('canvas'); // Highlighter canvas

    let isErasing = false;
    let isHighlighting = false;
    let isDrawing = false;
    let ctx = highlighterCanvas.getContext('2d');

    // Add highlighter canvas to the container
    highlighterCanvas.style.position = 'absolute';
    highlighterCanvas.style.pointerEvents = 'none'; // Default: no interaction
    highlighterCanvas.style.zIndex = '10'; // Ensure the canvas is on top of the image
    compassContainer.appendChild(highlighterCanvas);

    // Log if canvas is added correctly
    console.log('Highlighter canvas added:', highlighterCanvas);

    // Update size value text when slider is moved
    sizeSlider.addEventListener('input', function () {
        sizeValue.textContent = sizeSlider.value;
    });

    // Highlighter mode toggle
    highlighterToggle.addEventListener('change', function () {
        isHighlighting = this.checked;
        highlighterCanvas.style.pointerEvents = isHighlighting ? 'auto' : 'none'; // Enable/disable highlighter drawing
        console.log('Highlighter mode:', isHighlighting);
    });

    // Update image based on dropdown selection (compass change)
imageSelector.addEventListener('change', function () {
    const selectedImage = this.value;
    dynamicImage.src = selectedImage; // Update the dynamic image src attribute
    
    // Ensure the canvas is resized and aligned after the image is switched
    dynamicImage.onload = function() {
        resizeCanvas(); // Resize the canvas once the image has loaded
    };
});

// Handle image upload
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dynamicImage.src = e.target.result; // Set the new image source as base64
            
            // Ensure the canvas is resized and aligned after the uploaded image is loaded
            dynamicImage.onload = function() {
                resizeCanvas(); // Resize the canvas once the image has loaded
            };
        };
        reader.readAsDataURL(file); // Convert the uploaded file to Data URL
    }
});

// Adjust canvas size and position to match the image size
function resizeCanvas() {
    const rect = dynamicImage.getBoundingClientRect(); // Get the dimensions of the image
    
    // Set the canvas to match the image size exactly
    highlighterCanvas.width = rect.width;
    highlighterCanvas.height = Math.floor(rect.height); // Ensure consistent height

    highlighterCanvas.style.left = '0';
    highlighterCanvas.style.top = '0';
    
    console.log('Canvas size:', highlighterCanvas.width, highlighterCanvas.height);
    console.log('Image size:', rect.width, Math.floor(rect.height));
}

    window.addEventListener('resize', resizeCanvas); // Adjust canvas on window resize
    dynamicImage.onload = resizeCanvas; // Adjust canvas after image loads
    resizeCanvas(); // Initial canvas size adjustment

    // Start freehand highlighter drawing
    highlighterCanvas.addEventListener('mousedown', function (e) {
        if (!isHighlighting) return;
        isDrawing = true;

        ctx.strokeStyle = highlighterColor.value;
        ctx.globalAlpha = highlighterOpacity.value;
        ctx.lineWidth = sizeSlider.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const rect = highlighterCanvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);


        function draw(e) {
            if (!isDrawing) return;
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        highlighterCanvas.addEventListener('mousemove', draw);

        document.addEventListener('mouseup', function stopDrawing() {
            isDrawing = false;
            highlighterCanvas.removeEventListener('mousemove', draw);
            document.removeEventListener('mouseup', stopDrawing);
        });
    });

    // Shape creation function
    function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
        if (isErasing || !['circle', 'plus', 'minus', 'equal', 'check', 'vr', 'vc', 'ar', 'ac', 'kr', 'kc', 'ad'].includes(shape)) {
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
            shapeElement.textContent = '-'; // New Minus Shape
            shapeElement.style.color = color;
            shapeElement.style.fontSize = `${size}px`;
        } else if (shape === 'equal') {
            shapeElement.textContent = '='; // New Equal Shape
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
            }
        });

        compassContainer.appendChild(shapeElement);
    }

    // Event listener for adding shapes
    compassContainer.addEventListener('click', function (e) {
        if (isHighlighting || isDrawing) return; // Skip shape creation if highlighting or drawing

        const rect = dynamicImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const selectedShape = shapeSelector.value;
        const selectedColor = colorPicker.value;
        const selectedSize = sizeSlider.value;
        const positiveAdj = positiveAdjInput.value;
        const negativeAdj = negativeAdjInput.value;
        createShape(x, y, selectedShape, selectedColor, selectedSize, positiveAdj, negativeAdj);
    });

    // Erase Button functionality (toggle erasing mode)
    eraseBtn.addEventListener('click', function () {
        isErasing = !isErasing;
        eraseBtn.textContent = isErasing ? 'Stop Erasing' : 'Erase';
    });

    // Erase All Button functionality
    eraseAllBtn.addEventListener('click', function () {
        const elements = document.querySelectorAll('.shape, canvas');
        elements.forEach(el => el.remove()); // Remove all shapes and highlights
        ctx.clearRect(0, 0, highlighterCanvas.width, highlighterCanvas.height); // Clear the canvas
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
        const notesText = document.createElement('div'); // New Notes/BToE text
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
    document.getElementById('export-img-btn').addEventListener('click', function () {
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
    document.getElementById('export-pdf-btn').addEventListener('click', function () {
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
});
