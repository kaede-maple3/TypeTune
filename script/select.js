let sScene, sBGLayer, sObjLayer, sUILayer, sBOLayer;
let sSceneTime;
let sloRect, sLoID;//最初の暗転
let sBoRect, sBoTID;//シーン切り替えの暗転

//「曲セレクト」の文字
let stsText, stsFont, stsTextRect;

//セレクトの状態
let sTuneOrDiff = true;//trueなら曲、falseなら難易度選択
let sStatusArrow, sStatusTxt;

//曲の選択肢
let nowSelect = 0;
let tunesTxtContainer = [];
let tunesRectTSId = [];

//曲セレクトの上下キー入力の抑制
let selectKeyRestrainTimerId;
let canSelectKeyInput;
let canSelectKeyInputTime;

//選択した曲の情報を表示/難易度選択
let nowDifficulty = 0;//0:easy 1:normal 2:hard 3:exstra
let stFlame, stFlameBG;
let stTuneULine, stTuneName
let stTuneCredit;
let stTuneBPMAndTime;
let stEasyFlame, stNormalFlame, stHardFlame, stExstraFlame;
let stEasyText, stNormalText, stHardText, stExstraText;
let stDiffBG = [];
let stDiffHighScoreTxt = [];
let nowSound;//選択した曲の音源

//ゲームスタート管理
let sCfmLayer;
let confirmStart = false;//trueなら確認画面表示
let cfmBG, cfmTextName, cfmTextDiff, cfmYesOrNo, cfmYoNAlpID, cfmYoNRepID;

