// Time zones configuration
const timeZones = [
    {
        name: 'New York',
        timezone: 'America/New_York',
        idPrefix: 'ny'
    },
    {
        name: 'London',
        timezone: 'Europe/London',
        idPrefix: 'london'
    },
    {
        name: 'Tokyo',
        timezone: 'Asia/Tokyo',
        idPrefix: 'tokyo'
    },
    {
        name: 'Sydney',
        timezone: 'Australia/Sydney',
        idPrefix: 'sydney'
    },
    {
        name: 'Dubai',
        timezone: 'Asia/Dubai',
        idPrefix: 'dubai'
    },
    {
        name: 'Singapore',
        timezone: 'Asia/Singapore',
        idPrefix: 'singapore'
    }
];

/**
 * Get the current time in a specific timezone
 * @param {string} timezone - IANA timezone string
 * @returns {Object} Object with hours, minutes, seconds
 */
function getTimeInTimezone(timezone) {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const [hour, minute, second] = timeString.split(':').map(Number);

    return {
        hour: hour,
        minute: minute,
        second: second,
        hour12: hour % 12 || 12,
        ampm: hour >= 12 ? 'PM' : 'AM'
    };
}

/**
 * Format time as HH:MM:SS
 * @param {number} hours - Hours (0-23)
 * @param {number} minutes - Minutes (0-59)
 * @param {number} seconds - Seconds (0-59)
 * @returns {string} Formatted time string
 */
function formatTime(hours, minutes, seconds) {
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Calculate rotation angle for clock hands
 * @param {number} value - Current value (0-59 for minutes/seconds, 0-23 for hours)
 * @param {number} total - Total possible values (60 for minutes/seconds, 12 for hours)
 * @returns {number} Rotation in degrees
 */
function calculateRotation(value, total = 60) {
    return (value / total) * 360;
}

/**
 * Update a single clock
 * @param {Object} tzConfig - Timezone configuration object
 */
function updateClock(tzConfig) {
    const time = getTimeInTimezone(tzConfig.timezone);
    const prefix = tzConfig.idPrefix;

    // Update digital time
    const timeElement = document.getElementById(`${prefix}-time`);
    const ampmElement = document.getElementById(`${prefix}-ampm`);

    if (timeElement) {
        timeElement.textContent = formatTime(time.hour, time.minute, time.second);
    }

    if (ampmElement) {
        ampmElement.textContent = time.ampm;
    }

    // Update analog clock hands
    const hourHand = document.getElementById(`${prefix}-hour`);
    const minuteHand = document.getElementById(`${prefix}-minute`);
    const secondHand = document.getElementById(`${prefix}-second`);

    if (hourHand) {
        const hourRotation = calculateRotation(time.hour12 + time.minute / 60, 12);
        hourHand.style.transform = `rotate(${hourRotation}deg)`;
    }

    if (minuteHand) {
        const minuteRotation = calculateRotation(time.minute + time.second / 60);
        minuteHand.style.transform = `rotate(${minuteRotation}deg)`;
    }

    if (secondHand) {
        const secondRotation = calculateRotation(time.second);
        secondHand.style.transform = `rotate(${secondRotation}deg)`;
    }
}

/**
 * Update all clocks
 */
function updateAllClocks() {
    timeZones.forEach(tzConfig => {
        updateClock(tzConfig);
    });
}

/**
 * Initialize clock updates
 */
function initClocks() {
    // Update immediately
    updateAllClocks();

    // Update every 1000ms (1 second)
    setInterval(updateAllClocks, 1000);
}

// Start the clock when the DOM is loaded
document.addEventListener('DOMContentLoaded', initClocks);

// Also try to start immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClocks);
} else {
    initClocks();
}
