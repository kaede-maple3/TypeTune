Fortis.TransitionManager = {
    list: {},
    //{id:{type:対象の変数の型,target:ターゲット,tVar:変数名,time:時間,elapsedTime:経過時間,elapsedRate:経過率,from:初期値,to:最終値,difference:fromとtoの差,now:現在の値}}
    add(target, tVar, time, from, to, eFunc, args) {//追加
        if (target == null || tVar == null || from == null || to == null) return Fortis.error.ArgNotExists();

        let list = {};
        list["activity"] = false;

        list["target"] = target;

        let tmpDic = { tVar };
        list["tVar"] = tmpDic["tVar"];
        let tVarType = typeof (target[tVar])
        //console.log(target[tVar])
        list["type"] = tVarType;
        if (tVarType == "number") {
            list["difference"] = Fortis.util.cleanFloat(to - from,7);
            if (list["difference"] == 0) return false;
        } else if (tVarType == "object") {
            list["difference"] = to.copy().sub(from);
            list["difference"].cleanFloat(7);
            if (list["difference"].x == 0 && list["difference"].y == 0) return false;
        }

        if (eFunc == null) {
            list["easing"] = null;
        } else if (Fortis.util.checkType(eFunc, "function")) {
            list["easing"] = {
                "func": null,
                "arg": null,
            }
            list["easing"]["func"] = eFunc;
            if (args == null) {
                list["easing"]["arg"] = null;
            } else {
                list["easing"]["arg"] = args;
            }
        } else return Fortis.error.ArgTypeWrong();

        list["from"] = from;
        list["now"] = from;
        list["to"] = to;
        list["elapsedTime"] = 0;
        list["elapsedRate"] = 0;

        if (time == null) {//ms
            list["time"] = 3000;
        } else if (Fortis.util.checkType(time, "number")) {
            list["time"] = time;
        } else {
            return Fortis.error.ArgTypeWrong();
        }

        let id = Fortis.util.randomID();
        this.list[id] = list;
        return id;
    },
    remove(id) {//ID
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TransitionNotExists(id);
        delete this.list[id];
        return this.list;
    },
    removeAll() {//全てのトランジション削除
        this.list = {};
    },
    stop(id) {
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TransitionNotExists(id);
        this.list[id]["activity"] = false;
    },
    start(id) {
        if (id == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(id, "string")) return Fortis.error.ArgTypeWrong();
        if (this.list[id] === undefined) return Fortis.error.TransitionNotExists(id);
        this.list[id]["activity"] = true;
    },
    update(delta) {
        for (id in this.list) {
            if (this.list[id]["activity"]) {
                Fortis.TransitionManager.list[id]["elapsedTime"] += delta;
                Fortis.TransitionManager.list[id]["elapsedRate"] = Fortis.TransitionManager.list[id]["elapsedTime"] / Fortis.TransitionManager.list[id]["time"];
                if (Fortis.TransitionManager.list[id]["elapsedRate"] > 1) {
                    Fortis.TransitionManager.list[id]["elapsedRate"] = 1;
                }
                //console.log(Fortis.TransitionManager.list[id]["elapsedRate"])
                //console.log(Fortis.TransitionManager.list[id]["easing"]["func"](Fortis.TransitionManager.list[id]["elapsedRate"]))
                let finish = false;
                if (Fortis.TransitionManager.list[id]["elapsedTime"] >= Fortis.TransitionManager.list[id]["time"]) finish = true;
                if (Fortis.TransitionManager.list[id]["type"] == "number") {
                    if (Fortis.TransitionManager.list[id]["easing"] == null) {
                        Fortis.TransitionManager.list[id]["now"] += delta * Fortis.TransitionManager.list[id]["difference"] / Fortis.TransitionManager.list[id]["time"];
                    } else {
                        if(Fortis.TransitionManager.list[id]["easing"]["arg"] == null){
                            Fortis.TransitionManager.list[id]["now"] = Fortis.TransitionManager.list[id]["from"]+Fortis.TransitionManager.list[id]["difference"] * Fortis.TransitionManager.list[id]["easing"]["func"](Fortis.TransitionManager.list[id]["elapsedRate"]);
                        }else{
                            Fortis.TransitionManager.list[id]["now"] = Fortis.TransitionManager.list[id]["from"]+Fortis.TransitionManager.list[id]["difference"] * Fortis.TransitionManager.list[id]["easing"]["func"](Fortis.TransitionManager.list[id]["elapsedRate"],Fortis.TransitionManager.list[id]["easing"]["arg"]);
                        }
                    }

                    if (Fortis.TransitionManager.list[id]["difference"] > 0) {
                        if (Fortis.TransitionManager.list[id]["now"] > Fortis.TransitionManager.list[id]["to"]) {
                            Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Math.min(Fortis.TransitionManager.list[id]["to"], Fortis.TransitionManager.list[id]["now"]);
                        } else {
                            Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Fortis.TransitionManager.list[id]["now"];
                        }
                    } else {
                        if (Fortis.TransitionManager.list[id]["now"] < Fortis.TransitionManager.list[id]["to"]) {
                            Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Math.max(Fortis.TransitionManager.list[id]["to"], Fortis.TransitionManager.list[id]["now"]);
                        } else {
                            Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Fortis.TransitionManager.list[id]["now"];
                        }
                    }
                    if (finish) Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Fortis.TransitionManager.list[id]["to"];
                } else if (Fortis.TransitionManager.list[id]["type"] == "object") {
                    let variation;
                    if (Fortis.TransitionManager.list[id]["easing"] == null) {
                        variation = Fortis.TransitionManager.list[id]["difference"].copy().mul(delta / Fortis.TransitionManager.list[id]["time"]);
                        Fortis.TransitionManager.list[id]["now"].add(variation);
                    } else {
                        if(Fortis.TransitionManager.list[id]["easing"]["arg"] == null){
                            variation = Fortis.TransitionManager.list[id]["difference"].copy().mul(Fortis.TransitionManager.list[id]["easing"]["func"](Fortis.TransitionManager.list[id]["elapsedRate"]));
                        }else{
                            variation = Fortis.TransitionManager.list[id]["difference"].copy().mul(Fortis.TransitionManager.list[id]["easing"]["func"](Fortis.TransitionManager.list[id]["elapsedRate"],Fortis.TransitionManager.list[id]["easing"]["arg"]));
                        }
                        
                        Fortis.TransitionManager.list[id]["now"] = Fortis.TransitionManager.list[id]["from"].copy.add(variation);
                    }
                    Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Fortis.TransitionManager.list[id]["now"];
                    if (finish) Fortis.TransitionManager.list[id]["target"][Fortis.TransitionManager.list[id]["tVar"]] = Fortis.TransitionManager.list[id]["to"];
                }
                if (finish) {
                    Fortis.TransitionManager.remove(id);
                }
            }
        }
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
    getList() {//取得
        return this.list;
    },
}