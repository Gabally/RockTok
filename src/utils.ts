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

export const loadTiles = async (): Promise<Record<string, HTMLImageElement>> => {
    let tileMap = {
            "1": await loadImage("/assets/tiles/grass.png"),
            "2": await loadImage("/assets/tiles/sand.png"),
            "3": await loadImage("/assets/tiles/water.png"),
        };
    return tileMap;
}