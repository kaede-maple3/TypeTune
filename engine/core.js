let Fortis = {
    //変数
    Game: null,//メインのゲームシステム
    TransitionManager: null,//エンティティのモーション(フェードなど)-animation.js
    InputKey: {},//キーインプット

    //便利なやつをまとめたもの-util.js(基本的に)
    util: {
        //変数
        namedColors: null,//名前付き色

        //関数
        console: null,//コンソール(ゲームの設定のデバッグがtrueでないと機能しない)
        checkType: null,//変数の型やタイプなどについてチェックする
        randomID: null,//ランダムにIDを作成
        degreeToRadian: null,//度数法から弧度法
        radianToDegree: null,//弧度法から度数法
        getPointOnCircle: null,//任意の座標を中心として任意の半径の円周上の任意の角度の点の座標を取得
        argAdjustmentWithDelta: null,//deltaを使って引数の時間に処理を完了するように調整する
        cleanFloat: null,//値の指定の小数点以下を切り捨てる(整理)
        getLineSegment: null,//2点の座標からそれを結んだ線分の情報を返す
        checkLinesCollide: null,//線分同士に交点があるかを求める
        checkEllipseAndLineCollide: null,//円と線分に交点があるかを求める
        checkCircleAndLineCollide: null,//円と線分に交点があるかを求める
        checkPolygonsCollide: null,//多角形の当たり判定(SATを使う)
        checkRectsCollide: null,//回転なしの矩形の当たり判定
        checkEllipsesCollide: null,//円同士の当たり判定
        checkCirclesCollide: null,//円同士の当たり判定

        //色
        hexToRGB: null,//カラーコードをRGBに
        HSVToRGB: null,//HSVをRGBに
        RGBToHex: null,//RGBをカラーコードに
        RGBToHSV: null,//RGBをHSVに

        //イージング関数-easing.js
        //名前は仮定
        easing: {
            //三角関数系
            inTrig: null,
            outTrig: null,
            inOutTrig: null,
            outInTrig: null,
            //累乗系
            inPower: null,
            outPower: null,
            inOutPower: null,
            outInPower: null,
            //指数関数系
            inExpo: null,
            outExpo: null,
            inOutExpo: null,
            outInExpo: null,
            //バック系
            inBack: null,
            outBack: null,
            inOutBack: null,
            outInBack: null,
            //円系
            inCirc: null,
            outCirc: null,
            inOutCirc: null,
            outInCirc: null,
            //バウンド系
            inBounce: null,
            outBounce: null,
            inOutBounce: null,
            outInBounce: null,
            //バネ系
            inSpring: null,
            outSpring: null,
            inOutSpring: null,
            outInSpring: null,
        },
    },

    //関数
    setup: null,//ファイルの読み込みが終わったときの処理
    loadMaterials: null,//素材の読み込み(今のところ画像とフォント)
    loadfail: null,//読み込み失敗時に再読み込みする。

    error: null,//エラーをまとめたもの-util.js
    info: null,//処理完了などのお知らせをまとめたもの-util.js

    //描画系の関数-draw.js
    draw: {
        line: null,//線
        rect: null,//矩形
        circle: null,//円(弧)
        ellipse: null,//楕円
        regPolygon: null,//正多角形
        polygon: null,//多角形
        text: null,//テキスト
        image: null,//画像
        setFillColor: null,//塗りつぶしの色をセット
        setStrokeColor: null,//枠塗りの色をセット
    },

    //クラス
    Vector2: null,//二次元配列(x,y)の形-vector.js

    Camera: null,//カメラ-scene.js

    Timer: null,//タイマー-timer.js

    //シーン関係+α-scene.js
    Scene: null,//シーン
    Layer: null,//レイヤー
    CRFunction: null,//CustomRenderFunctionの略。layerに追加して、エンジンの範囲でやりきれない処理をここで描けるようにする。

    //色-color.js
    Color: null,//色
    GradationCore: null,//グラデーションのコア
    LinearGradation: null,//線形グラデーション
    RadialGradation: null,//円形グラデーション
    ConicGradation: null,//扇形グラデーション

    Entity: null,//エンティティ-entity.js

    //マテリアル-material.js
    ColorMaterial: null,//カラーマテリアル
    ImageMaterial: null,//画像マテリアル

    //シェイプ-shape.js
    LineShape: null,//線
    RectShape: null,//矩形
    CircleShape: null,//円(弧)
    EllipseShape: null,//楕円
    RegPolygonShape: null,//正多角形
    PolygonShape: null,//多角形
    TextShape: null,//文字
    ImageShape: null,//画像
    SpriteShape: null,//スプライト(画像)

    //当たり判定-hitbox.js
    CollisionManager: null,//どのグループ同士の当たり判定を計算するかを管理(グループ3つ以上同時は不可)
    ColliderGroup: null,//複数のcolliderをまとめたもの。これの中にcolliderを入れて使う(colliderを単品では使えない)
    //Collider
    ProtoCollider: null,//プロトタイプ(これだけだと意味ない)
    LineCollider: null,//線分
    RectCollider: null,//矩形
    CircleCollider: null,//円(楕円)
    RegPolygonCollider: null,//正n角形
    PolygonCollider: null,//その他

    //フォント
    FontLoader: null,//フォントの読み込み・保存-font.js
    Font: null,//フォントの管理

    //画像
    ImageLoader: null,//画像の読み込み・保存-image.js

    //サウンド-sound.js
    SoundLoader: null,//サウンドの読み込み・保存
    SimpleSound: null,//Audio要素を使ったサウンドの管理
    NormalSound: null,//Web Audio APIを使ったサウンドの管理

    //コンテナ(画像合成も可能)
    EntityContainer: null,//コンテナ-entity.js
}