function selectReset() {
    sScene = new Fortis.Scene();
    Fortis.Game.setScene(sScene);

    sObjLayer = sScene.getObj();
    sBGLayer = sScene.getBG();
    sUILayer = sScene.getUI();

    sCfmLayer = new Fortis.Layer();
    sScene.add(sCfmLayer);

    sBOLayer = new Fortis.Layer();
    sScene.add(sBOLayer);

    //シーンが始まった時間
    sSceneTime = performance.now();

    //アルファベット落下
    {
        letterFont = new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 27);
        letterSpnTimerId = Fortis.Timer.add(800, true, function () {
            setFallingLetterS();
        });
        Fortis.Timer.start(letterSpnTimerId);
    }


    //最初の暗転
    {
        sLoRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 2, Fortis.Game.canvasCfg.size.y * 2), new Fortis.ColorMaterial(new Fortis.Color("black")));
        sLoRect.alpha = 0;
        sBOLayer.add(sLoRect);
        sLoID = Fortis.TransitionManager.add(sLoRect, "alpha", 500, 1, 0, Fortis.util.easing.inPower, 2);
        Fortis.TransitionManager.start(sLoID);
    }

    //最後の暗転
    {
        sBoRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 2, Fortis.Game.canvasCfg.size.y * 2), new Fortis.ColorMaterial(new Fortis.Color("black")));
        sBoRect.alpha = 0;
        sBOLayer.add(sBoRect);
    }

    //「曲セレクト」の文字
    {
        stsTextRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 8, Fortis.Game.canvasCfg.size.y / 15), new Fortis.ColorMaterial(new Fortis.Color("#252525")));
        stsTextRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 16, Fortis.Game.canvasCfg.size.y / 22);
        stsTextRect.alpha = 0.5;

        stsFont = new Fortis.Font("WDXL Lubrifont TC", Fortis.Game.canvasCfg.size.y / 25);
        stsText = new Fortis.Entity(new Fortis.TextShape(stsFont, "曲セレクト"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        stsText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 16, Fortis.Game.canvasCfg.size.y / 22);

        sUILayer.addEntities([stsTextRect, stsText]);
    }

    //曲の選択肢(一画面に5曲+2曲(半分くらい表示)まで表示)
    {

        for (let i = 0; i < tunesInfo.length; i++) {
            let tuneContainer = new Fortis.EntityContainer();
            let tuneImg = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10)), new Fortis.ImageMaterial("tuneTxtBG"));
            let tuneRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(new Fortis.Color("#3c3c3c")));
            //tuneRect.alpha = 0.6;
            let tuneText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font(tunesInfo[i]["font"], Fortis.Game.canvasCfg.size.y / 25), tunesInfo[i].name), new Fortis.ColorMaterial(new Fortis.Color("white")));
            tuneContainer.add(tuneImg);
            //tuneContainer.add(tuneRect);
            tuneContainer.add(tuneText);
            sObjLayer.add(tuneContainer);
            tunesRectTSId.push(null);
            tunesTxtContainer.push(tuneContainer);
        }

        //選択肢のキー入力の抑制
        canSelectKeyInput = true;
        canSelectKeyInputTime = 250;
    }

    //セレクトの状態
    {
        sStatusArrow = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 27, Fortis.Game.canvasCfg.size.x / 27)), new Fortis.ImageMaterial("ArrowRight"));
        sStatusArrow.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2.1, Fortis.Game.canvasCfg.size.y / 2);
        sStatusArrow.angle = 180;
        sStatusTxt = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 30), "曲"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        sStatusTxt.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2.1, Fortis.Game.canvasCfg.size.y / 1.8);

        sUILayer.addEntities([sStatusArrow, sStatusTxt]);
    }

    //選択した曲の情報を表示/難易度選択
    {
        stFlame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 2.3, Fortis.Game.canvasCfg.size.y / 1.2), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        stFlame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.9);
        stFlame.material.thick = 3;

        stFlameBG = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 2.3, Fortis.Game.canvasCfg.size.y / 1.2), new Fortis.ColorMaterial(new Fortis.Color("#272727")));
        stFlameBG.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.9);
        stFlameBG.alpha = 0.6;

        //曲名
        stTuneULine = new Fortis.Entity(new Fortis.LineShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2.8, 0)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        stTuneULine.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.7, Fortis.Game.canvasCfg.size.y / 5 + Fortis.Game.canvasCfg.size.y / 30);
        stTuneULine.material.thick = 3;

        stTuneName = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font(tunesInfo[nowSelect]["font"], Fortis.Game.canvasCfg.size.y / 20), tunesInfo[nowSelect].name), new Fortis.ColorMaterial(new Fortis.Color("white")));
        stTuneName.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 5);

        //クレジット
        stTuneCredit = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 45), tunesInfo[nowSelect].credit), new Fortis.ColorMaterial(new Fortis.Color("white")));
        stTuneCredit.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 5 + Fortis.Game.canvasCfg.size.y / 17);

        //BPMと曲の長さ
        stTuneBPMAndTime = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 40), "BPM:" + tunesInfo[nowSelect].bpm + "               " + "時間:" + Math.floor(tunesInfo[nowSelect].time / 1000) + "秒"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        stTuneBPMAndTime.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 5 + Fortis.Game.canvasCfg.size.y / 9);

        //難易度選択
        //フレーム
        {
            //選択時の背景
            let diffBGEasy = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(new Fortis.Color("#3c3c3c")));
            diffBGEasy.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 2.4);
            diffBGEasy.alpha = 0.6;
            let diffBGNormal = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(new Fortis.Color("#3c3c3c")));
            diffBGNormal.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.8);
            diffBGNormal.alpha = 0;
            let diffBGHard = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(new Fortis.Color("#3c3c3c")));
            diffBGHard.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.43);
            diffBGHard.alpha = 0;
            let diffBGExstra = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(new Fortis.Color("#3c3c3c")));
            diffBGExstra.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.19);
            diffBGExstra.alpha = 0;
            stDiffBG.push(diffBGEasy, diffBGNormal, diffBGHard, diffBGExstra);

            //スコア文字
            let diffHighScoreEasy = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Martian Mono", Fortis.Game.canvasCfg.size.y / 25)), new Fortis.ColorMaterial(new Fortis.Color("white")));
            diffHighScoreEasy.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.25, Fortis.Game.canvasCfg.size.y / 2.4);
            let diffHighScoreNormal = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Martian Mono", Fortis.Game.canvasCfg.size.y / 25)), new Fortis.ColorMaterial(new Fortis.Color("white")));
            diffHighScoreNormal.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.25, Fortis.Game.canvasCfg.size.y / 1.8);
            let diffHighScoreHard = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Martian Mono", Fortis.Game.canvasCfg.size.y / 25)), new Fortis.ColorMaterial(new Fortis.Color("white")));
            diffHighScoreHard.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.25, Fortis.Game.canvasCfg.size.y / 1.43);
            let diffHighScoreExstra = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Martian Mono", Fortis.Game.canvasCfg.size.y / 25)), new Fortis.ColorMaterial(new Fortis.Color("white")));
            diffHighScoreExstra.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.25, Fortis.Game.canvasCfg.size.y / 1.19);
            stDiffHighScoreTxt.push(diffHighScoreEasy, diffHighScoreNormal, diffHighScoreHard, diffHighScoreExstra);


            //フレーム
            stEasyFlame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
            stEasyFlame.material.thick = 2;
            stEasyFlame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 2.4);
            stNormalFlame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
            stNormalFlame.material.thick = 2;
            stNormalFlame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.8);
            stHardFlame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
            stHardFlame.material.thick = 2;
            stHardFlame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.43);
            stExstraFlame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 3, Fortis.Game.canvasCfg.size.y / 10), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
            stExstraFlame.material.thick = 2;
            stExstraFlame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.3, Fortis.Game.canvasCfg.size.y / 1.19);
        }
        //文字
        {
            stEasyText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 25), "Easy"), new Fortis.ColorMaterial(new Fortis.Color("#1da23e")));
            stEasyText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.54, Fortis.Game.canvasCfg.size.y / 2.4);
            stNormalText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 25), "Normal"), new Fortis.ColorMaterial(new Fortis.Color("#1a679b")));
            stNormalText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.54, Fortis.Game.canvasCfg.size.y / 1.8);
            stHardText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 25), "Hard"), new Fortis.ColorMaterial(new Fortis.Color("#971b1b")));
            stHardText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.54, Fortis.Game.canvasCfg.size.y / 1.43);
            stExstraText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 25), "Exstra"), new Fortis.ColorMaterial(new Fortis.Color("#70138f")));
            stExstraText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.54, Fortis.Game.canvasCfg.size.y / 1.19);
        }

        sObjLayer.addEntities([stFlameBG, stFlame, stTuneULine, stTuneName, stTuneCredit, stTuneBPMAndTime, ...stDiffBG, ...stDiffHighScoreTxt, stEasyFlame, stNormalFlame, stHardFlame, stExstraFlame, stEasyText, stNormalText, stHardText, stExstraText]);
    }

    //選曲確認画面
    {
        cfmBG = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x, Fortis.Game.canvasCfg.size.y), new Fortis.ColorMaterial(new Fortis.Color("black")));
        cfmBG.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 2);
        cfmBG.alpha = 0;

        cfmTextName = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 12), "曲:" + tunesInfo[nowSelect].name), new Fortis.ColorMaterial(new Fortis.Color("white")));
        cfmTextName.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 2 - Fortis.Game.canvasCfg.size.y / 7);
        cfmTextName.alpha = 0;
        cfmTextDiff = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 15), "難易度:" + ["Easy", "Normal", "Hard", "Exstra"][nowDifficulty]), new Fortis.ColorMaterial(new Fortis.Color("white")));
        cfmTextDiff.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 2 - Fortis.Game.canvasCfg.size.y / 25);
        cfmTextDiff.alpha = 0;
        cfmTextDiff.shape.text = ["Easy", "Normal", "Hard", "Extra"][nowDifficulty];
        cfmTextDiff.material.fill = new Fortis.Color(["#1da23e", "#1a679b", "#971b1b", "#70138f"][nowDifficulty]);

        cfmYesOrNo = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 30), "Press space to begin / Q to return"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        cfmYesOrNo.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 2 + Fortis.Game.canvasCfg.size.y / 15);
        cfmYesOrNo.alpha = 0;
        cfmYoNRepID = Fortis.Timer.add(1450, true, function () {
            if (confirmStart) {
                if (cfmYesOrNo.alpha == 0.1) {
                    cfmYoNAlpID = Fortis.TransitionManager.add(cfmYesOrNo, "alpha", 1400, 0.1, 0.8, Fortis.util.easing.inOutPower, 2);
                    Fortis.TransitionManager.start(cfmYoNAlpID);
                } else {
                    cfmYoNAlpID = Fortis.TransitionManager.add(cfmYesOrNo, "alpha", 1400, 0.8, 0.1, Fortis.util.easing.inOutPower, 2);
                    Fortis.TransitionManager.start(cfmYoNAlpID);
                }
            }
        });
        Fortis.Timer.start(cfmYoNRepID);

        sCfmLayer.addEntities([cfmBG, cfmTextName, cfmTextDiff, cfmYesOrNo]);
    }

    //選択肢を初期化
    nowSound = new Fortis.SimpleSound(tunesInfo[nowSelect].data);//最初に必要
    nowSound.setVolume(tunesInfo[nowSelect].volume);
    tuneSelectChange(true);
}

