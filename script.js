//const url = "http://localhost:3000/"
const url = "https://api-football-relay.onrender.com/";
const endpoint1 = "leagues";
var currentLength = 1;
var limit = 0;
var userLimit = 0;

const leagueHeadDown = "fa fa-sharp fa-solid fa-angle-down leagueArrowhead";
const leagueHeadUp = "fa fa-sharp fa-solid fa-angle-up leagueArrowhead";
const seasonHeadDown = "fa fa-sharp fa-solid fa-angle-down seasonArrowhead";
const seasonHeadUp = "fa fa-sharp fa-solid fa-angle-up seasonArrowhead";

document.addEventListener("mouseup", (event) => {
  let leagueBtn = document.getElementById("leagueBtn");
  let league = document.getElementById("league");
  let leagueArrowhead = document.querySelector("#leagueBtn > i");
  if (event.target != leagueBtn && event.target != league && event.target.parentNode != league) {
    league.className = "hidden";
    leagueArrowhead.className = leagueHeadDown;
  }
  let seasonBtn = document.getElementById("seasonBtn");
  let season = document.getElementById("season");
  let seasonArrowhead = document.querySelector("#seasonBtn > i");
  if (event.target != seasonBtn && event.target != season && event.target.parentNode != season) {
    season.className = "hidden";
    seasonArrowhead.className = seasonHeadDown;
  }
});

document.getElementById("leagueBtn").addEventListener("click", () => {
  let elt = document.getElementById("league");
  if (elt.className == "hidden") {
    elt.className = "leagueOnClick";
  } else {
    elt.className = "hidden";
  }
  let leagueArrowhead = document.querySelector("#leagueBtn > i");
  if (leagueArrowhead.className == leagueHeadUp) {
    leagueArrowhead.className = leagueHeadDown;
  } else {
    leagueArrowhead.className = leagueHeadUp;
  }
});

document.getElementById("seasonBtn").addEventListener("click", () => {
  let elt = document.getElementById("season");
  if (elt.className == "hidden") {
    elt.className = "seasonOnClick";
  } else {
    elt.className = "hidden";
  }
  let seasonArrowhead = document.querySelector("#seasonBtn > i");
  if (seasonArrowhead.className == seasonHeadUp) {
    seasonArrowhead.className = seasonHeadDown;
  } else {
    seasonArrowhead.className = seasonHeadUp;
  }
});

fetch(url + endpoint1)
  .then(response => response.json())
  .then(data => {
    userLimit = checkUserLimit(data);
    if (userLimit == 1) {
      userLimitMsg(data);
      return;
    }
    limit = checkLimit(data);
    if (limit == 1) {
      limitMsg();
    } else {
      getLeague(data);
    }
  })
  .catch(error => alert(error));

function checkLimit(data) {
  if (data.errors.length != 0 || data.errors === undefined) {
    return 1;
  }
  return 0;
}

function limitMsg() {
  document.getElementsByClassName("league")[0].remove();
  if (document.getElementsByClassName("season")[0]) {
    document.getElementsByClassName("season")[0].remove();
  }
  document.getElementById("standings").remove();
  if (document.getElementsByTagName("hr")[0]) {
    document.getElementsByTagName("hr")[0].remove();
  }
  let elt = document.createElement("div");
  let content = `We're no longer available for today.<br>Please come back tomorrow!`;
  elt.id = "limit";
  elt.innerHTML = content;
  document.getElementsByClassName("container")[0].appendChild(elt);
}

function checkUserLimit(data) {
  if (typeof data.error != "undefined") {
    return 1;
  }
  return 0;
}

function userLimitMsg(data) {
  let elt = document.querySelector(".container");
  elt.classList.add("blur");
  let league = document.getElementById("league");
  league.className = "hidden";
  let season = document.getElementById("season");
  season.className = "hidden";
  let div = document.createElement("div");
  div.className = "popup";
  document.body.appendChild(div);
  let time = data.min * 60;
  setInterval(() => {
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    div.innerHTML = data.errorToDisplay + minutes + "m " + seconds + "s!";
    if (time > 0) {
      time--;
    } else {
      window.location.reload();
    }
  }, 1000);
}

