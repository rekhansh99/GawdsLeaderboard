const octokit = require('@octokit/rest')();
const fs = require('fs');
const path = require('path');

const users = [];
const userNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
const promises = [];

octokit.authenticate({
  type: 'basic',
  username: 'rekhansh99',
  password: 'Sonu@1999'
});

for (const year in userNames) {
  userNames[year].forEach(userName => {
    const user = {
      name: userName,
      year: year,
      repos: [],
      totalCommits: 0,
    };

    promises.push(octokit.repos.listForUser({
      username: userName
    }).then(res => {
      if (res.data)
        res.data.forEach(repo => {
          if (!repo.fork)
            user.repos.push(repo.name);
        });

      users.push(user);
    }));
  });
}

Promise.all(promises).then(() => {
  const p = [];
  users.forEach(user => {
    user.repos.forEach(repo => {
      p.push(octokit.repos.getContributorsStats({
        owner: user.name,
        repo: repo
      }).then(result => {
        if (result.data)
          result.data.forEach(data => {
            u = users.find(user => user.name === data.author.login);
            if (u) {
              u.totalCommits += data.total;
            }
          });
      }));
    });
  });

  Promise.all(p).then(() => console.log(users));
});