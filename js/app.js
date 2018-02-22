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
    const board_size = 5;
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
        icon.className = 'fas fa-'+imgs[i];
        card_front.appendChild(icon);
        newElement.appendChild(card_front);
        newElement.appendChild(card_back);

        fragment.appendChild(newElement);
        console.log(i);
    }
    board.appendChild(fragment)
}


define_height();
init_board();

board.addEventListener('click', function(e){
    const card = e.target.parentNode;
    const card_front = card.querySelector('.card-front');
    //card_front.classList.toggle('solved');
    card.classList.toggle('flipped');
    card_front.addEventListener('animationend', function(){
        console.log('d');
    })
})
