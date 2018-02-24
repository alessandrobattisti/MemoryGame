const imgs = [
    "flag-checkered", "futbol", "home", "lemon", "location-arrow", "lock",
    "magnet", "medkit", "money-bill-alt", "plug", "puzzle-piece", "chess-bishop",
    "chess-king", "chess-knight", "chess-pawn", "chess-rook", "anchor",
    "bath", "bed", "bicycle", "binoculars", "bug", "bus", "camera-retro", "cube",
    "eye", "female", "fighter-jet", "fire-extinguisher"
];

const board = document.querySelector('.board');
const header = document.querySelector('.header');
const b_size_sel = document.querySelector('#board-size');
const moves_span = document.querySelector('#n-moves');
const stars_div = document.querySelector('.stars');
const reload_button = document.querySelector('.reload');
const play_again_button = document.querySelector('.play-again');
const game_won_tab =  document.querySelector('.game-won');
const ok_tab =  document.querySelector('.ok');
const end_moves = document.querySelector('.end-moves');
const end_star = document.querySelector('.end-star');
const timer_span = document.querySelector('.timer');
const time_taken =  document.querySelector('.time-taken');
const best_scores_section =  document.querySelector('.best-scores');
const best_scores_table =  document.querySelector('.table-data');
const change_user = document.querySelector('.change-user');
const current_user = document.querySelector('.current-user')
const solved = [];
const flipped = [];

let my_timer = null;
let stars = 3;
let moves = 0;
let min_moves = 0;
let animation_running = false;
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
    stars = 3;
    time = 0;
    animation_running = false;
    board.innerHTML = '';
    stars_div.innerHTML = '';
}

/** This function compute the right board dimension to fit the screen. */
function define_height(){
    game_won_tab.style.height = 'px';
    const h_height = header.offsetHeight;
    const w_widht = window.innerWidth;
    const w_height = window.innerHeight;
    let b_height = board.offsetHeight;
    let b_width = board.offsetWidth;

    let width = null;
    if(w_widht >= w_height){
        width =  w_height - 15 - h_height;
    }else{
        width =  w_widht - 15;
    }
    if(width > 700){
        width = 700;
    }

    board.style.height = width  + 'px';
    board.style.width = width   + 'px';
    header.style.width =  width   + 'px';
    best_scores_section.style.width =  width   + 'px';
}

/** Init the board. */
function init_board(){
    //INIT OR CLEAR TIMER
    timer_span.innerHTML = '';
    time = 0;
    clearTimeout(my_timer);
    timer_started = false;
    //UPDATE SCORE
    moves_span.innerHTML = moves;
    //INSERT STARS
    for (let i = 0; i < 3; i++){
        const el = document.createElement('i');
        el.className = 'fas fa-star';
        stars_div.appendChild( el );
    }
    //CREATE AND INSERT CARDS
    const fragment = document.createDocumentFragment();
    board_size = b_size_sel.options[b_size_sel.selectedIndex].value;
    //select random images
    const selected_img = shuffleArray(imgs).slice( 0, board_size**2 / 2 );
    //shuffle cards
    const img_array = shuffleArray( selected_img.concat(selected_img) );
    min_moves = board_size * 2;
    //insert into board
    for ( i=0; i < board_size**2; i++){
        const newElement = document.createElement('div');
        //create card
        newElement.className = 'card';
        newElement.style.height = 100 / board_size  + "%";
        newElement.style.width =  100 / board_size  + "%";
        //create card-back
        const card_back = document.createElement('div');
        card_back.className = 'card-back';
        //create card-front
        const card_front = document.createElement('div');
        card_front.className = 'card-front';
        const icon = document.createElement('i');
        icon.className = 'fas fa-'+img_array[i];
        //append to card
        card_front.appendChild(icon);
        newElement.appendChild(card_front);
        newElement.appendChild(card_back);
        //append to fragment
        fragment.appendChild(newElement);
    }
    board.appendChild(fragment)
    board.style.display = 'flex';
}

/** Compare CSS classes of flipped cards. */
function check_cards(){
    console.log(flipped)
    const card_class = flipped[0].querySelector('.card-front').firstChild.classList[1];
    const first_class = flipped[1].querySelector('.card-front').firstChild.classList[1];
    //if are identical
    if(first_class === card_class){
        flipped[0].classList.toggle('solved');
        flipped[1].classList.toggle('solved');
        //add to solved array
        solved.push(flipped[0]);
        solved.push(flipped[1]);
        flipped.splice(0, flipped.length); // now there's no card selected
        //timeout to wait until the css animation ends
        setTimeout(function(){ animation_running = false; }, 300);
        //check if game is won
        if (solved.length == board_size ** 2){
            game_won();
        }

    }else{
        //start error animation
        flipped[0].classList.toggle('error');
        flipped[1].classList.toggle('error');
        //timeout to wait until the css animation ends
        setTimeout(function(){
            //end error animation
            flipped[0].classList.toggle('error');
            flipped[1].classList.toggle('error');
            //flip both cards
            flipped[0].classList.toggle('flipped');
            flipped[1].classList.toggle('flipped');
            //remove from flipped array
            flipped.pop();
            flipped.pop();
        }, 300);
        //timeout to wait untile the css animation ends
        setTimeout(function(){ animation_running = false; }, 300);
    }

}

