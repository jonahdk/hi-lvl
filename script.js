// LAST UPDATED: AUG 21 @ 14:22 UTC

const lungCapacity = 10;
const strainFactor = 1.3;
const thcConcentration = 0.20;
const normalizationFactor = 1426.2893370607;
const estrogenMultiplier = 1.5;

const decayConstant = Math.log(2) / (2 * 60 * 60);

function calculateBMI(weight, height) {
    const weightInKg = weight * 0.45359237;
    const heightInMeters = ((height * 0.0254) * 12) / 12;
    return weightInKg / (heightInMeters ** 2);
}

function calculateCumulativeHighLevel(volume, bmi, sex, hrt, inhalationTime) {
    try {
        if (volume <= 0 || bmi <= 0 || inhalationTime <= 0) {
            throw new Error('All input values must be positive numbers.');
        }
        let thcAmount = (volume * thcConcentration * strainFactor) / (bmi * lungCapacity);
        let cumulativeHighLevel = thcAmount * (1 - Math.exp(-decayConstant * inhalationTime)) * normalizationFactor;

        if ((sex === 'female' && hrt === 'no') || (sex === 'male' && hrt === 'yes')) {
            cumulativeHighLevel *= estrogenMultiplier;
        }

        return cumulativeHighLevel;
    } catch (error) {
        alert('Error calculating cumulative high level: ' + error.message);
        return 0;
    }
}

function applyDecay(cumulativeHighLevel, timeElapsed) {
    return cumulativeHighLevel * Math.exp(-decayConstant * timeElapsed);
}

$(document).ready(function() {
    let lastCalculationTime = null;

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

        let bmi = calculateBMI(bodyWeight, height);
        let cumulativeHighLevel = calculateCumulativeHighLevel(volume, bmi, sex, hrt, inhalationTime);

        let previousHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
        cumulativeHighLevel += previousHighLevel;

        lastCalculationTime = new Date().getTime() / 1000;

        $('#cumulative_high_level').text(`Cumulative High Level: ${cumulativeHighLevel.toFixed(2)}`);

        localStorage.setItem('cumulative_high_level', cumulativeHighLevel);
    });

    $('#recalculate-button').on('click', function() {
        let storedHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
        let currentTime = new Date().getTime() / 1000;
        let timeElapsed = currentTime - lastCalculationTime;

        if (lastCalculationTime === null) {
            alert('Please calculate the cumulative high level first.');
            return;
        }

        let newHighLevel = applyDecay(storedHighLevel, timeElapsed);

        $('#cumulative_high_level').text(`Cumulative High Level: ${newHighLevel.toFixed(2)}`);

        localStorage.setItem('cumulative_high_level', newHighLevel);
    });

    function clearHistory() {
        localStorage.removeItem('cumulative_high_level');
        $('#cumulative_high_level').text('Cumulative High Level: 0');
    }

    $(window).on('load', function() {
        let storedHighLevel = parseFloat(localStorage.getItem('cumulative_high_level')) || 0;
        $('#cumulative_high_level').text(`Cumulative High Level: ${storedHighLevel.toFixed(2)}`);
    });
});
