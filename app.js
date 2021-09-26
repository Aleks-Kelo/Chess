let table = document.createElement("table");
document.body.appendChild(table);
let whiteTurn = true;
let BlackKingChecked = false;
let WhiteKingChecked = false;
let BlackKingHasMoved = false;
let WhiteKingHasMoved = false;
let WhiteLeftRockHasMoved = false;
let WhiteRightRockHasMoved = false;
let BlackLeftRockHasMoved = false;
let BlackRightRockHasMoved = false;
let kingMoves = [false, false, false, false, false, false, false, false];
let kingsEnemies = [];
let possibleMovesForCheckedKing = [];
let possibleMoves = [];
let castlingEnabled = false;



let tr = [];
let td;
for (let i = 0; i < 8; i++) {
    tr.push(document.createElement("tr"));
    for (let j = 0; j < 8; j++) {

        td = document.createElement("td");
        
        td.addEventListener("click", buttonClick);

        if(i==1){
            td.className = "bp";
        }
        if(i==6){
            td.className = "wp";
        }
        if(i==0 && (j==0 || j==7)){
            td.className = "br";
        }
        if(i==7 && (j==0 || j==7)){
            td.className = "wr";
        }
        if(i==0 && (j==1 || j==6)){
            td.className = "bn";
        }
        if(i==7 && (j==1 || j==6)){
            td.className = "wn";
        }
        if(i==0 && (j==2 || j==5)){
            td.className = "bb";
        }
        if(i==7 && (j==2 || j==5)){
            td.className = "wb";
        }
        if(i==0 && j==3 ){
            td.className = "bq";
        }
        if(i==7 && j==3){
            td.className = "wq";
        }
        if(i==0 && j==4 ){
            td.className = "bk";
        }
        if(i==7 && j==4){
            td.className = "wk";
        } 
        tr[i].appendChild(td);

    }
    table.appendChild(tr[i]);
}


function buttonClick(e){
    if(e.target.classList.contains("possibleMoves") || e.target.classList.contains("possibleEats")){

        if(document.getElementById("previousPosition")){
            document.getElementById("previousPosition").removeAttribute("id");
            document.getElementById("currentPosition").removeAttribute("id");
        }
        
        e.target.removeAttribute("class");
        e.target.classList.add(document.getElementById("active").classList[0]);


        if(document.getElementById("active").className[1] == "r"){
            if(!BlackKingHasMoved){
                if(!whiteTurn && (!BlackLeftRockHasMoved || !BlackRightRockHasMoved)){
                    if(table.rows[0].cells[0].id === "active") BlackLeftRockHasMoved = true;
                    if(table.rows[0].cells[7].id === "active") BlackRightRockHasMoved = true;
                }
            }
            if(!WhiteKingHasMoved){
                if(whiteTurn && (!WhiteLeftRockHasMoved || !WhiteRightRockHasMoved)){
                    if(table.rows[7].cells[0].id === "active") WhiteLeftRockHasMoved = true;
                    if(table.rows[7].cells[7].id === "active") WhiteRightRockHasMoved = true;
                }
            }
        }

        if(document.getElementById("active").className[1] === "k"){
            if(castlingEnabled){
                if(whiteTurn && !WhiteKingHasMoved){
                    if (e.target.parentElement.rowIndex === 7 && e.target.cellIndex === 6) {
                        table.rows[7].cells[7].removeAttribute("class");
                        table.rows[7].cells[5].classList.add("wr"); 
                    }
                    else if(e.target.parentElement.rowIndex === 7 && e.target.cellIndex === 2) {
                        table.rows[7].cells[0].removeAttribute("class");
                        table.rows[7].cells[3].classList.add("wr"); 
                    }
                }else if(!whiteTurn && !BlackKingHasMoved){
                    if (e.target.parentElement.rowIndex === 0 && e.target.cellIndex === 6) {
                        table.rows[0].cells[7].removeAttribute("class");
                        table.rows[0].cells[5].classList.add("br"); 
                    }
                    else if(e.target.parentElement.rowIndex === 0 && e.target.cellIndex === 2) {
                        table.rows[0].cells[0].removeAttribute("class");
                        table.rows[0].cells[3].classList.add("br"); 
                    }
                }
            }
            
            if(table.rows[0].cells[4].id === "active") BlackKingHasMoved = true;
            else if(table.rows[7].cells[4].id === "active") WhiteKingHasMoved = true;
            
        }
        
        document.getElementById("active").classList.remove(document.getElementById("active").classList[0]);
        document.getElementById("active").id ="previousPosition";
        e.target.id = "currentPosition";
        
        if(whiteTurn){
            checksIfKingsAreChecked("black");
            whiteTurn = false;
        } 
        else {
            checksIfKingsAreChecked("white");
            whiteTurn = true;
        }          
    }
    else if(e.target.className.length === 0 || (whiteTurn && e.target.className[0] === "b") || (!whiteTurn && e.target.className[0] === "w")){
        if(document.getElementById("active")){
            document.getElementById("active").removeAttribute("id");
            document.querySelectorAll('td').forEach(td => {
                td.classList.remove("possibleMoves","possibleEats");     
            });
        }
    } 
    else if(BlackKingChecked || WhiteKingChecked){
        findPossibleMovesForCheckedKing();
        getPossibleMoves(e.target.cellIndex,e.target.parentElement.rowIndex,e.target.classList[0]);
        document.querySelectorAll('td.possibleMoves').forEach(td => {
            possibleMoves.push({"x": td.cellIndex,"y": td.parentElement.rowIndex});   
        });

        let results = possibleMoves.filter(o1 => !possibleMovesForCheckedKing.some(o2 => o1.x === o2.x && o1.y === o2.y));
        for(var result of results){
            tr[result.y].cells[result.x].classList.remove("possibleMoves");
        }

        document.querySelectorAll('td.possibleEats').forEach(td => {
            for(var kingEnemy of kingsEnemies){
                if(kingEnemy.x !== td.cellIndex || kingEnemy.y !== td.parentElement.rowIndex ) td.classList.remove("possibleEats");
            }     
        });

    }
    else if(e.target.id === "active") return;
    else {
        if(document.getElementById("active")){
            document.getElementById("active").removeAttribute("id");
            document.querySelectorAll('td').forEach(td => {
                td.classList.remove("possibleMoves","possibleEats");   
            });
        }
        e.target.id = "active";
        if(kingIsCheckedAfterThisPieceMoves(e.target.cellIndex,e.target.parentElement.rowIndex,e.target.className)) return;
        else getPossibleMoves(e.target.cellIndex,e.target.parentElement.rowIndex,e.target.classList[0]);
    }
}

