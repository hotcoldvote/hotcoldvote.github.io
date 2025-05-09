//constants

const K = 40;

//functions

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function combinations(array) {
    var result = array.flatMap((v, i) => array.slice(i+1).map( w => v + ' ' + w ));
    return result;
}

function findInMatrix(matrix, target) {
    for (let a=0; a<matrix.length; a++) {
        if (matrix[a][0] == target) {
            return a;
        }
    }
    return -1;
}

function elo(rA, rB, sA, sB) {
    var eA = 1 / (1 + Math.pow(10, (rB-rA)/400));
    var eB = 1 / (1 + Math.pow(10, (rA-rB)/400));
    rA = rA + K*(sA - eA);
    rB = rB + K*(sB - eB);
    var res = [rA, rB];
    return res;
}

//setup

var pics = [];

for (let i=0;i<10;i++) {
    var rint = randint(0, 100);
    while(pics.includes(rint)) {
        rint = randint(0, 100);
    }
    pics.push([rint, 1000]);
}

picskeys = [];

for (const element of pics) {
    picskeys.push(element[0]);
}
combs = combinations(picskeys);
visited = [];

//main code

for (let i=0; i<100; i++) {
    var rizz = prompt(`${pics.toSorted(function(a, b) {return b[1] - a[1];})} type anything to continue: `);
    let rpics = combs[randint(0, combs.length - 1)];
    while (visited.includes(rpics)) {
        rpics = combs[randint(0, combs.length - 1)];
    }
    visited.push(rpics);
    var lisrpics = rpics.split(" ");
    var gA = parseInt(lisrpics[0]);
    var gB = parseInt(lisrpics[1]);
    var sA = 0;
    var sB = 0;
    var rA = (pics[findInMatrix(pics, gA)])[1];
    var rB = pics[findInMatrix(pics, gB)][1];
    
    var choice = prompt(`${gA} or ${gB} good sir say which is higher [l/r]: `).toLowerCase();
    if (choice == "l") {
        sA = sA + 1;
    }
    else if (choice == "r") {
        sB = sB + 1;
    }
    var res = elo(rA, rB, sA, sB);

    pics[findInMatrix(pics, gA)][1] = res[0];
    pics[findInMatrix(pics, gB)][1] = res[1];

    if (visited.length == combs.length) {
        visited = [];
    }
}
