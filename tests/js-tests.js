/**
 * JavaScript Functionality Tests
 * 
 * This file contains tests to verify the JavaScript functionality of the website.
 * These tests check that all required functionality is present and working correctly.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Function to read and parse HTML file
function parseHtmlFile(filePath) {
  const htmlContent = fs.readFileSync(filePath, 'utf8');
  return new JSDOM(htmlContent);
}

// Test suite for JavaScript functionality
describe('JavaScript Functionality Tests', () => {
  let dom;
  let document;
  let window;
  
  beforeAll(() => {
    // Load the main HTML file
    dom = parseHtmlFile('index.html');
    document = dom.window.document;
    window = dom.window;
    
    // Mock the window.adsbygoogle object
    window.adsbygoogle = {
      push: jest.fn()
    };
  });

  // Test ad functionality
  describe('Ad Functionality', () => {
    test('Ad buttons have correct attributes', () => {
      const adButtons = document.querySelectorAll('.ad-button');
      adButtons.forEach(button => {
        expect(button.hasAttribute('data-ad-client')).toBe(true);
        expect(button.hasAttribute('data-ad-slot')).toBe(true);
        expect(button.hasAttribute('onclick')).toBe(true);
      });
    });

    test('Ad buttons have correct onclick handler', () => {
      const adButtons = document.querySelectorAll('.ad-button');
      adButtons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        expect(onclickAttr).toContain('window.open');
        expect(onclickAttr).toContain('_blank');
      });
    });

    test('Banner ads have correct attributes', () => {
      const bannerAds = document.querySelectorAll('.banner-ad');
      bannerAds.forEach(ad => {
        expect(ad.hasAttribute('data-ad-client')).toBe(true);
        expect(ad.hasAttribute('data-ad-slot')).toBe(true);
        expect(ad.hasAttribute('data-ad-format')).toBe(true);
        expect(ad.hasAttribute('data-full-width-responsive')).toBe(true);
      });
    });
  });

  // Test navigation functionality
  describe('Navigation Functionality', () => {
    test('Navigation links are present', () => {
      const navLinks = document.querySelectorAll('nav a');
      expect(navLinks.length).toBeGreaterThan(0);
      
      // Check that each link has an href attribute
      navLinks.forEach(link => {
        expect(link.hasAttribute('href')).toBe(true);
      });
    });

    test('Navigation links point to valid pages', () => {
      const navLinks = document.querySelectorAll('nav a');
      const validPages = [
        'index.html',
        'about.html',
        'terms-of-service.html',
        'privacy-policy.html',
        'disclaimer.html',
        'contact.html'
      ];
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(validPages).toContain(href);
      });
    });
  });

  // Test footer functionality
  describe('Footer Functionality', () => {
    test('Footer links are present', () => {
      const footerLinks = document.querySelectorAll('footer a');
      expect(footerLinks.length).toBeGreaterThan(0);
      
      // Check that each link has an href attribute
      footerLinks.forEach(link => {
        expect(link.hasAttribute('href')).toBe(true);
      });
    });

    test('Footer links point to valid pages', () => {
      const footerLinks = document.querySelectorAll('footer a');
      const validPages = [
        'about.html',
        'terms-of-service.html',
        'privacy-policy.html',
        'disclaimer.html',
        'contact.html'
      ];
      
      footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(validPages).toContain(href);
      });
    });

    test('Disclaimer text is present', () => {
      const disclaimer = document.querySelector('.disclaimer');
      expect(disclaimer).not.toBeNull();
      expect(disclaimer.textContent).toContain('This site is monetized through ads and affiliate links');
    });
  });

  // Test software grid functionality
  describe('Software Grid Functionality', () => {
    test('Software grid is present', () => {
      const softwareGrid = document.querySelector('.software-grid');
      expect(softwareGrid).not.toBeNull();
    });

    test('Software entries are present', () => {
      const softwareEntries = document.querySelectorAll('.software-entry');
      expect(softwareEntries.length).toBeGreaterThan(0);
    });

    test('Software entries have required elements', () => {
      const softwareEntries = document.querySelectorAll('.software-entry');
      softwareEntries.forEach(entry => {
        // Check for image
        const image = entry.querySelector('img');
        expect(image).not.toBeNull();
        expect(image.hasAttribute('src')).toBe(true);
        expect(image.hasAttribute('alt')).toBe(true);
        
        // Check for title
        const title = entry.querySelector('h3');
        expect(title).not.toBeNull();
        
        // Check for description
        const description = entry.querySelector('p');
        expect(description).not.toBeNull();
        
        // Check for download button
        const button = entry.querySelector('.ad-button');
        expect(button).not.toBeNull();
      });
    });
  });

  // Test responsive design functionality
  describe('Responsive Design Functionality', () => {
    test('Viewport meta tag is present', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).not.toBeNull();
      expect(viewport.getAttribute('content')).toContain('width=device-width');
      expect(viewport.getAttribute('content')).toContain('initial-scale=1.0');
    });

    test('CSS media queries are loaded', () => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      let hasMediaQueries = false;
      
      stylesheets.forEach(sheet => {
        if (sheet.hasAttribute('media')) {
          hasMediaQueries = true;
        }
      });
      
      expect(hasMediaQueries).toBe(true);
    });
  });

  // Test content section functionality
  describe('Content Section Functionality', () => {
    test('Content sections are present', () => {
      const contentSections = document.querySelectorAll('.content-section');
      expect(contentSections.length).toBeGreaterThan(0);
    });

    test('Content sections have required elements', () => {
      const contentSections = document.querySelectorAll('.content-section');
      contentSections.forEach(section => {
        // Check for heading
        const heading = section.querySelector('h2');
        expect(heading).not.toBeNull();
        
        // Check for content text
        const contentText = section.querySelector('.content-text');
        expect(contentText).not.toBeNull();
        
        // Check for paragraphs
        const paragraphs = contentText.querySelectorAll('p');
        expect(paragraphs.length).toBeGreaterThan(0);
      });
    });
  });

  // Test contact form functionality
  describe('Contact Form Functionality', () => {
    test('Contact form is present on contact page', () => {
      const contactDom = parseHtmlFile('contact.html');
      const contactDocument = contactDom.window.document;
      const contactForm = contactDocument.querySelector('form');
      expect(contactForm).not.toBeNull();
    });

    test('Contact form has required fields', () => {
      const contactDom = parseHtmlFile('contact.html');
      const contactDocument = contactDom.window.document;
      const contactForm = contactDocument.querySelector('form');
      
      // Check for name field
      const nameField = contactForm.querySelector('input[name="name"]');
      expect(nameField).not.toBeNull();
      expect(nameField.hasAttribute('required')).toBe(true);
      
      // Check for email field
      const emailField = contactForm.querySelector('input[name="email"]');
      expect(emailField).not.toBeNull();
      expect(emailField.hasAttribute('required')).toBe(true);
      expect(emailField.getAttribute('type')).toBe('email');
      
      // Check for message field
      const messageField = contactForm.querySelector('textarea[name="message"]');
      expect(messageField).not.toBeNull();
      expect(messageField.hasAttribute('required')).toBe(true);
      
      // Check for submit button
      const submitButton = contactForm.querySelector('button[type="submit"]');
      expect(submitButton).not.toBeNull();
    });

    test('Contact form has correct action and method', () => {
      const contactDom = parseHtmlFile('contact.html');
      const contactDocument = contactDom.window.document;
      const contactForm = contactDocument.querySelector('form');
      
      expect(contactForm.getAttribute('method')).toBe('post');
      expect(contactForm.getAttribute('action')).toBe('submit-contact.php');
    });
  });
}); 