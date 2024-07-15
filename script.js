function calculateHighLevel() {
    // Constants
    const lungCapacity = 6;  // Average lung capacity in liters
    const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
    const standardTime = 5;  // Standard time in seconds
    const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours

    // Fetch user inputs
    const volume = parseFloat(document.getElementById('volume').value);
    const thcConcentrationPercentage = parseFloat(document.getElementById('thcConcentration').value);
    const inhalationTime = parseFloat(document.getElementById('inhalationTime').value);
    const strain = document.getElementById('strain').value.toLowerCase();
    const frequency = document.getElementById('frequency').value.toLowerCase();
    const bodyWeight = parseFloat(document.getElementById('bodyWeight').value);
    const timeSinceSmoking = parseFloat(document.getElementById('timeSinceSmoking').value);

    // Convert THC concentration from percentage to decimal
    const thcConcentration = thcConcentrationPercentage / 100.0;

    // Validate strain and frequency
    let strainFactor;
    if (strain === "sativa") {
        strainFactor = 1.0;
    } else if (strain === "indica") {
        strainFactor = 2.0;
    } else if (strain === "hybrid") {
        strainFactor = 1.5;
    } else {
        alert("Invalid strain type. Please enter 'sativa', 'indica', or 'hybrid'.");
        return;
    }

    let frequencyFactor;
    if (frequency === "daily") {
        frequencyFactor = 1.5;
    } else if (frequency === "weekly") {
        frequencyFactor = 1.2;
    } else if (frequency === "monthly") {
        frequencyFactor = 1.0;
    } else {
        alert("Invalid frequency type. Please enter 'daily', 'weekly', or 'monthly'.");
        return;
    }

    // Calculate weight ratio
    const standardWeight = 70;  // Average weight in kg
    const weightRatio = standardWeight / bodyWeight;

    // Calculate high level
    let highLevel = (volume / lungCapacity)
                    * (thcConcentration / baselineTHC)
                    * (inhalationTime / standardTime)
                    * strainFactor
                    * weightRatio
                    * frequencyFactor;

    // Calculate decay factor based on time since smoking
    const decayFactor = Math.exp(-decayConstant * timeSinceSmoking);

    // Multiply by decay factor
    highLevel *= decayFactor;

    // Multiply by 178.571425
    highLevel *= 178.571425;

    // Normalize to 0-100 scale and clamp to maximum 100
    let normalizedHighLevel = (highLevel > 100) ? 100 : (highLevel / 100) * 100;

    // Calculate time until high level reaches 0
    const timeToZero = (Math.log(1 / (highLevel / 100)) / -decayConstant).toFixed(2); // in hours

    // Calculate time until high level reaches 100
    const timeTo100 = (Math.log(2) / decayConstant).toFixed(2); // in hours

    // Determine side effects based on normalized high level
    let sideEffects = "";
    if (normalizedHighLevel >= 0 && normalizedHighLevel <= 10) {
        sideEffects = "Mild to moderate effects. Users may feel slightly relaxed, increased appetite, dry mouth.";
    } else if (normalizedHighLevel > 10 && normalizedHighLevel <= 30) {
        sideEffects = "Moderate to moderately high effects. Users may experience euphoria, altered perception of time, increased heart rate.";
    } else if (normalizedHighLevel > 30 && normalizedHighLevel <= 50) {
        sideEffects = "High effects. Pronounced euphoria, impaired short-term memory, increased sensory perception.";
    } else if (normalizedHighLevel > 50 && normalizedHighLevel <= 70) {
        sideEffects = "Very high effects. Intense euphoria, hallucinations, impaired motor coordination, heightened sensitivity to light and sound.";
    } else if (normalizedHighLevel > 70 && normalizedHighLevel <= 100) {
        sideEffects = "Extremely high effects. Overwhelming euphoria, paranoia, intense hallucinations, significant impairment of motor skills, sedation.";
    }

    // Display result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="alert alert-success" role="alert">
            <p>The estimated high level is: ${normalizedHighLevel.toFixed(2)} out of 100</p>
            <p><strong>Side Effects:</strong></p>
            <p>${sideEffects}</p>
            <p><strong>Time until high level reaches 0:</strong> ${timeToZero} hours</p>
            <p><strong>Time until high level reaches 100:</strong> ${timeTo100} hours</p>
        </div>`;
}
