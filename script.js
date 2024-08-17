// Constants
const DECAY_CONSTANT = 0.3466; // hardcoded decay constant
const LUNG_CAPACITY = 10; // hardcoded lung capacity
const STRAIN_FACTOR = 0.85; // hardcoded strain factor for Candyland/Kandyland
const CUMULATIVE_HIGH_LEVEL_FACTOR = 1426.2893370607;

// Function to calculate the cumulative high level
function calculateCumulativeHighLevel(volume, thcConcentration, bodyWeight, inhalationTime) {
    try {
        let thcAmount = (volume * thcConcentration * STRAIN_FACTOR) / (bodyWeight * LUNG_CAPACITY);
        let cumulativeHighLevel = thcAmount * (1 - Math.exp(-DECAY_CONSTANT * inhalationTime)) * CUMULATIVE_HIGH_LEVEL_FACTOR;
        return cumulativeHighLevel;
    } catch (error) {
        console.error('Error calculating cumulative high level:', error);
        return 0;
    }
}

// Event listener for form submission
document.getElementById('calc-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let volume = parseFloat(document.getElementById('volume').value);
    let thcConcentration = parseFloat(document.getElementById('thc_concentration').value);
    let bodyWeight = parseFloat(document.getElementById('body_weight').value);
    let inhalationTime = parseFloat(document.getElementById('inhalation_time').value);

    if (isNaN(volume) || isNaN(thcConcentration) || isNaN(bodyWeight) || isNaN(inhalationTime)) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    let cumulativeHighLevel = calculateCumulativeHighLevel(volume, thcConcentration, bodyWeight, inhalationTime);

    // Retrieve previous cumulative high level from localStorage
    let previousHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
    cumulativeHighLevel += previousHighLevel;

    // Update the result on the page
    document.getElementById('cumulative_high_level').textContent = `Cumulative High Level: ${cumulativeHighLevel.toFixed(2)}`;

    // Store the updated cumulative high level in localStorage
    localStorage.setItem('cumulative_high_level', cumulativeHighLevel);
});

// Function to clear history
function clearHistory() {
    localStorage.removeItem('cumulative_high_level');
    document.getElementById('cumulative_high_level').textContent = 'Cumulative High Level: 0';
}

// Initialize the cumulative high level on page load
window.onload = function() {
    let storedHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
    document.getElementById('cumulative_high_level').textContent = `Cumulative High Level: ${storedHighLevel.toFixed(2)}`;
};
