
var moving_piece = document.getElementById("moving_piece");

var animation_steps = 20;
var animation_time = 100;
var animation_step_time = animation_time / animation_steps;

var animation_steps2 = 30;
var animation_time2 = 300;
var animation_step_time2 = animation_time2 / animation_steps2;

var animation_finished = true;
var animation_started = false;
var animation_forward = false;
var skip_animation = false;
var anim_end_x = -1;
var anim_end_y = -1;

function animate_move(original_node, node) {
    if(node === null && original_node !== null) {
        animate_move_node(original_node, false, node);
        return;
    } else if (original_node === null && node !== null) {
        animate_move_node(node, true, node);
        return;
    }

    if(Math.abs(node.depth - original_node.depth) !== 1) {
        play_move_sound(node);
        return;
    }

    if(node.depth > original_node.depth) {
        animate_move_node(node, true, node);
    } else {
        animate_move_node(original_node, false, node);
    }
}

function animate_move_node(node, forward, sound_node) {
    let [x1, y1] = XY(node.move_old_format().slice(0, 2));
    let [x2, y2] = XY(node.move_old_format().slice(2, 4));

    let [startx, starty] = [0, 0];
    let [endx, endy] = [0, 0];

    if(forward) {
        [startx, starty] = [x1, y1];
        [endx, endy] = [x2, y2];
    } else {
        [startx, starty] = [x2, y2];
        [endx, endy] = [x1, y1];
    }

    anim_end_x = endx;
    anim_end_y = endy;

    animation_forward = forward;
    animation_finished = false;
    animation_started = true;

    let s = S(startx, starty);
    let s2 = S(endx, endy);

    let td = null;
    let td2 = null;

    if(forward) {
        td = document.getElementById("overlay_" + s);
        td2 = document.getElementById("overlay_" + s2);
    } else {
        td = document.getElementById("underlay_" + s);
        td2 = document.getElementById("underlay_" + s2);
    }

    let td_rect = td.getBoundingClientRect();
    let td_rect2 = td2.getBoundingClientRect();

    let dx = td_rect2.left - td_rect.left;
    let dy = td_rect2.top - td_rect.top;

    dx = dx / animation_steps;
    dy = dy / animation_steps;

    moving_piece.style.top=`${td_rect.top}px`;
    moving_piece.style.left=`${td_rect.left}px`;

    let bg = td.style["background-image"];
    
    moving_piece.style["background-image"] = bg;
    moving_piece.style["background-repeat"] = "no-repeat";
    moving_piece.style["background-size"] = `${config.square_size}px ${config.square_size}px`;

    if(config.piece_movement === "default") {
        setTimeout(inc_animation, animation_step_time, td_rect.top, td_rect.left, dx, dy, 0, bg, s2);
        setTimeout(play_move_sound, animation_time, sound_node);
    } else if(config.piece_movement === "arced") {
        setTimeout(inc_animation2, animation_step_time2, td_rect.left, td_rect.top, td_rect2.left, td_rect2.top, 0, bg, td_rect.left, td_rect.top);
	    setTimeout(play_move_sound, animation_time2, sound_node);
    }
}

function inc_animation(top, left, dx, dy, i, bg, td_str) {
    if(animation_finished) {
        return;
    }

    moving_piece.style.top = `${top + i*dy}px`;
    moving_piece.style.left = `${left + i*dx}px`;

    let i2 = i + 1;

    if(i2 >= animation_steps) {
        moving_piece.style["background-image"] = null;
        animation_finished = true;
        hub.draw();
        return;
    }

    setTimeout(inc_animation, animation_step_time, top, left, dx, dy, i2, bg, td_str);
}

function easySign(val) {
    if(val < 0) {
        return -1;
    }

    return 1;
}

function inc_animation2(x1, y1, x2, y2, i, bg, currentX, currentY) {
    if(animation_finished) {
        return;
    }

    let total_xdiff = x2 - x1;
    let total_ydiff = y2 - y1;

    let total_dist = Math.sqrt(total_xdiff * total_xdiff + total_ydiff * total_ydiff);

    let pieceVecX = (x2 - currentX);
    let pieceVecY = (y2 - currentY);

    //pieceVecX = pieceVecX / pieceVecLength * step_length;
    //pieceVecY = pieceVecY / pieceVecLength * step_length;
    
    pieceVecX = total_xdiff / animation_steps2;
    pieceVecY = total_ydiff / animation_steps2;

    let nextX = x1 + pieceVecX * i;
    let nextY = y1 + pieceVecY * i; 

    let nextDistFromStartX = nextX - x1;
    let nextDistFromStartY = nextY - y1;

    let nextDistFromStart = Math.sqrt(nextDistFromStartX * nextDistFromStartX + nextDistFromStartY * nextDistFromStartY);

    let fraction = nextDistFromStart / total_dist;

    let baseY = total_ydiff * fraction + y1;

    let arcHeight = config.square_size * 5;

    let arc = - easySign(total_ydiff) * arcHeight * ((nextY - y1) * (nextY - y2) + (nextX - x1) * (nextX - x2)) / (total_dist * total_dist);

    moving_piece.style.top = `${baseY + arc}px`;
    moving_piece.style.left = `${nextX}px`;

    currentX = nextX;
    currentY = nextY;

    let i2 = i + 1;

    if(i >= animation_steps2) {
        moving_piece.style["background-image"] = null;
        animation_finished = true;
        hub.draw();
        return;
    }

    setTimeout(inc_animation2, animation_step_time2, x1, y1, x2, y2, i2, bg, currentX, currentY);
}