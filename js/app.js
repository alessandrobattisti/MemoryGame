const imgs = [
    "chess-bishop",
    "chess-king",
    "chess-knight",
    "chess-pawn",
    "chess-rook",
    "anchor",
    "bath",
    "bed",
    "bicycle",
    "binoculars",
    "bug",
    "bus",
    "camera-retro",
    "cube",
    "eye",
    "female",
    "fighter-jet",
    "fire-extinguisher",
    "flag-checkered",
    "futbol",
    "home",
    "lemon",
    "location-arrow",
    "lock",
    "magnet",
    "medkit",
    "money-bill-alt",
    "plug",
    "puzzle-piece"
]
const board = document.querySelector('.board');
const header = document.querySelector('.header');
const b_size_sel = document.getElementById('board-size');
const solved = [];
let animation_running = false;
let first_selected = false;

//shuffle array https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function define_height(){
    const h_height = header.offsetHeight
    const w_widht = window.innerWidth;
    const w_height = window.innerHeight;
    let b_height = board.offsetHeight;
    let b_width = board.offsetWidth;
    if(w_widht >= w_height){
        let width =  w_height - 15 - h_height;
        if(width > 700){
            width = 700;
        }
        board.style.height = width + 'px';
        board.style.width = width + 'px';
        header.style.width = width + 'px';
    }else{
        let width =  w_widht - 15;
        if(width > 700){
            width = 700;
        }
        board.style.height = width - 15  + 'px';
        board.style.width = width - 15  + 'px';
        header.style.width =  width - 15  + 'px';
    }
}


function init_board(){
    const fragment = document.createDocumentFragment();
    const board_size = b_size_sel.options[b_size_sel.selectedIndex].value;
    const selected_img = imgs.slice( 0, board_size**2/2 )
    const img_array = shuffleArray( selected_img.concat(selected_img) );
    for ( i=0; i < board_size**2; i++){
        const newElement = document.createElement('div');
        newElement.className = 'card';
        newElement.style.height = 100 / board_size  + "%"
        newElement.style.width =  100 / board_size  + "%"

        const card_back = document.createElement('div');
        card_back.className = 'card-back';
        const card_front = document.createElement('div');
        card_front.className = 'card-front';
        const icon = document.createElement('i');
        icon.className = 'fas fa-'+img_array[i];
        card_front.appendChild(icon);
        newElement.appendChild(card_front);
        newElement.appendChild(card_back);

        fragment.appendChild(newElement);
    }
    board.appendChild(fragment)
}

function check_card(card){
    const card_class = card.querySelector('.card-front').firstChild.classList[1];
    const first_class = first_selected.querySelector('.card-front').firstChild.classList[1];

    if(first_class === card_class){
        card.classList.toggle('solved');
        first_selected.classList.toggle('solved');


        solved.push(card);
        solved.push(first_selected);
        first_selected = false;

        setTimeout(function(){ animation_running = false; }, 1000);
    }else{
        card.classList.toggle('error');
        first_selected.classList.toggle('error');

        setTimeout(function(){
            card.classList.toggle('error');
            first_selected.classList.toggle('error');


            card.classList.toggle('flipped');
            first_selected.classList.toggle('flipped');
            first_selected = false;

        }, 1000);

        setTimeout(function(){ animation_running = false; }, 1000);
    }

}


define_height();
init_board();

board.addEventListener('click', function(e){
    const card = e.target.parentNode;
    if(solved.indexOf(card) > -1 || animation_running){
        return;
    }else{
        console.log(solved)
    }
    card.classList.toggle('flipped');
    if(first_selected != false){
        animation_running = true;
        setTimeout( function(){ check_card(card) }, 1000);
    }else{
        first_selected = card;
    }
})
