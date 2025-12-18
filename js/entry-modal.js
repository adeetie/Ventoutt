/* entry-modal.js - Image Card Redesign */
document.addEventListener("DOMContentLoaded", () => {
    // Only run on Homepage
    const path = window.location.pathname;
    if (!path.endsWith("index.html") && path !== "/" && !path.endsWith("/")) return;

    // Session check removed for aggressive behavior
    // if (sessionStorage.getItem("entryModalShown")) return;

    // 1. Inject HTML with Images
    const modalHTML = `
        <div id="entry-modal-overlay">
            <div id="entry-modal" role="dialog" aria-modal="true">
                <div class="entry-header">
                    <h2>Where would you like to begin?</h2>
                    <p>Everyone’s needs are different. Choose what feels right — or let us help you decide.</p>
                </div>
                
                <div class="entry-grid">
                    <!-- Venting -->
                    <a href="services.html#venting" class="entry-card">
                        <div class="entry-img-container">
                            <img src="https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=500&q=80" alt="Happy relief">
                        </div>
                        <div class="entry-content">
                            <h3>Venting</h3>
                            <p>A safe space to express your feelings freely without judgment.</p>
                            <span class="entry-btn">Start Venting</span>
                        </div>
                    </a>
                    
                    <!-- Coaching -->
                    <a href="services.html#coaching" class="entry-card">
                        <div class="entry-img-container">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80" alt="Coaching session">
                        </div>
                        <div class="entry-content">
                            <h3>Coaching</h3>
                            <p>Guidance and emotional clarity from qualified psychologists.</p>
                            <span class="entry-btn">Explore Coaching</span>
                        </div>
                    </a>
                    
                    <!-- Therapy -->
                    <a href="services.html#therapy" class="entry-card">
                        <div class="entry-img-container">
                            <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&q=80" alt="Professional therapy">
                        </div>
                        <div class="entry-content">
                            <h3>Therapy Resources</h3>
                            <p>Find licensed mental health professionals on external platforms.</p>
                            <span class="entry-btn">Find Therapy</span>
                        </div>
                    </a>
                    
                    <!-- Chatbot -->
                    <a href="?chatbot=open" class="entry-card">
                        <div class="entry-img-container">
                            <img src="https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=500&q=80" alt="Thinking">
                        </div>
                        <div class="entry-content">
                            <h3>I’m not sure yet</h3>
                            <p>It’s okay to feel uncertain. Our chatbot can help you decide.</p>
                            <span class="entry-btn">Help Me Decide</span>
                        </div>
                    </a>
                </div>
                
                <button id="entry-close">Not now</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const overlay = document.getElementById("entry-modal-overlay");
    const closeBtn = document.getElementById("entry-close");

    setTimeout(() => {
        overlay.classList.add("active");
        sessionStorage.setItem("entryModalShown", "true");
    }, 800);

    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
    });

    window.resetEntry = () => {
        sessionStorage.removeItem("entryModalShown");
        location.reload();
    };
});
