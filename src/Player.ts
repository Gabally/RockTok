import { SpriteSplitter } from "./SpriteSplitter";
import { point, direction } from "./Game";
import { animation } from "./Game";
import { generateCharacterSpritesheetsFromData } from "./CharacterCreator";
import { characterData } from "./CharacterCreator";
import { isDefined } from "./utils";

export class Player {
    up: animation;
    down: animation;
    left: animation;
    rigth: animation;
    idle: animation;
    hitUp: animation;
    hitLeft: animation;
    hitRight: animation;
    hitDown: animation;
    currentAnimation: animation;
    currentFrame =  0;
    position: point;
    lastTimeStamp = 0;
    width = 64;
    height = 80;
    character: characterData;
    hitting: boolean;
    lastDirection: direction;
    attackItem: HTMLImageElement;

    constructor(x: number, y: number, character: characterData) {
        this.position = { x: x, y: y};
        this.character = character;
        this.hitting = false;
    }

    async init(): Promise<void> {
        let spriteSheets = await generateCharacterSpritesheetsFromData(this.character);
        let splitter = new SpriteSplitter();
        this.idle = {
            frames: await splitter.split(spriteSheets.idle, 3, false),
            deltaAnimation: 500
        };
        this.up = {
            frames: await splitter.split(spriteSheets.up, 2, false),
            deltaAnimation: 100
        };
        this.down = {
            frames: await splitter.split(spriteSheets.down, 2, false),
            deltaAnimation: 100
        }
        this.left = {
            frames: await splitter.split(spriteSheets.side, 4, false),
            deltaAnimation: 110
        };
        this.rigth = {
            frames: await splitter.split(spriteSheets.side, 4, true),
            deltaAnimation: 110 
        };
        this.hitUp = {
            frames: await splitter.split(spriteSheets.hitUp, 3, false),
            deltaAnimation: 120
        };
        this.hitLeft = {
            frames: await splitter.split(spriteSheets.hitSide, 4, false),
            deltaAnimation: 80
        };
        this.hitRight = {
            frames: await splitter.split(spriteSheets.hitSide, 4, true),
            deltaAnimation: 80
        }
        this.hitDown = {
            frames: await splitter.split(spriteSheets.hitDown, 3, false),
            deltaAnimation: 80
        }
        this.currentAnimation = this.idle;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!isDefined(this.currentAnimation.frames[this.currentFrame])) {
            this.currentFrame = 0;
        }
        ctx.drawImage(this.currentAnimation.frames[this.currentFrame], this.position.x-(this.width/2), this.position.y-(this.height/2), this.width, this.height);
        if (this.hitting && this.attackItem !== undefined) {
            switch(this.lastDirection) {
                case direction.Up:
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, this.position.x + 22, this.position.y + this.currentFrame - 6);
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(this.attackItem, -this.attackItem.height / 2,  -this.attackItem.width / 2);
                    ctx.restore();
                    break;
                case direction.Down:
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, this.position.x - 19, this.position.y + this.currentFrame + 15);
                    ctx.rotate(-Math.PI / 2);
                    ctx.drawImage(this.attackItem, -this.attackItem.height / 2,  -this.attackItem.width / 2);
                    ctx.restore();
                    break;
                case direction.Left:
                    ctx.drawImage(this.attackItem, this.position.x - this.currentFrame - 26, this.position.y - 11);
                    break;
                case direction.Right:
                    ctx.drawImage(this.attackItem, this.position.x + this.currentFrame - 5, this.position.y - 11);
                    break;
            }
        }
    }
    
    update(time: number, dir: direction): void {
        if (dir !== direction.None) {
            this.lastDirection = dir;
        }
        if((time - this.lastTimeStamp) >= this.currentAnimation.deltaAnimation) {
            this.currentFrame = ++this.currentFrame % this.currentAnimation.frames.length;
            this.lastTimeStamp = time;
        }
        if (this.hitting) {
            switch (this.lastDirection) {
                case direction.Up:
                    this.currentAnimation = this.hitUp;
                    break;
                case direction.Down:
                    this.currentAnimation = this.hitDown;
                    break;
                case direction.Left:
                    this.currentAnimation = this.hitLeft;
                    break;
                case direction.Right:
                    this.currentAnimation = this.hitRight;
                    break;
            }
            if (this.currentFrame === this.currentAnimation.frames.length - 1) {
                this.hitting = false;
            }
        } else {
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

    hit(item: HTMLImageElement, callback: (dir: direction) => void): void {
        this.attackItem = item;
        if (!this.hitting) {
            callback(this.lastDirection);
            this.hitting = true;
            this.currentFrame = 0;
        }
    }
}