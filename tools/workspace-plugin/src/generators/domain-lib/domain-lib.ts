import {
  formatFiles,
  names,
  readProjectConfiguration,
  updateProjectConfiguration,
  type GeneratorCallback,
  type Generator,
  type Tree,
} from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import type { DomainLibGeneratorSchema } from './schema';

const VALID_TYPES = ['feature', 'ui', 'data', 'util', 'model'] as const;

/**
 * `domain-lib` generator — the workspace's headline DX automation.
 *
 * The pain it removes: every library in this monorepo must carry the right
 * `type:` and `scope:` tags, or the @nx/enforce-module-boundaries rule can't
 * protect the architecture. Tagging by hand on every `nx g library` is easy to
 * forget or get wrong. This generator makes the correct thing the default: you
 * pick a domain + layer, and it scaffolds the lib in the right folder, delegates
 * to the matching framework generator, and stamps the tags programmatically.
 *
 * Usage:
 *   nx g @org/workspace-plugin:domain-lib shop feature-cart --type=feature
 *   nx g @org/workspace-plugin:domain-lib admin data-orders --type=data --framework=react
 */
export async function domainLibGenerator(
  tree: Tree,
  options: DomainLibGeneratorSchema
): Promise<GeneratorCallback> {
  if (!VALID_TYPES.includes(options.type)) {
    throw new Error(
      `Invalid --type "${options.type}". Must be one of: ${VALID_TYPES.join(', ')}`
    );
  }

  const domain = names(options.domain).fileName;
  const name = names(options.name).fileName;
  const projectName = `${domain}-${name}`;
  const directory = `libs/${domain}/${name}`;
  const tags = [`type:${options.type}`, `scope:${domain}`];

  const framework = options.framework ?? 'none';
  const libraryGenerator = await resolveLibraryGenerator(framework);

  // Delegate the heavy lifting (files, tsconfig, jest/vitest, eslint, graph
  // registration) to the official generator, then enforce our tags.
  const callback = await libraryGenerator(tree, {
    name: projectName,
    directory,
    tags: tags.join(','),
    importPath: `@org/${domain}/${name}`,
    unitTestRunner: framework === 'react' ? 'vitest' : 'jest',
    bundler: 'none',
  } as never);

  // Belt-and-suspenders: the delegated generator already applies `tags`, but we
  // re-stamp to guarantee they're present regardless of generator version. Guard
  // it in case the resolved project name differs across Nx versions.
  try {
    const project = readProjectConfiguration(tree, projectName);
    project.tags = Array.from(new Set([...(project.tags ?? []), ...tags]));
    updateProjectConfiguration(tree, projectName, project);
  } catch {
    // Project registered under a different name by the delegated generator;
    // the tags passed above still apply.
  }

  await formatFiles(tree);
  return typeof callback === 'function' ? callback : () => undefined;
}

/**
 * Resolve the framework library generator on demand. The plugin only hard-
 * depends on @nx/js; @nx/react is imported lazily so the plugin doesn't fail to
 * load when react isn't installed and it's not requested.
 */
async function resolveLibraryGenerator(
  framework: 'none' | 'react'
): Promise<Generator> {
  if (framework === 'react') {
    const { libraryGenerator } = await import('@nx/react');
    return libraryGenerator;
  }
  return jsLibraryGenerator;
}

export default domainLibGenerator;
