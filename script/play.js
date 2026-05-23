let pScene, pBGLayer, pObjLayer, pUILayer, pBOLayer;//シーンとレイヤー
let pSceneSTime;

let pLoRect, pLoID;//最初の暗転

let TuneName, TuneDiff;//曲名と難易度

let keyTexts = [];//どのキーを押すのかを分かりやすくするやつ
let timingReactions = [];//タイミングリアクション
let TRTsTimeIds = [];//リアクションのテキストを消すタイマー
const TRTsTime = 800;//リアクションのテキストが表示される時間(ms)

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
let longNotesPushed = [];//ロングノーツが押されているか
let combo, maxCombo, comboText, comboDisplayText;//コンボ数、最高コンボ数コンボ数を表示
let score, scoreText, scoreDisplayText, rankText;//スコア、スコアを表示、ランクを表示
let fever, feverGageFlame, feverGage, feverText;//フィーバー(割合)
const feverScore = [-0.01, 0.005, 0.007, 0.0085, 0.01];//フィーバーゲージの増え方miss/bad/good/great/perfect

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
    longNotesPushed = [false, false, false, false];
    combo = 0;
    maxCombo = 0;
    score = 0;
    fever = 0;


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

    //キーテキスト
    {
        for (let i = 0; i < keys.length; i++) {
            let keyTxt = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 20), ["D", "F", "J", "K", "Space"][i]), new Fortis.ColorMaterial(new Fortis.Color("white")));
            keyTxt.pos = new Fortis.Vector2(pJudgeBar[i].pos.x + Fortis.Game.canvasCfg.size.x / 14.4, pJudgeBar[i].pos.y + Fortis.Game.canvasCfg.size.y / 20);
            keyTxt.alpha = 0.5;
            keyTexts.push(keyTxt);
        }

        pUILayer.addEntities([...keyTexts]);
    }

    //タイミングリアクション
    {
        for (let i = 0; i < keys.length; i++) {
            let rt = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 25), ["D", "F", "J", "K", "Space"][i]), new Fortis.ColorMaterial(new Fortis.Color("white")));
            rt.pos = new Fortis.Vector2(pJudgeBar[i].pos.x + Fortis.Game.canvasCfg.size.x / 14.4, pJudgeBar[i].pos.y - Fortis.Game.canvasCfg.size.y / 18);
            rt.alpha = 0;
            timingReactions.push(rt);
            TRTsTimeIds.push(Fortis.TransitionManager.add(timingReactions[i], "alpha", TRTsTime, 0.5, 0, Fortis.util.easing.inOutPower, 2));
        }

        pUILayer.addEntities([...timingReactions]);
    }

    //コンボ表示
    {
        comboText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 23), "Combo"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        comboText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.15, Fortis.Game.canvasCfg.size.y / 1.8);
        //comboText.alpha = 0.7;
        comboDisplayText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 12), "0"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        comboDisplayText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.15, Fortis.Game.canvasCfg.size.y / 1.55);
        //comboDisplayText.alpha = 0.7;
        pUILayer.addEntities([comboText, comboDisplayText]);
    }

    //スコア・ランク表示
    {
        scoreText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 25), "Score"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        scoreText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.25, Fortis.Game.canvasCfg.size.y / 18);
        scoreDisplayText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 12), "00000000"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        scoreDisplayText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.15, Fortis.Game.canvasCfg.size.y / 6.5);
        rankText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 22), "Rank"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        rankText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 1.15, Fortis.Game.canvasCfg.size.y / 3.3);
        pUILayer.addEntities([scoreText, scoreDisplayText, rankText]);
    }

    //フィーバーゲージ
    {
        feverText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 25), "Fever"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        feverText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 11, Fortis.Game.canvasCfg.size.y / 18);
        feverGage = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 11, Fortis.Game.canvasCfg.size.y / 1.25), new Fortis.ColorMaterial(new Fortis.Color("#b66262")));
        feverGage.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 11, Fortis.Game.canvasCfg.size.y / 1.95 + Fortis.Game.canvasCfg.size.y / 2.5);
        feverGageFlame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 11, Fortis.Game.canvasCfg.size.y / 1.25), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        feverGageFlame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 11, Fortis.Game.canvasCfg.size.y / 1.95);
        pUILayer.addEntities([feverText, feverGage, feverGageFlame]);
        ComboScoreFeverChange(0);
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
            let tuneConvTime = performance.now() - judgeStartTime - notesDisplayTime;//曲開始からの時間
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
            if (keysIsPushed[i] <= 3) {
                if (beatsStd) {//拍の基準が古い
                    //前後0.5拍分ずつを判定対象とする(0.42/0.32/0.2/0.07/0でmiss/bad/good/great/perfect)
                    for (let j = 0; j < notesObjs[i].length; j++) {
                        let time = notesObjs[i][j].beat * oneBeatTime * 2;
                        //console.log(tuneConvTime - time)
                        if (Math.abs(tuneConvTime - time) <= oneBeatTime * 2 * 0.5) {//１拍の半分
                            keysIsPushed[i] = 4;
                            
                            let diff = Math.abs(tuneConvTime - time);

                            let scoreDelta = notesObjs[i][j]["scoreBasis"] * notesObjs[i][j]["length"];

                            timingReactions[i].alpha = 0.5;
                            if (Fortis.TransitionManager.get(TRTsTimeIds[i]) !== false) Fortis.TransitionManager.remove(TRTsTimeIds[i]);
                            TRTsTimeIds[i] = Fortis.TransitionManager.add(timingReactions[i], "alpha", TRTsTime, 0.5, 0, Fortis.util.easing.inOutPower, 2);
                            Fortis.TransitionManager.start(TRTsTimeIds[i]);
                            if (diff >= oneBeatTime * 2 * 0.41) {//bad
                                timingReactions[i].shape.text = "Bad";
                                timingReactions[i].material.fill = new Fortis.Color("#19D2E0");
                                combo++;
                                fever += feverScore[1];
                                scoreDelta *= 0.9;
                            } else if (diff >= oneBeatTime * 2 * 0.3) {//good
                                timingReactions[i].shape.text = "Good";
                                timingReactions[i].material.fill = new Fortis.Color("#4AE019");
                                combo++;
                                fever += feverScore[1];
                            } else if (diff >= oneBeatTime * 2 * 0.1) {//great
                                timingReactions[i].shape.text = "Great";
                                timingReactions[i].material.fill = new Fortis.Color("#E0193A");
                                combo++;
                                fever += feverScore[3];
                                scoreDelta *= 1.25;
                            } else {//perfect
                                timingReactions[i].shape.text = "Perfect";
                                timingReactions[i].material.fill = new Fortis.Color("#DEE019");
                                combo++;
                                fever += feverScore[1];
                                scoreDelta *= 1.5;
                            }

                            //スコアやロングノーツ判定
                            if (notesObjs[i][j].obj instanceof Fortis.EntityContainer) {//ロングノーツ
                                longNotesPushed[i] = notesObjs[i][j];
                                ComboScoreFeverChange(0);
                            } else {
                                maxCombo = Math.max(combo, maxCombo);
                                ComboScoreFeverChange(scoreDelta);
                                //削除
                                pObjLayer.remove(notesObjs[i][j].obj);
                                notesObjs[i].splice(j, 1);
                            }
                            break;
                        }
                    }
                } else {
                    //前後0.5拍分ずつを判定対象とする(0.42/0.32/0.2/0.07/0でmiss/bad/good/great/perfect)
                    for (let j = 0; j < notesObjs[i].length; j++) {
                        let time = notesObjs[i][j].beat * oneBeatTime;
                        //console.log(tuneConvTime - time)
                        if (Math.abs(tuneConvTime - time) <= oneBeatTime * 0.5) {//１拍の半分
                            keysIsPushed[i] = 4;

                            let diff = Math.abs(tuneConvTime - time);

                            let scoreDelta = notesObjs[i][j]["scoreBasis"] * notesObjs[i][j]["length"];

                            timingReactions[i].alpha = 0.5;
                            if (Fortis.TransitionManager.get(TRTsTimeIds[i]) !== false) Fortis.TransitionManager.remove(TRTsTimeIds[i]);
                            TRTsTimeIds[i] = Fortis.TransitionManager.add(timingReactions[i], "alpha", TRTsTime, 0.5, 0, Fortis.util.easing.inOutPower, 2);
                            Fortis.TransitionManager.start(TRTsTimeIds[i]);

                            if (diff >= oneBeatTime * 0.41) {//bad
                                timingReactions[i].shape.text = "Bad";
                                timingReactions[i].material.fill = new Fortis.Color("#19D2E0");
                                combo++;
                                fever += feverScore[1];
                                scoreDelta *= 0.9;
                            } else if (diff >= oneBeatTime * 0.3) {//good
                                timingReactions[i].shape.text = "Good";
                                timingReactions[i].material.fill = new Fortis.Color("#4AE019");
                                combo++;
                                fever += feverScore[1];
                            } else if (diff >= oneBeatTime * 0.1) {//great
                                timingReactions[i].shape.text = "Great";
                                timingReactions[i].material.fill = new Fortis.Color("#E0193A");
                                combo++;
                                fever += feverScore[3];
                                scoreDelta *= 1.25;
                            } else {//perfect
                                timingReactions[i].shape.text = "Perfect";
                                timingReactions[i].material.fill = new Fortis.Color("#DEE019");
                                combo++;
                                fever += feverScore[1];
                                scoreDelta *= 1.5;
                            }

                            //スコアやロングノーツ判定
                            if (notesObjs[i][j].obj instanceof Fortis.EntityContainer) {//ロングノーツ
                                longNotesPushed[i] = notesObjs[i][j];
                                ComboScoreFeverChange(0);
                            } else {
                                maxCombo = Math.max(combo, maxCombo);
                                ComboScoreFeverChange(scoreDelta);
                                //削除
                                pObjLayer.remove(notesObjs[i][j].obj);
                                notesObjs[i].splice(j, 1);
                            }
                            break;
                        }
                    }
                }
            }
            keysIsPushed[i]++;
        } else {
            if (keysIsPushed[i] != 0) {//押されていた
                if (longNotesPushed[i] != false) {//ロングノーツが押されている
                    timingReactions[i].alpha = 0.5;
                    if (Fortis.TransitionManager.get(TRTsTimeIds[i]) !== false) Fortis.TransitionManager.remove(TRTsTimeIds[i]);
                    TRTsTimeIds[i] = Fortis.TransitionManager.add(timingReactions[i], "alpha", TRTsTime, 0.5, 0, Fortis.util.easing.inOutPower, 2);
                    Fortis.TransitionManager.start(TRTsTimeIds[i]);
                    let scoreDelta = 0;
                    if (beatsStd) {
                        let time = (longNotesPushed[i].beat + longNotesPushed[i]["length"] - 1) * oneBeatTime * 2;
                        let diff = Math.abs(tuneConvTime - time);
                        scoreDelta = longNotesPushed[i]["scoreBasis"] * longNotesPushed[i]["length"];
                        if (diff <= oneBeatTime * 2 * 0.5) {

                            

                            if (diff >= oneBeatTime * 2 * 0.41) {//bad
                                timingReactions[i].shape.text = "Bad";
                                timingReactions[i].material.fill = new Fortis.Color("#19D2E0");
                                combo += longNotesPushed[i]["length"] * 2;
                                fever += feverScore[1];
                                scoreDelta *= 0.9;
                            } else if (diff >= oneBeatTime * 2 * 0.3) {//good
                                timingReactions[i].shape.text = "Good";
                                timingReactions[i].material.fill = new Fortis.Color("#4AE019");
                                combo += longNotesPushed[i]["length"] * 2;
                                fever += feverScore[1];
                            } else if (diff >= oneBeatTime * 2 * 0.1) {//great
                                timingReactions[i].shape.text = "Great";
                                timingReactions[i].material.fill = new Fortis.Color("#E0193A");
                                combo += longNotesPushed[i]["length"] * 2;
                                fever += feverScore[3];
                                scoreDelta *= 1.25;
                            } else {//perfect
                                timingReactions[i].shape.text = "Perfect";
                                timingReactions[i].material.fill = new Fortis.Color("#DEE019");
                                combo += longNotesPushed[i]["length"] * 2;
                                fever += feverScore[1];
                                scoreDelta *= 1.5;
                            }
                        } else {
                            timingReactions[i].shape.text = "Miss";
                            timingReactions[i].material.fill = new Fortis.Color("#194CE0");
                            fever += feverScore[0];
                            scoreDelta*=0.5;
                        }
                    } else {
                        let time = (longNotesPushed[i].beat + longNotesPushed[i]["length"] - 1) * oneBeatTime;
                        let diff = Math.abs(tuneConvTime - time);
                        scoreDelta = longNotesPushed[i]["scoreBasis"] * longNotesPushed[i]["length"];
                        if (diff <= oneBeatTime * 0.5) {
                            if (diff >= oneBeatTime * 0.41) {//bad
                                timingReactions[i].shape.text = "Bad";
                                timingReactions[i].material.fill = new Fortis.Color("#19D2E0");
                                combo += longNotesPushed[i]["length"];
                                fever += feverScore[1];
                                scoreDelta *= 0.9;
                            } else if (diff >= oneBeatTime * 0.3) {//good
                                timingReactions[i].shape.text = "Good";
                                timingReactions[i].material.fill = new Fortis.Color("#4AE019");
                                combo += longNotesPushed[i]["length"];
                                fever += feverScore[1];
                            } else if (diff >= oneBeatTime * 0.1) {//great
                                timingReactions[i].shape.text = "Great";
                                timingReactions[i].material.fill = new Fortis.Color("#E0193A");
                                combo += longNotesPushed[i]["length"];
                                fever += feverScore[3];
                                scoreDelta *= 1.25;
                            } else {//perfect
                                timingReactions[i].shape.text = "Perfect";
                                timingReactions[i].material.fill = new Fortis.Color("#DEE019");
                                combo += longNotesPushed[i]["length"];
                                fever += feverScore[1];
                                scoreDelta *= 1.5;
                            }
                        } else {
                            timingReactions[i].shape.text = "Miss";
                            timingReactions[i].material.fill = new Fortis.Color("#194CE0");
                            fever += feverScore[0];
                            scoreDelta *= 0.5;
                        }
                    }

                    for (let j = 0; j < notesObjs[i].length; j++) {
                        if (notesObjs[i][j].obj.id == longNotesPushed[i].obj.id) {
                            pObjLayer.remove(notesObjs[i][j].obj);
                            notesObjs[i].splice(j, 1);
                            break;
                        }
                    }
                    longNotesPushed[i] = false;

                    maxCombo = Math.max(combo, maxCombo);
                    ComboScoreFeverChange(scoreDelta);
                }
            }
            keysIsPushed[i] = 0;
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
                    timingReactions[i].alpha = 0.5;
                    if (Fortis.TransitionManager.get(TRTsTimeIds[i]) !== false) Fortis.TransitionManager.remove(TRTsTimeIds[i]);
                    TRTsTimeIds[i] = Fortis.TransitionManager.add(timingReactions[i], "alpha", TRTsTime, 0.5, 0, Fortis.util.easing.inOutPower, 2);
                    Fortis.TransitionManager.start(TRTsTimeIds[i]);
                    timingReactions[i].shape.text = "Miss";
                    timingReactions[i].material.fill = new Fortis.Color("#194CE0");
                    if (longNotesPushed[i] != false && (notesObjs[i][j].obj.id == longNotesPushed[i]["obj"].id)) {
                        longNotesPushed[i] = false;
                    } else {
                        combo = 0;
                        maxCombo = Math.max(combo, maxCombo);
                        fever += feverScore[0];
                        ComboScoreFeverChange(0);
                    }

                    pObjLayer.remove(notesObjs[i][j].obj);
                    notesObjs[i].splice(j, 1);
                    j--;
                }
            } else {
                notesObjs[i][j].obj.pos.y += notesSpeed * delta;
                //画面外に出たら削除
                if (notesObjs[i][j].obj.pos.y > Fortis.Game.canvasCfg.size.y + Fortis.Game.canvasCfg.size.x / 10) {
                    if (Fortis.TransitionManager.get(TRTsTimeIds[i]) !== false) Fortis.TransitionManager.remove(TRTsTimeIds[i]);
                    TRTsTimeIds[i] = Fortis.TransitionManager.add(timingReactions[i], "alpha", TRTsTime, 0.5, 0, Fortis.util.easing.inOutPower, 2);
                    Fortis.TransitionManager.start(TRTsTimeIds[i]);
                    timingReactions[i].alpha = 0.5;
                    timingReactions[i].shape.text = "Miss";
                    timingReactions[i].material.fill = new Fortis.Color("#194CE0");
                    combo = 0;
                    maxCombo = Math.max(combo, maxCombo);
                    fever += feverScore[0];
                    ComboScoreFeverChange(0);

                    pObjLayer.remove(notesObjs[i][j].obj);
                    notesObjs[i].splice(j, 1);
                    j--;

                    //ノーツを逃したときの処理もかく
                }
            }
        }
    }
}

