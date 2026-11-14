-- ============================================================================
-- 大阪京都 8日冬日遊 (2026/12/17 ~ 2026/12/24) 完整行程與帳務 SQL 匯入腳本
-- (已同步資料庫最新調整：包含自訂圖片網址、Day 1 新增景點與單人攤提費用設定)
-- ============================================================================

-- 1. 先清除舊有的大阪行程相關資料（確保重複執行不會衝突）
DELETE FROM public.tb_itineraries WHERE trip_id = 'trip-osaka-2026';
DELETE FROM public.tb_expenses WHERE trip_id = 'trip-osaka-2026';
DELETE FROM public.tb_packing WHERE trip_id = 'trip-osaka-2026';
DELETE FROM public.tb_trips WHERE id = 'trip-osaka-2026';

-- 2. 建立「大阪京都 8日冬日遊」旅程主檔
INSERT INTO public.tb_trips (id, name, start_date, end_date, status, cover_image, description)
VALUES (
  'trip-osaka-2026',
  '大阪京都 8日冬日遊',
  '2026-12-17',
  '2026-12-24',
  'In progress',
  'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1600&q=80',
  '8天7夜關西冬日雙城自由行：難波心齋橋聖誕燈海、空庭溫泉、新世界通天閣、海遊館、KKday勝尾寺美山嵐山一日遊、清水寺蕾絲和服外拍、伏見稻荷吉伊卡哇與宇治抹茶巡禮'
);

-- ============================================================================
-- 3. 匯入 8 天完整行程卡片 (共 61 筆，含最新圖片網址與行程調整)
-- ============================================================================
INSERT INTO public.tb_itineraries (
  id, trip_id, day_label, location_name, category, description, cost_twd, cost_foreign, currency, image_url, sort_order
) VALUES

-- ============================================================================
-- 【12/17 (四)】
-- ============================================================================
(
  'osaka-2026-d1-1',
  'trip-osaka-2026',
  '12/17 (四)',
  '關西國際機場 (KIX) 抵達 ➔ 搭南海電鐵 Rapi:t 至難波',
  '🚗 移動',
  '11:00 抵達關西國際機場，辦理入境手續、領取行李並啟用日本 8 日吃到飽 eSIM 網路。隨後搭乘「南海電鐵特急 Rapi:t」直達南海難波站（車程約 38 分鐘）。',
  0, 1490, 'JPY',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
  1
),
(
  'osaka-2026-d1-2',
  'trip-osaka-2026',
  '12/17 (四)',
  '心齋橋哈頓飯店 (Hearton Hotel Shinsaibashi) / 人',
  '🏡 住宿',
  'https://maps.app.goo.gl/7joR1z5CbkBU9ZtN8
【連住4晚：12/17 ~ 12/21】先至飯店寄放行李！訂單編號：1795222259｜地址：Nishi Shinsaibashi, 1-5-24, Chuo Ku 大阪 542-0086｜電話：+81-6-6251-3711（含稅總價 USD 239.13，預計 2026/12/12 自動扣款）。',
  3886, 239.13, 'USD',
  'https://ak-d.tripcdn.com/images/02063120008exwrbz9C80_R_960_660_R5_D.jpg',
  2
),
(
  'osaka-2026-d1-3',
  'trip-osaka-2026',
  '12/17 (四)',
  'AEON Mall 大阪巨蛋城市店 (永旺夢樂城)',
  '🛍 購物',
  '自心齋橋搭乘長堀鶴見綠地線至「巨蛋前千代崎站」即達。大型複合式購物中心，日系服飾、雜貨、大型超市與伴手禮應有盡有。',
  0, 0, 'JPY',
  'https://attach.mobile01.com/attach/202405/mobile01-cda91769761e3f6f74a58d4fce578e62.jpg',
  3
),
(
  'osaka-2026-d1-4',
  'trip-osaka-2026',
  '12/17 (四)',
  '【午】AEON Mall 大阪巨蛋城市店 美食街',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：於 AEON Mall 商場美食街享用豐盛平價午餐，座位寬敞舒適、各式日式定食與拉麵選擇多元。',
  0, 1500, 'JPY',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=80',
  4
),
(
  'osaka-2026-d1-5',
  'trip-osaka-2026',
  '12/17 (四)',
  '難波八阪神社 (巨型獅子殿)',
  '⛱ 景點',
  '參拜高達 12 公尺的震撼巨型獅子頭神殿！獅子張開大口象徵吸走厄運、招來勝運與金運，是難波必拍的超人氣特色神社。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMwuGcRqw3pwL6VaQLQkwbDOuO-mUQZAgDdckqN3bH01WAiKoH5D4eED0t&s=10',
  5
),
(
  'osaka-2026-d1-6',
  'trip-osaka-2026',
  '12/17 (四)',
  '【晚】癖が強い麺屋 れいわ (JOJO 拉麵神店) ＋ 元祖章魚燒 (あっちち本舗)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：朝聖充滿《JOJO的奇妙冒險》熱血氛圍的拉麵神店「癖が強い麺屋 れいわ」，再到道頓堀川旁買外皮微酥內餡滑嫩的「あっちち本舗 元祖章魚燒」。',
  0, 1800, 'JPY',
  'https://tblg.k-img.com/restaurant/images/Rvw/249225/640x640_rect_7e50870f992667852d68cda71d46db08.jpg',
  6
),
(
  'osaka-2026-d1-7',
  'trip-osaka-2026',
  '12/17 (四)',
  '道頓堀霓虹商圈 ＆ 御堂筋聖誕燈海',
  '⛱ 景點',
  '晚上逛道頓堀商圈、與固力果跑跑人看板合照，並漫步欣賞冬季限定的「御堂筋 Illumination 聖誕燈海」，感受長達數公里的璀璨浪漫燈飾大道。',
  0, 0, 'JPY',
  'https://static.wixstatic.com/media/3eef8e_fe7cedd7dff740e9849b7560df6fcf6d~mv2.jpg/v1/fill/w_568,h_406,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/3eef8e_fe7cedd7dff740e9849b7560df6fcf6d~mv2.jpg',
  7
),
(
  'itin-1794659533381',
  'trip-osaka-2026',
  '12/17 (四)',
  '寶可夢中心 大阪店 DX',
  '⛱ 景點',
  'https://maps.app.goo.gl/FSJyNyAfp2geUiwD6',
  0, 0, 'JPY',
  'https://truth.bahamut.com.tw/s01/201910/6ecfe146071c1a2bbefa73e9837ef344.JPG',
  60
),
(
  'itin-1794659748842',
  'trip-osaka-2026',
  '12/17 (四)',
  'COLONY by EQI - 大阪難波/咖啡店',
  '⛱ 景點',
  'https://maps.app.goo.gl/7wTQsKNq45g5pDWeA',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwQ6GR8Ikpy_2hhOfFa02GLzk-5az-Q-dpxT9GEm1rFyblCmh9o_7TrBlf&s=10',
  61
),