function getPossibleMoves(x,y,piece){
    // if(whiteTurn && WhiteKingChecked  || !whiteTurn && BlackKingChecked) return;
    if(piece === "wp"){
        if(tr[y-1] === undefined) return;
        if(y == 6) moves = 3;
        else moves = 2;
        for (let i = 1; i < moves; i++) {
            if(tr[y-i].cells[x].classList.length !== 0) break;
            else tr[y-i].cells[x].classList.add("possibleMoves");    
        }
        if(x != 0){ 
            if(tr[y-1].cells[x-1].className[0] === "b") tr[y-1].cells[x-1].classList.add("possibleEats");
        }
        if(x != 7) {
            if(tr[y-1].cells[x+1].className[0] === "b") tr[y-1].cells[x+1].classList.add("possibleEats");
        }
    }else if(piece === "bp"){
        if(tr[y+1] === undefined) return;
        if(y == 1) moves = 3;
        else moves = 2;
        for (let i = 1; i < moves; i++) {
            if(tr[y+i].cells[x].classList.length !== 0) break;
            else tr[y+i].cells[x].classList.add("possibleMoves");  
        }
        if(x != 0) {
            if(tr[y+1].cells[x-1].className[0] === "w") tr[y+1].cells[x-1].classList.add("possibleEats");
        }
        if(x != 7) {
            if(tr[y+1].cells[x+1].className[0] === "w") tr[y+1].cells[x+1].classList.add("possibleEats");
        }
    }else if(piece[1] === "r"){
        showRockMoves(x,y);         
    }else if(piece[1] === "n"){
        if(y > 1) {
           if(x < 7) tr[y-2].cells[x+1].classList.add("possibleMoves");
           if(x > 0) tr[y-2].cells[x-1].classList.add("possibleMoves");
        }
        if(y < 6) {
            if(x > 0) tr[y+2].cells[x-1].classList.add("possibleMoves");
            if(x < 7) tr[y+2].cells[x+1].classList.add("possibleMoves");
        }
        if(y > 0) {
            if(x > 1) tr[y-1].cells[x-2].classList.add("possibleMoves");
            if(x < 6) tr[y-1].cells[x+2].classList.add("possibleMoves");
        }
        if(y < 7) {
            if(x > 1) tr[y+1].cells[x-2].classList.add("possibleMoves");
            if(x < 6) tr[y+1].cells[x+2].classList.add("possibleMoves");
        }
    }else if(piece[1] === "b"){
        showBishopMoves(x,y);
    }else if(piece[1] === "q"){
        showRockMoves(x,y);
        showBishopMoves(x,y);
    }else if(piece[1] === "k"){
        for (let i = 0; i < kingMoves.length; i++) {
            kingMoves[i] = false; 
        }
       
        if(piece === "wk") {
            opponents = ".br,.bn,.bb,.bq";
            if(tr[y].cells[x+1] !== undefined && tr[y].cells[x+1].classList.contains("bp") || tr[y].cells[x-1] !== undefined && tr[y].cells[x-1].classList.contains("bp")) kingMoves[4] = true;
            if(tr[y].cells[x-2] !== undefined && tr[y].cells[x-2].classList.contains("bp")) kingMoves[5] = true;
            if(tr[y].cells[x+2] !== undefined && tr[y].cells[x+2].classList.contains("bp")) kingMoves[3] = true;
            if(tr[y-1] !== undefined){
                if(tr[y-1].cells[x] !== undefined && tr[y-1].cells[x].classList.contains("bp") ||tr[y-1].cells[x-2] !== undefined && tr[y-1].cells[x-2].classList.contains("bp")) kingMoves[6] = true;
                if(tr[y-1].cells[x] !== undefined && tr[y-1].cells[x].classList.contains("bp") ||tr[y-1].cells[x+2] !== undefined && tr[y-1].cells[x+2].classList.contains("bp")) kingMoves[2] = true;
                if(tr[y-2] !== undefined){
                    if(tr[y-2].cells[x+1] !== undefined && tr[y-2].cells[x+1].classList.contains("bp") || tr[y-2].cells[x-1] !== undefined && tr[y-2].cells[x-1].classList.contains("bp")) kingMoves[0] = true;
                    if(tr[y-2].cells[x-2] !== undefined && tr[y-2].cells[x-2].classList.contains("bp") || tr[y-2].cells[x] !== undefined && tr[y-2].cells[x].classList.contains("bp")) kingMoves[7] = true;
                    if(tr[y-2].cells[x] !== undefined && tr[y-2].cells[x].classList.contains("bp") || tr[y-2].cells[x+2] !== undefined && tr[y-2].cells[x+2].classList.contains("bp")) kingMoves[1] = true;    
                }
            }
        }
        else{
            opponents = ".wr,.wn,.wb,.wq";
            if(tr[y].cells[x+1] !== undefined && tr[y].cells[x+1].classList.contains("wp") || tr[y].cells[x-1] !== undefined && tr[y].cells[x-1].classList.contains("wp")) kingMoves[0] = true;
            if(tr[y].cells[x-2] !== undefined && tr[y].cells[x-2].classList.contains("wp")) kingMoves[7]= true;
            if(tr[y].cells[x+2] !== undefined && tr[y].cells[x+2].classList.contains("wp")) kingMoves[1] = true;
            if(tr[y+1] !== undefined){
                if(tr[y+1].cells[x] !== undefined && tr[y+1].cells[x].classList.contains("wp") || tr[y+1].cells[x-2] !== undefined && tr[y+1].cells[x-2].classList.contains("wp")) kingMoves[6] = true;
                if(tr[y+1].cells[x] !== undefined && tr[y+1].cells[x].classList.contains("wp") || tr[y+1].cells[x+2] !== undefined && tr[y+1].cells[x+2].classList.contains("wp")) kingMoves[2] = true;
                if(tr[y+2] !== undefined){
                    if(tr[y+2].cells[x+1] !== undefined && tr[y+2].cells[x+1].classList.contains("wp") || tr[y+2].cells[x-1] !== undefined && tr[y+2].cells[x-1].classList.contains("wp")) kingMoves[4] = true;
                    if(tr[y+2].cells[x] !== undefined && tr[y+2].cells[x].classList.contains("wp") || tr[y+2].cells[x-2] !== undefined && tr[y+2].cells[x-2].classList.contains("wp")) kingMoves[5] = true;
                    if(tr[y+2].cells[x] !== undefined && tr[y+2].cells[x].classList.contains("wp") || tr[y+2].cells[x+2] !== undefined && tr[y+2].cells[x+2].classList.contains("wp")) kingMoves[3] = true;
                }
            }  
        }

        document.querySelectorAll(opponents).forEach(opponent => {
            getPossibleMoves(opponent.cellIndex,opponent.parentElement.rowIndex,opponent.classList[0]);
            if(y > 0){
                if(!kingMoves[0] && tr[y-1].cells[x].classList.contains("possibleMoves")) kingMoves[0] = true;
                if(x > 0) {
                    if(!kingMoves[7] && tr[y-1].cells[x-1].classList.contains("possibleMoves")) kingMoves[7] = true;
                    if(!kingMoves[6] && tr[y].cells[x-1].classList.contains("possibleMoves")) kingMoves[6] = true;
                }
                if(x < 7) {
                    if(!kingMoves[1] && tr[y-1].cells[x+1].classList.contains("possibleMoves")) kingMoves[1] = true;
                    if(!kingMoves[2] && tr[y].cells[x+1].classList.contains("possibleMoves")) kingMoves[2] = true;
                }
            }if(y < 7){
                if(!kingMoves[4] && tr[y+1].cells[x].classList.contains("possibleMoves")) kingMoves[4] = true;
                if(x > 0) {
                    if(!kingMoves[5] && tr[y+1].cells[x-1].classList.contains("possibleMoves")) kingMoves[5] = true;
                    if(!kingMoves[6] && tr[y].cells[x-1].classList.contains("possibleMoves")) kingMoves[6] = true;
                }
                if(x < 7) {
                    if(!kingMoves[3] && tr[y+1].cells[x+1].classList.contains("possibleMoves")) kingMoves[3] = true;
                    if(!kingMoves[2] && tr[y].cells[x+1].classList.contains("possibleMoves")) kingMoves[2] = true;
                }
            }
            document.querySelectorAll('td').forEach(td => {
                td.classList.remove("possibleMoves","possibleEats");   
            });   
        })

        if(tr[y].cells[x+2] !== undefined && tr[y].cells[x+2].className[1] === "k") kingMoves[1] = kingMoves[2] = kingMoves[3] = true;
        else if(tr[y].cells[x-2] !== undefined && tr[y].cells[x-2].className[1] === "k") kingMoves[5] = kingMoves[6] = kingMoves[7] = true;
        else if(tr[y-1] !== undefined){
            if(tr[y-1].cells[x+2] !== undefined && tr[y-1].cells[x+2].className[1] === "k") kingMoves[1] = kingMoves[2] = true;
            else if(tr[y-1].cells[x-2] !== undefined && tr[y-1].cells[x-2].className[1] === "k") kingMoves[6] = kingMoves[7] = true;
            else if(tr[y-2] !== undefined){
                if(tr[y-2].cells[x] !== undefined && tr[y-2].cells[x].className[1] === "k") kingMoves[7] = kingMoves[0] = kingMoves[1] = true;
                else if(tr[y-2].cells[x+1] !== undefined && tr[y-2].cells[x+1].className[1] === "k") kingMoves[0] = kingMoves[1] = true;
                else if(tr[y-2].cells[x+2] !== undefined && tr[y-2].cells[x+2].className[1] === "k") kingMoves[1] = true;
                else if(tr[y-2].cells[x-2] !== undefined && tr[y-2].cells[x-2].className[1] === "k") kingMoves[7] = true;
                else if(tr[y-2].cells[x-1] !== undefined && tr[y-2].cells[x-1].className[1] === "k") kingMoves[7] = kingMoves[0] = true;
            }
        }
        if(tr[y+1] !== undefined){
            if(tr[y+1].cells[x+2] !== undefined && tr[y+1].cells[x+2].className[1] === "k") kingMoves[2] = kingMoves[3] = true;
            else if(tr[y+1].cells[x-2] !== undefined && tr[y+1].cells[x-2].className[1] === "k") kingMoves[5] = kingMoves[6] = true;
            else if(tr[y+2] !== undefined){
                if(tr[y+2].cells[x+2] !== undefined && tr[y+2].cells[x+2].className[1] === "k") kingMoves[3] = true;
                else if(tr[y+2].cells[x+1] !== undefined && tr[y+2].cells[x+1].className[1] === "k") kingMoves[3] = kingMoves[4] = true;
                else if(tr[y+2].cells[x] !== undefined && tr[y+2].cells[x].className[1] === "k") kingMoves[3] = kingMoves[4] = kingMoves[5] = true;
                else if(tr[y+2].cells[x-1] !== undefined && tr[y+2].cells[x-1].className[1] === "k") kingMoves[4] = kingMoves[5] = true;
                else if(tr[y+2].cells[x-2] !== undefined && tr[y+2].cells[x-2].className[1] === "k") kingMoves[5] = true; 
            }
        }
        
        if(y > 0){
            if(!kingMoves[0]) tr[y-1].cells[x].classList.add("possibleMoves");
            if(x > 0) {
                if(!kingMoves[7]) tr[y-1].cells[x-1].classList.add("possibleMoves");
                if(!kingMoves[6]) tr[y].cells[x-1].classList.add("possibleMoves");
            }
            if(x < 7) {
                if(!kingMoves[1]) tr[y-1].cells[x+1].classList.add("possibleMoves");
                if(!kingMoves[2]) tr[y].cells[x+1].classList.add("possibleMoves");
            }
        }
        if(y < 7){
            if(!kingMoves[4]) tr[y+1].cells[x].classList.add("possibleMoves");
            if(x > 0) {
                if(!kingMoves[5]) tr[y+1].cells[x-1].classList.add("possibleMoves");
                if(!kingMoves[6]) tr[y].cells[x-1].classList.add("possibleMoves");
            }
            if(x < 7) {
                if(!kingMoves[3]) tr[y+1].cells[x+1].classList.add("possibleMoves");
                if(!kingMoves[2]) tr[y].cells[x+1].classList.add("possibleMoves");
            }
        }
        if(whiteTurn && !WhiteKingHasMoved || !whiteTurn && !BlackKingHasMoved) castling(y);
          
    }document.querySelectorAll('.possibleMoves').forEach(td => regulatesMoves(td));
}

