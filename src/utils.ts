export const loadImage = async (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
    });
}

export const randomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min)) + min;
};

export const loadTiles = async (): Promise<Record<string, HTMLImageElement>> => {
    let tileMap = {
            "1": await loadImage("/assets/tiles/grass/test.png"),
            "2": await loadImage("/assets/tiles/grass/2.png"),
            "3": await loadImage("/assets/tiles/grass/3.png"),
            "4": await loadImage("/assets/tiles/grass/4.png"),
            "5": await loadImage("/assets/tiles/sand.png"),
            "6": await loadImage("/assets/tiles/water.png"),
        };
    return tileMap;
}