Fortis.setup = function () {
    Init();//ゲーム設定を想定
    Fortis.Game.init();//ゲームシステムの初期化。素材の読み込みの設定などもここでやる
    Fortis.loadMaterials()
        .then(() => {
            document.body.removeChild(nowLoadingText);
            Ready();//ゲームが初期化された後に実行
            if (Fortis.Game.config.loop) {//ゲームループをするか
                Fortis.info.StartGameLoop();
                Fortis.Game.loop();//ゲームループスタート
            } else {
                EngineLoaded();//エンジンが読み込まれた
            }
        })
        .catch((error) => {
            console.log(error)
            Fortis.loadfail();
        })
}

Fortis.loadMaterials = async function () {
    const functionNames = [Fortis.FontLoader.loadFonts(), Fortis.ImageLoader.loadImgs(), Fortis.SoundLoader.loadSimpleSounds(), Fortis.SoundLoader.loadNormalSounds(),];
    const promiseAll = await Promise.all(functionNames);
    return promiseAll;
}

Fortis.loadfail = function () {
    alert("エラーが発生したため、ページを再読み込みしてください。");
}

Fortis.Game = {
    //変数系
    canvas: null,//オフスクリーンキャンバス(エンジン外からのアクセスの便宜上この名前とする)
    context: null,//canvasのコンテキスト(名前の理由は同上)
    audioCtx: new AudioContext(),
    finalCanvas: null,//最終的に描画されるキャンバス
    finalContext: null,//finalCanvasのコンテキスト
    winSize: null,//ウィンドウのサイズ
    config: {//設定
        debug: false,//デバッグモード
        loop: true,//ゲームループをするか
    },
    canvasCfg: {
        initialSize: null,
        displayScaleRatio: null,
        aspect: null,
        size: null,
        autoResize: true,
        keepAspect: true,
        minSize: null,
        maxSize: null,
        BGColor: null,
    },
    fpsCtrl: null,//fps.js
    scene: null,//シーン
    mouse: {//マウス
        pos: null,
        movement: null,
        outsideOfCanvas: false,
        lClick: false,
        rClick: false,
        wClick: false,
        click: false,
        fFrameatClick: false,
        wheel: 0
    },

    //関数
    init() {//初期化
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        //オフスクリーンキャンバス
        this.canvas = new OffscreenCanvas(100, 100);
        this.context = this.canvas.getContext("2d");

        //最終的な描画キャンバス

        this.finalCanvas = document.createElement("canvas");
        this.finalContext = this.finalCanvas.getContext("2d");
        document.body.appendChild(this.finalCanvas);

        this.winSize = new Fortis.Vector2(document.documentElement.clientWidth, document.documentElement.clientHeight)

        //キャンバスの設定
        if (this.canvasCfg.aspect == null) {
            this.canvasCfg.aspect = new Fortis.Vector2(16, 9);
        }
        if (this.canvasCfg.minSize == null) {
            this.canvasCfg.minSize = new Fortis.Vector2(160, 90);
        }
        if (this.canvasCfg.maxSize == null) {
            this.canvasCfg.maxSize = new Fortis.Vector2(2400, 1350);
        }
        if (this.canvasCfg.size == null) {
            this.canvasCfg.size = new Fortis.Vector2(800, 450);
        }
        let tmpx = this.canvasCfg.size.y * this.canvasCfg.aspect.x / this.canvasCfg.aspect.y;
        if (tmpx > this.canvasCfg.size.x) {
            let y = this.winSize.x * this.canvasCfg.aspect.y / this.canvasCfg.aspect.x;
            this.canvasCfg.size.x = this.winSize.x;
            this.canvasCfg.size.y = y;
        } else {
            this.canvasCfg.size.x = tmpx;
            this.canvasCfg.size.y = this.canvasCfg.size.y;
        }
        if (this.canvasCfg.size.x < this.canvasCfg.minSize.x) this.canvasCfg.size.x = this.canvasCfg.minSize.x;
        if (this.canvasCfg.size.y < this.canvasCfg.minSize.y) this.canvasCfg.size.y = this.canvasCfg.minSize.y;
        if (this.canvasCfg.size.x > this.canvasCfg.maxSize.x) this.canvasCfg.size.x = this.canvasCfg.maxSize.x;
        if (this.canvasCfg.size.y > this.canvasCfg.maxSize.y) this.canvasCfg.size.y = this.canvasCfg.maxSize.y;

        this.canvasCfg.initialSize = this.canvasCfg.size.copy();

        this.canvasCfg.displayScaleRatio = new Fortis.Vector2(1, 1);

        if (this.canvasCfg.BGColor == null) {
            this.canvasCfg.BGColor = new Fortis.Color("#252525");
        }

        //キャンバスのサイズ
        this.canvas.width = this.canvasCfg.size.x;
        this.canvas.height = this.canvasCfg.size.y;
        this.finalCanvas.width = this.canvasCfg.size.x;
        this.finalCanvas.height = this.canvasCfg.size.y;

        //マウス
        this.mouse.pos = new Fortis.Vector2(0, 0);
        this.mouse.movement = new Fortis.Vector2(0, 0);

        //fps
        this.fpsCtrl.init();

        Fortis.info.SystemInitCompleted();

        //マウスを押した
        Fortis.Game.finalCanvas.addEventListener("mousedown", (e) => {
            Fortis.Game.mouse.click = true;
            switch (e.button) {
                case 0://左
                    Fortis.Game.mouse.lClick = true;
                    break;
                case 1://ホイール
                    Fortis.Game.mouse.wClick = true;
                    break;
                case 2://右
                    Fortis.Game.mouse.rClick = true;
                    break
            }
            Fortis.Game.mouse.fFrameatClick = true;
        });
        //マウスを離した
        Fortis.Game.finalCanvas.addEventListener("mouseup", (e) => {
            Fortis.Game.mouse.click = false;
            switch (e.button) {
                case 0://左
                    Fortis.Game.mouse.lClick = false;
                    break;
                case 1://ホイール
                    Fortis.Game.mouse.wClick = false;
                    break;
                case 2://右
                    Fortis.Game.mouse.rClick = false;
                    break
            }
        });

        //右クリでのメニュー表示禁止
        Fortis.Game.finalCanvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        //マウスが動いた
        Fortis.Game.finalCanvas.addEventListener("mousemove", (e) => {
            Fortis.Game.mouse.pos.x = e.offsetX;
            Fortis.Game.mouse.pos.y = e.offsetY;
            Fortis.Game.mouse.movement.x = e.movementX;
            Fortis.Game.mouse.movement.y = e.movementY;
        });

        //ホイールが動いた
        Fortis.Game.finalCanvas.addEventListener("wheel", (e) => {
            Fortis.Game.mouse.wheel = e.wheelDelta;
        });

        //マウスが範囲外に移動した
        Fortis.Game.finalCanvas.addEventListener("mouseout", (e) => {
            Fortis.Game.mouse.outsideOfCanvas = true;
            Fortis.Game.mouse.rClick = false;
            Fortis.Game.mouse.lClick = false;
            Fortis.Game.mouse.click = false;
            Fortis.Game.mouse.wClick = false;
        });
        //マウスが範囲外に移動した
        Fortis.Game.finalCanvas.addEventListener("mouseover", (e) => {
            Fortis.Game.mouse.outsideOfCanvas = false;
        });
    },
    resized(winX, winY) {
        this.winSize.x = winX;
        this.winSize.y = winY;
        if (this.canvasCfg.autoResize) {
            if (this.canvasCfg.keepAspect) {
                let tmpx = winY * this.canvasCfg.aspect.x / this.canvasCfg.aspect.y;
                if (tmpx > winX) {
                    let y = winX * this.canvasCfg.aspect.y / this.canvasCfg.aspect.x;
                    this.canvasCfg.size.x = winX;
                    this.canvasCfg.size.y = y;
                } else {
                    this.canvasCfg.size.x = tmpx;
                    this.canvasCfg.size.y = winY;
                }
            } else {
                this.canvasCfg.size.x = winX;
                this.canvasCfg.size.y = winY;
            }
            this.canvasCfg.displayScaleRatio.x = this.canvasCfg.size.x / this.canvasCfg.initialSize.x;
            this.canvasCfg.displayScaleRatio.y = this.canvasCfg.size.y / this.canvasCfg.initialSize.y;
        }

        //console.log(this.canvasCfg.displayScaleRatio)
        //this.canvas.width = this.canvasCfg.size.x;
        //this.canvas.height = this.canvasCfg.size.y;
        this.finalCanvas.width = this.canvasCfg.size.x;
        this.finalCanvas.height = this.canvasCfg.size.y;
        for (let layer of Fortis.Game.scene.layer) {
            if (!layer.camera.keepSize) {
                layer.camera.size = this.canvasCfg.size;
            }
            if(!layer.camera.keepDRange){
                layer.camera.displayRange = this.canvasCfg.size;
            }

            //layer.camera.canvas.width = this.canvasCfg.size.x;
            //layer.camera.canvas.height = this.canvasCfg.size.y;
        }
        //console.log("win:",this.winSize)
        //console.log("canvas:", this.canvasCfg.size)
        //mousePos.shape.text = "x:" + this.canvasCfg.size.x + ",y:" + this.canvasCfg.size.y
    },
    setScene(scene) {//シーン設定
        if (scene == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(scene, "object", "Scene")) return Fortis.error.ArgTypeWrong();
        this.scene = scene;
        return this.scene;
    },
    getScene() {//シーン取得
        return this.scene;
    },
    getConfig() {//設定取得
        return this.config;
    },
    setConfig(object) {//設定を変更
        if (object == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(object, "object")) return Fortis.error.ArgTypeWrong();
        for (let key in object) {
            if (Fortis.Game.config[key] !== undefined) Fortis.Game.config[key] = object[key];
        }
        return this.config;
    },

    //ゲームループ
    loop() {
        let delta = this.fpsCtrl.update();
        Update(delta);//更新
        Fortis.CollisionManager.detectCollision(delta);
        Fortis.Timer.update(delta);//タイマーの更新
        Fortis.TransitionManager.update(delta);//モーションマネージャーの更新
        this.draw(delta);

        //マウスの変数のリセット
        this.mouse.fFrameatClick = false;
        this.mouse.wheel = 0;

        requestAnimationFrame(this.loop.bind(this));//アニメーションループ
    },

    //描画
    draw: null,
}

//キーを押した
window.addEventListener("keydown", (e) => {
    Fortis.InputKey[e.code] = true;
    //console.log("down:", e.code)
});
//キーが離された
window.addEventListener("keyup", (e) => {
    Fortis.InputKey[e.code] = false;
    //console.log("up:",e.code)
});

//ウィンドウのリサイズ
window.addEventListener("resize", (e) => {
    if (Fortis.Game.canvasCfg.autoResize) {
        Fortis.Game.resized(document.documentElement.clientWidth, document.documentElement.clientHeight);
    }
})

//エラー吐いたら再読み込み
window.onerror = function () {
    Fortis.loadfail();
}
