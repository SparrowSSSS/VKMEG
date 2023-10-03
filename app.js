const authorJPG = chrome.runtime.getURL("author.jpg");
const crossSVG = chrome.runtime.getURL("cross.svg");
let errorText;
if (localStorage.getItem("errorText")) {
    errorText = localStorage.getItem("errorText");
} else {
    errorText = "Во время звонка произошла ошибка. Повторите попытку позже.";
};

function addElements() {
    const stylesheet = document.createElement("style");
    stylesheet.innerHTML = `.vkmeg {
    width: 350px;
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: white;
    border-radius: 10px;
    user-select: none;
}

.vkmeg.hidden {
    display: none;
}

.vkmeg.unhidden {
    display: block;
}

.vkmeg .author {
    max-width: 250px;
    display: flex;
    max-height: 50px;
    text-align: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 5px;
    margin-top: 10px;
}

.vkmeg .author__nickname {
    text-transform: uppercase;
    font-weight: bold;
    text-decoration: none;
    color: black;
}

.vkmeg .author__nickname:hover {
    text-decoration: underline;
}

.vkmeg .author__text {
    flex: 1 1 auto;
    font-size: 16px;
    color: black;
}

.vkmeg .author__icon {
    max-width: 50px;
}

.vkmeg .author__icon img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.vkmeg .container {
    max-width: 280px;
    margin: 0 auto;
}

.vkmeg input {
    width: 100%;
    padding: 5px;
    border: 2px black solid;
    border-radius: 5px;
    transition: 300ms;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    user-select:all;
    outline: none;
}

.vkmeg input:focus {
    border-color: rgb(179, 55, 55);
}

.vkmeg .error {
    font-size: 16px;
    font-weight: bold;
    color: rgb(179, 55, 55);
    margin-bottom: 5px;
}

.vkmeg .ok {
    display: block;
    margin: 0 auto;
    background-color: transparent;
    border: 2px solid black;
    padding: 3px 10px;
    border-radius: 10px;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: 300ms;
    color: black;
}

.vkmeg .ok:hover {
    background-color: rgb(179, 55, 55);
}

.vkmeg .author__icon:hover img {
    border: 2px solid black;
}

.vkmeg-background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5000;
    user-select: none;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.72);;
}

.vkmeg-error {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vkmeg-error .errorBlock {
    color: #e1e3e6
}

.vkmeg-error .errorBlock__container {
    width: 403px;
}

.vkmeg-error .errorBlock__header {
    background-color: #232324;
    border-radius: 12px 12px 0 0;
}

.vkmeg-error .errorBlock__footer {
    border-radius: 0 0 12px 12px;
}

.vkmeg-error .errorBlock__body,  .errorBlock__footer{
    background-color: #2c2d2e;
}

.vkmeg-error ._hc{
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #363738;
}

.vkmeg-error ._bc {
    padding: 25px 25px;
    border-bottom: 1px solid #363738;
}

.vkmeg-error ._fc {
    padding: 15px 25px;
    display: flex;
    justify-content: end;
    align-items: center;
}

.vkmeg-error .errorBlock__title {
    font-size: 15px;
    font-family: sans-serif;
}

.vkmeg-error .errorBlock__text {
    font-size: 14px;
    font-family: sans-serif;
    line-height: 20px;
}

.vkmeg-error .errorBlock__button {
    color: #19191a;
    user-select: none;
    padding: 10px 18px;
    background-color: #e1e3e6;
    cursor: pointer;
    border: none;
    border-radius: 8px;
    font-weight: bold;
}

.vkmeg-error .errorBlock__xmark {
    width: 15px;
    height: 15px;
}

.vkmeg-error .errorBlock__xmark img {
    user-select: none;
    cursor: pointer;
}`;

    document.head.append(stylesheet);

    const popup = document.createElement("div");
    popup.classList.add("vkmeg", "hidden");
    popup.innerHTML = `<div class="author">
<div class="author__text">
    Developed by <a href="https://github.com/SparrowSSSS" class="author__nickname">Sparrow</a>
</div>
<div class="author__icon">
    <a href="https://github.com/SparrowSSSS">
        <img src="${authorJPG}" alt="sparrow">
    </a>
</div>
</div>
<div class="container">
<p class="error">Error:</p>
<input type="text" value="${errorText}" class="i"><br>
<button type="button" class="ok">OK</button>
</div>`

    document.body.append(popup);
};

function main() {
    addElements();

    let status = 0;

    const panel = document.querySelector(".vkmeg");
    function tooglePanel() {
        if (status === 1) return;
        if (panel.classList.contains("hidden")) {
            panel.classList.remove("hidden");
            panel.classList.add("unhidden");
        } else {
            panel.classList.remove("unhidden");
            panel.classList.add("hidden");
        };
    };


    const buttonReplaceError = document.querySelector(".vkmeg .ok");
    const errorInput = document.querySelector(".vkmeg .i");

    function getErrorElement(error) {
        const errorBlock = document.createElement("div");
        errorBlock.classList.add("vkmeg-error");
        errorBlock.innerHTML = `<div class='errorBlock'>
    <div class='errorBlock__header'>
        <div class='errorBlock__container _hc'>
            <div class='errorBlock__title'>Ошибка</div>
            <div class='errorBlock__xmark'>
                <img src="${crossSVG}">
            </div>
        </div>
    </div>
    <div class='errorBlock__body'>
        <div class='errorBlock__container _bc'>
            <div class='errorBlock__text'>${error}</div>
        </div>
    </div>
    <div class='errorBlock__footer'>
        <div class='errorBlock__container _fc'>
            <button type='button' class='errorBlock__button'>Закрыть</button>
        </div>
    </div>
</div>`
        return errorBlock;
    };

    function addErrorBlock(errorBlock, errorStatus) {
        if (errorStatus) errorStatus.hidden = false;

        const blackBackground = document.createElement("div");
        blackBackground.classList.add("vkmeg-background");

        document.body.insertAdjacentElement("afterbegin", blackBackground);
        document.body.insertAdjacentElement("beforeend", errorBlock);

        errorBlock.addEventListener("click", e => {
            if (e.target.closest(".errorBlock__button") || e.target.closest(".errorBlock__xmark img")) {
                errorBlock.remove();
                blackBackground.remove();
                if (errorStatus) errorStatus.hidden = true;
            };
        });
    };

    function modeClick() {
        if (status === 1) return;
        status = 1;
        const errorElement = getErrorElement(errorText);
        document.addEventListener("click", e => {
            if (e.target.closest("button")) {
                e.stopPropagation();
                addErrorBlock(errorElement);
            };
        });
    };

    function modeInfinity() {
        if (status === 1) return;
        status = 1;
        const errorElement = getErrorElement(errorText);
        const errorStatus = {hidden: true};

        setInterval(() => {
            if (errorStatus.hidden === true) {
                addErrorBlock(errorElement, errorStatus);
            };
        }, 5000);
    };

    buttonReplaceError.addEventListener("click", () => {
        if (errorText !== errorInput.value) {
            errorText = errorInput.value;
            localStorage.setItem("errorText", errorText);
        };
    });

    document.addEventListener("keypress", e => {
        if (e.code === "Slash") {
            tooglePanel();
        } else if (e.code === "Minus") {
            modeClick();
        } else if (e.code === "Equal") {
            modeInfinity();
        };
    });
};

main();