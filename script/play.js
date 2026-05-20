let pScene, pBGLayer, pObjLayer, pUILayer, pBOLayer;//シーンとレイヤー
let pSceneSTime;

let pLoRect, pLoID;//最初の暗転

let TuneName, TuneDiff;//曲名と難易度

//タイマー
let tuneStartTimerID;//曲開始までのタイマー
let notesStartTimerID;//ノーツの生成開始までのタイマー
let judgeStartTimerID;//判定開始までのタイマー

let pStageRect, pStageOffset;//ステージのBGとオフセット(x座標をずらす)
let pStageFlames = [];//ステージのフレーム
let pJudgeBar = [];//判定バー
let waitStartTime;//開始待機時間
let nowPlaying;//現在再生中かどうか
let notesStarted;//ノーツ生成が開始されたか
let judgeStarted;//判定が開始されたか
let notesSpeedPer;//ノーツの速度(%表示)
const DefNotesDisplayTime = 1000;//デフォルトのノーツが表示される時間(ms)
let notesDisplayTime;//ノーツの表示時間
let notesSpeed;//ノーツの実速度(/msだからdeltaをそのままかける)
let notesStartTime;//ノーツ生成での時間
let tuneStartTime;//再生中での時間
let judgeStartTime;//判定開始の時間
let tuneBPM;//BPM
let oneBeatTime;//16音符1拍の時間
let notesData = [];//曲のスコアのデータを格納(流したノーツから消えていく)
let notesObjs = [[], [], [], [], []];//生成されたノーツのオブジェクトを格納
let beatsStd;//拍の取り方の基準の新旧(beatsStdOaN参照)
let notesLastBeatByKey = [];//キー毎の最後に生成したノーツの拍数
let keys = [];//Spaceは別に用意
let keysIsPushed = [];//keysの順番でtrue/false

function playReset() {
    pScene = new Fortis.Scene();
    Fortis.Game.setScene(pScene);
    pBGLayer = pScene.getBG();
    pObjLayer = pScene.getObj();
    pUILayer = pScene.getUI();

    pBOLayer = new Fortis.Layer();
    pScene.add(pBOLayer);

    pSceneSTime = performance.now();

    waitStartTime = 5000;
    nowPlaying = false;
    notesSpeedPer = 100;
    notesDisplayTime = DefNotesDisplayTime * (notesSpeedPer / 100);
    notesSpeed = (Fortis.Game.canvasCfg.size.y / 1.15) / notesDisplayTime;
    tuneBPM = tunesInfo[nowSelect].BPM;
    oneBeatTime = (60000 / tuneBPM) / 4;
    notesData = tunesInfo[nowSelect].score[nowDifficulty];
    beatsStd = beatsStdOaN[nowSelect][nowDifficulty];
    notesLastBeatByKey = [0, 0, 0, 0, 0];
    keys = ["D", "F", "J", "K"];
    keysIsPushed = [false, false, false, false];


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
        judgeStartTimerID = Fortis.Timer.add(waitStartTime - notesDisplayTime, false, function () {
            //判定開始
            judgeStarted = true;
            judgeStartTime = performance.now();
        });
        Fortis.Timer.start(judgeStartTimerID);
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

        //判定開始
        if (judgeStarted) {
            let tuneConvTime = performance.now() - judgeStartTime + notesDisplayTime;//曲開始からの時間
            let nowBeat = Math.floor(tuneConvTime / oneBeatTime);//現在の16分音符の拍数
            notesJudge(delta, tuneConvTime, nowBeat);
        }

        //ノーツ生成開始した
        if (notesStarted) {
            let tuneConvTime = performance.now() - notesStartTime;//曲開始からの時間
            let nowBeat = Math.floor(tuneConvTime / oneBeatTime);//現在の16分音符の拍数

            notesMoving(delta);

            notesGene(tuneConvTime, nowBeat);//ノーツ生成
        }
    }
}

function notesJudge(delta, tuneConvTime, nowBeat) {
    for (let i = 0; i < keys.length; i++) {
        if (Fortis.InputKey["Key" + keys[i]]) {
            keysIsPushed[i] = true;
            if (beatsStd) {//拍の基準が古い
                let oldNB = Math.floor((nowBeat + 1) / 2);
                //前後0.5拍分ずつを判定対象とする(0.42/0.32/0.2/0.07/0でmiss/bad/good/great/perfect)
                for (let j = 0; j < notesObjs[i].length; j++) {
                    let time = notesObjs[i][j].beat * oneBeatTime * 2;
                    console.log(tuneConvTime - time)
                    if (Math.abs(tuneConvTime - time) < oneBeatTime * 2 * 0.5) {
                        let diff = Math.abs(tuneConvTime - time);
                        //if (i == 0) console.log(diff)
                    }
                }
            }
        } else {
            if (keysIsPushed[i]) {//押されていた

            }
            keysIsPushed[i] = false;
        }
    }
}

