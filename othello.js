"use strict";
/*jshint esversion: 6 */


/**
 * Pääkomponentti, jonka tilaan tallennetaan kaikki tarvittava muuttuva tieto, ja jonka
 * metodeja hyödynnetään myös muissa komponenteissa.
 */
class App extends React.PureComponent {
  constructor(props) {
    super(props);
      this.state = {"peli": false,
                    "koko": 4,
                    "pelaaja1": "",
                    "pelaaja2": "",
                    "nappulat1": 2,
                    "nappulat2": 2,
                    "vuorossa": "",
                    "nappula": "",
                    "loppu": false,
                    "voittaja": "",
                    };
      this.asetuksetHandleChange = this.asetuksetHandleChange.bind(this);
      this.asetuksetTarkista = this.asetuksetTarkista.bind(this);
      this.asetuksetSubmit = this.asetuksetSubmit.bind(this);
      this.newGame = this.newGame.bind(this);
      this.dragStart = this.dragStart.bind(this);
      this.dropHandler = this.dropHandler.bind(this);
      this.dragoverHandler = this.dragoverHandler.bind(this);
      this.siirronseuraukset = this.siirronSeuraukset.bind(this);
      this.tarkistaSallitut = this.tarkistaSallitut.bind(this);
      return;
  }

  /**
   * Pelin alkuasetusten kenttien muuttaminen
   * @param {*} event 
   */
  asetuksetHandleChange(event) {
    let kohde = event.target;
    let value = kohde.value;
    let id = kohde.id;
    let type = kohde.type;
    
    if (type == "text") {
      if (value.trim() === "") {
        kohde.setCustomValidity("Nimen pitää sisältää merkkejä.");
      } else {
        kohde.setCustomValidity("");
      }
    }

    this.setState({[id]:value});

  }

  /**
   * Pelin alkuasetusten tarkistaminen kun painetaan submit buttonia
   * @param {*} event click
   */
  asetuksetTarkista(event) {
    let nimi1 = event.target.parentNode[1];
    let nimi2 = event.target.parentNode[2];

    if (nimi1.value.trim() === "") {
      nimi1.setCustomValidity("Nimen pitää sisältää merkkejä.");
    } else if (nimi1.value.trim().length > 15) {
      nimi1.setCustomValidity("Nimi saa sisältää enintään 15 merkkiä.");
    } else if (nimi1.value.trim() == nimi2.value.trim()) {
      nimi2.setCustomValidity("Nimen pitää olla eri kuin ensimmäisellä pelaaajalla.");
    } else {
      nimi1.setCustomValidity("");
    }

    if (nimi2.value.trim() === "") {
      nimi2.setCustomValidity("Nimen pitää sisältää merkkejä.");
    } else if (nimi2.value.trim().length > 15) {
      nimi2.setCustomValidity("Nimi saa sisältää enintään 15 merkkiä.");
    } else if (nimi2.value.trim() == nimi1.value.trim() ) {
      nimi2.setCustomValidity("Nimen pitää olla eri kuin ensimmäisellä pelaaajalla.");
    } else {
      nimi2.setCustomValidity("");
    }
  }

  /**
   * Alkuasetusten submit
   * @param {*} event submit
   */
  asetuksetSubmit(event) {
    event.preventDefault();
    event.target.reset();

    this.setState({"vuorossa": this.state.pelaaja1});
    this.setState({"peli": true});
  }

