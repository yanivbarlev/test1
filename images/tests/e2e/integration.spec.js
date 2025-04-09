describe('Upingi.com End-to-End Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Homepage loads correctly', () => {
        // Check header elements
        cy.get('header').should('be.visible');
        cy.get('header h1').should('contain', 'upingi.com');
        cy.get('nav').should('be.visible');
        cy.get('nav a').should('have.length.at.least', 4);

        // Check main content sections
        cy.get('.software-grid').should('have.length', 2); // Productivity and Games sections
        cy.get('.software-grid').first().find('.software-item').should('have.length', 8);
        
        // Check sidebar
        cy.get('.sidebar').should('be.visible');
        cy.get('.sidebar .software-item').should('have.length', 8);
        
        // Check banner ad
        cy.get('.banner-ad').should('be.visible');
    });

    it('Product page loads correctly', () => {
        cy.visit('/zoom-download.html');
        
        // Check software details
        cy.get('h1').should('contain', 'Zoom');
        cy.get('.software-details').should('be.visible');
        cy.get('.features').should('be.visible');
        
        // Check download buttons
        cy.get('.ad-button').should('have.length.at.least', 2);
        
        // Check related software section
        cy.get('.related-software').should('be.visible');
        cy.get('.related-software .software-item').should('have.length', 4);
    });

    it('Responsive design works on mobile', () => {
        // Set viewport to mobile size
        cy.viewport('iphone-6');
        
        // Check if mobile menu button appears
        cy.get('.mobile-menu-button').should('be.visible');
        
        // Check if navigation is hidden initially
        cy.get('nav').should('not.be.visible');
        
        // Click menu button and verify nav appears
        cy.get('.mobile-menu-button').click();
        cy.get('nav').should('be.visible');
        
        // Check if grid becomes single column
        cy.get('.software-grid').should('have.css', 'grid-template-columns', '1fr');
        
        // Check if sidebar moves below main content
        cy.get('main').then($main => {
            cy.get('.sidebar').should($sidebar => {
                expect($main.offset().top).to.be.lessThan($sidebar.offset().top);
            });
        });
    });

    it('Ad buttons work correctly', () => {
        // Intercept window.open calls
        cy.window().then(win => {
            cy.stub(win, 'open').as('windowOpen');
        });
        
        // Click ad button and verify window.open was called
        cy.get('.ad-button').first().click();
        cy.get('@windowOpen').should('have.been.calledWith', 'https://example.com/download', '_blank');
    });

    it('Navigation works correctly', () => {
        // Check all nav links
        cy.get('nav a').each($link => {
            const href = $link.attr('href');
            if (href.startsWith('#')) {
                // For anchor links, check smooth scroll
                cy.wrap($link).click();
                cy.get(href).should('be.visible');
            } else {
                // For page links, check navigation
                cy.visit(href);
                cy.url().should('include', href);
            }
        });
    });

    it('Footer links work correctly', () => {
        // Check all footer links exist and work
        cy.get('footer a').should('have.length.at.least', 4);
        cy.get('footer a[href="about.html"]').should('exist');
        cy.get('footer a[href="terms-of-service.html"]').should('exist');
        cy.get('footer a[href="privacy-policy.html"]').should('exist');
        cy.get('footer a[href="disclaimer.html"]').should('exist');
    });
}); 