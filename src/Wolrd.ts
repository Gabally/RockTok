import { MAP_HEIGHT, MAP_WIDTH, TILE_DIMENSION, MAP_GENERATION_SCALE } from "./constants";
import { point } from "./Game";
import { randomNumber, scaleArray } from "./utils";
import { PerlinNoise } from "./PerlinNoise";

export interface chest {
    pos: point,
    items: number[]
}

export interface furnace {
    pos: point,
    in: {
        id: number,
        quantity: number,
    },
    out: {
        id: number,
        quantity: number
    },
    progress: number
}

export interface rock {
    id: number,
    pos: point,
    hp: number
}

export interface tree {
    id: number,
    pos: point,
    hp: number
}

export interface workbench {
    pos: point
}

export interface itemStack {
    id: number,
    quantity: number
}

export interface itemDrop {
    id: number,
    quantity: number,
    pos: point
}

export interface world {
    map: number[][],
    rocks: rock[],
    trees: tree[],
    chests: chest[],
    furnaces: furnace[],
    workbenches: workbench[],
    time: number,
    playerPosition: point,
    playerInventory: itemStack[],
    playerHP: number,
    drops: itemDrop[]
}

export enum TILES {
    GRASS_PLAIN = 1,
    GRASS_SMALL_PLANT,
    GRASS_WEEDS,
    GRASS_HEDGE,
    GRASS_DIRT,
    SAND_PLAIN,
    SAND_MOVED,
    SAND_DOTS,
    SAND_CACTUS,
    SAND_STICK,
    SAND_FAT_PLANT,
    WATER,
    GRAVEL_HORIZONTAL,
    GRAVEL_VERTICAL,
    GRAVEL_TOP_LEFT,
    GRAVEL_TOP_RIGHT,
    GRAVEL_BOTTOM_RIGHT,
    GRAVEL_BOTTOM_LEFT
}

export enum WORLD_ELEMENTS {
    BIG_BROKE_ROCK = 1,
    ROCK_GROUP,
    SMOOTH_ROCK,
    BASIC_TREE
}

