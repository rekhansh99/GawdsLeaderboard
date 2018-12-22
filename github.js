const octokit = require('@octokit/rest')();
const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';     // Database URL
const databaseName = 'DatabaseName';          // Enter database name
const collectionName = 'CollectionName';      // Enter collection name

const userNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
const promises = [];

for (const year in userNames) {
  userNames[year].forEach(userName => {
    const user = {
      name: userName,
      year: year,
      repos: [],
      weeklyCommits: new Array(52).fill(0)
    };

    octokit.repos.listForUser({
      username: userName
    }).then(res => {
      res.data.forEach(repo => {
        user.repos.push(repo.name);
        promises.push(octokit.repos.getParticipationStats({
          owner: user.name,
          repo: repo.name
        }).then(result => 
          user.weeklyCommits.forEach((num, i) => user.weeklyCommits[i] += result.data.owner[i])));
      });

      Promise.all(promises).then(() => {
        mongo.connect(url, (err, db) => {
          if(err) throw err;
          const dbo = db.db(databaseName);
          dbo.collection(collectionName).insertOne(user, (err, res) => {
            if(err) throw err;
            db.close();
          });
        });
      });
    });
  });
}