function getLeague(data) {
  let arr = data.response;
  arr.sort((a, b) => {
    if (a.country.name + a.league.name < b.country.name + b.league.name) {
      return -1;
    }
    if (a.country.name + a.league.name > b.country.name + b.league.name) {
      return 1;
    }
    return 0;
  });
  let r5 = arr.map(obj => obj.league.id).indexOf(61);
  let elt5 = arr.splice(r5, 1)[0];
  arr.splice(0, 0, elt5);

  let r4 = arr.map(obj => obj.league.id).indexOf(135);
  let elt4 = arr.splice(r4, 1)[0];
  arr.splice(0, 0, elt4);

  let r3 = arr.map(obj => obj.league.id).indexOf(78);
  let elt3 = arr.splice(r3, 1)[0];
  arr.splice(0, 0, elt3);

  let r2 = arr.map(obj => obj.league.id).indexOf(140);
  let elt2 = arr.splice(r2, 1)[0];
  arr.splice(0, 0, elt2);

  let r1 = arr.map(obj => obj.league.id).indexOf(39);
  let elt1 = arr.splice(r1, 1)[0];
  arr.splice(0, 0, elt1);

  let elt = document.getElementById("league");

  let hr_first = document.createElement("hr");
  elt.appendChild(hr_first);
  let h4 = document.createElement("h4");
  h4.innerHTML = "Top 5";
  elt.appendChild(h4);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].league.type == "League" && arr[i].country.name != "World") {
      if (i == 5) {
        let hr = document.createElement("hr");
        elt.appendChild(hr);
        let h4 = document.createElement("h4");
        h4.innerHTML = "Other";
        elt.appendChild(h4);
      }
      let a = document.createElement("a");
      let hr = document.createElement("hr");
      let id = arr[i].league.id;
      let name = arr[i].league.name;
      let logo = arr[i].league.logo;
      let country = arr[i].country.name;
      let flag = arr[i].country.flag;
      a.id = id;
      a.innerHTML = `<img src="${flag}">` + `<sup>${country}</sup>` + `<img src="${logo}">` + `<sup>${name}</sup>`;
      a.setAttribute("href", "#");
      a.className = `${country}, ${name}`;
      a.setAttribute("onclick", "onChangeLeague(this.id, this.className)");
      elt.appendChild(hr);
      elt.appendChild(a);
    }
  }
  let hr_last = document.createElement("hr");
  elt.appendChild(hr_last);
  let width = document.querySelector(".league").offsetWidth;
  elt.style.setProperty("--leagueWidth", width + "px");
}

function onChangeLeague(id, info) {
  const endpoint2 = `leagues/${id}`;
  fetch(url + endpoint2)
    .then(response => response.json())
    .then(data => {
      userLimit = checkUserLimit(data);
      if (userLimit == 1) {
        userLimitMsg(data);
        return;
      }
      limit = checkLimit(data);
      if (limit == 1) {
        if (!document.getElementById("limit")) {
          limitMsg();
        }
      } else {
        if (document.getElementById("season")) {
          document.querySelectorAll("#season > a").forEach(a => {
            a.remove();
          });
          document.querySelectorAll("#season > hr").forEach(hr => {
            hr.remove();
          });
        }
        let seasonBtn = document.getElementById("seasonBtn");
        let seasonContent = `Select a season
                       <i class="${seasonHeadDown}"></i>`;
        if (seasonBtn.innerHTML != seasonContent) {
          seasonBtn.innerHTML = seasonContent;
        }
        let btn = document.getElementById("leagueBtn");
        let content = `${info}
                       <i class="${leagueHeadDown}"></i>`;
        btn.innerHTML = content;
        let elt = document.getElementById("league");
        elt.className = "hidden";
        let width = document.querySelector(".league").offsetWidth;
        elt.style.setProperty("--leagueWidth", width + "px");
        getSeason(data);
        let leagueId = document.querySelector(".leagueId");
        if (leagueId) {
          leagueId.remove();
        }
        let p = document.createElement("p");
        document.body.appendChild(p);
        p.innerHTML = id;
        p.className = "hidden leagueId";
      }
    })
    .catch(error => alert(error));
}

function getSeason(data) {
  let elt = document.getElementById("season");
  for (let i = data.response[0].seasons.length - 1; i >= 0; i--) {
    let hr = document.createElement("hr");
    let a = document.createElement("a");
    let start = data.response[0].seasons[i].year;
    let t = data.response[0].seasons[i].end;
    let end = t.substring(0, 4);
    a.id = start;
    if (start != end) {
      a.innerHTML = start + " - " + end;
    } else {
      a.innerHTML = start;
    }
    a.setAttribute("href", "#");
    a.setAttribute("onclick", "onChangeSeason(this.id, this.innerHTML)");
    elt.appendChild(hr);
    elt.appendChild(a);
  }
  let hr = document.createElement("hr");
  elt.appendChild(hr);
  document.getElementById("seasonBtn").removeAttribute("disabled");
  let width = document.querySelector(".season").offsetWidth;
  document.getElementById("season").style.setProperty("--seasonWidth", width + "px");
}

function onChangeSeason(season, fullSeason) {
  let elt = document.querySelector("p");
  let id = elt.innerHTML;
  const endpoint3 = `standings/${id}/${season}`;
  fetch(url + endpoint3)
    .then(response => response.json())
    .then(data => {
      userLimit = checkUserLimit(data);
      if (userLimit == 1) {
        userLimitMsg(data);
        return;
      }
      limit = checkLimit(data);
      if (limit == 1) {
        if (!document.getElementById("limit")) {
          limitMsg();
        }
      } else {
        let promotion = document.getElementsByClassName("promotion");
        while (promotion.length > 0) {
          promotion[0].parentNode.removeChild(promotion[0]);
        }
        for (let i = 0; i < currentLength; i++) {
          let team = document.getElementById("team" + i);
          if (team) {
            team.remove();
          }
        }
        let btn = document.getElementById("seasonBtn");
        let content = `${fullSeason}
                       <i class="${seasonHeadDown}"></i>`
        btn.innerHTML = content;
        let elt = document.getElementById("season");
        elt.className = "hidden";
        let width = document.querySelector(".season").offsetWidth;
        elt.style.setProperty("--seasonWidth", width + "px");
        let length = data.response[0].league.standings.length;
        getTable(data, length - 1);
      }
    })
    .catch(error => alert(error));
}

