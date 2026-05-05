Fortis.FontLoader = {
    fonts: {},

    loadFont(key) {//フォントのロード
        if (key == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(key, "string")) return Fortis.error.ArgTypeWrong();
        let url = Fortis.FontLoader.fonts[key];
        let newFont = document.createElement("link");
        document.head.appendChild(newFont);
        return new Promise((resolve, reject) => {
            newFont.onload = () => {
                Fortis.FontLoader.fonts[key] = newFont;
                Fortis.info.FontLoaded(key);
                resolve(true);
            }
            newFont.onerror = () => {
                Fortis.error.FontCouldntLoaded(key);
                reject(false);
            }
            newFont.href = url;
            newFont.rel = "stylesheet";
        })


    },

    loadFonts() {//フォントの複数ロード。配列で中にkeyとurlがあるオブジェクトを入れる。
        return new Promise((resolve, reject) => {
            async function promise() {
                let keys = Object.keys(Fortis.FontLoader.fonts);
                try {
                    const fonts = await Promise.all(keys.map(Fortis.FontLoader.loadFont));
                    //console.log("All images loaded successfully:", images);
                    return fonts; // 全ての画像オブジェクトがここに入ります
                } catch (error) {
                    //console.error("Error loading images:", error);
                    throw error; // エラーを伝播させる場合
                }
            }
            promise()
                .then(() => {//フォントのロードが終わった
                    resolve(true);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    },

    addFonts(object) {//フォントを追加
        if (object == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(object, "object")) return Fortis.error.ArgTypeWrong();
        for (let key in object) {
            let url = object[key];
            if (key == null || url == null) return Fortis.error.ArgNotExists();
            if (!Fortis.util.checkType(key, "string") || !Fortis.util.checkType(url, "string")) return Fortis.error.ArgTypeWrong();
            if (Fortis.FontLoader.fonts[key] !== undefined) return Fortis.error.ImgAlreadyExists(key);
            Fortis.FontLoader.fonts[key] = url;
        }
        return this.fonts;
    },

    getFont(key) {//フォントの取得
        if (key == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(key, "string")) return Fortis.error.ArgTypeWrong();
        if (this.fonts[key] === undefined) return Fortis.error.FontNotExists(key);
        return this.fonts[key];
    },

    deleteFont(key) {//フォントの削除
        if (key == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(key, "string")) return Fortis.error.ArgTypeWrong();
        if (this.fonts[key] === undefined) return Fortis.error.FontNotExists(key);
        document.head.removeChild(this.fonts[key])
        this.fonts.delete(key);
        return this.fonts;
    },

    getFontKeys() {//フォントのキーの取得
        return this.fonts.keys();
    },
    getFonts() {//全フォント取得
        let fonts = [];
        this.fonts.forEach(font => {
            fonts.push(font);
        });
        return font;
    }
}

//フォントファミリーについて「https://developer.mozilla.org/ja/docs/Web/CSS/font-family」「https://willcloud.jp/knowhow/font-family/」
Fortis.Font = class {
    get type() {
        return "Font";
    }
    constructor(family, size) {
        if (family == null) {
            this.family = "system-ui";
        } else {
            if (!Fortis.util.checkType(family, "string")) return Fortis.error.ArgTypeWrong();
            this.family = family;
        }
        if (size == null) {//ピクセル単位で指定
            this.size = 10;
        } else {
            if (!Fortis.util.checkType(size, "number")) return Fortis.error.ArgTypeWrong();
            if (size <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.size = size;
        }
        this.weight = "400";//normalは400。boldは700。単位なし数字だけで指定
        this.style = "normal";
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
    getFamily() {//フォントファミリーを取得
        return this.family;
    }
    setFamily(family) {//フォントファミリーを設定
        if (family == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(family, "string")) return Fortis.error.ArgTypeWrong();
        this.family = family;
        return this.family;
    }
    getSize() {//フォントサイズを取得
        return this.size;
    }
    setSize(size) {//フォントサイズを設定
        if (size == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(size, "number")) return Fortis.error.ArgTypeWrong();
        this.size = size;
        return this.size;
    }
    getWeight() {//文字の方向を取得
        return this.weight;
    }
    setWeight(weight) {//文字の方向を設定
        if (weight == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(weight, "number")) return Fortis.error.ArgTypeWrong();
        if (weight <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.weight = weight;
        return this.weight;
    }
    getStyle() {//スタイルを取得
        return this.style;
    }
    setStyle(style) {//スタイルを設定
        if (style == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(style, "string")) return Fortis.error.ArgTypeWrong();
        this.style = style;
        return this.style;
    }
    output(scale) {//出力 一旦Scaleを１とおく
        let Scale = scale == null ? 1: scale;
        return this.style + " " + this.weight + " " + this.size*Scale + "px " + this.family;
    }
}