# This Justfile isn't strictly necessary, but it's
# a convenient way to run commands in the repo
# without needing to remember all commands.

[private]
@help:
  just --list

# Install dependencies
install:
  pnpm install --child-concurrency=10

# Run dev script. Runs turbo dev if not in a specific project directory.
[no-cd]
dev *flags:
  pnpm turbo dev {{flags}}

# Create changeset
cs:
  pnpm run-changeset-new

# Check for issues with deps/lint/types/format
[no-cd]
check *flags:
  pnpm turbo check {{flags}}

# Fix deps, lint, format, etc.
# 'runx fix' is kept as it likely orchestrates multiple tools (prettier, eslint --fix, syncpack)
[no-cd]
fix *flags:
  pnpm runx fix {{flags}}

[no-cd]
test *flags:
  pnpm turbo test {{flags}}

[no-cd]
build *flags:
  pnpm turbo build {{flags}}

# Deploy applications/services
[no-cd]
deploy *flags:
  pnpm turbo deploy {{flags}} # Note: Underlying turbo 'deploy' task was generalized

# Update dependencies using syncpack
update-deps:
  pnpm update-deps

# Create a new app/package/etc. from a template (see `turbo/generators` for details)
gen *flags:
  pnpm run-turbo-gen {{flags}}
alias new-app := gen # Renamed from new-worker

new-package *flags:
  pnpm run-turbo-gen new-package {{flags}}
alias new-pkg := new-package
