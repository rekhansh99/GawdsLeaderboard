const octokit = require('@octokit/rest')();

const getRepos = (user, callback) => {
  octokit.repos.listForUser({
    username: user
  }).then(res => {
    const repos = [];
    // console.log(res);

    res.data.forEach(repo => repos.push(repo.name));
    callback(repos);
  });
};

const getCommits = (user, callback) => {
  getRepos(user, repos => {
    let totalCommits = 0;
    const promises = [];

    repos.forEach(repo => {
      promises.push(octokit.repos.listCommits({
          owner: user,
          repo: repo,
        })
        .then(res => totalCommits += res.data.length));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

const getCommitsSince = (date, user, callback) => {
  getRepos(user, since, until, repos => {
    let totalCommits = 0;
    const promises = [];

    repos.forEach(repo => {
      promises.push(octokit.repos.listCommits({
          owner: user,
          repo: repo,
          since: date.toISOString()
        })
        .then(res => totalCommits += res.data.length));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

getCommits(new Date('12-10-2018'), 'rekhansh99', commits => console.log(commits));
exports.getRepos = getRepos;
exports.getCommits = getCommits;
exports.getCommitsSince = getCommitsSince;