let pScene, pBGLayer;
let NRR, NRRF;//notes range line

let FGRect, FGFrame, FGText, FGTFont;//フィーバーゲージ

let tScoreText, tScoreTFont, scoreText, scoreTFont;//スコアのテキスト(tはスコア自体、なしはスコアというテキスト)
let rankText, rankTFont;//ランクのテキスト
let comboText, comboTFont, tComboText, tComboTFont;//コンボ数
let tuneNameText, tuneNameTFont;//曲の名前
let difficultyText, difficultyTFont;//難易度

//ノーツが落ちてくるとこ
let lPartition, cPartition, rPartition;//仕切り
let judgeRect;//判定の場所
let laneDText, laneFText, laneJText, laneKText, laneTFont;//どのキーで反応するか
let dJudgePRect, fJudgePRect, jJudgePRect, kJudgePRect;//キーが押されたときに光る判定

let fadeRect, fadeId;//フェード
let sTNText, sTNTFont, sTNTId;//フェードインの時に出てくる曲名
let sTDText, STDTFont, sTDTId;//フェードインの時に出てくる難易度
let UILayer;

let startTimer;//曲開始までのタイマー
let nStartTimer;//ノーツの計算の開始までのタイマー
let nSTStartTime;//ノーツのタイマーが始まった時間

let feverGauge;//フィーバーゲージ

//終了時のあれこれ
let finished;//既にfinish関数を呼び出した
let finishFadeId;//終了時のフェード
let finishTimerId;//終了時のタイマー
let fScore, fScoreFont;//最終的なスコア
let fRank, fRankFont;//最終的なランク
let pScore, pScoreFont;//素点
let cScore, cScoreFont;//コンボ加算スコア
let feScore, feScoreFont;//フィーバー加算スコア
let bBRect, bBText, bBTFont;//戻るボタン
let bBColG, bBColRect;//戻るボタンの当たり判定
let mAndBB;//マウスと戻るボタンの当たり判定

//プレイに関するデータ
let nowSound;
let nowNScore;//現在の譜面
let tPlaying;//曲が開始されているか
let nPlaying;//ノーツの方が開始されているか
let nowRank;//現在のランク
let nowCombo;//現在のコンボ数
let highCombo;
let nowHBeats;//現在半拍数
let nowNHBeats;//ノーツの現在半拍数
let nowNTTime;//ノーツ側での時間時間
let nowTTTime;//曲での時間
let TPHB;//半拍あたりの時間(ms)
let NDT;//ノートが表示される時間
let nSpeed;//ノーツの早さ
let pushedKey = {};
let pKFirstJudge = {};
let nLayer;//ノーツの描画させるレイヤー
let nowNotes = {};//現在画面上にあるノーツ
let nowLongNotes = {};//現在長押し中のロングノーツ
let notesReaction = {};//ノーツを押したタイミングによるリアクション
let NRFont;//ノーツのリアクションのフォント
let score;//ノーツの得点
let nowScore;//現在の得点
let fever;//現在のフィーバーゲージ


