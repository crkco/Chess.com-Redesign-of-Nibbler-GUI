var eval_icon_x = 0;
var eval_icon_y = 0;
var eval_icon_size = 2 / 5;
var eval_icon_offset = 1 / 9;
var eval_icon_edge_adj = 1 / 6;

var is_eval_visible = false;
var eval_node = null;
var eval_icon = null;
var last_eval_diff = 0;

var book_moves_cache = null;
var book_moves_cache_node_id = null;

var best_img = new Image();
var excellent_img = new Image();
var good_img = new Image();
var inaccuracy_img = new Image();
var mistake_img = new Image();
var blunder_img = new Image();
var winner_img = new Image();
var book_img = new Image();

best_img.src = "node_eval/images/best_256x.png";
excellent_img.src = "node_eval/images/excellent_256x.png";
good_img.src = "node_eval/images/good_256x.png";
inaccuracy_img.src = "node_eval/images/inaccuracy_256x.png";
mistake_img.src = "node_eval/images/mistake_256x.png";
blunder_img.src = "node_eval/images/blunder_256x.png";
winner_img.src = "node_eval/images/winner_256x.png";
book_img.src = "node_eval/images/book_256x.png";

function node_eval_changed() {
    eval_node = hub.tree.node;

    if (!config.is_eval_enabled || eval_node === null) {   // Only visible after first move and when show WDL is active
        is_eval_visible = false;
        return;
    }

    update_score();

    while (eval_node.move === null && eval_node.parent !== null) {  // Search for current visible node
        eval_node = eval_node.parent;
    }

    if (eval_node.move === null) {
        is_eval_visible = false;
        return;
    }

    let [eval_node_x, eval_node_y] = XY(eval_node.move_old_format().slice(2, 4));

    if (config.flip) {
        eval_node_x = 7 - eval_node_x;
        eval_node_y = 7 - eval_node_y;
    }

    eval_icon_x = config.square_size * (eval_node_x - eval_icon_size + eval_icon_offset + 1);
    eval_icon_y = config.square_size * (eval_node_y - eval_icon_offset);

    if (eval_node_x === 7) {    // Prevent icon outside bounds
        eval_icon_x -= config.square_size * eval_icon_edge_adj;
    }

    if (eval_node_y === 0) {
        eval_icon_y += config.square_size * eval_icon_edge_adj;
    }

    is_eval_visible = true;
    eval_icon = null;

    analysis_changed();

    hub.tree.dom_from_scratch();
}

function draw_node_eval() {
    if (!is_eval_visible) {
        return;
    }

    //eval_node.table.get_eval
    let parent_info_list = SortedMoveInfo(eval_node.parent);
    let eval_info_list = SortedMoveInfo(eval_node);

    if(parent_info_list[0] === undefined) {
        return;
    }

    var eval_diff = 0;

    if (eval_info_list.length !== 0) { // Calculate eval difference from one move to another
        let parent_eval = parent_info_list[0].value() * 100;
        let current_eval = 100 - eval_info_list[0].value() * 100;
        
        //let parent_eval = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * parent_info_list[0].cp)) - 1);
        //let current_eval = 50 - 50 * (2 / (1 + Math.exp(-0.00368208 * eval_info_list[0].cp)) - 1);
        
        eval_diff = current_eval - parent_eval;

        if (eval_diff > 0 || parent_info_list[0].move == eval_node.move) {  // Best move played
            eval_diff = 0;
        }

        eval_diff = - 1 * eval_diff;

        eval_node.eval_diff = eval_diff;
    }

    if(eval_node.board.no_moves() && eval_node.board.king_in_check()) {
        eval_icon = winner_img;
        eval_diff = 0;
    } else if (!(hub.engine.search_running.node && hub.engine.search_running === hub.engine.search_desired)
            && !(hub.engine.search_running !== hub.engine.search_desired)) {
        if(eval_node.table.nodes === 0) { // If engine is stopped and no nodes, dont show eval icon.
            eval_icon = null;
            return;
        }
    }

    if (eval_diff !== last_eval_diff || eval_icon === null) {   // Chess.com classifications
        if (eval_diff === 0) {eval_icon = best_img;} else
        if (eval_diff <= 2) {eval_icon = excellent_img;} else
        if (eval_diff <= 5) {eval_icon = good_img;} else
        if (eval_diff <= 10) {eval_icon = inaccuracy_img;} else
        if (eval_diff <= 20) {eval_icon = mistake_img;} else
        {eval_icon = blunder_img;}

        last_eval_diff = eval_diff;
    }

    if(eval_node.depth <= 10) {
        load_book_moves();

        if(is_book_move(eval_node.move)) {
            eval_icon = book_img;
        }
    }

    if(eval_node === undefined || eval_node === null) {
        return;
    }

    if(eval_node.eval_icon !== eval_icon) {
        eval_node.eval_icon = eval_icon;
        //analysis_changed();
    }

    eval_node.eval_icon = eval_icon;

    if (eval_node !== undefined && eval_node !== null) {
        boardctx.drawImage(eval_icon, eval_icon_x, eval_icon_y, config.square_size * eval_icon_size, config.square_size * eval_icon_size);
    }
}

const openinginfo = document.getElementById("openinginfo");

