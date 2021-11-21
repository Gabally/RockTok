import "./style.css";
import "../assets/EarlyGameboyFont.css";
import "../assets/KarmaticArcadeFont.css";
import { Game } from "./Game";
import { generateWorld, worldInterface } from "./Wolrd";
import { KeyValueIDB } from "./KeyValueIDB";
import { CharacterCreator } from "./CharacterCreator";
import { isDefined } from "./utils";

var game: Game;
var db = new KeyValueIDB();

const uiElements: Record<string, string> = {
    mainMenu: "menu",
    gameScreen: "game",
    worldSelector: "worldSelector",
    characterCreator: "characterCreator"
}

const resetUI = (): void => {
    Object.keys(uiElements).forEach(id => {
        let el = document.getElementById(uiElements[id]);
        if (!el.dataset.display) {
            if (el.style.display) {
                el.style.display = el.style.display;
            } else {
                el.dataset.display = getComputedStyle(el).getPropertyValue("display");
            }
        }
        el.style.display = "none";
    });
};

const AddclickListener = (id: string, cb: () => void): void => {
    let el = document.getElementById(id);
    el.addEventListener("click", cb);
};

const Show = (id: string): void => {
    let el = document.getElementById(id);
    if (el.dataset.display) {
        el.style.display = el.dataset.display;
    } else {
        el.style.display = "block";
    }
};

const removeEventListeners = (id: string) => {
    let el = document.getElementById(id);
    let newNode = el.cloneNode(true);
    el.parentNode.replaceChild(newNode, el);
};

const showInputDialog = async (message: string): Promise<string> => {
    return new Promise((resolve) => {
        let obscurator = document.createElement("div");
        obscurator.setAttribute("style", "position:fixed;width:99vw;height:99vh;z-index:9999");
        document.body.appendChild(obscurator);
        let container = document.createElement("div");
        container.setAttribute("style", 'color: white;display: flex;justify-content: center;align-items: center;z-index: 99999;position: absolute;top: 50%;left: 50%;background: black;border: 1px solid white;transform: translate(-50%, -50%);width: 50vw;height: 40vh;flex-direction: column;font-size: 20px;');
        let text = document.createElement("div");
        text.textContent = message;
        container.appendChild(text);
        let input = document.createElement("input");
        input.type = "text";
        input.spellcheck = false;
        input.setAttribute("style", 'margin-top: 15px;background: transparent;text-align: center;padding: 5px;font-size: 22px;color: white;');
        container.appendChild(input);
        let buttons = document.createElement("div");
        buttons.setAttribute("style", 'display: flex;justify-content: space-around;width: 100%;');
        let cancel = document.createElement("button");
        cancel.className = "m-btn";
        cancel.textContent = "Cancel";
        buttons.appendChild(cancel);
        let confirm = document.createElement("button");
        confirm.className = "m-btn";
        confirm.textContent = "Confirm";
        buttons.appendChild(confirm);
        container.appendChild(buttons);
        document.body.appendChild(container);
        input.focus();
        cancel.addEventListener("click", () => {
            document.body.removeChild(container);
            document.body.removeChild(obscurator);
            resolve(undefined);
        });
        confirm.addEventListener("click", () => {
            document.body.removeChild(container);
            document.body.removeChild(obscurator);
            resolve(input.value);
        });
    });
};

const showConfirmDialog = async (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
        let container = document.createElement("div");
        let obscurator = document.createElement("div");
        obscurator.setAttribute("style", "position:fixed;width:99vw;height:99vh;z-index:9999");
        document.body.appendChild(obscurator);
        container.setAttribute("style", 'color: white;display: flex;justify-content: center;align-items: center;z-index: 99999999;position: absolute;top: 50%;left: 50%;background: black;border: 1px solid white;transform: translate(-50%, -50%);width: 50vw;height: 40vh;flex-direction: column;font-size: 20px;padding: 10px;');
        let text = document.createElement("div");
        text.textContent = message;
        container.appendChild(text);
        let buttons = document.createElement("div");
        buttons.setAttribute("style", 'display: flex;justify-content: space-around;width: 100%;');
        let cancel = document.createElement("button");
        cancel.className = "m-btn";
        cancel.textContent = "Cancel";
        buttons.appendChild(cancel);
        let confirm = document.createElement("button");
        confirm.className = "m-btn";
        confirm.textContent = "Confirm";
        buttons.appendChild(confirm);
        container.appendChild(buttons);
        document.body.appendChild(container);
        cancel.addEventListener("click", () => {
            document.body.removeChild(container);
            document.body.removeChild(obscurator);
            resolve(false);
        });
        confirm.addEventListener("click", () => {
            document.body.removeChild(container);
            document.body.removeChild(obscurator);
            resolve(true);
        });
    });
};

