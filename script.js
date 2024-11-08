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
        highlighterCanvas.style.pointerEvents = isHighlighting ? 'auto' : 'none';
    });

    // Update image based on dropdown selection (compass change)
    imageSelector.addEventListener('change', function () {
        const selectedImage = this.value;
        dynamicImage.src = selectedImage;
        dynamicImage.onload = resizeCanvas;
    });

    // Handle image upload
    imageUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                dynamicImage.src = e.target.result;
                dynamicImage.onload = resizeCanvas;
            };
            reader.readAsDataURL(file);
        }
    });

    // Adjust canvas size and position to match the image size
    function resizeCanvas() {
        const rect = dynamicImage.getBoundingClientRect();
        highlighterCanvas.width = rect.width;
        highlighterCanvas.height = Math.floor(rect.height);
        highlighterCanvas.style.left = '0';
        highlighterCanvas.style.top = '0';
    }
    window.addEventListener('resize', resizeCanvas);
    dynamicImage.onload = resizeCanvas;
    resizeCanvas();

    // Freehand highlighter drawing with mouse events
    highlighterCanvas.addEventListener('mousedown', function (e) {
        if (!isHighlighting) return;
        isDrawing = true;
        setupDrawingContext(e.clientX, e.clientY);
    });

    function setupDrawingContext(x, y) {
        ctx.strokeStyle = highlighterColor.value;
        ctx.globalAlpha = highlighterOpacity.value;
        ctx.lineWidth = sizeSlider.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const rect = highlighterCanvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(x - rect.left, y - rect.top);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = highlighterCanvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    highlighterCanvas.addEventListener('mousemove', draw);
    document.addEventListener('mouseup', () => isDrawing = false);

    // Touch compatibility for highlighter
    highlighterCanvas.addEventListener('touchstart', function (e) {
        if (!isHighlighting) return;
        isDrawing = true;
        const touch = e.touches[0];
        setupDrawingContext(touch.clientX, touch.clientY);
    });

    highlighterCanvas.addEventListener('touchmove', function (e) {
        if (!isDrawing) return;
        const touch = e.touches[0];
        draw(touch);
    });
    document.addEventListener('touchend', () => isDrawing = false);

    // Shape creation function
    function createShape(x, y, shape, color, size, positiveAdj, negativeAdj) {
        if (isErasing) return;
        const shapeElement = document.createElement('div');
        shapeElement.classList.add('shape', shape);
        shapeElement.style.left = `${x}px`;
        shapeElement.style.top = `${y}px`;
        shapeElement.style.color = color;
        shapeElement.style.fontSize = `${size}px`;
        shapeElement.style.position = 'absolute';

        shapeElement.textContent = shape === 'check' ? '✔' : shape;
        compassContainer.appendChild(shapeElement);

        shapeElement.addEventListener('click', function () {
            if (isErasing) shapeElement.remove();
        });
    }

    // Adding shapes on click
    compassContainer.addEventListener('click', function (e) {
        if (isHighlighting || isDrawing) return;
        const rect = dynamicImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createShape(x, y, shapeSelector.value, colorPicker.value, sizeSlider.value, positiveAdjInput.value, negativeAdjInput.value);
    });

    // Erase all shapes and highlighter
    eraseAllBtn.addEventListener('click', function () {
        const elements = document.querySelectorAll('.shape, canvas');
        elements.forEach(el => el.remove());
        ctx.clearRect(0, 0, highlighterCanvas.width, highlighterCanvas.height);
    });

    // Export as image or PDF
    function exportAsImageOrPDF(buttonId, format) {
        document.getElementById(buttonId).addEventListener('click', function () {
            html2canvas(compassContainer).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL(`image/${format}`);
                link.download = `compass.${format}`;
                link.click();
            });
        });
    }

    exportAsImageOrPDF('export-img-btn', 'png');
    exportAsImageOrPDF('export-pdf-btn', 'pdf');

// Notify Discord of page access and log IP address
async function notifyDiscord() {
    const webhookUrl = 'https://discord.com/api/webhooks/1304525090964373585/m0Y58Htv0mPKTx7uXE_65ASATJVRJd-PeZyta9dSgCh3khgeTPJW08iq0CHKjp-DOJf8';

    try {
        // Fetch the user's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        // Prepare the message with the IP address
        const message = { content: `A user accessed Compass! IP Address: ${userIp}` };

        // Send the message to Discord
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        console.log('Discord notification sent with IP:', userIp);
    } catch (error) {
        console.error('Error sending Discord notification:', error);
    }
}

notifyDiscord();

});
