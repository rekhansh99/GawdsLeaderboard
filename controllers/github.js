const fetch = require('node-fetch');
const octokit = require('@octokit/rest')();

const getRepos = (user, callback) => {
  octokit.repos.listForUser({
    username: user
  }).then(res => {
    callback(res);
  });
};

const getCommits = (user, callback) => {
  getRepos(user, repos => {
    let totalCommits = 0;
    const promises = [];

    repos.forEach(repo => {
      promises.push(fetch(`https://api.github.com/repos/${user}/${repo}/commits`, options)
        .then(res => res.json())
        .then(json => totalCommits += json.length));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

const getCommitsSince = (date, user, callback) => {
  getRepos(user, repos => {
    let totalCommits = 0;
    const promises = [];

    repos.forEach(repo => {
      promises.push(fetch(`https://api.github.com/repos/${user}/${repo}/commits?since=${date.toISOString()}`, options)
        .then(res => res.json())
        .then(json => totalCommits += json.length));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

getRepos('rekhansh99');
exports.getRepos = getRepos;
exports.getCommits = getCommits;
exports.getCommitsSince = getCommitsSince;