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
let kingMoves = [false, false, false, false, false, false, false, false]



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
            if( document.getElementById("active").cellIndex === 0 && document.getElementById("active").parentElement.rowIndex === 7) WhiteLeftRockHasMoved = true;
            if( document.getElementById("active").cellIndex === 7 && document.getElementById("active").parentElement.rowIndex === 7) WhiteRightRockHasMoved = true;
            if( document.getElementById("active").cellIndex === 0 && document.getElementById("active").parentElement.rowIndex === 0) BlackLeftRockHasMoved = true;
            if( document.getElementById("active").cellIndex === 7 && document.getElementById("active").parentElement.rowIndex === 0) BlackRightRockHasMoved = true;
        }
        if(document.getElementById("active").className[1] == "k"){
            if( document.getElementById("active").cellIndex === 4 && document.getElementById("active").parentElement.rowIndex === 0) BlackKingHasMoved = true;
            if( document.getElementById("active").cellIndex === 4 && document.getElementById("active").parentElement.rowIndex === 7) WhiteKingHasMoved = true;
        }
        document.getElementById("active").removeAttribute("class");
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
    document.querySelectorAll('td').forEach(td => {
        td.classList.remove("possibleMoves","possibleEats");   
    });
    
    
    if(document.getElementById("active")) document.getElementById("active").removeAttribute("id");
    
    if(e.target.className.length === 0 || (whiteTurn && e.target.className[0] === "b") || (!whiteTurn && e.target.className[0] === "w")){
        return;
    }

    e.target.id = "active";
    if(BlackKingChecked || WhiteKingChecked) showPossibleMovesForCheckedKing();
    else possibleMoves(e.target.cellIndex,e.target.parentElement.rowIndex,e.target.classList[0])

}

function possibleMoves(x,y,piece){

    if(piece === "wp"){
        tr[y].cells[x].removeAttribute("class");
        whiteTurn = false;
        checksIfKingsAreChecked("white");
        tr[y].cells[x].classList.add(piece);
        whiteTurn = true;
        if(y == 6) moves = 3;
        else moves = 2;
        for (let i = 1; i < moves; i++) {
            if(WhiteKingChecked || tr[y-i].cells[x].className.length != 0 ){    
                WhiteKingChecked = false;
                document.querySelector(".wk").classList.remove("kingIsChecked");
                break;
            }
            else{
                tr[y-i].cells[x].classList.add("possibleMoves");
            }
            
            
              
        }
        if(x != 0){ 
            if(tr[y-1].cells[x-1].className[0] === "b") tr[y-1].cells[x-1].classList.add("possibleEats");
        }
        if(x != 7) {
            if(tr[y-1].cells[x+1].className[0] === "b") tr[y-1].cells[x+1].classList.add("possibleEats");
        }
    }else if(piece === "bp"){
        if(y == 1) moves = 3;
        else moves = 2;
        for (let i = 1; i < moves; i++) {
            if(tr[y+i].cells[x].className.length !=0) break;
            tr[y+i].cells[x].classList.add("possibleMoves");  
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
            if(tr[y].cells[x+1] !== undefined && tr[y].cells[x+1].classList.contains("bp") ||tr[y].cells[x-1] !== undefined && tr[y].cells[x-1].classList.contains("bp")) kingMoves[4] = true;
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
            possibleMoves(opponent.cellIndex,opponent.parentElement.rowIndex,opponent.classList[0]);
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
        }if(y < 7){
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
    }document.querySelectorAll('.possibleMoves').forEach(td => regulatesMoves(td));
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

function regulatesMoves(td){
    if((whiteTurn && td.className[0]==="w") || (!whiteTurn && td.className[0]==="b")) td.classList.remove("possibleMoves");
    
    if((whiteTurn && td.className[0]==="b") || (!whiteTurn && td.className[0]==="w")){
        td.classList.remove("possibleMoves");
        td.classList.add("possibleEats");
        
    }
}

function checksIfKingsAreChecked(color) {
    if(color === "black"){
        enemies = document.querySelectorAll(".wp,.wr,.wn,.wb,.wq");
        for(var enemy of enemies){
            debugger
            possibleMoves(enemy.cellIndex,enemy.parentElement.rowIndex,enemy.classList[0]);
            if(document.querySelector(".bk").classList.contains("possibleEats")){
                document.querySelector(".bk").classList.add("kingIsChecked");
                BlackKingChecked = true;
                break;
            }else BlackKingChecked = false;
        }
    }else {
        
        enemies = document.querySelectorAll(".bp,.br,.bn,.bb,.bq");
        for(var enemy of enemies){
            possibleMoves(enemy.cellIndex,enemy.parentElement.rowIndex,enemy.classList[0]);
            if(document.querySelector(".wk").classList.contains("possibleEats")){
                document.querySelector(".wk").classList.add("kingIsChecked");
                WhiteKingChecked = true;
                break;
            }else WhiteKingChecked = false;
        }
    }
        

    document.querySelectorAll('td').forEach(td => {
        td.classList.remove("possibleMoves","possibleEats");   
    });
     
}

function showPossibleMovesForCheckedKing(){
    if(whiteTurn){


    }
    else{
        //blackKingisChecked todo
    }

    

}

function promote(){
    //todo

}

function castling(y){
    if(y == 7 ){
        if(!WhiteLeftRockHasMoved){
            if(tr[y].cells[1].className.length === 0 && tr[y].cells[2].className.length === 0 && tr[y].cells[3].className.length === 0){
                tr[y].cells[2].classList.add("possibleMoves");
            }
        }
        if(!WhiteRightRockHasMoved){
            if(tr[y].cells[5].className.length === 0 && tr[y].cells[6].className.length === 0 ){
                tr[y].cells[6].classList.add("possibleMoves");
            }
        } 
    }else {
        if(!BlackLeftRockHasMoved){
            if(tr[y].cells[5].className.length === 0 && tr[y].cells[6].className.length === 0 ){
                tr[y].cells[6].classList.add("possibleMoves");
            }
        }
        if(!BlackRightRockHasMoved){
            if(tr[y].cells[1].className.length === 0 && tr[y].cells[2].className.length === 0 && tr[y].cells[3].className.length === 0){
                tr[y].cells[2].classList.add("possibleMoves");
            }
        }
    }
}
