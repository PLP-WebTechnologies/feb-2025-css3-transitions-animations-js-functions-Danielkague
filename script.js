// Wait for DOM to fully load before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const lightBtn = document.getElementById('light-btn');
    const darkBtn = document.getElementById('dark-btn');
    const purpleBtn = document.getElementById('purple-btn');
    const animationToggle = document.getElementById('animation-toggle');
    const notificationToggle = document.getElementById('notification-toggle');
    const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
    const demoIcon = document.getElementById('demo-icon');
    const notification = document.getElementById('notification');
    const cards = document.querySelectorAll('.card');
    
    // Default user preferences
    let userPreferences = {
        theme: 'light',
        animations: true,
        notifications: true,
        reducedMotion: false
    };

    // Check if localStorage is available
    const isLocalStorageAvailable = () => {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Load preferences from localStorage
    function loadPreferences() {
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available. Preferences will not persist.');
            return;
        }

        try {
            const savedPreferences = localStorage.getItem('themePreferences');
            
            if (savedPreferences) {
                const parsed = JSON.parse(savedPreferences);
                
                // Use saved preferences with fallbacks to defaults
                userPreferences = {
                    theme: parsed.theme || 'light',
                    animations: parsed.animations !== undefined ? parsed.animations : true,
                    notifications: parsed.notifications !== undefined ? parsed.notifications : true,
                    reducedMotion: parsed.reducedMotion !== undefined ? parsed.reducedMotion : false
                };
                
                // Apply saved theme
                applyTheme(userPreferences.theme, false);
                
                // Set toggle states
                animationToggle.checked = userPreferences.animations;
                notificationToggle.checked = userPreferences.notifications;
                reducedMotionToggle.checked = userPreferences.reducedMotion;
                
                // Apply reduced motion if enabled
                if (userPreferences.reducedMotion) {
                    document.body.classList.add('reduced-motion');
                }
                
                // Show notification if enabled
                if (userPreferences.notifications) {
                    showNotification('Preferences loaded!');
                }
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            resetToDefaults();
        }
    }

    // Reset to default preferences
    function resetToDefaults() {
        userPreferences = {
            theme: 'light',
            animations: true,
            notifications: true,
            reducedMotion: false
        };
        
        applyTheme('light', false);
        animationToggle.checked = true;
        notificationToggle.checked = true;
        reducedMotionToggle.checked = false;
        document.body.classList.remove('reduced-motion');
    }

    // Save preferences to localStorage
    function savePreferences() {
        if (!isLocalStorageAvailable()) {
            return;
        }

        try {
            localStorage.setItem('themePreferences', JSON.stringify(userPreferences));
            
            // Show notification if enabled
            if (userPreferences.notifications) {
                showNotification('Preferences saved!');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }

    // Apply theme to the body
    function applyTheme(theme, animate = true) {
        document.body.className = ''; // Reset themes
        
        if (userPreferences.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'purple') {
            document.body.classList.add('purple-theme');
        }
        
        userPreferences.theme = theme;
        savePreferences();
        
        // Add animation to cards if enabled and animate parameter is true
        if (userPreferences.animations && animate && !userPreferences.reducedMotion) {
            cards.forEach(card => {
                card.classList.add('pulse');
                setTimeout(() => {
                    card.classList.remove('pulse');
                }, 1000);
            });
        }
    }

    // Show notification
    function showNotification(message) {
        if (!userPreferences.notifications) return;
        
        notification.textContent = message;
        notification.classList.add('show');
        
        // Clear any existing timeout
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }
        
        // Set new timeout to hide notification
        notification.timeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Toggle animation for demo icon
    function toggleIconAnimation() {
        if (userPreferences.animations && !userPreferences.reducedMotion) {
            demoIcon.classList.toggle('rotate-icon');
        } else {
            // If animations are disabled, still give feedback
            demoIcon.classList.add('pulse');
            setTimeout(() => {
                demoIcon.classList.remove('pulse');
            }, 300);
        }
    }

    // Check system preference for reduced motion
    function checkSystemReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            userPreferences.reducedMotion = true;
            reducedMotionToggle.checked = true;
            document.body.classList.add('reduced-motion');
        }
    }

    // Event Listeners
    lightBtn.addEventListener('click', () => applyTheme('light'));
    darkBtn.addEventListener('click', () => applyTheme('dark'));
    purpleBtn.addEventListener('click', () => applyTheme('purple'));
    
    animationToggle.addEventListener('change', () => {
        userPreferences.animations = animationToggle.checked;
        savePreferences();
        
        // Demonstrate animation change
        if (userPreferences.animations && !userPreferences.reducedMotion) {
            cards.forEach(card => card.classList.add('pulse'));
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('pulse'));
            }, 1000);
        }
    });
    
    notificationToggle.addEventListener('change', () => {
        userPreferences.notifications = notificationToggle.checked;
        savePreferences();
    });
    
    reducedMotionToggle.addEventListener('change', () => {
        userPreferences.reducedMotion = reducedMotionToggle.checked;
        
        if (userPreferences.reducedMotion) {
            document.body.classList.add('reduced-motion');
            // Remove any active animations
            demoIcon.classList.remove('rotate-icon');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        savePreferences();
    });
    
    demoIcon.addEventListener('click', toggleIconAnimation);

    // Initialize
    checkSystemReducedMotion();
    loadPreferences();
    
    // Add fade-in animation to elements if animations enabled
    if (userPreferences.animations && !userPreferences.reducedMotion) {
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('fade-in');
        });
    }
});