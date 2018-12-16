const fetch = require("node-fetch");
const users = require("./models/users");

// const options = {
//   host: "api.github.com",
//   path: "/repos/DumbMachine/TweeBot/commits",
//   method: "GET",
//   headers: {
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
//   }
// };
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

getRepos('kforkaran', repos => console.log(repos));