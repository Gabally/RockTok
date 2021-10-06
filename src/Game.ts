import { KeyboardManager } from "./KeyboardManager";
import { Player } from "./Player";
import { worldInterface } from "./Wolrd";
import { loadImage, isDefined, randomNumber } from "./utils";
import { loadItems, loadTiles, loadWorldElements } from "./loaders";
import { items, ITEM_NAMES, PLAYER_SPEED, TILE_DIMENSION } from "./constants";
import { characterData } from "./CharacterCreator";
import { DamageIndicatorsSystem } from "./DamageIndicators";

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

export interface animation {
  frames: HTMLImageElement[],
  deltaAnimation: number
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
  itemsSprites:  Record<string, HTMLImageElement>;
  position: point;
  waterFrame: number;
  lastWaterUpdate: number;
  deltaWaterAnimation: number;
  waterAnimation: HTMLImageElement[];
  lastTimeStamp: number;
  usingInventory: boolean;
  selectedItem: number;
  damageIndicators: DamageIndicatorsSystem;
  dropAnimationOffset: number;
  dropAnimationCounter: number;

  constructor(canvas: string, world: worldInterface, character: characterData) {
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
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, character);
    this.waterFrame = 0;
    this.lastWaterUpdate = 0;
    this.deltaWaterAnimation = 350;
    this.waterAnimation = [];
    this.lastTimeStamp = 0;
    this.dropAnimationCounter = 0;
    this.dropAnimationOffset = 0;
    setInterval(() => {
      this.dropAnimationOffset = Math.abs((this.dropAnimationCounter+=1)%20 - 10)
    }, 100);
    this.usingInventory = false;
    this.selectedItem = -1;
    this.damageIndicators = new DamageIndicatorsSystem();
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
    let xPos =  Math.floor((this.position.x + offsetX) / TILE_DIMENSION) + 8;
    let yPos = Math.floor((this.position.y + offsetY) / TILE_DIMENSION) + 4;
    return isDefined(this.world.getRock({ x: xPos, y: yPos })) || 
    isDefined(this.world.getTree({ x: xPos, y: yPos })) ||
    isDefined(this.world.getTree({ x: xPos, y: yPos - 1 }));
  }

  dealDamage(offsetX: number, offsetY: number): void {
    let xPos =  Math.floor((this.position.x + offsetX) / TILE_DIMENSION) + 8;
    let yPos = Math.floor((this.position.y + offsetY) / TILE_DIMENSION) + 4;
    if (isDefined(this.world.getRock({ x: xPos, y: yPos }))) {
      let damage = 0;
      let itemID = this.selectedItem !== -1 ? this.world.playerInventory[this.selectedItem].id : 0;
      switch (itemID) {
        case items.WOOD_PICKAXE:
          damage = 15;  
          break;
        case items.STONE_PICKAXE:
          damage = 25;
          break;
        case items.IRON_PICKAXE:
          damage = 35;
          break;
        case items.OBAMIUM_PICKAXE:
          damage = 50;
          break;
        default:
          damage = 3;
          break;
      }
      this.damageIndicators.addIndicator(damage, { x: this.canvas.width/2, y: this.canvas.height/2 });
      this.world.rocks[`${xPos}|${yPos}`].hp -= damage;
      if (this.world.rocks[`${xPos}|${yPos}`].hp <= 0) {
        if (this.world.rocks[`${xPos}|${yPos}`].hp <= 0) {
          this.world.addNewDrop({
            id: items.ROCK,
            quantity: randomNumber(1, 3)
          }, { x: xPos, y: yPos });
          delete this.world.trees[`${xPos}|${yPos}`];
        }
        delete this.world.rocks[`${xPos}|${yPos}`];
      }
    } else if (isDefined(this.world.getTree({ x: xPos, y: yPos })) || isDefined(this.world.getTree({ x: xPos, y: yPos - 1 }))) {
      let damage = 0;
      let itemID = this.selectedItem !== -1 ? this.world.playerInventory[this.selectedItem].id : 0;
      switch (itemID) {
        case items.WOOD_PICKAXE:
        case items.STONE_PICKAXE:
        case items.IRON_PICKAXE:
        case items.OBAMIUM_PICKAXE:
          damage = 8;
          break;
        default:
          damage = 3;
          break;
      }
      this.damageIndicators.addIndicator(damage, { x: this.canvas.width/2, y: this.canvas.height/2 });
      if (isDefined(this.world.getTree({ x: xPos, y: yPos }))) {
        this.world.trees[`${xPos}|${yPos}`].hp -= damage;
        if (this.world.trees[`${xPos}|${yPos}`].hp <= 0) {
          this.world.addNewDrop({
            id: items.WOOD_STUMP,
            quantity: randomNumber(1, 6)
          }, { x: xPos, y: yPos });
          delete this.world.trees[`${xPos}|${yPos}`];
        }
      } else if (isDefined(this.world.getTree({ x: xPos, y: yPos - 1 }))) {
        this.world.trees[`${xPos}|${yPos - 1}`].hp -= damage;
        if (this.world.trees[`${xPos}|${yPos - 1}`].hp <= 0) {
          this.world.addNewDrop({
            id: items.WOOD_STUMP,
            quantity: randomNumber(1, 6)
          }, { x: xPos, y: yPos });
          delete this.world.trees[`${xPos}|${yPos - 1}`];
        }
      }
    }
  }

  private update(time: number): void {
    let deltaTime = (time - this.lastTimeStamp) / 10;
    let adjustedSpeed = PLAYER_SPEED * deltaTime;
    this.playerDirection = direction.None;
    let cellPosition: point = {
      x: Math.floor((this.position.x) / TILE_DIMENSION) + 8,
      y: Math.floor((this.position.y) / TILE_DIMENSION) + 4
    };
    if (this.player.hitting) {
      adjustedSpeed = adjustedSpeed * 0.1;
    }
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
    let dropsOnPlayer = this.world.getDrops(cellPosition);
    if (isDefined(dropsOnPlayer) && dropsOnPlayer.length !== 0) {
      dropsOnPlayer.forEach(drop => {
        this.world.pickUpDrop(drop);
      });
      this.world.removeDrops(cellPosition);
    } 
    if (this.keyboard.isKeyPressed("Space")) {
      if (this.selectedItem !== -1) {
        this.player.hit(this.itemsSprites[this.world.playerInventory[this.selectedItem].id], (dir: direction): void => {
          switch (dir) {
            case direction.Up:
              this.dealDamage(0, -10);
              break;
            case direction.Down:
              this.dealDamage(0, +10);
              break;
            case direction.Left:
              this.dealDamage(-10, 0);
              break;
            case direction.Right:
              this.dealDamage(+10, 0);
              break;
          }
        });
      } else {
        this.player.hit(undefined, (dir: direction): void => {
          switch (dir) {
            case direction.Up:
              this.dealDamage(0, -10);
              break;
            case direction.Down:
              this.dealDamage(0, +10);
              break;
            case direction.Left:
              this.dealDamage(-10, 0);
              break;
            case direction.Right:
              this.dealDamage(+10, 0);
              break;
          }
        });
      }
    }
    this.damageIndicators.update(deltaTime);
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
        let items = this.world.getDrops({ x: c, y: r });
        if (isDefined(items) && items.length !== 0) {
          items.forEach((item) => {
            this.ctx.drawImage(
              this.itemsSprites[item.id],
              Math.round(x),
              Math.round(y + this.dropAnimationOffset),
              TILE_DIMENSION/2,
              TILE_DIMENSION/2,
            );
            this.drawShadow(25 - this.dropAnimationOffset, { x: x + 17, y: y + 50 });
          });
        }
      }
    }
    this.player.draw(this.ctx);
    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow - 5; r <= endRow; r++) {
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
    this.damageIndicators.draw(this.ctx);
    requestAnimationFrame((t) => {
      this.update(t);
      this.draw();
      this.lastTimeStamp = t;
    });
  }

  private renderInventory(): void {
    let inventory = document.getElementById("item-container");
    inventory.innerHTML = "";
    for (let i = 0; i < this.world.playerInventory.length; i++) {
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
        let itemIcon = <HTMLImageElement>this.itemsSprites[this.world.playerInventory[i].id].cloneNode();
        itemIcon.classList.add("item-slot-icon");
        itemIcon.classList.add("px-rendering");
        itemContainer.appendChild(itemIcon);
        let itemText = document.createElement("div");
        itemText.textContent = `${ITEM_NAMES[this.world.playerInventory[i].id]} x${this.world.playerInventory[i].quantity}`;
        itemText.className = "item-slot-text";
        itemContainer.appendChild(itemText);
        itemSlot.appendChild(itemContainer);
        selectedArrow.classList.add("flip");
        itemSlot.appendChild(selectedArrow.cloneNode());
        inventory.appendChild(itemSlot);
        if (this.selectedItem !== -1) {
          (document.getElementById("selectedItem") as HTMLImageElement).src = this.itemsSprites[this.world.playerInventory[i].id].src;
        } else {
          (document.getElementById("selectedItem") as HTMLImageElement).src = "/assets/fist.png";
        }
      } else {
        let itemSlot = document.createElement("div");
        itemSlot.className = "item-slot";
        let itemContainer = document.createElement("div");
        itemContainer.className = "item-slot-container";
        let itemIcon = <HTMLImageElement>this.itemsSprites[this.world.playerInventory[i].id].cloneNode();
        itemIcon.classList.add("item-slot-icon");
        itemIcon.classList.add("px-rendering");
        itemContainer.appendChild(itemIcon);
        let itemText = document.createElement("div");
        itemText.textContent =  `${ITEM_NAMES[this.world.playerInventory[i].id]} x${this.world.playerInventory[i].quantity}`;
        itemText.className = "item-slot-text";
        itemContainer.appendChild(itemText);
        itemSlot.appendChild(itemContainer);
        inventory.appendChild(itemSlot);
      }
    }
  }

  drawShadow(diameter: number, position: point): void {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(153, 153, 153, 0.6)";
    this.ctx.beginPath();
    this.ctx.ellipse(position.x, position.y, diameter, 10, Math.PI, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  async run(): Promise<void> {
    this.tiles = await loadTiles();
    this.worldElements = await loadWorldElements();
    this.itemsSprites = await loadItems();
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
    this.keyboard.atKeyPressed("KeyQ", () => {
      this.world.pickUpDrop({
        id: 1,
        quantity: 1
      });
    });
    this.keyboard.atKeyPressed("ArrowDown", () => {
      if (this.selectedItem === -1) {
        this.selectedItem = 0;
      }
      if (this.selectedItem === this.world.playerInventory.length - 1) {
        this.selectedItem = 0;
      } else {
        this.selectedItem += 1;
      }
      this.renderInventory();
    });
    this.keyboard.atKeyPressed("ArrowUp", () => {
      if (this.selectedItem === 0 || this.selectedItem === -1) {
        this.selectedItem = this.world.playerInventory.length - 1;
      } else {
        this.selectedItem -= 1;
      }
      this.renderInventory();
    });
    this.renderInventory();
    requestAnimationFrame((t) => {
      this.update(t);
      this.draw();
      this.lastTimeStamp = t;
    });
  }
}