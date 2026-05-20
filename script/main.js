function Init() {
    Fortis.Game.config.debug = true;
    Fortis.Game.canvasCfg.size = new Fortis.Vector2(1200, 675);
    Fortis.Game.canvasCfg.BGColor = new Fortis.Color("#252525");
    Fortis.Game.canvasCfg.autoResize = false;

    Fortis.FontLoader.addFonts({
        "Anton": "https://fonts.googleapis.com/css2?family=Anton&display=swap",
        "Smooch Sans": "https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@450&display=swap",
        "Outfit": "https://fonts.googleapis.com/css2?family=Outfit:wght@450&display=swap",
        "Playwrite DK Loopet": "https://fonts.googleapis.com/css2?family=Playwrite+DK+Loopet&display=swap",
        "Inconsolata": "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
        "Kaisei Opti": "https://fonts.googleapis.com/css2?family=Kaisei+Opti&display=swap",
        "Yusei Magic": "https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap",
        "DotGothic16": "https://fonts.googleapis.com/css2?family=DotGothic16&display=swap",
        "Yuji Mai": "https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap",
        "Shippori Antique": "https://fonts.googleapis.com/css2?family=Shippori+Antique&display=swap",//ひらがな、カタカナのみ
        "Yuji Boku": "https://fonts.googleapis.com/css2?family=Yuji+Boku&display=swap",
        "Reggae One": "https://fonts.googleapis.com/css2?family=Reggae+One&display=swap",
        "Yuji Syuku": "https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap",
        "Kaisei Decol": "https://fonts.googleapis.com/css2?family=Kaisei+Decol&display=swap",
        "Rampart One": "https://fonts.googleapis.com/css2?family=Rampart+One&display=swap",
        "Noto Serif": "https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap",
        "Martian Mono": "https://fonts.googleapis.com/css2?family=Martian+Mono&display=swap",
        "Mochiy Pop One": "https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap",
        "WDXL Lubrifont TC": "https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+TC&display=swap",
        "Shippori Antique": "https://fonts.googleapis.com/css2?family=Shippori+Antique&display=swap",
        "Zen Maru Gothic": "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500&display=swap",
    });
    Fortis.ImageLoader.addImages({
        "cb": "./img/notes/cb.png",
        "cg": "./img/notes/cg.png",
        "sb": "./img/notes/sb.png",
        "sg": "./img/notes/sg.png",
        "tuneTxtBG": "./img/ui/tuneTxtBG.png",
        "tuneTxtBGselected": "./img/ui/tuneTxtBGselected.png",
        "ArrowRight":"./img/ui/ArrowRight.png",
    });

    Fortis.SoundLoader.addSimpleSounds({
        "sss": "./tune/sss.wav",
        "forElise": "./tune/forElise.wav",
        "bh": "./tune/bh.wav",
        "hal": "./tune/hal.wav",
        "kimigayo": "./tune/kimigayo.wav",
        "alps1": "./tune/alps1.wav",
    });

    Fortis.SoundLoader.addNormalSounds({
    })
}

let nowScene;
let localStorage;
let highScoreData;

function Ready() {
    //ローカルストレージ確認
    if (!window.localStorage) {
        console.log("localstorage非対応");
        localStorage = false;
    } else {
        console.log("localstorage対応");
        localStorage = true;
        highScoreData = window.localStorage.getItem("highScore");
        if(highScoreData == null){//ハイスコアデータが存在しない
            console.log("ハイスコアデータが存在しないため、初期化します");
            highScoreData = {
                "sss":[
                    0,0,0,0
                ],
                "bh":[
                    0,0,0,0
                ],
                "forElise":[
                    0,0,0,0
                ],
                "hal":[
                    0,0,0,0
                ],
                "kimigayo":[
                    0,0,0,0
                ],
                "alps1":[
                    0,0,0,0
                ],
            }
            window.localStorage.setItem("highScore",JSON.stringify(highScoreData));
        }else{
            console.log(highScoreData)
            highScoreData = JSON.parse(highScoreData);
        }
    }

    //タイトル

    nowScene = "title";
    title();


    //曲セレクト
    /*
    nowScene = "select";
    selectReset();
    */

    //プレイ
    /*
    nowScene = "play";
    ResetToPlay();
    */
}

function Update(delta) {
    switch (nowScene) {
        case "title":
            tUpdate(delta);
            break;
        case "select":
            sUpdate(delta);
            break;
        case "play":
            pUpdate(delta);
            break;
    }
}

function EngineLoaded() { }
