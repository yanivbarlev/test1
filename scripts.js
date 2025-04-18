// Initialize the adsbygoogle object
window.adsbygoogle = window.adsbygoogle || {
    push: function() {
        console.log('Ad pushed to adsbygoogle');
    }
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle responsive layout adjustments
    function adjustLayout() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('main');
        const softwareGrid = document.querySelectorAll('.software-grid');
        
        // Check if we're on mobile view
        if (window.innerWidth <= 768) {
            // Move sidebar below main content on mobile
            if (sidebar && mainContent) {
                mainContent.parentNode.insertBefore(sidebar, mainContent.nextSibling);
            }
            
            // Adjust grid layout for mobile
            softwareGrid.forEach(grid => {
                grid.style.gridTemplateColumns = '1fr';
            });
            
            // Ensure buttons are tappable on mobile
            const adButtons = document.querySelectorAll('.ad-button');
            adButtons.forEach(button => {
                button.style.minWidth = '48px';
                button.style.minHeight = '48px';
                button.style.padding = '12px 24px';
            });
        } else {
            // On desktop, ensure sidebar is properly positioned
            if (sidebar && mainContent) {
                // The CSS will handle the positioning on desktop
            }
            
            // Reset grid layout for desktop
            softwareGrid.forEach(grid => {
                grid.style.gridTemplateColumns = '';
            });
            
            // Reset button sizes for desktop
            const adButtons = document.querySelectorAll('.ad-button');
            adButtons.forEach(button => {
                button.style.minWidth = '';
                button.style.minHeight = '';
                button.style.padding = '';
            });
        }
    }
    
    // Run the adjustment function on page load
    adjustLayout();
    
    // Run the adjustment function when the window is resized
    window.addEventListener('resize', adjustLayout);
    
    // Add click event listeners to ad buttons
    const adButtons = document.querySelectorAll('.ad-button');
    adButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get the onclick attribute value
            const onclickAttr = this.getAttribute('onclick');
            
            // If there's no onclick attribute, use a default URL
            if (!onclickAttr) {
                // In a real implementation, this would trigger the ad
                console.log('Ad button clicked:', this.textContent);
                window.open('https://example.com/download', '_blank');
            }
            
            // Prevent the default button behavior
            e.preventDefault();
        });
    });
    
    // Initialize banner ads
    const bannerAds = document.querySelectorAll('.banner-ad');
    bannerAds.forEach(ad => {
        // In a real implementation, this would initialize the ad
        console.log('Banner ad initialized');
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add mobile menu toggle functionality
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        if (header && nav && window.innerWidth <= 768) {
            // Create mobile menu button
            const menuButton = document.createElement('button');
            menuButton.className = 'mobile-menu-button';
            menuButton.innerHTML = '☰';
            menuButton.style.display = 'block';
            menuButton.style.background = 'none';
            menuButton.style.border = 'none';
            menuButton.style.fontSize = '24px';
            menuButton.style.cursor = 'pointer';
            menuButton.style.padding = '10px';
            
            // Insert button before nav
            header.insertBefore(menuButton, nav);
            
            // Initially hide the nav on mobile
            nav.style.display = 'none';
            
            // Toggle menu on button click
            menuButton.addEventListener('click', () => {
                if (nav.style.display === 'none') {
                    nav.style.display = 'flex';
                    nav.style.flexDirection = 'column';
                    nav.style.width = '100%';
                    nav.style.marginTop = '10px';
                } else {
                    nav.style.display = 'none';
                }
            });
        }
    };
    
    // Create mobile menu if needed
    createMobileMenu();
    
    // Recreate mobile menu on resize
    window.addEventListener('resize', () => {
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.remove();
        }
        
        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.display = '';
            nav.style.flexDirection = '';
            nav.style.width = '';
            nav.style.marginTop = '';
        }
        
        createMobileMenu();
    });

    // --- User Engagement Features --- 

    document.addEventListener('DOMContentLoaded', () => {
        // --- Feedback Buttons --- 
        const feedbackSection = document.querySelector('.feedback-section');
        if (feedbackSection) {
            const thumbsUpBtn = feedbackSection.querySelector('.thumbs-up');
            const thumbsDownBtn = feedbackSection.querySelector('.thumbs-down');
            const feedbackMessage = feedbackSection.querySelector('.feedback-message');

            const handleFeedbackClick = (selectedBtn) => {
                // Indicate selection
                thumbsUpBtn.classList.remove('selected');
                thumbsDownBtn.classList.remove('selected');
                selectedBtn.classList.add('selected');
                
                // Disable buttons after click
                thumbsUpBtn.disabled = true;
                thumbsDownBtn.disabled = true;

                // Show thank you message
                if (feedbackMessage) {
                    feedbackMessage.style.display = 'inline';
                }
            };

            if (thumbsUpBtn) {
                thumbsUpBtn.addEventListener('click', () => handleFeedbackClick(thumbsUpBtn));
            }
            if (thumbsDownBtn) {
                thumbsDownBtn.addEventListener('click', () => handleFeedbackClick(thumbsDownBtn));
            }
        }

        // --- Comment Form --- 
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            const commentsDisplay = document.querySelector('.comments-display');
            const noCommentsMessage = document.querySelector('.comments-section > p'); // The 'Be the first...' message

            commentForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent page reload

                const nameInput = commentForm.querySelector('#comment-name');
                const commentInput = commentForm.querySelector('#comment-text');
                const name = nameInput.value.trim();
                const commentText = commentInput.value.trim();

                if (name && commentText && commentsDisplay) {
                    // Hide the 'Be the first...' message if it's visible
                    if (noCommentsMessage && window.getComputedStyle(noCommentsMessage).display !== 'none') {
                        noCommentsMessage.style.display = 'none';
                    }

                    // Create new comment element
                    const newComment = document.createElement('div');
                    newComment.classList.add('comment');

                    const authorInfo = document.createElement('p');
                    const strong = document.createElement('strong');
                    strong.textContent = name;
                    const dateSpan = document.createElement('span');
                    dateSpan.classList.add('comment-date');
                    dateSpan.textContent = ` - ${new Date().toLocaleDateString()}`;
                    authorInfo.appendChild(strong);
                    authorInfo.appendChild(dateSpan);
                    
                    const commentContent = document.createElement('p');
                    commentContent.textContent = commentText;

                    newComment.appendChild(authorInfo);
                    newComment.appendChild(commentContent);

                    // Append to the display area
                    commentsDisplay.appendChild(newComment);

                    // Clear the form
                    nameInput.value = '';
                    commentInput.value = '';
                    // Optionally clear email too, if needed
                    // commentForm.querySelector('#comment-email').value = '';
                }
            });
        }
    });
}); 