function ComboScoreFeverChange(scoreDelta) {
    //コンボ
    comboDisplayText.shape.text = combo;
    scoreDisplayText.shape.text = score.toString().padStart(8, '0');

    //フィーバーゲージによるスコア倍率
    let scoreMag = 1;

    //フィーバー
    if (fever > 1) fever = 1;
    if (fever < 0) fever = 0;
    feverGage.shape.size.y = (Fortis.Game.canvasCfg.size.y / 1.25) * fever;
    feverGage.shape.distance.y = -feverGage.shape.size.y / 2;
    if (fever < 0.1) {
        feverGage.material.fill = new Fortis.Color("#194CE0");
    } else if (fever < 0.2) {
        feverGage.material.fill = new Fortis.Color("#194CE0");
        scoreMag = 1.1;
    } else if (fever < 0.4) {
        feverGage.material.fill = new Fortis.Color("#19D2E0");
        scoreMag = 1.2;
    } else if (fever < 0.6) {
        feverGage.material.fill = new Fortis.Color("#4AE019");
        scoreMag = 1.3;
    } else if (fever < 0.8) {
        feverGage.material.fill = new Fortis.Color("#E0193A");
        scoreMag = 1.4;
    } else {
        feverGage.material.fill = new Fortis.Color("#DEE019");
        scoreMag = 1.5;
    }

    score += Math.floor((scoreDelta * scoreMag * Math.floor(Math.log(combo ** (1 / 3) + Math.E) * 10) / 10) / 10) * 10;
    scoreDisplayText.shape.text = score.toString().padStart(7, '0');
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
                        let scoreBasis = 100;
                        if (notesData[keys[i]][beat][1]) {//ポイント高めのノーツ
                            note.material.key = "cg";
                            scoreBasis = 200;
                        }

                        note.pos = new Fortis.Vector2(keyXPos, (tuneConvTime - time) * notesSpeed - Fortis.Game.canvasCfg.size.y / 1.15);
                        //console.log(tuneConvTime - time)
                        notesObjs[i].push({
                            "obj": note,
                            "beat": beat,
                            "length": 1,
                            "scoreBasis": scoreBasis,
                        });
                        pObjLayer.add(note);
                    } else {//ロングノーツ
                        let scoreBasis = beat;
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
                        if (notesData[keys[i]][beat][1]) {//ポイント高めのノーツ
                            noteHead.material.key = "sg";
                            noteTail.material.key = "sg";
                            noteBody.material.fill = new Fortis.Color("#23D129");
                            scoreBasis = beat;
                        }

                        notes.add(noteBody);
                        notes.add(noteHead);
                        notes.add(noteTail);

                        notesObjs[i].push({
                            "obj": notes,
                            "beat": beat,
                            "length": notesData[keys[i]][beat][0],
                            "scoreBasis": scoreBasis,
                        });
                        pObjLayer.add(notes);
                    }
                    delete notesData[keys[i]][beat];
                    notesLastBeatByKey[i] = beat;
                }
            }
        }
    } else {
        for (let i = 0; i < keys.length; i++) {
            let keyXPos = pJudgeBar[i].pos.x + Fortis.Game.canvasCfg.size.x / 14.4;
            for (let beat = notesLastBeatByKey[i] + 1; beat <= nowBeat; beat++) {
                if (beat in notesData[keys[i]]) {
                    let time = beat * oneBeatTime;
                    if (notesData[keys[i]][beat][0] == 1) {//単ノーツ
                        scoreBasis = 100;
                        let note = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.x / 14)), new Fortis.ImageMaterial("cb"));
                        if (notesData[keys[i]][beat][1]) {//ポイント高めのノーツ
                            note.material.key = "cg";
                            scoreBasis = 200;
                        }

                        note.pos = new Fortis.Vector2(keyXPos, (tuneConvTime - time) * notesSpeed - Fortis.Game.canvasCfg.size.y / 1.15);
                        //console.log(tuneConvTime - time)
                        notesObjs[i].push({
                            "obj": note,
                            "beat": beat,
                            "length": 1,
                            "scoreBasis": scoreBasis,
                        });
                        pObjLayer.add(note);
                    } else {//ロングノーツ
                        let scoreBasis = 100;
                        let notes = new Fortis.EntityContainer();
                        let noteHead = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 18, Fortis.Game.canvasCfg.size.x / 18)), new Fortis.ImageMaterial("sb"));
                        noteHead.pos = new Fortis.Vector2(keyXPos, (tuneConvTime - time) * notesSpeed - Fortis.Game.canvasCfg.size.y / 1.15);
                        noteHead.angle = 45;
                        let noteTail = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 18, Fortis.Game.canvasCfg.size.x / 18)), new Fortis.ImageMaterial("sb"));
                        noteTail.pos = new Fortis.Vector2(keyXPos, noteHead.pos.y - (notesData[keys[i]][beat][0] - 1) * oneBeatTime * notesSpeed);
                        noteTail.angle = 45;
                        let noteBody = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 20, (notesData[keys[i]][beat][0] - 1) * oneBeatTime * notesSpeed), new Fortis.ColorMaterial(new Fortis.Color("#2132CD")));
                        noteBody.alpha = 0.7
                        noteBody.pos = new Fortis.Vector2(keyXPos, (noteHead.pos.y + noteTail.pos.y) / 2);
                        if (notesData[keys[i]][beat][1]) {//ポイント高めのノーツ
                            noteHead.material.key = "sg";
                            noteTail.material.key = "sg";
                            noteBody.material.fill = new Fortis.Color("#23D129");
                            scoreBasis = 200;
                        }

                        notes.add(noteBody);
                        notes.add(noteHead);
                        notes.add(noteTail);

                        notesObjs[i].push({
                            "obj": notes,
                            "beat": beat,
                            "length": notesData[keys[i]][beat][0],
                            "scoreBasis": scoreBasis,
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