function ResetToPlay() {
    pScene = new Fortis.Scene();
    Fortis.Game.setScene(pScene);

    nowScore = 0;
    nowSound = new Fortis.SimpleSound(tunesInfo[nowSTIndex]["data"]);
    nowSound.setVolume(tunesInfo[nowSTIndex]["volume"]);
    nowNScore = JSON.parse(JSON.stringify(tunesInfo[nowSTIndex]["score"][nowSDifficulty]));;
    tPlaying = false;
    nowRank = "D";
    nowCombo = 0;
    highCombo = 0;
    nowHBeats = 0;
    nowNHBeats = 0;
    nowNTTime = 0;
    nowTTTime = 0;
    fever = 0;
    NDT = 1200;
    nSpeed = 1.2 * (Fortis.Game.canvasCfg.size.y / (NDT / 1000));
    finished = false;
    TPHB = Fortis.util.cleanFloat(60 * 1000 / tunesInfo[nowSTIndex]["BPM"] / 2, 5);
    score = {
        "normal": 300,
        "special": 500,
    }
    pushedKey = {
        "D": false,
        "F": false,
        "J": false,
        "K": false
    };
    pKFirstJudge = {
        "D": true,
        "F": true,
        "J": true,
        "K": true
    };
    nowNotes = {//{entity,type,length,timing}
        "D": [],
        "F": [],
        "J": [],
        "K": []
    };
    nowLongNotes = {//{start(hb):length}
        "D": {},
        "F": {},
        "J": {},
        "K": {}
    }
    let NRFont = new Fortis.Font("WDXL Lubrifont TC", 25);
    notesReaction = {
        "D": new Fortis.Entity(new Fortis.TextShape(NRFont, "Good"), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        "F": new Fortis.Entity(new Fortis.TextShape(NRFont, "Good"), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        "J": new Fortis.Entity(new Fortis.TextShape(NRFont, "Good"), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        "K": new Fortis.Entity(new Fortis.TextShape(NRFont, "Good"), new Fortis.ColorMaterial(new Fortis.Color("white"))),
    }
    notesReaction["D"].pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 40, Fortis.Game.canvasCfg.size.y * 32 / 40);
    notesReaction["F"].pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 40, Fortis.Game.canvasCfg.size.y * 32 / 40);
    notesReaction["J"].pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 21 / 40, Fortis.Game.canvasCfg.size.y * 32 / 40);
    notesReaction["K"].pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 27 / 40, Fortis.Game.canvasCfg.size.y * 32 / 40);

    UILayer = pScene.getUI();
    for (let key in notesReaction) {
        notesReaction[key].alpha = 0;
        UILayer.add(notesReaction[key]);
    }



    nLayer = pScene.getObj();

    //BGレイヤー
    {
        pBGLayer = pScene.getBG();

        NRR = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 5, Fortis.Game.canvasCfg.size.y, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 10, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(new Fortis.Color("black")));
        NRR.pos.x = Fortis.Game.canvasCfg.size.x * 3 / 20;
        NRR.alpha = 0.08;
        NRRF = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 5, Fortis.Game.canvasCfg.size.y, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 10, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        NRRF.pos.x = Fortis.Game.canvasCfg.size.x * 3 / 20;
        NRRF.alpha = 0.08;

        cPartition = new Fortis.Entity(new Fortis.LineShape(new Fortis.Vector2(null, Fortis.Game.canvasCfg.size.y)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        cPartition.pos.x = Fortis.Game.canvasCfg.size.x * 9 / 20;
        cPartition.alpha = 0.08;
        cPartition.material.thick = 3.5;
        lPartition = new Fortis.Entity(new Fortis.LineShape(new Fortis.Vector2(null, Fortis.Game.canvasCfg.size.y)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        lPartition.pos.x = Fortis.Game.canvasCfg.size.x * 6 / 20;
        lPartition.alpha = 0.08;
        lPartition.material.thick = 3.5;
        rPartition = new Fortis.Entity(new Fortis.LineShape(new Fortis.Vector2(null, Fortis.Game.canvasCfg.size.y)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
        rPartition.pos.x = Fortis.Game.canvasCfg.size.x * 12 / 20;
        rPartition.alpha = 0.08;
        rPartition.material.thick = 3.5;

        judgeRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 5, Fortis.Game.canvasCfg.size.y / 180, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 10, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(new Fortis.Color("white")));
        judgeRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 20, Fortis.Game.canvasCfg.size.y * 15 / 40);
        judgeRect.alpha = 0.4;
        judgeRect.material.thick = 3.5;

        laneTFont = new Fortis.Font("Noto Serif", 27);
        laneDText = new Fortis.Entity(new Fortis.TextShape(laneTFont, "D"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        laneDText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 40, Fortis.Game.canvasCfg.size.y * 19 / 20);
        laneDText.alpha = 0.6;
        laneFText = new Fortis.Entity(new Fortis.TextShape(laneTFont, "F"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        laneFText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 8, Fortis.Game.canvasCfg.size.y * 19 / 20);
        laneFText.alpha = 0.6;
        laneJText = new Fortis.Entity(new Fortis.TextShape(laneTFont, "J"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        laneJText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 21 / 40, Fortis.Game.canvasCfg.size.y * 19 / 20);
        laneJText.alpha = 0.6;
        laneKText = new Fortis.Entity(new Fortis.TextShape(laneTFont, "K"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        laneKText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 27 / 40, Fortis.Game.canvasCfg.size.y * 19 / 20);
        laneKText.alpha = 0.6;

        pBGLayer.addEntities([NRR, NRRF, cPartition, lPartition, rPartition, judgeRect, laneDText, laneFText, laneJText, laneKText]);

        feverGauge = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y * 4 / 5, new Fortis.Vector2(0, -Fortis.Game.canvasCfg.size.y * 2 / 5)), new Fortis.ColorMaterial(new Fortis.Color("#1709BE")));
        feverGauge.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y * 9 / 10);
        FeverGaugeChange();

        FGFrame = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y * 4 / 5), new Fortis.ColorMaterial(null, new Fortis.Color("#dbdbdb")));
        FGFrame.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y / 2);
        FGRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y * 4 / 5), new Fortis.ColorMaterial(new Fortis.Color("#191919")));
        FGRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y / 2);

        FGTFont = new Fortis.Font("Mochiy Pop One", 18);
        FGText = new Fortis.Entity(new Fortis.TextShape(FGTFont, "フィーバー"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        FGText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 14, Fortis.Game.canvasCfg.size.y * 19 / 20);

        scoreTFont = new Fortis.Font("Mochiy Pop One", 23);
        scoreText = new Fortis.Entity(new Fortis.TextShape(scoreTFont, "スコア"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        scoreText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 33 / 40, Fortis.Game.canvasCfg.size.y / 18);

        tScoreTFont = new Fortis.Font("Martian Mono", 25);
        tScoreText = new Fortis.Entity(new Fortis.TextShape(tScoreTFont, "0000000"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        tScoreText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 17 / 20, Fortis.Game.canvasCfg.size.y / 9);

        tRankTFont = new Fortis.Font("Yusei Magic", 55);
        tRankText = new Fortis.Entity(new Fortis.TextShape(tRankTFont, nowRank), new Fortis.ColorMaterial(new Fortis.Color("#C021E2")));
        tRankText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 16, Fortis.Game.canvasCfg.size.y / 5);
        rankChange(nowScore,tRankText);

        ComboTFont = new Fortis.Font("WDXL Lubrifont TC", 20);
        ComboText = new Fortis.Entity(new Fortis.TextShape(ComboTFont, "combo"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        ComboText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 16, Fortis.Game.canvasCfg.size.y / 2);

        tComboTFont = new Fortis.Font("Martian Mono", 65);
        tComboText = new Fortis.Entity(new Fortis.TextShape(tComboTFont, String(nowCombo)), new Fortis.ColorMaterial(new Fortis.Color("white")));
        tComboText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 7 / 8, Fortis.Game.canvasCfg.size.y * 13 / 32);

        /*
        nowSTIndex = 0;
        nowSDifficulty = 0;
        */
        tuneNameTFont = new Fortis.Font(tunesInfo[nowSTIndex]["font"], 15);
        tuneNameText = new Fortis.Entity(new Fortis.TextShape(tuneNameTFont, tunesInfo[nowSTIndex]["name"]), new Fortis.ColorMaterial(new Fortis.Color("white")));
        tuneNameText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 7 / 8, Fortis.Game.canvasCfg.size.y * 9 / 10);

        difficultyTFont = new Fortis.Font("Noto Serif", 12);
        difficultyText = new Fortis.Entity(new Fortis.TextShape(difficultyTFont, "difficulty"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        if (nowSDifficulty == 0) {
            difficultyText.material.fill = new Fortis.Color("#198191");
            difficultyText.shape.text = "NORMAL";
        } else {
            difficultyText.material.fill = new Fortis.Color("#802b25");
            difficultyText.shape.text = "HARD";
        }
        difficultyText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 7 / 8, Fortis.Game.canvasCfg.size.y * 19 / 20);

        pBGLayer.addEntities([FGRect, feverGauge, FGFrame, FGText, scoreText, tScoreText, tRankText, ComboText, tComboText, tuneNameText, difficultyText]);
    }


    //キーが押されたときに光る判定
    dJudgePRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 20, Fortis.Game.canvasCfg.size.y / 180, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 40, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
    dJudgePRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 20, Fortis.Game.canvasCfg.size.y * 15 / 40);
    dJudgePRect.alpha = 0;
    fJudgePRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 20, Fortis.Game.canvasCfg.size.y / 180, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 40, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
    fJudgePRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 6 / 20, Fortis.Game.canvasCfg.size.y * 15 / 40);
    fJudgePRect.alpha = 0;
    jJudgePRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 20, Fortis.Game.canvasCfg.size.y / 180, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 40, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
    jJudgePRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 20, Fortis.Game.canvasCfg.size.y * 15 / 40);
    jJudgePRect.alpha = 0;
    kJudgePRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 3 / 20, Fortis.Game.canvasCfg.size.y / 180, new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 3 / 40, Fortis.Game.canvasCfg.size.y / 2)), new Fortis.ColorMaterial(null, new Fortis.Color("white")));
    kJudgePRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 12 / 20, Fortis.Game.canvasCfg.size.y * 15 / 40);
    kJudgePRect.alpha = 0;

    fadeRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 2, Fortis.Game.canvasCfg.size.y * 2), new Fortis.ColorMaterial(new Fortis.Color("black")));

    sTNTFont = new Fortis.Font(tunesInfo[nowSTIndex]["font"], 50);
    sTNText = new Fortis.Entity(new Fortis.TextShape(sTNTFont, tunesInfo[nowSTIndex]["name"]), new Fortis.ColorMaterial(new Fortis.Color("white")));
    sTNText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 2 / 5);

    sTDTFont = new Fortis.Font("Noto Serif", 40);
    sTDText = new Fortis.Entity(new Fortis.TextShape(sTDTFont, "difficulty"), new Fortis.ColorMaterial(new Fortis.Color("white")));
    sTDText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 3 / 5);
    if (nowSDifficulty == 0) {
        sTDText.material.fill = new Fortis.Color("#198191");
        sTDText.shape.text = "NORMAL";
    } else {
        sTDText.material.fill = new Fortis.Color("#802b25");
        sTDText.shape.text = "HARD";
    }

    UILayer.addEntities([dJudgePRect, fJudgePRect, jJudgePRect, kJudgePRect, fadeRect, sTNText, sTDText]);
    fadeId = Fortis.TransitionManager.add(fadeRect, "alpha", 3000, 1, 0, Fortis.util.easing.inPower, 2);
    Fortis.TransitionManager.start(fadeId);
    sTNTId = Fortis.TransitionManager.add(sTNText, "alpha", 2400, 1, 0, Fortis.util.easing.inPower, 2);
    Fortis.TransitionManager.start(sTNTId);
    sTDTId = Fortis.TransitionManager.add(sTDText, "alpha", 2400, 1, 0, Fortis.util.easing.inPower, 2);
    Fortis.TransitionManager.start(sTDTId);

    startTimer = Fortis.Timer.add(6000, false, tuneStart);
    Fortis.Timer.start(startTimer);
    nStartTimer = Fortis.Timer.add(6000 - NDT, false, notesStart);
    Fortis.Timer.start(nStartTimer);
    nSTStartTime = performance.now();
}

