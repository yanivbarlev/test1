const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Scripts.js Tests', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        // Set up a DOM environment
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <header>
                        <nav>
                            <a href="#home">Home</a>
                        </nav>
                    </header>
                    <main>
                        <div class="software-grid">
                            <div class="software-item">
                                <button class="ad-button">Download</button>
                            </div>
                        </div>
                    </main>
                    <aside class="sidebar">
                        <div class="software-item">
                            <button class="ad-button">GET</button>
                        </div>
                    </aside>
                    <div class="banner-ad"></div>
                </body>
            </html>
        `, { runScripts: 'dangerously' });

        window = dom.window;
        document = window.document;

        // Load scripts.js content
        const scriptContent = fs.readFileSync(path.resolve(__dirname, '../../scripts.js'), 'utf-8');
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);
    });

    test('Mobile view adjustments are applied correctly', () => {
        // Mock mobile viewport
        window.innerWidth = 767;
        
        // Trigger resize event
        window.dispatchEvent(new window.Event('resize'));

        // Check if sidebar is moved below main content
        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('main');
        expect(sidebar.nextElementSibling).toBe(null);
        expect(main.nextElementSibling).toBe(sidebar);

        // Check if grid is adjusted to single column
        const grid = document.querySelector('.software-grid');
        expect(grid.style.gridTemplateColumns).toBe('1fr');

        // Check if buttons are mobile-friendly
        const button = document.querySelector('.ad-button');
        expect(parseInt(button.style.minWidth)).toBeGreaterThanOrEqual(48);
        expect(parseInt(button.style.minHeight)).toBeGreaterThanOrEqual(48);
    });

    test('Desktop view layout is correct', () => {
        // Mock desktop viewport
        window.innerWidth = 1024;
        
        // Trigger resize event
        window.dispatchEvent(new window.Event('resize'));

        // Check if grid template is reset for desktop
        const grid = document.querySelector('.software-grid');
        expect(grid.style.gridTemplateColumns).toBe('');

        // Check if buttons are reset to default size
        const button = document.querySelector('.ad-button');
        expect(button.style.minWidth).toBe('');
        expect(button.style.minHeight).toBe('');
    });

    test('Ad button click behavior', () => {
        const button = document.querySelector('.ad-button');
        const windowSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

        // Simulate button click
        button.click();

        expect(windowSpy).toHaveBeenCalledWith('https://example.com/download', '_blank');
        windowSpy.mockRestore();
    });

    test('Mobile menu functionality', () => {
        // Mock mobile viewport
        window.innerWidth = 767;
        
        // Trigger resize event
        window.dispatchEvent(new window.Event('resize'));

        const menuButton = document.querySelector('.mobile-menu-button');
        const nav = document.querySelector('nav');

        expect(menuButton).toBeTruthy();
        expect(nav.style.display).toBe('none');

        // Test menu toggle
        menuButton.click();
        expect(nav.style.display).toBe('flex');
        expect(nav.style.flexDirection).toBe('column');

        menuButton.click();
        expect(nav.style.display).toBe('none');
    });

    test('Smooth scroll functionality', () => {
        const anchor = document.querySelector('a[href^="#"]');
        const scrollIntoViewMock = jest.fn();
        
        // Mock scrollIntoView
        Element.prototype.scrollIntoView = scrollIntoViewMock;

        // Simulate anchor click
        anchor.click();

        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
}); 