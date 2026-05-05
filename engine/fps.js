Fortis.Game.fpsCtrl = {
    //変数
    max: null,
    frameTime: null,
    fps: null,
    fpsAve: null,
    totalFps: null,
    totalTime: null,
    delta: null,
    frame: null,
    startTime: null,
    nowTime: null,
    lastTime: null,
    intervalTime: null,
    fpsCount: null,

    //関数
    init() {//初期化
        this.startTime = performance.now();
        this.lastTime = this.startTime;
        this.max = 60;
        this.frameTime = Math.floor((1000 / this.max) * 100) / 100;
        this.fpsAve = this.max;
        this.totalFps = 0;
        this.totalTime = 0;
        this.fpsCount = 0;
    },
    update() {//更新
        this.nowTime = performance.now();
        this.delta = this.nowTime - this.lastTime;
        this.lastTime = this.nowTime;
        //一秒経ったか
        if (this.nowTime - this.intervalTime >= 1000) {
            this.intervalTime = this.nowTime;
            this.fps = this.fpsCount;
            this.totalFps += this.fps;
            this.totalTime = this.nowTime - this.startTime;
            this.fpsAve = Math.floor(((this.fpsAve + this.fps) / 2) * 100) / 100;
            this.fpsCount = 0;
            //console.log(this.fps)
        } else {
            this.fpsCount++;
        }
        return this.delta;
    },
    getFPS() { return this.fps },//FPS取得
    getFPSAve() { return this.fpsAve },//平均FPS取得
    getTotalFPS() { return this.totalFps },//合計FPS取得
    getTotalTime() { return this.totalTime },//経過時間を取得(ms)
    getMaxFPS() { return this.max },//マックスFPSを取得
    setMaxFPS(value) {//マックスFPSを設定(整数じゃなくてもOK実質切り上げで計算される)
        if (value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
        if (value >= 0) return Fortis.error.ArgIncorrectVarRange();
        this.max = value;
        return this.max;
    }
}