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

    // Update size value text when slider is moved
    sizeSlider.addEventListener('input', function () {
        sizeValue.textContent = sizeSlider.value;
    });

    // Highlighter mode toggle
    highlighterToggle.addEventListener('change', function () {
        isHighlighting = this.checked;
        highlighterCanvas.style.pointerEvents = isHighlighting ? 'auto' : 'none'; // Enable/disable highlighter drawing
    });

    // Update image based on dropdown selection (compass change)
    imageSelector.addEventListener('change', function () {
        const selectedImage = this.value;
        dynamicImage.src = selectedImage; // Update the dynamic image src attribute
        
        dynamicImage.onload = function() {
            resizeCanvas(); // Resize the canvas after image switch
        };
    });

    // Handle image upload
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                dynamicImage.src = e.target.result; // Set the new image source as base64

                dynamicImage.onload = function() {
                    resizeCanvas(); // Resize the canvas after image upload
                };
            };
            reader.readAsDataURL(file); // Convert the uploaded file to Data URL
        }
    });

    // Resize the canvas to match the image size
    function resizeCanvas() {
        const rect = dynamicImage.getBoundingClientRect(); // Get the dimensions of the image
        highlighterCanvas.width = rect.width;
        highlighterCanvas.height = Math.floor(rect.height); // Ensure consistent height
        highlighterCanvas.style.left = `${rect.left}px`;
        highlighterCanvas.style.top = `${rect.top}px`;

        // Ensure clearing old drawings
        ctx.clearRect(0, 0, highlighterCanvas.width, highlighterCanvas.height);
    }

    window.addEventListener('resize', resizeCanvas); // Adjust canvas on window resize
    dynamicImage.onload = resizeCanvas; // Adjust canvas after image loads
    resizeCanvas(); // Initial canvas size adjustment

    // Start freehand highlighter drawing
    function startDrawing(x, y) {
        ctx.strokeStyle = highlighterColor.value;
        ctx.globalAlpha = highlighterOpacity.value;
        ctx.lineWidth = sizeSlider.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function drawLine(x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Mouse event listeners for highlighter
    highlighterCanvas.addEventListener('mousedown', function (e) {
        if (!isHighlighting) return;
        isDrawing = true;

        const rect = highlighterCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        startDrawing(x, y);

        function drawMouse(e) {
            if (!isDrawing) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            drawLine(x, y);
        }

        highlighterCanvas.addEventListener('mousemove', drawMouse);
        document.addEventListener('mouseup', function stopMouseDraw() {
            stopDrawing();
            highlighterCanvas.removeEventListener('mousemove', drawMouse);
            document.removeEventListener('mouseup', stopMouseDraw);
        });
    });

    // Touch event listeners for mobile support
    highlighterCanvas.addEventListener('touchstart', function (e) {
        if (!isHighlighting) return;
        const touch = e.touches[0];
        const rect = highlighterCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        startDrawing(x, y);
        isDrawing = true;

        function drawTouch(e) {
            if (!isDrawing) return;
            const touchMove = e.touches[0];
            const xMove = touchMove.clientX - rect.left;
            const yMove = touchMove.clientY - rect.top;
            drawLine(xMove, yMove);
        }

        highlighterCanvas.addEventListener('touchmove', drawTouch);
        document.addEventListener('touchend', function stopTouchDraw() {
            stopDrawing();
            highlighterCanvas.removeEventListener('touchmove', drawTouch);
            document.removeEventListener('touchend', stopTouchDraw);
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

    // Export and text appending functions here...

});