function notesMoving(delta) {
    for (let i = 0; i < notesObjs.length; i++) {
        for (let j = 0; j < notesObjs[i].length; j++) {
            if (notesObjs[i][j].obj instanceof Fortis.EntityContainer) {
                notesObjs[i][j].obj.entity.forEach(note => {
                    note.entity.pos.y += notesSpeed * delta;
                });
                if (notesObjs[i][j].obj.entity[2].entity.pos.y > Fortis.Game.canvasCfg.size.y + Fortis.Game.canvasCfg.size.x / 10) {
                    pObjLayer.remove(notesObjs[i][j].obj);
                    notesObjs[i].splice(j, 1);
                    j--;
                }
            } else {
                notesObjs[i][j].obj.pos.y += notesSpeed * delta;
                //画面外に出たら削除
                if (notesObjs[i][j].obj.pos.y > Fortis.Game.canvasCfg.size.y + Fortis.Game.canvasCfg.size.x / 10) {
                    pObjLayer.remove(notesObjs[i][j].obj);
                    notesObjs[i].splice(j, 1);
                    j--;

                    //ノーツを逃したときの処理もかく
                }
            }
        }
    }
}

function notesGene(tuneConvTime, nowBeat) {
    //console.log(nowBeat);
    if (beatsStd) {//基準が古い場合
        let oldNB = Math.floor((nowBeat + 1) / 2);//去年の基準での拍数
        //console.log(oldNB);
        for (let i = 0; i < keys.length; i++) {
            let keyXPos = pJudgeBar[i].pos.x + Fortis.Game.canvasCfg.size.x / 14.4;
            for (let beat = notesLastBeatByKey[i] + 1; beat <= oldNB; beat++) {
                if (beat in notesData[keys[i]]) {
                    let time = beat * oneBeatTime * 2;
                    if (notesData[keys[i]][beat][0] == 1) {//単ノーツ
                        let note = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.x / 14)), new Fortis.ImageMaterial("cb"));
                        if (notesData[keys[i]][beat][1]) {//ポイント高めのノーツ
                            note.material.key = "cb";
                        }

                        note.pos = new Fortis.Vector2(keyXPos, (tuneConvTime - time) * notesSpeed - Fortis.Game.canvasCfg.size.y / 1.15);
                        //console.log(tuneConvTime - time)
                        notesObjs[i].push({
                            "obj": note,
                            "beat": beat,
                            "point": notesData[keys[i]][beat][1],
                        });
                        pObjLayer.add(note);
                    } else {//ロングノーツ
                        let notes = new Fortis.EntityContainer();
                        let noteHead = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 18, Fortis.Game.canvasCfg.size.x / 18)), new Fortis.ImageMaterial("sb"));
                        noteHead.pos = new Fortis.Vector2(keyXPos, (tuneConvTime - time) * notesSpeed - Fortis.Game.canvasCfg.size.y / 1.15);
                        noteHead.angle = 45;
                        let noteTail = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 18, Fortis.Game.canvasCfg.size.x / 18)), new Fortis.ImageMaterial("sb"));
                        noteTail.pos = new Fortis.Vector2(keyXPos, noteHead.pos.y - (notesData[keys[i]][beat][0] - 1) * oneBeatTime * 2 * notesSpeed);
                        noteTail.angle = 45;
                        let noteBody = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 20, (notesData[keys[i]][beat][0] - 1) * oneBeatTime * 2 * notesSpeed), new Fortis.ColorMaterial(new Fortis.Color("#2132CD")));
                        noteBody.alpha = 0.7
                        noteBody.pos = new Fortis.Vector2(keyXPos, (noteHead.pos.y + noteTail.pos.y) / 2);

                        notes.add(noteBody);
                        notes.add(noteHead);
                        notes.add(noteTail);

                        notesObjs[i].push({
                            "obj": notes,
                            "beat": beat,
                            "point": notesData[keys[i]][beat][1],
                        });
                        pObjLayer.add(notes);
                    }
                    delete notesData[keys[i]][beat];
                    notesLastBeatByKey[i] = beat;
                }
            }
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
