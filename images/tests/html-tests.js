/**
 * HTML Structure Tests
 * 
 * This file contains tests to verify the HTML structure of the website.
 * These tests check that all required elements are present and properly structured.
 */

// Import the necessary testing libraries
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// List of HTML files to test
const htmlFiles = [
  'index.html',
  'about.html',
  'terms-of-service.html',
  'privacy-policy.html',
  'disclaimer.html',
  'contact.html',
  'zoom-download.html'
];

// Function to read and parse HTML files
function parseHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  return new JSDOM(html);
}

// Test suite for HTML structure
describe('HTML Structure Tests', () => {
  // Test that all HTML files exist
  test('All HTML files exist', () => {
    htmlFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  // Test common structure for all HTML files
  htmlFiles.forEach(file => {
    describe(`${file} structure`, () => {
      let dom;
      
      beforeAll(() => {
        dom = parseHtmlFile(file);
      });

      // Test DOCTYPE and html tag
      test('Has proper DOCTYPE and html tag', () => {
        const html = dom.window.document.documentElement;
        expect(html.tagName).toBe('HTML');
        expect(html.getAttribute('lang')).toBe('en');
      });

      // Test head section
      test('Has proper head section', () => {
        const head = dom.window.document.head;
        expect(head.querySelector('meta[charset="UTF-8"]')).not.toBeNull();
        expect(head.querySelector('meta[name="viewport"]')).not.toBeNull();
        expect(head.querySelector('title')).not.toBeNull();
        expect(head.querySelector('link[rel="stylesheet"][href="styles.css"]')).not.toBeNull();
      });

      // Test header section
      test('Has proper header section', () => {
        const header = dom.window.document.querySelector('header');
        expect(header).not.toBeNull();
        
        const logo = header.querySelector('.logo');
        expect(logo).not.toBeNull();
        expect(logo.textContent).toBe('upingi.com');
        
        const nav = header.querySelector('nav');
        expect(nav).not.toBeNull();
        
        // Check navigation links
        const navLinks = nav.querySelectorAll('a');
        expect(navLinks.length).toBeGreaterThan(0);
        
        // Check that all nav links have href attributes
        navLinks.forEach(link => {
          expect(link.hasAttribute('href')).toBe(true);
        });
      });

      // Test main content section
      test('Has main content section', () => {
        const main = dom.window.document.querySelector('main');
        expect(main).not.toBeNull();
      });

      // Test footer section
      test('Has proper footer section', () => {
        const footer = dom.window.document.querySelector('footer');
        expect(footer).not.toBeNull();
        
        const footerLogo = footer.querySelector('.logo');
        expect(footerLogo).not.toBeNull();
        expect(footerLogo.textContent).toBe('upingi.com');
        
        const footerLinks = footer.querySelector('.footer-links');
        expect(footerLinks).not.toBeNull();
        
        // Check footer links
        const links = footerLinks.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
        
        // Check that all footer links have href attributes
        links.forEach(link => {
          expect(link.hasAttribute('href')).toBe(true);
        });
        
        // Check for disclaimer
        const disclaimer = footer.querySelector('.disclaimer');
        expect(disclaimer).not.toBeNull();
        expect(disclaimer.textContent).toContain('This site earns money through ads and links');
      });

      // Test script inclusion
      test('Includes scripts.js', () => {
        const script = dom.window.document.querySelector('script[src="scripts.js"]');
        expect(script).not.toBeNull();
      });
    });
  });

  // Test specific elements for index.html
  describe('index.html specific elements', () => {
    let dom;
    
    beforeAll(() => {
      dom = parseHtmlFile('index.html');
    });

    // Test featured section
    test('Has featured section', () => {
      const featured = dom.window.document.querySelector('.featured');
      expect(featured).not.toBeNull();
      
      const featuredImg = featured.querySelector('img');
      expect(featuredImg).not.toBeNull();
      
      const featuredTitle = featured.querySelector('h2');
      expect(featuredTitle).not.toBeNull();
      
      const featuredDesc = featured.querySelector('p');
      expect(featuredDesc).not.toBeNull();
      
      const featuredButton = featured.querySelector('.ad-button');
      expect(featuredButton).not.toBeNull();
    });

    // Test category sections
    test('Has category sections', () => {
      const categorySections = dom.window.document.querySelectorAll('.category-section');
      expect(categorySections.length).toBeGreaterThan(0);
      
      categorySections.forEach(section => {
        const title = section.querySelector('h2');
        expect(title).not.toBeNull();
        
        const grid = section.querySelector('.software-grid');
        expect(grid).not.toBeNull();
        
        const entries = grid.querySelectorAll('.software-entry');
        expect(entries.length).toBeGreaterThan(0);
      });
    });

    // Test banner ads
    test('Has banner ads', () => {
      const bannerAds = dom.window.document.querySelectorAll('.banner-ad');
      expect(bannerAds.length).toBeGreaterThan(0);
    });
  });

  // Test specific elements for contact.html
  describe('contact.html specific elements', () => {
    let dom;
    
    beforeAll(() => {
      dom = parseHtmlFile('contact.html');
    });

    // Test contact information
    test('Has contact information', () => {
      const contentText = dom.window.document.querySelector('.content-text');
      expect(contentText).not.toBeNull();
      
      const contactInfo = contentText.querySelector('.contact-info');
      expect(contactInfo).not.toBeNull();
      
      // Check for support hours
      const supportHours = contactInfo.querySelector('h3');
      expect(supportHours).not.toBeNull();
      expect(supportHours.textContent).toContain('Support Hours');
      
      // Check for email contact
      const emailContact = contentText.querySelector('p');
      expect(emailContact).not.toBeNull();
      expect(emailContact.textContent).toContain('support[at]upingi.com');
    });
  });
}); 