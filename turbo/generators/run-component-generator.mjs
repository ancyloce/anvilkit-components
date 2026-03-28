import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const forwardedArgs = process.argv.slice(2);
const turboArgs =
  forwardedArgs.length > 0 && forwardedArgs[0] === '--'
    ? forwardedArgs.slice(1)
    : forwardedArgs;
const componentSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const scaffoldTypes = new Set(['content', 'layout', 'form']);

function toDisplayLabel(value) {
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function getScriptedComponentSlug(args) {
  const argsFlagIndex = args.indexOf('--args');

  if (argsFlagIndex !== -1) {
    return args[argsFlagIndex + 1];
  }

  const argsFlag = args.find((argument) => argument.startsWith('--args='));

  return argsFlag ? argsFlag.slice('--args='.length) : undefined;
}

function validateComponentSlug(value) {
  if (typeof value !== 'string') {
    return 'A component name is required.';
  }

  const componentSlug = value.trim();

  if (!componentSlug) {
    return 'A component name is required.';
  }

  if (!componentSlugPattern.test(componentSlug)) {
    return 'Component name must be a lowercase npm-safe slug like "input" or "button-group".';
  }

  if (existsSync(path.resolve('src', componentSlug))) {
    return `src/${componentSlug} already exists.`;
  }

  return null;
}

function validateScaffoldType(value) {
  if (typeof value !== 'string' || !scaffoldTypes.has(value)) {
    return 'Scaffold type must be one of: content, layout, form.';
  }

  return null;
}

function validateSuggestedCategory(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string' || !componentSlugPattern.test(value.trim())) {
    return 'Suggested category must be a lowercase slug like "forms" or "marketing".';
  }

  return null;
}

function normalizeLegacyArgs(args) {
  const argsFlagIndex = args.indexOf('--args');

  if (argsFlagIndex === -1) {
    return null;
  }

  const values = args.slice(argsFlagIndex + 1);

  if (values.length === 0) {
    return null;
  }

  const [name, label, scaffoldType = 'content', category = ''] = values;

  return ['--args', name, label ?? toDisplayLabel(name), scaffoldType, category];
}

function readFlagValue(args, flagName) {
  const prefixedFlag = `--${flagName}=`;

  for (let index = 0; index < args.length; index += 1) {
    const currentArg = args[index];

    if (currentArg === `--${flagName}`) {
      return args[index + 1];
    }

    if (currentArg.startsWith(prefixedFlag)) {
      return currentArg.slice(prefixedFlag.length);
    }
  }

  return undefined;
}

const usesNamedFlags =
  turboArgs.some((argument) => argument === '--name' || argument.startsWith('--name=')) ||
  turboArgs.some((argument) => argument === '--template' || argument.startsWith('--template=')) ||
  turboArgs.some((argument) => argument === '--label' || argument.startsWith('--label=')) ||
  turboArgs.some((argument) => argument === '--category' || argument.startsWith('--category='));

let resolvedTurboArgs = turboArgs;

if (usesNamedFlags) {
  const name = readFlagValue(turboArgs, 'name');
  const template = readFlagValue(turboArgs, 'template') ?? 'content';
  const label = readFlagValue(turboArgs, 'label');
  const category = readFlagValue(turboArgs, 'category') ?? '';
  const slugError = validateComponentSlug(name);
  const templateError = validateScaffoldType(template);
  const categoryError = validateSuggestedCategory(category);

  if (slugError) {
    console.error(slugError);
    process.exit(1);
  }

  if (templateError) {
    console.error(templateError);
    process.exit(1);
  }

  if (categoryError) {
    console.error(categoryError);
    process.exit(1);
  }

  resolvedTurboArgs = ['--args', name, label ?? toDisplayLabel(name), template, category];
} else {
  const legacyArgs = normalizeLegacyArgs(turboArgs);

  if (legacyArgs) {
    const [, name, , template, category] = legacyArgs;
    const slugError = validateComponentSlug(name);
    const templateError = validateScaffoldType(template);
    const categoryError = validateSuggestedCategory(category);

    if (slugError) {
      console.error(slugError);
      process.exit(1);
    }

    if (templateError) {
      console.error(templateError);
      process.exit(1);
    }

    if (categoryError) {
      console.error(categoryError);
      process.exit(1);
    }

    resolvedTurboArgs = legacyArgs;
  }
}

const scriptedComponentSlug = getScriptedComponentSlug(resolvedTurboArgs);

if (scriptedComponentSlug !== undefined) {
  const validationError = validateComponentSlug(scriptedComponentSlug);

  if (validationError) {
    console.error(validationError);
    process.exit(1);
  }
}

const turboBinary = path.resolve(
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'turbo.cmd' : 'turbo',
);
const sanitizedEnv = { ...process.env };

for (const key of Object.keys(sanitizedEnv)) {
  if (key.startsWith('npm_config_') || key.startsWith('npm_')) {
    delete sanitizedEnv[key];
  }
}

const result = spawnSync(turboBinary, ['gen', 'component', ...resolvedTurboArgs], {
  env: sanitizedEnv,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