-- ============================================================================
-- 【12/18 (五)】
-- ============================================================================
(
  'osaka-2026-d2-1',
  'trip-osaka-2026',
  '12/18 (五)',
  '地鐵移動前往天神橋（今日自行刷卡搭車，不用買周遊卡）',
  '🚗 移動',
  '[自行刷卡搭車，不用買周遊卡] 10:00 自心齋橋搭乘地鐵前往「南森町站 / 天神橋筋六丁目站」。',
  0, 240, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg29uKhirO7cRQmdfbI3Nd3cFVaMCvPQ_JQ0PJRtqPE-MAeil_mXQSmoQ&s=10',
  8
),
(
  'osaka-2026-d2-2',
  'trip-osaka-2026',
  '12/18 (五)',
  '天神橋筋商店街 ＆ 大阪天滿宮',
  '⛱ 景點',
  '10:00 漫步日本最長拱廊商店街「天神橋筋商店街」，感受道地大阪庶民風情；順道參拜學問之神「大阪天滿宮」，祈求順遂平安。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTohOKKCsYR8S5lJIpI0gUOM9YC7uEneWrStQW-VgKgEw&s=10',
  9
),
(
  'osaka-2026-d2-3',
  'trip-osaka-2026',
  '12/18 (五)',
  '【午】魚伊鰻魚飯 或 可樂餅中村屋 (天神橋百年名店)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：品嚐炭火備長炭現烤、外酥內嫩的百年老店「魚伊鰻魚飯」，並買剛出爐金黃酥脆的超人氣「中村屋可樂餅」。',
  0, 1800, 'JPY',
  'https://letsplay.tw/wp-content/uploads/2024/07/137918_0.jpg',
  10
),
(
  'osaka-2026-d2-4',
  'trip-osaka-2026',
  '12/18 (五)',
  '梅田商圈悠閒逛街 (LUCUA / GRAND FRONT / 阪急百貨)',
  '🛍 購物',
  '下午前往大阪最繁華的梅田各大百貨商圈，悠閒逛街採買日系流行服飾、生活雜貨與人氣甜點伴手禮。',
  0, 0, 'JPY',
  'https://upload.wikimedia.org/wikipedia/commons/c/ce/Umeda_Hankyu.JPG?utm_source=zh.wikipedia.org&utm_campaign=index&utm_content=original',
  11
),
(
  'osaka-2026-d2-5',
  'trip-osaka-2026',
  '12/18 (五)',
  '空庭溫泉 OSAKA BAY TOWER (泡湯穿浴衣拍照)',
  '⛱ 景點',
  '16:00 抵達關西最大安土桃山時代主題溫泉樂園「空庭溫泉」（弁天町站直結）！挑選喜愛的浴衣在千坪空中日式庭園、足湯與水景鳥居拍照打卡，享受天然溫泉放鬆身心。',
  0, 2600, 'JPY',
  'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/b7dnj2lwir7hefagq2ju.jpg',
  12
),
(
  'osaka-2026-d2-6',
  'trip-osaka-2026',
  '12/18 (五)',
  '【晚】きじ 木地大阪燒 或 人類都是麵類 (梅田 Tabelog 3.76 超高分拉麵)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：享用新梅田食道街傳奇名店「きじ 木地大阪燒」，或品嚐 Tabelog 高達 3.76 分、厚切叉燒入口即化的貝系醬油拉麵「人類みな麺類」。',
  0, 1600, 'JPY',
  'https://static.gltjp.com/glt/data/article/11000/10972/20161115_082742_8d3bf143_w1920.webp',
  13
),
(
  'osaka-2026-d2-7',
  'trip-osaka-2026',
  '12/18 (五)',
  '中之島「光之文藝復興」聖誕燈海',
  '⛱ 景點',
  '20:00 漫步中之島公園與大阪市中央公會堂，欣賞冬日最具代表性的「OSAKA 光之文藝復興」光雕投影秀、櫸木並木道燈海與熱鬧聖誕市集。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX3FF4qm36h8GXYZuxlN8XQeLJ71PaPx1ijBsYdp_q_ckyjL7tPobiLaOE&s=10',
  14
),

