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
-- 3. 匯入 8 天完整行程卡片 (共 63 筆，含最新圖片網址與行程調整)
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
  '心齋橋哈頓飯店 (Hearton Hotel Shinsaibashi)',
  '🏡 住宿',
  'https://maps.app.goo.gl/7joR1z5CbkBU9ZtN8
【連住4晚：12/17 ~ 12/21】先至飯店寄放行李！訂單編號：1795222259｜地址：Nishi Shinsaibashi, 1-5-24, Chuo Ku 大阪 542-0086｜電話：+81-6-6251-3711（含稅總價 USD 239.13，預計 2026/12/12 自動扣款）。',
  3886, 239.13, 'USD',
  'https://ak-d.tripcdn.com/images/02063120008exwrbz9C80_R_960_660_R5_D.jpg',
  2
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
  3
),
(
  'osaka-2026-d1-3',
  'trip-osaka-2026',
  '12/17 (四)',
  'AEON Mall 大阪巨蛋城市店 (永旺夢樂城)',
  '🛍 購物',
  'https://maps.app.goo.gl/AP3ab8jmhQwx42vQ8
自心齋橋搭乘長堀鶴見綠地線至「巨蛋前千代崎站」即達。大型複合式購物中心，日系服飾、雜貨、大型超市與伴手禮應有盡有。',
  0, 0, 'JPY',
  'https://attach.mobile01.com/attach/202405/mobile01-cda91769761e3f6f74a58d4fce578e62.jpg',
  4
),
(
  'osaka-2026-d1-5',
  'trip-osaka-2026',
  '12/17 (四)',
  '難波八阪神社 (巨型獅子殿)',
  '⛱ 景點',
  'https://maps.app.goo.gl/LC1eXw8gd4cjz1Jx5
參拜高達 12 公尺的震撼巨型獅子頭神殿！獅子張開大口象徵吸走厄運、招來勝運與金運，是難波必拍的超人氣特色神社。',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMwuGcRqw3pwL6VaQLQkwbDOuO-mUQZAgDdckqN3bH01WAiKoH5D4eED0t&s=10',
  5
),
(
  'osaka-2026-d1-6',
  'trip-osaka-2026',
  '12/17 (四)',
  '【晚】癖が強い麺屋 れいわ  ＋ 元祖章魚燒 (あっちち本舗)0',
  '🧁 吃喝',
  'https://maps.app.goo.gl/spy8rf5sX1ZahDK27
https://maps.app.goo.gl/dUcPzhH1Ldmp9rPE8',
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
  'itin-1794659748842',
  'trip-osaka-2026',
  '12/17 (四)',
  'COLONY by EQI - 大阪難波/咖啡店',
  '⛱ 景點',
  'https://maps.app.goo.gl/7wTQsKNq45g5pDWeA',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwQ6GR8Ikpy_2hhOfFa02GLzk-5az-Q-dpxT9GEm1rFyblCmh9o_7TrBlf&s=10',
  8
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
  9
),
(
  'osaka-2026-d2-2',
  'trip-osaka-2026',
  '12/18 (五)',
  '天神橋筋商店街 ＆ 大阪天滿宮',
  '⛱ 景點',
  'https://maps.app.goo.gl/vUk1dVzvL1h1TRko8',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTohOKKCsYR8S5lJIpI0gUOM9YC7uEneWrStQW-VgKgEw&s=10',
  10
),
(
  'osaka-2026-d2-3',
  'trip-osaka-2026',
  '12/18 (五)',
  '【午】魚伊鰻魚飯 或 可樂餅中村屋',
  '🧁 吃喝',
  'https://maps.app.goo.gl/BvH7f8LxKbyMATj26',
  0, 1800, 'JPY',
  'https://letsplay.tw/wp-content/uploads/2024/07/137918_0.jpg',
  11
),
(
  'itin-1794666091250',
  'trip-osaka-2026',
  '12/18 (五)',
  'ちいかわベーカリー OSAKA',
  '⛱ 景點',
  'https://maps.app.goo.gl/uX8xXguKX58iMYXu5',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA8JvrjJBU_9pdc7APPFhNN6gtvoiOHe9neI91ML7m0WxwGGZwmJi7PfE&s=10',
  12
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
  13
),
(
  'osaka-2026-d2-5',
  'trip-osaka-2026',
  '12/18 (五)',
  '空庭溫泉 OSAKA BAY TOWER ',
  '⛱ 景點',
  'https://maps.app.goo.gl/tWtFTAJYbqG9VmqUA',
  0, 2600, 'JPY',
  'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/b7dnj2lwir7hefagq2ju.jpg',
  14
),
(
  'osaka-2026-d2-6',
  'trip-osaka-2026',
  '12/18 (五)',
  '【晚】きじ 木地大阪燒 、 人類都是麵類',
  '🧁 吃喝',
  'https://maps.app.goo.gl/Zb29o7QHn44LQcX58
https://maps.app.goo.gl/4Jc9E9j6NnMq8Ros7',
  0, 1600, 'JPY',
  'https://static.gltjp.com/glt/data/article/11000/10972/20161115_082742_8d3bf143_w1920.webp',
  15
),
(
  'osaka-2026-d2-7',
  'trip-osaka-2026',
  '12/18 (五)',
  '中之島「光之文藝復興」聖誕燈海',
  '⛱ 景點',
  'https://maps.app.goo.gl/e1uDXEwsYtRGN6xi7',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX3FF4qm36h8GXYZuxlN8XQeLJ71PaPx1ijBsYdp_q_ckyjL7tPobiLaOE&s=10',
  16
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
  17
),
(
  'osaka-2026-d3-2',
  'trip-osaka-2026',
  '12/19 (六)',
  '木津卸売市場',
  '⛱ 景點',
  'https://maps.app.goo.gl/hGdxkwW1F2o5Nygt7',
  0, 0, 'JPY',
  'https://img.letsgojp.com/2025/10/KizuIchiba%20phtoAC-1920x1440-1759771141.webp',
  18
),
(
  'osaka-2026-d3-3',
  'trip-osaka-2026',
  '12/19 (六)',
  '新世界本通 ＆ 通天閣展望台',
  '⛱ 景點',
  'https://maps.app.goo.gl/MXBSvhrG2RbkDpky6',
  0, 0, 'JPY',
  'https://image.kkday.com/v2/image/get/c_fit%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_174504/20260717072444_AIgpZ/png',
  19
),
(
  'osaka-2026-d3-4',
  'trip-osaka-2026',
  '12/19 (六)',
  '【午】串炸八重勝 或 串炸達摩 (新世界超狂排隊名店)',
  '🧁 吃喝',
  'https://maps.app.goo.gl/KHdk9Ak6vmdDa7Br7
https://maps.app.goo.gl/JiPqksoHUyxs8UfN8',
  0, 1800, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUOReBqiwgnuh8XQWYDf13zFtVZ-KU8v8wXHnaZOYQNytXHdPFoQ7aYAQ&s=10',
  20
),
(
  'osaka-2026-d3-5',
  'trip-osaka-2026',
  '12/19 (六)',
  '天王寺動物園',
  '⛱ 景點',
  'https://maps.app.goo.gl/9PUtRsFmTJgV2NeT7',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80',
  21
),
(
  'osaka-2026-d3-6',
  'trip-osaka-2026',
  '12/19 (六)',
  '阿倍野 HARUKAS 300 展望台',
  '⛱ 景點',
  'https://maps.app.goo.gl/f41Y6aJVCxRrx6gc7',
  0, 2000, 'JPY',
  'https://tw.wamazing.com/media/wp-content/uploads/sites/4/2025/03/abenoharukas_pixta_94540077_M.jpg.webp',
  22
),
(
  'osaka-2026-d3-7',
  'trip-osaka-2026',
  '12/19 (六)',
  '【晚】道頓堀肉劇場、北極星蛋包飯',
  '🧁 吃喝',
  'https://maps.app.goo.gl/f2f7j9VQTRBHxxk86
https://maps.app.goo.gl/nt8WJMroNqsnsp5R8',
  0, 1600, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs7eZJEVk9fp9mqgwdWfKQd5JahhW6lesIZKSVXbqKxIXVnPmP1wSzIlI&s=10',
  23
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
  '由心齋橋搭乘地鐵轉乘中央線直達「大阪港站」。',
  0, 290, 'JPY',
  'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80',
  24
),
(
  'osaka-2026-d4-2',
  'trip-osaka-2026',
  '12/20 (日)',
  '大阪海遊館',
  '⛱ 景點',
  'https://maps.app.goo.gl/MVC1z5ZtMqfZPbPq8',
  0, 2700, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTATNre5qYFtdDAW4TNSu42f6-N-DpjGT-kF7F4OWJchNVkuna0KI5LCY0&s=10',
  25
),
(
  'osaka-2026-d4-3',
  'trip-osaka-2026',
  '12/20 (日)',
  '【午】自由軒咖哩飯',
  '🧁 吃喝',
  'https://maps.app.goo.gl/dEKXw8dRdCszptib8',
  0, 1200, 'JPY',
  'https://www.bring-you.info/imgs/2018/08/Jiyuu-ken-11.jpg',
  26
),
(
  'itin-1794664142436',
  'trip-osaka-2026',
  '12/20 (日)',
  '美國村',
  '⛱ 景點',
  'https://maps.app.goo.gl/FBcQbh4tnAgg8N379',
  0, 0, 'JPY',
  'https://www.e-japannavi.com/syuyu/osaka/images/shinsaibashi_america_img700465_05.jpg',
  27
),
(
  'itin-1794664257820',
  'trip-osaka-2026',
  '12/20 (日)',
  'Orange Street',
  '⛱ 景點',
  'https://maps.app.goo.gl/dXRFRSeEqFc56rgD7',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgUZaZ6bRbf1Zp8Xl07_7zLNav8zOqYuUQzgoWgYgawy2B4rMMCP1JLK0&s=10',
  28
),
(
  'osaka-2026-d4-4',
  'trip-osaka-2026',
  '12/20 (日)',
  '心齋橋 PARCO 6F 哥吉拉商店',
  '🛍 購物',
  'https://maps.app.goo.gl/tDgUDKH2RHcYrjJe7',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyuq-X5WoJn-Apl_6pUE7oqcbCTV9Jp96veWgUrywpjSuwlbeIwXM86h8&s=10',
  29
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
  30
),
(
  'osaka-2026-d4-6',
  'trip-osaka-2026',
  '12/20 (日)',
  '【晚】金龍拉麵 道頓堀店',
  '🧁 吃喝',
  '(24H 營業，無限加辣韭菜＆泡菜
https://maps.app.goo.gl/S4EdUFrZXMEs7Tws9',
  0, 1000, 'JPY',
  'https://bobbytravel.tw/wp-content/uploads/2025/03/20250313092049_0_06890f.jpg',
  31
),
(
  'osaka-2026-d4-7',
  'trip-osaka-2026',
  '12/20 (日)',
  'MEGA 唐吉訶德 難波千日前店',
  '🛍 購物',
  '大阪最後採買
https://maps.app.goo.gl/NmK3Bbt1AKvcF4Zr5',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI861oMkATuU5jh3ZmDD5k4lMCRkDy7pGab7uCXs6Icw&s=10',
  32
),

