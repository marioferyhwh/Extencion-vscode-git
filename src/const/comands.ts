//commands.ts
export const COMMAND_GIT = {
  STATUS: "git -p status",
  BRANCH: "git -p branch",
  BRANCH_CURRENT: "git -p branch --show-current",
  BRANCH_LIST:
    'git -P for-each-ref --format="%(objectname) %(refname)" refs/heads refs/remotes',
  LOG_1: "git -p log --oneline --decorate --graph",
  LOG_2: "git -p log --oneline --decorate --graph",
};
