function calculateHighLevel() {
    // Constants
    const lungCapacity = 6;  // Average lung capacity in liters
    const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
    const standardTime = 5;  // Standard time in seconds
    const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours

    // Fetch user inputs
    const volume = parseFloat(document.getElementById('volume').value);
    const thcConcentration = parseFloat(document.getElementById('thcConcentration').value);
    const inhalationTime = parseFloat(document.getElementById('inhalationTime').value);
    const strain = document.getElementById('strain').value.toLowerCase();
    const frequency = document.getElementById('frequency').value.toLowerCase();
    const bodyWeight = parseFloat(document.getElementById('bodyWeight').value);
    const timeSinceSmoking = parseFloat(document.getElementById('timeSinceSmoking').value);

    // Validate strain input
    const strainFactors = { sativa: 1.1, indica: 0.9, hybrid: 1.0 };
    if (!strainFactors[strain]) {
        alert("Invalid strain type. Please enter 'sativa', 'indica', or 'hybrid'.");
        return;
    }
    const strainFactor = strainFactors[strain];

    // Validate frequency input
    const frequencyFactors = { daily: 1.5, weekly: 1.0, monthly: 0.5 };
    if (!frequencyFactors[frequency]) {
        alert("Invalid frequency type. Please enter 'daily', 'weekly', or 'monthly'.");
        return;
    }
    const frequencyFactor = frequencyFactors[frequency];

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

    // Apply decay factor
    const decayFactor = Math.exp(-decayConstant * timeSinceSmoking);
    highLevel *= decayFactor;

    // Scale and normalize high level
    highLevel *= 178.571425;
    const normalizedHighLevel = Math.min(100, highLevel);

    // Calculate times
    const timeToZero = (Math.log(1 / (highLevel / 100)) / -decayConstant).toFixed(2); // in hours
    const timeTo100 = (Math.log(2) / decayConstant).toFixed(2); // in hours

    // Determine side effects
    let sideEffects = "";
    if (normalizedHighLevel <= 10) {
        sideEffects = "Mild to moderate effects. Users may feel slightly relaxed, increased appetite, dry mouth.";
    } else if (normalizedHighLevel <= 30) {
        sideEffects = "Moderate to moderately high effects. Users may experience euphoria, altered perception of time, increased heart rate.";
    } else if (normalizedHighLevel <= 50) {
        sideEffects = "High effects. Pronounced euphoria, impaired short-term memory, increased sensory perception.";
    } else if (normalizedHighLevel <= 70) {
        sideEffects = "Very high effects. Intense euphoria, hallucinations, impaired motor coordination, heightened sensitivity to light and sound.";
    } else {
        sideEffects = "Extremely high effects. Overwhelming euphoria, paranoia, intense hallucinations, significant impairment of motor skills, sedation.";
    }

    // Display result
    document.getElementById('result').innerHTML = `
        <div class="alert alert-success" role="alert">
            <p>The estimated high level is: ${normalizedHighLevel.toFixed(2)} out of 100</p>
            <p><strong>Side Effects:</strong></p>
            <p>${sideEffects}</p>
            <p><strong>Time until high level reaches 0:</strong> ${timeToZero} hours</p>
            <p><strong>Time until high level reaches 100:</strong> ${timeTo100} hours</p>
        </div>`;
}
