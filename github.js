const octokit = require('@octokit/rest')();
const fs = require('fs');
const path = require('path');

const users = [];
const userNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
const promises = [];

for (const year in userNames) {
  userNames[year].forEach(userName => {
    const user = {
      name: userName,
      year: year,
      repos: [],
      totalCommits: 0,
      weeklyCommits: []
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

              for (let i = data.weeks.length - 1; i >= 0; i--) {
                if (u.weeklyCommits.length > 0) {
                  let inserted = false;

                  for (let j = u.weeklyCommits.length - 1; j >= 0; j--) {
                    if (data.weeks[i].w < u.weeklyCommits[j].w)
                      continue;
                    else if (data.weeks[i].w > u.weeklyCommits[j].w) {
                      for (let k = u.weeklyCommits.length - 1; k > j; k--)
                        u.weeklyCommits[k + 1] = u.weeklyCommits[k];
                      u.weeklyCommits[j + 1] = data.weeks[i];
                      inserted = true;
                      break;
                    } else {
                      u.weeklyCommits[j].a += data.weeks[i].a;
                      u.weeklyCommits[j].d += data.weeks[i].d;
                      u.weeklyCommits[j].c += data.weeks[i].c;
                      inserted = true;
                      break;
                    }
                  }

                  if (!inserted)
                    u.weeklyCommits.unshift(data.weeks[i]);
                } else
                  u.weeklyCommits = data.weeks;
              }
            }
          });
      }));
    });
  });

  Promise.all(p).then(() => {
    users.forEach(user => {
      console.log(user.name);
      console.log(user.year);
      console.log(user.repos);
      console.log(user.totalCommits);
      console.log(user.weeklyCommits);
    });
  });
});