-- ============================================================================
-- 【12/19 (六)】
-- ============================================================================
(
  'osaka-2026-d3-1',
  'trip-osaka-2026',
  '12/19 (六)',
  '啟用「大阪周遊卡 1 日券」出發前往大國町站',
  '🚗 移動',
  '[使用：大阪周遊卡 1 日券] 今日無限次搭乘大阪 Metro 地鐵，並免費暢遊通天閣與天王寺動物園等熱門設施！',
  0, 3300, 'JPY',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
  15
),
(
  'osaka-2026-d3-2',
  'trip-osaka-2026',
  '12/19 (六)',
  '木津卸売市場 (早市海鮮與當季草莓)',
  '⛱ 景點',
  '09:00 造訪深受大阪在地人與主廚喜愛的「木津卸売市場」，比觀光市場更道地親民，可品嚐新鮮海膽、生魚片與香甜日本冬草莓。',
  0, 0, 'JPY',
  'https://img.letsgojp.com/2025/10/KizuIchiba%20phtoAC-1920x1440-1759771141.webp',
  16
),
(
  'osaka-2026-d3-3',
  'trip-osaka-2026',
  '12/19 (六)',
  '新世界本通 ＆ 通天閣展望台',
  '⛱ 景點',
  '11:00 漫步充滿昭和復古巨型招牌的「新世界本通」，並持大阪周遊卡免費登上大阪象徵地標「通天閣」，摸摸比利肯福神腳底祈求好運。',
  0, 0, 'JPY',
  'https://image.kkday.com/v2/image/get/c_fit%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_174504/20260717072444_AIgpZ/png',
  17
),
(
  'osaka-2026-d3-4',
  'trip-osaka-2026',
  '12/19 (六)',
  '【午】串炸八重勝 或 串炸達摩 (新世界超狂排隊名店)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：在新世界品嚐現炸酥脆、麵衣薄透不油膩的「串炸八重勝」或元祖「串炸達摩」，必點炸牛肉串、炸蝦與半熟蛋！',
  0, 1800, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUOReBqiwgnuh8XQWYDf13zFtVZ-KU8v8wXHnaZOYQNytXHdPFoQ7aYAQ&s=10',
  18
),
(
  'osaka-2026-d3-5',
  'trip-osaka-2026',
  '12/19 (六)',
  '天王寺動物園',
  '⛱ 景點',
  '13:30 持大阪周遊卡免費入園！擁有百年歷史的都會綠洲動物園，近距離觀賞北極熊、小熊貓、企鵝與非洲熱帶草原區動物。',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80',
  19
),
(
  'osaka-2026-d3-6',
  'trip-osaka-2026',
  '12/19 (六)',
  '阿倍野 HARUKAS 300 展望台 (百萬夜景)',
  '⛱ 景點',
  '17:00 登上高達 300 公尺的摩天大樓「阿倍野 HARUKAS 300」，從日落魔幻時刻一路飽覽 360 度震撼的大阪璀璨百萬夜景！',
  0, 2000, 'JPY',
  'https://tw.wamazing.com/media/wp-content/uploads/sites/4/2025/03/abenoharukas_pixta_94540077_M.jpg.webp',
  20
),
(
  'osaka-2026-d3-7',
  'trip-osaka-2026',
  '12/19 (六)',
  '【晚】道頓堀肉劇場 (大劇場丼免費加飯) 或 北極星蛋包飯 (百年創始店)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：享用四種炭火炙燒肉品鋪滿整碗、免費加飯加醬的「道頓堀肉劇場 大劇場丼」，或造訪古色古香庭園建築的百年蛋包飯創始店「北極星」。',
  0, 1600, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs7eZJEVk9fp9mqgwdWfKQd5JahhW6lesIZKSVXbqKxIXVnPmP1wSzIlI&s=10',
  21
),