function regulatesMoves(td){
    if((whiteTurn && td.className[0]==="w") || (!whiteTurn && td.className[0]==="b")) td.classList.remove("possibleMoves");
    
    if((whiteTurn && td.className[0]==="b") || (!whiteTurn && td.className[0]==="w")){
        td.classList.remove("possibleMoves");
        td.classList.add("possibleEats");    
    }
}

DOMTokenList.prototype.addMany = function(classes) {
    var array = classes.split(' ');
    for (var i = 0, length = array.length; i < length; i++) {
      this.add(array[i]);
    }
}

DOMTokenList.prototype.removeMany = function(classes) {
    var array = classes.split(' ');
    for (var i = 0, length = array.length; i < length; i++) {
      this.remove(array[i]);
    }
}

function kingIsCheckedAfterThisPieceMoves(x,y,piece){
    if(piece[1] === "k") return;
    if(whiteTurn){
        tr[y].cells[x].classList.removeMany(piece);
        whiteTurn = false;
        checksIfKingsAreChecked("white");
        tr[y].cells[x].classList.addMany(piece);
        whiteTurn = true;
        if(WhiteKingChecked) {
            document.querySelector(".wk").classList.remove("kingIsChecked");
            WhiteKingChecked = false;
            return true;
        }
    }
    else{
        tr[y].cells[x].classList.removeMany(piece);
        whiteTurn = true;
        checksIfKingsAreChecked("black");
        tr[y].cells[x].classList.addMany(piece);
        whiteTurn = false;
        if(BlackKingChecked){
            document.querySelector(".wk").classList.remove("kingIsChecked");
            BalckKingChecked = false;
            return true;
        }
    }
    return false;
}