/** This function insert the stars into the header. */
function change_stars(moves){
    let difference =  moves - min_moves;
    if ( difference < 0 ){
        return;
    }else{
        //compute stars number
        new_stars = 3 - Math.floor( difference / ( min_moves / 1.5 ) );
    }
    //if stars changed update the page
    if (new_stars <= stars && new_stars > 0){
        stars_div.innerHTML = '';
        for (let i = 0; i < new_stars; i++){
            const el = document.createElement('i');
            el.className = 'fas fa-star';
            stars_div.appendChild( el );
        }
        for (let i = 0; i < 3 - new_stars; i++){
            const el = document.createElement('i');
            el.className = 'far fa-star';
            stars_div.appendChild( el );
        }
        stars = new_stars;
    }

}

/** Actions and animations to do if user won the game. */
function game_won(){
    timer_span.innerHTML = '';
    clearTimeout(my_timer);
    end_star.innerHTML = stars;
    if(stars==1){
        document.querySelector('.pluralize-stars').style.display = 'none';
    }else{
        document.querySelector('.pluralize-stars').style.display = 'inline';
    }

    let score = 200 - ( moves * 3 ) - (  time * 2 ) + ( board_size**2 ) * 5 ;
    if ( score < 0 ){
        score = 0;
    }

    end_moves.innerHTML = moves;
    time_taken.innerHTML = time;
    game_won_tab.classList.toggle('show-game-won');
    setTimeout( function(){ok_tab.classList.toggle('ok-animation'); }, 250);
    update_local_storage(board_size, time, moves, score)
}

/** Create and start the timer. */
function start_timer(){
    const start = new Date().getTime();
    timer_span.innerHTML = time + ' s';
    my_timer = setInterval(function() {
        const now = new Date().getTime();
        const elapsed = now - start;
        time = Math.floor(elapsed/1000);
        timer_span.innerHTML = time + ' s';
    }, 1000);
}

/** Update the results table and Set default data in localStorage if empty*/
function init_best_scores(){
    if(localStorage.getItem('user') == null){
        localStorage.setItem('user', 'Guest');
    }
    current_user.innerHTML = localStorage.getItem('user');
    //best scores
    best_scores_table.innerHTML = '';
    const local = localStorage.getItem('best_scores')
    if(local==null || local == '[]'){
        document.querySelector('.no-score-data').style.display = 'block';
        localStorage.setItem('best_scores', JSON.stringify( [] ));
        best_scores = '';
    } else {
        best_scores = JSON.parse(localStorage.getItem('best_scores'));
        document.querySelector('.no-score-data').style.display = 'none';
        for (let i = 0; i < best_scores.length; i++){
            const score = best_scores[i];
            const row = best_scores_table.insertRow()
            let cell = row.insertCell();
            cell.innerHTML = i+1;
            for ( const key in score ) {
                if (score.hasOwnProperty(key)) {
                    cell = row.insertCell();
                    cell.innerHTML = score[key];
                }
            }
        }
    }
}

//https://stackoverflow.com/a/1129270
/** Helper fuction to sort array of object by object property */
function compare(a,b) {
  if (a.score > b.score)
    return -1;
  if (a.score < b.score)
    return 1;
  return 0;
}

/** Add game stats to local storage */
function update_local_storage(board_size, time, moves, score){
    const best_scores = JSON.parse(localStorage.getItem('best_scores'));
    const obj = {
        'user': localStorage.getItem('user'),
        'board': board_size+'x'+board_size,
        'time': time,
        'moves': moves,
        'score': Math.ceil(score)
    }
    best_scores.push( obj );
    // Sort array by score desc and limit to 10 entries
    best_scores.sort(compare);
    best_scores.splice(10);
    localStorage.setItem('best_scores', JSON.stringify( best_scores ));
    init_best_scores();
}

                                /*LISTENERS*/

board.addEventListener('click', function(e){
    const card = e.target.parentNode;
    if (timer_started === false){
        start_timer();
        timer_started = true;
    }
    //if the card clicked is solved or flipped already ignore
    if(solved.indexOf(card) > -1 || animation_running || flipped.indexOf(card) > -1){
        return;
    }//else flip
    card.classList.toggle('flipped');
    flipped.push(card);
    //if it's the second flipped card compare it with the first one
    if(flipped.length === 2){
        moves += 1;
        if(moves==1){
            document.querySelector('.pluralize-moves').style.display = 'none';
        }else{
            document.querySelector('.pluralize-moves').style.display = 'inline';
        }
        change_stars(moves);
        moves_span.innerHTML = moves;
        animation_running = true;
        setTimeout( function(){ check_cards() }, 300);
    }
});

reload_button.addEventListener('click', function(){
    reset_data();
    init_board();
});

b_size_sel.addEventListener('change', function(){
    //reset if board size has changed
    if( animation_running == false){
        reset_data();
        init_board();
    }
});

play_again_button.addEventListener('click', function(){
    game_won_tab.classList.toggle('show-game-won');
    ok_tab.classList.toggle('ok-animation');
    reset_data();
    init_board();
});

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    let user_name = document.querySelector('#user-name').value;
    if (user_name == null || user_name == '' ){
        user_name = 'Guest';
    }
    localStorage.setItem('user', user_name );
    current_user.innerHTML = user_name ;
    change_user.style.display = 'none';
});

document.querySelector('.edit-user').addEventListener('click', function(){
    change_user.style.display = 'block';
});

window.addEventListener( 'resize', define_height );

/** Start the game. */
define_height();
init_board();
init_best_scores();