-- ============================================================================
-- 【12/20 (日)】
-- ============================================================================
(
  'osaka-2026-d4-1',
  'trip-osaka-2026',
  '12/20 (日)',
  '睡飽出發 ➔ 搭地鐵中央線前往「大阪港站」',
  '🚗 移動',
  '今日不趕行程，睡飽養足精神後，由心齋橋搭乘地鐵轉乘中央線直達「大阪港站」。',
  0, 290, 'JPY',
  'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80',
  22
),
(
  'osaka-2026-d4-2',
  'trip-osaka-2026',
  '12/20 (日)',
  '大阪海遊館 (看巨大鯨鯊與聖誕老人潛水員)',
  '⛱ 景點',
  '世界最大級室內水族館！沿著巨型水槽螺旋坡道探索環太平洋海洋生態，必看震撼鯨鯊、呆萌圓滾滾海豹，以及冬季限定的「聖誕老人潛水員」驚喜互動！',
  0, 2700, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTATNre5qYFtdDAW4TNSu42f6-N-DpjGT-kF7F4OWJchNVkuna0KI5LCY0&s=10',
  23
),
(
  'osaka-2026-d4-3',
  'trip-osaka-2026',
  '12/20 (日)',
  '【午】自由軒咖哩飯 (大阪最古老西餐廳)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：創立於明治 43 年的大阪最古老西餐廳「自由軒」，必點招牌名物咖哩飯，打上一顆生雞蛋與特製醬汁趁熱拌勻，濃郁微辣超經典。',
  0, 1200, 'JPY',
  'https://www.bring-you.info/imgs/2018/08/Jiyuu-ken-11.jpg',
  24
),
(
  'osaka-2026-d4-4',
  'trip-osaka-2026',
  '12/20 (日)',
  '美國村、橘街 (Orange Street)、心齋橋 PARCO 6F 哥吉拉商店',
  '🛍 購物',
  '下午回心齋橋深度逛街：走訪潮流街頭感十足的「美國村」、質感選品與潮牌聚集的「橘街 (立花通)」，以及「心齋橋 PARCO 6F」哥吉拉官方商店、吉卜力橡子共和國與人氣動漫角色專賣店。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyuq-X5WoJn-Apl_6pUE7oqcbCTV9Jp96veWgUrywpjSuwlbeIwXM86h8&s=10',
  25
),
(
  'osaka-2026-d4-5',
  'trip-osaka-2026',
  '12/20 (日)',
  '傍晚道頓堀散步',
  '⛱ 景點',
  '傍晚沿著道頓堀運河悠閒散步，感受大阪最後一晚的熱鬧招牌與冬夜氛圍。',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80',
  26
),
(
  'osaka-2026-d4-6',
  'trip-osaka-2026',
  '12/20 (日)',
  '【晚】金龍拉麵 道頓堀店 (24H 營業，無限加辣韭菜＆泡菜)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：道頓堀最具代表性的立體青龍招牌「金龍拉麵」，醇厚不膩的豚骨湯頭搭配無限免費取用的辣韭菜、辣泡菜與蒜泥，超滿足！',
  0, 1000, 'JPY',
  'https://bobbytravel.tw/wp-content/uploads/2025/03/20250313092049_0_06890f.jpg',
  27
),
(
  'osaka-2026-d4-7',
  'trip-osaka-2026',
  '12/20 (日)',
  'MEGA 唐吉訶德 難波千日前店 (大阪最後採買)',
  '🛍 購物',
  '前往賣場超寬敞、貨色最齊全的「MEGA 唐吉訶德難波千日前店」最後大採買，一次買齊藥妝、零食與伴手禮並打包入箱，準備明早帶行李移動至京都。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI861oMkATuU5jh3ZmDD5k4lMCRkDy7pGab7uCXs6Icw&s=10',
  28
),

