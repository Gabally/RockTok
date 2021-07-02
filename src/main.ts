import "./style.css";
import "../assets/EarlyGameboyFont.css";
import { Game } from "./Game";

var game: Game;

const AddclickListener = (id: string, cb: () => void): void => {
    let el = document.getElementById(id);
    el.addEventListener("click", cb);
};

const Hide = (id: string): void => {
    document.getElementById(id).style.display = "none";
}

const Show = (id: string): void => {
    document.getElementById(id).style.display = "block";
}

AddclickListener("startSingleplayer", (): void => {
    Hide("menu");
    Show("game");
    game = new Game("screen");
});

/*
Hide("menu");
Show("game");
game = new Game("screen");
*/