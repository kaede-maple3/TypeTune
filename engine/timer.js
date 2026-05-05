Fortis.Timer = {
    list: {},//中身id:{time:時間(ms),repeat:繰り返すか(boolean),func:呼び出す関数,id:ID}
    add(time, repeat, func, target) {//追加
        let list = {};

        if (repeat == null) {
            list["repeat"] = false;
        } else if (Fortis.util.checkType(repeat, "boolean")) {
            list["repeat"] = repeat;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        if (time == null) {
            list["time"] = 5000;
        } else if (Fortis.util.checkType(time, "number")) {
            list["time"] = time;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        if (target == null) {
            if (func == null) return Fortis.error.ArgNotExists();
            if (!Fortis.util.checkType(func, "function")) return Fortis.error.ArgTypeWrong();
            list["func"] = func;
        } else {
            if (func == null) return Fortis.error.ArgNotExists();
            if (!Fortis.util.checkType(func, "string")) return Fortis.error.ArgTypeWrong();
            list["func"] = [target, func];
            //console.log([target, func])
        }


        let id = Fortis.util.randomID();
        list["management"] = { "time": list["time"], "activity": false };
        this.list[id] = list;
        return id;
    },
    remove(id) {//削除
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TimerNotExists(id);
        delete this.list[id];
        return this.list;
    },
    removeAll(){
        this.list = {};
    },
    getList() {//取得
        return this.list;
    },
    get(id) {
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return false
        return this.list[id];
    },
    getID(){//IDを取得
        return Object.keys(this.list);
    },
    getTimer(id) {//タイマー取得
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return false;
        return this.list[id];
    },
    start(id) {//タイマースタート
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TimerNotExists(id);
        this.list[id]["management"]["activity"] = true;
        return this.list[id];
    },
    stop(id) {//タイマーストップ
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TimerNotExists(id);
        this.list[id]["management"]["activity"] = false;
        return this.list[id];
    },
    reset(id) {//タイマーリセット(タイマーは停止状態になる)
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TimerNotExists(id);
        this.list[id]["management"]["activity"] = false;
        this.list[id]["management"]["time"] = this.list[id]["time"];
        return this.list[id];
    },
    setStatus(id, time, repeat, func) {//ステータス変更
        if (id == null || time == null || repeat == null || func == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string") || !Fortis.util.checkType(time, "number") || !Fortis.util.checkType(repeat, "boolean") || !Fortis.util.checkType(func, "function")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TimerNotExists(id);
        this.list[id]["time"] = time;
        this.list[id]["repeat"] = repeat;
        this.list[id]["func"] = func;
        return this.list[id];
    },
    update(delta) {//タイマーの更新
        for (let id in this.list) {
            if (this.list[id]["management"]["activity"]) {
                //console.log(this.list[id]["management"]["time"])
                this.list[id]["management"]["time"] -= delta;
                if (this.list[id]["management"]["time"] <= 0) {
                    if (Fortis.util.checkType(this.list[id]["func"], "object")) {
                        this.list[id]["func"][0][this.list[id]["func"][1]](delta);
                    } else {
                        this.list[id]["func"](delta);
                    }
                    if (this.list[id]["repeat"]) {
                        this.list[id]["management"]["time"] = this.list[id]["time"];
                    } else {
                        Fortis.Timer.remove(id);
                    }
                }
            }
        }
    },
}