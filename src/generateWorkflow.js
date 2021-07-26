const R = require('ramda');
const { openTemplate } = require('./openTemplate');
const { generateJob } = require('./generateJob');

const WORKFLOW_TEMPLATES_PATH = 'workflows';

const generateWorkflow = (basePath, workflowName) => {
  const baseWorkflow = openTemplate(basePath, WORKFLOW_TEMPLATES_PATH, workflowName)

  const jobs = R.compose(
    R.mergeAll,
    R.chain(R.partial(generateJob, [basePath])),
  )(baseWorkflow.jobs);

  return {
    ...baseWorkflow,
    jobs,
  };
};

module.exports = {
  generateWorkflow,
};
