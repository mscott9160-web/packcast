# AI-DLC Starter

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
