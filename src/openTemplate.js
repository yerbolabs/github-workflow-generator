const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const openTemplate = (basePath, templateBasePath, templateName) => {
  const templatePath = path.join(basePath, templateBasePath, `${templateName}.yml`);
  const templateFile = fs.readFileSync(templatePath, 'utf-8');
  return yaml.load(templateFile);
}

module.exports = {
  openTemplate,
};
