// Array to store sessions
let sessions = [];

// Function to add a new session
function addSession() {
    // Fetch user inputs for the new session
    const volume = parseFloat(document.getElementById('volume').value);
    const thcConcentrationPercentage = parseFloat(document.getElementById('thcConcentration').value);
    const inhalationTime = parseFloat(document.getElementById('inhalationTime').value);
    const strain = document.getElementById('strain').value.toLowerCase();
    const frequency = document.getElementById('frequency').value.toLowerCase();
    const bodyWeight = parseFloat(document.getElementById('bodyWeight').value);
    const timeSinceSmoking = parseFloat(document.getElementById('timeSinceSmoking').value);

    // Calculate THC concentration in decimal form
    const thcConcentration = thcConcentrationPercentage / 100.0;

    // Validate inputs (optional)

    // Create session object
    const session = {
        volume: volume,
        thcConcentration: thcConcentration,
        inhalationTime: inhalationTime,
        strain: strain,
        frequency: frequency,
        bodyWeight: bodyWeight,
        timeSinceSmoking: timeSinceSmoking
    };

    // Add session to array
    sessions.push(session);

    // Clear form inputs (optional)
    clearFormInputs();

    // Update displayed sessions
    displaySessions();

    // Calculate cumulative high level
    calculateCumulativeHighLevel();
}

// Function to clear form inputs after adding a session (optional)
function clearFormInputs() {
    document.getElementById('volume').value = '';
    document.getElementById('thcConcentration').value = '';
    document.getElementById('inhalationTime').value = '';
    document.getElementById('strain').value = '';
    document.getElementById('frequency').value = '';
    document.getElementById('bodyWeight').value = '';
    document.getElementById('timeSinceSmoking').value = '';
}

// Function to display sessions in the DOM
function displaySessions() {
    const sessionsContainer = document.getElementById('sessions');
    sessionsContainer.innerHTML = '';

    sessions.forEach((session, index) => {
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('card', 'mb-2');
        sessionElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Session ${index + 1}</h5>
                <ul class="list-unstyled">
                    <li><strong>Volume:</strong> ${session.volume} liters</li>
                    <li><strong>THC Concentration:</strong> ${session.thcConcentration * 100}%</li>
                    <li><strong>Inhalation Time:</strong> ${session.inhalationTime} seconds</li>
                    <li><strong>Strain:</strong> ${session.strain}</li>
                    <li><strong>Frequency:</strong> ${session.frequency}</li>
                    <li><strong>Body Weight:</strong> ${session.bodyWeight} kg</li>
                    <li><strong>Time Since Smoking:</strong> ${session.timeSinceSmoking} hours</li>
                </ul>
            </div>`;
        sessionsContainer.appendChild(sessionElement);
    });
}

// Function to calculate cumulative high level based on all sessions
function calculateCumulativeHighLevel() {
    let cumulativeHighLevel = 0;

    sessions.forEach(session => {
        // Calculate high level for each session (similar to previous function)
        let highLevel = (session.volume / lungCapacity)
                        * (session.thcConcentration / baselineTHC)
                        * (session.inhalationTime / standardTime)
                        * strainFactor
                        * (standardWeight / session.bodyWeight)
                        * frequencyFactor;

        const decayFactor = Math.exp(-decayConstant * session.timeSinceSmoking);
        highLevel *= decayFactor;
        highLevel *= 178.571425;

        cumulativeHighLevel += highLevel;
    });

    // Normalize cumulative high level to 0-100 scale
    const normalizedCumulativeHighLevel = (cumulativeHighLevel > 100) ? 100 : (cumulativeHighLevel / 100) * 100;

    // Display result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="alert alert-success" role="alert">
            <p>The estimated cumulative high level is: ${normalizedCumulativeHighLevel.toFixed(2)} out of 100</p>
        </div>`;
}
