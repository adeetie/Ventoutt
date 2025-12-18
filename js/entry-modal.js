/* entry-modal.js - Replaced with Scroll Popup Content (Centered) */
document.addEventListener("DOMContentLoaded", () => {
    // Only run on Homepage
    const path = window.location.pathname;
    if (!path.endsWith("index.html") && path !== "/" && !path.endsWith("/")) return;

    if (sessionStorage.getItem("entryModalShown")) return;

    // Inject HTML - Same content as Scroll Popup but wrapped in overlay for centering
    // Using distinct IDs to avoid conflict with the actual Scroll Popup
    const modalHTML = `
        <div id="entry-popup-overlay">
            <div id="entry-popup-card">
                <h3>Still not sure what kind of support would help?</h3>
                <p>You don’t have to decide alone. Let our chatbot help you explore Venting, Coaching, or Therapy safely.</p>
                <div class="popup-actions">
                    <a href="services.html?chatbot=open" class="btn-popup-primary">Help me choose</a>
                    <button id="entry-popup-close" class="btn-popup-secondary">Not now</button>
                    <div class="popup-micro">You can explore without commitment.</div>
                </div>
            </div>
        </div>
        
        <style>
            #entry-popup-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s ease;
            }
            #entry-popup-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }
            #entry-popup-card {
                width: 440px;
                max-width: 90%;
                background: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 16px;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            #entry-popup-overlay.active #entry-popup-card {
                transform: scale(1);
            }
            #entry-popup-card h3 {
                font-family: var(--font-heading, serif);
                font-size: 22px;
                font-weight: 600;
                color: #222;
                margin: 0;
            }
            #entry-popup-card p {
                font-family: var(--font-body, sans-serif);
                font-size: 15px;
                color: #555;
                line-height: 1.5;
                margin: 0;
            }
            #entry-popup-card .popup-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 10px;
            }
            #entry-popup-card .btn-popup-primary {
                background: #4CAF50; /* Primary Green */
                color: white;
                border: none;
                padding: 12px;
                border-radius: 30px;
                font-weight: 600;
                text-decoration: none;
                font-size: 16px;
                display: block;
            }
            #entry-popup-card .btn-popup-primary:hover {
                background: #45a049;
            }
            #entry-popup-card .btn-popup-secondary {
                background: none;
                border: none;
                color: #888;
                text-decoration: underline;
                cursor: pointer;
                font-size: 14px;
            }
            #entry-popup-card .popup-micro {
                font-size: 12px;
                color: #aaa;
            }
        </style>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const overlay = document.getElementById("entry-popup-overlay");
    const closeBtn = document.getElementById("entry-popup-close");

    // Show after delay
    setTimeout(() => {
        overlay.classList.add("active");
        sessionStorage.setItem("entryModalShown", "true");
    }, 1000);

    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
    });
});
