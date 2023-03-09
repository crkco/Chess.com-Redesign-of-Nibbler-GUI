
var moving_piece = document.getElementById("moving_piece");
var animation_steps = 10;
var animation_time = 100;
var animation_step_time = animation_time / animation_steps;
var animation_finished = true;
var animation_started = false;
var animation_forward = false;
var skip_animation = false;
var anim_end_x = -1;
var anim_end_y = -1;

function animate_move(original_node, node) {
    if(node === null && original_node !== null) {
        animate_move_node(original_node, false);
        return;
    } else if (original_node === null && node !== null) {
        animate_move_node(node, true);
        return;
    }

    if(node.depth - original_node.depth > 1 || original_node.depth - node.depth > 1) {
        return;
    }

    if(node.depth > original_node.depth) {
        animate_move_node(node, true);
    } else {
        animate_move_node(original_node, false);
    }
}

function animate_move_node(node, forward) {
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

    moving_piece.style.top=td_rect.top;
    moving_piece.style.left=td_rect.left;

    let bg = td.style["background-image"];

    setTimeout(inc_animation, animation_step_time, td_rect.top, td_rect.left, dx, dy, 0, bg, s2);
}

function inc_animation(top, left, dx, dy, i, bg, td_str) {
    if(animation_finished) {
        return;
    }

    if(i === 0) {
        moving_piece.style["background-image"] = bg;
        moving_piece.style["background-repeat"] = "no-repeat";
        moving_piece.style["background-size"] = `${config.square_size}px ${config.square_size}px`;
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