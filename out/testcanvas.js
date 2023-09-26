// Testing canvas ??
// Za plotting graf
// let data = [16, 68, 20, 30, 54];
// let labels = ["JAN","FEB","MAR","APR","MAY"];
// c.fillStyle = "white";
// c.fillRect(0, 0, 500, 500);
// //draw the data
// c.fillStyle = "blue";
// for (let i = 0; i < data.length; i++) {
//     const point = data[i];
//     c.fillRect(40 + i * 100, 460 - point * 5, 50, point * 5);
// }
// //axis
// c.fillStyle = "black";
// c.lineWidth = 2;
// c.beginPath();
// c.moveTo(30, 10);
// c.lineTo(30, 460);
// c.lineTo(490, 460);
// c.stroke();
// for (let i = 0; i < 6; i++) {
//     c.fillText((5 - i) * 20 + "", 4, i * 80 + 60);
//     c.beginPath(); 
//     c.moveTo(25, i * 80 + 60); 
//     c.lineTo(30, i * 80 + 60); 
//     c.stroke();
// }
// for (let i = 0; i < 5; i++) {
//     c.fillText(labels[i], 50 + i*100, 475);
// }
// Define ART-1 parameters
const numInputs = 4; // Number of input nodes
const numCategories = 5; // Number of categories
const vigilanceParameter = 0.5; // Vigilance parameter (0-1)
// Initialize weights and category memory
const weights = [];
const categoryMemory = [];
// Initialize the weights randomly
for (let i = 0; i < numCategories; i++) {
    weights[i] = new Array(numInputs);
    for (let j = 0; j < numInputs; j++) {
        weights[i][j] = Math.random(); // Initialize with random values between 0 and 1
    }
}
// Define a function to calculate the Euclidean distance between two vectors
function euclideanDistance(input, weight) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        sum += Math.pow(input[i] - weight[i], 2);
    }
    return Math.sqrt(sum);
}
// Define the ART-1 algorithm
function art1(input) {
    // Compute the vigilance test
    const inputNorm = Math.sqrt(input.reduce((acc, val) => acc + Math.pow(val, 2), 0));
    const categoryResponses = [];
    for (let i = 0; i < numCategories; i++) {
        const weightNorm = Math.sqrt(weights[i].reduce((acc, val) => acc + Math.pow(val, 2), 0));
        const response = input.reduce((acc, val, j) => acc + val * weights[i][j], 0) / (inputNorm * weightNorm);
        categoryResponses[i] = response;
    }
    // Find the category with the highest response
    const maxResponseIndex = categoryResponses.indexOf(Math.max(...categoryResponses));
    // Check if the winner meets the vigilance criterion
    if (categoryResponses[maxResponseIndex] >= vigilanceParameter) {
        // Winner category found
        // Update the weights of the winning category
        for (let i = 0; i < numInputs; i++) {
            weights[maxResponseIndex][i] = input[i];
        }
        return maxResponseIndex;
    }
    else {
        // No winner category found
        return undefined;
    }
}
// Example input vector
const inputVector = [0.2, 0.4, 0.1, 0.5];
// Run the ART-1 algorithm with the input vector
const winnerCategory = art1(inputVector);
if (winnerCategory !== undefined) {
    console.log(`Input vector belongs to category ${winnerCategory}`);
}
else {
    console.log(`No category found for the input vector`);
}
// Define canvas properties
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const categoryColors = ["red", "green", "blue", "orange", "purple"];
const animationSpeed = 500; // Speed of animation (milliseconds)
// Initialize the canvas visualization
function initializeCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Draw category labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    for (let i = 0; i < numCategories; i++) {
        const labelX = 30 + i * 80; // Adjust the X position for labels
        const labelY = 20;
        ctx.fillText(`${i}`, labelX, labelY);
        const categoryColor = categoryColors[i];
        ctx.fillStyle = categoryColor;
        ctx.fillRect(labelX - 20, labelY - 15, 15, 15); // Adjust the X and Y positions for rectangles
        ctx.fillStyle = "black";
    }
}
// Define the rectangular area
const area = {
    xMin: 2,
    xMax: 5,
    yMin: 2,
    yMax: 5,
};
// Function to determine if a point is inside the area
function isInsideArea(x, y) {
    return x >= area.xMin && x <= area.xMax && y >= area.yMin && y <= area.yMax;
}
// Example points (x, y coordinates)
const points = [
    { x: 3, y: 4 },
    { x: 1, y: 2 },
    { x: 4, y: 6 },
    { x: 5, y: 3 },
    { x: 1, y: 1 },
    { x: 3, y: 4 },
    { x: 2, y: 5 },
    { x: 1, y: 5 },
    { x: 5, y: 5 },
];
// Check if each point is inside the area and log the result
points.forEach((point, index) => {
    const result = isInsideArea(point.x, point.y);
    console.log(`Point ${index + 1} (${point.x}, ${point.y}) is inside the area: ${result}`);
});
// Function to execute the ART-1 algorithm and update the canvas
function updateCanvas(input, isInside) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Draw category labels
    initializeCanvas();
    // Highlight the winning category (inside/outside) with the respective color
    ctx.fillStyle = isInside ? "green" : "red";
    // Draw a rectangle next to the text to indicate the result
    ctx.fillRect(150, canvasHeight - 25, 15, 15);
    // Draw the input point
    ctx.fillStyle = "gray";
    ctx.font = "14px Arial";
    ctx.fillText(`Point (${input.x}, ${input.y})`, 10, canvasHeight - 10);
}
// Function to execute the ART-1 algorithm and update the canvas
function processInput(input) {
    const isInside = isInsideArea(input.x, input.y);
    // Update the canvas visualization with the result
    updateCanvas(input, isInside);
    // Log the result to the console
    console.log(`Point (${input.x}, ${input.y}) is inside the area: ${isInside}`);
}
// Start the animation
let currentStep = 0;
function animateNextStep() {
    if (currentStep < points.length) {
        const inputPoint = points[currentStep];
        // Process the input point and update the canvas
        processInput(inputPoint);
        // Increment the step
        currentStep++;
        // Schedule the next animation frame
        setTimeout(animateNextStep, animationSpeed);
    }
}
// Initialize the canvas visualization
initializeCanvas();
// Start the animation
animateNextStep();
//# sourceMappingURL=testcanvas.js.map