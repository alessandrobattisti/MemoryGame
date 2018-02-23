const imgs = [
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
    "puzzle-piece",
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
]
const board = document.querySelector('.board');
const header = document.querySelector('.header');
const b_size_sel = document.getElementById('board-size');
const moves_span = document.getElementById('n-moves');
const stars_div = document.querySelector('.stars');
const reload_button = document.querySelector('.reload');
const play_again_button = document.querySelector('.play-again');
const game_won_tab =  document.querySelector('.game-won');
const ok_tab =  document.querySelector('.ok');
const end_moves = document.querySelector('.end-moves');
const end_star = document.querySelector('.end-star');
const timer_span = document.querySelector('.timer');
const time_taken =  document.querySelector('.time-taken');

const solved = [];
const flipped = [];
let my_timer = null;
let stars = 5;
let moves = 0;
let min_moves = 0;
let animation_running = false;
let first_selected = false;
let board_size = 0;
let timer_started = false;
let time = 0;

//shuffle array https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function reset_data(){
    solved.splice(0,solved.length);
    flipped.splice(0,solved.length);
    moves = 0;
    min_moves = 0;
    stars = 5;
    time = 0;
    animation_running = false;
    first_selected = false;
    board.innerHTML = '';
    stars_div.innerHTML = '';
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
    //init or clear timer
    timer_span.innerHTML = '';
    time = 0;
    clearTimeout(my_timer);
    timer_started = false;
    //update score and game won tab's height
    game_won_tab.style.height = document.body.scrollHeight+'px';
    moves_span.innerHTML = moves;
    //update stars
    for (let i = 0; i < 5; i++){
        const el = document.createElement('i');
        el.className = 'fas fa-star';
        stars_div.appendChild( el );
    }
    //create cards
    const fragment = document.createDocumentFragment();
    board_size = b_size_sel.options[b_size_sel.selectedIndex].value;
    const selected_img = shuffleArray(imgs).slice( 0, board_size**2 / 2 )
    const img_array = shuffleArray( selected_img.concat(selected_img) );
    min_moves = board_size * 2;
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
        setTimeout(function(){ animation_running = false; }, 500);
        if (solved.length == board_size ** 2){
            game_won();
        }

    }else{
        card.classList.toggle('error');
        first_selected.classList.toggle('error');

        flipped.pop();
        flipped.pop();
        setTimeout(function(){
            card.classList.toggle('error');
            first_selected.classList.toggle('error');


            card.classList.toggle('flipped');
            first_selected.classList.toggle('flipped');
            first_selected = false;

        }, 500);

        setTimeout(function(){ animation_running = false; }, 500);
    }

}

function change_stars(moves){
    let difference =  moves - min_moves;
    if ( difference < 0 ){
        return;
    }else{
        new_stars = 5 - Math.floor( difference / ( min_moves / 1.5 ) )
    }

    if (new_stars <= stars && new_stars > -1){
        stars_div.innerHTML = ''
        for (let i = 0; i < new_stars; i++){
            const el = document.createElement('i');
            el.className = 'fas fa-star';
            stars_div.appendChild( el );
        }
        for (let i = 0; i < 5 - new_stars; i++){
            const el = document.createElement('i');
            el.className = 'far fa-star';
            stars_div.appendChild( el );
        }
        stars = new_stars;
    }

}

function game_won(){
    end_star.innerHTML = stars;
    end_moves.innerHTML = moves;
    time_taken.innerHTML = time;
    game_won_tab.classList.toggle('hidden-game-won');
    setTimeout( function(){ok_tab.classList.toggle('ok-animation'); }, 250)

}

function start_timer(){
    timer_span.innerHTML = time + ' s'
    my_timer = setInterval(function() {
        time += 1;
        timer_span.innerHTML = time + ' s'
    }, 1000);
}

define_height();
init_board();

board.addEventListener('click', function(e){
    const card = e.target.parentNode;
    if (timer_started === false){
        start_timer();
        timer_started = true;
    }
    if(solved.indexOf(card) > -1 || animation_running || flipped.indexOf(card) > -1){
        return;
    }
    console.log(solved.length, board_size**2)
    card.classList.toggle('flipped');
    flipped.push(card)
    if(first_selected != false){
        moves += 1;
        change_stars(moves);
        moves_span.innerHTML = moves;
        animation_running = true;
        setTimeout( function(){ check_card(card) }, 500);
    }else{
        first_selected = card;
    }
})

reload_button.addEventListener('click', function(){
    reset_data();
    init_board();
})

b_size_sel.addEventListener('change', function(){
    reset_data();
    init_board();
})

play_again_button.addEventListener('click', function(){
    game_won_tab.classList.toggle('hidden-game-won');
    ok_tab.classList.toggle('ok-animation');
    reset_data();
    init_board();

})
