# PackCast

PackCast is a mobile-first, weather-aware packing-list application built from the AI-DLC starter workflow. The current implementation includes trip setup, deterministic weather summaries, data-driven packing rules, an editable checklist, and localStorage persistence.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm test
npm run build
```

The first implementation slice uses deterministic local weather data behind the documented provider boundary. Open-Meteo integration and historical climate averaging are the next weather-service slice.

## AI-DLC workflow

The product plan, design, and implementation boundaries are documented in:

- [PackCast plan](docs/packcast-plan.md)
- [PackCast design](docs/packcast-design.md)
- [Workflow design canvas](docs/workflow-design-canvas.md)

The repository also retains the reusable AI-DLC workflow definitions under `.github/workflows/`.

## GitHub workflow

Pull requests run the unit tests and production build through GitHub Actions. AI-DLC workflows remain human-gated: recommendations are pending until a maintainer reviews them, and automated workflows do not merge or deploy changes.

The `main` branch also builds and deploys the static app to GitHub Pages at `https://mscott9160-web.github.io/packcast/`.

A reusable, human-gated set of GitHub Agentic Workflows for the software development lifecycle.

## Lifecycle

| Stage | Workflow | Human gate |
|---|---|---|
| Plan | `ai-dlc-plan.md` | Confirm scope and priority |
| Design | `ai-dlc-design.md` | Approve architecture and risks |
| Implement | `ai-dlc-implement.md` | Review the proposed change |
| Review | `ai-dlc-review.md` | Merge the pull request |
| Validate | `ai-dlc-validate.md` | Decide whether failures are acceptable |
| Release | `ai-dlc-release.md` | Approve deployment |
| Operate | `ai-dlc-operate.md` | Approve remediation |

## Use in a project

1. Copy `.github/workflows/` into the project.
2. Customize labels, paths, commands, and team names.
3. Create the labels referenced by safe outputs.
4. Configure `COPILOT_GITHUB_TOKEN` as a repository Actions secret.
5. Compile with `gh aw compile`.
6. Test complete, incomplete, ambiguous, and adversarial cases.
7. Keep production changes behind pull requests and human approval.

Read [docs/ai-dlc-operating-model.md](docs/ai-dlc-operating-model.md) before enabling workflows.
