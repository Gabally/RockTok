
export const loadImage = async (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (err) => reject(err);
    });
}

export const randomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const scaleArray = (array: number[][], factor: number): number[][] => {
	let scaled: number[][] = [];
	for(const row of array) {
		let x: number[] = [];
		for(const item of row) {
            x = x.concat(Array(factor).fill(item));
        }
		scaled = scaled.concat(Array(factor).fill(x));
	}
	return scaled;
}

export const sleep = (time: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}

export const isDefined = (obj: any): boolean => {
    return obj !== undefined && obj !== null;
} 