function pUpdate(delta) {
    if (finished) {
        mouseCG.pos = Fortis.Game.mouse.pos.copy();
        if (Fortis.CollisionManager.get(mAndBB)["result"]) {
            if(Fortis.Game.mouse.fFrameatClick){
                location.reload();
            }
            bBRect.scale = new Fortis.Vector2(1.2, 1.2);
            bBText.scale = new Fortis.Vector2(1.2, 1.2);
        }else{
            bBRect.scale = new Fortis.Vector2(1, 1);
            bBText.scale = new Fortis.Vector2(1, 1);
        }
    }

    if (nPlaying) {
        nowNTTime += delta;
        nowNHBeats = nowNTTime / TPHB;
        let nowBRTime = nowNTTime % TPHB;//あまり時間
        notesUpdate(delta, nowNHBeats, nowBRTime);
        //keyPush(delta, nowNHBeats, nowBRTime);
    }

    if (tPlaying) {
        nowTTTime += delta;

        nowHBeats = nowTTTime / TPHB;
        let nowBRTime = nowTTTime % TPHB;//あまり時間

        //console.log(Fortis.util.cleanFloat(nowHBeats,1))
        if(Fortis.util.cleanFloat(nowHBeats,1)%1 == 0){
            console.log(Fortis.util.cleanFloat(nowHBeats,3))
        }

        keyPush(delta, nowHBeats, nowBRTime);

        if (nowSound.status) {//曲終了
            nPlaying = false;
            tPlaying = false;
            //console.log("finish");
            finishFadeId = Fortis.TransitionManager.add(fadeRect, "alpha", 2000, 0, 0.8, Fortis.util.easing.inPower, 2);
            Fortis.TransitionManager.start(finishFadeId);
            finishTimerId = Fortis.Timer.add(2200, false, finish);
            Fortis.Timer.start(finishTimerId);
        }
    }

    
}

