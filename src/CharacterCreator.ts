import { HATS, SHIRT_COLORS, SHIRT_COLORS_TO_REPLACE } from "./constants";
import { SpriteSplitter } from "./SpriteSplitter";
import { loadImage } from "./utils";

interface characterAddOn {
    front: string,
    back: string,
    side: string,
}

interface characterData {
    hat: number,
    shirtColor: number
}

export class CharacterCreator {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    hats: characterAddOn[];
    hatIndex: number;
    playerIdle: HTMLImageElement;
    currentHat: HTMLImageElement;
    colorIndex: number;

    constructor(canvas: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvas);
        this.canvas.width = 32;
        this.canvas.height = 40;
        this.ctx = this.canvas.getContext("2d");
        this.hatIndex = -1;
        this.hats = [];
        this.colorIndex = -1;
    }

    async display(): Promise<void> {
        let spriteSplitter = new SpriteSplitter();
        let playerSprites = await spriteSplitter.split("/assets/player/idle.png", 3, false);
        this.playerIdle = playerSprites[0];
        HATS.forEach(hat => {
            this.hats.push({
                front: `/assets/player/hats/${hat}/front.png`,
                back: `/assets/player/hats/${hat}/back.png`,
                side: `/assets/player/hats/${hat}/side.png`
            });
        });
        this.draw();
    }

    async nextHat(): Promise<void> {
        let index = this.hatIndex;
        if (index === (this.hats.length - 1)) {
            index = -1;
        } else {
            index++;
        }
        if (index !== -1) {
            this.currentHat = await loadImage(this.hats[index].front);
        }
        this.hatIndex = index;
        this.draw();
    }

    async previousHat(): Promise<void> {
        let index = this.hatIndex;
        if (index === -1) {
            index = this.hats.length - 1;
        } else {
            index--;
        }
        if (index !== -1) {
            this.currentHat = await loadImage(this.hats[index].front);
        }
        this.hatIndex = index;
        this.draw();
    }

    nextShirtColor(): void {
        if (this.colorIndex === (SHIRT_COLORS.length - 1)) {
            this.colorIndex = -1;
        } else {
            this.colorIndex++;
        }
        this.draw();
    }

    previousShirtColor(): void {
        if (this.colorIndex === -1) {
            this.colorIndex = SHIRT_COLORS.length - 1;
        } else {
            this.colorIndex--;
        }
        this.draw();
    }

    private swapShirtColor(color: string): void {
        this.ctx.save();
        this.ctx.fillStyle = color;
        for (let i = 0; i < this.canvas.height; i++) {
            for (let j = 0; j < this.canvas.width; j++) {
                let [r, g, b, alpha] = this.ctx.getImageData(i, j, 1, 1).data;
                if (SHIRT_COLORS_TO_REPLACE.filter(c => c.r === r && c.g == g && c.b === b).length !== 0) {
                    this.ctx.fillRect(i, j, 1, 1);
                }
            }
        }
        this.ctx.restore();
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = "#2b2b2a";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.playerIdle, 0, 8);
        if (this.colorIndex !== -1) {
            this.swapShirtColor(SHIRT_COLORS[this.colorIndex]);
        }
        if (this.hatIndex !== -1) {
            this.ctx.drawImage(this.currentHat, 8, 2);
        }
    }

    getCharacterData(): characterData {
        return {
            hat: this.hatIndex,
            shirtColor: this.colorIndex
        }
    }
}