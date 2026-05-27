let rScene, rBGLayer, rObjLayer, rUILayer, rBOLayer;
let rSceneSTime;
let rloRect, rLoID;//最初の暗転

let rTuneName, rDiff;//曲名、難易度を表示
let resultText;//左上のリザルトの文字
let communicatingText;//通信中のテキスト
let communicated, message;

let CAText, FAText, SText, FSText, RText;//素点、フィーバー・コンボ加点、最終スコア・ランク 
let scoreTMP;
let finalScore, finalRank, comboAdd, feverAdd;//最終スコア、ランク計算
let scoreActTrID, scoreActTimerID;//最終スコアの動きのやつ
let scoreActing;//最終スコアが動いているか

function resultReset() {
    rScene = new Fortis.Scene();
    Fortis.Game.setScene(rScene);
    rBGLayer = rScene.getBG();
    rObjLayer = rScene.getObj();
    rUILayer = rScene.getUI();

    rBOLayer = new Fortis.Layer();
    rScene.add(rBOLayer);

    scoreActing = 0;

    //アルファベット落下
    {
        letterFont = new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 27);
        letterSpnTimerId = Fortis.Timer.add(800, true, function () {
            setFallingLetterR();
        });
        Fortis.Timer.start(letterSpnTimerId);
    }

    //最初の暗転
    {
        rLoRect = new Fortis.Entity(new Fortis.RectShape(Fortis.Game.canvasCfg.size.x * 2, Fortis.Game.canvasCfg.size.y * 2), new Fortis.ColorMaterial(new Fortis.Color("black")));
        rLoRect.alpha = 0;
        rBOLayer.add(rLoRect);
        rLoID = Fortis.TransitionManager.add(rLoRect, "alpha", 800, 1, 0, Fortis.util.easing.inPower, 2);
        Fortis.TransitionManager.start(rLoID);
    }

    //曲名と難易度を表示
    {
        rTuneName = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font(tunesInfo[nowSelect]["font"], Fortis.Game.canvasCfg.size.y / 12), tunesInfo[nowSelect].name), new Fortis.ColorMaterial(new Fortis.Color("white")));
        rTuneName.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 10);

        rDiff = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 18), ["Easy", "Normal", "Hard", "Extra"][nowDifficulty]), new Fortis.ColorMaterial(new Fortis.Color(["#1da23e", "#1a679b", "#971b1b", "#70138f"][nowDifficulty])));
        rDiff.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 5.2);

        rUILayer.addEntities([rTuneName, rDiff]);
    }

    rSceneSTime = performance.now();

    //最終スコアなど計算
    {
        comboAdd = Math.floor(maxCombo * 100);
        feverAdd = Math.floor(score * fever / 4);
        finalScore = Math.floor(score + comboAdd + feverAdd);
    }

    //リザルトの文字
    {
        resultText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("WDXL Lubrifont TC", Fortis.Game.canvasCfg.size.y / 25), "リザルト"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        resultText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 16, Fortis.Game.canvasCfg.size.y / 22);
        rUILayer.add(resultText);
    }

    //スコアなどのエンティティ
    {
        SText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 18), "素点：" + score), new Fortis.ColorMaterial(new Fortis.Color("white")));
        SText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, Fortis.Game.canvasCfg.size.y / 3.5);
        SText.alpha = 0;
        CAText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 18), "コンボ加点：" + comboAdd), new Fortis.ColorMaterial(new Fortis.Color("white")));
        CAText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, SText.pos.y + Fortis.Game.canvasCfg.size.y / 8);
        CAText.alpha = 0;
        FAText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 18), "フィーバー加点：" + feverAdd), new Fortis.ColorMaterial(new Fortis.Color("white")));
        FAText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, CAText.pos.y + Fortis.Game.canvasCfg.size.y / 8);
        FAText.alpha = 0;
        scoreTMP = 0;
        FSText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 8), scoreTMP.toString().padStart(8, '0')), new Fortis.ColorMaterial(new Fortis.Color("white")));
        FSText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2 - Fortis.Game.canvasCfg.size.x / 6, FAText.pos.y + Fortis.Game.canvasCfg.size.y / 5.5);
        FSText.alpha = 0;
        RText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Anton", Fortis.Game.canvasCfg.size.y / 5), finalRank), new Fortis.ColorMaterial(new Fortis.Color("white")));
        RText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2 + Fortis.Game.canvasCfg.size.x / 6, FAText.pos.y + Fortis.Game.canvasCfg.size.y / 5.5);
        RText.alpha = 0;
        rankChange(finalScore, RText);

        rUILayer.addEntities([SText, CAText, FAText, FSText, RText]);
    }

    //通信中のテキスト
    {
        communicatingText = new Fortis.Entity(new Fortis.TextShape(new Fortis.Font("Zen Maru Gothic", Fortis.Game.canvasCfg.size.y / 18), "通信中...少しお待ちください。"), new Fortis.ColorMaterial(new Fortis.Color("white")));
        communicatingText.pos = new Fortis.Vector2(Fortis.Game.canvasCfg.size.x / 2, RText.pos.y + Fortis.Game.canvasCfg.size.y / 8);
        communicatingText.alpha = 0;
        rUILayer.add(communicatingText);
        communicated = false;
        fetch(gasURL, {
            method: "POST",
            body: JSON.stringify({
                type: "checkHighScore",
                score: finalScore,
                tuneIndex: nowSelect,
                diff: nowDifficulty,
            })
        })
            .then(res => res.json())
            .then(data => {
                communicated = true;
                message = data.message;
                //console.log(data.message);
            })
            .catch((error)=>{
                communicated = true;
                message="通信エラーが発生しました。";
                console.error(error);
            });
    }
}

