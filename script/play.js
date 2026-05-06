let pScene, pBGLayer, pObjLayer, pUILayer;
let pSceneSTime;

function playReset() {
    pScene = new Fortis.Scene();
    Fortis.Game.setScene(pScene);
    pBGLayer = pScene.getBG();
    pObjLayer = pScene.getObj();
    pUILayer = pScene.getUI();

    pSceneSTime = performance.now();
}

//nowSoundは設定済みなので、開始するときに0から再生する

function pUpdate() {

}