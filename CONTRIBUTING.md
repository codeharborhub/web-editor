# 🤝 Contributing to CodeHarborHub – Web Code Editor

Thank you for your interest in contributing!  
This guide will help you set up your environment, follow our standards, and submit high-quality contributions.

---

## 🧭 Table of Contents
- [Getting Started](#getting-started)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Branching & Workflow](#branching--workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community & Support](#community--support)

---

## Getting Started

1. **Fork the repository** to your own GitHub account.
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/<your-username>/web-editor.git
   cd web-editor
   ```

3. **Set the upstream remote** to stay updated with the main repo:

   ```bash
   git remote add upstream https://github.com/CodeHarborHub/web-editor.git
   ```

---

## Ways to Contribute

* **Code Contributions** – Add new features, fix bugs, improve performance.
* **Documentation** – Improve README, usage guides, or create tutorials.
* **Design/UX** – Suggest UI/UX improvements, themes, or accessibility enhancements.
* **Testing** – Write unit/integration tests, improve coverage.
* **Feedback** – Report bugs, request features, or share ideas in [Discussions](https://github.com/CodeHarborHub/web-editor/discussions).

---

## Development Setup

Prerequisites:

* Node.js **16+**
* npm or yarn
* Modern browser with ES2020 support

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The editor will be available at [http://localhost:5173](http://localhost:5173).

---

## Branching & Workflow

We use a **feature-branch workflow**:

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/awesome-feature
   ```

   Use prefixes like:

   * `feat/` – New feature
   * `fix/` – Bug fix
   * `docs/` – Documentation updates
   * `refactor/` – Code refactoring
   * `test/` – Test improvements

2. Keep your branch up to date:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

---

## Coding Guidelines

* **TypeScript Strict Mode**: Keep code type-safe.
* **React + Hooks**: Prefer functional components and hooks.
* **Styling**: Use Tailwind CSS utilities; avoid inline styles where possible.
* **Editor**: Configure Monaco in `src/lib/monacoSetup.ts` (don’t hardcode language settings).
* **Formatting**: Run Prettier before commits:

  ```bash
  npm run format
  ```
  
* **Linting**: Ensure ESLint passes:

  ```bash
  npm run lint
  ```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) for clarity and automated changelogs:

```
<type>(scope): short description

[optional body]
[optional footer]
```

Examples:

* `feat(editor): add multi-file tab support`
* `fix(preview): correct sandbox CSP rules`
* `docs(readme): update installation instructions`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

---

## Pull Request Process

1. Ensure your branch is rebased on the latest `main`.
2. Check that all tests pass:

   ```bash
   npm run test
   ```
   
3. Open a Pull Request against `main` with:

   * **Clear title** using Conventional Commit style.
   * **Description** explaining the change and any related issues (`Fixes #123`).
4. Our CI will run:

   * Type checks
   * Linting
   * Build verification
5. After review, a maintainer will merge using a **squash commit**.

---

## Reporting Issues

* Search [existing issues](https://github.com/CodeHarborHub/web-editor/issues) before opening a new one.
* Use the provided **bug** or **feature request** templates.
* Include:

  * Steps to reproduce
  * Expected vs actual behavior
  * Screenshots or logs if relevant
  * Browser/OS information

Security vulnerabilities?
👉 Email **[codeharborhub@gmail.com](mailto:codeharborhub@gmail.com)** instead of creating a public issue.

---

## Community & Support

* 💬 [GitHub Discussions](https://github.com/CodeHarborHub/web-editor/discussions)
* 🐛 [Bug Reports](https://github.com/CodeHarborHub/web-editor/issues)
* 📧 Email: **[codeharborhub@gmail.com](mailto:codeharborhub@gmail.com)**
* 💡 Discord (coming soon)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/).
By participating, you agree to maintain a friendly and respectful environment.

---

**Happy Coding 💻✨**
Your contributions make **CodeHarborHub – Web Code Editor** better for everyone!