-- ============================================================================
-- 【12/21 (一)】
-- ============================================================================
(
  'osaka-2026-d5-1',
  'trip-osaka-2026',
  '12/21 (一)',
  'KKday 勝尾寺、嵐山一日遊 / 人',
  '🚗 移動',
  '【已付款 NT$ 2,782｜成人2人】退房並攜帶所有大件行李上遊覽車！07:45 於「日本橋站 2 號出口」集合出發，參加「京都美山合掌村・勝尾寺・嵐山竹林・野宮神社一日遊（京都解散）」。',
  1391, 0, 'JPY',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
  29
),
(
  'osaka-2026-d5-2',
  'trip-osaka-2026',
  '12/21 (一)',
  '勝尾寺 (滿山達摩不倒翁 ＆ 蓋 6 色達摩明信片)',
  '⛱ 景點',
  '09:00 抵達祈求「勝運」聞名的千年古剎「勝尾寺」。寺院石階、樹梢與池畔擺滿無數祈願小達摩，必玩園區巡禮收集 6 個印章，疊印出超驚豔的「6 色達摩明信片」！',
  0, 500, 'JPY',
  'https://res.klook.com/image/upload/activities/icwcgt4q7btbekmpvecm.jpg',
  30
),
(
  'osaka-2026-d5-3',
  'trip-osaka-2026',
  '12/21 (一)',
  '美山合掌村 (茅草屋之里)',
  '⛱ 景點',
  '12:00 造訪日本三大茅葺屋聚落之一的「美山町北村」，保留江戶時代原貌的傳統茅草屋頂農舍與紅色郵筒，冬日山谷氛圍寧靜迷人。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWyr4j-U-dq55gIHDM10BtnucPT_kaiQu1so1Xsv3Q-ZNeLjKWKPYsmVSc&s=10',
  31
),
(
  'osaka-2026-d5-4',
  'trip-osaka-2026',
  '12/21 (一)',
  '【午】美山合掌村輕食＆美山牛奶冰淇淋 / 嵐山 米菲櫻花廚房造型麵包',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：於美山品嚐香濃必吃的「美山牛乳冰淇淋」與在地輕食，下午至嵐山再去「Miffy 櫻花廚房」買超療癒米菲兔紅豆磚與造型麵包。',
  0, 1500, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnRQrvhYqTsG8JJv14m56WF0REK6IgvlZlClA03XuOJNPRWPLrWXyAk8Wf&s=10',
  32
),
(
  'osaka-2026-d5-5',
  'trip-osaka-2026',
  '12/21 (一)',
  '嵐山漫步 (竹林小徑、渡月橋、野宮神社)',
  '⛱ 景點',
  '14:20 漫步京都經典名勝「嵐山」：走進高聳幽靜的「竹林小徑」、參拜祈求良緣與學業的「野宮神社」黑木鳥居，並欣賞橫跨桂川的「渡月橋」絕景。',
  0, 0, 'JPY',
  'https://assets.funliday.com/posts/wp-content/uploads/2025/10/01114225/%E4%BA%AC%E9%83%BD%E5%B5%90%E5%B1%B1.webp',
  33
),
(
  'osaka-2026-d5-6',
  'trip-osaka-2026',
  '12/21 (一)',
  '17:20 京都站下車解散 ➔ 搭車前往 Travelodge 放行李',
  '🚗 移動',
  '17:20 巴士於「京都站」下車解散，領取隨車行李後搭車前往四條河原町彩鴻飯店辦理入住。',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1000&q=80',
  34
),
(
  'osaka-2026-d5-7',
  'trip-osaka-2026',
  '12/21 (一)',
  '京都四條河原町彩鴻飯店 (Travelodge Kyoto Shijo Kawaramachi) / 人',
  '🏡 住宿',
  '【連住3晚：12/21 ~ 12/24】地址：240 Yamazaki-cho, 2 chome, Kawaramachi-dori Sanjo-sagaru, Nakagyo Ward, Kyoto 604-8032｜電話：+81-75-255-8811（含稅總價 JPY 17,508，預計 2026/12/17 自動扣款）。',
  1926, 17508, 'JPY',
  'https://www.tw.kayak.com/rimg/himg/1c/f4/20/expediav2-344655-f82278-798901.jpg?width=836&height=607&crop=true',
  35
),
(
  'osaka-2026-d5-8',
  'trip-osaka-2026',
  '12/21 (一)',
  '【晚】麺屋 猪一 (京都米其林必比登清湯拉麵) 或 名代豬排 かつくら 三條本店',
  '🧁 吃喝',
  '🍴 部落客激推必吃：品嚐連續蟬聯米其林必比登推薦、琥珀色魚介清湯搭配現刨北海道羅臼昆布絲的「麺屋 猪一」，或享用外酥內嫩、現磨芝麻香氣四溢的「名代豬排 かつくら 三條本店」。',
  0, 1800, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnuLfqvXKL5QNvXMTLwyR34Ls9m__iTxBwc_USQAgFGQ&s=10',
  36
),

