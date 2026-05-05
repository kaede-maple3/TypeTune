//Trigは三角関数
//powerは累乗(xのn乗)
//expoは指数(2のx乗)
//customは自由に作れる3次ベジェ曲線
//back y = ax**n - (a-1)x**m　a,n,mは1以上の数デフォルトでa=3,n=3,m=2
//circ y = 1- Math.sqrt(1-x**2)
//bounce

//三角関数系_確認済み
{
    Fortis.util.easing.inTrig = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat(1 - Math.cos(t * Math.PI / 2),4);
    }
    Fortis.util.easing.outTrig = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat(Math.sin(t * Math.PI / 2),4);
    }
    Fortis.util.easing.inOutTrig = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat((1 - Math.cos(t * Math.PI)) / 2,4);
    }
    Fortis.util.easing.outInTrig = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.easing.outTrig(t * 2) / 2;
        } else {
            return Fortis.util.easing.inTrig((t - 0.5) * 2) / 2 + 0.5;
        }
    }
}

//累乗系_確認済み
{
    Fortis.util.easing.inPower = function (t, n) {
        let expo = 2;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        return Fortis.util.cleanFloat(Math.pow(t, expo),4);
    }
    Fortis.util.easing.outPower = function (t, n) {
        let expo = 2;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        return Fortis.util.cleanFloat(1 - Math.pow(1 - t, expo),4);
    }
    Fortis.util.easing.inOutPower = function (t, n) {
        let expo = 2;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (t < 0.5) {
            return Fortis.util.easing.inPower(t * 2, expo) / 2;
        } else {
            return Fortis.util.easing.outPower((t - 0.5) * 2, expo) / 2 + 0.5;
        }
    }
    Fortis.util.easing.outInPower = function (t, n) {
        let expo = 2;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        return Fortis.util.cleanFloat((1 + Math.pow(2 * t - 1, expo)) / 2,4);
    }
}

//指数関数系_確認済み
{
    Fortis.util.easing.inExpo = function (t, n) {
        let expo = 10;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (t == 0) {
            return 0;
        }
        return Fortis.util.cleanFloat(Math.pow(2, expo * t - expo),4);
    }
    Fortis.util.easing.outExpo = function (t, n) {
        let expo = 10;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (t == 1) {
            return 1;
        }
        return Fortis.util.cleanFloat(1 - Math.pow(2, -expo * t),4);
    }
    Fortis.util.easing.inOutExpo = function (t, n) {
        let expo = 10;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (t < 0.5) {
            return Fortis.util.cleanFloat(Math.pow(2, expo * (2 * t - 1)) / 2,4);
        } else {
            return Fortis.util.cleanFloat((2 - Math.pow(2, expo * (1 - 2 * t))) / 2,4);
        }
    }
    Fortis.util.easing.outInExpo = function (t, n) {
        let expo = 10;
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo = n;
            } else if (typeof (n) == "object") {
                if (n.length != 1) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (t < 0.5) {
            return Fortis.util.cleanFloat((1 - Math.pow(2, -2 * expo * t)) / 2,4);
        } else {
            return Fortis.util.cleanFloat((1 + Math.pow(2, 2 * expo * (t - 1))) / 2,4);
        }
    }
}

