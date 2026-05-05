Fortis.Vector2 = class {
    get type() {
        return "Vector2";
    }
    constructor(x, y) {
        //x要素の判定
        if (x == null) {
            this.x = 0;
        } else {
            if (Fortis.util.checkType(x, "number")) {
                this.x = x;
            } else {
                return Fortis.error.ArgTypeWrong();
            }
        }

        //y要素の判定
        if (y == null) {
            this.y = 0;
        } else {
            if (Fortis.util.checkType(y, "number")) {
                this.y = y;
            } else {
                return Fortis.error.ArgTypeWrong();
            }
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
    add(vec) {//足し算
        if (vec == null) return Fortis.error.ArgNotExists();
        if (Fortis.util.checkType(vec, "object", "Vector2")) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }
        return Fortis.error.ArgTypeWrong();
    }
    sub(vec) {//引き算
        if (vec == null) return Fortis.error.ArgNotExists();
        if (Fortis.util.checkType(vec, "object", "Vector2")) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }
        return Fortis.error.ArgTypeWrong();
    }
    mul(scale) {//掛け算
        if (scale == null) return Fortis.error.ArgNotExists();
        if (Fortis.util.checkType(scale, "number")) {
            this.x *= scale;
            this.y *= scale;
            return this;
        } else if (Fortis.util.checkType(scale, "object", "Vector2")) {
            this.x *= scale.x;
            this.y *= scale.y;
            return this;
        }
        return Fortis.error.ArgTypeWrong();
    }
    mag() {//大きさ、原点(左上)からの距離
        return Math.hypot(this.x, this.y);
    }
    normalize() {//単位ベクトルにする
        let mag = this.mag();
        let vec = this.copy();
        return vec.mul(1 / mag);

    }
    distance(vec) {//2点間の距離
        if (vec == null) return Fortis.error.ArgNotExists();
        if (Fortis.util.checkType(vec, "object", "Vector2")) {
            let distance = vec.copy();
            distance.sub(this);
            return Math.hypot(distance.x,distance.y);;
        }
        return Fortis.error.ArgTypeWrong();
    }
    getDegree() {//座標から角度を求める
        return Fortis.util.radianToDegree(Math.atan2(this.y, this.x));
    }
    cleanFloat(digit) {//小数点整理
        let digits = 0;
        if (digit != null) {
            if (!Fortis.util.checkType(digit, "number")) return Fortis.error.ArgTypeWrong();
            digits = digit;
        }
        this.x = Fortis.util.cleanFloat(this.x, digits);
        this.y = Fortis.util.cleanFloat(this.y, digits);
        return this;
    }
    rotate(angle,test){//現在の角度+angle度回転
        if(angle == null)return Fortis.error.ArgNotExists();
        if(!Fortis.util.checkType(angle,"number"))return Fortis.error.ArgTypeWrong();
        let vec = this.copy();
        this.x = vec.x*Math.cos(Fortis.util.degreeToRadian(angle))-vec.y*Math.sin(Fortis.util.degreeToRadian(angle));
        this.y = vec.x*Math.sin(Fortis.util.degreeToRadian(angle))+vec.y*Math.cos(Fortis.util.degreeToRadian(angle));
        this.cleanFloat(7);
        return vec;
    }
    copy() {//コピー
        return new Fortis.Vector2(this.x, this.y);
    }
    getNormal(){//法線ベクトルを取得
        let norm = this.normalize();
        return new Fortis.Vector2(-norm.y,norm.x);
    }
}