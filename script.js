function calculateHighLevel() {
    // Constants
    const lungCapacity = 6;  // Average lung capacity in liters
    const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
    const standardTime = 5;  // Standard time in seconds

    // Fetch user inputs
    const volume = parseFloat(document.getElementById('volume').value);
    const thcConcentration = parseFloat(document.getElementById('thcConcentration').value);
    const inhalationTime = parseFloat(document.getElementById('inhalationTime').value);
    const strain = document.getElementById('strain').value.toLowerCase();
    const frequency = document.getElementById('frequency').value.toLowerCase();
    const bodyWeight = parseFloat(document.getElementById('bodyWeight').value);
    const timeSinceSmoking = parseFloat(document.getElementById('timeSinceSmoking').value);

    // Validate inputs (optional)

    // Determine strain factor
    let strainFactor;
    switch (strain) {
        case 'sativa':
            strainFactor = 1.1;
            break;
        case 'indica':
            strainFactor = 0.9;  // Adjust as necessary
            break;
        case 'hybrid':
            strainFactor = 1.0;  // Adjust based on hybrid ratio
            break;
        default:
            alert("Invalid strain type. Please enter 'sativa', 'indica', or 'hybrid'.");
            return;
    }

    // Determine frequency factor
    let frequencyFactor;
    switch (frequency) {
        case 'daily':
            frequencyFactor = 1.5;
            break;
        case 'weekly':
            frequencyFactor = 1.0;  // Adjust as necessary
            break;
        case 'monthly':
            frequencyFactor = 0.5;  // Adjust as necessary
            break;
        default:
            alert("Invalid frequency type. Please enter 'daily', 'weekly', or 'monthly'.");
            return;
    }

    // Calculate decay factor
    const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours
    const decayFactor = Math.exp(-decayConstant * timeSinceSmoking);

    // Calculate weight ratio
    const standardWeight = 70;  // Average weight in kg
    const weightRatio = standardWeight / bodyWeight;

    // Calculate high level
    const highLevel = (volume / lungCapacity)
                    * (thcConcentration / baselineTHC)
                    * (inhalationTime / standardTime)
                    * strainFactor
                    * weightRatio
                    * frequencyFactor
                    * decayFactor;

    // Normalize to 0-100 scale
    const maxHighLevel = 8;  // Maximum theoretical high level as calculated earlier
    const normalizedHighLevel = (highLevel / maxHighLevel) * 100;

    // Display result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="alert alert-success" role="alert">
            The estimated high level is: ${normalizedHighLevel.toFixed(2)} out of 100
        </div>`;
}