// Get canvas element and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for drawing and breathing
let isDrawing = false;
let outlineColor = 'grey';
let fillColor = 'transparent';
let isBreathing = false;
const dotRadius = 1; // Size of the dots
let currentRadius = 1; // Initial radius of the shape
const maxRadius = 3; // Maximum radius during breathing
const minRadius = 1; // Minimum radius during breathing

const breathDuration = 5000; // Duration of one breath cycle in milliseconds
let lastX = 0;
let lastY = 0;
let breathStart = 0;

// Variables for storing points of the drawn lines
const drawnLines = [];

// Function to start drawing
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.clientX, e.clientY];
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Reset the path to prevent continuous lines
}

// Function to draw
function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    // Store the points of the drawn line
    drawnLines.push({ x: lastX, y: lastY, toX: e.clientX, toY: e.clientY });

    [lastX, lastY] = [e.clientX, e.clientY];
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
// Function to animate crawling/growing along the drawn lines
function crawl(timestamp) {
    if (!isBreathing) return;

    if (!breathStart) {
        breathStart = timestamp;
    }

    // Calculate the overall progress of breathing
    const breathProgress = (timestamp - breathStart) % breathDuration;
    const breathingProgress = breathProgress / breathDuration;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the lines with changing colors and growing/shrinking thickness
    ctx.lineCap = 'round';
    
    let allFractionsTouched = true;

    for (let i = 0; i < peacefulColors.length; i++) {
        const colorIndex = Math.floor(i + (peacefulColors.length * breathingProgress)) % peacefulColors.length;
        const color = peacefulColors[colorIndex];
        ctx.strokeStyle = color;

        // Draw each previously drawn line
        for (const line of drawnLines) {
            const lineLength = Math.sqrt((line.toX - line.x) ** 2 + (line.toY - line.y) ** 2);

            // Calculate the line thickness for the current line segment
            const thickness = minRadius + (maxRadius - minRadius) * line.breathingProgress;

            // Set the line thickness
            ctx.lineWidth = thickness;

            // Calculate the position along the line
            if (line.currentPosition >= lineLength) {
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.toX, line.toY);
                ctx.stroke();
            } else {
                const progressRatio = line.currentPosition / lineLength;
                const x = line.x + (line.toX - line.x) * progressRatio;
                const y = line.y + (line.toY - line.y) * progressRatio;
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Update the current position and breathing progress for the line
                line.currentPosition = lineLength * breathingProgress;
                line.breathingProgress = breathingProgress;

                if (line.breathingProgress < 1) {
                    allFractionsTouched = false;
                }
            }
        }
    }

    // If all breathing fractions have touched (reached 1), make the lines shine
    if (allFractionsTouched) {
        for (const line of drawnLines) {
            const shineAlpha = 0.5 + 0.5 * Math.sin(breathProgress / 500); // Adjust the speed of pulsing
            ctx.strokeStyle = `rgba(${hexToRgb(ctx.strokeStyle)}, ${shineAlpha})`;

            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.toX, line.toY);
            ctx.stroke();
        }
    } else {
        // Request the next animation frame
        animationFrame = requestAnimationFrame(crawl);
    }
}

// ...

// Function to animate crawling/growing along the drawn lines
function crawl(timestamp) {
    if (!isBreathing)
    {
        return;
    }

    if (!breathStart) {
        breathStart = timestamp;
    }

    // Calculate the overall progress of breathing
    const breathProgress = (timestamp - breathStart) % breathDuration;
    const breathingProgress = breathProgress / breathDuration;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the lines with changing colors and growing/shrinking thickness
    ctx.lineCap = 'round';
    for (let i = 0; i < peacefulColors.length; i++) {
        const colorIndex = Math.floor(i + (peacefulColors.length * breathingProgress)) % peacefulColors.length;
        const color = peacefulColors[colorIndex];
        ctx.strokeStyle = color;

        // Draw each previously drawn line
        for (const line of drawnLines) {
            const lineLength = Math.sqrt((line.toX - line.x) ** 2 + (line.toY - line.y) ** 2);

            // Calculate the line thickness for the current line segment
            const thickness = minRadius + (maxRadius - minRadius) * line.breathingProgress;

            // Set the line thickness
            ctx.lineWidth = thickness;

            // Calculate the position along the line
            if (line.currentPosition >= lineLength) {
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.toX, line.toY);
                ctx.stroke();
            } else {
                const progressRatio = line.currentPosition / lineLength;
                const x = line.x + (line.toX - line.x) * progressRatio;
                const y = line.y + (line.toY - line.y) * progressRatio;
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            // Update the current position and breathing progress for the line
            line.currentPosition = lineLength * breathingProgress;
            line.breathingProgress = breathingProgress;
        }
    }

    // Request the next animation frame
    animationFrame = requestAnimationFrame(crawl);
}

// Define an array of peaceful colors
const peacefulColors = ['#64a6bd'];
// '#a4c2f4', '#c2e2f4', '#f4e2e2', '#f4a4a4','#f4e2e2','#c2e2f4', '#a4c2f4','#64a6bd'];
// Get the audio element
const backgroundMusic = document.getElementById('backgroundMusic');

// Function to play the background music
function playBackgroundMusic() {
    backgroundMusic.play();
}

// Function to pause the background music
function pauseBackgroundMusic() {
    backgroundMusic.pause();
}

// Function to check if the background music is playing
function isBackgroundMusicPlaying() {
    return !backgroundMusic.paused;
}

// Function to toggle the background music
function toggleBackgroundMusic() {
    if (isBackgroundMusicPlaying()) {
        pauseBackgroundMusic();
    } else {
        playBackgroundMusic();
    }
}

// Call the playBackgroundMusic() function to start playing the music when needed
// For example, you can call it when the page loads or when a button is clicked.

// Event listener for "Breathe" button
const breatheButton = document.getElementById('breatheButton');
breatheButton.addEventListener('click', () => {
    if (!isBreathing) {
        isBreathing = true;
        breathStart = 0; // Reset the breath start time

        // Initialize breathing progress and current position for each line
        for (const line of drawnLines) {
            line.currentPosition = 0;
            line.breathingProgress = 0;
        }

        requestAnimationFrame(crawl); // Start the animation loop
    } else {
        isBreathing = false;
        cancelAnimationFrame(animationFrame);
    }
    playBackgroundMusic() 
});

// Get the draw button element by its ID
const drawButton = document.getElementById('drawButton');

// Add an event listener to the draw button
drawButton.addEventListener('click', function () {
    // Reload the page when the draw button is clicked
    location.reload();
});


