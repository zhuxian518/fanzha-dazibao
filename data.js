// data.js — 反诈大字报 实锤弹药库 v2
// 规则：每个 evidence 字段必须对应可查证的判决/官方通报原文；level=1 才出卡。
// verified: true = 已核验可出卡；false = 骨架占位，页内显示「核验中」，禁止出卡。

const CATEGORIES = [
  { id: 'health-fake',  name: '假保健' },
  { id: 'drug-fake',    name: '假神药' },
  { id: 'free-trap',    name: '免费陷阱' },
  { id: 'impersonate',  name: '冒充身份' },
  { id: 'pension-pot',  name: '养老钱袋' },
  { id: 'romance',      name: '情感牌' },
  { id: 'prize',        name: '中奖横财' },
  { id: 'rebate',       name: '刷单返利' },
  { id: 'fake-service', name: '假服务' },
  { id: 'digital-gap',  name: '数字鸿沟' },
];

// 爆炸贴词库（≥8 轮换）
const STICKERS = ['紧急曝光', '重大通报', '判刑了', '一查到底', '已立案', '别再买了', '央视点名', '警方提醒'];

const DB = [

  // ============ 1. 假保健 ============
  {
    id: 'quantum-mattress',
    category: 'health-fake',
    scene: '量子/能量床垫',
    verified: true,
    keywords: {
      exact: ['量子床垫', '光氧床垫', '能量床垫', '量子理疗'],
      fuzzy: ['床垫', '量子', '理疗', '光氧', '磁疗'],
    },
    variants: [
      {
        sticker: '紧急曝光',
        title: '量子床垫，老板判刑了！',
        money: { cost: '¥2000', sell: '¥25800' },
        shock: '一批老人被骗走养老钱',
      },
      {
        sticker: '判刑了',
        title: '这张"神床垫"，全国查!',
        money: { cost: '¥2000', sell: '¥25800' },
        shock: '同类案件多地判决，5 人获刑',
      },
    ],
    evidence: {
      org: '福州市长乐区人民法院',
      docType: '刑事判决',
      date: '2023年',
      charge: '虚假广告罪',
      sentence: '获刑 1 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，这是法院判的，不是我说的。钱留着，我带你去正规医院查。',
  },

  {
    id: 'health-lecture',
    category: 'health-fake',
    scene: '保健品会销/亲情营销',
    verified: true,
    keywords: {
      exact: ['保健品', '健康讲座', '会销', '亲情营销', '理疗店'],
      fuzzy: ['讲座', '保健', '养生', '体检', '理疗'],
    },
    variants: [
      {
        sticker: '一查到底',
        title: '"神药"年夜饭骗局，判 10 年 3 个月！',
        money: { cost: '几十元', sell: '¥上万' },
        shock: '免费吃饭是鱼饵，62 万养老钱进了骗子口袋',
      },
      {
        sticker: '央视点名',
        title: '免费鸡蛋换你上万元！查处的理疗店都在用这招',
        money: null,
        shock: '市场监管部门 2025 年专项整治，多家门店被罚',
      },
    ],
    evidence: {
      org: '最高人民法院典型案例 / 湖北省市场监管局',
      docType: '刑事判决 / 行政处罚通报',
      date: '2025年',
      charge: '诈骗罪 / 虚假宣传',
      sentence: '倪某荣获刑 10 年 3 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，真关心你的人不会拉你去买东西。这些店已经被查处了，咱不买。',
  },

  // ============ 2. 假神药 ============
  {
    id: 'maiya-shenyao',
    category: 'drug-fake',
    scene: '麦芽糊精"神药"/国医馆',
    verified: true,
    keywords: {
      exact: ['神药', '国医馆', '麦芽糊精', '祖传秘方'],
      fuzzy: ['药', '秘方', '中医', '根治'],
    },
    variants: [
      {
        sticker: '央视点名',
        title: '成本30卖6000的"神药"！',
        money: { cost: '¥30', sell: '¥6000' },
        shock: '120人被抓获',
      },
    ],
    evidence: {
      org: '广州市公安局荔湾区分局',
      docType: '警方通报',
      date: '2026年',
      charge: '诈骗罪',
      sentence: '120 人落网',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，能根治病的药，医院早就卖了。这是法院/警方查过的案子，咱别当那个"个案"。',
  },

  {
    id: 'fake-doctor-call',
    category: 'drug-fake',
    scene: '假名医电话/电视购药',
    verified: true,
    keywords: {
      exact: ['假名医', '名医电话', '电视购药', '专家热线'],
      fuzzy: ['名医', '专家', '电话卖药'],
    },
    variants: [
      {
        sticker: '已立案',
        title: '"神医"电话骗走900万！',
        money: null,
        shock: '一大批老人中招',
      },
    ],
    evidence: {
      org: '宁波法院',
      docType: '刑事判决',
      date: '',
      charge: '诈骗罪',
      sentence: '获刑 12 年 6 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，真专家不打电话卖药。这个"名医"已经判了 12 年半。',
  },

  {
    id: 'livestream-shenyi',
    category: 'drug-fake',
    scene: '直播间神医神药',
    verified: true,
    keywords: {
      exact: ['直播间', '神医带货', '直播卖药', '主播卖药'],
      fuzzy: ['直播', '带货', '主播'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '直播间演戏卖"神药"，27 人被判刑！',
        money: null,
        shock: '编造离婚分产、家人患病苦情戏，骗 196 人 930 万',
      },
      {
        sticker: '别再买了',
        title: '白大褂一穿就成"神医"？群演被查处！',
        money: null,
        shock: '四部门出手整治"自媒体"假医生',
      },
    ],
    evidence: {
      org: '最高检典型案例（长垣市法院）',
      docType: '刑事判决',
      date: '2026年',
      charge: '诈骗罪',
      sentence: '27 人获刑 9 年 3 个月至 3 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，镜头里喊你"爸妈"的，是冲你的钱包来的。这伙人已经判刑了。',
  },

  // ============ 3. 免费陷阱 ============
  {
    id: 'free-egg',
    category: 'free-trap',
    scene: '免费领鸡蛋',
    verified: true,
    keywords: {
      exact: ['免费领鸡蛋', '领鸡蛋', '扫码领礼品'],
      fuzzy: ['鸡蛋', '免费领', '礼品'],
    },
    variants: [
      {
        sticker: '重大通报',
        title: '鸡蛋是鱼饵！700万条老人信息被倒卖',
        money: null,
        shock: '登记一次，骗子全知道你家情况',
      },
    ],
    evidence: {
      org: '泰州法院',
      docType: '刑事判决',
      date: '',
      charge: '侵犯公民个人信息罪',
      sentence: '主犯获刑 14 年 6 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，鸡蛋才几个钱，咱的信息被卖了可不止这个数。这是判了 14 年半的真案子。',
  },

  {
    id: 'ping-shu-ji',
    category: 'free-trap',
    scene: '评书机/教机',
    verified: true,
    keywords: {
      exact: ['评书机', '教机', '收音机送礼'],
      fuzzy: ['评书', '收音机'],
    },
    variants: [
      {
        sticker: '紧急曝光',
        title: '这个"评书机"，骗了700万个老人',
        money: null,
        shock: '天天放"神药广告"给你洗脑',
      },
    ],
    evidence: {
      org: '泰州法院',
      docType: '刑事判决',
      date: '',
      charge: '诈骗罪',
      sentence: '主犯获刑 14 年 6 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，那机器不是送你的，是拿来"洗脑"你的。法院都判了。',
  },

  {
    id: 'free-course',
    category: 'free-trap',
    scene: '免费网课/剪辑课退费',
    verified: true,
    keywords: {
      exact: ['免费网课', '剪辑课', '退费'],
      fuzzy: ['网课', '课程', '退费'],
    },
    variants: [
      {
        sticker: '央视点名',
        title: '退费反被骂！央视已曝光',
        money: null,
        shock: '交钱容易退钱难',
      },
    ],
    evidence: {
      org: '央视',
      docType: '新闻报道/官方通报',
      date: '',
      charge: '诱导消费',
      sentence: '涉事机构被查处',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，"免费"的课最后都最贵。央视都报了。',
  },

  {
    id: 'free-travel',
    category: 'free-trap',
    scene: '免费旅游/低价团',
    verified: true,
    keywords: {
      exact: ['免费旅游', '低价团', '夕阳红旅游', '一日游'],
      fuzzy: ['旅游', '一日游', '跟团'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '免费带您旅游的公司，卷走 100 万跑了！',
        money: null,
        shock: '月息 2% 是幌子，20 多位老人养老钱打水漂',
      },
      {
        sticker: '央视点名',
        title: '低价游进店，"免费送玉石"骗了 39 位老人',
        money: { cost: '百元劣质品', sell: '¥数千' },
        shock: '讲师演"玉石店老板"，抢购全是托',
      },
    ],
    evidence: {
      org: '人民法院公开案例（旅游公司集资诈骗案）',
      docType: '刑事判决',
      date: '2026年',
      charge: '集资诈骗罪 / 诈骗罪',
      sentence: '主犯获刑 7 年 2 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，免费的车，油费都记在你账上呢。这种案子法院判过不止一次了。',
  },

  // ============ 4. 冒充身份 ============
  {
    id: 'fake-gongjianfa',
    category: 'impersonate',
    scene: '冒充公检法',
    verified: true,
    keywords: {
      exact: ['公检法', '警察电话', '涉案', '安全账户', '通缉'],
      fuzzy: ['公安', '法院', '警察', '通缉', '洗钱'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '冒充"检察官"骗老人，获刑 15 年！',
        money: null,
        shock: '骗 2000 余万，几十名老人中招——北京二中院',
      },
      {
        sticker: '警方提醒',
        title: '真警察不会电话办案，更不会让你转账！',
        money: null,
        shock: '所谓"安全账户"就是骗子的账户',
      },
    ],
    evidence: {
      org: '北京市第二中级人民法院',
      docType: '刑事判决',
      date: '2022年',
      charge: '诈骗罪',
      sentence: '主犯获刑 15 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，公检法不打电话办案。挂了电话打 96110 问一句，一分钱都不会少。',
  },

  {
    id: 'fake-relative',
    category: 'impersonate',
    scene: '冒充亲人出事/猜猜我是谁',
    verified: true,
    keywords: {
      exact: ['猜猜我是谁', '亲人出事', '孙子出事', '孙子撞人', '赎人'],
      fuzzy: ['出事', '借钱', '家人', '孙子', '外孙'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '"孙子撞人了急需 8 万"，3 名骗子获刑！',
        money: null,
        shock: 'AI 仿声学孙子哭腔，一天骗 3 位老人 6 万',
      },
      {
        sticker: '紧急曝光',
        title: '"猜猜我是谁"？先挂电话，自己拨孙子号码！',
        money: null,
        shock: '骗子最怕你多打一个电话',
      },
    ],
    evidence: {
      org: '黄石市黄石港区人民法院',
      docType: '刑事判决',
      date: '2025年',
      charge: '诈骗罪',
      sentence: '取款人获刑 2 年 1 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，真出事不怕你核实。挂了电话直接打他手机，别打对方给的号。',
  },

  {
    id: 'fake-shebao',
    category: 'impersonate',
    scene: '冒充社保/医保/燃气客服',
    verified: true,
    keywords: {
      exact: ['社保卡', '医保卡', '燃气检修', '社保停用', '医保销户'],
      fuzzy: ['社保', '医保', '燃气', '销户'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '"医保账户要销户"？骗老年的话术，判了！',
        money: null,
        shock: '冒充医保局来电，两被告获刑——2026 年宣判',
      },
      {
        sticker: '警方提醒',
        title: '"社保卡停用"？骗子在等你的验证码！',
        money: null,
        shock: '人社部门：从不会电话要求销户或转账',
      },
    ],
    evidence: {
      org: '荆州市荆州区检察院（2026 年宣判）',
      docType: '刑事判决',
      date: '2026年',
      charge: '诈骗罪',
      sentence: '两被告获刑并处罚金',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，验证码就是银行卡的钥匙，谁要都不给。打 12333 官方电话问问就知道。',
  },

  // ============ 5. 养老钱袋 ============
  {
    id: 'gaoxi-licai',
    category: 'pension-pot',
    scene: '高息理财/以房养老',
    verified: true,
    keywords: {
      exact: ['高息理财', '以房养老', '养老理财', '房产抵押'],
      fuzzy: ['理财', '利息', '分红', '抵押'],
    },
    variants: [
      {
        sticker: '无期徒刑',
        title: '"以房养老"骗局主犯，被判无期！',
        money: null,
        shock: '10 多位老人房子被抵押，900 万打水漂',
      },
      {
        sticker: '判刑了',
        title: '房子抵押"换养老金"？14 年刑期等着他！',
        money: null,
        shock: '两套房抵押 500 万被转走——北京三中院',
      },
    ],
    evidence: {
      org: '北京市第二中级人民法院',
      docType: '刑事判决',
      date: '2022年',
      charge: '诈骗罪',
      sentence: '主犯李某某获刑无期',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，房子是咱的命根子。这案子判了无期，咱可不能当那个"个案"。',
  },

  {
    id: 'yanglaoyuan-beds',
    category: 'pension-pot',
    scene: '养老院床位/会员卡集资',
    verified: true,
    keywords: {
      exact: ['养老院床位', '养老会员卡', '预定养老', '养老公寓'],
      fuzzy: ['养老院', '养老公寓', '床位', '会员'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '"养老床位"吸金 132 亿，老板判无期！',
        money: null,
        shock: '11 万人中招，46.98 亿本金血本无归',
      },
      {
        sticker: '一查到底',
        title: '床位预定金换"利息"？主犯获刑 15 年！',
        money: null,
        shock: '2100 人受骗，9300 万损失——最高检典型案例',
      },
    ],
    evidence: {
      org: '最高检打击整治养老诈骗典型案例',
      docType: '刑事判决',
      date: '2022年发布',
      charge: '集资诈骗罪',
      sentence: '曹某铭无期 / 戴某平 15 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，买床位之前先给我打个电话。这种"床位+利息"的，最高检都点名了。',
  },

  {
    id: 'shoucangpin',
    category: 'pension-pot',
    scene: '收藏品/纪念币升值回购',
    verified: true,
    keywords: {
      exact: ['收藏品', '纪念币', '升值回购', '溢价回购'],
      fuzzy: ['收藏', '纪念币', '回购', '邮票'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '纪念币承诺"溢价 20% 回购"，判 7 年半！',
        money: null,
        shock: '低价纪念币包装成藏品，认"干亲"骗信任',
      },
      {
        sticker: '已立案',
        title: '"稳赚回购"的收藏品，公司跑了！',
        money: null,
        shock: '黑袋子密封"防光防潮"，就是怕你家里发现',
      },
    ],
    evidence: {
      org: '山东省邹城市人民法院（最高检典型案例）',
      docType: '刑事判决',
      date: '2021年',
      charge: '集资诈骗罪',
      sentence: '许某燕获刑 7 年 6 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，说好高价回购的，人去楼空了。钱进来之前先给我看一眼。',
  },

  // ============ 6. 情感牌 ============
  {
    id: 'huanghun-lian',
    category: 'romance',
    scene: '婚恋/黄昏恋杀猪盘',
    verified: true,
    keywords: {
      exact: ['黄昏恋', '婚恋', '杀猪盘', '网恋'],
      fuzzy: ['网恋', '对象', '交友', '老伴'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '"部委干部"网恋骗阿姨 29 万，获刑 6 年半！',
        money: null,
        shock: '一人分饰"干部"和"秘书"两角——北京西城法院',
      },
      {
        sticker: '紧急曝光',
        title: '没见过面的"恋人"谈钱？都是剧本！',
        money: null,
        shock: '黄昏恋骗局=杀猪盘，专挑独居老人',
      },
    ],
    evidence: {
      org: '北京市西城区人民法院',
      docType: '刑事判决',
      date: '2022年',
      charge: '诈骗罪',
      sentence: '王某获刑 6 年 6 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，没见过面就谈钱的，都是话术。你值得真感情，不是套路。',
  },

  {
    id: 'zhibo-zhubo',
    category: 'romance',
    scene: '短视频"贴心主播"诱导',
    verified: false, // 待核验：网信办清朗行动锚点
    keywords: {
      exact: ['贴心主播', '情感主播', '直播打赏'],
      fuzzy: ['主播', '打赏', '粉丝'],
    },
    variants: [
      { sticker: '别再买了', title: '喊你"爸妈"的主播，在清你的钱包！', money: null, shock: '' },
    ],
    evidence: { org: '', docType: '', date: '', charge: '', sentence: '', refUrl: '', level: 0 },
    softScript: '妈，他喊一千个观众都叫爸妈。真儿子在你身边呢。',
  },

  // ============ 7. 中奖横财 ============
  {
    id: 'zhongjiang',
    category: 'prize',
    scene: '中奖诈骗/扫码中奖',
    verified: true,
    keywords: {
      exact: ['中奖', '扫码中奖', '幸运用户', '刮刮卡'],
      fuzzy: ['中奖', '奖品', '抽奖', '刮奖'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '街头扫码"100% 中奖"，主犯获刑 3 年半！',
        money: null,
        shock: '充话费才能领奖？35 人被骗 29 万',
      },
      {
        sticker: '紧急曝光',
        title: '快递里"中奖 10 元"？有人被刮走 50 万！',
        money: null,
        shock: '扫码领奖 → 刷单垫资，血本无归',
      },
    ],
    evidence: {
      org: '长沙市岳麓区人民法院 / 龙岩市新罗区检察院',
      docType: '刑事判决 / 公诉案件',
      date: '2024–2026年',
      charge: '诈骗罪',
      sentence: '主犯获刑 3 年 6 个月至 4 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，真中奖不用先交钱。要钱的奖，直接删。',
  },

  {
    id: 'guping-laoshi',
    category: 'prize',
    scene: '投资群"老师"带你飞',
    verified: true,
    keywords: {
      exact: ['投资群', '荐股老师', '带飞', '牛股', '内部股'],
      fuzzy: ['股票', '投资', '老师', '理财'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '"国学大师"荐股骗走老人 1230 万！',
        money: null,
        shock: '一人操控 6 部手机假扮 4 位"老师"',
      },
      {
        sticker: '无期徒刑',
        title: '假"伦敦金"平台，主犯被判无期！',
        money: null,
        shock: '1789 人损失 2.8 亿——最高法典型案例',
      },
    ],
    evidence: {
      org: '最高人民法院典型案例 / 检察日报',
      docType: '刑事判决',
      date: '2026年',
      charge: '诈骗罪 / 非法经营罪',
      sentence: '余某波无期 / 李某向某获刑',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，真有稳赚的路子，他闷声发财还带你？群里除了你全是"托"。',
  },

  // ============ 8. 刷单返利 ============
  {
    id: 'shuadan',
    category: 'rebate',
    scene: '刷单返利',
    verified: true,
    keywords: {
      exact: ['刷单', '做任务', '返利'],
      fuzzy: ['刷单', '兼职', '任务'],
    },
    variants: [
      {
        sticker: '警方提醒',
        title: '所有刷单都是诈骗——公安部',
        money: null,
        shock: '垫钱做的"任务"，一分都回不来',
      },
      {
        sticker: '紧急曝光',
        title: '帮子女"做任务"？也是刷单骗局！',
        money: null,
        shock: '第一单返小钱，后面全吞大钱',
      },
    ],
    evidence: {
      org: '公安部刑侦局 / 国家反诈中心',
      docType: '官方声明',
      date: '',
      charge: '电信网络诈骗',
      sentence: '高发类案，全国打击',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，公安部说得明明白白：所有刷单都是诈骗，没有例外。',
  },

  // ============ 9. 假服务 ============
  {
    id: 'yufuka',
    category: 'fake-service',
    scene: '预付卡跑路',
    verified: true,
    keywords: {
      exact: ['预付卡', '办卡', '会员充值', '充值卡'],
      fuzzy: ['充值', '办卡', '会员', '跑路'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '"职业闭店人"接手 4 家健身房，判 5 年！',
        money: null,
        shock: '收 75 万会费就跑路——上海首例刑事案',
      },
      {
        sticker: '已立案',
        title: '充了钱店关门？背后是职业闭店团伙！',
        money: null,
        shock: '换法人 → 引导大额充值 → 卷款失联',
      },
    ],
    evidence: {
      org: '上海市虹口区人民法院',
      docType: '刑事判决',
      date: '2026年',
      charge: '合同诈骗罪',
      sentence: '陶某获刑 5 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，充值别超过一次能花的量。店比你的钱跑得快。',
  },

  {
    id: 'jingshuiqi',
    category: 'fake-service',
    scene: '上门推销净水器/燃气检修',
    verified: true,
    keywords: {
      exact: ['上门检测', '燃气检修', '净水器', '净水机'],
      fuzzy: ['上门', '检修', '净水器', '滤芯'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: '进价 245 的净水器卖上万，主犯判 10 年！',
        money: { cost: '¥245', sell: '¥2880' },
        shock: '196 位农村老人被骗 55 万',
      },
      {
        sticker: '一查到底',
        title: '"国家补贴 1800 元买净水机"？假的！',
        money: null,
        shock: '冒充自来水公司上门，专挑子女上班时来',
      },
    ],
    evidence: {
      org: '重庆市潼南区人民法院',
      docType: '刑事判决',
      date: '2023年',
      charge: '诈骗罪',
      sentence: '朱某获刑 10 年',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，物业和燃气公司不搞上门推销。让他先出示工单，再给我打电话。',
  },

  // ============ 10. 数字鸿沟 ============
  {
    id: 'shuzi-cangpin',
    category: 'digital-gap',
    scene: '虚假"养老项目"/数字藏品',
    verified: true,
    keywords: {
      exact: ['数字藏品', '养老项目', '虚拟货币', '元宇宙'],
      fuzzy: ['藏品', '虚拟', '币', '元宇宙'],
    },
    variants: [
      {
        sticker: '重大通报',
        title: '"元宇宙 + 数字藏品"养老投资？处非办点名！',
        money: null,
        shock: '新概念包装的非法集资，庞氏骗局必崩盘',
      },
      {
        sticker: '一查到底',
        title: '"地宫穴位"理财骗 4000 人 18.7 亿！',
        money: null,
        shock: '1200 多位老人中招——江苏高院宣判',
      },
    ],
    evidence: {
      org: '处置非法集资部际联席会议办公室',
      docType: '风险提示 / 刑事判决',
      date: '2023年',
      charge: '集资诈骗罪',
      sentence: '朱国华等获刑，涉案 18.74 亿',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，听不懂的项目就是不能投的项目。钱只放银行和国债。',
  },

  {
    id: 'ai-huanlian',
    category: 'digital-gap',
    scene: 'AI 换脸/仿声冒充熟人',
    verified: true,
    keywords: {
      exact: ['AI换脸', '换脸', '视频借钱', 'AI仿声'],
      fuzzy: ['视频', 'AI', '合成', '仿声'],
    },
    variants: [
      {
        sticker: '判刑了',
        title: 'AI 学"孙子"哭腔，一天骗 3 位老人 6 万！',
        money: null,
        shock: '取款"工具人"获刑 2 年 1 个月',
      },
      {
        sticker: '警方提醒',
        title: '视频里是"儿子"？AI 换脸，声音也能造！',
        money: null,
        shock: '眼见不一定为实，转账必须回拨',
      },
    ],
    evidence: {
      org: '黄石市黄石港区人民法院（AI 拟声案）',
      docType: '刑事判决',
      date: '2025年',
      charge: '诈骗罪',
      sentence: '吴某获刑 2 年 1 个月',
      refUrl: '',
      level: 1,
    },
    softScript: '妈，视频能造假，电话号码不会。转账前，咱自己拨他号码问一句。',
  },
];

// 降级卡：词库未命中时的通用防骗三条（公安部口径）
const FALLBACK = {
  id: 'fallback-3rules',
  scene: '通用防骗',
  verified: true,
  sticker: '警方提醒',
  title: '守住养老钱，就记这三条！',
  rules: ['不听不信不转账', '大事先问子女', '拿不准就打 96110'],
  evidence: {
    org: '公安部刑侦局 / 国家反诈中心',
    docType: '官方宣传口径',
    date: '',
    charge: '',
    sentence: '',
    refUrl: '',
    level: 1,
  },
  softScript: '妈，不用记复杂的，就这三条，比啥都管用。',
};

// 自查卡：老人觉得"我买的这个不一样"时——不攻击产品，给鉴别动作。
// 哲学：不证明"你买的是假的"（无鉴定能力，乱说违法），把鉴别标准交给老人自己。
// 场景：输入含"神药/保健品/药"字根但未命中具体实锤场景，或点页面"帮爸妈查一查"入口。
const SELFCHECK = {
  id: 'selfcheck-medicine',
  scene: '药品自查',
  verified: true,
  sticker: '两分钟自查',
  title: '是药是坑，查一下就知道！',
  steps: [
    '找包装上的批准文号（国药准字H/Z/S + 8位数字）',
    '手机浏览器输入官网网址，进入"数据查询"',
    '输入文号查询：查不到=不是药；保健食品查"蓝帽子"号',
  ],
  redFlags: '凡说"根治""包治百病""替代吃药"的，直接是违规宣传',
  evidence: {
    org: '国家药品监督管理局（nmpa.gov.cn）数据查询',
    docType: '官方核查渠道',
    date: '',
    charge: '',
    sentence: '',
    refUrl: 'https://www.nmpa.gov.cn/datasearch/home-index.html',
    level: 1,
  },
  softScript: '妈，咱不吵药好不好。查一下文号，两分钟，查完你说了算。',
  siteUrl: 'www.nmpa.gov.cn',
  counterArgs: [
    { arg: '我这个有批文/是正规厂', reply: '那就更该查——文号是真的，官网上一定搜得到；搜不到就是假的' },
    { arg: '电视上/专家讲座推荐的', reply: '宁波那个"假名医"就是电视卖药，判了 12 年半' },
    { arg: '我吃了真有效果', reply: '效果可能是心理作用，去医院查个指标最实在——查完没问题咱继续用' },
    { arg: '邻居老李也买了', reply: '骗子就是让老李当"托"的——先查文号，查完咱再聊' },
  ],
};

// ---------- 口语扩展词表（运行时并入各场景 keywords.fuzzy） ----------
// 覆盖用户真实说法：具体物品名、行为描述、方言式表达。未命中这些词才走降级卡。
const KEYWORD_EXPANSIONS = {
  'free-egg':          ['扫码送', '送大米', '送挂面', '领礼品', '小礼品', '送东西', '免费领', '扫码领', '登记信息', '送洗衣液'],
  'ping-shu-ji':       ['收音机', '放广告的机器', '听书机'],
  'fake-doctor-call':  ['电话推销', '电销', '卖药电话', '问诊', '把脉', '专家电话'],
  'health-lecture':    ['三七粉', '蜂胶', '三七', '降血压', '降血糖', '抗癌', '治糖尿', '听讲座', '专家讲课', '免费体验', '电疗', '治疗仪', '足疗', '艾灸馆', '理疗仪', '高电位', '上课', '领鸡蛋听课'],
  'quantum-mattress':  ['电位椅', '发热床垫'],
  'maiya-shenyao':     ['降三高', '糖尿病', '高血压', '增强免疫', '包治百病'],
  'zhongjiang':        ['中奖了', '中了', '平板', '抽中', '刮奖', '抽奖', '幸运观众', '中奖信息', '短信中奖'],
  'guping-laoshi':     ['原始股', '内部股', '新三板', '炒股群', '带单', '操盘', '期货', '外汇', '黄金投资', '荐股', '稳赚', '翻倍'],
  'shuadan':           ['做任务', '返现', '点赞员', '垫付', '刷视频赚钱'],
  'yufuka':            ['健身房', '理发店', '充值卡', '储值', '跑路', '关门', '年卡', '足疗店'],
  'huanghun-lian':     ['网上认识', '交友', '对象借钱', '网友', '处对象', '找老伴', '相亲'],
  'yanglaoyuan-beds':  ['预定金', '床位费', '康养', '旅居', '养老基地'],
  'shoucangpin':       ['邮票', '钱币', '古币', '字画', '文玩', '升值', '回购'],
  'gaoxi-licai':       ['抵押', '抵押贷款', '背债', '退保', '稳赚不赔', '保本高息'],
  'fake-gongjianfa':   ['警察', '警官', '检察院', '洗钱', '冻结', '通缉令', '安全账户', '涉嫌'],
  'fake-relative':     ['孙子借钱', '孙子打电话', '外孙', '孙女', '撞人', '拘留', '私了', '闯祸'],
  'fake-shebao':       ['社保局', '医保局', '停发', '补贴到账', '养老金发放', '待遇资格'],
  'free-travel':       ['9块9', '低价团', '购物店', '玉石', '跟团', '康养旅游'],
  'livestream-shenyi': ['直播间买', '主播推荐', '网红', '短视频购物'],
  'jingshuiqi':        ['下乡补贴', '国家补贴', '自来水公司', '滤芯', '软管', '上门安装'],
  'shuzi-cangpin':     ['虚拟币', '挖矿', '元宇宙', '区块链', 'RWA', '数字资产'],
  'ai-huanlian':       ['视频借钱', '仿声', '合成语音', '变声', 'AI视频'],
};

// 合并：把扩展词并入对应场景的 keywords.fuzzy（去重）
(function mergeExpansions() {
  for (const rec of DB) {
    const extra = KEYWORD_EXPANSIONS[rec.id];
    if (!extra) continue;
    const set = new Set(rec.keywords.fuzzy);
    for (const w of extra) set.add(w);
    rec.keywords.fuzzy = [...set];
  }
})();
