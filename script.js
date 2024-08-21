// LAST UPDATED: AUG 21 @ 13:18 UTC

// Constants
const DECAY_CONSTANT = 0.3466; // hardcoded decay constant
const LUNG_CAPACITY = 10; // hardcoded lung capacity
const STRAIN_FACTOR = 1.3; // hardcoded strain factor for Candyland/Kandyland
const THC_CONCENTRATION = 0.20; // hardcoded THC concentration (20%)
const CUMULATIVE_HIGH_LEVEL_FACTOR = 1426.2893370607;

// Function to calculate BMI
function calculateBMI(weight, height) {
    const weightInKg = weight * 0.45359237;
    const heightInMeters = ((height * 0.0254) * 12) / 12; // convert height to meters
    return weightInKg / (heightInMeters ** 2);
}

// Function to calculate the cumulative high level
function calculateCumulativeHighLevel(volume, bodyWeight, sex, hrt, height, age, inhalationTime) {
    try {
        if (volume <= 0 || bodyWeight <= 0 || height <= 0 || age <= 0 || inhalationTime <= 0) {
            throw new Error('All input values must be positive numbers.');
        }
        let bmi = calculateBMI(bodyWeight, (parseInt($('#height_ft').val()) * 12) + parseInt($('#height_in').val()));
        let thcAmount = (volume * THC_CONCENTRATION * STRAIN_FACTOR) / (bodyWeight * LUNG_CAPACITY);
        let cumulativeHighLevel = thcAmount * (1 - Math.exp(-DECAY_CONSTANT * inhalationTime)) * CUMULATIVE_HIGH_LEVEL_FACTOR;
        return cumulativeHighLevel;
    } catch (error) {
        alert('Error calculating cumulative high level: ' + error.message);
        return 0;
    }
}

// Event listener for form submission
$('#calc-form').submit(function(event) {
    event.preventDefault();

    let volume = parseFloat($('#volume').val());
    let bodyWeight = parseFloat($('#body_weight').val());
    let sex = $('#sex').val();
    let hrt = $('#hrt').val();
    let height = (parseInt($('#height_ft').val()) * 12) + parseInt($('#height_in').val());
    let age = parseFloat($('#age').val());
    let inhalationTime = parseFloat($('#inhalation_time').val());

    if (isNaN(volume) || isNaN(bodyWeight) || isNaN(inhalationTime)) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    let cumulativeHighLevel = calculateCumulativeHighLevel(volume, bodyWeight, sex, hrt, height, age, inhalationTime);

    // Retrieve previous cumulative high level from localStorage
    let previousHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
    cumulativeHighLevel += previousHighLevel;

    // Update the result on the page
    $('#cumulative_high_level').text(`Cumulative High Level: ${cumulativeHighLevel.toFixed(2)}`);

    // Store the updated cumulative high level in localStorage
    localStorage.setItem('cumulative_high_level', cumulativeHighLevel);
});

// Function to clear history
function clearHistory() {
    localStorage.removeItem('cumulative_high_level');
    $('#cumulative_high_level').text('Cumulative High Level: 0');
}

// Initialize the cumulative high level on page load
$(window).on('load', function() {
    let storedHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
    $('#cumulative_high_level').text(`Cumulative High Level: ${storedHighLevel.toFixed(2)}`);
});
