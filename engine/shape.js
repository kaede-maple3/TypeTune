Fortis.LineShape = class {
    get type() {
        return "LineShape";
    }
    constructor(vec, distance) {
        if (vec != null) {
            if (!Fortis.util.checkType(vec, "object","Vector2")) return Fortis.error.ArgTypeWrong();
            this.vector = vec;
        } else {
            this.vector = new Fortis.Vector2(50,0);
        }
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getVector() {
        return this.vector;
    }
    setVector(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.vector = vec;
        return vec;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.RectShape = class {
    get type() {
        return "RectShape";
    }
    constructor(width, height, distance) {
        this.size = new Fortis.Vector2(30,30);
        if(width != null){
            if(!Fortis.util.checkType(width,"number"))return Fortis.error.ArgTypeWrong();
            if(width<=0)return Fortis.error.ArgIncorrectVarRange();
            this.size.x = width;
        }
        if(height != null){
            if(!Fortis.util.checkType(height,"number"))return Fortis.error.ArgTypeWrong();
            if(height<=0)return Fortis.error.ArgIncorrectVarRange();
            this.size.y = height;
        }
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getSize() {
        return this.size;
    }
    setSize(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.size = vec;
        return vec;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.CircleShape = class {
    get type() {
        return "CircleShape";
    }
    constructor(radius, distance) {
        if (radius == null) {
            this.radius = 20;
        } else {
            if (!Fortis.util.checkType(radius, "number")) return Fortis.error.ArgTypeWrong();
            if (radius <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.radius = radius;
        }
        this.degree = 360;
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getRadius() {//半径取得
        return this.radius;
    }
    setRadius(radius) {//半径変更
        if (radius == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(radius, "number")) return Fortis.error.ArgTypeWrong();
        if (radius <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.radius = radius;
        return radius;
    }
    getDegree() {//弧の角度取得
        return this.degree;
    }
    setDegree(degree) {//弧の角度変更
        if (degree == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(degree, "number")) return Fortis.error.ArgTypeWrong();
        if (degree <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.degree = degree;
        return degree;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.EllipseShape = class {
    get type() {
        return "EllipseShape";
    }
    constructor(radiusX, radiusY, distance) {
        let radX = 40;
        let radY = 20;
        if (radiusX != null) {
            if (!Fortis.util.checkType(radiusX, "number")) return Fortis.error.ArgTypeWrong();
            if (radiusX <= 0) return Fortis.error.ArgIncorrectVarRange();
            radX = radiusX;
        }
        if (radiusY != null) {
            if (!Fortis.util.checkType(radiusY, "number")) return Fortis.error.ArgTypeWrong();
            if (radiusY <= 0) return Fortis.error.ArgIncorrectVarRange();
            radY = radiusY;
        }
        this.radSize = new Fortis.Vector2(radX, radY);
        this.degree = 360;
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getRadSize() {
        return this.radSize;
    }
    setRadSize(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.radSize = vec;
        return vec;
    }
    getDegree() {//弧の角度取得
        return this.degree;
    }
    setDegree(degree) {//弧の角度変更
        if (degree == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(degree, "number")) return Fortis.error.ArgTypeWrong();
        if (degree <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.degree = degree;
        return this.degree;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.RegPolygonShape = class {
    get type() {
        return "RegPolygonShape";
    }
    constructor(type, radius, sides, distance) {
        this.radius = 25;
        this.sides = 3;
        this.vertices;

        if (radius != null) {
            if (!Fortis.util.checkType(radius, "number")) return Fortis.error.ArgTypeWrong();
            if (radius <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.radius = radius;
        }
        if (sides != null) {
            if (!Fortis.util.checkType(sides, "number")) return Fortis.error.ArgTypeWrong();
            if (sides <= 2) return Fortis.error.ArgIncorrectVarRange();
            this.sides = sides;
        }
        if (type == null) {//先に頂点を計算するか(trueならする、falseならしない、指定なしはtrue判定)
            this.vertices = this.getPolyVertices();
        } else if (type) {
            this.vertices = this.getPolyVertices();
        } else if (!type) {
            this.vertices = false;
        } else {
            Fortis.error.ArgTypeWrong();
        }
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getPolyVertices() {//正多角形の頂点の相対的な座標を出力
        let vertices = [];
        let angle_increment = 360 / this.sides;
        let a = angle_increment;
        let b = 360;
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        let gcd = a;
        let lcm = (angle_increment * 360) / gcd;
        let points = lcm / angle_increment;
        let angle = 270;
        vertices.push(Fortis.util.getPointOnCircle(new Fortis.Vector2(), this.radius, angle));
        for (let i = 1; i < points; i++) {
            angle += angle_increment;
            vertices.push(Fortis.util.getPointOnCircle(new Fortis.Vector2(), this.radius, angle));
        }
        return vertices;
    }
    getVertices() {//頂点取得
        return this.vertices;
    }
    getRadius() {//中心からの距離を取得
        return this.radius;
    }
    setRadius(raidus) {//中心からの距離を変更
        if (raidus == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(raidus, "number")) return Fortis.error.ArgTypeWrong();
        if (raidus <= 0) return Fortis.error.ArgIncorrectVarRange();
        this.radius = raidus;
        if (this.vertices != false) {
            this.vertices = this.getPolyVertices();
        }
        return raidus;
    }
    getSides() {//頂点の数を取得
        return this.sides;
    }
    setSides(sides) {//頂点の数を変更
        if (sides == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(sides, "number")) return Fortis.error.ArgTypeWrong();
        if (sides <= 2) return Fortis.error.ArgIncorrectVarRange();
        this.sides = sides;
        if (this.vertices != false) {
            this.vertices = this.getPolyVertices();
        }
        return sides;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.PolygonShape = class {
    get type() {
        return "PolygonShape";
    }
    constructor(vertices, distance) {
        if (vertices == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vertices, "object")) return Fortis.error.ArgTypeWrong();
        this.vertices = vertices;
        console.log(vertices)
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getVertices() {//頂点を取得
        return this.vertices;
    }
    setVertices(vertices) {//頂点を変更
        if (vertices == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vertices, "object")) return Fortis.error.ArgTypeWrong();
        this.vertices = vertices;
        return vertices;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.TextShape = class {
    get type() {
        return "TextShape";
    }
    constructor(font, text, distance) {
        if (font == null) {
            this.font = new Fortis.Font();
        } else {
            if (!Fortis.util.checkType(font, "object", "Font")) return Fortis.error.ArgTypeWrong();
            this.font = font;
        }
        if (text == null) {
            this.text = "Hello World.";
        } else {
            if (!Fortis.util.checkType(text, "string")) return Fortis.error.ArgTypeWrong();
            this.text = text;
        }
        this.direction = "inherit";
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    getText() {//テキスト取得
        return this.text;
    }
    setText(text) {//テキスト設定
        if (text == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(text, "string")) return Fortis.error.ArgTypeWrong();
        this.text = text;
        return this.text;
    }
    getFont() {//フォント取得
        return this.font;
    }
    setFont(font) {//フォント設定
        if (font == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(font, "object", "Font")) return Fortis.error.ArgTypeWrong();
        this.font = font;
        return this.font;
    }
    getDirection() {//フォント取得
        return this.direction;
    }
    setDirection(direction) {//フォント設定
        if (direction == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(direction, "string")) return Fortis.error.ArgTypeWrong();
        this.direction = direction;
        return this.direction;
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.ImageShape = class {
    get type() {
        return "ImageShape";
    }
    constructor(keyOrVec, distance) {//imgのkeyもしくはVector2を引数とする
        //サイズ
        if (keyOrVec == null) {
            this.size = new Fortis.Vector2(100, 100);
        } else if (Fortis.util.checkType(keyOrVec, "string")) {
            let tmpImg = Fortis.ImageLoader.getImg(keyOrVec);
            this.size = new Fortis.Vector2(tmpImg.width, tmpImg.height);
            tmpImg = null;
        } else if (Fortis.util.checkType(keyOrVec, "object", "Vector2")) {
            this.size = keyOrVec.copy();
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        this.clipPos;
        this.clipSize;
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    setSize(keyOrVec) {//サイズ変更
        if (keyOrVec == null) {
            this.size = new Fortis.Vector2(100, 100);
        } else if (Fortis.util.checkType(keyOrVec, "string")) {
            let tmpImg = Fortis.ImageLoader.getImg(keyOrVec);
            this.size = new Fortis.Vector2(tmpImg.width, tmpImg.height);
            tmpImg = null;
        } else if (Fortis.util.checkType(keyOrVec, "object", "Vector2")) {
            this.size = keyOrVec.copy();
        } else {
            return Fortis.error.ArgTypeWrong();
        }
        return this.size;
    }
    getSize() {//サイズ取得
        return this.size;
    }
    setClip(pos, size) {//画像クリップの情報を設定
        if (pos == null) {
            this.clipPos = new Fortis.Vector2();
        } else if (Fortis.util.checkType(pos, "object", "Vector2")) {
            this.clipPos = pos;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        if (size == null) {
            this.clipSize = new Fortis.Vector2();
        } else if (Fortis.util.checkType(size, "object", "Vector2")) {
            this.clipSize = size;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        return { pos: this.clipPos, size: this.clipSize };
    }
    getClip() {//クリップの情報を取得
        return { pos: this.clipPos, size: this.clipSize };
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}

Fortis.SpriteShape = class {
    get type() {
        return "SpriteShape";
    }
    constructor(imgKey, aspect, frameCount, size, distance) {//imgのkeyもしくはVector2を引数とする・aspectは画像を縦横に分割する数
        this.nowFrame = 1;//表示中のフレーム

        if (aspect == null) {
            this.aspect = new Fortis.Vector2(1, 1);
        } else if (Fortis.util.checkType(aspect, "object", "Vector2")) {
            this.aspect = aspect.copy();
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        if (frameCount == null) {
            this.frameCount = 1;
        } else if (Fortis.util.checkType(frameCount, "number")) {
            this.frameCount = frameCount;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        if (imgKey == null) {
            this.imgSize = new Fortis.Vector2(100, 100);
            let imgSizeCopy = this.imgSize.copy();
            this.clipSize = new Fortis.Vector2(imgSizeCopy.x * (1 / this.aspect.x), imgSizeCopy.y * (1 / this.aspect.y));
        } else if (Fortis.util.checkType(imgKey, "string")) {
            let tmpImg = Fortis.ImageLoader.getImg(imgKey);
            this.imgSize = new Fortis.Vector2(tmpImg.width, tmpImg.height);
            let imgSizeCopy = this.imgSize.copy();
            this.clipSize = new Fortis.Vector2(imgSizeCopy.x * (1 / this.aspect.x), imgSizeCopy.y * (1 / this.aspect.y));
            tmpImg = null;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        //サイズ
        if (size == null) {
            this.size = this.clipSize.copy()
        } else if (Fortis.util.checkType(size, "object", "Vector2")) {
            this.size = size.copy();
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        this.autoId;
        this.autoRange = [];

        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
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
    setSize(size) {//サイズ変更
        if (size == null) return Fortis.error.ArgNotExists();
        if (Fortis.util.checkType(size, "object", "Vector2")) {
            this.size = size.copy();
        } else {
            return Fortis.error.ArgTypeWrong();
        }
        return this.size;
    }
    getSize() {//サイズ取得
        return this.size;
    }
    setImgSize(imgKey) {//サイズ変更(画像のkeyを引数とする)
        if (imgKey == null) return Fortis.error.ArgNotExists();
        if (Fortis.util.checkType(imgKey, "string")) {
            let tmpImg = Fortis.ImageLoader.getImg(this.key);
            this.imgSize = new Fortis.Vector2(tmpImg.width, tmpImg.height);
            let imgSizeCopy = this.imgSize.copy();
            this.clipSize = new Fortis.Vector2(imgSizeCopy.x * (1 / this.aspect.x), imgSizeCopy.y * (1 / this.aspect.y));
        } else {
            return Fortis.error.ArgTypeWrong();
        }
        return this.imgSize;
    }
    getImgSize() {//サイズ取得
        return this.imgSize;
    }
    setAspect(aspect) {//アスペクト比を変更
        if (aspect == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(aspect, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.aspect = aspect;
        let imgSizeCopy = this.imgSize.copy();
        this.clipSize = new Fortis.Vector2(imgSizeCopy.x * (1 / this.aspect.x), imgSizeCopy.y * (1 / this.aspect.y));
        return aspect;
    }
    getAspect() {//アスペクト比を取得
        return this.aspect;
    }
    nextFrame() {//次のフレームへ
        this.nowFrame++;
        if(this.autoRange.length == 0){
            if (this.frameCount < this.nowFrame) this.nowFrame = 1;
        }else{
            if(this.autoRange[1]<this.nowFrame) this.nowFrame = this.autoRange[0];
        }
        return this.nowFrame;
    }
    backFrame() {//前のフレームへ
        this.nowFrame--;
        if(this.autoRange.length == 0){
            if (this.nowFrame < 1) this.nowFrame = this.frameCount;
        }else{
            if(this.autoRange[0]>this.nowFrame) this.nowFrame = this.autoRange[1];
        }
        return this.nowFrame;
    }
    set(number) {//フレームのジャンプ
        if (number == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(number, "number")) return Fortis.error.ArgTypeWrong();
        if (number < 1 || number > this.frameCount) return Fortis.error.ArgIncorrectVarRange();
        this.nowFrame = number;
        return this.nowFrame;
    }
    getNowFrame() {//現在のフレームを取得
        return this.nowFrame;
    }
    setRepeat(time, order,range) {//自動でアニメーション

        let animationOrder;
        if (order == null) {
            animationOrder = "nextFrame";
        } else if (Fortis.util.checkType(order, "boolean")) {
            if (order) {
                animationOrder = "nextFrame";
            } else {
                animationOrder = "backFrame";
            }
        } else {
            return Fortis.error.ArgTypeWrong();
        }
        if (time == null) {
            this.autoId = Fortis.Timer.add(1000, true, animationOrder, this);
        } else if (Fortis.util.checkType(time, "number")) {
            this.autoId = Fortis.Timer.add(time, true, animationOrder, this);
        }else{
            return Fortis.error.ArgTypeWrong();
        }

        if(range == null){
            this.autoRange = [];
        }else if(Fortis.util.checkType(range, "object")){
            if(range.length != 2)return Fortis.error.ArgTypeWrong();
            if(!Fortis.util.checkType(range[0], "number") || !Fortis.util.checkType(range[1], "number"))return Fortis.error.ArgTypeWrong();
            if(range[0]>=range[1] || range[0]<1 || range[0]>=this.frameCount || range[1]<=1 || range[1]>this.frameCount)return Fortis.error.ArgIncorrectVarRange();
            this.autoRange = range;
        }else{
            return Fortis.error.ArgTypeWrong();
        }
        return this.autoId;
    }
    deleteRepeat() {//自動アニメーションを削除
        Fortis.Timer.remove(this.autoId);
        this.autoRange = [];
    }
    start() {//自動アニメーション開始
        return Fortis.Timer.start(this.autoId);
    }
    stop() {//自動アニメーション停止
        return Fortis.Timer.stop(this.autoId);
    }
    reset() {//自動アニメーションリセット
        return Fortis.Timer.reset(this.autoId);
        this.autoRange = [];
    }
    getDistance() {
        return this.distance;
    }
    setDistance(vec) {
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        this.distance = vec;
        return vec;
    }
}