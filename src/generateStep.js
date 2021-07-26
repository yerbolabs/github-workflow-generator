const R = require('ramda');
const { openTemplate } = require('./openTemplate');

const STEP_TEMPLATES_PATH = 'steps';

const generateStep = (basePath, stepSpec) => {
  const stepDefinition = R.is(String, stepSpec) ? { id: stepSpec } : stepSpec;
  const baseStep = openTemplate(basePath, STEP_TEMPLATES_PATH, stepDefinition.id)

  const step = {
    ...baseStep,
    ...stepDefinition,
  };

  return step;
};

module.exports = {
  generateStep,
};