function rankChange(ns,target){
    let sr = tunesInfo[nowSTIndex]["scoreRate"];
    let rank;
    if(sr[1]>=ns){
        rank = "D";
    }else if(sr[2]>=ns){
        rank = "C";
    }else if(sr[3]>=ns){
        rank = "B";
    }else if(sr[4]>=ns){
        rank = "A";
    }else if(sr[5]>=ns){
        rank = "AA";
    }else{
        rank = "S";
    }

    target.shape.text = rank;
    switch (rank) {
        case "D":
            target.material.fill = new Fortis.Color("#C021E2");
            break;
        case "C":
            target.material.fill = new Fortis.Color("#2181E2");
            break;
        case "B":
            target.material.fill = new Fortis.Color("#21E22E");
            break;
        case "AA":
        case "A":
            target.material.fill = new Fortis.Color("#F62222");
            break;
        case "S":
            target.material.fill = new Fortis.Color("#EBFE43");
            break;
    }
}

function tuneStart() {
    tPlaying = true;
    //console.log("now start" + nowNTTime)
    nowSound.play()
}

function notesStart() {
    nPlaying = true;
    nowNTTime = (6000 - NDT) - (performance.now() - nSTStartTime);
    //console.log("note start" + nowNTTime);
    //誤差を計算してその分だけ出現位置を少し変える
}

