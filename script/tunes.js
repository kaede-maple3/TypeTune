let beatsStdOaN = [//old=true/new=false
    [//シャイニングスター
        false,true,true,false
    ],
    [//Burning Heart
        false,true,true,false
    ],
    [//エリーゼのために
        false,true,true,false
    ],
    [//ハルジオン
        false,true,true,false
    ],
    [//君が代
        false,false,false,false
    ],
    [//アルプス一万尺
        false,true,true,false
    ],
    [//カノン
        false,false,false,false
    ],
]

let tunesInfo = [
    /*
    {
        "data": "url",
        "score": "譜面のデータ(形は考え中)",
        "name":"曲名",
        "time": "時間(ms)",
        "BPM":"BPM",
        "description":"説明",
        "scoreRate":{
        "D":"Dランクの..."
            "C":"Cランクのスコア",
            "B":"B同上",
            "A":"A同上",
            "AA":"AA同上",
            "S":"S同上",
            }
    }
    */
    {
        "data": "sss",
        "score": {
            0: s0e,
            1: s0n,
            2: s0h,
            3: s0ex,
        },
        "name": "シャイニングスター",
        "font": "Kaisei Opti",
        "time": 94000,
        "BPM": 158,
        "credit": "作詞作曲：森田交一 ボーカル：詩歩 ベース＆ギター：森田交一",
        "scoreRate": [
            0, 50000, 120000, 180000, 250000, 320000
        ],
        "volume":0.4,
    },
    {
        "data": "bh",
        "score": {
            0: s1e,
            1: s1n,
            2: s1h,
            3: s1ex,
        },
        "name": "Burning Heart",
        "font": "Reggae One",//仮
        "time": 113000,
        "BPM": 142,
        "credit": "作詞作曲：森田交一 ボーカル：KEI ベース＆ギター：森田交一",
        "scoreRate": [
            0, 70000, 150000, 220000, 340000, 450000
        ],
        "volume":0.4,
    },
    {
        "data": "forElise",
        "score": {
            0: s2e,
            1: s2n,
            2: s2h,
            3: s2ex,
        },
        "name": "エリーゼのために",
        "font": "Rampart One",
        "time": 83000,
        "BPM": 130,//元は65
        "credit": "作曲：ベートーベン",
        "scoreRate": [
            0, 50000, 90000, 140000, 200000, 250000
        ],
        "volume":0.4,
    },
    {
        "data": "hal",
        "score":{
            0: s3e,
            1: s3n,
            2: s3h,
            3: s3ex,
        },
        "name": "ハルジオン",
        "font": "Shippori Antique",//仮
        "time": 88000,
        "BPM": 152,
        "credit": "作詞作曲：森田交一 ボーカル：KEI ベース＆ギター：森田交一,村上友太",
        "scoreRate": [
            0, 50000, 120000, 200000, 250000, 320000
        ],
        "volume":0.4,
    },
    {
        "data": "kimigayo",
        "score":{
            0: s4e,
            1: s4n,
            2: s4h,
            3: s4ex,
        },
        "name": "君が代",
        "font": "Yuji Mai",
        "time": 56000,
        "BPM": 60,
        "credit": "日本国国家",
        "scoreRate": [
            0, 20000, 40000, 60000, 100000, 140000
        
        ],
        "volume":0.55,
    },
    {
        "data": "alps1",
        "score":{
            0: s5e,
            1: s5n,
            2: s5h,
            3: s5ex,
        },
        "name": "アルプス一万尺",
        "font": "Yuji Boku",
        "time": 24000,
        "BPM": 160,
        "credit": "民謡・童謡",
        "scoreRate": [
            0, 10000, 15000, 20000, 30000, 50000
        
        ],
        "volume":0.6,
    },
    {
        "data": "cannon",
        "score": {
            0: s6e,
            1: s6n,
            2: s6h,
            3: s6ex,
        },
        "name": "カノン",
        "font": "Reggae One",
        "time": 96000,
        "BPM": 84,
        "credit": "作曲：パッヘルベル",
        "scoreRate": [
            0, 30000, 100000, 150000, 200000, 270000
        
        ],
        "volume":0.6,
    },
    /*
    
    {
        "data": "./tune/まだ",
        "score": "譜面のデータ(形は考え中)",
        "name": "おおきなふるどけい",
        "font": "Shippori Antique",
        "time": 6000,
        "BPM": 100,
        "credit": "たろう16bitさんのやつ好き",
        "scoreRate": {
            "D": "Dランクのスコア",
            "C": "Cランクのスコア",
            "B": "B同上",
            "A": "A同上",
            "AA": "AA同上",
            "S": "S同上",
        },
        "highScore": {
            "normal": 0,
            "hard": 0,
        },
    },
    
    {
        "data": "./tune/まだ",
        "score": "譜面のデータ(形は考え中)",
        "name": "カノン",
        "font": "Reggae One",
        "time": 6000,
        "BPM": 100,
        "credit": "作曲：パッヘルベル",
        "scoreRate": {
            "D": "Dランクのスコア",
            "C": "Cランクのスコア",
            "B": "B同上",
            "A": "A同上",
            "AA": "AA同上",
            "S": "S同上",
        },
        "highScore": {
            "normal": 0,
            "hard": 0,
        },
    },
    {
        "data": "./tune/まだ",
        "score": "譜面のデータ(形は考え中)",
        "name": "春日部共栄中学高等学校校歌",
        "font": "Yuji Syuku",
        "time": 6000,
        "BPM": 100,
        "credit": "春日部共栄我が母校",
        "scoreRate": {
            "D": "Dランクのスコア",
            "C": "Cランクのスコア",
            "B": "B同上",
            "A": "A同上",
            "AA": "AA同上",
            "S": "S同上",
        },
        "highScore": {
            "normal": 0,
            "hard": 0,
        },
    },
    {
        "data": "./tune/まだ",
        "score": "譜面のデータ(形は考え中)",
        "name": "キラキラ星",
        "font": "Kaisei Decol",
        "time": 6000,
        "BPM": 100,
        "credit": "特になし",
        "scoreRate": {
            "D": "Dランクのスコア",
            "C": "Cランクのスコア",
            "B": "B同上",
            "A": "A同上",
            "AA": "AA同上",
            "S": "S同上",
        },
        "highScore": {
            "normal": 0,
            "hard": 0,
        },
    },*/

];