const showAlert = async (message: string): Promise<void> => {
    return new Promise((resolve) => {
        let container = document.createElement("div");
        let obscurator = document.createElement("div");
        obscurator.setAttribute("style", "position:fixed;width:99vw;height:99vh;z-index:9999");
        document.body.appendChild(obscurator);
        container.setAttribute("style", 'color: white;display: flex;justify-content: center;align-items: center;z-index: 99999999;position: absolute;top: 50%;left: 50%;background: black;border: 1px solid white;transform: translate(-50%, -50%);width: 50vw;height: 40vh;flex-direction: column;font-size: 20px;padding: 10px;');
        let text = document.createElement("div");
        text.textContent = message;
        container.appendChild(text);
        let buttons = document.createElement("div");
        buttons.setAttribute("style", 'display: flex;justify-content: space-around;width: 100%;');
        let confirm = document.createElement("button");
        confirm.className = "m-btn";
        confirm.textContent = "Ok";
        buttons.appendChild(confirm);
        container.appendChild(buttons);
        document.body.appendChild(container);
        confirm.addEventListener("click", () => {
            document.body.removeChild(container);
            document.body.removeChild(obscurator);
            resolve();
        });
    });
};

const goToCharacterCreator = (next: string): void => {
    var characterCreator = new CharacterCreator("characterDisplay");
    resetUI();
    Show(uiElements.characterCreator);
    characterCreator.display();
    ["previousHat", "nextHat", "nextShirtColor", "previousShirtColor", "confirmCharacter"].forEach(element => {
        removeEventListeners(element);
    });
    AddclickListener("previousHat", (): void => {
        characterCreator.previousHat();
    });
    AddclickListener("nextHat", (): void => {
        characterCreator.nextHat();
    });
    AddclickListener("nextShirtColor", (): void => {
        characterCreator.nextShirtColor();
    });
    AddclickListener("previousShirtColor", (): void => {
        characterCreator.previousShirtColor();
    });
    AddclickListener("confirmCharacter", async(): Promise<void> => {
        await db.setValue("character", characterCreator.getCharacterData());
        resetUI();
        Show(next);
    });
}

AddclickListener("startSingleplayer", async (): Promise<void> => {
    if (!await db.getValue("character")) {
        showAlert("You must create a character before playing");
        goToCharacterCreator(uiElements.worldSelector);
    } else {
        resetUI();
        Show(uiElements.worldSelector);
    }
});

AddclickListener("newWorldBtn", async (): Promise<void> => {
    let worldName = await showInputDialog("New world name:");
    if (isDefined(worldName) && worldName.length !== 0) {
        let worlds = await db.getValue("worlds");
        if (!isDefined(worlds[worldName])) {
            worlds[worldName] = await generateWorld();
            await db.setValue("worlds", worlds);
        }
        await updateWorldList();
        resetUI();
        Show(uiElements.gameScreen);
        game = new Game("screen", new worldInterface(worlds[worldName]), await db.getValue("character"));
        game.run();
    }
});

AddclickListener("backBtn", (): void => {
    resetUI();
    Show(uiElements.mainMenu);
});

AddclickListener("backFromCharacterCreation", async (): Promise<void> => {
    resetUI();
    Show(uiElements.mainMenu);
});

const updateWorldList = async (): Promise<void> => {
    let el: HTMLDivElement = <HTMLDivElement>document.getElementById("worlds");
    el.innerHTML = "";
    let worlds = await db.getValue("worlds");
    if (!isDefined(worlds)) {
        worlds = {};
        db.setValue("worlds", {});
    }
    Object.keys(worlds).forEach(key => {
        let div: HTMLDivElement = document.createElement("div");
        div.className = "world";
        div.textContent = key;
        div.addEventListener("click", async () => {
            let worlds = await db.getValue("worlds");
            resetUI();
            Show(uiElements.gameScreen);
            game = new Game("screen", new worldInterface(worlds[key]), await db.getValue("character"));
            game.run();
        });
        let img = document.createElement("img");
        img.src = "/assets/delete.png";
        img.className = "deleteButton";
        img.addEventListener("click", async(e: Event): Promise<void> => {
            e.stopPropagation();
            if (await showConfirmDialog(`Are you sure that you want to delete the world ${key} ?`)){
                let worlds = await db.getValue("worlds");
                delete worlds[key];
                await db.setValue("worlds", worlds);
                await updateWorldList();
            }
        });
        div.appendChild(img);
        el.appendChild(div);
    });
};

window.onload = async (): Promise<void> => {
    resetUI();
    Show(uiElements.mainMenu);
    await db.init()
    await updateWorldList();
}