-- ============================================================================
-- 大阪京都 8日冬日遊 (trip-osaka-2026) 必買清單資料表建立與初始資料 SQL
-- (純文字與圖片 URL 儲存，不將圖片檔案存入資料庫)
-- ============================================================================

-- 1. 建立 tb_must_buy 資料表與 RLS 權限原則（若尚未建立）
CREATE TABLE IF NOT EXISTS public.tb_must_buy (
    id TEXT PRIMARY KEY,
    trip_id TEXT REFERENCES public.tb_trips(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT '美妝保養',
    price_note TEXT,
    description TEXT,
    image_url TEXT,
    source_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tb_must_buy ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_must_buy' AND policyname = 'Allow public read tb_must_buy'
  ) THEN
    CREATE POLICY "Allow public read tb_must_buy" ON public.tb_must_buy FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_must_buy' AND policyname = 'Allow public insert/update/delete tb_must_buy'
  ) THEN
    CREATE POLICY "Allow public insert/update/delete tb_must_buy" ON public.tb_must_buy FOR ALL USING (true);
  END IF;
END $$;

-- 2. 先清除舊有的大阪必買清單資料（確保重複執行不會衝突）
DELETE FROM public.tb_must_buy WHERE trip_id = 'trip-osaka-2026';

-- 3. 匯入初始必買清單資料 (共 15 筆)
INSERT INTO public.tb_must_buy (
  id, trip_id, name, category, price_note, description, image_url, source_url, sort_order
) VALUES
(
  'mb-osaka-2026-01',
  'trip-osaka-2026',
  'IHADA 敏感肌清透防護蜜粉餅',
  '美妝保養',
  '日本藥妝店購入',
  '回台灣用覺得超好用、後悔沒多買；敏感痘痘肌也適用，可帶補充芯。',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.82787-15/657309645_17859737958621959_5597188061829520904_n.jpg?stp=dst-jpg_e35_s640x640_sh2.08_tt6&_nc_cat=100&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDM4OTI2MzAxMjY3NTQ4MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTkxOC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=_FGSK2YYizsQ7kNvwGW5NtH&_nc_oc=Ado6kFAyQct15-1a3tcTXIM0Vqfxi4LHmhe_MXxDaqFj97y1OJUEOVi5BWlMBzoJB74&_nc_zt=23&_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_gid=dvpqyYChY8kDK78rkd9Qow&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQR_1Wi3NB_mCePQ9VRXS3V_XZk1u0VMw2VSmD_RxG9grg&oe=6AFF79FC',
  'https://www.threads.com/@puffy_09.__.16/post/DWS25Tcmj-Y',
  1
),
(
  'mb-osaka-2026-02',
  'trip-osaka-2026',
  'Suqqu / 肌膚之鑰妝前境內版 40g / E大餅 / 資生堂',
  '美妝保養',
  '與台灣專櫃價差約 6～7 折',
  '肌膚之鑰妝前境內版 40g 必扛，搭配 Suqqu、E大餅、資生堂一起買。',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.82787-15/657699773_17948105064120874_365902395320024970_n.jpg?stp=cp6_dst-jpg_e35_p320x320_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDU3NTQwNTU3Nzc2MTM4Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTIxNS5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=rMXEFZFIuJIQ7kNvwGO_p5K&_nc_oc=Ado9lqDUUX3QJnpOKNE10BH49TIdFAbmNKt0OOdfwxV8-cFtRv0FPe9VtEr8kdMjqGg&_nc_zt=23&_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_gid=yhti61sYFHDLcZVSJH4hZQ&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQQnovnFc0p3L8PWRVA0TxCpqHg7UFqj1re-TCzGK808aw&oe=6AFF57F5',
  'https://www.threads.com/@kehui_deng/post/DWThOCOEnJq',
  2
),
(
  'mb-osaka-2026-03',
  'trip-osaka-2026',
  'DUO 卸妝膏',
  '美妝保養',
  '藥妝店 / 唐吉訶德常見',
  '回台灣直接愛上，後悔只買了一罐。',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.82787-15/656287832_17951477592109248_4230561000435240548_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDYyMzY5NzIwNzQ4NzYyNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuNDU4LnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=217nSVBTtJEQ7kNvwGU7lcc&_nc_oc=AdpFXL4mGcHM32x2ii8IMHCPqdtvSMJ_FyKyonj0zwT-z774QRl5bwtmYFjNRjSmmvs&_nc_zt=23&_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_gid=4ZfQw0x6mvZBtt1vAKEC_g&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQRjFbzReoRv-NQs92_rMgQnPXPWnbh9t-1p-vUYVMj62Q&oe=6AFF59F4',
  'https://www.threads.com/@li_ting_0211/post/DWTsMxTgeyJ',
  3
),
(
  'mb-osaka-2026-04',
  'trip-osaka-2026',
  '唐吉訶德 妝前保濕乳液',
  '美妝保養',
  '唐吉訶德購入',
  '上妝前先塗一層保濕，一整天的妝感真的有差。',
  'https://scontent-tpe5-1.cdninstagram.com/v/t51.82787-15/660812650_17879639310545360_8015609620914456680_n.jpg?stp=cp6_dst-jpegr_e35_p320x320_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ig_cache_key=Mzg3MDA5ODYwODM2MDYyODE5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTIxNS5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=lIM_e5U3cGIQ7kNvwGT7hNd&_nc_oc=AdoVJz7ujASDkdzTw4Ya3VAD9yGeEJIrPKrZvpPLhEHw1UKew4UmDGTYgmibK-6Qt7E&_nc_zt=23&_nc_ht=scontent-tpe5-1.cdninstagram.com&_nc_gid=uU2QWl2P5I7YfNv68vH7-g&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlAgAAAA&oh=00_AQSmvSQ4pQKCxYwnU3hX9I4PyZD3-JkD8clDT8hZ_p0l0A&oe=6AFF5142&se=-1',
  'https://www.threads.com/@gooseselect_studio/post/DW1Wi39EZ_j',
  4
),
(
  'mb-osaka-2026-05',
  'trip-osaka-2026',
  '日本 BAND-AID OK 繃（鐵盒綜合版）',
  '藥妝日用',
  '藥妝店掃貨必備',
  '好貼、碰水不會軟掉、手髒也不易殘膠；鐵盒版超可愛可收藏，裡面從大片到小片都有。',
  'https://scontent-tpe5-1.cdninstagram.com/v/t51.82787-15/655512317_18028848989638052_1857158502848319295_n.webp?stp=dst-webp_s640x640_sh2.08&_nc_cat=101&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDUyNDcwODUzOTIxOTIyOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTA1MS5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=7nBcxw6sFjQQ7kNvwEGttFO&_nc_oc=Adr8axIOtlcJL57HDILqKE3WjupvqIzt4pitqaz7CZJmDuHdPn5FyGDWop1oj_s0Vk4&_nc_zt=23&_nc_ht=scontent-tpe5-1.cdninstagram.com&_nc_gid=gCYxhyPYAykBG-J4vGAhTg&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQQdhmNvIun_4cbsOEz0Z4aWJCPXOjyZspUKjm4L3NWBXQ&oe=6AFF5F6C',
  'https://www.threads.com/@snailtoge/post/DWTVsS7GT0d',
  5
),
(
  'mb-osaka-2026-06',
  'trip-osaka-2026',
  '蘇菲棉條 34 入',
  '藥妝日用',
  '大阪 ¥920（OS Drug 含稅 ¥844）',
  '大阪買比台灣便宜很多，在 OS Drug 買含稅只要 ¥844。',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.82787-15/658360436_17891535528442625_5635353124146314488_n.jpg?stp=cp6_dst-jpg_e35_p240x240_tt6&_nc_cat=106&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDU0NTk3MjQ4NTc0NTkwMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuOTk2LnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=yWiI8mYgsLMQ7kNvwG9pKGk&_nc_oc=AdqOzGbIvEf5oS90wVTFtr3VdAxNrX6oISsMV62ymDBvm6WwPK72UuDgv4NUqwq3L8E&_nc_zt=23&_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_gid=aLjLwcB57YGaP5Vp64hopQ&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQRK8-qdSWm4MamW2sCf4AfO-9WWewALssWsE3fJ2XKOGA&oe=6AFF55E5',
  'https://www.threads.com/@sodaparrot/post/DWTahuhE-zu',
  6
),
(
  'mb-osaka-2026-07',
  'trip-osaka-2026',
  '夏天神器（去日本直接用掃的）',
  '藥妝日用',
  '日本 ¥70（台灣 NT$299）',
  '台灣賣 NT$299、日本只要 ¥70，價差超大建議直接掃貨。',
  'https://scontent-tpe5-1.cdninstagram.com/v/t51.82787-15/657661774_17930806572229940_9017984257429216662_n.jpg?stp=dst-jpg_e35_s480x480_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDUyNzgyNzY4MzMyNDI3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTAwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=DhYmemEr1h4Q7kNvwFAyFTq&_nc_oc=AdqzlJHcsn5y2sPNnIhclRlwHYiDf4gIUUFrQIEnsqMPzMstF_0OEzlF4EqsXn_4aUA&_nc_zt=23&_nc_ht=scontent-tpe5-1.cdninstagram.com&_nc_gid=gCYxhyPYAykBG-J4vGAhTg&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQTQeKgU5C1nZWiM9kZSw_c8bWv29k_wUn6KAIrE2-Exng&oe=6AFF596D',
  'https://www.threads.com/@yen_.h/post/DWTWZr2kzFw',
  7
),
(
  'mb-osaka-2026-08',
  'trip-osaka-2026',
  '焦糖奶油夾心脆餅（原味 / 草莓 / 蘋果）',
  '零食伴手禮',
  '台灣一盒近 NT$600',
  '外脆餅乾夾焦糖與奶油，配美式咖啡超讚；原味必買、草莓酸甜，有季節限定（如蘋果）一定要拿。',
  'https://scontent-tpe5-1.cdninstagram.com/v/t51.82787-15/655908363_17923114950270595_4823202551218629241_n.jpg?stp=cp6_dst-jpg_e35_s640x640_sh2.08_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDYyMTU0Mjc4NzYwMzcyMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTMyMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=qTWYr8bS5bMQ7kNvwHDHILL&_nc_oc=AdqasjbFv3ZVok2pYEmEABXPVVYq18fWOwtpSOR8nYvwefjlzQaP5RrOK64xwEqqiIY&_nc_zt=23&_nc_ht=scontent-tpe5-1.cdninstagram.com&_nc_gid=4ZfQw0x6mvZBtt1vAKEC_g&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQQ0R1E7IGmiCYmSy86ieTvP-8eAYddKv2xSe-HDeWjRGw&oe=6AFF7959',
  'https://www.threads.com/@rou_zhen0711/post/DWTrta2E10K',
  8
),
(
  'mb-osaka-2026-09',
  'trip-osaka-2026',
  '關西機場第一航廈 費南雪',
  '零食伴手禮',
  '關西機場 T1 購入',
  '在關西機場第一航廈有夠好吃，大推必買。',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.82787-15/656416726_17938724943169729_8941490611163398791_n.jpg?stp=dst-jpg_e35_p240x240_tt6&_nc_cat=104&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDUyNzYyNzA3NzQ5ODkyMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuOTkzLnNkci5yZWd1bGFyX3Bob3RvLkMzIn0%3D&_nc_ohc=fBtdhz8nvsoQ7kNvwHFPIvd&_nc_oc=AdqewmNIfgSSc3X5s9sKuXgDTbRIEbc8w2plGNEpEnZH0vQ-2W_H03BDUTCaawx2DVo&_nc_zt=23&_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_gid=gCYxhyPYAykBG-J4vGAhTg&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQRJ9M1DznEf1vCdzcBOKpt1rOARRnKFCws2WraPs9hDkA&oe=6AFF46CE',
  'https://www.threads.com/@__josephine423/post/DWTWWxBiTgo',
  9
),
(
  'mb-osaka-2026-10',
  'trip-osaka-2026',
  '味覺糖 保健軟糖',
  '零食伴手禮',
  '藥妝店 / 超商皆可找',
  '吃起來像軟糖又方便補充營養，後悔沒多拿幾包。',
  'https://scontent-tpe5-1.cdninstagram.com/v/t51.82787-15/657270959_17955636867111588_2125482702437573588_n.jpg?stp=cp6_dst-jpg_e35_s640x640_tt6&_nc_cat=100&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDU4MTI5ODIwNTgzODM1OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=g_uvOYtdz4IQ7kNvwHfICuK&_nc_oc=Adq9Q8GOfCnWOgHRf1GAQ1SX9NI0IKc9FwgTzXHH4zSWNBay-05mSAkhHS560F3Uqto&_nc_zt=23&_nc_ht=scontent-tpe5-1.cdninstagram.com&_nc_gid=yhti61sYFHDLcZVSJH4hZQ&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQQZMAlzFrlw8Vz6Syv8eVKZmm1pLu6oQLIJMhlvcijopQ&oe=6AFF5F72',
  'https://www.threads.com/@sdyyy_k/post/DWTijyKE0wX',
  10
),
(
  'mb-osaka-2026-11',
  'trip-osaka-2026',
  '全家超商 盒裝點心',
  '零食伴手禮',
  '日本 FamilyMart',
  '在全家隨便抓兩盒，回台灣才吃、後悔沒買一打。',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.82787-15/658862328_17917601163318417_5995985747890347652_n.jpg?stp=cp6_dst-jpg_e35_s640x640_tt6&_nc_cat=101&_nc_map=urlgen_bucketless&ig_cache_key=Mzg2MDYxMzg5NDQ4MjU2NzA4NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=2Ri_qzoCKuwQ7kNvwHtvN6e&_nc_oc=Adr6wkmSGWoEL9Ig8QixL8R7aP3gBB4q1juZ-oJTQDuj4cN_Xj6sKKiICE3W36hUU84&_nc_zt=23&_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_gid=saIKi1IUEiAQ1mzuty91dA&_nc_ss=7b2a8&_nc_ct=RQosPBUIFQIlBAAAAA&oh=00_AQTi0u82nqTPG5IOtKnsXmnkYLGPjKclDnduK21Alprjpw&oe=6AFF7BAB',
  'https://www.threads.com/@dan_7878/post/DWTp-Hzkh-t',
  11
),
(
  'mb-osaka-2026-12',
  'trip-osaka-2026',
  '無印良品 柚子金桔喉糖',
  '零食伴手禮',
  '日本 ¥100（台灣 NT$49）',
  '「買一包賺一包」的價差款，看到無印良品可以順手抓幾包。',
  NULL,
  'https://www.threads.com/@q_day_day/post/DWTZVPqEyHy',
  12
),
(
  'mb-osaka-2026-13',
  'trip-osaka-2026',
  '烤布蕾口味地瓜餅乾',
  '零食伴手禮',
  '點參考連結查看實拍照',
  '好吃到捨不得分人吃，只買一包兩天就吃完超後悔。',
  NULL,
  'https://www.threads.com/@_susuoopy/post/DWTK3mCmrnR',
  13
),
(
  'mb-osaka-2026-14',
  'trip-osaka-2026',
  '日本除疤凝膠',
  '藥妝日用',
  '點參考連結查看商品圖',
  '「來 10 次推 11 次」，車禍傷疤擦到完全看不出來。',
  NULL,
  'https://www.threads.com/@mimity.lin/post/DWTtKHskw5S',
  14
),
(
  'mb-osaka-2026-15',
  'trip-osaka-2026',
  '梅田阪急百貨 外國人 95 折＋退稅攻略',
  '購物攻略',
  '95 折 ＋ 退稅',
  '去梅田阪急百貨買精品前，記得先去 1 樓辦理外國人 95 折優惠，結帳還可再退稅。',
  NULL,
  'https://www.threads.com/@weiweihuang1227/post/DWTgOOnkwH2',
  15
);