function showRockMoves(x,y){
    for (let i = 1; i <= y; i++) {
        if((whiteTurn && tr[y-i].cells[x].className[0] === "w") || (!whiteTurn && tr[y-i].cells[x].className[0] === "b")){
            break;
        }
        tr[y-i].cells[x].classList.add("possibleMoves");
        if((whiteTurn && tr[y-i].cells[x].className[0] === "b") || (!whiteTurn && tr[y-i].cells[x].className[0] === "w")){
            break;
        }          
    }
    for (let i = 1; i <= x; i++) {
        if((whiteTurn && tr[y].cells[x-i].className[0] === "w") || (!whiteTurn && tr[y].cells[x-i].className[0] === "b")){
            break;
        }
        tr[y].cells[x-i].classList.add("possibleMoves");
        if((whiteTurn && tr[y].cells[x-i].className[0] === "b") || (!whiteTurn && tr[y].cells[x-i].className[0] === "w")){
            break;
        }             
    }
    for (let i = 1; i <= 7-y; i++) {
        if((whiteTurn && tr[y+i].cells[x].className[0] === "w") || (!whiteTurn && tr[y+i].cells[x].className[0] === "b")){
            break;
        }
        tr[y+i].cells[x].classList.add("possibleMoves");
        if((whiteTurn && tr[y+i].cells[x].className[0] === "b") || (!whiteTurn && tr[y+i].cells[x].className[0] === "w")){
            break;
        }           
    }
    for (let i = 1; i <= 7-x; i++) {
        if((whiteTurn && tr[y].cells[x+i].className[0] === "w") || (!whiteTurn && tr[y].cells[x+i].className[0] === "b")){
            break;
        }
        tr[y].cells[x+i].classList.add("possibleMoves");
        if((whiteTurn && tr[y].cells[x+i].className[0] === "b") || (!whiteTurn && tr[y].cells[x+i].className[0] === "w")){
            break;
        }           
    } 
}

