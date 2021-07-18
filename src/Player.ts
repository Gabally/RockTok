import { SpriteSplitter } from "./SpriteSplitter";
import { point, direction } from "./Game";

export class Player {
    up: HTMLImageElement[];
    down: HTMLImageElement[];
    left: HTMLImageElement[];
    rigth: HTMLImageElement[];
    idle: HTMLImageElement[];
    currentAnimation: HTMLImageElement[];
    currentFrame =  0;
    deltaAnime = 300;
    position: point;
    lastTimeStamp = 0;
    dimensions = 64;

    constructor(x: number, y: number) {
        this.position = { x: x, y: y};
    }

    async init(): Promise<void> {
        let splitter = new SpriteSplitter();
        this.idle = await splitter.split("/assets/player/idle.png", 2);
        this.up = await splitter.split("/assets/player/up.png", 2);
        this.down = await splitter.split("/assets/player/down.png", 2);
        this.left = await splitter.split("/assets/player/left.png", 4);
        this.rigth = await splitter.split("/assets/player/rigth.png", 4);
        this.currentAnimation = this.idle;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.currentAnimation[this.currentFrame] === undefined) {
            this.currentFrame = 0;
        }
        ctx.drawImage(this.currentAnimation[this.currentFrame], this.position.x-(this.dimensions/2), this.position.y-(this.dimensions/2), this.dimensions, this.dimensions);
    }
    
    update(time: number, dir: direction) {
        if((time - this.lastTimeStamp) >= this.deltaAnime) {
            this.currentFrame = ++this.currentFrame % this.currentAnimation.length;
            this.lastTimeStamp = time;
        }
        switch (dir) {
            case direction.None:
                this.currentAnimation = this.idle;
                break;
            case direction.Up:
                this.currentAnimation = this.up;
                break;
            case direction.Down:
                this.currentAnimation = this.down;
                break;
            case direction.Left:
                this.currentAnimation = this.left;
                break;
            case direction.Right:
                this.currentAnimation = this.rigth;
                break;
        }
    }
}