-- ============================================================================
-- 【12/21 (一)】
-- ============================================================================
(
  'osaka-2026-d5-1',
  'trip-osaka-2026',
  '12/21 (一)',
  'KKday 勝尾寺、嵐山一日遊',
  '🚗 移動',
  '【已付款 NT$ 2,782｜成人2人】退房並攜帶所有大件行李上遊覽車！07:45 於「日本橋站 2 號出口」集合出發，參加「京都美山合掌村・勝尾寺・嵐山竹林・野宮神社一日遊（京都解散）」。',
  1391, 0, 'JPY',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
  33
),
(
  'osaka-2026-d5-2',
  'trip-osaka-2026',
  '12/21 (一)',
  '勝尾寺',
  '⛱ 景點',
  'https://maps.app.goo.gl/XPxM2rc5paDoWTLy9',
  0, 500, 'JPY',
  'https://res.klook.com/image/upload/activities/icwcgt4q7btbekmpvecm.jpg',
  34
),
(
  'osaka-2026-d5-3',
  'trip-osaka-2026',
  '12/21 (一)',
  '美山合掌村 (茅草屋之里)',
  '⛱ 景點',
  'https://maps.app.goo.gl/Un3GKxym55GViiQq7',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWyr4j-U-dq55gIHDM10BtnucPT_kaiQu1so1Xsv3Q-ZNeLjKWKPYsmVSc&s=10',
  35
),
(
  'osaka-2026-d5-4',
  'trip-osaka-2026',
  '12/21 (一)',
  '【午】美山合掌村輕食、美山牛奶冰淇淋 、 嵐山 米菲櫻花廚房造型麵包',
  '🧁 吃喝',
  'https://maps.app.goo.gl/mRwnxPenFxGFPVXr5',
  0, 1500, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnRQrvhYqTsG8JJv14m56WF0REK6IgvlZlClA03XuOJNPRWPLrWXyAk8Wf&s=10',
  36
),
(
  'itin-1794666305662',
  'trip-osaka-2026',
  '12/21 (一)',
  '嵐山 拉拉熊茶房',
  '⛱ 景點',
  'https://maps.app.goo.gl/pXMssyUUAatn2GTT8',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQetSETE05n53GSulOdGkeKL7sdpqxKq-ZZ0mh3rG2wDy9WP_GiVy_QKSo&s=10',
  37
),
(
  'osaka-2026-d5-5',
  'trip-osaka-2026',
  '12/21 (一)',
  '竹林小徑、渡月橋、野宮神社、天龍寺',
  '⛱ 景點',
  'https://maps.app.goo.gl/Mfh7mwyZKmGVLYo86',
  0, 0, 'JPY',
  'https://assets.funliday.com/posts/wp-content/uploads/2025/10/01114225/%E4%BA%AC%E9%83%BD%E5%B5%90%E5%B1%B1.webp',
  38
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
  39
),
(
  'osaka-2026-d5-7',
  'trip-osaka-2026',
  '12/21 (一)',
  '京都四條河原町彩鴻飯店 (Travelodge Kyoto Shijo Kawaramachi) ',
  '🏡 住宿',
  'https://maps.app.goo.gl/6pzjuy5D8pvC7t1y8
【連住3晚：12/21 ~ 12/24】地址：240 Yamazaki-cho, 2 chome, Kawaramachi-dori Sanjo-sagaru, Nakagyo Ward, Kyoto 604-8032｜電話：+81-75-255-8811（含稅總價 JPY 17,508，預計 2026/12/17 自動扣款）。',
  1926, 17508, 'JPY',
  'https://www.tw.kayak.com/rimg/himg/1c/f4/20/expediav2-344655-f82278-798901.jpg?width=836&height=607&crop=true',
  40
),
(
  'osaka-2026-d5-8',
  'trip-osaka-2026',
  '12/21 (一)',
  '【晚】麺屋猪一、名代豬排 かつくら 三條本店',
  '🧁 吃喝',
  'https://maps.app.goo.gl/zMHdMya6L3Q5Npt17
https://maps.app.goo.gl/UvGemsemT4PAciGr5',
  0, 1800, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnuLfqvXKL5QNvXMTLwyR34Ls9m__iTxBwc_USQAgFGQ&s=10',
  41
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
  42
),
(
  'osaka-2026-d6-2',
  'trip-osaka-2026',
  '12/22 (二)',
  '10:30 Okimono屋 清水店 換蕾絲和服',
  '⛱ 景點',
  '【已付款 NT$ 1,529】預約 10:30 體驗：含「女士高級蕾絲和服方案（含日系設計髮型）NT$ 933」＋「男士標準和服方案 NT$ 596」，挑選唯美蕾絲和服與精緻髮飾造型。
https://maps.app.goo.gl/YBjtgnTpPuyitAqm6',
  1529, 0, 'JPY',
  'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_971/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/zk8la2rccldqvccgpsv7/%E4%BA%AC%E9%83%BD%E6%9D%B1%E5%B1%B1%E7%A5%87%E5%9C%92%E5%92%8C%E6%9C%8D%E6%94%9D%E5%BD%B1%E6%97%85%E6%8B%8D(Okimono%E5%B1%8B).jpg',
  43
),
(
  'osaka-2026-d6-3',
  'trip-osaka-2026',
  '12/22 (二)',
  '11:30 - 12:30 專屬攝影師東山外拍',
  '⛱ 景點',
  '【已付款 NT$ 3,723】1 小時專屬攝影服務（Okimono屋 清水店提供）：由專業攝影師帶領走訪東山古街巷弄，引導動作並捕捉最具京都韻味的雙人和服寫真。',
  1861, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9VoTvgyZXFvy6LRdxBji0QtV8NV4yDwC9ZKIzjYOBEOsesJ7eWU9ydgY&s=10',
  44
),
(
  'osaka-2026-d6-4',
  'trip-osaka-2026',
  '12/22 (二)',
  '京都勝牛 清水五條坂店',
  '🧁 吃喝',
  'https://maps.app.goo.gl/bHuSxVrHoZrLa2hu6',
  0, 1600, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCEVzlf0gJP5uBbBBEX1im5_CRRWGcTqAz2CzEr2L5sdrtnDiZY6LtMpJB&s=10',
  45
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
  46
),
(
  'osaka-2026-d6-6',
  'trip-osaka-2026',
  '12/22 (二)',
  '四條河原町逛街 ＆ 寶可夢中心京都店 (SUINA室町 2F)',
  '🛍 購物',
  '晚上前往四條烏丸「SUINA 室町 2F」朝聖「寶可夢中心京都店 (Pokémon Center Kyoto)」，必看京都限定和服皮卡丘與鳳王，隨後漫步四條河原町、新京極與寺町通商店街。
https://maps.app.goo.gl/M8uizFvnqsewwJnq9',
  0, 0, 'JPY',
  'https://alinalife.tw/pingpig/1494394787-2389048801.jpg',
  47
),
(
  'osaka-2026-d6-7',
  'trip-osaka-2026',
  '12/22 (二)',
  '【晚】天丼まきの (Makino) 京都寺町店',
  '🧁 吃喝',
  'https://maps.app.goo.gl/KqLoRuJJkyu7RWHc7',
  0, 1700, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmBvSetsNPXMWzO3pPvhLS3noAuzcZGBSQHTYg5CybGO8LoFZ7MF4Rv2eQ&s=10',
  48
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
  49
),
(
  'osaka-2026-d7-2',
  'trip-osaka-2026',
  '12/23 (三)',
  '伏見稻荷大社',
  '⛱ 景點',
  'https://maps.app.goo.gl/SkRptDS3FFsCQSFc9',
  0, 0, 'JPY',
  'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1000&q=80',
  50
),
(
  'osaka-2026-d7-3',
  'trip-osaka-2026',
  '12/23 (三)',
  '09:30 吉伊卡哇 MOGUMOGU 本舖 京都伏見店',
  '🛍 購物',
  'https://maps.app.goo.gl/oYcacoc2EggA1sNv8',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_MrSN0OV0sjVx1KyEr_4R4I8840RTXwhvcJTK0T9TnMBVLHQ1mMErVNs&s=10',
  51
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
  52
),
(
  'osaka-2026-d7-5',
  'trip-osaka-2026',
  '12/23 (三)',
  '【午】中村藤吉、伊藤久右衛門',
  '🧁 吃喝',
  'https://maps.app.goo.gl/ddA3TJUoP1XyoSs48
https://maps.app.goo.gl/Q1cUgW1cp422eQ9A9',
  0, 1800, 'JPY',
  'https://shoplineimg.com/672061e9f18ba70038fd8362/69cb71d3ffb3331cb3f53904/750x.jpg?',
  53
),
(
  'osaka-2026-d7-6',
  'trip-osaka-2026',
  '12/23 (三)',
  '宇治漫步 (平等院鳳凰堂、宇治橋、宇治上神社)',
  '⛱ 景點',
  '造訪日幣 10 元硬幣圖案的世界遺產「平等院鳳凰堂」，漫步表參道茶街、跨越宇治川上的「宇治橋」，並參拜日本現存最古老神社建築「宇治上神社」與索取兔子籤詩。
https://maps.app.goo.gl/dDF5k74JnayzzpYF8',
  0, 700, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3WFuD5sSaFxHruO1bvuJKtKPIuahf_Oa1AZyf5mropYAd-OEeECSosXI&s=10',
  54
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
  55
),
(
  'osaka-2026-d7-8',
  'trip-osaka-2026',
  '12/23 (三)',
  '【晚】壽喜燒 キムラ',
  '🧁 吃喝',
  'https://maps.app.goo.gl/9byRHT2bA4oEHRUz9',
  0, 3300, 'JPY',
  'https://live.staticflickr.com/65535/52980610941_6852059aa4_c.jpg',
  56
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
  57
),
(
  'osaka-2026-d8-2',
  'trip-osaka-2026',
  '12/24 (四)',
  '金閣寺 (鹿苑寺・金碧輝煌舍利殿)',
  '⛱ 景點',
  'https://maps.app.goo.gl/mDLcYXQDuc72eQRBA',
  0, 500, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyQ-HJd0TkVhosz0ze7fsWY4hM717be6FYc_1qBwDqcmz1uCwLG9xmm08&s=10',
  58
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
  59
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
  60
),
(
  'osaka-2026-d8-6',
  'trip-osaka-2026',
  '12/24 (四)',
  '臨空城 Rinku Premium Outlets',
  '🛍 購物',
  '關西最大規模海景 Outlet！把握回國前最後時光掃貨歐美日系服飾、運動球鞋與精品配件。
https://maps.app.goo.gl/7dr9Qc8WztxyzCVz8',
  0, 0, 'JPY',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwfUexYZViOTcWbgj3DtgAdYE3CD8l5rbOgQfmX_VgL7Igo0-i0LVsYMW3&s=10',
  61
),
(
  'osaka-2026-d8-8',
  'trip-osaka-2026',
  '12/24 (四)',
  '【晚】關西機場 T1 美食街  551 蓬萊肉包',
  '🧁 吃喝',
  'https://maps.app.goo.gl/ebJdGbu8UMDYeoh59',
  0, 1500, 'JPY',
  'https://pengu777.com/wp-content/uploads/2024/06/%E7%A5%9E%E5%BA%A7%E6%8B%89%E9%BA%B5-%E5%A4%A7%E9%98%AA%E7%BE%8E%E9%A3%9F%E6%8E%A8%E8%96%A69.jpg',
  62
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
  63
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
