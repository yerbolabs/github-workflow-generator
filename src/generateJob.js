const R = require('ramda');
const { openTemplate } = require('./openTemplate');
const { generateStep } = require('./generateStep');

const JOB_TEMPLATES_PATH = 'jobs';

const generateJob = (basePath, jobSpec) => {
  const { id, ...jobDefinition } = R.is(String, jobSpec) ? { id: jobSpec } : jobSpec;
  const baseJob = openTemplate(basePath, JOB_TEMPLATES_PATH, id)

  const steps = R.chain(R.partial(generateStep, [basePath]))(baseJob.steps);
  const job = {
    [id]: {
      ...baseJob,
      ...jobDefinition,
      steps,
    },
  };
  const neededJobs = R.compose(
    R.chain(R.partial(generateJob, [basePath])),
    R.when(R.is(String), R.of),
    R.pathOr([], [id, 'needs']),
  )(job);

  return [
    ...neededJobs,
    job,
  ];
};

module.exports = {
  generateJob,
};