function getTable(data, k) {
  if (data.response.length == 0 || data.response === undefined) {
    return;
  }
  createStructure();
  currentLength = data.response[0].league.standings[k].length;
  for (let i = 0; i < currentLength; i++) {
    let promotion = data.response[0].league.standings[k][i].description;
    if (promotion == null) {
      promotion = "-";
    }
    if (!document.getElementById(promotion)) {
      let elt = document.createElement("tr");
      let content = `<th colspan="3"></th>
                     <th>Promotion</th>
                     <th colspan="10"></th>`;
      let t = promotion;
      if (t.includes("Promotion - ")) {
        t = t.replace("Promotion - ", "");
      }
      let rp = content.replace("Promotion", t);
      elt.id = promotion;
      elt.className = "promotion";
      elt.innerHTML = rp;
      document.getElementById("standings").appendChild(elt);
    }
    let elt = document.createElement("tr");
    let content = `<td id="rank">R</td>
                   <td id="status">S</td>
                   <td id="logo"><img src="LOGO"/></td>
                   <td id="name">N</td>
                   <td class="info" id="right">MP</td>
                   <td class="info" id="right">W</td>
                   <td class="info" id="right">D</td>
                   <td class="info" id="right">L</td>
                   <td class="info" id="right">GF</td>
                   <td class="info" id="colon">:</td>
                   <td class="info" id="left">GA</td>
                   <td class="info" id="left">GD</td>
                   <td class="info" id="left">PTS</td>
                   <td class="info2" id="left">LAST 5</td>`;
    let status = checkStatus(data.response[0].league.standings[k][i].status);
    let gf = data.response[0].league.standings[k][i].all.goals.for;
    let ga = data.response[0].league.standings[k][i].all.goals.against;
    let diff = gf - ga;
    let form = "N/A";
    if (data.response[0].league.standings[k][i].form != null) {
      form = changeForm(data.response[0].league.standings[k][i].form);
    }
    let rp = content.replace("R", data.response[0].league.standings[k][i].rank);
    rp = rp.replace("S", status);
    rp = rp.replace("LOGO", data.response[0].league.standings[k][i].team.logo);
    rp = rp.replace("MP", data.response[0].league.standings[k][i].all.played);
    rp = rp.replace("W", data.response[0].league.standings[k][i].all.win);
    rp = rp.replace("D", data.response[0].league.standings[k][i].all.draw);
    rp = rp.replace("L", data.response[0].league.standings[k][i].all.lose);
    rp = rp.replace("GF", gf);
    rp = rp.replace("GA", ga);
    rp = rp.replace("GD", diff);
    rp = rp.replace("PTS", data.response[0].league.standings[k][i].points);
    rp = rp.replace("LAST 5", form);
    rp = rp.replace("N", data.response[0].league.standings[k][i].team.name);
    elt.id = "team" + i;
    elt.innerHTML = rp;
    document.getElementById("standings").appendChild(elt);
  }
  if (!document.getElementsByTagName("hr")[0]) {
    let hr = document.createElement("hr");
    document.body.appendChild(hr);
  }
}

function createStructure() {
  if (document.getElementById("structure")) {
    return;
  }
  let structure = document.createElement("tr");
  let content = `<td colspan="4"></td>
                 <td class="info" id="right">MP</td>
                 <td class="info" id="right">W</td>
                 <td class="info" id="right">D</td>
                 <td class="info" id="right">L</td>
                 <td class="info" id="right">GF</td>
                 <td class="info" id="colon">:</td>
                 <td class="info" id="left">GA</td>
                 <td class="info" id="left">GD</td>
                 <td class="info" id="left">PTS</td>
                 <td class="info2" id="left">LAST 5</td>`;
  structure.id = "structure";
  structure.innerHTML = content;
  document.getElementById("standings").appendChild(structure);
}

function checkStatus(s) {
  if (s == "up") {
    return `<sub class="up">&#8963;</sub>`;
  }
  if (s == "same") {
    return `<span class="same">&#9917;</span>`;
  }
  return `<sup class="down">&#8964;</sup>`;
}

function changeForm(f) {
  f = f.replace(/W/g, `<span class="win">&#10004;</span>`);
  f = f.replace(/D/g, '<sub class="draw">-</sub>');
  f = f.replace(/L/g, `<span class="loss">&#10006;</span>`);
  return f;
}