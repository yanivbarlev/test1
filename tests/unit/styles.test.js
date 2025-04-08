const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

describe('CSS Tests', () => {
    let cssContent;
    let parsedCss;

    beforeAll(async () => {
        cssContent = fs.readFileSync(path.resolve(__dirname, '../../styles.css'), 'utf-8');
        parsedCss = await postcss.parse(cssContent);
    });

    test('General styles are defined correctly', () => {
        const bodyRule = parsedCss.nodes.find(node => 
            node.selector === 'body'
        );
        expect(bodyRule).toBeTruthy();
        expect(bodyRule.nodes.some(n => n.prop === 'background' && n.value === '#FFFFFF')).toBeTruthy();
        expect(bodyRule.nodes.some(n => n.prop === 'color' && n.value === '#000000')).toBeTruthy();
        expect(bodyRule.nodes.some(n => n.prop === 'font-family' && n.value.includes('Arial'))).toBeTruthy();
    });

    test('Header styles are defined', () => {
        const headerRule = parsedCss.nodes.find(node => 
            node.selector === 'header'
        );
        expect(headerRule).toBeTruthy();
        expect(headerRule.nodes.some(n => n.prop === 'background' && n.value === '#FFFFFF')).toBeTruthy();
    });

    test('Ad button styles are defined correctly', () => {
        const buttonRule = parsedCss.nodes.find(node => 
            node.selector === '.ad-button'
        );
        expect(buttonRule).toBeTruthy();
        expect(buttonRule.nodes.some(n => n.prop === 'background' && n.value === '#00FF00')).toBeTruthy();
        expect(buttonRule.nodes.some(n => n.prop === 'color' && n.value === '#FFFFFF')).toBeTruthy();
    });

    test('Software grid layout is defined', () => {
        const gridRule = parsedCss.nodes.find(node => 
            node.selector === '.software-grid'
        );
        expect(gridRule).toBeTruthy();
        expect(gridRule.nodes.some(n => 
            n.prop === 'display' && n.value === 'grid'
        )).toBeTruthy();
    });

    test('Responsive design media queries exist', () => {
        const mobileQuery = parsedCss.nodes.find(node => 
            node.type === 'atrule' && 
            node.name === 'media' && 
            node.params.includes('768px')
        );
        expect(mobileQuery).toBeTruthy();
    });

    test('Sidebar styles are defined', () => {
        const sidebarRule = parsedCss.nodes.find(node => 
            node.selector === '.sidebar'
        );
        expect(sidebarRule).toBeTruthy();
    });

    test('Banner ad styles are defined', () => {
        const bannerRule = parsedCss.nodes.find(node => 
            node.selector === '.banner-ad'
        );
        expect(bannerRule).toBeTruthy();
        expect(bannerRule.nodes.some(n => n.prop === 'background')).toBeTruthy();
    });

    test('Typography styles are defined correctly', () => {
        const h1Rule = parsedCss.nodes.find(node => node.selector === 'h1');
        const h2Rule = parsedCss.nodes.find(node => node.selector === 'h2');
        const h3Rule = parsedCss.nodes.find(node => node.selector === 'h3');

        expect(h1Rule).toBeTruthy();
        expect(h2Rule).toBeTruthy();
        expect(h3Rule).toBeTruthy();

        expect(h1Rule.nodes.some(n => n.prop === 'font-size' && n.value === '24px')).toBeTruthy();
        expect(h2Rule.nodes.some(n => n.prop === 'font-size' && n.value === '20px')).toBeTruthy();
        expect(h3Rule.nodes.some(n => n.prop === 'font-size' && n.value === '18px')).toBeTruthy();
    });
}); 