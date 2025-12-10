/* popup-scroll.js */
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("scroll-popup");
    const closeBtn = document.getElementById("close-popup");
    let hasShown = sessionStorage.getItem("popupShown") === "true";

    if (!popup) return;

    // Scroll Listener
    window.addEventListener("scroll", () => {
        if (hasShown) return;

        // Calculate 80% scroll
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

        if (scrollPercent > 0.8) {
            showPopup();
        }
    });

    // Function to Show
    function showPopup() {
        popup.classList.add("show");
        hasShown = true;
        sessionStorage.setItem("popupShown", "true");
    }

    // Close Handler
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            popup.classList.remove("show");
        });
    }

    // Expose reset for testing if needed
    window.resetPopup = () => {
        sessionStorage.removeItem("popupShown");
        hasShown = false;
        console.log("Popup reset for testing.");
    };
});
