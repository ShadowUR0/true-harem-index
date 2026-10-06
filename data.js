const POWER_OP = new Set([
  "The Advanced Player of the Tutorial Tower",
  "The Max Level Hero Strikes Back!",
  "The Reluctant Demon Cult Leader",
  "Catastrophic Necromancer",
  "I Am the Fated Villain",
  "Qi Refinement For 3,000 Years",
  "In Another World With My Smartphone",
  "Demon King Daimao",
  "Trapped in a Dating Sim",
  "The 8th Son? Are You Kidding Me?",
  "The Knight King Who Returned with a God",
  "The Heavenly Demon Wants a Quiet Life",
  "MEMORIZE",
  "The Aristocrat’s Otherworldly Adventure: Serving Gods Who Go Too Far",
  "How NOT to Summon a Demon Lord",
  "Seoul Station's Necromancer",
  "Against the Sky Supreme"
]);

const POWER_GROWS_OP = new Set([
  "After Ten Millennia in Hell",
  "Absolute Sword Sense",
  "Revenge of the Iron Blooded Hound",
  "Overgeared",
  "Nano Machina",
  "Sir, Don't Show Off",
  "Ultimate Scheming System",
  "Martial Peak",
  "Arifureta Shokugyou de Sekai Saikyou",
  "Re:Monster",
  "The Book Eating Magician",
  "My Blasted Reincarnated Life",
  "Time-Limited Genius Dark Knight",
  "The Second Coming of Gluttony",
  "Level Up Just By Eating",
  "Reborn as a Barrier Master",
  "Magic Stone Gourmet: Eating Magical Power Made Me The Strongest"
]);

const POWER_LATENT_OP = new Set([
  "Tenchi Muyo!",
  "Trinity Seven",
  "Asdivine Dios"
]);

function getPowerClass(title) {
  if (POWER_OP.has(title)) return "op";
  if (POWER_GROWS_OP.has(title)) return "grows-op";
  if (POWER_LATENT_OP.has(title)) return "latent-op";
  return null;
}

