let tScene, tBGLayer, tObjLayer;

let titleText, titleFont;//ゲームタイトル
let startText, startFont, startRepID, startAlpID;//press space keyって書いておく

let tSceneTime;

let tBoRect, tBoTID;//ブラックアウト

/*
let circles = [];//水面模様
let cirSpnTimerId;//円の出現感覚のタイマー
let cirMouseSpnTimerId;//円の出現位置をマウスにするタイマー
*/

let fallingLetters = [];//落下するアルファベット
let letterSpnTimerId;//アルファベット出現タイマー
let letterFont;//アルファベット用フォント

function title() {
    tScene = new Fortis.Scene();
    Fortis.Game.setScene(tScene);
    tBGLayer = tScene.getBG();
    tObjLayer = tScene.getObj();

    titleFont = new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 5);
    titleText = new Fortis.Entity(new Fortis.TextShape(titleFont, "Type Tune"), new Fortis.ColorMaterial(new Fortis.Color("white")));
    titleText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 1 / 3);

    startFont = new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 27);
    startText = new Fortis.Entity(new Fortis.TextShape(startFont, "Press space to start"), new Fortis.ColorMaterial(new Fortis.Color("white")));
    startText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 2 / 3);
    startText.alpha = 0.8;
    startAlpID = Fortis.TransitionManager.add(startText, "alpha", 1100, 0.8, 0.1, Fortis.util.easing.inOutPower, 2);
    Fortis.TransitionManager.start(startAlpID);
    startRepID = Fortis.Timer.add(1150, true, setStartRepTr);
    Fortis.Timer.start(startRepID);

    tBoRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 2, Fortis.Game.canvasCfg.size.y * 2), new Fortis.ColorMaterial(new Fortis.Color("black")));
    tBoRect.alpha = 0;

    tObjLayer.addEntities([titleText, startText, tBoRect]);

    /*
    //setCircle();
    cirSpnTimerId = Fortis.Timer.add(6000+Math.random()*800-400, true, function() {
        setCircle();
    });
    //Fortis.Timer.start(cirSpnTimerId);
    cirMouseSpnTimerId = Fortis.Timer.add(1500, true, function() {
        setCircle(Fortis.Game.mouse.pos.copy());
    });
    //Fortis.Timer.start(cirMouseSpnTimerId);
    */

    //アルファベット落下
    letterFont = new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 27);
    letterSpnTimerId = Fortis.Timer.add(800, true, function () {
        setFallingLetter();
    });
    Fortis.Timer.start(letterSpnTimerId);

    tSceneSTime = performance.now();
}

function setStartRepTr() {
    if (startText.alpha == 0.1) {
        startAlpID = Fortis.TransitionManager.add(startText, "alpha", 1100, 0.1, 0.8, Fortis.util.easing.inOutPower, 2);
        Fortis.TransitionManager.start(startAlpID);
    } else {
        startAlpID = Fortis.TransitionManager.add(startText, "alpha", 1100, 0.8, 0.1, Fortis.util.easing.inOutPower, 2);
        Fortis.TransitionManager.start(startAlpID);
    }
}

/*
function setCircle(vec){
    if(vec == null){
        vec = new Fortis.Vector2(Math.random()*Fortis.Game.canvasCfg.size.x, Math.random()*Fortis.Game.canvasCfg.size.y);
    }
    circles.push(new Fortis.Entity(new Fortis.CircleShape(1),new Fortis.ColorMaterial(null,new Fortis.Color("#7b7b7b"))));
    circles[circles.length-1].pos = vec;
    circles[circles.length-1].alpha = 0.7;
    tBGLayer.add(circles[circles.length-1]);
}
*/

function setFallingLetter() {
    //let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ★▲▶◀▼▷△▽◁☆✦★▲▶◀▼▷△▽◁☆✦★▲▶◀▼▷△▽◁☆✦".split("");
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    let randomX = Math.random() * Fortis.Game.canvasCfg.size.x;
    let randomRotation = Math.random() * 180 - 90;

    let letterEntity = new Fortis.Entity(
        new Fortis.TextShape(letterFont, randomLetter),
        new Fortis.ColorMaterial(new Fortis.Color("white"))
    );
    letterEntity.pos = new Fortis.Vector2(randomX, -Fortis.Game.canvasCfg.size.y / 100);
    letterEntity.angle = randomRotation;
    letterEntity.speed = Fortis.Game.canvasCfg.size.y / 19000 + Math.random() * Fortis.Game.canvasCfg.size.y / 50000;
    letterEntity.alpha = 0.2;

    fallingLetters.push(letterEntity);
    tBGLayer.add(letterEntity);
}

function tUpdate(delta) {
    if (performance.now() - tSceneSTime >= 1000 && tBoRect.alpha == 0) {//開始１秒は反応しない
        if (Fortis.InputKey["Space"]) {
            tBoTID = Fortis.TransitionManager.add(tBoRect, "alpha", 500, 0, 1, Fortis.util.easing.inPower, 2);
            Fortis.TransitionManager.start(tBoTID);
        }
    }
    if (tBoRect.alpha == 1) {
        tScene.destroy();
        fallingLetters = [];
        nowScene = "select";
        selectReset();
    }

    /*
    for(let i = 0; i < circles.length; i++){
        circles[i].shape.radius += delta*0.07;
        circles[i].alpha -= delta*0.0001;
        if(circles[i].alpha <= 0){
            tBGLayer.remove(circles[i]);
            circles.splice(i,1);
            i--;
        }
    }
    */

    // 落下するアルファベットの更新
    for (let i = 0; i < fallingLetters.length; i++) {
        fallingLetters[i].pos.y += fallingLetters[i].speed * delta;
        // 画面外に出たら削除
        if (fallingLetters[i].pos.y > Fortis.Game.canvasCfg.size.y + 50) {
            tBGLayer.remove(fallingLetters[i]);
            fallingLetters.splice(i, 1);
            i--;
        }
    }

    /*
    if(Fortis.Game.mouse.lClick){
        if(Fortis.Timer.get(cirMouseSpnTimerId).management.activity){
            console.log("stop");
            Fortis.Timer.stop(cirMouseSpnTimerId);
        }else{
            console.log("start");
            Fortis.Timer.start(cirMouseSpnTimerId);
        }
    }
        */
}