// Création de la liste des labyrinthes pour le joueur

let lab = [];

function selectLab() {
  let taille = document.getElementById('choixTailleLab');
  let type = document.getElementById('choixTypeLab');
  let listType = [];


  for (const i in bigLab) {
    let option = document.createElement('option');
    taille.appendChild(option);
    option.value = i;
    option.text = i + "x" + i;

    for (const j in bigLab[i]) {
      listType.push(j);
    }
  }

  let listTypeUnique = [...new Set(listType)];

  for (let type2 of listTypeUnique) {
    let option2 = document.createElement('option');
    type.appendChild(option2);
    option2.value = type2;
    option2.text = type2;
  }

}
selectLab(bigLab);


// Choix du labyrinthe par le joueur

let tailleChoisi = document.getElementById('choixTailleLab').value;
let typeChoisi = document.getElementById('choixTypeLab').value;

document.getElementById('submit').addEventListener('click', function() {
  tailleChoisi = document.getElementById('choixTailleLab').value;
  typeChoisi = document.getElementById('choixTypeLab').value;
  lab = createLab(bigLab, tailleChoisi, typeChoisi);
})


// Création du labyrinthe

function createLab(laby, taille, type) {
  let div;
  let grid;
  lab = laby[taille][type];
  tab = laby[taille][type];

  for (const position of lab) {
    div = document.createElement("div");
    grid = document.getElementById('grid');
    $(".grid").css({
      "grid-template-columns": "repeat(" + taille + ", 1fr)"
    });
    grid.appendChild(div);
    div.setAttribute('class', 'grid-item');
    $(".grid-item").css({
      "width": "50px",
      "height": "50px"
    });
    div.setAttribute('id', 'x' + position.posX + 'y' + position.posY);
    let wall = position.walls;

    if (position.posX === 0 && position.posY === 0) {
      div.style.backgroundColor = "#98d89b";
    }
    if (position.posX === lab[lab.length - 1].posX && position.posY === lab[lab.length - 1].posY) {
      div.style.backgroundColor = "#30a234";
    }

    for (let i = 0; i < wall.length; i++) {
      if (i === 0 && wall[0]) {
        div.style.borderTop = "2px solid red";
      } else if (i === 1 && wall[1]) {
        div.style.borderRight = "2px solid red";
      } else if (i === 2 && wall[2]) {
        div.style.borderBottom = "2px solid red";
      } else if (i === 3 && wall[3]) {
        div.style.borderLeft = "2px solid red";
      }
    }
  }
  $('.del').append('<button class="start" id="oops" onclick="deleteLab()">Supprimer le labyrinthe</button>');
}


// Enlever le labyrinthe (pour en mettre un nouveau)

function deleteLab() {
  $('.grid-item').remove();
  $('#oops').remove();
}

// Résolution en DFS

async function dfs_iteratif(lab, start) {
  let finish = lab[lab.length - 1];
  let stack = [];
  lab.chemins = [];
  stack.push(start)

  while (stack.length != 0) {
    let n = stack.pop();
    lab.chemins.push(n);
    n.visited = true;
    await delay(100);
    createPion(n);

    if (n === finish) {
      console.log("Gagné");
      return lab.chemins;
    }
    for (let w of get_neighbors(tab, n.posX, n.posY)) {
      if (!w.visited) {
        stack.push(w);
      }
    }
  }
}


// Résolution en BFS

async function bfs_iteratif(lab, start) {
  let finish = lab[lab.length - 1];
  let stack = [];
  lab.chemins = [];
  stack.push(start)

  while (stack.length != 0) {
    let n = stack.shift();
    n.visited = true;
    await delay(100);
    createPion(n);

    if (n === finish) {
      console.log("Gagné");

      while (n.parent != undefined) {
        lab.chemins.push(n);

        // n = n.parent;
        n = lab.find(el => el.posX === n.parent.posX && el.posY === n.parent.posY);
        document.getElementById('x'+ n.posX + 'y' + n.posY).style.backgroundColor="#365837";
        console.log(lab.chemins);
      }
      return lab.chemins;
    }
    for (let w of get_neighbors(tab, n.posX, n.posY)) {
      if (!w.visited) {
        stack.push(w);
      }
    }
  }
}


// Fonction qui cherche les voisins

function get_neighbors(lab, x, y) {
  let position = {
    "posX": x,
    "posY": y
  }
  let voisins = [];
  let wall = getCell(lab, x, y).walls;

  if (!wall[0]) {
    // getCell(lab, x, y - 1).parent = position;
    voisins.push(getCell(lab, x, y - 1));
  }
  if (!wall[1]) {
    // getCell(lab, x + 1, y).parent = position;
    voisins.push(getCell(lab, x + 1, y));
  }
  if (!wall[2]) {
    // getCell(lab, x, y + 1).parent = position;
    voisins.push(getCell(lab, x, y + 1));
  }
  if (!wall[3]) {
    // getCell(lab, x - 1, y).parent = position;
    voisins.push(getCell(lab, x - 1, y));
  }
  voisins.forEach(v => v.parent = position);

  console.log(voisins);
  return voisins;
}

function getCell(lab, x, y) {
  return lab.find(el => el.posX === x && el.posY === y);
}



// Création du pion

async function createPion(cellJoueur) {
  const positions = document.getElementById('x' + cellJoueur.posX + 'y' + cellJoueur.posY);
  const span = document.createElement('span');
  positions.appendChild(span);
  span.setAttribute('class', 'dot');
}


// Création du délai entre chaque point

async function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

let startposition = {
  "posX": 0,
  "posY": 0
}
// Lancement de la solution grâce au bouton

async function start_dfs() {
  await delay(500);
  await dfs_iteratif(tab, startposition);
}

async function start_bfs() {
  await delay(500);
  await bfs_iteratif(tab, startposition);
}


// WIN

function win() {

}
