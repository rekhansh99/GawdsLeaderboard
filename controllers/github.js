const fetch = require('node-fetch');
const users = require('../models/users');

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
        .then(json => {
          // console.log(json);
          totalCommits += json.length;
        })
        .catch(err => console.log(err)));
    });

    Promise.all(promises).then(() => callback(totalCommits));
  });
};

exports.getCommits = getCommits;
exports.getRepos = getRepos;