function showBishopMoves(x,y){
    let bishopMoveUp = x;
    if(y < x) bishopMoveUp = y;
    for (let i = 1; i <= bishopMoveUp; i++) {
        if(y-i < 0 || x-i < 0 ) break;
        if((whiteTurn && tr[y-i].cells[x-i].className[0] === "w") || (!whiteTurn && tr[y-i].cells[x-i].className[0] === "b")){
            break;
        } 
        tr[y-i].cells[x-i].classList.add("possibleMoves");
        if((whiteTurn && tr[y-i].cells[x-i].className[0] === "b") || (!whiteTurn && tr[y-i].cells[x-i].className[0] === "w")){
            break;
        }
    }

    for (let i = 1; i <= 7 - bishopMoveUp; i++) {
        if(y-i < 0 || x+i > 7) break;
        if((whiteTurn && tr[y-i].cells[x+i].className[0] === "w") || (!whiteTurn && tr[y-i].cells[x+i].className[0] === "b")){
            break;
        }
        tr[y-i].cells[x+i].classList.add("possibleMoves");
        if((whiteTurn && tr[y-i].cells[x+i].className[0] === "b") || (!whiteTurn && tr[y-i].cells[x+i].className[0] === "w")){
            break;
        }
    }
    let bishopMoveDown = y;
    if(y < x) bishopMoveDown = x;
    for (let i = 1; i <= bishopMoveDown; i++) {
        if(y+i > 7 || x-i < 0) break;
        if((whiteTurn && tr[y+i].cells[x-i].className[0] === "w") || (!whiteTurn && tr[y+i].cells[x-i].className[0] === "b")){
            break;
        }
        tr[y+i].cells[x-i].classList.add("possibleMoves");
        if((whiteTurn && tr[y+i].cells[x-i].className[0] === "b") || (!whiteTurn && tr[y+i].cells[x-i].className[0] === "w")){
            break;
        }
    }
    for (let i = 1; i <= 7-bishopMoveDown; i++) {
        if(y+i > 7 || x+i > 7) break;
        if((whiteTurn && tr[y+i].cells[x+i].className[0] === "w") || (!whiteTurn && tr[y+i].cells[x+i].className[0] === "b")){
            break;
        }
        tr[y+i].cells[x+i].classList.add("possibleMoves");
        if((whiteTurn && tr[y+i].cells[x+i].className[0] === "b") || (!whiteTurn && tr[y+i].cells[x+i].className[0] === "w")){
            break;
        }
    } 
}