export const generateWorld = async (): Promise<world> => {
    return new Promise((resolve) => {

        const getRandomPosition = (scale=true): point => {
            while (true) {
                let position = {
                    x: randomNumber(0, MAP_WIDTH - 1),
                    y: randomNumber(0, MAP_HEIGHT - 1)
                }
                if (![TILES.GRAVEL_BOTTOM_LEFT,TILES.GRAVEL_BOTTOM_RIGHT,TILES.GRAVEL_TOP_LEFT,TILES.GRAVEL_TOP_RIGHT,TILES.GRAVEL_HORIZONTAL,TILES.GRAVEL_VERTICAL,TILES.WATER].includes(newWorld.map[position.x][position.y])) {
                    if (scale) {
                        return {
                            x: position.x * TILE_DIMENSION,
                            y: position.y  * TILE_DIMENSION
                        };
                    } else {
                        return {
                            x: position.x,
                            y: position.y
                        };
                    }
                    
                }
            }
        }

        let newWorld: world = {
            chests: [],
            furnaces: [],
            workbenches: [],
            rocks: [],
            trees: [],
            time: 8,
            playerPosition: { x: 0, y: 0 },
            map: [],
            playerInventory: [],
            playerHP: 100,
            drops: []
        };

        let noiseGenerator = new PerlinNoise();
        let smallMap = new Array(MAP_WIDTH/MAP_GENERATION_SCALE);
        for (let i = 0; i < smallMap.length; i++) {
            smallMap[i] = new Array(MAP_HEIGHT/MAP_GENERATION_SCALE);
            for (let j = 0; j < MAP_HEIGHT/MAP_GENERATION_SCALE; j++) {
                let noise = noiseGenerator.noise(i, j);
                let terrainType = (noise + 1) / 2;
                if (terrainType < 0.2) {
                    smallMap[i][j] = TILES.WATER;
                } else if (terrainType < 0.7) {
                    smallMap[i][j] = TILES.GRASS_PLAIN;
                } else {
                    smallMap[i][j] = TILES.SAND_PLAIN;
                }
            }
        }
        let scaledMap = scaleArray(smallMap, MAP_GENERATION_SCALE);
        newWorld.map = new Array(scaledMap.length);
        for(let i = 0; i < scaledMap.length; i++) {
            newWorld.map[i] = new Array(scaledMap[i].length);
            for(let j = 0; j < scaledMap[i].length; j++) {
                if (scaledMap[i][j] == TILES.GRASS_PLAIN) {
                    let choice = randomNumber(1, 100);
                    if (choice < 80) {
                        newWorld.map[i][j] = TILES.GRASS_PLAIN;
                    } else if (choice < 85) {
                        newWorld.map[i][j] = TILES.GRASS_SMALL_PLANT;
                    } else if (choice < 90) {
                        newWorld.map[i][j] = TILES.GRASS_WEEDS;
                    } else if (choice < 95) {
                        newWorld.map[i][j] = TILES.GRASS_HEDGE;
                    } else {
                        newWorld.map[i][j] = TILES.GRASS_DIRT;
                    }
                } else if (scaledMap[i][j] == TILES.SAND_PLAIN) {
                    let choice = randomNumber(1, 100);
                    if (choice < 40) {
                        newWorld.map[i][j] = TILES.SAND_PLAIN;
                    } else if (choice < 65) {
                        newWorld.map[i][j] = TILES.SAND_MOVED;
                    } else if (choice < 75) {
                        newWorld.map[i][j] = TILES.SAND_DOTS;
                    } else if (choice < 85) {
                        newWorld.map[i][j] = TILES.SAND_CACTUS;
                    } else if (choice < 90) {
                        newWorld.map[i][j] = TILES.SAND_STICK;
                    } else {
                        newWorld.map[i][j] = TILES.SAND_FAT_PLANT;
                    }
                } else {
                    newWorld.map[i][j] = scaledMap[i][j];
                }
                if (newWorld.map[i][j] !== TILES.WATER  && randomNumber(0, 100) === 1) {
                    newWorld.rocks.push({
                        id: randomNumber(1, 3),
                        pos: {
                            x: i,
                            y: j
                        },
                        hp: 100
                    });
                }
            }
        }

        for(let i = 0; i < newWorld.map.length; i++) {
            for(let j = 0; j < newWorld.map[i].length; j++) {
                if (i < (newWorld.map.length - 1) && j < (newWorld.map[i].length - 1)) {
                    if (newWorld.map[i][j] !== newWorld.map[i][j+1] 
                        && newWorld.map[i][j] !== newWorld.map[i+1][j] 
                        && newWorld.map[i][j] === newWorld.map[i+1][j+1]) {
                            newWorld.map[i][j+1] = newWorld.map[i][j];
                            newWorld.map[i+1][j] = newWorld.map[i][j];
                    }
                }
                if (newWorld.map[i][j] === TILES.WATER) {
                    if (i > 0 && newWorld.map[i-1][j] !== TILES.WATER) {
                        newWorld.map[i-1][j] = TILES.GRAVEL_VERTICAL;
                    }
                    if (i < (newWorld.map.length - 1) && newWorld.map[i+1][j] !== TILES.WATER) {
                        newWorld.map[i+1][j] = TILES.GRAVEL_VERTICAL;
                    }
                    if (j < (newWorld.map[i].length - 1) && newWorld.map[i][j+1] !== TILES.WATER) {
                        newWorld.map[i][j+1] = TILES.GRAVEL_HORIZONTAL;
                    }
                    if (j > 0 && newWorld.map[i][j-1] !== TILES.WATER) {
                        newWorld.map[i][j-1] = TILES.GRAVEL_HORIZONTAL;
                    }
                }
            }
        }

        for (let i = 0; i < randomNumber(10000, 80000); i++) {
            let pos = getRandomPosition(false);
            if (newWorld.rocks.filter(r => r.pos.x == pos.x && r.pos.y == pos.y).length === 0 && newWorld.trees.filter(t => t.pos.x == pos.x && t.pos.y == pos.y).length === 0 && randomNumber(1, 100) < 20) {
                newWorld.trees.push({
                    id: randomNumber(4, 6),
                    pos: pos,
                    hp: 100
                });
            }
        }

        for(let i = 0; i < newWorld.map.length; i++) {
            for(let j = 0; j < newWorld.map[i].length; j++) {
                if (i < (newWorld.map.length - 1) && newWorld.map[i+1][j] === TILES.GRAVEL_HORIZONTAL && j < (newWorld.map[i].length - 1) && newWorld.map[i][j+1] === TILES.GRAVEL_VERTICAL) {
                    newWorld.map[i][j] = TILES.GRAVEL_TOP_LEFT;
                }
                if (i > 0 && newWorld.map[i-1][j] === TILES.GRAVEL_HORIZONTAL && j < (newWorld.map[i].length - 1) && newWorld.map[i][j+1] === TILES.GRAVEL_VERTICAL) {
                    newWorld.map[i][j] = TILES.GRAVEL_TOP_RIGHT;
                }
                if (i > 0 && newWorld.map[i-1][j] === TILES.GRAVEL_HORIZONTAL && j > 0 && newWorld.map[i][j-1] === TILES.GRAVEL_VERTICAL) {
                    newWorld.map[i][j] = TILES.GRAVEL_BOTTOM_RIGHT;
                }
                if (i < (newWorld.map.length - 1) && newWorld.map[i+1][j] === TILES.GRAVEL_HORIZONTAL && j < (newWorld.map[i].length - 1) && newWorld.map[i][j-1] === TILES.GRAVEL_VERTICAL) {
                    newWorld.map[i][j] = TILES.GRAVEL_BOTTOM_LEFT;
                }
            }
        }

        newWorld.playerPosition = getRandomPosition();

        resolve(newWorld);
    });
};

export class worldInterface {
    world: world;
    rocks: Record<string,rock> = {};
    trees: Record<string,tree> = {};
    drops: Record<string,itemDrop> = {};

    constructor(data: any) {
        this.world = <world>data;
        this.world.rocks.forEach(rock => {
            this.rocks[`${rock.pos.x}|${rock.pos.y}`] = rock;
        });
        this.world.trees.forEach(tree => {
            this.trees[`${tree.pos.x}|${tree.pos.y}`] = tree;
        });
        this.world.drops.forEach(drop => {
            this.drops[`${drop.pos.x}|${drop.pos.y}`] = drop;
        });
        delete this.world.rocks;
        delete this.world.trees;
        delete this.world.drops;
    }

    getTile(pos: point): number {
        if (pos.x < 0 || pos.x > MAP_WIDTH-1 || pos.y < 0 || pos.y > MAP_HEIGHT-1) {
            return 0;
        }
        return this.world.map[pos.x][pos.y];
    }

    getPlayerPosition(): point {
        return this.world.playerPosition;
    }

    getRock(pos: point): rock {
        return this.rocks[`${pos.x}|${pos.y}`];
    }
    
    getTree(pos: point): tree {
        return this.trees[`${pos.x}|${pos.y}`];
    }

    getPlayerInventory(): itemStack[] {
        return this.world.playerInventory;
    }

    getDrop(pos: point): itemDrop {
        return this.drops[`${pos.x}|${pos.y}`];
    }
}