# UI Matrix Agent Guidelines

These guidelines are for any AI coding agent helping maintain and improve the UI Matrix project.

UI Matrix is a vanilla JavaScript/HTML/CSS web application providing interactive 5x5 letter matrix functionality. The project uses plain HTML pages (`index.html`, `settings.html`), CSS styles (`css/styles.css`), and JavaScript modules (`js/script.js`, `js/settings.js`). It runs via `http-server` on port 3000 and can be containerized with Docker.

## Working Rules

1. Read the relevant project files before making changes.
2. Keep changes focused on the requested task.
3. Preserve existing UI/UX behavior unless a change is explicitly requested.
4. Update or add tests when behavior changes.
5. Run the relevant tests before considering the work complete.
6. No hallucinations allowed. Only state facts that are supported by the repository, command output, or clearly labeled assumptions.
7. Ask questions when something is not clear.
8. Do not overwrite, revert, delete, or reformat existing user changes unless explicitly asked.
9. If unrelated local changes are present, leave them alone.
10. When making claims about the codebase, cite the relevant file, command output, or test result.
11. If a request has multiple reasonable interpretations, ask one concise clarifying question before making a risky change.
12. If an assumption is low-risk, state the assumption and continue.
13. Prefer small, testable changes.
14. Preserve public API contracts, response shapes, and existing tests unless the user explicitly requests a breaking change.
15. Keep JavaScript modular; put reusable logic in separate functions or modules.
16. Use existing patterns in the repository before introducing new abstractions.
17. Do not invent project requirements, test results, or implementation details.
18. If a command fails, report the failure and relevant output.
19. When changing behavior, update tests if applicable.
20. When changing UI behavior, verify expected layout and responsiveness.
21. At the end of work, summarize changed files, tests run, and any remaining risks or follow-up items.
22. Keep `scratchpad.md` updated during work so another agent can recover context after an interruption.

## Definition of Done

A task is complete only when:

- The requested change is implemented.
- Relevant build or test checks have been run.
- Any failed, skipped, or unavailable checks are reported clearly.
- Remaining assumptions, risks, or follow-up items are called out.
- `improvement_plan.md` has been updated to reflect completed work, changed priorities, new follow-up items, or a note that no plan update was needed.

When the definition of done is met, keep the current contents of `scratchpad.md`. Do not clear it at the end of a completed task.

## Scratchpad

Use `scratchpad.md` as working memory for interrupted or resumed tasks.

- At the start of each new task, clear `scratchpad.md` before doing other work.
- After clearing it, write the current objective, initial assumptions, and first planned step.
- During the task, update `scratchpad.md` whenever a substep is completed.
- Each update should record what changed, key findings, files touched, commands run, test results, assumptions, blockers, and the next step.
- Keep entries concise and factual.
- If work is interrupted, the scratchpad should contain enough context for another agent to continue safely.
- When the task is complete, leave the scratchpad contents intact for auditability and handoff context.

## Project Notes

- Main entry point: `index.html`
- Settings page: `settings.html`
- Main stylesheet: `css/styles.css`
- Main script: `js/script.js`
- Settings script: `js/settings.js`
- Package config: `package.json`
- Dockerfile: `Dockerfile`
- Docker Compose: `docker-compose.yml`

## Development Commands

```bash
npm install
npm start
docker build -t ui-matrix-project .
docker run -p 3000:3000 ui-matrix-project
```