  /**
   * Tarkistetaan nappulan pudotuksen jälkeen seuraukset, eli mitä nappuloita
   * vallataan siirron seurauksena. Päivitetään muuttuneet nappulamäärät tilaan.
   * Tarkistuksessa käydään läpi pudotetun nappulan sijainnista kaikki ilmansuunnat (8kpl).
   * @param {*} rivit nappuloiden rivit
   * @param {*} nappula siirretty nappula
   * @param {*} rivi nappulan rivi
   * @param {*} indeksi nappulan indeksi
   */
  siirronSeuraukset(rivit, nappula, rivi, indeksi) {
    
    let nappulat = nappula.getAttribute("name");
    let nappuloita1, nappuloita2;
    if (nappulat == "nappulat1") {
      nappuloita1 = 1 + this.state.nappulat1;
      nappuloita2 = this.state.nappulat2;
    } else {
      nappuloita2 = 1 +  this.state.nappulat2;
      nappuloita1 = this.state.nappulat1;
    }

    let koko = parseInt(this.state.koko);

    // Tarkistetaan kaikki kahdeksena suuntaa sijoitetusta nappulasta
    // ja muutetaan nappuloiden väriä tarvittaessa.
    // Alla olevat silmukat ovat melkein samanlaisia, joten olen kommentoinut vain ensimmäisen läpikäynnin (pohjoinen)

    // pohjoinen
    for (let o = rivi-1; o >= 0; o--) { // rivit pohjoiseen päin
      // jos tulee vastaan nappula, joka niin jatketaan läpikäyntiä siihen asti, että tulee vastaan toinen oma nappula tai tyhjä ruutu
      if (rivit[o].children[indeksi].hasChildNodes()) {
        // jos tuli vastaan toinen oma nappula, niin päivitetään välissä olevat nappulat samaan väriin
        if (rivit[o].children[indeksi].firstChild.className == nappula.className) {
          for (let u = o+1; u < rivi; u++) { // rivit nappulaan päin
            rivit[u].children[indeksi].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") { // nappuloiden määrän päivitys
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break; // lopetetaan kun ensimmäinen omien nappuloiden välissä ollut väli on käyty läpi
        }
      } else { // jos nappuloiden välissä ei ollut nappuloita, niin lopetetaan läpikäynti
        break;
      }
    }
    // koillinen
    for (let o = rivi-1, u = indeksi+1; o >= 0 && u < koko; o--, u++) {
      if (rivit[o].children[u].hasChildNodes()) {
        if (rivit[o].children[u].firstChild.className == nappula.className) {
          for (let j = o+1, k = u-1; j < rivi && k > indeksi; j++, k--) {
            rivit[j].children[k].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") {
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break;
        }
      } else {
        break;
      }
    }
    // itä
    for (let o = indeksi+1; o < rivit[rivi].children.length; o++) {
      if (rivit[rivi].children[o].hasChildNodes()) {
        if (rivit[rivi].children[o].firstChild.className == nappula.className) {
          for (let u = o-1; u > indeksi; u--) {
            rivit[rivi].children[u].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") {
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break;
        }
      } else {
        break;
      }
    }
    // kaakko
    for (let o = rivi+1, u = indeksi+1; o < koko && u < koko; o++, u++) {
      if (rivit[o].children[u].hasChildNodes()) {
        if (rivit[o].children[u].firstChild.className == nappula.className) {
          for (let j = o-1, k = u-1; j > rivi && k > indeksi; j--, k--) {
            rivit[j].children[k].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") {
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break;
        }
      } else {
        break;
      }
    }
    // etelä
    for (let o = rivi+1; o < koko; o++) {
       if (rivit[o].children[indeksi].hasChildNodes()) {
         if (rivit[o].children[indeksi].firstChild.className == nappula.className) {
           for (let u = o-1; u > rivi; u--) {
             rivit[u].children[indeksi].firstChild.setAttribute("class", nappula.className);
             if (nappulat == "nappulat1") { 
               nappuloita1++;
               nappuloita2--;
             } else {
               nappuloita1--;
               nappuloita2++;
             }
           }
           break; 
         }
       } else { 
         break;
      }
    }
    // lounas
    for (let o = rivi+1, u = indeksi-1; o < koko && u >= 0; o++, u--) {
      if (rivit[o].children[u].hasChildNodes()) {
        if (rivit[o].children[u].firstChild.className == nappula.className) {
          for (let j = o-1, k = u+1; j > rivi && k < indeksi; j--, k++) {
            rivit[j].children[k].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") {
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break;
        }
      } else {
        break;
      }
    }
    // länsi
    for (let o = indeksi-1; o >= 0; o--) {
      if (rivit[rivi].children[o].hasChildNodes()) {
        if (rivit[rivi].children[o].firstChild.className == nappula.className) {
          for (let u = o+1; u < indeksi; u++) {
            rivit[rivi].children[u].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") {
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break;
        }
      } else {
        break;
      }
    }
    // luode
    for (let o = rivi-1, u = indeksi-1; o >= 0 && u >= 0; o--, u--) {
      if (rivit[o].children[u].hasChildNodes()) {
        if (rivit[o].children[u].firstChild.className == nappula.className) {
          for (let j = o+1, k = u+1; j < rivi && k < indeksi; j++, k++) {
            rivit[j].children[k].firstChild.setAttribute("class", nappula.className);
            if (nappulat == "nappulat1") {
              nappuloita1++;
              nappuloita2--;
            } else {
              nappuloita1--;
              nappuloita2++;
            }
          }
          break;
        }
      } else {
        break;
      }
    }

    // Päivitetään tällä hetkellä voittava pelaaja nappuloiden määrän perusteella
    if (nappuloita1 > nappuloita2) {
      this.setState({"voittaja": 1});
    } else if (nappuloita2 > nappuloita1) {
      this.setState({"voittaja": 2});
    } else {
      this.setState({"voittaja": 0});
    }
    // Päivitetään nappuloiden määrä tilaan
    this.setState({"nappulat1": nappuloita1});
    this.setState({"nappulat2": nappuloita2});
  }

  /**
   * Kun painetaan uusi peli buttonia pelilaudan vierestä.
   * Palautetaan alkuperäinen tila ja palataan lomakkeelle asettamalla tilassa oleva "peli" = false.
   * Poistetaan myös ylimääräiset nappulat pelilaudalta.
   * @param {*} event click 
   */
  newGame(event) {
    // Poistetaan nappulat laudalta, mutta jätetään keskellä olevat nappulat, joilla eri id
    let pelilautaRivit = event.target.parentElement.parentElement.children[1].firstChild;
    // Pelin rivin koko (koko x koko)
    let koko = parseInt(this.state.koko);

    // Käydään läpi pelilaudan rivit
    for (let i = 0; i < pelilautaRivit.children.length; i++) {
      // ja niiden ruudut
      for (let u = 0; u < pelilautaRivit.children[i].children.length; u++) {
        // Merkitään alkuperäiset siirtomahdollisuudet laudalle
        if ( i == (koko/2 - 2) && u == (koko/2) ||
             i == (koko/2 - 1) && u == (koko/2 + 1)||
             i == (koko/2) && u ==  (koko/2 - 2) ||
             i == (koko/2 + 1) &&  u ==  (koko/2 - 1)
        ) {
          pelilautaRivit.children[i].children[u].setAttribute("class", "square allowed");
        } else { // Poistetaan vanhan pelin siirtomahdollisuudet
          pelilautaRivit.children[i].children[u].setAttribute("class", "square");
        }
        if (pelilautaRivit.children[i].children[u].children.length > 0) {
          // Muutetaan pohjanappuloiden värit alkuperäisiksi
          if ( (/^pohjanappula/).test(pelilautaRivit.children[i].children[u].firstChild.getAttribute("id")) ) {
            // valkoiset
            if ( (i == (koko/2 - 1) && u == (koko/2 - 1)) || (i == (koko/2) && u == (koko/2)) ) {
              pelilautaRivit.children[i].children[u].firstChild.setAttribute("class", "disc_borderless white");
              // mustat
            } else if ( (i == (koko/2) && u == (koko/2 - 1)) || (i == (koko/2 - 1) && u == (koko/2)) ) {
              pelilautaRivit.children[i].children[u].firstChild.setAttribute("class", "disc_borderless black");
            }
          } else { // jos ei ollut kyseessä pohjanappula, niin poistetaan nappula laudalta
            pelilautaRivit.children[i].children[u].removeChild(pelilautaRivit.children[i].children[u].firstChild);
          }
        }
      }
    }

    // Asetetaan tila alkuasetuksiin
    this.setState({"peli": false,
                  "koko": 4,
                  "vuorossa": "",
                  "nappulat1": 2,
                  "nappulat2": 2,
                  "pelaaja1": "",
                  "pelaaja2": "",
                  "loppu": false});
  }

  /**
   * Tarkistetaan sallitut siirrot 'väri' parametri mukaiselle nappulalle. Merkataan ne korostetusti pelilaudalle.
   * @param {*} rivit nappuloiden rivit laudalla 
   * @param {*} väri seuraavaksi vuorossa olevan nappulan väri
   */
  tarkistaSallitut(rivit, väri) {
    // Onko vielä mahdollista tehdä siirtoja (palauttettava arvo)
    let siirtojaJäljellä = false;

    // Poistetaan vanhat sallitut
    for (let i = 0; i < rivit.length; i++) {
      let ruudut = rivit[i].children;
      for (let o = 0; o < ruudut.length; o++) {
        ruudut[o].setAttribute("class", "square");
      }
    }

    // Katsotaan uudet sallitut. Käydään kaikki rivit läpi pelilaudalla ja pysähdytään kohtiin, joissa on seuraavan vuoron värinen nappula.
    for (let i = 0; i < rivit.length; i++) {
      let ruudut = rivit[i].children;
      for (let o = 0; o < ruudut.length; o++) {
        if ( ruudut[o].hasChildNodes() && ruudut[o].firstChild.className.split(" ").length > 0 && ruudut[o].firstChild.className.split(" ")[1] == väri ) {

          // Tarkistetaan kaikki suunnat (8 kpl), joista löytyy vastakkaisen värin nappula.
          // Alla olevat ilmansuuntia vastaavat osat ovat lähes samanlaisia, joten olen kommentoinut vain ensimmäisen (pohjoinen).

          // Pohjoinen
          if (i-1 >= 0 && rivit[i-1].children[o].hasChildNodes() && rivit[i-1].children[o].firstChild.className.split(" ")[1] != väri) {
            let indeksi = i-1;
            let vapaana = false;
            // Tarkistetaan pohjoiseen päin ja otetaan pohjoisin tyhjä ylös, jos se on vapaa
            while (true) {
              if (indeksi - 1 >= 0) {
                if ( rivit[indeksi-1].children[o].hasChildNodes() && rivit[indeksi-1].children[o].firstChild.className.split(" ")[1] != väri ) {
                  indeksi--;
                } else if ( !rivit[indeksi-1].children[o].hasChildNodes() ) {
                  indeksi--;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            // Jos vapaa ruutu löytyi, niin asetetaan se korostetuksi pudotusta varten
            if (vapaana) {
              rivit[indeksi].children[o].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Koillinen
          if (i-1 >= 0 && o+1 < ruudut.length && rivit[i-1].children[o+1].hasChildNodes() && rivit[i-1].children[o+1].firstChild.className.split(" ")[1] != väri) {
            let rivi = i - 1;
            let indeksi = o + 1;
            let vapaana = false;
            while (true) {
              if (rivi - 1 >= 0 && indeksi + 1 < ruudut.length) {
                if ( rivit[rivi-1].children[indeksi+1].hasChildNodes() && rivit[rivi-1].children[indeksi+1].firstChild.className.split(" ")[1] != väri ) {
                  rivi--;
                  indeksi++;
                } else if ( !rivit[rivi-1].children[indeksi+1].hasChildNodes() ) {
                  rivi--;
                  indeksi++;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              rivit[rivi].children[indeksi].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Itä
          if (o+1 < ruudut.length && ruudut[o+1].hasChildNodes() && ruudut[o+1].firstChild.className.split(" ")[1] != väri) {
            let indeksi = o + 1;
            let vapaana = false;
            while (true) {
              if (indeksi + 1 < ruudut.length) {
                if ( ruudut[indeksi+1].hasChildNodes() && ruudut[indeksi+1].firstChild.className.split(" ")[1] != väri ) {
                  indeksi++;
                } else if ( !ruudut[indeksi+1].hasChildNodes() ) {
                  indeksi++;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              ruudut[indeksi].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Kaakko
          if (i+1 < ruudut.length && o+1 < ruudut.length && rivit[i+1].children[o+1].hasChildNodes() && rivit[i+1].children[o+1].firstChild.className.split(" ")[1] != väri) {
            let rivi = i + 1;
            let indeksi = o + 1;
            let vapaana = false;
            while (true) {
              if (rivi + 1 < ruudut.length && indeksi + 1 < ruudut.length) {
                if ( rivit[rivi+1].children[indeksi+1].hasChildNodes() && rivit[rivi+1].children[indeksi+1].firstChild.className.split(" ")[1] != väri ) {
                  rivi++;
                  indeksi++;
                } else if ( !rivit[rivi+1].children[indeksi+1].hasChildNodes() ) {
                  rivi++;
                  indeksi++;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              rivit[rivi].children[indeksi].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Etelä
          if (i+1 < rivit.length && rivit[i+1].children[o].hasChildNodes() && rivit[i+1].children[o].firstChild.className.split(" ")[1] != väri) {
            let indeksi = i+1;
            let vapaana = false;
            while (true) {
              if (indeksi + 1 < rivit.length) {
                if ( rivit[indeksi+1].children[o].hasChildNodes() && rivit[indeksi+1].children[o].firstChild.className.split(" ")[1] != väri ) {
                  indeksi++;
                } else if ( !rivit[indeksi+1].children[o].hasChildNodes() ) {
                  indeksi++;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              rivit[indeksi].children[o].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Lounas
          if (i+1 < ruudut.length && o-1 >= 0 && rivit[i+1].children[o-1].hasChildNodes() && rivit[i+1].children[o-1].firstChild.className.split(" ")[1] != väri) {
            let rivi = i + 1;
            let indeksi = o - 1;
            let vapaana = false;
            while (true) {
              if (rivi + 1 < ruudut.length && indeksi - 1 >= 0) {
                if ( rivit[rivi+1].children[indeksi-1].hasChildNodes() && rivit[rivi+1].children[indeksi-1].firstChild.className.split(" ")[1] != väri ) {
                  rivi++;
                  indeksi--;
                } else if ( !rivit[rivi+1].children[indeksi-1].hasChildNodes() ) {
                  rivi++;
                  indeksi--;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              rivit[rivi].children[indeksi].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Länsi
          if (o-1 >= 0 && ruudut[o-1].hasChildNodes() && ruudut[o-1].firstChild.className.split(" ")[1] != väri) {
            let indeksi = o - 1;
            let vapaana = false;
            while (true) {
              if (indeksi - 1 >= 0) {
                if ( ruudut[indeksi-1].hasChildNodes() && ruudut[indeksi-1].firstChild.className.split(" ")[1] != väri ) {
                  indeksi--;
                } else if ( !ruudut[indeksi-1].hasChildNodes() ) {
                  indeksi--;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              ruudut[indeksi].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
          // Luode
          if (i-1 >= 0 && o-1 >= 0 && rivit[i-1].children[o-1].hasChildNodes() && rivit[i-1].children[o-1].firstChild.className.split(" ")[1] != väri) {
            let rivi = i - 1;
            let indeksi = o - 1;
            let vapaana = false;
            while (true) {
              if (rivi - 1 >= 0 && indeksi - 1 >= 0) {
                if ( rivit[rivi-1].children[indeksi-1].hasChildNodes() && rivit[rivi-1].children[indeksi-1].firstChild.className.split(" ")[1] != väri ) {
                  rivi--;
                  indeksi--;
                } else if ( !rivit[rivi-1].children[indeksi-1].hasChildNodes() ) {
                  rivi--;
                  indeksi--;
                  vapaana = true;
                  break;
                } else {
                  break;
                }
              } else {
                break;
              }
            }
            if (vapaana) {
              rivit[rivi].children[indeksi].setAttribute("class", "square allowed");
              siirtojaJäljellä = true;
            }
          }
    

        }
      }
    }

    return siirtojaJäljellä;

  }

  /**
   * Kun siirrettävää nappulaa lähdetään raahaamaan, niin asetetaan nappula tilaan.
   * @param {*} event dragstart 
   */
  dragStart(event) {
    let nappula = event.target;
    this.setState({"nappula": nappula});
  }

  /**
   * Kun nappula pudotetaan sallittuun ruutuun
   * @param {*} event drop 
   */
  dropHandler(event) {
    // sallitaan pudotus
    event.preventDefault();

    // tietoja talteen
    let ruutu = event.target;
    let id = ruutu.id.split("-");
    let rivi = parseInt(id[1]);
    let indeksi = parseInt(id[2]);
    let rivit  = ruutu.parentElement.parentElement.children;

    // Kloonataan raahattu "nappula" ja sijoitetaan se pudotetun ruudun sisään
    let pudotettava = this.state.nappula.cloneNode();
    event.target.appendChild(pudotettava);
    pudotettava.setAttribute("draggable", "false");
    pudotettava.setAttribute("id", "nappula-" + rivi + "-" + indeksi);

    // Poistetaan reunat, jotta nappula näyttää paremmalta skaalauksen kanssa
    let pudotettava_väri = pudotettava.getAttribute("class").split(" ")[1];
    pudotettava.setAttribute("class", "disc_borderless " + pudotettava_väri);

    // Tarkistetaan saiko pelaaja kaapattua toisen pelaajaan "aluetta" ja väritetään nappulat sen mukaan
    this.siirronSeuraukset(rivit, pudotettava, rivi, indeksi);

    // Otetaan nappula pois tilasta tyhjäämällä tila
    this.setState({"nappula": ""});

    // Seuraavan siirron väri
    let väri1 = "white";
    let väri2 = "black";
    if (pudotettava.className.split(" ")[1] == "white") {
      väri1 = "black";
      väri2 = "white";
    }

    // Merkataan seuraavan vuoron sallitut siirrot ja tarkistetaan samalla, että siirtoja on vielä jäljellä
    let siirtoja = this.tarkistaSallitut(rivit, väri1);

    // Jos seuraavan vuoron pelaajalla ei ollut siirtoja jäljellä
    if (!siirtoja) {
        if (!this.tarkistaSallitut(rivit, väri2)) { // Tarkistetaan voiko sitä seuraavalla vuorolla siirtää..
          this.setState({"loppu": true}); // Jos ei niin peli päättyy.
        }
    } else { // Muuten vaihdetaan vuoroa
      if (this.state.vuorossa == this.state.pelaaja1) {
        this.setState({"vuorossa": this.state.pelaaja2.slice(0)});
      } else {
        this.setState({"vuorossa": this.state.pelaaja1.slice(0)});
      }
    }

  }

  /**
   * Kun nappula raahataan ruudun yli, niin tarkistetaan, onko ruutu sallittu paikka tiputtaa nappula.
   * Sallittu paikka on merkattu vihreällä värillä, joka on "allowed" css luokassa
   * @param {*} event dragover 
   */
  dragoverHandler(event) {
    if (event.target.getAttribute("name") == "square" && event.target.children.length === 0 && event.target.className.split(" ")[1] == "allowed") {
      // Sallitaan siirto jos oli allowed ruutu
      event.preventDefault();
    }
  }


  /**
   * Asetuslomake ja pelilauta
   */
  render () {
    return (
      <div className="base">
        <Asetukset
          peli={this.state.peli}
          koko={this.state.koko}
          eka={this.state.pelaaja1}
          toka={this.state.pelaaja2}
          handleChange={this.asetuksetHandleChange}
          submit={this.asetuksetSubmit}
          tarkista={this.asetuksetTarkista}/>
        <Pelilauta
          peli={this.state.peli}
          koko={this.state.koko}
          vuorossa={this.state.vuorossa}
          pelaaja1={this.state.pelaaja1}
          pelaaja2={this.state.pelaaja2}
          nappulat1={this.state.nappulat1}
          nappulat2={this.state.nappulat2}
          loppu={this.state.loppu}
          voittaja={this.state.voittaja}
          dragStart={this.dragStart}
          newGame={this.newGame}
          dropHandler={this.dropHandler}
          dragoverHandler={this.dragoverHandler}/>
      </div>
      
    )
  }

}

/**
 * Asetuslomakkeen komponentti, käyttää App komponentin metodeja.
 * Menee piiloon kun asetukset on lähetetty ja hyväksytty. Eli kun peli on asetettu tilassa true.
 */
class Asetukset extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <form className={this.props.peli ? "hidden" : "settings"} method="post" onSubmit={this.props.submit}>
        <fieldset>
          <legend>Asetukset</legend>
          <p>
            <label htmlFor="pelaaja1">Pelaaja 1 <br/>
              <input type="text" name="pelaaja" id="pelaaja1" className="playerInput" value={this.props.pelaaja1} onChange={this.props.handleChange}></input>
            </label>
          </p>
          <p>
            <label htmlFor="pelaaja2">Pelaaja 2 <br/>
              <input type="text" name="pelaaja" id="pelaaja2" className="playerInput" value={this.props.pelaaja2} onChange={this.props.handleChange}></input>
            </label>
          </p>
          <p>
            <label htmlFor="koko">Pelilaudan koko: {this.props.koko + "x" + this.props.koko} <br/>
              <input type="range" name="koko" id="koko" className="sizeInput" min="4" max="16" step="2" value={this.props.koko} onChange={this.props.handleChange}></input>
            </label>
          </p>
        </fieldset>
        <button className="settings_submit" type="submit" onClick={ (e) => {this.props.tarkista(e) }}>Aloita peli</button>
      </form>
    );
  }
}

/**
 * Pelilauta, joka tulee näkyviin, kun asetukset on hyväksytty ja tilassa oleva peli = true.
 */
class Pelilauta extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render () {
    // Rivin koko ja rivien määrä (koko x koko)
    let pKoko = parseInt(this.props.koko);
    // Pelilaudan rivit eri komponentilla
    let rivit = [];
    for (let i = 0; i <pKoko; i++) {
      rivit.push(
        // Id sisältää viivan jälkeen rivinumeron
        <Rivi key={i} id={"rivi-" + i} koko={pKoko} dragoverHandler={this.props.dragoverHandler} dropHandler={this.props.dropHandler}/>
      )
    }
    return (
      <div className={this.props.peli ?  "game" : "hidden"}>
        <div className="grid-container">
          <div className="game_info_div">
            <div className="game_info">
              <p className={this.props.loppu ? (this.props.voittaja == "1" || this.props.voittaja == "0" ? "winner" : "") : ""}>{this.props.loppu ? (this.props.voittaja == "1" || this.props.voittaja == "0" ? <strong>{this.props.pelaaja1}</strong> : this.props.pelaaja1) : this.props.pelaaja1} <br/> nappuloita laudalla: {this.props.nappulat1}</p>
              <p className={this.props.loppu ? (this.props.voittaja == "2" || this.props.voittaja == "0" ? "winner" : "") : ""}>{this.props.loppu ? (this.props.voittaja == "2" || this.props.voittaja == "0" ? <strong>{this.props.pelaaja2}</strong> : this.props.pelaaja2) : this.props.pelaaja2}  <br/> nappuloita laudalla: {this.props.nappulat2}</p>
            </div>
          </div>
          <div className="game_board_div">
            <div className="game_board">
              {rivit}
            </div>
          </div>
          <div className="game_button_div">
            <div className="game_button">
              <p>{"Vuorossa oleva pelaaja:"} <br/>  {this.props.vuorossa}</p>
              <div className={this.props.vuorossa == this.props.pelaaja1 ? "disc_border white" : "disc_border black"} name={this.props.vuorossa == this.props.pelaaja1 ? "nappulat1" : "nappulat2"} draggable={this.props.loppu ? "false" : "true"} onDragStart={this.props.dragStart}></div>
              <p>{"(siirrä nappula raahaamalla)"}</p>
            </div>
          </div>
          <div className="game_new_div">
            <button className="game_new" onClick={this.props.newGame}>Uusi peli</button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Pelilaudan riveille oma komponentti
 */
class Rivi extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render () {
    // rivinumero id:stä viivan jälkeen
    let rivinumero = this.props.id.split("-")[1];
    // rivin sisältämät ruudut
    let ruudut = [];
    for (let i = 0; i < this.props.koko; i++) {
      // Näytetään vapaat ruudut korostettuina (free = true)
      if (
          rivinumero == (this.props.koko / 2 - 2) && i == this.props.koko / 2 ||
          rivinumero == (this.props.koko / 2 - 1) && i == (this.props.koko / 2 + 1) ||
          rivinumero == (this.props.koko / 2) && i ==  (this.props.koko / 2 - 2) ||
          rivinumero == (this.props.koko / 2 + 1) &&  i ==  (this.props.koko / 2 - 1)
          ) {
        ruudut.push(
          <Ruutu key={i} id={"ruutu-" + rivinumero + "-" + i} free={true} rivinumero={rivinumero} koko={this.props.koko} dragoverHandler={this.props.dragoverHandler} dropHandler={this.props.dropHandler}/>
        )
      // Muut ruudut ilman korostusta (free = false)
      } else {
        ruudut.push(
          <Ruutu key={i} id={"ruutu-" + rivinumero + "-" + i} free={false} rivinumero={rivinumero} koko={this.props.koko} dragoverHandler={this.props.dragoverHandler} dropHandler={this.props.dropHandler}/>
        )
      }

    }
    return (
      <div className="row" id={this.props.id}>
        {ruudut}
      </div>
    )
      
  }
}

/**
 * Yksittäisen peliruudun komponentti
 */
class Ruutu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render () {
    let rivinumero = this.props.rivinumero;
    let indeksi = this.props.id.split("-")[2];

    // Pelin alussa olevat keskinappulat, ekassa if:ssä valkoiset ja toisessa mustat.
    let nappula = "";
    if ( (this.props.rivinumero == this.props.koko / 2 && indeksi == this.props.koko / 2) || (rivinumero == this.props.koko / 2 - 1 && indeksi == this.props.koko/2 - 1) ) {
      nappula = <div className="disc_borderless white" id={"pohjanappula-" + rivinumero + "-" + indeksi} name="nappulat1"></div>;
    } else if ( (rivinumero == this.props.koko / 2 && indeksi == this.props.koko / 2 - 1) || (rivinumero == this.props.koko / 2 - 1 && indeksi == this.props.koko/2) ) {
      nappula =  <div className="disc_borderless black" id={"pohjanappula-" + rivinumero + "-" + indeksi} name="nappulat2"></div>;
    }
  
    return (
      <div className={this.props.free ? "square allowed" :"square"} name="square" id={this.props.id} onDragOver={this.props.dragoverHandler} onDrop={this.props.dropHandler}>
        {nappula}
      </div>
    )
      
  }
}

ReactDOM.render(
    <App />,
  document.getElementById('root')

);
