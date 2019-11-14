const core = require('@actions/core');
const github = require('@actions/github');

try {
    const message = core.getInput('message');
    const token = core.getInput('GITHUB_TOKEN');
    const assignees = JSON.parse(core.getInput('assignees'));
    const context = github.context;

    if (context.payload.pull_request == null) {
        core.setFailed('Could not find a valid pull request!');
        return;
    }

    const pr_number = context.payload.pull_request.number;
    const octokit = new github.GitHub(token);

    octokit.issues.createComment({
        ...context.repo,
        issue_number: pr_number,
        body: message
    }).catch(error => {
        core.setFailed(error.message);
    });

    if(assignees) {
        octokit.issues.addAssignees({
            ...context.repo,
            issue_number: pr_number,
            assignees: assignees
        }).catch(error => {
            core.setFailed(error.message);
        });
    }

} catch (error) {
    core.setFailed(error.message);
}