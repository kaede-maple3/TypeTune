let pScene, pBGLayer, pObjLayer, pUILayer, pBOLayer;//シーンとレイヤー
let pSceneSTime;

let pLoRect, pLoID;//最初の暗転

let TuneName, TuneDiff;//曲名と難易度

//タイマー
let tuneStartTimerID;//曲開始までのタイマー
let notesStartTimerID;//ノーツの生成開始までのタイマー

let pStageRect, pStageOffset;//ステージのBGとオフセット(x座標をずらす)
let nowMScore = {};//現在の譜面
let pStageFlames = [];//ステージのフレーム
let pJudgeBar = [];//判定バー
let waitStartTime;//開始待機時間
let nowPlaying;//現在再生中かどうか
let notesStarted;//ノーツ生成が開始されたか
let notesSpeed;//ノーツの速度(%表示)
const DefNotesDisplayTime = 1500;//デフォルトのノーツが表示される時間(ms)
let notesDisplayTime;//ノーツの表示時間
let notesStartTime;//ノーツ生成での時間
let tuneStartTime;//再生中での時間
let tuneBPM;//BPM
let oneBeatTime;//16音符1拍の時間

function playReset() {
    pScene = new Fortis.Scene();
    Fortis.Game.setScene(pScene);
    pBGLayer = pScene.getBG();
    pObjLayer = pScene.getObj();
    pUILayer = pScene.getUI();

    pBOLayer = new Fortis.Layer();
    pScene.add(pBOLayer);

    pSceneSTime = performance.now();

    nowMScore = tunesInfo[nowSelect].score[nowDifficulty];
    waitStartTime = 5000;
    nowPlaying = false;
    notesSpeed = 100;
    notesDisplayTime = DefNotesDisplayTime * notesSpeed / 100;
    tuneBPM = tunesInfo[nowSelect].BPM;
    oneBeatTime = (60000 / tuneBPM) / 16;


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

    //曲名と難易度
    {
        TuneName = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font(tunesInfo[nowSelect]["font"], Fortis.Game.canvasCfg.size.y / 25), tunesInfo[nowSelect].name), new Fortis.ColorMaterial(new Fortis.Color("white")));
        TuneName.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.15, Fortis.Game.canvasCfg.size.y / 1.2);

        TuneDiff = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 25), ["Easy", "Normal", "Hard", "Extra"][nowDifficulty]), new Fortis.ColorMaterial(new Fortis.Color(["#1da23e", "#1a679b", "#971b1b", "#70138f"][nowDifficulty])));
        TuneDiff.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.15, Fortis.Game.canvasCfg.size.y / 1.12);

        pUILayer.addEntities([TuneName, TuneDiff]);
    }

    //ステージとフレーム
    {
        pStageOffset = Fortis.Game.canvasCfg.size.x / 25;

        pStageRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 1.8, Fortis.Game.canvasCfg.size.y), new Fortis.ColorMaterial(new Fortis.Color("#252525")));
        pStageRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2 - pStageOffset, Fortis.Game.canvasCfg.size.y / 2);
        pStageRect.alpha = 0.6;

        pObjLayer.add(pStageRect);

        //判定バー
        {
            for (let i = 0; i < 4; i++) {
                let bar = new Fortis.Entity(new Fortis.LineShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 7.2, 0)), new Fortis.ColorMaterial(null, new Fortis.Color("#ececec")));
                bar.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2 - pStageOffset - pStageRect.shape.size.x / 2 + (pStageRect.shape.size.x / 4) * i, Fortis.Game.canvasCfg.size.y / 1.15);
                bar.material.thick = 7;
                bar.alpha = 0.35;
                pJudgeBar.push(bar);
            }
        }

        for (let i = 0; i < 5; i++) {
            let flame = new Fortis.Entity(new Fortis.LineShape(new Fortis.Vector2(0, Fortis.Game.canvasCfg.size.y)), new Fortis.ColorMaterial(null, new Fortis.Color("#353535")));
            flame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2 - pStageOffset - pStageRect.shape.size.x / 2 + (pStageRect.shape.size.x / 4) * i, 0);
            pStageFlames.push(flame);
        }

        pUILayer.addEntities([...pJudgeBar, ...pStageFlames]);
    }

    //タイマー
    {
        tuneStartTimerID = Fortis.Timer.add(waitStartTime, false, function () {
            //曲開始
            nowPlaying = true;
            nowSound.currentTime = 0;
            nowSound.play();
            tuneStartTime = performance.now();
        });
        Fortis.Timer.start(tuneStartTimerID);
        notesStartTimerID = Fortis.Timer.add(waitStartTime - notesDisplayTime * 2, false, function () {
            //ノーツの生成開始
            notesStarted = true;
            notesStartTime = performance.now();
        });
        Fortis.Timer.start(notesStartTimerID);
    }
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

    if (pLoRect.alpha == 0) { //開始少しの間は何もしない
        //キー入力
        {
            if (Fortis.InputKey["KeyD"] || Fortis.InputKey["Space"]) {
                pJudgeBar[0].alpha = 1;
            } else {
                pJudgeBar[0].alpha = 0.35;
            }

            if (Fortis.InputKey["KeyF"] || Fortis.InputKey["Space"]) {
                pJudgeBar[1].alpha = 1;
            } else {
                pJudgeBar[1].alpha = 0.35;
            }

            if (Fortis.InputKey["KeyJ"] || Fortis.InputKey["Space"]) {
                pJudgeBar[2].alpha = 1;
            } else {
                pJudgeBar[2].alpha = 0.35;
            }

            if (Fortis.InputKey["KeyK"] || Fortis.InputKey["Space"]) {
                pJudgeBar[3].alpha = 1;
            } else {
                pJudgeBar[3].alpha = 0.35;
            }
        }

        //再生中
        if (nowPlaying) {

        }

        //ノーツ生成開始した
        if (notesStarted) {
            let tuneConvTime = performance.now() - notesStartTime;//曲開始からの時間
            let nowBeat = Math.floor(tuneConvTime / oneBeatTime);//現在の16分音符の拍数
            //ノーツの生成
        }
    }
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