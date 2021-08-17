import { KeyboardManager } from "./KeyboardManager";
import { Player } from "./Player";
import { worldInterface } from "./Wolrd";
import { loadImage, loadTiles, loadWorldElements } from "./utils";
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
  worldElements: Record<string, HTMLImageElement>;
  position: point;
  waterFrame: number;
  lastWaterUpdate: number;
  deltaWaterAnimation: number;
  waterAnimation: HTMLImageElement[];
  lastTimeStamp: number;
  usingInventory: boolean;
  selectedItem: number;

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
    this.waterFrame = 0;
    this.lastWaterUpdate = 0;
    this.deltaWaterAnimation = 350;
    this.waterAnimation = [];
    this.lastTimeStamp = 0;
    this.usingInventory = false;
    this.selectedItem = 0;
  }

  private resizeCanvas(): void {
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

  checkWorldCollision(offsetX: number, offsetY: number): boolean {
    return this.world.getRock({ x: Math.floor((this.position.x + offsetX) / TILE_DIMENSION) + 8, y: Math.floor((this.position.y + offsetY) / TILE_DIMENSION) + 4 }) !== undefined
    || 
    this.world.getTree({ x: Math.floor((this.position.x + offsetX) / TILE_DIMENSION) + 8, y: Math.floor((this.position.y + offsetY) / TILE_DIMENSION) + 4 }) !== undefined
    ||
    this.world.getTree({ x: Math.floor((this.position.x + offsetX) / TILE_DIMENSION) + 8, y: Math.floor((this.position.y + offsetY) / TILE_DIMENSION) + 3 }) !== undefined;
  }

  private update(time: number): void {
    let deltaTime = (time - this.lastTimeStamp) / 10;
    let adjustedSpeed = PLAYER_SPEED * deltaTime;
    this.playerDirection = direction.None;
    if (this.keyboard.isKeyPressed("KeyW") && !this.checkWorldCollision(0, -adjustedSpeed)) {
      this.playerDirection = direction.Up;
      this.position.y -= adjustedSpeed;
    } else if (this.keyboard.isKeyPressed("KeyS") && !this.checkWorldCollision(0, adjustedSpeed)) {
      this.playerDirection = direction.Down;
      this.position.y += adjustedSpeed;
    }
    if (this.keyboard.isKeyPressed("KeyA") && !this.checkWorldCollision(-adjustedSpeed, 0)) {
      this.playerDirection = direction.Left;
      this.position.x -= adjustedSpeed;
    } else if (this.keyboard.isKeyPressed("KeyD") && !this.checkWorldCollision(adjustedSpeed, 0)) {
      this.playerDirection = direction.Right;
      this.position.x += adjustedSpeed;
    }
    this.player.update(time, this.playerDirection);
    if ((time - this.lastWaterUpdate) >= this.deltaWaterAnimation) {
      this.waterFrame = ++this.waterFrame % this.waterAnimation.length;
      this.lastWaterUpdate = time;
    }
  }

  private draw(): void {
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
          if (tile === 12) {
            this.ctx.drawImage(
              this.waterAnimation[this.waterFrame],
              Math.round(x),
              Math.round(y),
              TILE_DIMENSION,
              TILE_DIMENSION
            );
          } else {
            this.ctx.drawImage(
              this.tiles[tile],
              Math.round(x),
              Math.round(y),
              TILE_DIMENSION,
              TILE_DIMENSION
            );
          }
        }
      }
    }
    this.player.draw(this.ctx);
    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        let x = (c - startCol) * TILE_DIMENSION + offsetX;
        let y = (r - startRow) * TILE_DIMENSION + offsetY;
        let rock = this.world.getRock({ x: c, y: r });
        if (rock) {
          this.ctx.drawImage(
            this.worldElements[rock.id],
            Math.round(x),
            Math.round(y),
            TILE_DIMENSION,
            TILE_DIMENSION
          );
        }
        let tree = this.world.getTree({ x: c, y: r });
        if (tree) {
          this.ctx.drawImage(
            this.worldElements[tree.id],
            Math.round(x),
            Math.round(y),
            TILE_DIMENSION,
            TILE_DIMENSION * 2,

          );
        }
      }
    }
    requestAnimationFrame((t) => {
      this.update(t);
      this.draw();
      this.lastTimeStamp = t;
    });
  }

  private renderInventory(): void {
    let inventory = document.getElementById("item-container");
    for (let i = 0; i < this.world.getPlayerInventory().length; i++) {
      if (this.selectedItem === i) {
        let itemSlot = document.createElement("div");
        itemSlot.style.justifyContent = "space-between";
        itemSlot.className = "item-slot";
        let selectedArrow = document.createElement("img");
        selectedArrow.src = "/assets/selected_arrow.png";
        selectedArrow.classList.add("s-arrow");
        selectedArrow.classList.add("px-rendering");
        itemSlot.appendChild(selectedArrow.cloneNode());
        let itemContainer = document.createElement("div");
        itemContainer.className = "item-slot-container";
        let itemIcon = document.createElement("img");
        itemIcon.src = "";
        itemIcon.classList.add("item-slot-icon");
        itemIcon.classList.add("px-rendering");
        itemContainer.appendChild(itemIcon);
        let itemText = document.createElement("div");
        itemText.textContent = "item name";
        itemText.className = "item-slot-text";
        itemContainer.appendChild(itemText);
        itemSlot.appendChild(itemContainer);
        selectedArrow.classList.add("flip");
        itemSlot.appendChild(selectedArrow.cloneNode());
        inventory.appendChild(itemSlot);
      } else {
        let itemSlot = document.createElement("div");
        itemSlot.className = "item-slot";
        let itemContainer = document.createElement("div");
        itemContainer.className = "item-slot-container";
        let itemIcon = document.createElement("img");
        itemIcon.src = "";
        itemIcon.classList.add("item-slot-icon");
        itemIcon.classList.add("px-rendering");
        itemContainer.appendChild(itemIcon);
        let itemText = document.createElement("div");
        itemText.textContent = "item name";
        itemText.className = "item-slot-text";
        itemContainer.appendChild(itemText);
        itemSlot.appendChild(itemContainer);
        inventory.appendChild(itemSlot);
      }
    }
  }

  async run(): Promise<void> {
    this.tiles = await loadTiles();
    this.worldElements = await loadWorldElements();
    await this.player.init();
    for (let i = 1; i <= 5; i++) {
      this.waterAnimation.push(await loadImage(`/assets/tiles/water/${i}.png`));
    }
    this.keyboard.startListening();
    this.keyboard.atKeyPressed("KeyE", () => {
      this.renderInventory();
      this.usingInventory ? document.getElementById("inventory").style.display = "none" : document.getElementById("inventory").style.display = "block";
      this.usingInventory = !this.usingInventory;
    });
    requestAnimationFrame((t) => {
      this.update(t);
      this.draw();
      this.lastTimeStamp = t;
    });
  }
}