-- ============================================================================
-- 【12/22 (二)】
-- ============================================================================
(
  'osaka-2026-d6-1',
  'trip-osaka-2026',
  '12/22 (二)',
  '09:45 悠閒出發前往東山清水道',
  '🚗 移動',
  '09:45 從飯店悠閒出發，搭乘京都市營巴士或計程車前往「Okimono屋 清水店」。',
  0, 230, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLbLNg8E9XgADOrjgbwCGRCZGJy7Gua0tNRdObRO3tNK_4yVi66bgMkjo&s=10',
  37
),
(
  'osaka-2026-d6-2',
  'trip-osaka-2026',
  '12/22 (二)',
  '10:30 Okimono屋 清水店 換蕾絲和服',
  '⛱ 景點',
  '【已付款 NT$ 1,529】預約 10:30 體驗：含「女士高級蕾絲和服方案（含日系設計髮型）NT$ 933」＋「男士標準和服方案 NT$ 596」，挑選唯美蕾絲和服與精緻髮飾造型。',
  1529, 0, 'JPY',
  'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_971/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/zk8la2rccldqvccgpsv7/%E4%BA%AC%E9%83%BD%E6%9D%B1%E5%B1%B1%E7%A5%87%E5%9C%92%E5%92%8C%E6%9C%8D%E6%94%9D%E5%BD%B1%E6%97%85%E6%8B%8D(Okimono%E5%B1%8B).jpg',
  38
),
(
  'osaka-2026-d6-3',
  'trip-osaka-2026',
  '12/22 (二)',
  '11:30 - 12:30 專屬攝影師東山外拍 / 人',
  '⛱ 景點',
  '【已付款 NT$ 3,723】1 小時專屬攝影服務（Okimono屋 清水店提供）：由專業攝影師帶領走訪東山古街巷弄，引導動作並捕捉最具京都韻味的雙人和服寫真。',
  1861, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9VoTvgyZXFvy6LRdxBji0QtV8NV4yDwC9ZKIzjYOBEOsesJ7eWU9ydgY&s=10',
  39
),
(
  'osaka-2026-d6-4',
  'trip-osaka-2026',
  '12/22 (二)',
  '【午】名代おめん Omen 高台寺店 (京野菜烏龍沾麵)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：位於高台寺旁的人氣名店「名代おめん」，Q 彈滑順的手打烏龍麵搭配溫熱日式沾汁、滿滿胡麻與色彩繽紛的時令京野菜，清爽又美味。',
  0, 1600, 'JPY',
  'https://www.bring-you.info/imgs/2023/11/omen-kyoto-12.jpg',
  40
),
(
  'osaka-2026-d6-5',
  'trip-osaka-2026',
  '12/22 (二)',
  '穿和服漫步 清水寺、二三年坂 ➔ 16:30 歸還和服',
  '⛱ 景點',
  '下午穿著蕾絲和服漫步世界遺產「清水寺」舞台與音羽之瀧，沿著充滿京都風情的「三年坂 (產寧坂)、二年坂」石階步道逛特色小店、拍八坂塔，並於 16:30 前返回店家歸還和服。',
  0, 500, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJJRb_UKLvc2vhw1jBqj25LuUW4zwK5I3ksBtBlVVGjA&s=10',
  41
),
(
  'osaka-2026-d6-6',
  'trip-osaka-2026',
  '12/22 (二)',
  '四條河原町逛街 ＆ 寶可夢中心京都店 (SUINA室町 2F)',
  '🛍 購物',
  '晚上前往四條烏丸「SUINA 室町 2F」朝聖「寶可夢中心京都店 (Pokémon Center Kyoto)」，必看京都限定和服皮卡丘與鳳王，隨後漫步四條河原町、新京極與寺町通商店街。',
  0, 0, 'JPY',
  'https://alinalife.tw/pingpig/1494394787-2389048801.jpg',
  42
),
(
  'osaka-2026-d6-7',
  'trip-osaka-2026',
  '12/22 (二)',
  '【晚】天丼まきの (Makino) 京都寺町店',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：座落於寺町京極商店街，師傅在吧台前現點現炸的浮誇系「天婦羅丼飯」，滿滿大蝦、海鮮、時蔬與爆漿炸半熟蛋淋上秘製醬汁超銷魂！',
  0, 1700, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmBvSetsNPXMWzO3pPvhLS3noAuzcZGBSQHTYg5CybGO8LoFZ7MF4Rv2eQ&s=10',
  43
),

