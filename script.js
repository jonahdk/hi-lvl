// LAST UPDATED: JULY 24 2024 AT 12:30 PM


// Constants
const lungCapacity = 6;  // Average lung capacity in liters
const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
const standardTime = 5;  // Standard time in seconds
const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours
const blinkerVolume = 20; // 1 Blinker is 20 liters
const blinkerTime = 10;  // 1 Blinker is 10 seconds

// Global array to store sessions
let sessions = [];
let savedBodyWeight = null;

// Function to toggle visibility of custom volume field
function toggleCustomVolume() {
    const volumeSelect = document.getElementById('volume');
    const customVolumeField = document.getElementById('customVolumeField');
    if (volumeSelect.value === 'custom') {
        customVolumeField.style.display = 'block';
    } else {
        customVolumeField.style.display = 'none';
    }
}

// Function to toggle measurement fields based on the selected method
function toggleMeasurementFields() {
    const measurementMethod = document.getElementById('measurementMethod').value;
    const litersSecondsFields = document.getElementById('litersSecondsFields');
    const blinkersField = document.getElementById('blinkersField');

    if (measurementMethod === 'litersSeconds') {
        litersSecondsFields.style.display = 'block';
        blinkersField.style.display = 'none';
    } else if (measurementMethod === 'blinkers') {
        litersSecondsFields.style.display = 'none';
        blinkersField.style.display = 'block';
    }
}

// Function to add a new session
function addSession() {
    // Fetch user inputs for the new session
    const measurementMethod = document.getElementById('measurementMethod').value;
    let volume, inhalationTime;

    if (measurementMethod === 'litersSeconds') {
        const volumeSelect = document.getElementById('volume');
        volume = parseFloat(volumeSelect.value);
        if (volumeSelect.value === 'custom') {
            volume = parseFloat(document.getElementById('customVolume').value);
        }
        inhalationTime = parseFloat(document.getElementById('inhalationTime').value);
    } else if (measurementMethod === 'blinkers') {
        const blinkers = parseFloat(document.getElementById('blinkers').value);
        volume = blinkers * blinkerVolume;
        inhalationTime = blinkers * blinkerTime;
    }

    const bodyWeightLbs = parseFloat(document.getElementById('bodyWeight').value);
    const bodyWeightKg = bodyWeightLbs * 0.453592; // Convert pounds to kg

    // Create session object with timestamp
    const session = {
        timestamp: new Date().toLocaleString(), // Capture current timestamp
        volume: volume,
        inhalationTime: inhalationTime,
        strain: 'sativa',  // Default to Sativa
        frequency: 'daily',  // Default to daily
        thcConcentration: 1.0,  // 100% THC concentration
        bodyWeight: bodyWeightKg
    };

    // Add session to array
    sessions.push(session);

    // Save sessions and body weight to cookies
    saveSessionsAndBodyWeightToCookies(bodyWeightLbs);

    // Clear form inputs (optional)
    clearFormInputs();

    // Update displayed sessions and calculate cumulative high level
    displaySessions();
    calculateCumulativeHighLevel();
}

// Function to save sessions and body weight to cookies
function saveSessionsAndBodyWeightToCookies(bodyWeightLbs) {
    // Convert sessions array to JSON string
    const sessionsJSON = JSON.stringify(sessions);

    // Set sessions JSON string as cookie
    document.cookie = `thc_sessions=${sessionsJSON}; path=/`;

    // Save body weight as a separate cookie
    document.cookie = `body_weight=${bodyWeightLbs}; path=/`;
}

// Function to load sessions and body weight from cookies
function loadSessionsAndBodyWeightFromCookies() {
    const cookies = document.cookie.split(';');
    let sessionsJSON = '';
    let bodyWeightLbs = null;

    // Find the cookies containing session data and body weight
    cookies.forEach(cookie => {
        if (cookie.trim().startsWith('thc_sessions=')) {
            sessionsJSON = cookie.trim().substring('thc_sessions='.length);
        }
        if (cookie.trim().startsWith('body_weight=')) {
            bodyWeightLbs = parseFloat(cookie.trim().substring('body_weight='.length));
        }
    });

    // Parse sessions JSON string to array
    sessions = JSON.parse(sessionsJSON) || [];

    // Load body weight
    savedBodyWeight = bodyWeightLbs;
}

