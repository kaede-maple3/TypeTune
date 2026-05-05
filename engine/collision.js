Fortis.CollisionManager = {
    list: {},//{id: {entity: [e1, e2], result: boolean}}
    alreadyUpdatedList: [],//すでにアップデートされた(ID)
    add(e1, e2) {//eはentityの略
        if (e1 == null || e2 == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(e1, "object", "ColliderGroup") || !Fortis.util.checkType(e2, "object", "ColliderGroup")) return Fortis.error.ArgTypeWrong();
        let id = Fortis.util.randomID();
        this.list[id] = { "entity": [e1, e2], "result": false };
        return id;
    },
    addList(array) {
        if (array == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(array, "object")) return Fortis.error.ArgTypeWrong();
        let ids = [];
        for (index in array) {
            ids.push(Fortis.CollisionManager.add(array[index][0], array[index][1]));
        }
        return ids;
    },
    remove(id) {
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.CollisionNotExists(id);
        delete this.list[id];
        return this.list;
    },
    removeAll(){
        this.list = {};
    },
    getList() {
        return this.list;
    },
    get(id) {
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return false
        return this.list[id];
    },
    getID() {
        return Object.keys(this.list)
    },
    detectCollision(delta) {//ここで計算する
        this.alreadyUpdatedList = [];
        for (let key in this.list) {
            this.list[key]["result"] = false;
            let c1 = this.list[key]["entity"][0];
            if (this.alreadyUpdatedList.indexOf(c1.id) == -1) {
                c1.update();
                this.alreadyUpdatedList.push(c1.id);
            }

            let c2 = this.list[key]["entity"][1];
            if (this.alreadyUpdatedList.indexOf(c2.id) == -1) {
                c2.update();
                this.alreadyUpdatedList.push(c2.id);
            }

            let judge = false;
            for (let c1Key in c1.colliders) {
                let c1c = c1.colliders[c1Key];
                for (let c2Key in c2.colliders) {
                    let c2c = c2.colliders[c2Key];
                    let c1v = [];
                    switch (c1c.type) {
                        case "LineCollider":
                            c1v = c1c.getVertices(c1.pos, c1.angle, c1.scale);
                            switch (c2c.type) {
                                case "LineCollider":
                                    let c2v = c2c.getVertices(c2.pos, c2.angle, c2.scale);
                                    if (Fortis.util.checkLinesCollide(Fortis.util.getLineSegment(c1v[0], c1v[1]), Fortis.util.getLineSegment(c2v[0], c2v[1]))) {
                                        this.list[key]["result"] = true;
                                        judge = true;
                                    };
                                    break;
                                case "CircleCollider":
                                    if (Fortis.util.checkEllipseAndLineCollide(Fortis.util.getLineSegment(c1v[0], c1v[1]), c2c.getInfo(c2.pos, c2.angle, c2.scale))) {
                                        this.list[key]["result"] = true;
                                        judge = true;
                                    };
                                    break;
                                default:
                                    if (Fortis.util.checkPolygonsCollide(c1c.getVertices(c1.pos, c1.angle, c1.scale), c2c.getVertices(c2.pos, c2.angle, c2.scale))) {
                                        this.list[key]["result"] = true;
                                        judge = true;
                                    };
                                    break;
                            }
                            break;
                        case "RectCollider":
                            c1v = c1c.getVertices(c1.pos, c1.angle, c1.scale)
                            switch (c2c.type) {
                                case "RectCollider":
                                    if (Fortis.util.checkPolygonsCollide(c1v, c2c.getVertices(c2.pos, c2.angle, c2.scale))) {
                                        this.list[key]["result"] = true;
                                        judge = true;
                                    };
                                    break;
                                case "CircleCollider":
                                    let rl = 4;//頂点の数
                                    let lines = [];
                                    for (let i = 0; i < rl; i++) {
                                        lines.push(Fortis.util.getLineSegment(c1v[i], c1v[(i + 1) % rl]));
                                    }
                                    for (let line of lines) {
                                        if (Fortis.util.checkEllipseAndLineCollide(line, c2c.getInfo(c2.pos, c2.angle, c2.scale))) {
                                            this.list[key]["result"] = true;
                                            judge = true;
                                            break;
                                        };
                                    }

                                    break;
                                default:
                                    if (Fortis.util.checkPolygonsCollide(c1v, c2c.getVertices(c2.pos, c2.angle, c2.scale))) {
                                        this.list[key]["result"] = true;
                                        judge = true;
                                    };
                                    break
                            }
                            break;
                        case "CircleCollider":
                            switch (c2c.type) {
                                case "CircleCollider":
                                    let c1cInfo = c1c.getInfo(c1.pos, c1.angle, c1.scale);
                                    let c2cInfo = c2c.getInfo(c2.pos, c2.angle, c2.scale);
                                    if (c1cInfo["radius"].x == c1cInfo["radius"].y && c2cInfo["radius"].x == c2cInfo["radius"].y) {
                                        if (Fortis.util.checkCirclesCollide(c1cInfo, c2cInfo)) {
                                            this.list[key]["result"] = true;
                                            judge = true;
                                            break;
                                        }
                                    } else {
                                        if (Fortis.util.checkEllipsesCollide(c1cInfo, c2cInfo)) {
                                            this.list[key]["result"] = true;
                                            judge = true;
                                            break;
                                        }
                                    }

                                    //console.log("a")
                                    /*
                                    
                                    let radiusRot1 = Fortis.util.cleanFloat(c1cInfo["radius"].x/c1cInfo["radius"].y,7);
                                    let radiusRot2 = Fortis.util.cleanFloat(c2cInfo["radius"].x/c2cInfo["radius"].y,7);
                                    if(radiusRot1 == radiusRot2){

                                    }
                                    */
                                    break;
                                default:
                                    let c2v = c2c.getVertices(c2.pos, c2.angle, c2.scale);
                                    let vl = c2v.length;//頂点の数
                                    let lines = [];
                                    for (let i = 0; i < vl; i++) {
                                        lines.push(Fortis.util.getLineSegment(c2v[i], c2v[(i + 1) % vl]));
                                    }
                                    for (let line of lines) {
                                        if (Fortis.util.checkEllipseAndLineCollide(line, c1c.getInfo(c1.pos, c1.angle, c1.scale))) {
                                            this.list[key]["result"] = true;
                                            judge = true;
                                            break;
                                        };
                                    }
                                    break;
                            }
                            break;
                        default://その他(polygonたち2つ)
                            c1v = c1c.getVertices(c1.pos, c1.angle, c1.scale);
                            switch (c2c.type) {
                                case "CircleCollider":
                                    let vl = c1v.length;//頂点の数
                                    let lines = [];
                                    for (let i = 0; i < vl; i++) {
                                        lines.push(Fortis.util.getLineSegment(c1v[i], c1v[(i + 1) % vl]));
                                    }
                                    for (let line of lines) {
                                        if (Fortis.util.checkEllipseAndLineCollide(line, c2c.getInfo(c2.pos, c2.angle, c2.scale))) {
                                            this.list[key]["result"] = true;
                                            judge = true;
                                            break;
                                        };
                                    }
                                    break;
                                default:
                                    if (Fortis.util.checkPolygonsCollide(c1v, c2c.getVertices(c2.pos, c2.angle, c2.scale))) {
                                        this.list[key]["result"] = true;
                                        judge = true;
                                    };
                                    break;
                            }
                            break;
                    }
                    if (judge) {
                        break;
                    }
                }
                if (judge) {
                    break;
                }
            }
        }
    }
}

