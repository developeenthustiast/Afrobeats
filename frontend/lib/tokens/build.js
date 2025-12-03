const StyleDictionary = require('style-dictionary');

// Custom formatter for CSS custom properties
StyleDictionary.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary) {
        return `:root {\n${dictionary.allProperties
            .map(prop => {
                // Handle token references
                let value = prop.value;
                if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                    // Convert {color.primitive.slate.50} to var(--color-primitive-slate-50)
                    const tokenPath = value.slice(1, -1).split('.').join('-');
                    value = `var(--${tokenPath})`;
                }
                return `  --${prop.name}: ${value};`;
            })
            .join('\n')}\n}\n`;
    }
});

// Custom transform for token names
StyleDictionary.registerTransform({
    name: 'name/cti/kebab',
    type: 'name',
    transformer: function (prop) {
        return prop.path.join('-');
    }
});

const config = {
    source: ['lib/tokens/tokens.json'],
    platforms: {
        css: {
            transformGroup: 'css',
            transforms: ['name/cti/kebab'],
            buildPath: 'app/',
            files: [{
                destination: 'tokens.css',
                format: 'css/variables'
            }]
        },
        js: {
            transformGroup: 'js',
            buildPath: 'lib/tokens/',
            files: [{
                destination: 'tokens.js',
                format: 'javascript/es6'
            }]
        }
    }
};

module.exports = config;
