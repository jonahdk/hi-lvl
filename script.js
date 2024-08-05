// LAST UPDATED: AUGUST 5 2024 AT 1758 UTC

// Constants
const lungCapacity = 6;  // Average lung capacity in liters
const baselineTHC = 5;   // Baseline THC concentration in smoke (assuming no dilution)
const standardTime = 5;  // Standard time in seconds
const decayConstant = Math.log(2) / 2;  // Half-life of THC is approximately 2 hours
const blinkerVolume = 20; // 1 Blinker is 20 liters
const blinkerTime = 10;  // 1 Blinker is 10 seconds
let strainFactor = 2.0;  // Strain factor for 'indica'

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
        strain: 'indica',  // Set strain to 'indica'
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
    sessionsContainer.innerHTML = ''; // Clear existing sessions

    // Create a table to display sessions
    const table = document.createElement('table');
    table.className = 'table table-striped';

    // Create table headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Timestamp', 'Volume (L)', 'Inhalation Time (s)', 'Strain', 'Frequency', 'THC Concentration', 'Body Weight (kg)'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    sessions.forEach(session => {
        const row = document.createElement('tr');
        Object.values(session).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append table to sessions container
    sessionsContainer.appendChild(table);
}

// Function to calculate cumulative high level
function calculateCumulativeHighLevel() {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = ''; // Clear existing result

    // Calculate cumulative high level
    let cumulativeHighLevel = 0;
    sessions.forEach(session => {
        const volume = session.volume;
        const inhalationTime = session.inhalationTime;
        const thcConcentration = session.thcConcentration;
        const bodyWeight = session.bodyWeight;

        // Calculate THC amount absorbed
        const thcAmount = (volume * thcConcentration * strainFactor) / (bodyWeight * lungCapacity);

        // Calculate cumulative high level
        cumulativeHighLevel += thcAmount * (1 - Math.exp(-decayConstant * inhalationTime)) * (1426.2893370607);
    });

    // Display cumulative high level
    const resultText = `Cumulative High Level: ${cumulativeHighLevel.toFixed(2)}`;
    resultElement.textContent = resultText;
}

// Function to clear form inputs
function clearFormInputs() {
    const form = document.getElementById('calculatorForm');
    form.reset();
}

// Load sessions and body weight from cookies on page load
loadSessionsAndBodyWeightFromCookies();