function notesUpdate(delta, nHB, nHBRT) {
    let hB = Math.trunc(nHB);
    for (let key in nowNScore) {
        if (nowNScore[key][hB] !== undefined) {
            let info = nowNScore[key][hB];
            let add = (nSpeed * nHBRT) / 1000;
            notesGene(key, info[0], info[1], add, hB);
            delete nowNScore[key][hB];
        }
    }

    for (let key in nowNotes) {

        /*
        let deleteCount = 0;
        for(let i in nowNotes[key]){
            if(nowNotes[key][i-deleteCount] == null){
                nowNotes[key].splice(i-deleteCount,1);
                deleteCount++;
            }
        }
            */
        for (let time in nowNotes[key]) {
            for (let e of nowNotes[key][time][0]) {
                e.pos.y += nSpeed * delta / 1000;
            }
            if (nowNotes[key][time][0].length == 1) {
                if (nowNotes[key][time][0][0].pos.y >= Fortis.Game.canvasCfg.size.y + nowNotes[key][time][0][0].shape.y) {
                    nLayer.remove(nowNotes[key][time][0][0]);
                    delete nowNotes[key][time];
                }
            } else {
                if (nowNotes[key][time][0][2].pos.y >= Fortis.Game.canvasCfg.size.y + nowNotes[key][time][0][2].shape.y) {
                    nLayer.remove(nowNotes[key][time][0][0]);
                    nLayer.remove(nowNotes[key][time][0][1]);
                    nLayer.remove(nowNotes[key][time][0][2]);
                    delete nowNotes[key][time];
                }
            }
        }
    }
}

function notesGene(key, length, type, add, nowHB) {//タイプ(ノーマル:false、スペシャル:true)
    let imgKey;

    let entities = [];
    if (length == 1) {
        imgKey = "c";
        imgKey += type ? "g" : "b";
        let entity = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.y / 10, Fortis.Game.canvasCfg.size.y / 10)), new Fortis.ImageMaterial(imgKey));
        if (key == "D") entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
        if (key == "F") entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
        if (key == "J") entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 21 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
        if (key == "K") entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 27 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
        entities.push(entity);
    } else {
        let distance = (length - 1) * TPHB * nSpeed / 1000;

        imgKey = "s";
        imgKey += type ? "g" : "b";

        let color = type ? "green" : "blue";

        let string = new Fortis.Entity(new Fortis.RectShape(0.8 * Fortis.Game.canvasCfg.size.y / 10, distance), new Fortis.ColorMaterial(new Fortis.Color(color)));
        string.alpha = 0.5;
        entities.push(string);

        let entity = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.y / 10, Fortis.Game.canvasCfg.size.y / 10)), new Fortis.ImageMaterial(imgKey));
        entities.push(entity);

        let entity2 = new Fortis.Entity(new Fortis.ImageShape(new Fortis.Vector2(Fortis.Game.canvasCfg.size.y / 10, Fortis.Game.canvasCfg.size.y / 10)), new Fortis.ImageMaterial(imgKey));
        entities.push(entity2);

        //ロングノーツセット
        nowLongNotes[key][nowHB] = [length, false, type];//ロングノーツは押されるとtrueになる

        //ノーツの位置設定
        switch (key) {
            case "D":
                string.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance / 2);
                entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
                entity2.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance);
                break;
            case "F":
                string.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance / 2);
                entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
                entity2.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 15 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance);
                break;
            case "J":
                string.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 21 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance / 2);
                entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 21 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
                entity2.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 21 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance);
                break;
            case "K":
                string.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 27 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance / 2);
                entity.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 27 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add);
                entity2.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 27 / 40, -2 * Fortis.Game.canvasCfg.size.y / 10 + add - distance);
                break;
        }
    }

    nowNotes[key][nowHB] = [entities, false, type];//falseは押されてるかどうか/typeは得点高めかどうか
    for (let e of entities) {
        nLayer.add(e);
    }
}

