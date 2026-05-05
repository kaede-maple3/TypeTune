//変数
Fortis.util.namedColors = {//カラーネーム
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    pink: { r: 255, g: 192, b: 203 },
    orange: { r: 255, g: 165, b: 0 },
    yellow: { r: 255, g: 255, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    cyan: { r: 0, g: 255, b: 255 },
    blue: { r: 0, g: 0, b: 255 },
    purple: { r: 128, g: 0, b: 128 },
    black: { r: 0, g: 0, b: 0 }
}

//関数
Fortis.error = {
    ArgNotExists() { Fortis.util.console("Error", "引数が指定されていません。") },
    ArgTypeWrong() { Fortis.util.console("Error", "引数の型もしくはタイプが間違っています。") },
    NotColorCode() { Fortis.util.console("Error", "カラーコードは「#」と16進数6文字を足した計7文字で入力してください") },
    ArgIncorrectVarRange() { Fortis.util.console("Error", "引数の値の範囲が正しくありません。") },
    SceneNotSet() { Fortis.util.console("Error", "シーンがセットされていません") },
    EntityAlreadyExists() { Fortis.util.console("Error", "そのエンティティは既に存在しています。") },
    EntityNotExists() { Fortis.util.console("Error", "そのエンティティは存在していません。") },
    LayerAlreadyExists() { Fortis.util.console("Error", "そのレイヤーは既に存在しています。") },
    LayerNotExists() { Fortis.util.console("Error", "そのレイヤーは存在していません。") },
    CantDeleteNamedLayer() { Fortis.util.console("Error", "名前付きのレイヤーは削除できません。") },
    ColorAlreadyExists() { Fortis.util.console("Error", "そのColorは既に存在しています。") },
    ColorNotExists() { Fortis.util.console("Error", "そのColorは存在していません。") },
    FontCouldntLoaded(name) { Fortis.util.console("Error", 'フォント"' + name + '"のロードができませんでした。') },
    FontAlreadyExists(name) { Fortis.util.console("Error", 'フォント"' + name + '"は既に存在しています。') },
    FontNotExists(name) { Fortis.util.console("Error", 'フォント"' + name + '"は存在しません。') },
    ImgCouldntLoaded(name) { Fortis.util.console("Error", '画像"' + name + '"のロードができませんでした。') },
    ImgAlreadyExists(name) { Fortis.util.console("Error", '画像"' + name + '"は既に存在しています。') },
    ImgNotExists(name) { Fortis.util.console("Error", '画像"' + name + '"は存在しません。') },
    SimpleSoundCouldntLoaded(name) { Fortis.util.console("Error", 'シンプルサウンド"' + name + '"のロードができませんでした。') },
    SimpleSoundAlreadyExists(name) { Fortis.util.console("Error", 'シンプルサウンド"' + name + '"は既に存在しています。') },
    SimpleSoundNotExists(name) { Fortis.util.console("Error", 'シンプルサウンド"' + name + '"は存在しません。') },
    NormalSoundCouldntLoaded(name) { Fortis.util.console("Error", 'ノーマルサウンド"' + name + '"のロードができませんでした。') },
    NormalSoundAlreadyExists(name) { Fortis.util.console("Error", 'ノーマルサウンド"' + name + '"は既に存在しています。') },
    NormalSoundNotExists(name) { Fortis.util.console("Error", 'ノーマルサウンド"' + name + '"は存在しません。') },
    //LoadingImgIsFailed() { Fortis.util.console("Error", "画像の読み込みに失敗しました。") },
    TimerNotExists(name) { Fortis.util.console("Error", 'タイマー ID"' + name + '"は存在していません。') },
    TransitionNotExists(name) { Fortis.util.console("Error", 'トランジション ID"' + name + '"は存在していません。') },
    ColliderNotExists(name) { Fortis.util.console("Error", 'コライダー ID"' + name + '"は存在していません。') },
    ColliderAlreadyExists(name) { Fortis.util.console("Error", 'コライダー ID"' + name + '"は既に存在しています。') },
    CollisionNotExists(name) { Fortis.util.console("Error", 'コリジョン ID"' + name + '"は存在していません。') },
}

Fortis.info = {
    SystemInitCompleted() { Fortis.util.console("Info", "ゲームシステムの初期化が完了しました。") },
    StartGameLoop() { Fortis.util.console("Info", "ゲームループを開始します。") },
    FontLoaded(name) { Fortis.util.console("Info", 'フォント"' + name + '"がロードされました。') },
    ImageLoaded(name) { Fortis.util.console("Info", '画像"' + name + '"がロードされました。') },
    SimpleSoundLoaded(name) { Fortis.util.console("Info", 'シンプルサウンド"' + name + '"がロードされました。') },
    NormalSoundLoaded(name) { Fortis.util.console("Info", 'ノーマルサウンド"' + name + '"がロードされました。') },
}

Fortis.util.console = function (type, content) {
    if (Fortis.Game.config.debug) {
        //「[Fortis] [タイプ] [日付(UTC)] - 内容」のフォーマット
        //タイプは「Info」「Error」
        switch (type) {
            case "Error"://Errorのとき
                let error = new Error();
                console.log("[Fortis] [" + type + "] [" + new Date().toUTCString() + "] - " + content, error);
                break
            case "Info"://Infoのとき
                console.log("[Fortis] [" + type + "] [" + new Date().toUTCString() + "] - " + content);
                break
        }

    }
}

Fortis.util.checkType = function (variable, varType, type) {
    if (typeof (variable) != varType) return false;//変数型チェック
    if (type == null) return true;//引数のtypeがあるか
    if (variable.type === undefined) return variable.indexOf(type) != -1;//variableにtypeが存在するか + variableのチェック
    return variable.type.indexOf(type) != -1;//variable.typeのチェック
}

Fortis.util.hexToRGB = function (hex) {
    if (!Fortis.util.checkType(hex, "string", "#")) return Fortis.error.NotColorCode();
    if (hex.length != 7) return Fortis.error.NotColorCode();
    if (isNaN(parseInt(hex.replace("#", ""), 16))) return Fortis.error.NotColorCode();
    let rgb = {};
    rgb.r = parseInt(hex.slice(1, 3), 16);
    rgb.g = parseInt(hex.slice(3, 5), 16);
    rgb.b = parseInt(hex.slice(5, 7), 16);
    return rgb;
}

Fortis.util.HSVToRGB = function (hsv) {
    if (!Fortis.util.checkType(hsv, "object")) return Fortis.error.ArgTypeWrong();
    if (hsv.h === undefined || hsv.s === undefined || hsv.v === undefined) return Fortis.error.ArgTypeWrong();
    if (!(hsv.h >= 0 && hsv.h <= 360 && hsv.s >= 0 && hsv.s <= 1 && hsv.v >= 0 && hsv.v <= 1)) return Fortis.error.ArgTypeWrong();
    let RGB = {};
    let max = hsv.v * 255;
    let min = max * (1 - hsv.s);
    let common = (max - min);
    if (hsv.h <= 60) {
        RGB.r = max;
        RGB.g = (hsv.h / 60) * common + min;
        RGB.b = min;
    } else if (hsv.h <= 120) {
        RGB.r = ((120 - hsv.h) / 60) * common + min;
        RGB.g = max;
        RGB.b = min;
    } else if (hsv.h <= 180) {
        RGB.r = min;
        RGB.g = max;
        RGB.b = ((hsv.h - 120) / 60) * common + min;
    } else if (hsv.h <= 240) {
        RGB.r = min;
        RGB.g = ((240 - hsv.h) / 60) * common + min;
        RGB.b = max;
    } else if (hsv.h <= 300) {
        RGB.r = ((hsv.h - 240) / 60) * common + min;
        RGB.g = min;
        RGB.b = max;
    } else {
        RGB.r = max;
        RGB.g = min;
        RGB.b = ((360 - hsv.h) / 60) * common + min;
    }
    return RGB;
}

Fortis.util.RGBToHex = function (rgb) {
    if (!Fortis.util.checkType(rgb, "object")) return Fortis.error.ArgTypeWrong();
    if (rgb.r === undefined || rgb.g === undefined || rgb.b === undefined) return Fortis.error.ArgTypeWrong();
    if (!(rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255)) return Fortis.error.ArgTypeWrong();
    let code_text = "#";
    let RGB = { r: rgb.r, g: rgb.g, b: rgb.b }
    for (let element in RGB) {
        let parsed = RGB[element].toString(16);
        if (parsed.length == 1) {
            code_text += "0";
        }
        code_text += parsed;
    }
    return code_text;
}

Fortis.util.RGBToHSV = function (rgb) {
    if (!Fortis.util.checkType(rgb, "object")) return Fortis.error.ArgTypeWrong();
    if (rgb.r === undefined || rgb.g === undefined || rgb.b === undefined) return Fortis.error.ArgTypeWrong();
    if (!(rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255)) return Fortis.error.ArgTypeWrong();
    let HSV = {};
    let max = Math.max(rgb.r, Math.max(rgb.g, rgb.b));
    let min = Math.min(rgb.r, Math.min(rgb.g, rgb.b));
    switch (max) {
        case rgb.r:
            HSV.h = (rgb.g - rgb.b) * 60 / (max - min);
            break
        case rgb.g:
            HSV.h = (rgb.b - rgb.r) * 60 / (max - min) + 120;
            break
        case rgb.b:
            HSV.h = (rgb.r - rgb.g) * 60 / (max - min) + 240;
            break
    }
    if (rgb.r == rgb.g && rgb.g == rgb.b) HSV.h = 0;
    if (HSV.h < 0) HSV.h += 360;
    if (max == 0) {
        HSV.h = 0;
        HSV.s = 0;
        HSV.v = 0;
    } else {
        HSV.s = (max - min) / max;
        HSV.v = max / 255;
    }
    return HSV;
}

Fortis.util.randomID = function (numOfDigit, decimal_system) {//digit=桁数、decimal_system=DS=N進数
    let digit, DS;
    if (numOfDigit == null) {
        digit = 32;
    } else if (Fortis.util.checkType(numOfDigit, "number")) {
        if (numOfDigit < 1) return Fortis.error.ArgIncorrectVarRange();
        digit = Math.floor(numOfDigit);
    } else {
        return Fortis.error.ArgTypeWrong();
    }

    if (decimal_system == null) {
        DS = 16;
    } else if (Fortis.util.checkType(decimal_system, "number")) {
        DS = decimal_system;
    } else {
        return Fortis.error.ArgTypeWrong();
    }

    let id = "";
    for (let i = 0; i < digit; i++) {
        id += Math.round(Math.random() * DS).toString(DS);
    }
    return id;
}

Fortis.util.degreeToRadian = function (degree) {
    if (degree == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(degree, "number")) return Fortis.error.ArgTypeWrong();
    return degree * (Math.PI / 180);
}

Fortis.util.radianToDegree = function (radian) {
    if (radian == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(radian, "number")) return Fortis.error.ArgTypeWrong();
    return (radian * 180) / Math.PI;
}

Fortis.util.getPointOnCircle = function (pos, radius, degree, digit) {
    if (pos == null || radius == null || degree == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(pos, "object", "Vector2") || !Fortis.util.checkType(radius, "number") || !Fortis.util.checkType(degree, "number")) return Fortis.error.ArgTypeWrong();
    let digits = 7;
    if (digit != null) {
        if (!Fortis.util.checkType(digit, "number")) return Fortis.error.ArgTypeWrong();
        digits = digit;
    }
    let x = pos.x + radius * Math.cos(Fortis.util.degreeToRadian(degree));
    let y = pos.y + radius * Math.sin(Fortis.util.degreeToRadian(degree));
    return new Fortis.Vector2(x, y).cleanFloat(digits);
}

Fortis.util.cleanFloat = function (value, digit) {
    if (value == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(value, "number")) return Fortis.error.ArgTypeWrong();
    let digits = 0;
    if (digit != null) {
        if (!Fortis.util.checkType(digit, "number")) return Fortis.error.ArgTypeWrong();
        digits = digit;
    }
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
}

Fortis.util.getLineSegment = function (p1, p2) {//pはpointの略
    if (p1 == null || p2 == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(p1, "object", "Vector2") || !Fortis.util.checkType(p2, "object", "Vector2")) return Fortis.error.ArgTypeWrong();
    /*情報 
    傾き、切片
    始点、終点
    方向ベクトル、長さ
    特別(x=、y= の形)
    */
    let LS = {};//LineSegmentの略
    LS["start"] = p1.copy();
    LS["end"] = p2.copy();
    LS["fDomain"] = [Math.min(p1.x, p2.x), Math.max(p1.x, p2.x)];//定義域
    LS["vDomain"] = [Math.min(p1.y, p2.y), Math.max(p1.y, p2.y)];//値域
    LS["direction"] = p2.copy().sub(p1);
    LS["special"] = { "x": null, "y": null };
    if (LS["direction"].x == 0) {
        LS["special"]["x"] = p1.x;
    }
    if (LS["direction"].y == 0) {
        LS["special"]["y"] = p1.y;
    }
    LS["length"] = LS["direction"].mag();
    if (LS["length"] == 0) return false;//長さが0ならfalse
    LS["slope"] = Fortis.util.cleanFloat(Math.atan2(LS["direction"].y, LS["direction"].x), 7);
    LS["intercept"] = p1.y - LS["slop"] * p1.x;

    return LS;
}

Fortis.util.checkLinesCollide = function (l1, l2) {//lはlineの略。getLineSegmentの値をそのまま持ってくる
    if (l1 == null || l2 == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(l1, "object") || !Fortis.util.checkType(l2, "object")) return Fortis.error.ArgTypeWrong();
    //交点の有無をbooleanで返す
    //判定
    let d1 = l1["direction"].copy();
    let d2 = l2["direction"].copy();
    let sd = l2["start"].copy().sub(l1["start"]);
    let pj = Fortis.util.cleanFloat(d1.x * d2.y - d1.y * d2.x, 7);//平行または同一直線状にあるか判定
    if (pj == 0) {//平行もしくは同一直線上
        if (l1["intercept"] == l2["intercept"] && ((l1["fDomain"][0] <= l2["fDomain"][0] && l2["fDomain"][0] <= l1["fDomain"][1]) || (l1["fDomain"][0] <= l2["fDomain"][1] && l2["fDomain"][1] <= l1["fDomain"][1]))) return true;//y切片が同じかつ、定義域が被っているなら同一直線状
    } else {
        let t = Fortis.util.cleanFloat((sd.x * d2.y - sd.y * d2.x) / pj, 7);
        let s = Fortis.util.cleanFloat((sd.x * d1.y - sd.y * d1.x) / pj, 7);
        if (0 <= t && t <= 1 && 0 <= s && s <= 1) return true;
    }
    return false;
}

Fortis.util.checkEllipseAndLineCollide = function (l, e) {//lはlineの略。eはellipseの略。lineはgetLineSegmentから、ellipseはCircleCollider.getInfoから(円に変形してgetCircleAndLineCollideへ)
    if (l == null || e == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(l, "object") || !Fortis.util.checkType(e, "object")) return Fortis.error.ArgTypeWrong();
    if (e["radius"].x == e["radius"].y) return Fortis.util.checkCircleAndLineCollide(l, e);//eが円

    let newLSP = l["start"].copy().sub(e["pos"]);
    newLSP.rotate(-e["angle"]);
    //console.log(newLSP.rotate(-e["angle"]));
    newLSP.y *= Fortis.util.cleanFloat(e["radius"].x / e["radius"].y, 7);
    let newLEP = l["end"].copy().sub(e["pos"]);
    newLEP.rotate(-e["angle"]);
    newLEP.y *= Fortis.util.cleanFloat(e["radius"].x / e["radius"].y, 7);
    let rotatedL = Fortis.util.getLineSegment(newLSP, newLEP);//楕円の角度分逆向きに線分を回転させる(楕円の座標を(0,0)にする)
    let c = { "pos": new Fortis.Vector2(), "radius": e["radius"] };
    return Fortis.util.checkCircleAndLineCollide(rotatedL, c);
}

Fortis.util.checkCircleAndLineCollide = function (l, c) {//lはlineの略。cはcircleの略。lineはgetLineSegmentから、circleはgetInfoから
    if (l == null || c == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(l, "object") || !Fortis.util.checkType(c, "object")) return Fortis.error.ArgTypeWrong();
    //https://yttm-work.jp/collision/collision_0006.html
    //これを使う
    //console.log(c)
    let lSToC = c["pos"].copy().sub(l["start"]);
    let normLVec = l["direction"].copy().normalize();
    let minDis = Fortis.util.cleanFloat(lSToC.y * normLVec.x - lSToC.x * normLVec.y, 7);//円の中心と直線の最短距離
    //console.log(Math.abs(minDis))
    if (c["radius"].x >= Math.abs(minDis)) {//最短距離が円の半径未満
        //console.log("aa")
        let lEToC = c["pos"].copy().sub(l["end"]);
        if (c["radius"].x >= lEToC.mag() || c["radius"].x >= lSToC.mag()) return true;
        let dot;
        if (lSToC.mag() >= lEToC.mag()) {//lSToCを使う
            dot = lSToC.x * normLVec.x + lSToC.y * normLVec.y;
        } else {
            dot = lEToC.x * normLVec.x * (-1) + lEToC.y * normLVec.y * (-1);
        }
        //console.log(dot/l["direction"].mag())
        return false

        /*
        let nLSToC = lSToC.copy().normalize();
        let signS = Math.sign(Math.acos(nLSToC.x * normLVec.x + nLSToC.y * normLVec.y) - Math.PI * 0.5);
        let nLEToC = lEToC.copy().normalize();
        let signE = Math.sign(Math.acos(nLEToC.x * normLVec.x + nLEToC.y * normLVec.y) - Math.PI * 0.5);
        console.log("aa")
        if (signS != signE) return true;
        */
    }
    return false;
}

Fortis.util.checkPolygonsCollide = function (v1, v2) {//vはverticesの略
    if (v1 == null || v2 == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(v1, "object") || !Fortis.util.checkType(v2, "object")) return Fortis.error.ArgTypeWrong();

    let axes = [];
    let v1l = v1.length;
    let v2l = v2.length;
    //console.log(v1[0],v1[1])
    if (v1l == 2) {
        let line = Fortis.util.getLineSegment(v1[0], v1[1]);
        //console.log(line["direction"].getNormal())
        axes.push(line["direction"].getNormal());
    } else {
        for (let i = 0; i < v1l; i++) {
            let line = Fortis.util.getLineSegment(v1[i], v1[(i + 1) % v1l]);
            //console.log(line["direction"].getNormal())
            axes.push(line["direction"].getNormal());
        }
    }

    if (v2l == 2) {
        let line = Fortis.util.getLineSegment(v2[0], v2[1]);
        //console.log(line["direction"].getNormal())
        axes.push(line["direction"].getNormal());
    } else {
        for (let i = 0; i < v2l; i++) {
            let line = Fortis.util.getLineSegment(v2[i], v2[(i + 1) % v2l]);
            //console.log(line["direction"].getNormal())
            axes.push(line["direction"].getNormal());
        }
    }


    for (let axis of axes) {
        let d1 = getShadowRange(axis, v1);
        //console.log(d1)
        let d2 = getShadowRange(axis, v2);
        if (!(d1[1] >= d2[0] && d2[1] >= d1[0])) return false;//共通範囲がない
    }

    return true;//共通範囲がある

    function getShadowRange(axis, v) {
        let min = Infinity;
        let max = -Infinity;
        for (let p of v) {
            let cp = Fortis.util.cleanFloat(p.x * axis.x + p.y * axis.y, 7);//内積
            min = min > cp ? cp : min;
            max = max < cp ? cp : max;
        }
        return [min, max];
    }
}

Fortis.util.checkRectsCollide = function (r1, r2) {//rはRectの略。RectColliderのgetInfoから
    if (r1 == null || r2 == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(r1, "object") || !Fortis.util.checkType(r2, "object")) return Fortis.error.ArgTypeWrong();
    let distance = r1["pos"].copy().sub(r2["pos"]);
    let sizeSum = r1["size"].copy().add(r2["size"]).mul(0.5);
    return Math.abs(distance.x) <= sizeSum.x && Math.abs(distance.y) <= sizeSum.y;
}

Fortis.util.checkCirclesCollide = function (c1, c2) {//cはcircleの略。CircleColliderのgetInfoから
    if (c1 == null || c2 == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(c1, "object") || !Fortis.util.checkType(c2, "object")) return Fortis.error.ArgTypeWrong();
    let distance = c1["pos"].distance(c2["pos"]);
    let radSum = c1["radius"].x + c2["radius"].x;
    return distance <= radSum
}

Fortis.util.checkEllipsesCollide = function (e1, e2) {//eはellipseの略。CircleColliderのgetInfoから
    if (e1 == null || e2 == null) return Fortis.error.ArgNotExists();
    if (!Fortis.util.checkType(e1, "object") || !Fortis.util.checkType(e2, "object")) return Fortis.error.ArgTypeWrong();
    let e = { "pos": e1["pos"], "radius": e1["radius"], "angle": e1["angle"] };

    //e2を線分で近似する
    //let e2d = e2["pos"].copy().sub(e1["pos"]);
    //e2d.rotate(e1["angle"])
    let vertexNum = 36;
    let angle_increment = 360 / vertexNum;
    let angle = 0;
    let vertices = [];
    for (let i = 0; i < vertexNum; i++) {
        let tmpVertice = Fortis.util.getPointOnCircle(new Fortis.Vector2(), e2["radius"].x, angle);
        tmpVertice.y *= e2["radius"].y / e2["radius"].x;
        tmpVertice.rotate(e2["angle"]);

        vertices.push(e2["pos"].copy().add(tmpVertice));
        //tmpVertice.rotate(Angle);
        //console.log(e2d)

        angle += angle_increment;
    }

    let vl = vertices.length;
    let lines = [];
    for (let i = 0; i < vl; i++) {
        lines.push(Fortis.util.getLineSegment(vertices[i], vertices[(i + 1) % vl]));
    }
    for (let line of lines) {
        if (Fortis.util.checkEllipseAndLineCollide(line, e)) {
            //console.log(e["angle"] % 360)
            return true;
        };
    }
    return false
}