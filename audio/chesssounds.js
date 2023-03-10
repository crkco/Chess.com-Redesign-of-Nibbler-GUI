const base_audio_path = "audio/";
const chessmove_file = "chessmove.wav";
const chessmate_file = "chessmate.wav";
const chesscheck_file = "chesscheck.wav";
const chesscapture_file = "chesscapture.wav";

var audio_chessmove = new Audio("audio/aldruun/chessmove.wav");
var audio_chessmate = new Audio("audio/aldruun/chessmate.wav");
var audio_chesscheck = new Audio("audio/aldruun/chesscheck.wav");
var audio_chesscapture = new Audio("audio/aldruun/chesscapture.wav");

/* Credits to https://github.com/Aldruun */

function load_audio_files() {
    audio_chessmove = new Audio("audio/" + config.sound_folder + "/" + chessmove_file);
    audio_chessmate = new Audio("audio/" + config.sound_folder + "/" + chessmate_file);
    audio_chesscheck = new Audio("audio/" + config.sound_folder + "/" + chesscheck_file);
    audio_chesscapture = new Audio("audio/" + config.sound_folder + "/" + chesscapture_file);
}

function play_move_sound(node) {
    if(node.board.no_moves() && node.board.king_in_check()) {
        play_chessmate_sound();
    } else if(node.board.king_in_check()) {
        play_chesscheck_sound();
    } else if (node.board.capture_flag) {
        play_chesscapture_sound();
    } else {
        play_chessmove_sound();
    }
}

function play_chessmove_sound() {
    audio_chessmove.currentTime = 0;
    audio_chessmove.play();
}

function play_chesscheck_sound() {
    audio_chesscheck.currentTime = 0;
    audio_chesscheck.play();
}

function play_chessmate_sound() {
    audio_chessmate.currentTime = 0;
    audio_chessmate.play();
}

function play_chesscapture_sound() {
    audio_chesscapture.currentTime = 0;
    audio_chesscapture.play();
}