function keyPush(delta, nHB, nHBRT) {
    let judgeIndex = Math.round(nHB) + 1;
    let difference = Math.abs(nHB - judgeIndex + 1);

    if (Fortis.InputKey["KeyD"]) {
        dJudgePRect.alpha = 0.4;
        if (pKFirstJudge["D"]) {
            pKFirstJudge["D"] = false;
            pushedKey["D"] = true;
        } else {
            pushedKey["D"] = false;
        }
    } else {
        pKFirstJudge["D"] = true;
        dJudgePRect.alpha = 0;

        let time = Object.keys(nowLongNotes["D"]);
        if (time.length != 0) {
            if (judgeIndex > Number(time[0]) && !nowLongNotes["D"][time[0]][1]) {//ロングノーツの始めのタイミングなのに押されていない
                //console.log("ND")
                nowCombo = 0;
                changeCombo(nowCombo);
                delete nowLongNotes["D"][time[0]];
            } else if (nowLongNotes["D"][time[0]][1]) {//ロングノーツのが押されていた
                //console.log(judgeIndex, Number(time[0]) + nowLongNotes["D"][time[0]][0])
                if (judgeIndex + 1 == Number(time[0]) + nowLongNotes["D"][time[0]][0]) {//ピッタリ(成功)
                    //console.log("DOK")
                    nowCombo += nowLongNotes["D"][time[0]][0];
                    changeCombo(nowCombo);

                    changeReactionAndScore("D", difference, nowLongNotes["D"][time[0]][2], nowLongNotes["D"][time[0]][0]);

                    delete nowLongNotes["D"][time[0]];
                } else {//短すぎ＆長すぎ
                    //console.log("DBAD")
                    delete nowLongNotes["D"][time[0]];
                }
            }
        }
    }
    if (Fortis.InputKey["KeyF"]) {
        if (pKFirstJudge["F"]) {
            pKFirstJudge["F"] = false;
            pushedKey["F"] = true;
        } else {
            pushedKey["F"] = false;
        }
        fJudgePRect.alpha = 0.4;
    } else {
        pKFirstJudge["F"] = true;
        fJudgePRect.alpha = 0;

        let time = Object.keys(nowLongNotes["F"]);
        if (time.length != 0) {
            if (judgeIndex > Number(time[0]) && !nowLongNotes["F"][time[0]][1]) {//ロングノーツの始めのタイミングなのに押されていない
                //console.log("NJ")
                nowCombo = 0;
                changeCombo(nowCombo);
                delete nowLongNotes["F"][time[0]];
            } else if (nowLongNotes["F"][time[0]][1]) {//ロングノーツのが押されていた
                //console.log(judgeIndex, Number(time[0]) + nowLongNotes["J"][time[0]][0])
                if (judgeIndex + 1 == Number(time[0]) + nowLongNotes["F"][time[0]][0]) {//ピッタリ(成功)
                    //console.log("JOK")
                    nowCombo += nowLongNotes["F"][time[0]][0];
                    changeCombo(nowCombo);
                    changeReactionAndScore("F", difference, nowLongNotes["F"][time[0]][2], nowLongNotes["F"][time[0]][0]);
                    delete nowLongNotes["F"][time[0]];
                } else {//短すぎ＆長すぎ
                    //console.log("JBAJ")
                    delete nowLongNotes["F"][time[0]];
                }
            }
        }
    }
    if (Fortis.InputKey["KeyJ"]) {
        if (pKFirstJudge["J"]) {
            pKFirstJudge["J"] = false;
            pushedKey["J"] = true;
        } else {
            pushedKey["J"] = false;
        }
        jJudgePRect.alpha = 0.4;
    } else {
        pKFirstJudge["J"] = true;
        jJudgePRect.alpha = 0;
        let time = Object.keys(nowLongNotes["J"]);
        if (time.length != 0) {
            if (judgeIndex > Number(time[0]) && nowLongNotes["J"][time[0]][1] == false) {//ロングノーツの始めのタイミングなのに押されていない
                nowCombo = 0;
                changeCombo(nowCombo);
                delete nowLongNotes["J"][time[0]];
            } else if (nowLongNotes["J"][time[0]][1]) {//ロングノーツのが押されていた
                if (judgeIndex + 1 == Number(time[0]) + nowLongNotes["J"][time[0]][0]) {//ピッタリ(成功)
                    nowCombo += nowLongNotes["J"][time[0]][0];
                    changeCombo(nowCombo);
                    changeReactionAndScore("J", difference, nowLongNotes["J"][time[0]][2], nowLongNotes["J"][time[0]][0]);
                    delete nowLongNotes["J"][time[0]];
                } else {//短すぎ＆長すぎ
                    delete nowLongNotes["J"][time[0]];
                }
            }
        }
    }
    if (Fortis.InputKey["KeyK"]) {
        if (pKFirstJudge["K"]) {
            pKFirstJudge["K"] = false;
            pushedKey["K"] = true;
        } else {
            pushedKey["K"] = false;
        }
        kJudgePRect.alpha = 0.4;
    } else {
        pKFirstJudge["K"] = true;
        kJudgePRect.alpha = 0;
        let time = Object.keys(nowLongNotes["K"]);
        if (time.length != 0) {
            if (judgeIndex > Number(time[0]) && nowLongNotes["K"][time[0]][1] == false) {//ロングノーツの始めのタイミングなのに押されていない
                nowCombo = 0;
                changeCombo(nowCombo);
                delete nowLongNotes["K"][time[0]];
            } else if (nowLongNotes["K"][time[0]][1]) {//ロングノーツのが押されていた
                if (judgeIndex + 1 == Number(time[0]) + nowLongNotes["K"][time[0]][0]) {//ピッタリ(成功)
                    nowCombo += nowLongNotes["K"][time[0]][0];
                    changeCombo(nowCombo);
                    changeReactionAndScore("K", difference, nowLongNotes["K"][time[0]][2], nowLongNotes["K"][time[0]][0]);
                    delete nowLongNotes["K"][time[0]];
                } else {//短すぎ＆長すぎ
                    delete nowLongNotes["K"][time[0]];
                }
            }
        }
    }

    if (pushedKey["D"]) {
        if (nowNotes["D"][judgeIndex] !== undefined) {
            nowNotes["D"][judgeIndex][1] = true;
            nowCombo++;
            changeCombo(nowCombo);
            console.log(nHB);
            changeReactionAndScore("D", difference, nowNotes["D"][judgeIndex][2], 1);
        }

        if (nowLongNotes["D"][judgeIndex] !== undefined) {
            nowLongNotes["D"][judgeIndex][1] = true;
        }
    } else {
        if (nowNotes["D"][judgeIndex - 1] !== undefined) {
            if (nowNotes["D"][judgeIndex - 1][0].length == 1 && !nowNotes["D"][judgeIndex - 1][1]) {
                fever--;
                FeverGaugeChange();

                nowCombo = 0;
                changeCombo(nowCombo);
                notesReaction["D"].shape.text = "Miss";
                notesReaction["D"].material.fill = new Fortis.Color("#194CE0");
            }
        }
    }

    if (pushedKey["F"]) {
        if (nowNotes["F"][judgeIndex] !== undefined) {
            nowNotes["F"][judgeIndex][1] = true;
            nowCombo++;
            changeCombo(nowCombo);
console.log(nHB);
            changeReactionAndScore("F", difference, nowNotes["F"][judgeIndex][2], 1);
        }

        if (nowLongNotes["F"][judgeIndex] !== undefined) {
            nowLongNotes["F"][judgeIndex][1] = true;
        }
    } else {
        if (nowNotes["F"][judgeIndex - 1] !== undefined) {
            if (nowNotes["F"][judgeIndex - 1][0].length == 1 && !nowNotes["F"][judgeIndex - 1][1]) {
                fever--;
                FeverGaugeChange();

                nowCombo = 0;
                changeCombo(nowCombo);
                notesReaction["F"].shape.text = "Miss";
                notesReaction["F"].material.fill = new Fortis.Color("#194CE0");
            }
        }
    }

    if (pushedKey["J"]) {
        if (nowNotes["J"][judgeIndex] !== undefined) {
            nowNotes["J"][judgeIndex][1] = true;
            nowCombo++;
            changeCombo(nowCombo);
console.log(nHB);
            changeReactionAndScore("J", difference, nowNotes["J"][judgeIndex][2], 1);
        }

        if (nowLongNotes["J"][judgeIndex] !== undefined) {
            nowLongNotes["J"][judgeIndex][1] = true;
        }
    } else {
        if (nowNotes["J"][judgeIndex - 1] !== undefined) {
            if (nowNotes["J"][judgeIndex - 1][0].length == 1 && !nowNotes["J"][judgeIndex - 1][1]) {
                fever--;
                FeverGaugeChange();

                nowCombo = 0;
                changeCombo(nowCombo);
                notesReaction["J"].shape.text = "Miss";
                notesReaction["J"].material.fill = new Fortis.Color("#194CE0");
            }
        }
    }

    if (pushedKey["K"]) {
        if (nowNotes["K"][judgeIndex] !== undefined) {
            nowNotes["K"][judgeIndex][1] = true;
            nowCombo++;
            changeCombo(nowCombo);
console.log(nHB);
            changeReactionAndScore("K", difference, nowNotes["K"][judgeIndex][2], 1);
        }

        if (nowLongNotes["K"][judgeIndex] !== undefined) {
            nowLongNotes["K"][judgeIndex][1] = true;
        }
    } else {
        if (nowNotes["K"][judgeIndex - 1] !== undefined) {
            if (nowNotes["K"][judgeIndex - 1][0].length == 1 && !nowNotes["K"][judgeIndex - 1][1]) {
                fever--;
                FeverGaugeChange();

                nowCombo = 0;
                changeCombo(nowCombo);
                notesReaction["K"].shape.text = "Miss";
                notesReaction["K"].material.fill = new Fortis.Color("#194CE0");
            }
        }
    }
}

