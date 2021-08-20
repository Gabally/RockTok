import { SpriteSplitter } from "./SpriteSplitter";
import { point, direction } from "./Game";
import { animation } from "./Game";

export class Player {
    up: animation;
    down: animation;
    left: animation;
    rigth: animation;
    idle: animation;
    currentAnimation: animation;
    currentFrame =  0;
    position: point;
    lastTimeStamp = 0;
    dimensions = 64;

    constructor(x: number, y: number) {
        this.position = { x: x, y: y};
    }

    async init(): Promise<void> {
        let splitter = new SpriteSplitter();
        this.idle = {
            frames: await splitter.split("/assets/player/idle.png", 3, false),
            deltaAnimation: 500
        };
        this.up = {
            frames: await splitter.split("/assets/player/up.png", 2, false),
            deltaAnimation: 100
        };
        this.down = {
            frames: await splitter.split("/assets/player/down.png", 2, false),
            deltaAnimation: 100
        }
        this.left = {
            frames: await splitter.split("/assets/player/side.png", 4, false),
            deltaAnimation: 110
        };
        this.rigth = {
            frames: await splitter.split("/assets/player/side.png", 4, true),
            deltaAnimation: 110 
        };
        this.currentAnimation = this.idle;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.currentAnimation.frames[this.currentFrame] === undefined) {
            this.currentFrame = 0;
        }
        ctx.drawImage(this.currentAnimation.frames[this.currentFrame], this.position.x-(this.dimensions/2), this.position.y-(this.dimensions/2), this.dimensions, this.dimensions);
    }
    
    update(time: number, dir: direction) {
        if((time - this.lastTimeStamp) >= this.currentAnimation.deltaAnimation) {
            this.currentFrame = ++this.currentFrame % this.currentAnimation.frames.length;
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