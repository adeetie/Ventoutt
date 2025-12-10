/* entry-modal.js */
document.addEventListener("DOMContentLoaded", () => {
    // Only run on Homepage (index.html) or root
    // Simplest check: check if we are on index.html or root
    const path = window.location.pathname;
    if (!path.endsWith("index.html") && path !== "/" && !path.endsWith("/")) return;

    // Check session
    if (sessionStorage.getItem("entryModalShown")) return;

    // 1. Inject HTML
    const modalHTML = `
        <div id="entry-modal-overlay">
            <div id="entry-modal" role="dialog" aria-modal="true">
                <div class="entry-header">
                    <h2>Where would you like to begin?</h2>
                    <p>Everyone’s needs are different. Choose what feels right — or let us help you decide.</p>
                </div>
                
                <div class="entry-grid">
                    <!-- Venting -->
                    <a href="services.html#venting" class="entry-card" style="border-left: 4px solid #4CAF50;">
                        <h3>Venting</h3>
                        <p>A safe space to express your feelings freely without judgment or advice.</p>
                        <span class="entry-btn">Start Venting</span>
                    </a>
                    
                    <!-- Coaching -->
                    <a href="services.html#coaching" class="entry-card" style="border-left: 4px solid #2196F3;">
                        <h3>Coaching</h3>
                        <p>Guidance and emotional clarity from qualified Indian psychologists.</p>
                        <span class="entry-btn">Explore Coaching</span>
                    </a>
                    
                    <!-- Therapy -->
                    <a href="services.html#therapy" class="entry-card" style="border-left: 4px solid #9C27B0;">
                        <h3>Therapy Resources</h3>
                        <p>Find licensed mental health professionals on external platforms.</p>
                        <span class="entry-btn">Find Therapy</span>
                    </a>
                    
                    <!-- Chatbot -->
                    <a href="?chatbot=open" class="entry-card" style="background:#E8F5E9; border-left: 4px solid #FF9800;">
                        <h3>I’m not sure yet</h3>
                        <p>It’s okay to feel uncertain. Our chatbot can help you figure this out.</p>
                        <span class="entry-btn">Help Me Decide</span>
                    </a>
                </div>
                
                <button id="entry-close">Not now</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 2. Logic
    const overlay = document.getElementById("entry-modal-overlay");
    const closeBtn = document.getElementById("entry-close");

    // Show with slight delay
    setTimeout(() => {
        overlay.classList.add("active");
        sessionStorage.setItem("entryModalShown", "true");
    }, 800);

    // Close Handler
    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
    });

    // Allow closing by clicking background? Not specified but good UX. Use spec strictness?
    // User didn't specify background click. "Footer close" button.
    // I won't enable background click to strictly force choices or 'Not now'.

    // Testing Reset
    window.resetEntry = () => {
        sessionStorage.removeItem("entryModalShown");
        location.reload();
    };
});
