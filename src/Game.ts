import { KeyboardManager } from "./KeyboardManager";
import { Player } from "./Player";
import { worldInterface } from "./WorldInterface";
import { loadImage, loadTiles } from "./utils";
import { PLAYER_SPEED, TILE_DIMENSION } from "./constants";

export interface point {
  x: number,
  y: number
}

export enum direction {
  Up = 1,
  Down,
  Left,
  Right,
  None
}

export class Game {
  canvas: HTMLCanvasElement;
  ratio = 16 / 9;
  keyboard: KeyboardManager;
  player: Player;
  ctx: CanvasRenderingContext2D;
  playerDirection = direction.None;
  world: worldInterface;
  tiles: Record<string, HTMLImageElement>;
  position: point;
  rockSprite: HTMLImageElement;

  constructor(canvas: string, world: worldInterface) {
    this.world = world;
    this.position = world.getPlayerPosition();
    this.canvas = <HTMLCanvasElement>document.getElementById(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 1024;
    this.canvas.height = 512;
    this.canvas.style.background = "black";
    this.canvas.style.imageRendering = "pixelated";
    window.addEventListener("resize", () => this.resizeCanvas());
    this.resizeCanvas();
    this.keyboard = new KeyboardManager();
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
  }

  resizeCanvas(): void {
    let newWidth = window.innerWidth - 10;
    let newHeight = window.innerHeight - 10;
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

  update(time: number): void {
    this.playerDirection = direction.None;
    if (this.keyboard.isKeyPressed("KeyW")) {
      this.playerDirection = direction.Up;
      this.position.y -= PLAYER_SPEED;
    } else if (this.keyboard.isKeyPressed("KeyS")) {
      this.playerDirection = direction.Down;
      this.position.y += PLAYER_SPEED;
    }
    if (this.keyboard.isKeyPressed("KeyA")) {
      this.playerDirection = direction.Left;
      this.position.x -= PLAYER_SPEED;
    } else if (this.keyboard.isKeyPressed("KeyD")) {
      this.playerDirection = direction.Right;
      this.position.x += PLAYER_SPEED;
    }
    this.player.update(time, this.playerDirection);
  }

  draw(): void {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let startCol = Math.floor(this.position.x / TILE_DIMENSION);
    let endCol = startCol + (this.canvas.width / TILE_DIMENSION);
    let startRow = Math.floor(this.position.y / TILE_DIMENSION);
    let endRow = startRow + (this.canvas.height / TILE_DIMENSION);
    let offsetX = -this.position.x + startCol * TILE_DIMENSION;
    let offsetY = -this.position.y + startRow * TILE_DIMENSION;
    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        let tile = this.world.getTile({ x: c, y: r });
        let x = (c - startCol) * TILE_DIMENSION + offsetX;
        let y = (r - startRow) * TILE_DIMENSION + offsetY;
        if (tile !== 0) {
          this.ctx.drawImage(
            this.tiles[tile],
            Math.round(x),
            Math.round(y),
            TILE_DIMENSION,
            TILE_DIMENSION
          );
        }
        if (this.world.getRock({ x: c, y: r })) {
          this.ctx.drawImage(
            this.rockSprite,
            Math.round(x),
            Math.round(y),
            TILE_DIMENSION,
            TILE_DIMENSION
          );
        }
      }
    }
    this.player.draw(this.ctx);
    requestAnimationFrame(() => { this.draw(); });
  }

  async run(): Promise<void> {
    this.tiles = await loadTiles();
    this.rockSprite = await loadImage("/assets/rock.png");
    await this.player.init();
    this.keyboard.startListening();
    setInterval(() => {
      this.update(Date.now());
    }, 30);
    requestAnimationFrame(() => { this.draw(); });
  }
}