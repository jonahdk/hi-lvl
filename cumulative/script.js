// Constants
const lungCapacity = 6;  // Average lung capacity in liters
const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
const standardTime = 5;  // Standard time in seconds
const standardWeight = 70;  // Average weight in kg

// Array to hold session data
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
    if (sessionsJSON) {
        sessions = JSON.parse(sessionsJSON) || [];
    }
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
                    <li><strong>THC Concentration:</strong> ${(session.thcConcentration * 100).toFixed(2)}%</li>
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

    sessions.forEach(session => {
        // Calculate strain factor
        let strainFactor;
        if (session.strain === "sativa") {
            strainFactor = 1.2;
        } else if (session.strain === "indica") {
            strainFactor = 1.0;
        } else if (session.strain === "hybrid") {
            strainFactor = 1.1;
        } else {
            strainFactor = 1.0; // Default value in case of unknown strain
        }

        // Calculate frequency factor
        let frequencyFactor;
        if (session.frequency === "daily") {
            frequencyFactor = 1.5;
        } else if (session.frequency === "weekly") {
            frequencyFactor = 1.2;
        } else if (session.frequency === "monthly") {
            frequencyFactor = 1.0;
        } else {
            frequencyFactor = 1.0; // Default value in case of unknown frequency
        }

        // Calculate high level for each session
        let highLevel = (session.volume / lungCapacity)
                        * (session.thcConcentration / baselineTHC)
                        * (session.inhalationTime / standardTime)
                        * strainFactor
                        * (standardWeight / session.bodyWeight)
                        * frequencyFactor;

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

// Clear form inputs
function clearFormInputs() {
    document.getElementById('calculatorForm').reset();
}

// Load sessions from cookies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSessionsFromCookies();
    displaySessions();
    calculateCumulativeHighLevel();
});