function checksIfKingsAreChecked(color) {
    kingsEnemies = [];
    if(color === "black"){
        enemies = document.querySelectorAll(".wp,.wr,.wn,.wb,.wq");
        for(var enemy of enemies){
            getPossibleMoves(enemy.cellIndex,enemy.parentElement.rowIndex,enemy.classList[0]);
            if(document.querySelector(".bk").classList.contains("possibleEats")){
                kingsEnemies.push({"x" : enemy.cellIndex,"y" : enemy.parentElement.rowIndex,"piece" : enemy.classList[0]});
            }
            document.querySelectorAll('td').forEach(td => {
                td.classList.remove("possibleMoves","possibleEats");   
            });
        }
        if(!kingsEnemies.length) BlackKingChecked = false;
        else {
            document.querySelector(".bk").classList.add("kingIsChecked");
            BlackKingChecked = true;
        }
    }else {
        enemies = document.querySelectorAll(".bp,.br,.bn,.bb,.bq");
        for(var enemy of enemies){
            getPossibleMoves(enemy.cellIndex,enemy.parentElement.rowIndex,enemy.classList[0]);
            if(document.querySelector(".wk").classList.contains("possibleEats")){
                kingsEnemies.push({"x" : enemy.cellIndex,"y" : enemy.parentElement.rowIndex,"piece" : enemy.classList[0]});
            }
            document.querySelectorAll('td').forEach(td => {
                td.classList.remove("possibleMoves","possibleEats");   
            });
        }
        if(!kingsEnemies.length) WhiteKingChecked = false;
        else {
            document.querySelector(".wk").classList.add("kingIsChecked");
            WhiteKingChecked = true;
        }
    }    
}

