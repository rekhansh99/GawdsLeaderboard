const octokit = require('@octokit/rest')();
const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/'; // Database URL
const databaseName = 'DatabaseName'; // Enter database name
const collectionName = 'CollectionName'; // Enter collection name

exports.updateUserData = (username) => {
  const user = {
    name: username,
    repos: [],
    weeklyCommits: new Array(52).fill(0)
  };

  const promises = [];

  octokit.repos.listForUser({
    username: username
  }).then(res => {
    res.data.forEach(repo => {
      user.repos.push(repo.name);

      promises.push(octokit.repos.getParticipationStats({
        owner: user.name,
        repo: repo.name
      }).then(result => {
        if (result.data.owner.length)
          user.weeklyCommits.forEach((num, i) => user.weeklyCommits[i] += result.data.owner[i]);
      }));
    });

    Promise.all(promises).then(() => {
      mongo.connect(url, {
        useNewUrlParser: true
      }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(databaseName);
        dbo.collection(collectionName).insertOne(user, (err, res) => {
          if (err) throw err;
          db.close();
        });
      });
    });
  });
};
