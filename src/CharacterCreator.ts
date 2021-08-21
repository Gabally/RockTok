import { HATS, SHIRT_COLORS, SHIRT_COLORS_TO_REPLACE } from "./constants";
import { SpriteSplitter } from "./SpriteSplitter";
import { loadImage } from "./utils";

interface characterAddOn {
    front: string,
    back: string,
    side: string,
}

export interface characterData {
    hat: number,
    shirtColor: number
}

export interface characterSpritesheets {
    idle: string,
    up: string,
    down: string,
    side: string
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

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = "#2b2b2a";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.playerIdle, 0, 8);
        if (this.colorIndex !== -1) {
            swapShirtColor(this.canvas, this.ctx, SHIRT_COLORS[this.colorIndex]);
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

const swapShirtColor = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string): void => {
    ctx.imageSmoothingEnabled = false;
    const hexToRgb = (hex: string): {red: number, green: number, blue: number} => {
        hex = hex.replaceAll("#","");
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return { red: r, green: g, blue: b };
    }
    let { red, green, blue } = hexToRgb(color);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i+=4) {
        let [r, g, b] = [imageData.data[i],imageData.data[i+1],imageData.data[i+2]];
        if (SHIRT_COLORS_TO_REPLACE.filter(c => c.r === r && c.g == g && c.b === b).length !== 0) {
            imageData.data[i] = red;
            imageData.data[i+1] = green;
            imageData.data[i+2] = blue;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

export const generateCharacterSpritesheetsFromData = async (character: characterData): Promise<characterSpritesheets> => {
    let spriteSheets = {} as characterSpritesheets;
    let workCanvas = document.createElement("canvas");
    let ctx = workCanvas.getContext("2d");
    let idle = await loadImage("/assets/player/idle.png");
    workCanvas.height = 40;
    const drawY = 8;
    workCanvas.width = idle.width;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(idle, 0, drawY);
    if (character.hat !== -1) {
        let x = 0;
        for (let i = 0; i < 3; i++) {
            ctx.drawImage(await loadImage(`/assets/player/hats/${HATS[character.hat]}/front.png`), x+8, 2);
            x += 32;
        }
    }
    if (character.shirtColor !== -1) {
        swapShirtColor(workCanvas, ctx, SHIRT_COLORS[character.shirtColor]);
    }
    spriteSheets.idle = workCanvas.toDataURL("image/png");
    let up = await loadImage("/assets/player/up.png");
    workCanvas.width = up.width;
    ctx.clearRect(0, 0, workCanvas.width, workCanvas.height);
    ctx.drawImage(up, 0, drawY);
    if (character.hat !== -1) {
        let x = 0;
        for (let i = 0; i < 2; i++) {
            ctx.drawImage(await loadImage(`/assets/player/hats/${HATS[character.hat]}/back.png`), x+8, 2);
            x += 32;
        }
    }
    if (character.shirtColor !== -1) {
        swapShirtColor(workCanvas, ctx, SHIRT_COLORS[character.shirtColor]);
    }
    spriteSheets.up = workCanvas.toDataURL("image/png");
    let down = await loadImage("/assets/player/down.png");
    workCanvas.width = down.width;
    ctx.clearRect(0, 0, workCanvas.width, workCanvas.height);
    ctx.drawImage(down, 0, drawY);
    if (character.hat !== -1) {
        let x = 0;
        for (let i = 0; i < 2; i++) {
            ctx.drawImage(await loadImage(`/assets/player/hats/${HATS[character.hat]}/front.png`), x+8, 2);
            x += 32;
        }
    }
    if (character.shirtColor !== -1) {
        swapShirtColor(workCanvas, ctx, SHIRT_COLORS[character.shirtColor]);
    }
    spriteSheets.down =  workCanvas.toDataURL("image/png");
    let side = await loadImage("/assets/player/side.png");
    workCanvas.width = side.width;
    ctx.clearRect(0, 0, workCanvas.width, workCanvas.height);
    ctx.drawImage(side, 0, drawY);
    if (character.hat !== -1) {
        let x = 0;
        for (let i = 0; i < 4; i++) {
            ctx.drawImage(await loadImage(`/assets/player/hats/${HATS[character.hat]}/side.png`), x+8, 2);
            x += 32;
        }
    }
    if (character.shirtColor !== -1) {
        swapShirtColor(workCanvas, ctx, SHIRT_COLORS[character.shirtColor]);
    }
    spriteSheets.side = workCanvas.toDataURL("image/png");
    return spriteSheets;
}