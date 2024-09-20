// Get the compass container element
const compassContainer = document.querySelector('.compass-container');

// Add click event listener to the container
compassContainer.addEventListener('click', function (e) {
    // Check if we clicked on an existing circle
    if (e.target.classList.contains('circle')) {
        e.target.remove(); // Remove circle if clicked on
        return;
    }

    // Create a new red circle
    const circle = document.createElement('div');
    circle.classList.add('circle');

    // Set the position of the circle based on the click location
    const rect = compassContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    // Append the circle to the container
    compassContainer.appendChild(circle);
});
