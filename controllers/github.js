const fetch = require('node-fetch');

const getRepos = (user, callback) => {
  fetch('https://api.github.com/users/' + user + '/repos')
    .then(res => res.json())
    .then(json => {
      const repos = [];
      // console.log(json);

      json.forEach(repo => repos.push(repo.name));
      // console.log(repos);
      callback(repos);
    });
};

const getCommits = (user, callback) => {
  getRepos(user, repos => {
    let totalCommits = 0;
    const promises = [];

    repos.forEach(repo => {
      promises.push(fetch('https://api.github.com/repos/' + user + '/' + repo + '/commits')
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
      promises.push(fetch('https://api.github.com/repos/' + user + '/' + repo + '/commits?since=' + date.toISOString())
        .then(res => res.json())
        .then(json => totalCommits += json.length));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

exports.getRepos = getRepos;
exports.getCommits = getCommits;
exports.getCommitsSince = getCommitsSince;