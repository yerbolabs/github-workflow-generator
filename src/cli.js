#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { generateWorkflow } = require('./generateWorkflow');

const TEMPLATES_BASE_PATH = ['.github', 'templates'];
const WORKFLOWS_PATH = ['.github', 'workflows'];
const KEY_ORDER = ['id', 'name', 'uses', 'env', 'with', 'run', 'runs-on', 'needs', 'strategy', 'if', 'steps'];
const getKeyOrder = (key) => (KEY_ORDER.indexOf(key) >= 0 ? KEY_ORDER.indexOf(key) : 100);
const sortKeys = (a, b) => getKeyOrder(a) - getKeyOrder(b);

const run = (workflowName)  => {
  if (workflowName == null) {
    console.error('You must provide a workflow name');
    return;
  }

  const basePath = path.join(process.cwd(), ...TEMPLATES_BASE_PATH);
  const workflow = generateWorkflow(basePath, workflowName);
  const workflowYaml = yaml.dump(workflow, { lineWidth: -1, sortKeys });

  const outputPath = path.join(process.cwd(), ...WORKFLOWS_PATH, `${workflowName}.yml`);
  fs.writeFileSync(outputPath, workflowYaml);
}

run(process.argv[2])
