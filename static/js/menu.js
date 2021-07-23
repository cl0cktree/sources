
var channel;
var gnbArr,
    subMenu;

//Channel
channel = $('html').data('channel');

gnbArr = [
    {
        "number" : "0",
        "name": "My NOW",
        "link": "#mynowlink",
        "sub": ""
    },
    {
        "number" : "1",
        "name": "자산",
        "link": "#",
        "sub": "asset"
    },
    {
        "number" : "2",
        "name": "지출",
        "link": "#assetlink",
        "sub": "expense"
    },
    {
        "number" : "3",
        "name": "목표 챌린지",
        "link": "#link",
        "sub": ""
    },
    {
        "number" : "4",
        "name": "부동산",
        "link": "#link",
        "sub": "realstate"
    },
    {
        "number" : "5",
        "name": "자동차",
        "link": "#link",
        "sub": "car"
    },
    {
        "number" : "6",
        "name": "My 금고",
        "link": "#link",
        "sub": ""
    },
    {
        "number" : "7",
        "name": "신용",
        "link": "#link",
        "sub": ""
    },
    {
        "number" : "10",
        "name": "마이데이터 선물함",
        "link": "#link",
        "sub": "mydataGift"
    },
    {
        "number" : "11",
        "name": "마이데이터 관리",
        "link": "#link",
        "sub": "mydataManage"
    },
    {
        "number" : "8",
        "name": "슬그Money",
        "link": "#link",
        "sub": ""
    },
    {
        "number" : "9",
        "name": "D플랜",
        "link": "#link",
        "sub": "dplan"
    }
];

subMenu = [{
    "asset" : [
        {
            "number" : "0",
            "name" : "자산통합조회",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "입출금&middot;페이",
            "link": "#link",
        },
        {
            "number" : "2",
            "name" : "예적금",
            "link": "#link",
        },
        {
            "number" : "3",
            "name" : "투자",
            "link": "#link",
        },
        {
            "number" : "4",
            "name" : "보험",
            "link": "#link",
        },
        {
            "number" : "5",
            "name" : "대출&middot;부채",
            "link": "#link",
        },
        {
            "number" : "6",
            "name" : "외화",
            "link": "#link",
        },
        {
            "number" : "7",
            "name" : "적립포인트",
            "link": "#link",
        },
    ],
    "expense" : [
        {
            "number" : "0",
            "name" : "가계부",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "정기지출",
            "link": "#link",
        },
        {
            "number" : "2",
            "name" : "카드관리",
            "link": "#link",
        },
        {
            "number" : "3",
            "name" : "소비리포트",
            "link": "#link",
        }
    ],
    "realstate" : [
        {
            "number" : "0",
            "name" : "My House",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "Wish House",
            "link": "#link",
        }
    ],
    "car" : [
        {
            "number" : "0",
            "name" : "My Car 차고",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "Wish Car 차고",
            "link": "#link",
        }
    ],
    "dplan" : [
        {
            "number" : "0",
            "name" : "월수령액",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "라이프이벤트",
            "link": "#link",
        },
        {
            "number" : "2",
            "name" : "나의기록",
            "link": "#link",
        },
        {
            "number" : "3",
            "name" : "D플랜 설정",
            "link": "#link",
        }
    ],
    "mydataManage" : [
        {
            "number" : "0",
            "name" : "다른기관 관리",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "KB국민은행",
            "link": "#link",
        },
        {
            "number" : "2",
            "name" : "이력정보",
            "link": "#link",
        }
    ],
    "mydataGift" : [
        {
            "number" : "0",
            "name" : "선물함",
            "link": "#link",
        },
        {
            "number" : "1",
            "name" : "실시간 이벤트",
            "link": "#link",
        },
        {
            "number" : "2",
            "name" : "친구추천",
            "link": "#link",
        }
    ]
}];


//채널별 메뉴 구성 조정
if(channel == 'ch_star'){        
    
}else if(channel == 'ch_liiv'){        
    gnbArr.splice(0,2);
    gnbArr.splice(1,4);
    gnbArr.splice(4,2);
    
}else{  // 마이머니
    gnbArr.splice(8,2);
}

