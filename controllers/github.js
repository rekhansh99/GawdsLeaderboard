const fetch = require('node-fetch');
const users = require('../models/users');

exports.getRepos = (user, callback) => {
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

exports.getCommits = (user, callback) => {
  getRepos(user, (repos) => {
    let totalCommits = 0;
    repos.forEach(repo => fetch('https://api.github.com/repos/' + owner + '/' + repo + '/commits')
      .then(res => res.json())
    );
  });
};