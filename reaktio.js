"use strict";

// nappulaelementit taulukkoon
let nappulat = [
  document.getElementById('nappula0'),
  document.getElementById('nappula1'),
  document.getElementById('nappula2'),
  document.getElementById('nappula3')
];

let restartButton = document.getElementById("restartButton");

// onclick-käsittelyjät kaikille nappuloille
nappulat[0].onclick = function () { painallus(0) };
nappulat[1].onclick = function () { painallus(1) };
nappulat[2].onclick = function () { painallus(2) };
nappulat[3].onclick = function () { painallus(3) };

restartButton.onclick = function () { location.reload(); }

let pisteet = 0; // pisteet

// aseta mahdollinen aikaisempi ennätys paikoilleen
let ennatys = window.localStorage.getItem("ennatys");
if (!ennatys) {
  ennatys = 0;
}
document.getElementById("ennatysLukema").innerHTML = ennatys;

const arvotutNappulat = []; // taulukko arvotuille nappuloille
let nykyinen = 0;   // nykyinen aktiivinen nappula

// käynnistetään kone
// arvotaan ensimmäinen aktiivinen nappula 1500ms päästä, sitten 1000ms
// 1500 on parametri setTimeout-funktiolle
// 1000 on parametri aktivoiSeuraava-funktiolle
let ajastin = setTimeout(aktivoiSeuraava, 1500, 1000);

// funktio, joka pyörittää konetta: aktivoi seuraavan nappulan ja ajastaa
// sitä seuraavan nappulanvaihdon
function aktivoiSeuraava(aika) {
  // arvo seuraava aktiivinen nappula
  let seuraava = arvoUusi(nykyinen);

  // päivitä nappuloiden värit: vanha mustaksi, uusi punaiseksi
  //nappulat[nykyinen].style.backgroundColor = "black"; // vanha mustaksi
  //nappulat[seuraava].style.backgroundColor = "red"; // uusi punaiseksi
  nappulat[nykyinen].style.opacity = 0.4; // vanha mustaksi
  nappulat[seuraava].style.opacity = 1; // uusi punaiseksi

  nykyinen = seuraava; // aseta uusi nykyinen nappula

  arvotutNappulat.push(nykyinen); // lisää uusi nappula taulukkoon
  console.log(arvotutNappulat);

  // jos taulukko on pidempi kuin 10, lopeta peli
  if (arvotutNappulat.length > 10) {
    lopetaPeli();
  } else {
    //console.log("Aktiivinen " + nykyinen);
    if (aika > 350) {
      ajastin = setTimeout(aktivoiSeuraava, aika * 0.98, aika * 0.98);
    } else {
      ajastin = setTimeout(aktivoiSeuraava, aika, aika);
    }
  }
}

function arvoUusi(edellinen) {
  let randomNumber = Math.floor(Math.random() * 4);

  while (randomNumber === edellinen) {
    randomNumber = Math.floor(Math.random() * 4);
  }
  return randomNumber;
}

// Tätä funktiota kutsutaan aina, kun jotain nappulaa painetaan
// Pelilogiikkasi vaatinee, että lisäät tänne jotain...
function painallus(i) {
  //console.log("Painallus ", i);
  if (i === arvotutNappulat[0]) {
    pisteet++;
    document.getElementById("tulos").innerHTML = pisteet;
    arvotutNappulat.shift();
  } else {
    lopetaPeli();
  }
}

function lopetaPeli() {
  clearTimeout(ajastin);
  for (let i = 0; i < 4; i++) {
    nappulat[i].style.backgroundColor = "gray";
    nappulat[i].onclick = null; // disabloi nappuloiden käsittelijät
  }

  document.getElementById("overlay").style.visibility = "visible";
  document.getElementById("restartButton").style.visibility = "visible";
  let gameoverText = document.getElementById("gameoverText");

  if (pisteet > ennatys) {
    localStorage.setItem("ennatys", pisteet);
    document.getElementById("ennatysLukema").innerHTML = pisteet;
    gameoverText.innerHTML = "Uusi ennatys! Sait " + pisteet + " pistetta.";
    //gameoverText.classList.add("glow");
    document.getElementById("ilotulitus").style.display = "block";
    gameoverText.style.color = "#ef51e4";

  } else {
    gameoverText.innerHTML = "Peli loppui. Sait " + pisteet + " pistetta.";
    //gameoverText.classList.remove("glow");
    
  }
}