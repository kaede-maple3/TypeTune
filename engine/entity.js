Fortis.Entity = class {
    get type() {
        return "Entity";
    }
    constructor(shape, material) {
        this.id = Fortis.util.randomID();
        if (shape == null || shape == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(shape, "object", "Shape") || !Fortis.util.checkType(material, "object", "Material")) return Fortis.error.ArgTypeWrong();
        this.shape = shape;
        this.material = material;
        this.pos = new Fortis.Vector2();
        this.scale = new Fortis.Vector2(1, 1);//scale.xが優先される
        this.angle = 0;
        this.alpha = 1;
    }
    getType() {//タイプ取得
        return this.type;
    }
    getID() {//ID取得
        return this.id;
    }
    delete() {//削除
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
    show() {//表示させる
        this.alpha = 1;
    }
    hide() {//隠す
        this.alpha = 0;
    }
    getShape() {//図形取得
        return this.shape;
    }
    setShape(new_shape) {//図形変更
        if (new_shape == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(new_shape, "object", "Shape")) return Fortis.error.ArgTypeWrong();
        this.shape = new_shape;
        return this.shape;
    }
    getMaterial() {//マテリアル取得
        return this.material;
    }
    setMaterial(new_material) {//図形変更
        if (new_material == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(new_material, "object", "Material")) return Fortis.error.ArgTypeWrong();
        this.material = new_material;
        return this.material;
    }
    getPos() {//位置取得
        return this.pos;
    }
    setPos(vec) {//位置設定
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        return this.pos = vec.copy();
    }
    move(vec) {//相対的な移動
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        return this.pos.add(vec);
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
    setAlpha(value, mode) {//透明度を設定
        if (value == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
        if (!(value >= 0 && value <= 1)) return Fortis.error.ArgIncorrectVarRange();
        this.alpha = value;
        return this.alpha;
    }
    getAlpha() {//透明度を取得
        return this.alpha;
    }
}

Fortis.EntityContainer = class {
    get type() {
        return "EntityContainer";
    }
    constructor() {
        this.entity = [];
        this.ids = {};
        this.id = Fortis.util.randomID();
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
    getEntity() {//エンティティ取得
        return this.entity;
    }
    add(entity, tmpComposite) {//エンティティ追加
        if (entity == null) return Fortis.error.ArgNotExists();
        let composite;
        if (tmpComposite == null) {
            composite = "source-over";
        } else {
            if (!Fortis.util.checkType(tmpComposite, "string")) return Fortis.error.ArgTypeWrong();
            composite = tmpComposite;
        }
        if (!Fortis.util.checkType(entity, "object", "Entity")) return Fortis.error.ArgTypeWrong();
        if (this.ids[entity.id] != undefined) return Fortis.error.EntityAlreadyExists();
        this.entity.push({ "entity": entity, "composite": composite });
        this.ids[entity.id] = this.entity.length - 1;
        return this.entity;
    }
    addEntities(array) {//エンティティを複数追加
        if (array == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(array, "object")) return Fortis.error.ArgTypeWrong();
        array.forEach(element => {
            if (element.length == 1) {
                this.add(element[0]);
            } else {
                this.add(element[0], element[1]);
            }
        });
    }
    remove(entity) {//エンティティ削除
        if (entity == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(entity, "object", "Entity")) return Fortis.error.ArgTypeWrong();
        if (this.ids[entity.id] === undefined) return Fortis.error.EntityNotExists();
        let repeat_count = this.entity.length - this.ids[entity.id] - 1;
        let start_index = this.ids[entity.id] + 1;
        for (let i = 0; i < repeat_count; i++) {
            this.ids[this.entity[start_index + i]["entity"].id]++;
        }
        this.entity.splice(this.ids[entity.id], 1);
        delete this.ids[entity.id];
        return this.entity;
    }
    removeEntities(array) {//エンティティを複数削除
        if (array == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(array, "object")) return Fortis.error.ArgTypeWrong();
        array.forEach(entity => {
            this.remove(entity);
        });
    }
    reorder(entity, index) {//順番を変える
        if (entity == null || index == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(entity, "object", "Entity") || !Fortis.util.checkType(index, "number")) return Fortis.error.ArgTypeWrong();
        if (this.ids[entity.id] === undefined) return Fortis.error.EntityNotExists();
        if (index < 0 || index > this.entity - 1) return Fortis.error.ArgIncorrectVarRange();
        if (index == this.ids[entity.id]) return this.entity;
        let index_id = this.entity[index]["entity"].id
        let entityInfo = this.entity[this.ids[entity.id]]
        this.entity[this.ids[entity.id]] = this.entity[index];
        this.entity[this.ids[index_id]] = entityInfo;
        this.ids[index_id] = this.ids[entity.id];
        this.ids[entity.id] = index;
        return this.entity;
    }
    setPos(vec) {//入っているエンティティの座標を相対的に変更する
        if (vec == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(vec, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
        for(let i = 0; i < this.entity.length; i++){
            this.entity[i].entity.pos=vec.copy();
        }
    }
}