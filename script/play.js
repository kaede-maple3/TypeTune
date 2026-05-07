let pScene, pBGLayer, pObjLayer, pUILayer, pBOLayer;
let pSceneSTime;

let pLoRect, pLoID;

let pStageRect;

function playReset() {
    pScene = new Fortis.Scene();
    Fortis.Game.setScene(pScene);
    pBGLayer = pScene.getBG();
    pObjLayer = pScene.getObj();
    pUILayer = pScene.getUI();

    pBOLayer = new Fortis.Layer();
    pScene.add(pBOLayer);

    pSceneSTime = performance.now();

    //アルファベット落下
    {
        letterFont = new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 27);
        letterSpnTimerId = Fortis.Timer.add(1200, true, function () {
            setFallingLetterP();
        });
        Fortis.Timer.start(letterSpnTimerId);
    }

    //最初の暗転
    {
        pLoRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 2, Fortis.Game.canvasCfg.size.y * 2), new Fortis.ColorMaterial(new Fortis.Color("black")));
        pLoRect.alpha = 0;
        pBOLayer.add(pLoRect);
        pLoID = Fortis.TransitionManager.add(pLoRect, "alpha", 500, 1, 0, Fortis.util.easing.inPower, 2);
        Fortis.TransitionManager.start(pLoID);
    }

    pStageRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x/1.8, Fortis.Game.canvasCfg.size.y), new Fortis.ColorMaterial(new Fortis.Color("#333333")));
    pStageRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 2);
    pUILayer.add(pStageRect);
}

//nowSoundは設定済みなので、開始するときに0から再生する

function pUpdate(delta) {
    // 落下するアルファベットの更新
    for (let i = 0; i < fallingLetters.length; i++) {
        fallingLetters[i].pos.y += fallingLetters[i].speed * delta;
        // 画面外に出たら削除
        if (fallingLetters[i].pos.y > Fortis.Game.canvasCfg.size.y + 50) {
            pBGLayer.remove(fallingLetters[i]);
            fallingLetters.splice(i, 1);
            i--;
        }
    }

    if(pLoRect.alpha == 0) {}//開始0.5秒は何もしない
}

function setFallingLetterP() {
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
    pBGLayer.add(letterEntity);
}