function changeCombo(combo) {
    tComboText.shape.text = combo;
    highCombo = Math.max(highCombo, combo);
}

function changeReactionAndScore(key, difference, type, length) {
    fever++;
    FeverGaugeChange();

    notesReaction[key].alpha = 0.5;
    let tmpScore = type ? score["special"] : score["normal"];//加算される得点
    let combo = 1 + nowCombo / 250;
    if (difference <= 0.05) {//パーフェクト
        notesReaction[key].shape.text = "Perfect";
        notesReaction[key].material.fill = new Fortis.Color("#DEE019");

        nowScore += tmpScore * 1.5 * length * combo;
    } else if (difference <= 0.15) {//グレート
        notesReaction[key].shape.text = "Great";
        notesReaction[key].material.fill = new Fortis.Color("#E0193A");

        nowScore += tmpScore * 1.2 * length * combo;
    } else if (difference <= 0.3) {//グッド
        notesReaction[key].shape.text = "Good";
        notesReaction[key].material.fill = new Fortis.Color("#4AE019");

        nowScore += tmpScore * length * combo;
    } else {//バッド
        notesReaction[key].shape.text = "Bad";
        notesReaction[key].material.fill = new Fortis.Color("#19D2E0");

        nowScore += tmpScore * 0.9 * length * combo;
    }

    nowScore = Fortis.util.cleanFloat(nowScore, -2);

    rankChange(nowScore,tRankText);

    tScoreText.shape.text = nowScore.toString().padStart(7, '0');
}