-- ============================================================================
-- 【12/23 (三)】
-- ============================================================================
(
  'osaka-2026-d7-1',
  'trip-osaka-2026',
  '12/23 (三)',
  '08:30 搭京阪電車前往「伏見稻荷站」',
  '🚗 移動',
  '08:30 自飯店步行至「祇園四條站」，搭乘京阪本線直達「伏見稻荷站」（車程約 10 分鐘），一早前往避開旅遊團人潮。',
  0, 220, 'JPY',
  'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1000&q=80',
  44
),
(
  'osaka-2026-d7-2',
  'trip-osaka-2026',
  '12/23 (三)',
  '伏見稻荷大社 (千本鳥居)',
  '⛱ 景點',
  '全日本三萬座稻荷神社總本宮！走入綿延山頭、朱紅色彩交織的壯觀「千本鳥居」隧道拍照，並欣賞可愛的狐狸使者雕像與狐狸繪馬。',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1000&q=80',
  45
),
(
  'osaka-2026-d7-3',
  'trip-osaka-2026',
  '12/23 (三)',
  '09:30 吉伊卡哇 MOGUMOGU 本舖 京都伏見店',
  '🛍 購物',
  '09:30 準時進場！位於伏見稻荷參道上的超人氣「ちいかわもぐもぐ本舗」，必買京都伏見店限定的「稻荷狐狸造型吉伊卡哇、小八貓、烏薩奇」絨毛玩偶、吊飾與瓦煎餅伴手禮！',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_MrSN0OV0sjVx1KyEr_4R4I8840RTXwhvcJTK0T9TnMBVLHQ1mMErVNs&s=10',
  46
),
(
  'osaka-2026-d7-4',
  'trip-osaka-2026',
  '12/23 (三)',
  '11:00 續搭京阪電車前往「宇治」',
  '🚗 移動',
  '11:00 由伏見稻荷站搭乘京阪本線至「中書島站」，轉乘京阪宇治線抵達抹茶故鄉「宇治站」（車程約 30 分鐘）。',
  0, 310, 'JPY',
  'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000&q=80',
  47
),
(
  'osaka-2026-d7-5',
  'trip-osaka-2026',
  '12/23 (三)',
  '【午】中村藤吉 或 伊藤久右衛門 (宇治抹茶蕎麥麵＆聖代)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：可先抽「中村藤吉本店」號碼牌再逛街，品嚐翠綠清香的「抹茶蕎麥麵」與招牌竹筒抹茶聖代，或造訪百年名店「伊藤久右衛門」享用宇治抹茶芭菲。',
  0, 1800, 'JPY',
  'https://shoplineimg.com/672061e9f18ba70038fd8362/69cb71d3ffb3331cb3f53904/750x.jpg?',
  48
),
(
  'osaka-2026-d7-6',
  'trip-osaka-2026',
  '12/23 (三)',
  '宇治漫步 (平等院鳳凰堂、宇治橋、宇治上神社)',
  '⛱ 景點',
  '造訪日幣 10 元硬幣圖案的世界遺產「平等院鳳凰堂」，漫步表參道茶街、跨越宇治川上的「宇治橋」，並參拜日本現存最古老神社建築「宇治上神社」與索取兔子籤詩。',
  0, 700, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3WFuD5sSaFxHruO1bvuJKtKPIuahf_Oa1AZyf5mropYAd-OEeECSosXI&s=10',
  49
),
(
  'osaka-2026-d7-7',
  'trip-osaka-2026',
  '12/23 (三)',
  '傍晚返回四條河原町 最後伴手禮採買',
  '🛍 購物',
  '傍晚搭京阪電車返回祇園四條 / 河原町，於高島屋、河原町 OPA 或藥妝店補齊京都限定伴手禮。',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80',
  50
),
(
  'osaka-2026-d7-8',
  'trip-osaka-2026',
  '12/23 (三)',
  '【晚】壽喜燒 キムラ (Kimura 京都百年平價關西風壽喜燒)',
  '🧁 吃喝',
  '🍴 部落客激推必吃：創立於昭和初期的寺町通百年名店「すき焼き キムラ」，在充滿懷舊昭和風情的傳統榻榻米包廂座席，以超親民價格享用濃郁鮮甜的國產和牛壽喜燒！',
  0, 3300, 'JPY',
  'https://live.staticflickr.com/65535/52980610941_6852059aa4_c.jpg',
  51
),

