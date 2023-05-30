export class KeyboardManager {

    pressedKeys: string[];
    callbacks: Record<string, (() => void)[]> = {};

    constructor() {
        this.clearKeys();
    }

    private keyDown(e: KeyboardEvent): void {
        if (!this.pressedKeys.includes(e.code))
        {   
           this.pressedKeys.push(e.code);
        }
        if (!e.repeat && this.callbacks[e.code]) {
            this.callbacks[e.code].forEach(cb => cb());
        }
    }

    private keyUp(e: KeyboardEvent): void {
        this.pressedKeys.indexOf(e.code) !== -1 && this.pressedKeys.splice(this.pressedKeys.indexOf(e.code), 1);
    }

    private clearKeys(): void {
        this.pressedKeys = [];
    }

    startListening():void {
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));
        window.addEventListener("blur", () => this.clearKeys());
    }

    stopListening(): void {
        window.removeEventListener("keydown", (e) => this.keyDown(e));
        window.removeEventListener("keyup", (e) => this.keyUp(e));
        window.removeEventListener("blur", () => this.clearKeys())
    }

    isKeyPressed(key: string): boolean { 
        return this.pressedKeys.includes(key);
    }

    atKeyPressed(keyCode: string, cb: () => void) {
        if (this.callbacks[keyCode] == undefined) {
            this.callbacks[keyCode] = [];
        }
        this.callbacks[keyCode].push(cb);
    }
}