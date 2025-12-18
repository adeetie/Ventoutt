/* auto-open.js */
document.addEventListener("DOMContentLoaded", () => {
    let inactivityTime = 0;
    const TIME_LIMIT = 30; // 30 seconds
    let triggered = false;

    // Reset timer events
    const resetEvents = ["mousemove", "keydown", "scroll", "click", "touchstart"];

    function resetTimer() {
        if (triggered) return;
        inactivityTime = 0;
    }

    resetEvents.forEach(evt => window.addEventListener(evt, resetTimer));

    // Check timer every second
    const interval = setInterval(() => {
        if (triggered) {
            clearInterval(interval);
            return;
        }

        inactivityTime++;
        // console.log("Inactivity:", inactivityTime); 

        if (inactivityTime >= TIME_LIMIT) {
            triggerChatbot();
        }
    }, 1000);

    function triggerChatbot() {
        triggered = true;
        clearInterval(interval);

        // Ensure MB is available (Global chatbot object)
        if (typeof MB !== "undefined" && MB.state === "collapsed") {
            console.log("Auto-opening chatbot due to inactivity.");
            MB.toggle(true); // Force open
        }
    }
});