function rUpdate(delta) {
    // 落下するアルファベットの更新
    for (let i = 0; i < fallingLetters.length; i++) {
        fallingLetters[i].pos.y += fallingLetters[i].speed * delta;
        // 画面外に出たら削除
        if (fallingLetters[i].pos.y > Fortis.Game.canvasCfg.size.y + 50) {
            rBGLayer.remove(fallingLetters[i]);
            fallingLetters.splice(i, 1);
            i--;
        }
    }

    if (scoreActing == 0) {//小分け
        let timeDelta = performance.now() - rSceneSTime;
        if (timeDelta >= 1200) {
            SText.alpha = 1;
            if (timeDelta >= 1600) {
                CAText.alpha = 1;
                if (timeDelta >= 2000) {
                    FAText.alpha = 1;
                    if (timeDelta >= 2400) {
                        FSText.alpha = 1;
                        scoreActTimerID = Fortis.Timer.add(1800, false, scoreFinish);
                        Fortis.Timer.start(scoreActTimerID);
                        scoreActing = 1;
                    }
                }
            }
        }
    } else if (scoreActing == 1) {//動作中
        scoreTMP += Math.floor(finalScore * (delta / 1800));
        if (scoreTMP > finalScore) {
            scoreActing = 2;
        }
        FSText.shape.text = scoreTMP.toString().padStart(7, '0');
    } else if (scoreActing == 2) {//終了
        scoreTMP = finalScore;
        FSText.shape.text = scoreTMP.toString().padStart(7, '0');
        RText.alpha = 1;
        communicatingText.alpha = 1;
        if (communicated) {
            scoreActing = 3;
            communicatingText.shape.text = message;
        }
    } else if (scoreActing == 3) {//ハイスコアかもの通信が終わった。
        if(Fortis.InputKey["Space"]){
            location.reload();
        }
    }

}

function lineEasing(t) {
    return t;
}

function scoreFinish() {
    scoreActing = 2;
    scoreTMP = finalScore;
}

function setFallingLetterR() {
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
    rBGLayer.add(letterEntity);
}
