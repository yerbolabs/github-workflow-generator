# Github Workflow Generator

Github Actions made generating CI pipelines a lot easier for a lot of people (since we were using
Github already), but there are still some missing features other CI providers handle and we want to
use here too.

One of those issues is the lack of support for steps and jobs definition reuse: each time we want to
have a different workflow, even if some jobs or steps are identical to an existing one, we have no
option but to copy over them into our workflow.

The idea of this utilitiy is to do a workaround for this lack of reusability by, instead of
generating the workflows ourselves, build templates for our steps, jobs and workflows that then get
smashed together into an automatically generated workflow.

## How do I start building templates?

The idea is that instead of writing a workflow yourself, you will create templates that are easily
composable and reusable.

Within the `.github` folder, you need to create a `templates` folder, and within it you need to
create three separate folders for `workflows`, `jobs` and `steps`.

Within those folders you can start putting together the diferent reusable pieces. For example, let's
say we have the following steps defined:

```yaml
# .github/templates/steps/checkout.yml
name: Checkout
uses: actions/checkout@v2

# .github/templates/steps/install-npm-dependencies
name: Install Dependencies
run: npm ci

# .github/templates/steps/lint.yml
name: Lint
run: npm run lint
```

You could define a job that runs this steps:

```yaml
# .github/templates/jobs/do-lint.yml
runs-on: ubuntu-latest
steps:
  - checkout
  - id: install-npm-dependencies
    env:
      CYPRESS_INSTALL_BINARY: 0
  - do-lint
```

and a workflow for that job:


```yaml
# .github/templates/workflows/pr-check.yml
name: Lint and Tests
on:
  [pull_request]
jobs:
  - do-lint
```

As you can see, each file follows the format of their corresponding counterpart on a full github
workflow, with a couple of differences:

- Instead of providing the full jobs/steps, you provide the *id* of a template that exists in one of
  the corresponding template folders. This id can be given as a simple string, or within an object
  using the key `id`.
- When using the object format to link a job/step, you can provide any other extra options that you
  would in a normal workflow. Those options will be merged with the original step definition,
  overwritting any defaults they may provide.

## How do I generate my workflows?

Once you have your templates in places, you can run the tool to generate your workflows in the
`.github/workflow` folder.

To run the tool, you can either:

- Install the tool globally:
  ```bash
    npm i -g @yerbolabs/github-workflow-generator
    gwg <your-first-workflow-name> <your-second-workflow-name>
  ```
- Use `npx`
  ```bash
    npx @yerbolabs/github-workflow-generator <your-first-workflow-name> <your-second-workflow-name>
  ```
- Install the tool into your project and add a script to regenerate all your workflows:
  ```json
    # package.json
    ...
    "scripts": {
      "generate-workflows": "gwg <your-first-workflow-name> <your-second-workflow-name>"
    },
    ...
  ```
  ```bash
    npm i --save-dev @yerbolabs/github-workflow-generator
    npm run generate-workflows
  ```
