Fortis.Color = class {
    get type() {
        return "Color";
    }
    constructor(hexOrR, g, b, a) {
        this.id = Fortis.util.randomID();
        this.r, this.g, this.b, this.a = 1;
        if (hexOrR == null) {//hexOrRが空なら、引数はなしで白にする判定
            this.r = 255, this.g = 255, this.b = 255;
            return true;
        } else if (g == null && b == null) {//カラーコード判定
            if (Fortis.util.checkType(hexOrR, "string", "#")) {//＃がついていたらかつ7文字ならカラーコードだとみなす
                if (hexOrR.length == 7) {
                    let RGB = Fortis.util.hexToRGB(hexOrR);
                    this.r = RGB.r;
                    this.g = RGB.g;
                    this.b = RGB.b;
                    return true;
                } else {
                    return Fortis.error.NotColorCode();
                }
            } else if (Fortis.util.checkType(hexOrR, "string")) {//名前付き色判定
                if (Fortis.util.namedColors[hexOrR] === undefined) {
                    return Fortis.error.KeyNotExistsInObject();
                } else {
                    this.r = Fortis.util.namedColors[hexOrR].r;
                    this.g = Fortis.util.namedColors[hexOrR].g;
                    this.b = Fortis.util.namedColors[hexOrR].b;
                    return true;
                }
            } else {
                return Fortis.error.NotColorCode();
            }
        } else if (Fortis.util.checkType(g, "number") && Fortis.util.checkType(b, "number")) {//RGBもしくはHSVもしくはRGBAの形
            if (hexOrR >= 0 && hexOrR <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {//RGB
                this.r = hexOrR;
                this.g = g;
                this.b = b;
            } else if (hexOrR >= 0 && hexOrR <= 360 && g >= 0 && g <= 1 && b >= 0 && b <= 1) {//HSV
                let RGB = Fortis.util.HSVToRGB({ h: hexOrR, s: g, v: b });
                this.r = RGB.r;
                this.g = RGB.g;
                this.b = RGB.b;
            }

            //aの処理
            if (a != null) {//RGBA
                if (Fortis.util.checkType(a, "number")) {
                    this.a = Math.max(0, Math.min(1, a));
                    return true;
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        } else {
            return Fortis.error.ArgTypeWrong();
        }
    }
    getType() {//タイプを取得
        return this.type;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
    getID() {//ID取得
        return this.id;
    }
    invert() {//反転
        this.r = 255 - this, r;
        this.g = 255 - this, g;
        this.b = 255 - this, b;
        return this;
    }
    getComplementaryColor() {//補色を取得
        return new Fortis.Color(255 - this, r, 255 - this, g, 255 - this, b);
    }
    adjustBrightness(variable) {//明るさ調節
        if (!Fortis.util.checkType(variable, "number")) return Fortis.error.ArgTypeWrong();
        this.r = Math.max(0, Math.min(255, this.r + variable));
        this.g = Math.max(0, Math.min(255, this.g + variable));
        this.b = Math.max(0, Math.min(255, this.b + variable));
        return this;
    }
    toHex() {//16進数変換
        return Fortis.util.RGBToHex({ r: this.r, g: this.g, b: this.b });
    }
    toHSV() {//HSV変換
        return Fortis.util.RGBToHSV({ r: this.r, g: this.g, b: this.b });
    }
    toRGB() {//RGB変換
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
    toRGBA() {//RGBA変換
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}

Fortis.GradationCore = class {
    constructor(pos) {//モードはtrueで先にグラデーション作成、falseでループ時毎回作成
        if (pos == null) {
            this.pos = new Fortis.Vector2(0, 0);
        } else {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            this.pos = pos;
        }
        this.color = [];
        this.gradation = null;
        this.ids = {};
    }
    getType() {//タイプ取得
        return this.type;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
    getPos() {//グラデーションの始点を取得
        return this.pos;
    }
    setPos(pos) {//グラデーションの始点の設定
        if (pos == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.pos = pos;
        this.gradation = this.make();
        return pos;
    }
    getIDs() {//ID取得
        return this.ids;
    }
    add(color, value, mode) {//色追加、valueは追加したい色の相対的な位置(0~1)。modeはaddColorsから呼び出された場合のみ
        if (color == null || value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(color, "object", "Color") || !Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
        if (value > 1 || value < 0) return Fortis.error.ArgIncorrectVarRange();
        if (this.ids[color.id] != undefined) return Fortis.error.ColorAlreadyExists();
        this.color.push({ "value": value, "color": color });
        this.ids[color.id] = true;
        if (mode == null) this.make();
        return this.color;
    }
    addColors(array) {//色を複数追加
        if (array == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(array, "object")) return Fortis.error.ArgTypeWrong();
        array.forEach(obj => {
            this.add(obj.color, obj.value, true);
        });
        this.gradation = this.make();
    }
    remove(color) {//色削除
        if (color == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(color, "object", "Color")) return Fortis.error.ArgTypeWrong();
        if (this.ids[color.id] === undefined) return Fortis.error.ColorNotExists();
        this.color.splice(this.ids[color.id], 1);
        delete this.ids[color.id];
        return this.color;
    }
    removeColors(array) {//色を複数削除
        if (array == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(array, "object")) return Fortis.error.ArgTypeWrong();
        array.forEach(color => {
            this.remove(color);
        });
    }
    getColor() {//色取得
        return this.color;
    }
    setColor(gradation) {//グラデーションに色を設定
        if (gradation == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(gradation, "object")) return Fortis.error.ArgTypeWrong();
        this.color.forEach(colorElement => {
            gradation.addColorStop(colorElement.value, colorElement.color.toRGBA());
        });
    }
}

Fortis.LinearGradation = class extends Fortis.GradationCore {
    get type() {
        return "LinearGradation";
    }
    constructor(pos, size) {
        super(pos);
        if (size == null) {
            this.size = new Fortis.Vector2(100, 100);
        } else {
            if (!Fortis.util.checkType(size, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            this.size = size;
        }
    }
    getType() {//タイプ取得
        return this.type;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
    getSize() {//サイズを取得
        return this.pos;
    }
    setSize(size) {//サイズを設定
        if (size == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(size, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.size = size;
        this.gradation = this.make();
        return size;
    }
    make() {//グラデーション作成
        let gradation = Fortis.Game.context.createLinearGradient(this.pos.x, this.pos.y, this.pos.x + this.size.x, this.pos.y + this.size.y);
        this.setColor(gradation);
        return gradation;
    }
}

Fortis.RadialGradation = class extends Fortis.GradationCore {
    get type() {
        return "RadialGradation";
    }
    constructor(pos, SRad, EPos, ERad) {
        super(pos);
        if (EPos == null) {
            this.EPos = new Fortis.Vector2(0, 0);
        } else {
            if (!Fortis.util.checkType(EPos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            this.EPos = EPos;
        }
        if (SRad == null) {
            this.SRadius = 100;
        } else {
            if (!Fortis.util.checkType(SRad, "number")) return Fortis.error.ArgTypeWrong();
            if (SRad <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.SRadius = SRad;
        }
        if (SRad == null) {
            this.ERadius = 100;
        } else {
            if (!Fortis.util.checkType(ERad, "number")) return Fortis.error.ArgTypeWrong();
            if (ERad <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.ERadius = ERad;
        }
    }
    getType() {//タイプ取得
        return this.type;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
    getStartRadius() {//最初の円の半径取得
        return this.SRadius;
    }
    setStartRadius(value) {//最初の円の半径を設定
        if (value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
        if (value <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.SRadius = value;
        this.gradation = this.make();
        return this.SRadius;
    }
    getEndRadius() {//最後の円の半径取得
        return this.ERadius;
    }
    setEndRadius(value) {//最後の円の半径を設定
        if (value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
        if (value <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.ERadius = value;
        this.gradation = this.make();
        return this.ERadius;
    }
    getEndPos() {//グラデーションの始点を取得
        return this.EPos;
    }
    setEndPos(pos) {//グラデーションの始点の設定
        if (pos == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.EPos = pos;
        this.gradation = this.make();
        return pos;
    }
    make() {//グラデーション作成
        let gradation = Fortis.Game.context.createRadialGradient(this.pos.x, this.pos.y, this.SRadius, this.EPos.x, this.EPos.y, this.ERadius);
        this.setColor(gradation);
        return gradation;
    }
}

Fortis.ConicGradation = class extends Fortis.GradationCore {
    get type() {
        return "ConicGradation";
    }
    constructor(pos, angle) {
        super(pos);
        if (angle == null) {
            this.SAngle = 0;
        } else {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            this.SAngle = angle;
        }
    }
    getType() {//タイプ取得
        return this.type;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
    getStartAngle() {//開始角度を取得
        return this.SAngle;
    }
    setStartAngle(value) {//開始角度を設定
        if (value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
        this.SAngle = value;
        this.gradation = this.make();
        return this.SAngle;
    }
    make() {//グラデーション作成
        let gradation = Fortis.Game.context.createConicGradient(Fortis.util.degreeToRadian(this.SAngle), this.pos.x, this.pos.y);
        this.setColor(gradation);
        return gradation;
    }
}