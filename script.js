// Constants
const lungCapacity = 6;  // Average lung capacity in liters
const baselineTHC = 5;   // Baseline THC concentration in smoke
const standardTime = 5;  // Standard time in seconds
const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours
const bmi = 33.5;  // Hardcoded BMI

// Global array to store sessions
let sessions = [];

// Function to add a new session
function addSession() {
    // Fetch user inputs for the new session
    const suckingTime = parseFloat(document.getElementById('suckingTime').value);
    const heldInTime = parseFloat(document.getElementById('heldInTime').value);

    // Calculate volume based on sucking time
    const volume = suckingTime * 0.5; // 0.5 liters per second

    // Create session object with timestamp
    const session = {
        timestamp: new Date().toLocaleString(), // Capture current timestamp
        volume: volume,
        inhalationTime: heldInTime
    };

    // Add session to array
    sessions.push(session);

    // Save sessions to localStorage
    saveSessionsToLocalStorage();

    // Clear form inputs (optional)
    clearFormInputs();

    // Update displayed sessions and calculate cumulative high level
    displaySessions();
    calculateCumulativeHighLevel();
}

// Function to save sessions to localStorage
function saveSessionsToLocalStorage() {
    // Convert sessions array to JSON string
    const sessionsJSON = JSON.stringify(sessions);

    // Set sessions JSON string as localStorage item
    localStorage.setItem('thc_sessions', sessionsJSON);
}

// Function to load sessions from localStorage
function loadSessionsFromLocalStorage() {
    // Get sessions JSON string from localStorage
    const sessionsJSON = localStorage.getItem('thc_sessions');

    // Parse sessions JSON string to array
    sessions = JSON.parse(sessionsJSON) || [];
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
                    <li><strong>Inhalation Time:</strong> ${session.inhalationTime} seconds</li>
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
        const highLevel = (session.volume / lungCapacity)
                          * (session.inhalationTime / standardTime)
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

    // Calculate the number of half-lives elapsed
    const halfLivesElapsed = elapsedTime / 2;

    // Calculate the decayed high level using the formula: initialHighLevel * (1/2) ^ halfLivesElapsed
    const decayedHighLevel = initialHighLevel * Math.pow(0.5, halfLivesElapsed);

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
}

// Load sessions from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSessionsFromLocalStorage();

    displaySessions();
    calculateCumulativeHighLevel();
});
