

function analysis_changed() {
    let anal_node = hub.tree.node;

    //if(!anal_node.is_main_line()) {
    //    return;
    //}

    var ex_count_w = 0;
    var be_count_w = 0;
    var go_count_w = 0;
    var bo_count_w = 0;
    var in_count_w = 0;
    var mi_count_w = 0;
    var bl_count_w = 0;
    
    var ex_count_b = 0;
    var be_count_b = 0;
    var go_count_b = 0;
    var bo_count_b = 0;
    var in_count_b = 0;
    var mi_count_b = 0;
    var bl_count_b = 0;

    let accuracy_w = 0.0;
    let accuracy_b = 0.0;

    let acc_count_w = 0;
    let acc_count_b = 0;

    anal_node = anal_node.get_end();

    while(anal_node !== undefined && anal_node !== null) {

        if(anal_node.depth % 2 === 1) {
            if(anal_node.eval_icon === best_img || anal_node.eval_icon === winner_img) { be_count_w++; } else 
            if(anal_node.eval_icon === excellent_img) { ex_count_w++; } else 
            if(anal_node.eval_icon === good_img) { go_count_w++; } else 
            if(anal_node.eval_icon === book_img) { bo_count_w++; } else 
            if(anal_node.eval_icon === inaccuracy_img) { in_count_w++; } else 
            if(anal_node.eval_icon === mistake_img) { mi_count_w++; } else 
            if(anal_node.eval_icon === blunder_img) { bl_count_w++; } 

            if(anal_node.parent !== undefined && anal_node.parent !== null) {
                accuracy_w += (103.1668 * Math.exp(-0.04354 * (anal_node.eval_diff)) - 3.1669);
                acc_count_w++;
            }
        } else if (anal_node.depth % 2 === 0) {
            if(anal_node.eval_icon === best_img || anal_node.eval_icon === winner_img) { be_count_b++; } else 
            if(anal_node.eval_icon === excellent_img) { ex_count_b++; } else 
            if(anal_node.eval_icon === good_img) { go_count_b++; } else 
            if(anal_node.eval_icon === book_img) { bo_count_b++; } else 
            if(anal_node.eval_icon === inaccuracy_img) { in_count_b++; } else 
            if(anal_node.eval_icon === mistake_img) { mi_count_b++; } else 
            if(anal_node.eval_icon === blunder_img) { bl_count_b++; } 

            if(anal_node.parent !== undefined && anal_node.parent !== null) {
                accuracy_b += (103.1668 * Math.exp(-0.04354 * (anal_node.eval_diff)) - 3.1669);
                acc_count_b++;
            }
        }
        

        if(anal_node === undefined || anal_node.parent === null) {
            break;
        }

        anal_node = anal_node.parent;
    }

    var be_w = document.getElementById("rev_count_w_2");
    var ex_w = document.getElementById("rev_count_w_3");
    var go_w = document.getElementById("rev_count_w_4");
    var bo_w = document.getElementById("rev_count_w_5");
    var in_w = document.getElementById("rev_count_w_6");
    var mi_w = document.getElementById("rev_count_w_7");
    var bl_w = document.getElementById("rev_count_w_8");

    be_w.innerHTML = be_count_w;
    ex_w.innerHTML = ex_count_w;
    go_w.innerHTML = go_count_w;
    bo_w.innerHTML = bo_count_w;
    in_w.innerHTML = in_count_w;
    mi_w.innerHTML = mi_count_w;
    bl_w.innerHTML = bl_count_w;

    var be_b = document.getElementById("rev_count_b_2");
    var ex_b = document.getElementById("rev_count_b_3");
    var go_b = document.getElementById("rev_count_b_4");
    var bo_b = document.getElementById("rev_count_b_5");
    var in_b = document.getElementById("rev_count_b_6");
    var mi_b = document.getElementById("rev_count_b_7");
    var bl_b = document.getElementById("rev_count_b_8");

    be_b.innerHTML = be_count_b;
    ex_b.innerHTML = ex_count_b;
    go_b.innerHTML = go_count_b;
    bo_b.innerHTML = bo_count_b;
    in_b.innerHTML = in_count_b;
    mi_b.innerHTML = mi_count_b;
    bl_b.innerHTML = bl_count_b;

    var acc_w = document.getElementById("acc_w");
    var acc_b = document.getElementById("acc_b");

    let tot_acc_w = accuracy_w / acc_count_w;
    let tot_acc_b = accuracy_b / acc_count_b;

    acc_w.innerHTML = `${tot_acc_w.toFixed(1)}<br><div id="rev_acc">Accuracy</div>`;
    acc_b.innerHTML = `${tot_acc_b.toFixed(1)}<br><div id="rev_acc">Accuracy</div>`;
}

var myButton = document.getElementById("btn_to_start");
    myButton.addEventListener("click", function() {
        hub.tree.goto_root();
        hub.position_changed(false, false);
});

var myButton = document.getElementById("btn_backward");
    myButton.addEventListener("click", function() {
        hub.tree.prev();
        hub.position_changed(false, false);
});

var myButton = document.getElementById("btn_auto_play");
    myButton.addEventListener("click", function() {
      console.log("3");
});

var myButton = document.getElementById("btn_forward");
    myButton.addEventListener("click", function() {
        hub.tree.next();
        hub.position_changed(false, false);
});

var myButton = document.getElementById("btn_to_end");
    myButton.addEventListener("click", function() {
        hub.tree.goto_end();
        hub.position_changed(false, false);
});