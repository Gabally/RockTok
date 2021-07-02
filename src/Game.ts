import { keyboardManager } from "./keyboardManager";

export class Game {
    canvas: HTMLCanvasElement;
    ratio = 16/9;
    keyboard: keyboardManager;

    constructor(canvas: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvas);
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.canvas.style.background = "black";
        window.addEventListener("resize", () => this.resizeCanvas());
        this.resizeCanvas();
        this.keyboard = new keyboardManager();
    }

    resizeCanvas() {
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;
        let newWidthToHeight = newWidth / newHeight;
        if (newWidthToHeight > this.ratio) {
          newWidth = newHeight * this.ratio;
          this.canvas.style.height = newHeight + "px";
          this.canvas.style.width = newWidth + "px";
        } else {
          newHeight = newWidth / this.ratio;
          this.canvas.style.width = newWidth + "px";
          this.canvas.style.height = newHeight + "px";
        }
    }
}