function setFallingLetterS() {
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
    sBGLayer.add(letterEntity);
}

function sUpdate(delta) {
    // 落下するアルファベットの更新
    for (let i = 0; i < fallingLetters.length; i++) {
        fallingLetters[i].pos.y += fallingLetters[i].speed * delta;
        // 画面外に出たら削除
        if (fallingLetters[i].pos.y > Fortis.Game.canvasCfg.size.y + 50) {
            sBGLayer.remove(fallingLetters[i]);
            fallingLetters.splice(i, 1);
            i--;
        }
    }


    if (sLoRect.alpha == 0) {//開始１秒は反応しない
        //選曲確認
        if (Fortis.InputKey["Escape"] || Fortis.InputKey["KeyQ"]) {
            confirmStart = false;
            cfmBG.alpha = 0;
            cfmTextName.alpha = 0;
            cfmTextDiff.alpha = 0;
            Fortis.TransitionManager.stop(cfmYoNAlpID);
            cfmYesOrNo.alpha = 0;
        }
        if (Fortis.InputKey["Enter"] || Fortis.InputKey["Space"]) {
            confirmStart = true;
            cfmBG.alpha = 0.85;
            cfmTextName.alpha = 1;
            cfmTextDiff.alpha = 1;
            cfmYesOrNo.alpha = 1;
        }

        //プレイ開始
        if (sBoRect.alpha == 1) {
            sScene.destroy();
            fallingLetters = [];
            nowScene = "play";
            playReset();
            nowSound.pause();
        }

        if (confirmStart) {
            if (Fortis.InputKey["Enter"] || Fortis.InputKey["Space"]) {
                //ゲームスタート
                sBoTID = Fortis.TransitionManager.add(sBoRect, "alpha", 500, 0, 1, Fortis.util.easing.inPower, 2);
                Fortis.TransitionManager.start(sBoTID);
            }
        } else {
            //状態選択
            if (Fortis.InputKey["ArrowLeft"] || Fortis.InputKey["KeyA"]) {
                sTuneOrDiff = true;
                sStatusArrow.angle = 180;
                sStatusTxt.shape.text = "楽曲";
            }
            if (Fortis.InputKey["ArrowRight"] || Fortis.InputKey["KeyD"]) {
                sTuneOrDiff = false;
                sStatusArrow.angle = 0;
                sStatusTxt.shape.text = "難易度";
            }

            //セレクト
            if (canSelectKeyInput) {
                if (sTuneOrDiff) {//曲選択中
                    if ((Fortis.InputKey["ArrowUp"] || Fortis.InputKey["KeyW"]) && nowSelect > 0) {
                        canSelectKeyInput = false;
                        selectKeyRestrainTimerId = Fortis.Timer.add(canSelectKeyInputTime, false, function () {
                            canSelectKeyInput = true;
                        });
                        Fortis.Timer.start(selectKeyRestrainTimerId);
                        nowSelect--;
                        tuneSelectChange(false);
                    }
                    if ((Fortis.InputKey["ArrowDown"] || Fortis.InputKey["KeyS"]) && nowSelect < tunesInfo.length - 1) {
                        canSelectKeyInput = false;
                        selectKeyRestrainTimerId = Fortis.Timer.add(canSelectKeyInputTime, false, function () {
                            canSelectKeyInput = true;
                        });
                        Fortis.Timer.start(selectKeyRestrainTimerId);
                        nowSelect++;
                        tuneSelectChange(false);
                    }
                } else {//難易度選択中
                    if ((Fortis.InputKey["ArrowUp"] || Fortis.InputKey["KeyW"]) && nowDifficulty > 0) {
                        canSelectKeyInput = false;
                        nowDifficulty--;
                        selectKeyRestrainTimerId = Fortis.Timer.add(canSelectKeyInputTime - 70, false, function () {
                            canSelectKeyInput = true;
                        });
                        Fortis.Timer.start(selectKeyRestrainTimerId);
                        for (let i = 0; i < stDiffBG.length; i++) {
                            if (nowDifficulty == i) {
                                stDiffBG[i].alpha = 0.6;
                            } else {
                                stDiffBG[i].alpha = 0;
                            }
                        }
                        cfmTextDiff.shape.text = ["Easy", "Normal", "Hard", "Extra"][nowDifficulty];
                        cfmTextDiff.material.fill = new Fortis.Color(["#1da23e", "#1a679b", "#971b1b", "#70138f"][nowDifficulty]);
                    }
                    if ((Fortis.InputKey["ArrowDown"] || Fortis.InputKey["KeyS"]) && nowDifficulty < 3) {
                        canSelectKeyInput = false;
                        nowDifficulty++;
                        selectKeyRestrainTimerId = Fortis.Timer.add(canSelectKeyInputTime - 70, false, function () {
                            canSelectKeyInput = true;
                        });
                        Fortis.Timer.start(selectKeyRestrainTimerId);
                        for (let i = 0; i < stDiffBG.length; i++) {
                            if (nowDifficulty == i) {
                                stDiffBG[i].alpha = 0.6;
                            } else {
                                stDiffBG[i].alpha = 0;
                            }
                        }
                        cfmTextDiff.shape.text = ["Easy", "Normal", "Hard", "Extra"][nowDifficulty];
                        cfmTextDiff.material.fill = new Fortis.Color(["#1da23e", "#1a679b", "#971b1b", "#70138f"][nowDifficulty]);
                    }
                }
            }
        }
    }
}

