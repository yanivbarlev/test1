/**
 * CSS Style Tests
 * 
 * This file contains tests to verify the CSS styles of the website.
 * These tests check that all required styles are present and properly defined.
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const css = require('css');

// Function to read and parse CSS file
function parseCssFile(filePath) {
  const cssContent = fs.readFileSync(filePath, 'utf8');
  return css.parse(cssContent);
}

// Test suite for CSS styles
describe('CSS Style Tests', () => {
  let cssAst;
  
  beforeAll(() => {
    cssAst = parseCssFile('styles.css');
  });

  // Test that the CSS file exists
  test('CSS file exists', () => {
    expect(fs.existsSync('styles.css')).toBe(true);
  });

  // Test general styles
  describe('General Styles', () => {
    test('Has body styles', () => {
      const bodyRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('body')
      );
      expect(bodyRule).not.toBeNull();
      expect(bodyRule.declarations.some(decl => decl.property === 'background')).toBe(true);
      expect(bodyRule.declarations.some(decl => decl.property === 'color')).toBe(true);
      expect(bodyRule.declarations.some(decl => decl.property === 'font-family')).toBe(true);
    });

    test('Has heading styles', () => {
      const h1Rule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('h1')
      );
      expect(h1Rule).not.toBeNull();
      
      const h2Rule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('h2')
      );
      expect(h2Rule).not.toBeNull();
      
      const h3Rule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('h3')
      );
      expect(h3Rule).not.toBeNull();
    });

    test('Has link styles', () => {
      const aRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('a')
      );
      expect(aRule).not.toBeNull();
      expect(aRule.declarations.some(decl => decl.property === 'text-decoration')).toBe(true);
      expect(aRule.declarations.some(decl => decl.property === 'color')).toBe(true);
    });
  });

  // Test header styles
  describe('Header Styles', () => {
    test('Has header styles', () => {
      const headerRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('header')
      );
      expect(headerRule).not.toBeNull();
      expect(headerRule.declarations.some(decl => decl.property === 'background')).toBe(true);
      expect(headerRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
      expect(headerRule.declarations.some(decl => decl.property === 'display')).toBe(true);
    });

    test('Has logo styles', () => {
      const logoRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.logo')
      );
      expect(logoRule).not.toBeNull();
      expect(logoRule.declarations.some(decl => decl.property === 'color')).toBe(true);
    });

    test('Has navigation styles', () => {
      const navRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('nav')
      );
      expect(navRule).not.toBeNull();
      expect(navRule.declarations.some(decl => decl.property === 'display')).toBe(true);
      expect(navRule.declarations.some(decl => decl.property === 'gap')).toBe(true);
    });
  });

  // Test main content styles
  describe('Main Content Styles', () => {
    test('Has main styles', () => {
      const mainRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('main')
      );
      expect(mainRule).not.toBeNull();
      expect(mainRule.declarations.some(decl => decl.property === 'max-width')).toBe(true);
      expect(mainRule.declarations.some(decl => decl.property === 'margin')).toBe(true);
      expect(mainRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
    });

    test('Has featured section styles', () => {
      const featuredRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.featured')
      );
      expect(featuredRule).not.toBeNull();
      expect(featuredRule.declarations.some(decl => decl.property === 'margin-bottom')).toBe(true);
      expect(featuredRule.declarations.some(decl => decl.property === 'text-align')).toBe(true);
    });

    test('Has category section styles', () => {
      const categoryRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.category-section')
      );
      expect(categoryRule).not.toBeNull();
      expect(categoryRule.declarations.some(decl => decl.property === 'margin-bottom')).toBe(true);
      expect(categoryRule.declarations.some(decl => decl.property === 'text-align')).toBe(true);
    });

    test('Has software grid styles', () => {
      const gridRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.software-grid')
      );
      expect(gridRule).not.toBeNull();
      expect(gridRule.declarations.some(decl => decl.property === 'display')).toBe(true);
      expect(gridRule.declarations.some(decl => decl.property === 'grid-template-columns')).toBe(true);
      expect(gridRule.declarations.some(decl => decl.property === 'gap')).toBe(true);
    });

    test('Has software entry styles', () => {
      const entryRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.software-entry')
      );
      expect(entryRule).not.toBeNull();
      expect(entryRule.declarations.some(decl => decl.property === 'background-color')).toBe(true);
      expect(entryRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
      expect(entryRule.declarations.some(decl => decl.property === 'border-radius')).toBe(true);
      expect(entryRule.declarations.some(decl => decl.property === 'text-align')).toBe(true);
    });

    test('Has ad button styles', () => {
      const buttonRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.ad-button')
      );
      expect(buttonRule).not.toBeNull();
      expect(buttonRule.declarations.some(decl => decl.property === 'background')).toBe(true);
      expect(buttonRule.declarations.some(decl => decl.property === 'color')).toBe(true);
      expect(buttonRule.declarations.some(decl => decl.property === 'font-weight')).toBe(true);
      expect(buttonRule.declarations.some(decl => decl.property === 'border-radius')).toBe(true);
      expect(buttonRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
      expect(buttonRule.declarations.some(decl => decl.property === 'border')).toBe(true);
      expect(buttonRule.declarations.some(decl => decl.property === 'cursor')).toBe(true);
    });

    test('Has banner ad styles', () => {
      const bannerRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.banner-ad')
      );
      expect(bannerRule).not.toBeNull();
      expect(bannerRule.declarations.some(decl => decl.property === 'width')).toBe(true);
      expect(bannerRule.declarations.some(decl => decl.property === 'height')).toBe(true);
      expect(bannerRule.declarations.some(decl => decl.property === 'background')).toBe(true);
      expect(bannerRule.declarations.some(decl => decl.property === 'margin')).toBe(true);
      expect(bannerRule.declarations.some(decl => decl.property === 'display')).toBe(true);
      expect(bannerRule.declarations.some(decl => decl.property === 'justify-content')).toBe(true);
      expect(bannerRule.declarations.some(decl => decl.property === 'align-items')).toBe(true);
    });
  });

  // Test footer styles
  describe('Footer Styles', () => {
    test('Has footer styles', () => {
      const footerRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('footer')
      );
      expect(footerRule).not.toBeNull();
      expect(footerRule.declarations.some(decl => decl.property === 'background')).toBe(true);
      expect(footerRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
      expect(footerRule.declarations.some(decl => decl.property === 'text-align')).toBe(true);
      expect(footerRule.declarations.some(decl => decl.property === 'margin-top')).toBe(true);
    });

    test('Has footer links styles', () => {
      const linksRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.footer-links')
      );
      expect(linksRule).not.toBeNull();
      expect(linksRule.declarations.some(decl => decl.property === 'margin')).toBe(true);
    });

    test('Has disclaimer styles', () => {
      const disclaimerRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.disclaimer')
      );
      expect(disclaimerRule).not.toBeNull();
      expect(disclaimerRule.declarations.some(decl => decl.property === 'font-size')).toBe(true);
      expect(disclaimerRule.declarations.some(decl => decl.property === 'color')).toBe(true);
    });
  });

  // Test responsive design
  describe('Responsive Design', () => {
    test('Has media queries', () => {
      const mediaQueries = cssAst.stylesheet.rules.filter(rule => rule.type === 'media');
      expect(mediaQueries.length).toBeGreaterThan(0);
      
      // Check for mobile breakpoint
      const mobileQuery = mediaQueries.find(query => 
        query.media.includes('max-width: 768px')
      );
      expect(mobileQuery).not.toBeNull();
    });

    test('Has responsive styles for software grid', () => {
      const mediaQueries = cssAst.stylesheet.rules.filter(rule => rule.type === 'media');
      const mobileQuery = mediaQueries.find(query => 
        query.media.includes('max-width: 768px')
      );
      
      const gridRule = mobileQuery.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.software-grid')
      );
      expect(gridRule).not.toBeNull();
      expect(gridRule.declarations.some(decl => decl.property === 'grid-template-columns')).toBe(true);
    });

    test('Has responsive styles for banner ads', () => {
      const mediaQueries = cssAst.stylesheet.rules.filter(rule => rule.type === 'media');
      const mobileQuery = mediaQueries.find(query => 
        query.media.includes('max-width: 768px')
      );
      
      const bannerRule = mobileQuery.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.banner-ad')
      );
      expect(bannerRule).not.toBeNull();
      expect(bannerRule.declarations.some(decl => decl.property === 'width')).toBe(true);
    });
  });

  // Test content section styles
  describe('Content Section Styles', () => {
    test('Has content section styles', () => {
      const contentRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.content-section')
      );
      expect(contentRule).not.toBeNull();
      expect(contentRule.declarations.some(decl => decl.property === 'max-width')).toBe(true);
      expect(contentRule.declarations.some(decl => decl.property === 'margin')).toBe(true);
      expect(contentRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
    });

    test('Has content text styles', () => {
      const textRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.content-text')
      );
      expect(textRule).not.toBeNull();
      expect(textRule.declarations.some(decl => decl.property === 'background-color')).toBe(true);
      expect(textRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
      expect(textRule.declarations.some(decl => decl.property === 'border-radius')).toBe(true);
      expect(textRule.declarations.some(decl => decl.property === 'margin-top')).toBe(true);
    });

    test('Has contact info styles', () => {
      const contactRule = cssAst.stylesheet.rules.find(rule => 
        rule.type === 'rule' && 
        rule.selectors.includes('.contact-info')
      );
      expect(contactRule).not.toBeNull();
      expect(contactRule.declarations.some(decl => decl.property === 'background-color')).toBe(true);
      expect(contactRule.declarations.some(decl => decl.property === 'padding')).toBe(true);
      expect(contactRule.declarations.some(decl => decl.property === 'border-radius')).toBe(true);
      expect(contactRule.declarations.some(decl => decl.property === 'margin-top')).toBe(true);
      expect(contactRule.declarations.some(decl => decl.property === 'box-shadow')).toBe(true);
    });
  });
}); 