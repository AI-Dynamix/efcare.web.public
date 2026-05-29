# Skill: push / commit

Trigger: user says "push", "commit", "push lên", "deploy", "commit đi"

Always run full sequence — never leave commits unpushed:

```bash
cd <project-dir>
git add <changed files>
git commit -m "<message>"
git push
```

Default project dir: `d:\aidx\code\efcare\efcare.web.public`
Default remote: `origin master` → `https://github.com/AI-Dynamix/efcare.web.public`

## Rule

"commit" = add + commit + push. Always. No half-steps.
Exception: user explicitly says "chỉ commit thôi" or "don't push".
