export const MAP_WIDTH = 600;

export const MAP_HEIGHT = 400;

export const TILE_DIMENSION = 64;

export const PLAYER_SPEED = 2;

export const MAP_GENERATION_SCALE = 50;

export const HATS = [
    "baseball_cap",
    "cowboy",
    "cylinder",
    "googles",
    "sunglasses",
    "ushanka"
];

export const SHIRT_COLORS_TO_REPLACE = [{
    "r": 244,
    "g": 53,
    "b": 16
}, {
    "r": 229,
    "g": 52,
    "b": 18
}, {
    "r": 229,
    "g": 55,
    "b": 21
}, {
    "r": 229,
    "g": 58,
    "b": 24
}, {
    "r": 233,
    "g": 51,
    "b": 16
}];

export const SHIRT_COLORS = [
    "#16ab4a",
    "#1657ab",
    "#9716ab",
    "#ed861f",
    "#2bc4a6",
    "#ebeb44"
]


export enum items {
    WOOD_PICKAXE = 1,
    STONE_PICKAXE,
    IRON_PICKAXE,
    OBAMIUM_PICKAXE
}

export const ITEM_NAMES: { [index: number]: string } = {
    [items.WOOD_PICKAXE]: "Wood Pickaxe",
    [items.STONE_PICKAXE]: "Stone Pickaxe",
    [items.IRON_PICKAXE]: "Iron Pickaxe",
    [items.OBAMIUM_PICKAXE]: "Supreme Obamium Pickaxe"
}