//バック系_確認済み
{
    Fortis.util.easing.inBack = function (t, n, m, a) {
        let expo1 = 3;
        let expo2 = 2;
        let coe = 3;
        let isArray = false;

        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo1 = n;

            } else if (typeof (n) == "object") {
                isArray = true;
                if (n.length != 3) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo1 = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
                if (typeof (n[1]) == "number") {
                    if (n[1] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo2 = n[1];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
                if (typeof (n[2]) == "number") {
                    if (n[2] < 0) return Fortis.error.ArgIncorrectVarRange();
                    coe = n[2];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (isArray == false) {
            if (m != null) {
                if (!Fortis.util.checkType(m, "number")) return Fortis.error.ArgTypeWrong();
                if (m < 0) return Fortis.error.ArgIncorrectVarRange();
                expo2 = m;
            }
            if (a != null) {
                if (!Fortis.util.checkType(a, "number")) return Fortis.error.ArgTypeWrong();
                if (a < 0) return Fortis.error.ArgIncorrectVarRange();
                coe = a;
            }
        }
        return Fortis.util.cleanFloat(coe * Math.pow(t, expo1) - (coe - 1) * Math.pow(t, expo2),4);
    }
    Fortis.util.easing.outBack = function (t, n, m, a) {
        let expo1 = 3;
        let expo2 = 2;
        let coe = 3;
        let isArray = false;

        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (n != null) {
            if (typeof (n) == "number") {
                if (n < 0) return Fortis.error.ArgIncorrectVarRange();
                expo1 = n;

            } else if (typeof (n) == "object") {
                isArray = true;
                if (n.length != 3) return Fortis.error.ArgIncorrectVarRange();
                if (typeof (n[0]) == "number") {
                    if (n[0] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo1 = n[0];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
                if (typeof (n[1]) == "number") {
                    if (n[1] < 0) return Fortis.error.ArgIncorrectVarRange();
                    expo2 = n[1];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
                if (typeof (n[2]) == "number") {
                    if (n[2] < 0) return Fortis.error.ArgIncorrectVarRange();
                    coe = n[2];
                } else {
                    return Fortis.error.ArgTypeWrong();
                }
            }
        }
        if (isArray == false) {
            if (m != null) {
                if (!Fortis.util.checkType(m, "number")) return Fortis.error.ArgTypeWrong();
                if (m < 0) return Fortis.error.ArgIncorrectVarRange();
                expo2 = m;
            }
            if (a != null) {
                if (!Fortis.util.checkType(a, "number")) return Fortis.error.ArgTypeWrong();
                if (a < 0) return Fortis.error.ArgIncorrectVarRange();
                coe = a;
            }
        }
        return Fortis.util.cleanFloat(1 + coe * Math.pow(t - 1, expo1) + (coe - 1) * Math.pow(t - 1, expo2),4);
    }
    Fortis.util.easing.inOutBack = function (t, n, m, a) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.easing.inBack(t * 2, n, m, a) / 2;
        } else {
            return Fortis.util.easing.outBack((t - 0.5) * 2, n, m, a) / 2 + 0.5;
        }
    }
    Fortis.util.easing.outInBack = function (t, n, m, a) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.easing.outBack(t * 2, n, m, a) / 2;
        } else {
            return Fortis.util.easing.inBack((t - 0.5) * 2, n, m, a) / 2 + 0.5;
        }
    }
}

//円系_確認済み
{
    Fortis.util.easing.inCirc = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat(1 - Math.sqrt(1 - t ** 2),4);
    }
    Fortis.util.easing.outCirc = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat(Math.sqrt(-1 * t ** 2 + 2 * t),4);
    }
    Fortis.util.easing.inOutCirc = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.easing.inCirc(t * 2) / 2;
        } else {
            return Fortis.util.easing.outCirc((t - 0.5) * 2) / 2 + 0.5;
        }
    }
    Fortis.util.easing.outInCirc = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.easing.outCirc(t * 2) / 2;
        } else {
            return Fortis.util.easing.inCirc((t - 0.5) * 2) / 2 + 0.5;
        }
    }
}

//バウンド系_確認済み
{
    Fortis.util.easing.inBounce = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return 1 - Fortis.util.easing.outBounce(1 - t);
    }
    Fortis.util.easing.outBounce = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        const n1 = 7.5625;
        const n2 = 2.75;
        if (t < 1 / n2) {
            return Fortis.util.cleanFloat(n1 * t * t,4);
        } else if (t < 2 / n2) {
            t -= 1.5 / n2
            return Fortis.util.cleanFloat(n1 * t * t + 0.75,4);
        } else if (t < 2.5 / n2) {
            t -= 2.25 / n2
            return Fortis.util.cleanFloat(n1 * t * t + 0.9375,4);
        } else {
            t -= 2.625 / n2
            return Fortis.util.cleanFloat(n1 * t * t + 0.984375,4);
        }
    }
    Fortis.util.easing.inOutBounce = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return (1 - Fortis.util.easing.outBounce(1 - 2 * t)) / 2;
        } else {
            return (1 + Fortis.util.easing.outBounce(2 * t - 1)) / 2;
        }
    }
    Fortis.util.easing.outInBounce = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return (Fortis.util.easing.outBounce(2 * t)) / 2;
        } else {
            return (2 - Fortis.util.easing.outBounce(2 - 2 * t)) / 2;
        }
    }
}

//バネ系_確認済み
{
    Fortis.util.easing.inSpring = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat(-Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * 2 / 3 * Math.PI),4);
    }
    Fortis.util.easing.outSpring = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        return Fortis.util.cleanFloat(Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * 2 / 3 * Math.PI) + 1,4);
    }
    Fortis.util.easing.inOutSpring = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.cleanFloat(-(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * 2 / 4.5 * Math.PI)) / 2,4);
        } else {
            return Fortis.util.cleanFloat((Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * 2 / 4.5 * Math.PI)) / 2 + 1,4);
        }
    }
    Fortis.util.easing.outInSpring = function (t) {
        if (t == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(t, "number")) return Fortis.error.ArgTypeWrong();
        if (t < 0 || t > 1) return Fortis.error.ArgIncorrectVarRange();
        if (t < 0.5) {
            return Fortis.util.cleanFloat((1 + Math.pow(2, -20 * t) * Math.sin((20 * t - 1.125) * 2 / 4.5 * Math.PI)) / 2,4);
        } else {
            return Fortis.util.cleanFloat((1 - Math.pow(2, 20 * t - 20) * Math.sin((20 * t - 21.125) * 2 / 4.5 * Math.PI)) / 2,4);
        }
    }
}