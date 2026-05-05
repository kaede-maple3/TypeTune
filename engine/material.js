Fortis.ColorMaterial = class {
    get type() {
        return "ColorMaterial";
    }
    constructor(fillColor, strokeColor) {
        if (fillColor != null) {
            if (!Fortis.util.checkType(fillColor, "object", "Color")) if (!fillColor.type.indexOf("Gradation")) return Fortis.error.ArgTypeWrong();
            this.fill = fillColor;
        } else {
            this.fill = false;
        }
        if (strokeColor != null) {
            if (!Fortis.util.checkType(strokeColor, "object", "Color")) if (!strokeColor.type.indexOf("Gradation")) return Fortis.error.ArgTypeWrong();
            this.stroke = strokeColor;
        } else {
            this.stroke = false;
        }
        this.thick = 5;
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
    getFillColor() {//塗りつぶしの色を取得
        return this.fill;
    }
    setFillColor(color) {//塗りつぶしの色を設定
        if (color == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(color, "object", "Color")) return Fortis.error.ArgTypeWrong();
        this.fill = color;
        return this.fill;
    }
    getStrokeColor() {//枠の色を取得
        return this.stroke;
    }
    setStrokeColor(color) {//枠の色を設定
        if (color == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(color, "object", "Color")) return Fortis.error.ArgTypeWrong();
        this.stroke = color;
        return this.stroke;
    }
    getThick() {//線の太さ取得
        return this.thick;
    }
    setThick(thick) {//線の太さ指定
        if (thick == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(thick, "number")) return Fortis.error.ArgTypeWrong();
        if (thick < 0) return Fortis.error.ArgIncorrectVarRange();
        this.thick = thick;
        return this.thick;
    }
}

Fortis.ImageMaterial = class {
    get type() {
        return "ImageMaterial";
    }
    constructor(imgKey) {
        if (imgKey == null) {
            this.key = "sample";
        } else {
            if (!Fortis.util.checkType(imgKey, "string")) return Fortis.error.ArgTypeWrong();
            this.key = imgKey;
        }
        let tmpImg = Fortis.ImageLoader.getImg(this.key);
        this.size = new Fortis.Vector2(tmpImg.width, tmpImg.height);
        tmpImg = null;
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
    setImageKey(key) {//画像を変更
        if (key == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(imgKey, "string")) return Fortis.error.ArgTypeWrong();
        this.key = imgKey;
        let tmpImg = Fortis.ImageLoader.getImg(this.key);
        this.size = new Fortis.Vector2(tmpImg.width, tmpImg.height);
        tmpImg = null;
        return img;
    }
    getImageKey() {//画像を取得
        return this.key;
    }
    getSize() {//画像のサイズを取得
        return this.size;
    }
}