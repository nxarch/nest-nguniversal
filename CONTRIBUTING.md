# Contributing to nest-nguniversal

We appreciate every contribution and support. We think it's vital to any open source project to collaborate
and create better software together. 🙏❤

## Developing

- Run `yarn`
- Run specs: yarn test `<package-name>`
- Run build: yarn build `<package-name>`
- Run lint: yarn lint `<package-name>`

## <a name="rules"></a> Coding Rules

Just remember a few guidelines while working on the project in order to make collaboration more fun and easier:

- All features or bug fixes **must be tested** by one or more specs (unit-tests).
- All public API methods **must be documented**.
- Create e2e tests if applicable

## <a name="commit"></a> Commit Message Guidelines

We use semantic versioning and conventional commits to ensure universal/consistent versioning and a readable git
history.
Structured commit message are important to generate our changelog as well.

### Commit Message Format

We follow the commit message rules set by [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Each commit should have a **type**, a **scope** and a **subject** in it's **header**.
It can also have an **optional body** and an **optional footer**

```
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain
a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/angular/angular/commits/main))

```
docs(decorators): update changelog to include a description of the log decorator
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```