// Function to display sessions
function displaySessions() {
    const sessionsContainer = document.getElementById('sessions');
    sessionsContainer.innerHTML = '';

    sessions.forEach((session, index) => {
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('card', 'mb-2');
        sessionElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Session ${index + 1} - ${session.timestamp}</h5>
                <ul class="list-unstyled">
                    <li><strong>Volume:</strong> ${session.volume} liters</li>
                    <li><strong>THC Concentration:</strong> 100%</li>
                    <li><strong>Inhalation Time:</strong> ${session.inhalationTime} seconds</li>
                    <li><strong>Strain:</strong> Sativa</li>
                    <li><strong>Frequency:</strong> Daily</li>
                    <li><strong>Body Weight:</strong> ${(session.bodyWeight * 2.20462).toFixed(2)} lbs</li>
                </ul>
            </div>`;
        sessionsContainer.appendChild(sessionElement);
    });
}

// Function to calculate cumulative high level based on all sessions
function calculateCumulativeHighLevel() {
    let cumulativeHighLevel = 0;

    // Calculate cumulative high level
    sessions.forEach(session => {
        const standardWeight = 70; // in kg
        const highLevel = (session.volume / lungCapacity)
                          * (session.thcConcentration / baselineTHC)
                          * (session.inhalationTime / standardTime)
                          * (standardWeight / session.bodyWeight)
                          * 178.571425; // Adjusted multiplier for normalization

        cumulativeHighLevel += highLevel;
    });

    // Display result
    displayResult(cumulativeHighLevel);
}

// Function to display the result
function displayResult(cumulativeHighLevel) {
    let sideEffects = "";
    if (cumulativeHighLevel >= 0 && cumulativeHighLevel <= 10) {
        sideEffects = "Mild to moderate effects. Users may feel slightly relaxed, increased appetite, dry mouth.";
    } else if (cumulativeHighLevel > 10 && cumulativeHighLevel <= 30) {
        sideEffects = "Moderate to moderately high effects. Users may experience euphoria, altered perception of time, increased heart rate.";
    } else if (cumulativeHighLevel > 30 && cumulativeHighLevel <= 50) {
        sideEffects = "High effects. Pronounced euphoria, impaired short-term memory, increased sensory perception.";
    } else if (cumulativeHighLevel > 50 && cumulativeHighLevel <= 70) {
        sideEffects = "Very high effects. Intense euphoria, hallucinations, impaired motor coordination, heightened sensitivity to light and sound.";
    } else if (cumulativeHighLevel > 70) {
        sideEffects = "Extremely high effects. Overwhelming euphoria, paranoia, intense hallucinations, significant impairment of motor skills, sedation.";
    }

    // Display the result with a button for calculating decay
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="alert alert-success" role="alert">
            <p>The estimated cumulative high level is: ${cumulativeHighLevel.toFixed(2)}</p>
            <p><strong>Side Effects:</strong></p>
            <p>${sideEffects}</p>
            <button class="btn btn-primary" onclick="calculateDecayEffect(${cumulativeHighLevel})">Calculate Decay Effect</button>
        </div>`;
}

// Function to calculate the decay effect on the high level
function calculateDecayEffect(initialHighLevel) {
    const startTime = new Date(sessions[0].timestamp); // Assuming sessions are sorted, take the earliest timestamp
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / (1000 * 60 * 60); // Time in hours

    const decayedHighLevel = initialHighLevel * Math.exp(-decayConstant * elapsedTime);

    // Update the result element with decay information
    const resultElement = document.getElementById('result');
    resultElement.innerHTML += `
        <div class="alert alert-info mt-3" role="alert" id="decayAlert">
            <button type="button" class="close" aria-label="Close" onclick="closeDecayAlert()">
                <span aria-hidden="true">&times;</span>
            </button>
            <p><strong>Decay Calculation:</strong></p>
            <p>The decayed cumulative high level is: ${decayedHighLevel.toFixed(2)}</p>
        </div>`;
}

// Function to close the decay alert
function closeDecayAlert() {
    const decayAlert = document.getElementById('decayAlert');
    if (decayAlert) {
        decayAlert.remove();
    }
}

// Function to clear form inputs
function clearFormInputs() {
    document.getElementById('calculatorForm').reset();
    toggleMeasurementFields(); // Reset the measurement fields visibility
}

// Load sessions and body weight from cookies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSessionsAndBodyWeightFromCookies();

    // If body weight is found in cookies, populate the input field
    if (savedBodyWeight !== null) {
        document.getElementById('bodyWeight').value = savedBodyWeight;
    }

    displaySessions();
    calculateCumulativeHighLevel();
});

// Function to load sessions and body weight from cookies
function loadSessionsAndBodyWeightFromCookies() {
    const cookies = document.cookie.split(';');
    let sessionsJSON = '';
    let bodyWeightLbs = null;

    // Find the cookies containing session data and body weight
    cookies.forEach(cookie => {
        if (cookie.trim().startsWith('thc_sessions=')) {
            sessionsJSON = cookie.trim().substring('thc_sessions='.length);
        }
        if (cookie.trim().startsWith('body_weight=')) {
            bodyWeightLbs = parseFloat(cookie.trim().substring('body_weight='.length));
        }
    });

    // Parse sessions JSON string to array
    sessions = JSON.parse(sessionsJSON) || [];

    // Load body weight
    savedBodyWeight = bodyWeightLbs;
}
