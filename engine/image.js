Fortis.ImageLoader = {
    imgs: {},

    loadImg(key) {//画像のロード(一枚ずつ)
        if (key == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(key, "string")) return Fortis.error.ArgTypeWrong();
        if (!Fortis.util.checkType(Fortis.ImageLoader.imgs[key], "string")) return Fortis.error.ImgAlreadyExists(key);
        let newImg = new Image();
        return new Promise((resolve, reject) => {
            newImg.onload = () => {
                Fortis.ImageLoader.imgs[key] = newImg;
                Fortis.info.ImageLoaded(key);
                resolve(true);
            }
            newImg.onerror = () => {
                Fortis.error.ImgCouldntLoaded(key);
                reject(false);
            }
            newImg.src = Fortis.ImageLoader.imgs[key];
        })
    },

    loadImgs() {//画像のロード(loadImgで一枚ずつ処理する)
        return new Promise((resolve, reject) => {
            async function promise() {
                let keys = Object.keys(Fortis.ImageLoader.imgs);
                try {
                    const images = await Promise.all(keys.map(Fortis.ImageLoader.loadImg));
                    //console.log("All images loaded successfully:", images);
                    return images; // 全ての画像オブジェクトがここに入ります
                } catch (error) {
                    //console.error("Error loading images:", error);
                    throw error; // エラーを伝播させる場合
                }
            }
            promise()
                .then(() => {//画像のロードが終わった
                    resolve(true);
                })
                .catch((error) => {
                    reject(false);
                });
        })
    },

    addImages(object) {//画像を追加
        if (object == null) return Fortis.error.ArgNotExists();
        if (!Fortis.util.checkType(object, "object")) return Fortis.error.ArgTypeWrong();
        for (let key in object) {
            let url = object[key];
            if (key == null || url == null) return Fortis.error.ArgNotExists();
            if (!Fortis.util.checkType(key, "string") || !Fortis.util.checkType(url, "string")) return Fortis.error.ArgTypeWrong();
            if (Fortis.ImageLoader.imgs[key] !== undefined) return Fortis.error.ImgAlreadyExists(key);
            Fortis.ImageLoader.imgs[key] = url;
        }
        return this.imgs;
    },

    getImg(key) {//画像の取得
        if (key == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(key, "string")) return Fortis.error.ArgTypeWrong();
        if (this.imgs[key] === undefined) return Fortis.error.ImgNotExists(key);
        return this.imgs[key];
    },

    deleteImg(key) {//画像の削除
        if (key == null) return Fortis.error.ArgNotExsits();
        if (!Fortis.util.checkType(key, "string")) return Fortis.error.ArgTypeWrong();
        if (this.imgs[key] === undefined) return Fortis.error.ImgNotExists(key);
        document.head.removeChild(this.imgs[key])
        this.imgs.delete(key);
        return this.imgs;
    },

    getImgKeys() {//画像のキーの取得
        return this.imgs.keys();
    },
    getImgs() {//全画像取得
        let imgs = [];
        this.imgs.forEach(img => {
            imgs.push(img);
        });
        return img;
    }
}