function FeverGaugeChange() {
    fever = Math.max(0, Math.min(fever, 100));
    let rate = fever / 100;
    feverGauge.shape.size.y = (Fortis.Game.canvasCfg.size.y * 4 / 5) * rate;

    if (rate <= 0.2) {
        feverGauge.material.fill = new Fortis.Color("#1709BE");
    } else if (rate <= 0.5) {
        feverGauge.material.fill = new Fortis.Color("#4AE019");
    } else if (rate <= 0.8) {
        feverGauge.material.fill = new Fortis.Color("#E0193A");
    } else {
        feverGauge.material.fill = new Fortis.Color("#DEE019");
    }
}

function finish() {
    finished = true;
    let comboAdd = highCombo * 100;
    let feverAdd = Fortis.util.cleanFloat(nowScore * (fever / 250));
    let finalScore = nowScore + comboAdd + feverAdd;

    //ハイスコアかの判定
    if(highScoreData[tunesInfo[nowSTIndex]["data"]][nowSDifficulty]<finalScore){
        highScoreData[tunesInfo[nowSTIndex]["data"]][nowSDifficulty] = finalScore;
        window.localStorage.setItem("highScore",JSON.stringify(highScoreData));
        confirm("おめでとう！端末のハイスコアを更新したよ！");
    }

    //最終スコア
    fScoreFont = new Fortis.Font("Martian Mono", 60);
    fScore = new Fortis.Entity(new Fortis.TextShape(fScoreFont, "合計：" + finalScore.toString().padStart(7, '0')), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        fScore.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 2 / 3);

    //ランク
    fRankFont = new Fortis.Font("Yusei Magic", 90);
    fRank = new Fortis.Entity(new Fortis.TextShape(fRankFont, "D"), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        fRank.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x * 9 / 10, Fortis.Game.canvasCfg.size.y * 2 / 3);
    rankChange(finalScore,fRank);

    //素点
    pScoreFont = new Fortis.Font("Martian Mono", 40);
    pScore = new Fortis.Entity(new Fortis.TextShape(pScoreFont, "素点：" + nowScore.toString().padStart(7, '0')), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        pScore.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 1 / 10);

    //コンボ加算
    pScoreFont = new Fortis.Font("Martian Mono", 40);
    cScore = new Fortis.Entity(new Fortis.TextShape(pScoreFont, "最高コンボ加算：" + comboAdd.toString().padStart(7, '0')), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        cScore.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 3 / 10);

    //フィーバー加算
    pScoreFont = new Fortis.Font("Martian Mono", 40);
    feScore = new Fortis.Entity(new Fortis.TextShape(pScoreFont, "フィーバー加算：" + feverAdd.toString().padStart(7, '0')), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        feScore.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 5 / 10);

    //戻るボタン
    bBRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x / 8, Fortis.Game.canvasCfg.size.y / 18), new Fortis.ColorMaterial(new Fortis.Color("#252525")));
    bBRect.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 5 / 6);
    bBTFont = new Fortis.Font("Yusei Magic", 22);
    bBText = new Fortis.Entity(new Fortis.TextShape(bBTFont, "戻る"), new Fortis.ColorMaterial(new Fortis.Color("white"))),
        bBText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y * 5 / 6);
    bBColG = new Fortis.ColliderGroup();
    bBColG.link(bBRect);
    bBColRect = new Fortis.RectCollider(Fortis.Game.canvasCfg.size.x / 8, Fortis.Game.canvasCfg.size.y / 18);
    bBColG.add(bBColRect);
    mAndBB = Fortis.CollisionManager.add(mouseCG, bBColG);

    UILayer.addEntities([fScore, fRank, pScore, cScore, feScore, bBRect, bBText]);
}