function tuneSelectChange(init) {
    for (let i = 0; i < tunesTxtContainer.length; i++) {
        if (init) {
            tunesTxtContainer[i].setPos(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 8 + Math.cos((i - nowSelect) * (Math.PI / 6)) * (Fortis.Game.canvasCfg.size.x / 9), Fortis.Game.canvasCfg.size.y / 2 + (i - nowSelect) * Fortis.Game.canvasCfg.size.y / 6));
        } else {
            for (let j = 0; j < tunesTxtContainer[i].entity.length; j++) {
                tunesRectTSId[i] = Fortis.TransitionManager.add(tunesTxtContainer[i].entity[j].entity, "pos", canSelectKeyInputTime, tunesTxtContainer[i].entity[j].entity.pos, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 8 + Math.cos((i - nowSelect) * (Math.PI / 6)) * (Fortis.Game.canvasCfg.size.x / 9), Fortis.Game.canvasCfg.size.y / 2 + (i - nowSelect) * Fortis.Game.canvasCfg.size.y / 6), Fortis.util.easing.inOutCubic);
                Fortis.TransitionManager.start(tunesRectTSId[i]);
            }
        }

        if (i == nowSelect) {
            tunesTxtContainer[i].entity[0].entity.material.key = "tuneTxtBGselected";
            //tunesTxtContainer[i].entity[0].entity.material.stroke = new Fortis.Color("#1a3aaa");
        } else {
            tunesTxtContainer[i].entity[0].entity.material.key = "tuneTxtBG";
            //tunesTxtContainer[i].entity[0].entity.material.stroke = false;
        }
    }

    stTuneName.shape.text = tunesInfo[nowSelect].name;
    stTuneName.shape.font.family = tunesInfo[nowSelect].font;

    cfmTextName.shape.text = tunesInfo[nowSelect].name;
    cfmTextName.shape.font.family = tunesInfo[nowSelect].font;

    stTuneCredit.shape.text = tunesInfo[nowSelect].credit;

    stTuneBPMAndTime.shape.text = "BPM:" + tunesInfo[nowSelect].BPM + "               " + "時間:" + Math.floor(tunesInfo[nowSelect].time / 1000) + "秒";

    for (let i = 0; i < stDiffHighScoreTxt.length; i++) {
        stDiffHighScoreTxt[i].shape.text = highScoreData[tunesInfo[nowSelect].data][i].toString().padStart(8, '0');
    }

    nowSound.pause();
    nowSound = new Fortis.SimpleSound(tunesInfo[nowSelect].data);
    nowSound.setVolume(tunesInfo[nowSelect].volume);
    nowSound.play();
}