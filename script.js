var myHeaders = new Headers();
myHeaders.append("x-apisports-key", config.key);
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

const url = "https://v3.football.api-sports.io/";
const endpoint1 = "leagues/seasons";
const countries = ["England", "Spain", "Germany", "Italy", "France", "Lebanon"];
var currentLength = 1;
var limit = 0;

fetch(url + endpoint1, requestOptions)
  .then(response => response.json())
  .then(data => {
    limit = checkLimit(data);
    if (limit == 1) {
      limitMsg();
    } else {
      getSeason(data);
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
  document.getElementsByClassName("season")[0].remove();
  document.getElementById("standings").remove();
  document.getElementsByTagName("hr")[0].remove();
  let elt = document.createElement("div");
  let content = `We're no longer available for today.<br>Please come back tomorrow!`;
  elt.id = "limit";
  elt.innerHTML = content;
  document.getElementsByClassName("container")[0].appendChild(elt);
}

function getSeason(data) {
  for (let i = 0; i < data.response.length; i++) {
    let option = document.createElement("option");
    option.value = data.response[i];
    option.innerText = data.response[i];
    if (i == data.response.length - 1) {
      option.setAttribute("selected", "selected");
    }
    document.getElementById("season").appendChild(option);
  }
  document.getElementById("season").onchange = onChange;
  document.getElementById("league").onchange = onChange;
}

function onChange() {
  let season = document.getElementById("season").value;
  let elt = document.getElementById("league");
  let name = elt.options[elt.selectedIndex].text;
  if (name == "Lebanese Premier League") {
    name = "Premier League";
  }
  const endpoint2 = `leagues?name=${name}&country=${countries[elt.value]}`;
  fetch(url + endpoint2, requestOptions)
    .then(response => response.json())
    .then(data => {
      limit = checkLimit(data);
      if (limit == 1) {
        if (!document.getElementById("limit")) {
          limitMsg();
        }
      } else {
        let leagueId = getLeague(data);
        const endpoint3 = `standings?league=${leagueId}&season=${season}`;
        fetch(url + endpoint3, requestOptions)
          .then(response => response.json())
          .then(data => {
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
              if (elt.options[elt.selectedIndex].text == "Lebanese Premier League") {
                for (let i = 0; i < data.response[0].league.standings.length; i++) {
                  if (data.response[0].league.standings[i][i].group == "Premier League: Regular Season") {
                    getTable(data, i);
                    break;
                  }
                }
              } else {
                getTable(data, 0);
              }
            }
          })
          .catch(error => alert(error));
      }
    })
    .catch(error => alert(error));
}

function getLeague(data) {
  return data.response[0].league.id;
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
      let content = `<th></th>
                     <th></th>
                     <th></th>
                     <th>Promotion</th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>`;
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
    let form = changeForm(data.response[0].league.standings[k][i].form);
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
  let width = window.innerWidth;
  let elt = document.getElementById("standings");
  let tableWidth = elt.offsetWidth;
  let elts = document.getElementsByClassName("info2");
  let last5Width = width - tableWidth;
  let per = Math.round(last5Width * 100 / width) + 10;
  for (let i = 0; i < elts.length; i++) {
    elts[i].style.setProperty("--last5Width", per + "%");
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
  let content = `<td id="rank"></td>
                   <td id="status"></td>
                   <td id="logo"></td>
                   <td id="name"></td>
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