-- ============================================================================
-- 【12/24 (四)】
-- ============================================================================
(
  'osaka-2026-d8-1',
  'trip-osaka-2026',
  '12/24 (四)',
  '08:30 退房並寄放行李 ➔ 搭市營巴士直達金閣寺',
  '🚗 移動',
  '08:30 辦理退房並將大型行李寄放於彩鴻飯店櫃檯，於四條河原町搭乘京都市營巴士（205 號）直達「金閣寺道」。',
  0, 230, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWhxZjn1bL84IQ3sEWu42aKh3OQb_-K_qofgcqoNlCutzxmxIqj7cShc&s=10',
  52
),
(
  'osaka-2026-d8-2',
  'trip-osaka-2026',
  '12/24 (四)',
  '金閣寺 (鹿苑寺・金碧輝煌舍利殿)',
  '⛱ 景點',
  '09:00 參拜京都代表性的世界文化遺產「金閣寺」，欣賞貼滿純金箔的舍利殿倒映在鏡湖池上的絕美景致，並收藏獨特的「守護符門票」。',
  0, 500, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyQ-HJd0TkVhosz0ze7fsWY4hM717be6FYc_1qBwDqcmz1uCwLG9xmm08&s=10',
  53
),
(
  'osaka-2026-d8-3',
  'trip-osaka-2026',
  '12/24 (四)',
  '11:30 回飯店領行李 ➔ 京都車站拍 22 公尺巨型聖誕樹',
  '⛱ 景點',
  '11:30 回彩鴻飯店領取行李前往京都車站，在室町小路廣場與高達 22 公尺的「京都車站巨型聖誕樹」及大階段流水燈海合照，收集滿滿平安夜儀式感！',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80',
  54
),
(
  'osaka-2026-d8-4',
  'trip-osaka-2026',
  '12/24 (四)',
  '搭 JR 特急 HARUKA 轉車前往「臨空城站」',
  '🚗 移動',
  '由京都車站搭乘關西機場特急「HARUKA」至天王寺或日根野站轉乘關西空港線至「臨空城站 (Rinku Town)」，將行李寄放於車站或 Outlet 寄物櫃。',
  0, 2200, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-A3rPHofg7jLidYTXXwYFUJTARpA44k4WPa8e_W8nalHCNn56TaFqs6Zz&s=10',
  55
),
(
  'osaka-2026-d8-5',
  'trip-osaka-2026',
  '12/24 (四)',
  '【午】臨空城 Outlet 美食街 (Kua Aina 夏威夷漢堡)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：於臨空城享用來自夏威夷的超人氣「KUA`AINA 漢堡」，熔岩石炭火現烤多汁厚牛肉排配上大塊新鮮酪梨與酥脆細薯條超滿足！',
  0, 1600, 'JPY',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
  56
),
(
  'osaka-2026-d8-6',
  'trip-osaka-2026',
  '12/24 (四)',
  '臨空城 Rinku Premium Outlets 最後血拚',
  '🛍 購物',
  '關西最大規模海景 Outlet！把握回國前最後時光掃貨歐美日系服飾、運動球鞋與精品配件。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwfUexYZViOTcWbgj3DtgAdYE3CD8l5rbOgQfmX_VgL7Igo0-i0LVsYMW3&s=10',
  57
),
(
  'osaka-2026-d8-7',
  'trip-osaka-2026',
  '12/24 (四)',
  '17:45 關西國際機場 (KIX) 報到 ✈️ 20:55 平安夜班機返台',
  '🚗 移動',
  '從臨空城搭乘一站電車（5 分鐘）直達關西機場第一航廈，17:45 辦理 20:55 班機登機報到與託運行李。',
  0, 370, 'JPY',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
  58
),
(
  'osaka-2026-d8-8',
  'trip-osaka-2026',
  '12/24 (四)',
  '【晚】關西機場 T1 美食街 (神座拉麵 / 買 551 蓬萊肉包)',
  '🧁 吃喝',
  '🍴 部落客激推必吃（單人 400 台幣內）：登機前在關西機場 T1 品嚐滿載鮮甜白菜與秘製湯頭的「どうとんぼり神座拉麵」，再買盒熱騰騰多汁的「551 蓬萊豬肉包」，帶著滿滿回憶平安夜返台！',
  0, 1500, 'JPY',
  'https://pengu777.com/wp-content/uploads/2024/06/%E7%A5%9E%E5%BA%A7%E6%8B%89%E9%BA%B5-%E5%A4%A7%E9%98%AA%E7%BE%8E%E9%A3%9F%E6%8E%A8%E8%96%A69.jpg',
  59
);

-- ============================================================================
-- 4. 匯入獨立費用記帳 (共 2 筆)
-- ============================================================================
INSERT INTO public.tb_expenses (id, trip_id, item_name, amount, is_paid, category, payer)
VALUES
  ('osaka-2026-exp-esim', 'trip-osaka-2026', '日本 eSIM 原生網路｜8天吃到飽 (Softbank 5G / Docomo)', 520, true, '網路通訊', '預付訂購'),
  ('exp-1794659353086', 'trip-osaka-2026', '來回機票', 11932, true, '機票', '公費');

-- ============================================================================
-- 5. 匯入大阪京都冬日遊專屬行李與備忘清單 (共 10 筆)
-- ============================================================================
INSERT INTO public.tb_packing (id, trip_id, item_name, category, is_packed)
VALUES
  ('osaka-2026-pack-1', 'trip-osaka-2026', '護照 (效期滿6個月以上) ＆ Visit Japan Web QR Code', '證件', false),
  ('osaka-2026-pack-2', 'trip-osaka-2026', '日本 8 天吃到飽 eSIM 憑證 (已付 NT$520)', '3C用品', true),
  ('osaka-2026-pack-3', 'trip-osaka-2026', '心齋橋哈頓飯店 ＆ 京都彩鴻飯店 入住憑證', '證件', true),
  ('osaka-2026-pack-4', 'trip-osaka-2026', 'KKday 郊區一日遊 ＆ Okimono屋和服攝影 電子憑證', '證件', true),
  ('osaka-2026-pack-5', 'trip-osaka-2026', '日幣現金 (含神社參拜與市場零錢) ＆ 海外回饋信用卡', '財務', false),
  ('osaka-2026-pack-6', 'trip-osaka-2026', 'ICOCA 交通卡 (或 Apple Pay 綁定 ICOCA) ＆ 大阪周遊卡 1 日券', '財務', false),
  ('osaka-2026-pack-7', 'trip-osaka-2026', '保暖防風大衣 / 發熱衣 / 圍巾 / 手套 (12月美山與嵐山較冷)', '衣物', false),
  ('osaka-2026-pack-8', 'trip-osaka-2026', '好走的運動休閒鞋 (每日萬步起跳)', '衣物', false),
  ('osaka-2026-pack-9', 'trip-osaka-2026', '行動電源 (不可放託運) ＆ 充電線', '3C用品', false),
  ('osaka-2026-pack-10', 'trip-osaka-2026', '保濕乳液 / 護唇膏 / 暖暖包 / 個人常備藥品', '個人用品', false);
