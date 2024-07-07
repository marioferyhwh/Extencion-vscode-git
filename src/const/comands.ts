//commands.ts
export const COMMAND_GIT = {
  STATUS: "git -p status ",
  BRANCH: "git -p branch ",
  FETCH: "git -p fetch ",
  BRANCH_CURRENT: "git -p branch --show-current ",
  BRANCH_LIST:
    'git -P for-each-ref --format="%(objectname) %(refname)" refs/heads refs/remotes ',
  BRACH_UPDATE_FORCE: "git -P branch -f ${branch} ${branch_base}",
  BRACH_CURRENT_UPDATE_FORCE:"git -P reset --hard ${branch_base}",
  LOG_1: "git -p log --oneline --decorate --graph ",
  LOG_BRANCH: "git -p log --pretty=format:%D ",
};
