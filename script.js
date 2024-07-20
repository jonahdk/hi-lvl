// Constants
const lungCapacity = 6;  // Average lung capacity in liters
const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
const standardTime = 5;  // Standard time in seconds
const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours
const strainFactors = {
    sativa: 1.0,
    indica: 2.0,
    hybrid: 1.5
};
const frequencyFactors = {
    daily: 1.5,
    weekly: 1.2,
    monthly: 1.0
};
const volumeValues = {
    small: 6.3,
    medium: 12.6,
    large: 18.9
};

// Global array to store sessions
let sessions = [];

// Function to update volume based on selection
function updateVolume() {
    const volumeSelect = document.getElementById('volumeSelect');
    const customVolumeContainer = document.getElementById('customVolumeContainer');
    const customVolumeInput = document.getElementById('customVolume');
    
    if (volumeSelect.value === 'custom') {
        customVolumeContainer.classList.remove('d-none');
        customVolumeInput.required = true;
    } else {
        customVolumeContainer.classList.add('d-none');
        customVolumeInput.required = false;
        customVolumeInput.value = '';
    }
}

// Function to add a new session
function addSession() {
    // Fetch user inputs for the new session
    const volumeSelect = document.getElementById('volumeSelect').value;
    const volume = volumeSelect === 'custom'
        ? parseFloat(document.getElementById('customVolume').value)
        : volumeValues[volumeSelect];
    const thcConcentrationPercentage = parseFloat(document.getElementById('thcConcentration').value);
    const inhalationTime = parseFloat(document.getElementById('inhalationTime').value);
    const strain = document.getElementById('strain').value.toLowerCase();
    const frequency = document.getElementById('frequency').value.toLowerCase();
    const bodyWeight = parseFloat(document.getElementById('bodyWeight').value);

    // Calculate THC concentration in decimal form
    const thcConcentration = thcConcentrationPercentage / 100.0;

    // Create session object with timestamp
    const session = {
        timestamp: new Date().toLocaleString(), // Capture current timestamp
        volume: volume,
        thcConcentration: thcConcentration,
        inhalationTime: inhalationTime,
        strain: strain,
        frequency: frequency,
        bodyWeight: bodyWeight
    };

    // Add session to array
    sessions.push(session);

    // Save sessions to cookies
    saveSessionsToCookies();

    // Clear form inputs (optional)
    clearFormInputs();

    // Update displayed sessions and calculate cumulative high level
    displaySessions();
    calculateCumulativeHighLevel();
}

// Function to save sessions to cookies
function saveSessionsToCookies() {
    // Convert sessions array to JSON string
    const sessionsJSON = JSON.stringify(sessions);

    // Set sessions JSON string as cookie
    document.cookie = `thc_sessions=${sessionsJSON}; path=/`; // Use a specific cookie name ('thc_sessions') for clarity
}

// Function to load sessions from cookies
function loadSessionsFromCookies() {
    const cookies = document.cookie.split(';');
    let sessionsJSON = '';

    // Find the cookie containing session data
    cookies.forEach(cookie => {
        if (cookie.trim().startsWith('thc_sessions=')) {
            sessionsJSON = cookie.trim().substring('thc_sessions='.length);
        }
    });

    // Parse sessions JSON string to array
    sessions = JSON.parse(sessionsJSON) || [];
}

// Function to display sessions and calculate cumulative high level
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
                    <li><strong>THC Concentration:</strong> ${session.thcConcentration * 100}%</li>
                    <li><strong>Inhalation Time:</strong> ${session.inhalationTime} seconds</li>
                    <li><strong>Strain:</strong> ${session.strain}</li>
                    <li><strong>Frequency:</strong> ${session.frequency}</li>
                    <li><strong>Body Weight:</strong> ${session.bodyWeight} kg</li>
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
        const strainFactor = strainFactors[session.strain] || 1.0;
        const frequencyFactor = frequencyFactors[session.frequency] || 1.0;
        const highLevel = (session.volume / lungCapacity)
                         * (session.thcConcentration / baselineTHC)
                         * (session.inhalationTime / standardTime)
                         * strainFactor
                         * (standardWeight / session.bodyWeight)
                         * frequencyFactor
                         * 178.571425; // Assuming this is a multiplier for adjustment

        cumulativeHighLevel += highLevel;
    });

    // Normalize cumulative high level to 0-100 scale
    const normalizedCumulativeHighLevel = Math.min((cumulativeHighLevel / 100) * 100, 100);

    // Calculate time until high level reaches 0
    const timeToZero = (Math.log(1 / (normalizedCumulativeHighLevel / 100)) / -decayConstant).toFixed(2); // in hours

    // Calculate time until high level reaches 99.99 if score is 100
    let timeTo99_99 = '';
    if (normalizedCumulativeHighLevel === 100) {
        timeTo99_99 = (Math.log(100 / 99.99) / decayConstant).toFixed(2); // in hours
    }

    // Determine side effects based on normalized cumulative high level
    let sideEffects = "";
    if (normalizedCumulativeHighLevel >= 0 && normalizedCumulativeHighLevel <= 10) {
        sideEffects = "Mild to moderate effects. Users may feel slightly relaxed, increased appetite, dry mouth.";
    } else if (normalizedCumulativeHighLevel > 10 && normalizedCumulativeHighLevel <= 30) {
        sideEffects = "Moderate to moderately high effects. Users may experience euphoria, altered perception of time, increased heart rate.";
    } else if (normalizedCumulativeHighLevel > 30 && normalizedCumulativeHighLevel <= 50) {
        sideEffects = "High effects. Pronounced euphoria, impaired short-term memory, increased sensory perception.";
    } else if (normalizedCumulativeHighLevel > 50 && normalizedCumulativeHighLevel <= 70) {
        sideEffects = "Very high effects. Intense euphoria, hallucinations, impaired motor coordination, heightened sensitivity to light and sound.";
    } else if (normalizedCumulativeHighLevel > 70 && normalizedCumulativeHighLevel <= 100) {
        sideEffects = "Extremely high effects. Overwhelming euphoria, paranoia, intense hallucinations, significant impairment of motor skills, sedation.";
    }

    // Display result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="alert alert-success" role="alert">
            <p>The estimated cumulative high level is: ${normalizedCumulativeHighLevel.toFixed(2)} out of 100</p>
            <p><strong>Side Effects:</strong></p>
            <p>${sideEffects}</p>
            <p><strong>Time until high level reaches 0:</strong> ${timeToZero} hours</p>
            ${timeTo99_99 ? `<p><strong>Time until high level reaches 100:</strong> ${timeTo99_99} hours</p>` : ''}
        </div>`;
}

// Function to clear form inputs
function clearFormInputs() {
    document.getElementById('calculatorForm').reset();
    updateVolume(); // Reset volume field visibility
}

// Load sessions from cookies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSessionsFromCookies();
    displaySessions();
    calculateCumulativeHighLevel();
});
