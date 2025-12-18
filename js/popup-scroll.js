/* popup-scroll.js */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Injection
    if (!document.getElementById("scroll-popup")) {
        const popupHTML = `
            <div id="scroll-popup">
                <h3>Still not sure what kind of support would help?</h3>
                <p>You don’t have to decide alone. Let our chatbot help you explore Venting, Coaching, or Therapy safely.</p>
                <div class="popup-actions">
                    <a href="services.html?chatbot=open" class="btn-popup-primary">Help me choose</a>
                    <button id="close-popup" class="btn-popup-secondary">Not now</button>
                    <div class="popup-micro">You can explore without commitment.</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", popupHTML);
    }

    const popup = document.getElementById("scroll-popup");
    const closeBtn = document.getElementById("close-popup");
    const pageKey = "popupShown_" + window.location.pathname;
    let hasShown = sessionStorage.getItem(pageKey) === "true";

    // 2. Logic (80% Trigger)
    window.addEventListener("scroll", () => {
        // Session check removed for aggressive behavior
        // if (hasShown) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

        if (scrollPercent > 0.8) {
            showPopup();
        }
    });

    function showPopup() {
        popup.classList.add("show");
        hasShown = true;
        sessionStorage.setItem(pageKey, "true");
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            popup.classList.remove("show");
        });
    }

    // Expose reset for testing
    window.resetPopup = () => {
        const key = "popupShown_" + window.location.pathname;
        sessionStorage.removeItem(key);
        hasShown = false;
        console.log("Popup reset for page:", key);
    };
});