window.TRUE_HAREM_DATA = {
  works: [
    ["Webtoon Character Na Kang Lim","manhwa","KR","complete","FH","confirmed","sfw"],
    ["The Advanced Player of the Tutorial Tower","manhwa","KR","complete","FH","confirmed","sfw"],
    ["Absolute Sword Sense","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["Revenge of the Iron Blooded Hound","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["I Killed an Academy Player","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["The Max Level Hero Strikes Back!","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["After Ten Millennia in Hell","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["Overgeared","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["How to Use a Returner","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["The Extra's Academy Survival Guide","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["The Reluctant Demon Cult Leader","manhwa","KR","complete","FH","confirmed","sfw"],
    ["Nano Machina","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["The Book Eating Magician","manhwa","KR","hiatus","FH","source-only","sfw"],
    ["My Blasted Reincarnated Life","manhwa","KR","hiatus","FH","source-only","sfw"],
    ["The Knight King Who Returned with a God","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["The Heavenly Demon Wants a Quiet Life","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["Time-Limited Genius Dark Knight","manhwa","KR","ongoing","FH","source-only","sfw"],
    ["MEMORIZE","manhwa","KR","hiatus","FH","source-only","sfw"],
    ["The Second Coming of Gluttony","manhwa","KR","cancelled","FH","source-only","sfw"],
    ["Destined To Be Loved by the Villains","manhwa","KR","cancelled","FH","source-only","sfw"],
    ["Seoul Station's Necromancer","manhwa","KR","complete","FH","source-only","sfw"],
    ["Surviving in a Romance Fantasy Novel","manhwa","KR","cancelled","FH","source-only","sfw"],

    ["My Girlfriend Is a Zombie","manhua","CN","complete","FH","confirmed","sfw"],
    ["Evil Young Master Doesn't Want a Bad Ending","manhua","CN","complete","FH","confirmed","sfw"],
    ["Sir, Don't Show Off","manhua","CN","ongoing","FH","source-only","sfw"],
    ["Become the Castellan in Another World","manhua","CN","ongoing","FH","source-only","sfw"],
    ["Catastrophic Necromancer","manhua","CN","ongoing","FH","source-only","sfw"],
    ["Ultimate Scheming System","manhua","CN","complete","FH","confirmed","sfw"],
    ["My Harem Grew So Large, I Was Forced to Ascend","manhua","CN","complete","FH","confirmed","sfw"],
    ["My Harem Consists Entirely of Female Demon Villains","manhua","CN","complete","FH","confirmed","sfw"],
    ["Martial Peak","manhua","CN","ongoing","FH","source-only","sfw"],
    ["I Am the Fated Villain","manhua","CN","ongoing","FH","source-only","sfw"],
    ["Qi Refinement For 3,000 Years","manhua","CN","complete","FH","confirmed","sfw"],
    ["My Female Apprentices Are All Future Big Shots","manhua","CN","ongoing","FH","source-only","sfw"],
    ["I Opened a Harem in Hell","manhua","CN","hiatus","FH","source-only","ecchi"],
    ["Dark Star King","manhua","CN","complete","FH","confirmed","sfw"],
    ["The Time of Rebirth","manhua","CN","complete","FH","confirmed","ecchi"],
    ["The Super Doctor From 2089","manhua","CN","complete","FH","confirmed","sfw"],
    ["Immortal Swordsman in Reverse World","manhua","CN","complete","FH","confirmed","ecchi"],
    ["I Eat Soft Rice in Another World","manhua","CN","complete","FH","confirmed","ecchi"],
    ["Rise of the Mountain Chief","manhua","CN","complete","FH","confirmed","sfw"],

    ["Tenchi Muyo!","anime","JP","complete","FH","confirmed","sfw"],
    ["Arifureta Shokugyou de Sekai Saikyou","anime","JP","ongoing","FH","source-only","ecchi"],
    ["How a Realist Hero Rebuilt the Kingdom","anime","JP","ongoing","FH","source-only","sfw"],
    ["In Another World With My Smartphone","anime","JP","ongoing","FH","source-only","sfw"],
    ["Kanojo mo Kanojo","anime","JP","complete","FH","confirmed","ecchi"],
    ["Mushoku Tensei","anime","JP","ongoing","FH","source-only","ecchi"],
    ["Trinity Seven","anime","JP","ongoing","FH","source-only","ecchi"],
    ["Re:Monster","anime","JP","ongoing","FH","source-only","sfw"],
    ["Tales of Wedding Rings","anime","JP","ongoing","FH","source-only","ecchi"],
    ["The Fruit of Grisaia","anime","JP","complete","FH","confirmed","sfw"],
    ["The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You","anime","JP","ongoing","FH","source-only","ecchi"],
    ["Strike the Blood","anime","JP","unknown","FH","source-only","ecchi"],
    ["The Testament of Sister New Devil","anime","JP","unknown","FH","source-only","ecchi"],
    ["Conception","anime","JP","complete","FH","confirmed","sfw"],
    ["Campione!","anime","JP","unknown","FH","source-only","ecchi"],
    ["The Aristocrat’s Otherworldly Adventure: Serving Gods Who Go Too Far","anime","JP","ongoing","FH","source-only","sfw"],
    ["High School DxD","anime","JP","unknown","FH","source-only","ecchi"],
    ["Tenchi Muyo! GXP","anime","JP","unknown","FH","source-only","sfw"],
    ["Tenchi Muyo! War on Geminar","anime","JP","unknown","FH","source-only","ecchi"],
    ["Beast Tamer","anime","JP","ongoing","FH","source-only","sfw"],
    ["Cat Planet Cuties","anime","JP","unknown","FH","source-only","ecchi"],
    ["Photon: The Idiot Adventures","anime","JP","complete","FH","confirmed","ecchi"],
    ["Against the Sky Supreme","anime","CN","ongoing","FH","source-only","sfw"],

    ["Kanojo mo Kanojo","manga","JP","complete","FH","confirmed","ecchi"],
    ["Farming Life in Another World","manga","JP","ongoing","FH","source-only","sfw"],
    ["Tales of Wedding Rings","manga","JP","complete","FH","confirmed","ecchi"],
    ["In Another World With My Smartphone","manga","JP","ongoing","FH","source-only","sfw"],
    ["Demon King Daimao","manga","JP","complete","FH","confirmed","ecchi"],
    ["Sekirei","manga","JP","complete","FH","confirmed","ecchi"],
    ["Re:Monster","manga","JP","ongoing","FH","source-only","sfw"],
    ["Mushoku Tensei","manga","JP","ongoing","FH","source-only","ecchi"],
    ["Omamori Himari","manga","JP","complete","FH","confirmed","ecchi"],
    ["Love Tyrant","manga","JP","complete","FH","confirmed","ecchi"],
    ["Trapped in a Dating Sim","manga","JP","ongoing","FH","source-only","sfw"],
    ["The 8th Son? Are You Kidding Me?","manga","JP","ongoing","FH","source-only","sfw"],
    ["Madan no Ou to Vanadis","manga","JP","complete","FH","confirmed","ecchi"],
    ["An Ideal Lazy Life","manga","JP","complete","FH","confirmed","sfw"],
    ["How a Realist Hero Rebuilt the Kingdom","manga","JP","ongoing","FH","source-only","sfw"],
    ["Level Up Just By Eating","manga","JP","complete","FH","confirmed","ecchi"],
    ["Humans are the Strongest Race","manga","JP","complete","FH","confirmed","ecchi"],
    ["Maga-Tsuki","manga","JP","complete","FH","confirmed","ecchi"],
    ["My Room Is a Dungeon Rest Stop","manga","JP","complete","FH","confirmed","ecchi"],
    ["Fujimura-kun Mates","manga","JP","complete","FH","confirmed","sfw"],
    ["Honeymoon Salad","manga","JP","complete","FH","confirmed","sfw"],
    ["The Testament of Sister New Devil","manga","JP","complete","FH","confirmed","ecchi"],
    ["The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat","manga","JP","ongoing","FH","source-only","sfw"],
    ["Undefeated Bahamut Chronicle","manga","JP","unknown","FH","source-only","ecchi"],
    ["Monster Girl Doctor","manga","JP","hiatus","FH","source-only","ecchi"],
    ["The Master of Ragnarok & Blesser of Einherjar","manga","JP","ongoing","FH","source-only","sfw"],
    ["I Left My A-Rank Party to Help My Former Students Reach the Dungeon Depths!","manga","JP","ongoing","FH","source-only","sfw"],
    ["I'm a NEET but when I went to Hello Work I got taken to another world","manga","JP","ongoing","FH","source-only","ecchi"],
    ["Tou no Kanri o Shite Miyou","manga","JP","ongoing","FH","source-only","ecchi"],
    ["Reborn as a Barrier Master","manga","JP","ongoing","FH","source-only","sfw"],
    ["Magic Stone Gourmet: Eating Magical Power Made Me The Strongest","manga","JP","ongoing","FH","source-only","sfw"],
    ["Now I'm a Demon Lord! Happily Ever After with Monster Girls in My Dungeon","manga","JP","ongoing","FH","source-only","sfw"],
    ["Survival in Another World with My Mistress!","manga","JP","ongoing","FH","source-only","ecchi"],
    ["UQ Holder!","manga","JP","complete","FH","confirmed","sfw"],
    ["How NOT to Summon a Demon Lord","manga","JP","ongoing","FH","source-only","ecchi"],

    ["Arifureta Shokugyou de Sekai Saikyou","novel","JP","complete","FH","confirmed","ecchi"],
    ["In Another World With My Smartphone","novel","JP","ongoing","FH","source-only","sfw"],
    ["How a Realist Hero Rebuilt the Kingdom","novel","JP","complete","FH","confirmed","sfw"],
    ["Mushoku Tensei","novel","JP","complete","FH","confirmed","ecchi"],

    ["Xenoblade Chronicles 2","game","JP","complete","FH","confirmed","sfw"],
    ["Jade Empire","game","Other","complete","FH","confirmed","sfw"],
    ["Conception Plus","game","JP","complete","FH","confirmed","ecchi"],
    ["Helltaker","game","Other","complete","FH","confirmed","sfw"],
    ["Criminal Girls: Invite Only","game","JP","complete","FH","confirmed","ecchi"],
    ["New Little King's Story","game","JP","complete","FH","confirmed","sfw"],
    ["Snowbreak: Containment Zone","game","CN","ongoing","FH","source-only","ecchi"],
    ["Asdivine Dios","game","JP","complete","FH","confirmed","sfw"],
    ["Conception II: Children of the Seven Stars","game","JP","complete","FH","confirmed","sfw"]
  ].map(([title,type,origin,status,haremType,verification,contentClass]) => ({
    title,type,origin,status,haremType,verification,contentClass,
    powerClass: getPowerClass(title),
    sourceName: verification === "confirmed" ? "TrueHarem / community evidence" : "TrueHarem source route",
    sourceUrl: "https://trueharem.carrd.co/"
  })),
  sources: [
    {
      name:"TrueHarem",
      role:"المصدر الاساسي للحكم: هل العمل True Harem فعلا ام مجرد Harem tag.",
      mode:"Curated index",
      url:"https://trueharem.carrd.co/"
    },
    {
      name:"AniList",
      role:"مرجع للبيانات والاغلفة عند التحقق اليدوي. المزامنة التلقائية غير مفعلة حاليا.",
      mode:"Metadata reference",
      url:"https://docs.anilist.co/"
    },
    {
      name:"MangaUpdates",
      role:"مرجع يدوي اضافي للاسماء البديلة والحالة والتصنيفات للقصص المصورة.",
      mode:"Manual reference",
      url:"https://api.mangaupdates.com/"
    },
    {
      name:"MangaDex",
      role:"مرجع لتقييم المحتوى والاغلفة عند التحقق؛ لا توجد مزامنة تلقائية حاليا.",
      mode:"Safety reference",
      url:"https://api.mangadex.org/"
    },
    {
      name:"NovelUpdates",
      role:"قوائم Polygamy وTrue Harem للروايات؛ تستخدم يدويا كدليل مساعد لا حكم وحيد.",
      mode:"Manual curation",
      url:"https://www.novelupdates.com/listtag/polygamy/"
    },
    {
      name:"TrueHaremHub",
      role:"مراجعات المجتمع والادلة على النهايات واختلاف الاقتباسات.",
      mode:"Community evidence",
      url:"https://www.reddit.com/r/TrueHaremHub/"
    }
  ]
};