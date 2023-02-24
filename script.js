const url = "https://api-football-relay.onrender.com/";
const endpoint1 = "leagues";
var currentLength = 1;
var limit = 0;

fetch(url + endpoint1)
  .then(response => response.json())
  .then(data => {
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

function getLeague(data) {
  let arr = data.response;
  arr.sort(function (a, b) {
    if (a.league.name < b.league.name) {
      return -1;
    }
    if (a.league.name > b.league.name) {
      return 1;
    }
    return 0;
  });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].league.type == "League") {
      let option = document.createElement("option");
      let id = arr[i].league.id;
      let name = arr[i].league.name;
      let country = arr[i].country.name;
      option.value = id;
      option.innerText = name + " - " + country;
      document.getElementById("league").appendChild(option);
    }
  }
  document.getElementById("league").onchange = onChangeLeague;
  document.getElementById("season").onchange = onChangeSeason;
}

function onChangeLeague() {
  let id = document.getElementById("league").value;
  const endpoint2 = `leagues/${id}`;
  fetch(url + endpoint2)
    .then(response => response.json())
    .then(data => {
      limit = checkLimit(data);
      if (limit == 1) {
        if (!document.getElementById("limit")) {
          limitMsg();
        }
      } else {
        if (!document.getElementsByClassName("hidden")[0]) {
          let elt = document.getElementById("season");
          while (elt.options.length > 0) {
            elt.remove(0);
          }
        }
        getSeason(data);
      }
    })
    .catch(error => alert(error));
}

function onChangeSeason() {
  let elt = document.getElementById("league");
  let id = elt.value;
  let season = document.getElementById("season").value;
  const endpoint3 = `standings/${id}/${season}`;
  fetch(url + endpoint3)
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
        let length = data.response[0].league.standings.length;
        getTable(data, length - 1);
      }
    })
    .catch(error => alert(error));
}

function getSeason(data) {
  let elt = document.getElementById("season");
  let option = document.createElement("option");
  option.innerText = "Select a season: ";
  option.setAttribute("selected", "selected");
  option.setAttribute("disabled", "disabled");
  elt.appendChild(option);
  for (let i = 0; i < data.response[0].seasons.length; i++) {
    let option = document.createElement("option");
    let start = data.response[0].seasons[i].year;
    let t = data.response[0].seasons[i].end;
    let end = t.substring(0, 4);
    option.value = start;
    option.innerText = start + " - " + end;
    elt.appendChild(option);
  }
  if (document.getElementsByClassName("hidden")[0]) {
    document.getElementsByClassName("hidden")[0].className = "season";
  }
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