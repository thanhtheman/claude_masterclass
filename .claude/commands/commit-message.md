---
description: Create a commit message by analyzing git diffs
allowed-tools: Bash(git status:*), Bash(git diff --staged), Bash(git commit:*)
---

## Context:
- Current git status: !`git status`
- Current git diff: !`git diff --staged`

## Your task:
Analyze above staged git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

## Commit types:
- `feat:` - new feature
- `fix:` - bug fix
- `refactor:` - refactoring code
- `docs:` - documentation
- `style:` - styling/formatting
- `test:` - tests
- `perf:` - performance

## Format
Use the following format for making the commit message:
```
<type>: <concise_description>
<optional_body_explaining_why>
```

## Output
1. Show summary of changes currently staged.
2. Propose commit message with appropriate type.
3. Ask for confirmation before committing

DO NOT auto-commit - wait for user approval, and only commit if the user says so.