function isPositionChecked(color,side){
    if(color == "white"){
        if(side == "right"){
            //check if empty squares for castling are checked or not
            //todo
            



        }


    }



}

function findPossibleMovesForCheckedKing(){
    possibleMovesForCheckedKing = [];
    if(BlackKingChecked){
        kingX = document.querySelector(".bk").cellIndex;
        kingY = document.querySelector(".bk").parentElement.rowIndex;
    }
    else{
        kingX = document.querySelector(".wk").cellIndex;
        kingY = document.querySelector(".wk").parentElement.rowIndex;
    }
    for(var kingsEnemy of kingsEnemies){
        while(kingX !== kingsEnemy.x || kingY !== kingsEnemy.y){
            if(kingX < kingsEnemy.x){
                kingX++;
                if(kingY < kingsEnemy.y){
                    kingY++;
                }
                else if(kingY > kingsEnemy.y){
                    kingY--;
                }
                possibleMovesForCheckedKing.push({"x": kingX,"y":kingY});
            }
            else if(kingX > kingsEnemy.x){
                kingX--;
                if(kingY < kingsEnemy.y){
                    kingY++;
                }
                else if(kingY > kingsEnemy.y){
                    kingY--;
                }
                possibleMovesForCheckedKing.push({"x": kingX,"y":kingY});
            }
            else{
                if(kingY < kingsEnemy.y){
                    kingY++;
                }
                else if(kingY > kingsEnemy.y){
                    kingY--;
                }
                possibleMovesForCheckedKing.push({"x": kingX,"y":kingY}); 
            }
        }
        possibleMovesForCheckedKing.pop();
    }
}

function promote(){
    //todo

}

function castling(y){
    if(y === 7){
        if(!WhiteKingHasMoved){
            if(!WhiteLeftRockHasMoved){
                if(tr[y].cells[1].className.length === 0 && tr[y].cells[2].className.length === 0 && tr[y].cells[3].className === "possibleMoves"){
                    castlingEnabled = true;
                    tr[y].cells[2].classList.add("possibleMoves");
                }
            }
            if(!WhiteRightRockHasMoved){
                if(tr[y].cells[5].className === "possibleMoves" && tr[y].cells[6].className.length === 0 ){
                    castlingEnabled = true;
                    tr[y].cells[6].classList.add("possibleMoves");
                }
            }
        } 
    }else {
        if(!BlackKingHasMoved){
            if(!BlackLeftRockHasMoved){
                if(tr[y].cells[1].className.length === 0 && tr[y].cells[2].className.length === 0 && tr[y].cells[3].className === "possibleMoves"){
                    castlingEnabled = true;
                    tr[y].cells[2].classList.add("possibleMoves");
                }
            }
            if(!BlackRightRockHasMoved){
                if(tr[y].cells[5].className === "possibleMoves" && tr[y].cells[6].className.length === 0 ){
                    castlingEnabled = true;
                    tr[y].cells[6].classList.add("possibleMoves");
                }
            }
        }
    }
}