function load_book_moves() {
    if(hub.tree.node.parent === null) {
        openinginfo.innerHTML = "Starting Position";
        return;
    }

    let ok = true;

    if (config.looker_api !== "lichess_masters" && config.looker_api !== "lichess_plebs") {
        ok = false;
    }

    let current_node = hub.tree.node;
    let current_entry = hub.looker.lookup(config.looker_api, current_node.board);

    if(current_entry !== null) {
        while(current_entry.opening === "null" && current_node.parent !== null) {
            current_node = current_node.parent;
            current_entry = hub.looker.lookup(config.looker_api, current_node.board);

            if(current_entry === null) {
                break;
            }
        }

        openinginfo.innerHTML = current_entry.opening;
    }

    let entry = hub.looker.lookup(config.looker_api, hub.tree.node.parent.board);

    if (!entry) {
        ok = false;
    }

    if (!ok) {
        book_moves_cache = null;
        book_moves_cache_node_id = null;
        return;
    }

    if (!book_moves_cache || book_moves_cache_node_id !== hub.tree.node.parent.id) {
        let tmp = {};
        for (let move of Object.keys(entry.moves)) {
            if (!hub.tree.node.parent.board.illegal(move)) {
                if (tmp[move] === undefined) {
                    tmp[move] = {move: move};
                }
            }
        }
        book_moves_cache_node_id = hub.tree.node.parent.id;
        book_moves_cache = Object.values(tmp);
    }
}

function is_book_move(move) {
    if(book_moves_cache === null) {
        return false;
    }

    for (let book_move of book_moves_cache) {
        if(book_move.move === move){
            return true;
        }
    }

    return false;
}

function update_score() {
    let spans_w = "";
    let spans_b = "";

    let pawn_count_w = 8 - eval_node.board.find("P").length;
    let knight_count_w = 2 - eval_node.board.find("N").length;
    let bishop_count_w = 2 - eval_node.board.find("B").length;
    let rook_count_w = 2 - eval_node.board.find("R").length;
    let queen_count_w = 1 - eval_node.board.find("Q").length;

    let pawn_count_b = 8 - eval_node.board.find("p").length;
    let knight_count_b = 2 - eval_node.board.find("n").length;
    let bishop_count_b = 2 - eval_node.board.find("b").length;
    let rook_count_b = 2 - eval_node.board.find("r").length;
    let queen_count_b = 1 - eval_node.board.find("q").length;
    
    if(pawn_count_w === 1) {
        spans_w += `<span class="captured-pieces-w-pawn captured-pieces-cpiece"></span>`;
        console.log("hi");
    } else if (pawn_count_w > 1) {
        spans_w += `<span class="captured-pieces-w-${pawn_count_w}-pawns captured-pieces-cpiece"></span>`;
    }

    if(bishop_count_w === 1) {
        spans_w += `<span class="captured-pieces-w-bishop captured-pieces-cpiece"></span>`;
    } else if(bishop_count_w === 2) {
        spans_w += `<span class="captured-pieces-w-2-bishops captured-pieces-cpiece"></span>`;
    }

    if(knight_count_w === 1) {
        spans_w += `<span class="captured-pieces-w-knight captured-pieces-cpiece"></span>`;
    } else if(knight_count_w === 2) {
        spans_w += `<span class="captured-pieces-w-2-knights captured-pieces-cpiece"></span>`;
    }

    if(rook_count_w === 1) {
        spans_w += `<span class="captured-pieces-w-rook captured-pieces-cpiece"></span>`;
    } else if(rook_count_w === 2) {
        spans_w += `<span class="captured-pieces-w-2-rooks captured-pieces-cpiece"></span>`;
    }

    if(queen_count_w === 1) {
        spans_w += `<span class="captured-pieces-w-queen captured-pieces-cpiece"></span>`;
    }

    if(pawn_count_b === 1) {
        spans_b += `<span class="captured-pieces-b-pawn captured-pieces-cpiece"></span>`;
    } else if (pawn_count_b > 1) {
        spans_b += `<span class="captured-pieces-b-${pawn_count_b}-pawns captured-pieces-cpiece"></span>`;
    }

    if(bishop_count_b === 1) {
        spans_b += `<span class="captured-pieces-b-bishop captured-pieces-cpiece"></span>`;
    } else if(bishop_count_b === 2) {
        spans_b += `<span class="captured-pieces-b-2-bishops captured-pieces-cpiece"></span>`;
    }

    if(knight_count_b === 1) {
        spans_b += `<span class="captured-pieces-b-knight captured-pieces-cpiece"></span>`;
    } else if(knight_count_b === 2) {
        spans_b += `<span class="captured-pieces-b-2-knights captured-pieces-cpiece"></span>`;
    }

    if(rook_count_b === 1) {
        spans_b += `<span class="captured-pieces-b-rook captured-pieces-cpiece"></span>`;
    } else if(rook_count_b === 2) {
        spans_b += `<span class="captured-pieces-b-2-rooks captured-pieces-cpiece"></span>`;
    }

    if(queen_count_b === 1) {
        spans_b += `<span class="captured-pieces-b-queen captured-pieces-cpiece"></span>`;
    }

    let total_score_w = pawn_count_w + knight_count_w * 3 + bishop_count_w * 3 + rook_count_w * 5 + queen_count_w * 9;
    let total_score_b = pawn_count_b + knight_count_b * 3 + bishop_count_b * 3 + rook_count_b * 5 + queen_count_b * 9;

    let score_w = 0;
    let score_b = 0;

    if(total_score_w > total_score_b) {
        score_w = total_score_w - total_score_b;
    } else if(total_score_b > total_score_w) {
        score_b = total_score_b - total_score_w;
    }

    if(score_w !== 0) {
        spans_w += `<span class="captured_score">+${score_w}</span>`;
    } else {
        spans_w += `<span class="captured_score"></span>`;
    }

    if(score_b !== 0) {
        spans_b += `<span class="captured_score">+${score_b}</span>`;
    } else {
        spans_b += `<span class="captured_score"></span>`;
    }

    if(config.flip) {
        captured_upper.innerHTML = spans_b;
        captured_lower.innerHTML = spans_w;
    } else {
        captured_upper.innerHTML = spans_w;
        captured_lower.innerHTML = spans_b;
    }
}