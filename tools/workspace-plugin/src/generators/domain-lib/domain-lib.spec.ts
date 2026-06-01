import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addProjectConfiguration, readJson, type Tree } from '@nx/devkit';
import type { DomainLibGeneratorSchema } from './schema';

// Mock the delegated @nx/js generator so the unit test exercises OUR logic
// (naming, directory, tags, importPath, re-stamping) without running the real
// generator, which uses dynamic import() that Jest can't load by default.
const libraryGeneratorMock = jest.fn(
  (tree: Tree, opts: { name: string; directory: string; tags?: string }) => {
    addProjectConfiguration(tree, opts.name, {
      root: opts.directory,
      projectType: 'library',
      sourceRoot: `${opts.directory}/src`,
      tags: opts.tags ? opts.tags.split(',') : [],
      targets: {},
    });
    return Promise.resolve(() => undefined);
  }
);

jest.mock('@nx/js', () => ({
  libraryGenerator: (tree: Tree, opts: never) =>
    libraryGeneratorMock(tree, opts),
}));

// Import after the mock is registered.
import { domainLibGenerator } from './domain-lib';

describe('domain-lib generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    libraryGeneratorMock.mockClear();
  });

  it('delegates with the right path/name/importPath and applies type+scope tags', async () => {
    const options: DomainLibGeneratorSchema = {
      domain: 'billing',
      name: 'util-tax',
      type: 'util',
      framework: 'none',
    };
    await domainLibGenerator(tree, options);

    // Our logic computed the right delegated options.
    expect(libraryGeneratorMock).toHaveBeenCalledWith(
      tree,
      expect.objectContaining({
        name: 'billing-util-tax',
        directory: 'libs/billing/util-tax',
        importPath: '@org/billing/util-tax',
        tags: 'type:util,scope:billing',
      })
    );

    // And the tags landed on the project.
    const config = readJson(tree, 'libs/billing/util-tax/project.json');
    expect(config.tags).toEqual(
      expect.arrayContaining(['type:util', 'scope:billing'])
    );
  });

  it('rejects an invalid type before delegating', async () => {
    await expect(
      domainLibGenerator(tree, {
        domain: 'billing',
        name: 'bad',
        type: 'controller' as never,
      })
    ).rejects.toThrow(/Invalid --type/);
    expect(libraryGeneratorMock).not.toHaveBeenCalled();
  });
});
