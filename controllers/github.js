const fetch = require('node-fetch');

const options = {
  headers: {
    'Authorization': 'token 1a97f8a8a172e5cc8812472be428ae266e6bf051'
  }
};

const getRepos = (user, callback) => {
  fetch('https://api.github.com/users/' + user + '/repos', options)
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
      promises.push(fetch('https://api.github.com/repos/' + user + '/' + repo + '/commits', options)
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
      promises.push(fetch('https://api.github.com/repos/' + user + '/' + repo + '/commits?since=' + date.toISOString(), options)
        .then(res => res.json())
        .then(json => totalCommits += json.length));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

exports.getRepos = getRepos;
exports.getCommits = getCommits;
exports.getCommitsSince = getCommitsSince;