Fortis.ColliderGroup = class {
    get type() {
        return "ColliderGroup";
    }
    constructor() {
        this.id = Fortis.util.randomID();
        this.pos = new Fortis.Vector2();
        this.scale = new Fortis.Vector2(1, 1);
        this.angle = 0;
        this.colliders = {};
        this.entity = null;
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
    getID() {
        return this.id;
    }
    getPos() {//位置取得
        return this.pos;
    }
    setPos(vec) {//位置設定
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        return this.pos = vec.copy();
    }
    getScale() {//拡大縮小率を取得
        return this.scale;
    }
    setScale(value) {//拡大縮小率を変更
        if (value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(value, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        if (value.x < 0 || value.y < 0) return Fortis.error.ArgIncorrectVarRange();
        this.scale = value;
        return this.scale;
    }
    getAngle() {//角度取得
        return this.angle;
    }
    setAngle(new_angle) {//角度を変える
        if (new_angle == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(new_angle, "number")) return Fortis.error.ArgTypeWrong();
        this.angle = new_angle;
        return this.angle;
    }
    add(collider) {
        if (collider == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(collider, "object", "Collider")) return Fortis.error.ArgTypeWrong();
        if (this.colliders[collider.id] !== undefined) return Fortis.error.ColliderAlreadyExists(collider.id);
        this.colliders[collider.id] = collider;
        return collider;
    }
    addList(list) {
        if (list == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(list, "object")) return Fortis.error.ArgTypeWrong();
        for (let col in list) {
            this.add(list[col]);
        }
    }
    remove(collider) {
        if (collider == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(collider, "object", "Collider")) return Fortis.error.ArgTypeWrong();
        if (this.colliders[collider.id] === undefined) return Fortis.error.ColliderNotExists(collider.id);
        this.colliders[collider.id] = null;
        delete this.colliders[collider.id];
        return collider;
    }
    removeList(list) {
        if (list == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(list, "object")) return Fortis.error.ArgTypeWrong();
        for (col in list) {
            this.remove(list[col]);
        }
    }
    get(id) {
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.colliders[id] === undefined) return false;
        return this.colliders[id]
    }
    getAll() {
        return this.colliders;
    }
    link(entity) {
        if (entity == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(entity, "object", "Entity")) return Fortis.error.ArgTypeWrong();
        this.entity = entity;
        return entity;
    }
    update() {
        if (this.entity != null) {
            this.angle = this.entity.angle;
            this.pos = this.entity.pos.copy();
            this.scale = this.entity.scale.copy();
        }
    }
    unlink(entity) {
        if (entity == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(entity, "object", "Entity")) return Fortis.error.ArgTypeWrong();
        if (entity.id != this.entity.id) return false;
        this.entity = null;
    }
}

Fortis.ProtoCollider = class {
    constructor(distance) {
        this.id = Fortis.util.randomID();
        if (distance == null) {
            this.distance = new Fortis.Vector2();
        } else if (Fortis.util.checkType(distance, "object", "Vector2")) {
            this.distance = distance;
        } else {
            Fortis.error.ArgTypeWrong();
        }
        this.activity = true;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
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
    getActivity() {
        return this.activity;
    }
    reverseAvtivity() {
        if (this.activity) {
            this.activity = false;
        } else {
            this.activity = true;
        }
        return this.activity;
    }
    getID() {
        return this.id;
    }
}

Fortis.LineCollider = class extends Fortis.ProtoCollider {
    get type() {
        return "LineCollider";
    }
    constructor(vec, distance) {
        super(distance);
        if (vec != null) {
            if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            this.vector = vec;
        } else {
            this.vector = new Fortis.Vector2(50, 0);
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
    getVertices(pos, angle, scale) {
        let Pos = new Fortis.Vector2();
        let Angle = 0;
        let Scale = new Fortis.Vector2(1, 1);
        if (pos != null) {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Pos = pos.copy();
        }
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            Angle = angle;
        }
        if (scale != null) {
            if (!Fortis.util.checkType(scale, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Scale = scale.copy();
        }

        let fVertice = this.distance.copy();
        fVertice.mul(Scale);
        fVertice.rotate(Angle);
        fVertice.add(Pos);

        let sVertice = this.vector.copy();
        sVertice.mul(Scale);
        sVertice.rotate(Angle);
        sVertice.add(fVertice);

        return [fVertice, sVertice];
    }
}

Fortis.RectCollider = class extends Fortis.ProtoCollider {
    get type() {
        return "RectCollider";
    }
    constructor(width, height, angle, distance) {
        super(distance);
        this.size = new Fortis.Vector2(30, 30);
        this.angle = 0;
        if (width != null) {
            if (!Fortis.util.checkType(width, "number")) return Fortis.error.ArgTypeWrong();
            if (width <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.size.x = width;
        }
        if (height != null) {
            if (!Fortis.util.checkType(height, "number")) return Fortis.error.ArgTypeWrong();
            if (height <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.size.y = height;
        }
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            this.angle = angle;
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
    getAngle() {
        return this.angle;
    }
    setAnlge(angle) {
        if (angle == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
        this.angle = angle;
        return angle;
    }
    getInfo(pos, angle, scale, direction) {//directionはboolean。falseでサイズをそのまま返し、trueで逆にする
        let Pos = new Fortis.Vector2();
        let Angle = 0;
        let Scale = new Fortis.Vector2(1, 1);
        if (pos != null) {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Pos = pos.copy();
        }
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            Angle = angle;
        }
        if (scale != null) {
            if (!Fortis.util.checkType(scale, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Scale = scale.copy();
        }
        let cPos = Pos.copy().add(this.distance.copy().mul(Scale).rotate(this.angle)).rotate(Angle);

        let d = false;
        if (direction != null) {
            if (!Fortis.util.checkType(direction, "boolean")) return Fortis.error.ArgTypeWrong();
            d = direction;
        }

        let size = this.size.copy();
        if (d) {
            let tmpSize = size.copy();
            size.x = tmpSize.y;
            size.y = tmpSize.x;
        }
        return { "size": size, "pos": cPos };
    }
    getVertices(pos, angle, scale) {
        let Pos = new Fortis.Vector2();
        let Angle = 0;
        let Scale = new Fortis.Vector2(1, 1);
        if (pos != null) {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Pos = pos.copy();
        }
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            Angle = angle;
        }
        if (scale != null) {
            if (!Fortis.util.checkType(scale, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Scale = scale.copy();
        }

        let tmpLUVPos = this.size.copy().mul(-0.5);
        tmpLUVPos.rotate(this.angle);//矩形自体の回転
        //console.log(tmpLUVPos)
        tmpLUVPos.add(this.distance);
        tmpLUVPos.rotate(Angle);//グループの回転
        let LUVertice = Pos.copy().add(tmpLUVPos.mul(Scale));

        let tmpLDVPos = this.size.copy().mul(new Fortis.Vector2(-0.5, 0.5));
        tmpLDVPos.rotate(this.angle);//矩形自体の回転
        tmpLDVPos.add(this.distance);
        //console.log(this.distance)
        tmpLDVPos.rotate(Angle);//グループの回転
        let LDVertice = Pos.copy().add(tmpLDVPos.mul(Scale));

        let tmpRDVPos = this.size.copy().mul(0.5);
        tmpRDVPos.rotate(this.angle);//矩形自体の回転
        tmpRDVPos.add(this.distance);
        tmpRDVPos.rotate(Angle);//グループの回転
        let RDVertice = Pos.copy().add(tmpRDVPos.mul(Scale));

        let tmpRUVPos = this.size.copy().mul(new Fortis.Vector2(0.5, -0.5));
        tmpRUVPos.rotate(this.angle);//矩形自体の回転
        tmpRUVPos.add(this.distance);
        tmpRUVPos.rotate(Angle);//グループの回転
        let RUVertice = Pos.copy().add(tmpRUVPos.mul(Scale));

        return [LUVertice, LDVertice, RDVertice, RUVertice];
    }
}

Fortis.CircleCollider = class extends Fortis.ProtoCollider {
    get type() {
        return "CircleCollider";
    }
    constructor(radX, radY, angle, distance) {
        super(distance);
        this.radSize = new Fortis.Vector2(40, 20);
        this.angle = 0;
        if (radX != null) {
            if (!Fortis.util.checkType(radX, "number")) return Fortis.error.ArgTypeWrong();
            if (radX <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.radSize.x = radX;
            this.radSize.y = radX;
        }
        if (radY != null) {
            if (!Fortis.util.checkType(radY, "number")) return Fortis.error.ArgTypeWrong();
            if (radY <= 0) return Fortis.error.ArgIncorrectVarRange();
            this.radSize.y = radY;
        }
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            this.angle = angle;
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
    getAngle() {
        return this.angle;
    }
    setAnlge(angle) {
        if (angle == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
        this.angle = angle;
        return angle;
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
    getInfo(pos, angle, scale) {
        let Pos = new Fortis.Vector2();
        let Angle = 0;
        let Scale = new Fortis.Vector2(1, 1);
        if (pos != null) {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Pos = pos.copy();
        }
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            Angle = angle;
        }
        if (scale != null) {
            if (!Fortis.util.checkType(scale, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Scale = scale.copy();
        }
        let cInfo = {};
        cInfo["pos"] = Pos.copy().add(this.distance.copy().rotate(this.angle).mul(Scale)).rotate(Angle);
        cInfo["angle"] = Angle + this.angle;
        cInfo["radius"] = this.radSize.copy().mul(Scale);
        /*
        let radiusPS = Math.pow(cInfo["radius"].x*cInfo["radius"]*y,2);
        cInfo["formula"] = {//=1の形
                            "x2":Math.pow(cInfo["radius"].y*Math.cos(Fortis.util.degreeToRadian(cInfo["angle"])),2)+Math.pow(cInfo["radius"].x*Math.sin(Fortis.util.degreeToRadian(cInfo["angle"])),2)/radiusPS,
                            "xy":Math.sin(2*Fortis.util.degreeToRadian(cInfo["angle"]))*(Math.pow(cInfo["radius"].x,2)-Math.pow(cInfo["radius"].y,2))/radiusPS,
                            "y2":Math.pow(cInfo["radius"].x*Math.cos(Fortis.util.degreeToRadian(cInfo["angle"])),2)+Math.pow(cInfo["radius"].y*Math.sin(Fortis.util.degreeToRadian(cInfo["angle"])),2)/radiusPS,
                        }
        */
        return cInfo;
    }
}

Fortis.RegPolygonCollider = class extends Fortis.ProtoCollider {
    get type() {
        return "RegPolygonCollider";
    }
    constructor(radius, sides, angle, distance) {
        super(distance);
        this.radius = 25;
        this.sides = 3;
        this.angle = 0;

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
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            this.angle = angle;
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
    getAngle() {
        return this.angle;
    }
    setAnlge(angle) {
        if (angle == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
        this.angle = angle;
        return angle;
    }
    getVertices(pos, _angle, scale) {//正多角形の頂点の相対的な座標を出力
        let Pos = new Fortis.Vector2();
        let Angle = 0;
        let Scale = new Fortis.Vector2(1, 1);
        if (pos != null) {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Pos = pos.copy();
        }
        if (_angle != null) {
            if (!Fortis.util.checkType(_angle, "number")) return Fortis.error.ArgTypeWrong();
            Angle = _angle;
        }
        if (scale != null) {
            if (!Fortis.util.checkType(scale, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Scale = scale.copy();
        }

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
        let angle = 270 + this.angle;

        for (let i = 0; i < points; i++) {
            let tmpVertice = Fortis.util.getPointOnCircle(this.distance.copy(), this.radius, angle, 5);
            tmpVertice.rotate(Angle);
            vertices.push(Pos.copy().add(tmpVertice.mul(Scale)));
            angle += angle_increment;
        }
        return vertices;
    }
}

Fortis.PolygonCollider = class extends Fortis.ProtoCollider {
    get type() {
        return "PolygonCollider";
    }
    constructor(vertices, angle, distance) {
        super(distance);
        if (vertices == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vertices, "object")) return Fortis.error.ArgTypeWrong();
        this.vertices = vertices;
        this.angle = 0;
        if (angle != null) {
            if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
            this.angle = angle;
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
    getAngle() {
        return this.angle;
    }
    setAnlge(angle) {
        if (angle == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(angle, "number")) return Fortis.error.ArgTypeWrong();
        this.angle = angle;
        return angle;
    }
    getVertices(pos, _angle, scale) {//頂点を取得
        let Pos = new Fortis.Vector2();
        let Angle = 0;
        let Scale = new Fortis.Vector2(1, 1);
        if (pos != null) {
            if (!Fortis.util.checkType(pos, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Pos = pos.copy();
        }
        if (_angle != null) {
            if (!Fortis.util.checkType(_angle, "number")) return Fortis.error.ArgTypeWrong();
            Angle = _angle;
        }
        if (scale != null) {
            if (!Fortis.util.checkType(scale, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
            Scale = scale.copy();
        }

        let nOfVertices = this.vertices.length;
        for (let i = 0; i < nOfVertices; i++) {
            this.vertices[i].rotate(this.angle);
            this.vertices[i].add(this.distance);
            this.vertices[i].rotate(Angle);
            this.vertices[i].mul(Scale).add(Pos);
        }

        return this.vertices;
    }
    setVertices(vertices) {//頂点を変更
        if (vertices == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vertices, "object")) return Fortis.error.ArgTypeWrong();
        this.vertices = vertices;
        return vertices;
    }
}