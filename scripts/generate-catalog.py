"""Generate Earls 70-product retail catalog from DJ Simons data with 3x markup."""
import json, os, math

MARKUP = 3.0
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'frames.json')

# 70 curated products from Simons 2023 price-list
RAW = [
# Classic Wood (8)
{"id":1,"sc":"000J/0082","name":"Light Oak Flat","desc":"20mm flat profile in light oak stain","cat":"Classic Wood","mat":"Obeche","col":"Brown","fin":"Stain","prof":"Flat","w":20,"d":12,"cpm":1.44,"cpf":0.44,"tags":["classic","oak","slim"]},
{"id":2,"sc":"000J/0095","name":"Medium Oak","desc":"35mm obeche in warm medium oak stain","cat":"Classic Wood","mat":"Obeche","col":"Brown","fin":"Stain","prof":"Flat","w":35,"d":14,"cpm":4.20,"cpf":1.28,"tags":["classic","oak","standard"]},
{"id":3,"sc":"000J/0097","name":"Dark Walnut","desc":"35mm obeche in rich dark brown stain","cat":"Classic Wood","mat":"Obeche","col":"Brown","fin":"Stain","prof":"Flat","w":35,"d":14,"cpm":4.20,"cpf":1.28,"tags":["classic","walnut","dark"]},
{"id":4,"sc":"0001/T","name":"Two Tone Oak Gold","desc":"1⅛\" two tone stain with gold line accent","cat":"Classic Wood","mat":"Wood","col":"Brown","fin":"Stain","prof":"Raised","w":29,"d":14,"cpm":2.95,"cpf":0.90,"tags":["classic","gold-line","traditional"]},
{"id":5,"sc":"000K/0890","name":"Cherry Scoop","desc":"64mm cherry wood scoop profile","cat":"Classic Wood","mat":"Wood","col":"Brown","fin":"Polish","w":64,"d":20,"cpm":7.00,"cpf":2.13,"tags":["classic","cherry","wide","scoop"]},
{"id":6,"sc":"444343000","name":"Curl Walnut Veneer","desc":"30mm walnut veneer with curl grain","cat":"Classic Wood","mat":"Wood","col":"Brown","fin":"Veneer","prof":"Flat","w":30,"d":14,"cpm":4.92,"cpf":1.50,"tags":["classic","walnut","veneer"]},
{"id":7,"sc":"000J/13","name":"Plain Pine Slim","desc":"15mm plain pine natural finish","cat":"Classic Wood","mat":"Pine","col":"Natural","fin":"Raw","prof":"Flat","w":15,"d":10,"cpm":1.41,"cpf":0.43,"tags":["classic","pine","budget","slim"]},
{"id":8,"sc":"DAN/21","name":"Rough Hewn Pine","desc":"33mm rough plain wood natural look","cat":"Classic Wood","mat":"Pine","col":"Natural","fin":"Raw","prof":"Flat","w":33,"d":16,"cpm":1.74,"cpf":0.53,"tags":["classic","rustic","pine"]},
# Modern Flat (10)
{"id":9,"sc":"000J/0086","name":"Flat Ebony","desc":"20mm flat profile in stain black finish","cat":"Modern Flat","mat":"Obeche","col":"Black","fin":"Stain","prof":"Flat","w":20,"d":12,"cpm":1.44,"cpf":0.44,"tags":["modern","minimal","slim"]},
{"id":10,"sc":"000J/241","name":"Matt Black Lacquer","desc":"20mm matt black lacquer finish","cat":"Modern Flat","mat":"Wood","col":"Black","fin":"Lacquer","prof":"Flat","w":20,"d":12,"cpm":2.49,"cpf":0.76,"tags":["modern","matt","black"]},
{"id":11,"sc":"000J/242","name":"Slim Matt Black","desc":"13.5mm slim matt black lacquer","cat":"Modern Flat","mat":"Wood","col":"Black","fin":"Lacquer","prof":"Flat","w":14,"d":10,"cpm":1.90,"cpf":0.58,"tags":["modern","slim","black"]},
{"id":12,"sc":"COSM/0027","name":"Black Gloss Flat","desc":"21mm flat black gloss finish","cat":"Modern Flat","mat":"Wood","col":"Black","fin":"Gloss","prof":"Flat","w":21,"d":12,"cpm":2.43,"cpf":0.74,"tags":["modern","gloss","black"]},
{"id":13,"sc":"LUNA/0002","name":"White Deep Rebate","desc":"13mm white flat deep rebate profile","cat":"Modern Flat","mat":"Wood","col":"White","fin":"Paint","prof":"Flat","w":13,"d":22,"cpm":3.28,"cpf":1.00,"tags":["modern","white","deep"]},
{"id":14,"sc":"LUNA/0006","name":"Dark Grey Flat","desc":"13mm flat dark grey finish","cat":"Modern Flat","mat":"Wood","col":"Grey","fin":"Paint","prof":"Flat","w":13,"d":14,"cpm":1.71,"cpf":0.52,"tags":["modern","grey","slim"]},
{"id":15,"sc":"000K/0477","name":"Wide Black Box","desc":"30mm flat black box profile","cat":"Modern Flat","mat":"Wood","col":"Black","fin":"Paint","prof":"Flat","w":30,"d":30,"cpm":4.10,"cpf":1.25,"tags":["modern","box","black","wide"]},
{"id":16,"sc":"WRAP/20","name":"Beech Angled Edge","desc":"35mm flat beech with angled edge","cat":"Modern Flat","mat":"Wood","col":"Natural","fin":"Lacquer","prof":"Flat","w":35,"d":14,"cpm":1.77,"cpf":0.54,"tags":["modern","beech","natural"]},
{"id":17,"sc":"000J/1064","name":"Wide Flat Rounded","desc":"64mm flat obeche with rounded edges","cat":"Modern Flat","mat":"Obeche","col":"Natural","fin":"Raw","prof":"Flat","w":64,"d":16,"cpm":3.35,"cpf":1.02,"tags":["modern","wide","statement"]},
{"id":18,"sc":"000J/10","name":"Raw Pine Wide","desc":"44mm flat raw pine natural","cat":"Modern Flat","mat":"Pine","col":"Natural","fin":"Raw","prof":"Flat","w":44,"d":16,"cpm":1.74,"cpf":0.53,"tags":["modern","pine","budget","wide"]},
# Ornate & Swept (7)
{"id":19,"sc":"DECO/0003","name":"Ornate Gold Embossed","desc":"62mm gold ornate embossed frame","cat":"Ornate & Swept","mat":"Wood","col":"Gold","fin":"Gilt","prof":"Ornate","w":62,"d":22,"cpm":13.06,"cpf":3.98,"tags":["ornate","gold","embossed","premium"]},
{"id":20,"sc":"DECO/0001","name":"Ornate White Embossed","desc":"62mm white ornate embossed frame","cat":"Ornate & Swept","mat":"Wood","col":"White","fin":"Paint","prof":"Ornate","w":62,"d":22,"cpm":13.06,"cpf":3.98,"tags":["ornate","white","embossed","premium"]},
{"id":21,"sc":"DECO/0004","name":"Ornate Silver Embossed","desc":"62mm silver ornate embossed frame","cat":"Ornate & Swept","mat":"Wood","col":"Silver","fin":"Gilt","prof":"Ornate","w":62,"d":22,"cpm":13.06,"cpf":3.98,"tags":["ornate","silver","embossed","premium"]},
{"id":22,"sc":"000K/0678","name":"Grand Gold Ornate","desc":"72mm ornate embossed gold wide","cat":"Ornate & Swept","mat":"Wood","col":"Gold","fin":"Gilt","prof":"Ornate","w":72,"d":28,"cpm":18.37,"cpf":5.60,"tags":["ornate","gold","statement","luxury"]},
{"id":23,"sc":"ROYAL/0001","name":"Royal Gold Scoop","desc":"65mm embossed gold scoop profile","cat":"Ornate & Swept","mat":"Wood","col":"Gold","fin":"Embossed","prof":"Scoop","w":65,"d":24,"cpm":14.76,"cpf":4.50,"tags":["ornate","gold","scoop","royal"]},
{"id":24,"sc":"ROYAL/0002","name":"Royal Silver Scoop","desc":"65mm embossed silver scoop profile","cat":"Ornate & Swept","mat":"Wood","col":"Silver","fin":"Embossed","prof":"Scoop","w":65,"d":24,"cpm":14.76,"cpf":4.50,"tags":["ornate","silver","scoop","royal"]},
{"id":25,"sc":"LOUI/0001","name":"Gold Embossed Lip","desc":"26mm gold embossed outer lip accent","cat":"Ornate & Swept","mat":"Wood","col":"Gold","fin":"Embossed","prof":"Raised","w":26,"d":14,"cpm":5.41,"cpf":1.65,"tags":["ornate","gold","slim","accent"]},
# Gold & Silver (8)
{"id":26,"sc":"5404/6008","name":"Flat Gold","desc":"23mm flat gold finish","cat":"Gold & Silver","mat":"Wood","col":"Gold","fin":"Gilt","prof":"Flat","w":23,"d":12,"cpm":2.95,"cpf":0.90,"tags":["gold","flat","slim"]},
{"id":27,"sc":"5401/7018","name":"Brushed Silver Ovaloe","desc":"25mm ovaloe brushed silver finish","cat":"Gold & Silver","mat":"Wood","col":"Silver","fin":"Brushed","prof":"Ovaloe","w":25,"d":14,"cpm":6.23,"cpf":1.90,"tags":["silver","brushed","elegant"]},
{"id":28,"sc":"5403/6018","name":"Brushed Gold Ovaloe","desc":"50mm ovaloe brushed gold finish","cat":"Gold & Silver","mat":"Wood","col":"Gold","fin":"Brushed","prof":"Ovaloe","w":50,"d":18,"cpm":9.02,"cpf":2.75,"tags":["gold","brushed","wide","premium"]},
{"id":29,"sc":"000K/0843","name":"Silver L-Shape","desc":"38mm silver L shape moulding","cat":"Gold & Silver","mat":"Wood","col":"Silver","fin":"Leaf","prof":"L-Shape","w":38,"d":20,"cpm":6.89,"cpf":2.10,"tags":["silver","l-shape","gallery"]},
{"id":30,"sc":"000K/0844","name":"Gold L-Shape","desc":"38mm gold L shape moulding","cat":"Gold & Silver","mat":"Wood","col":"Gold","fin":"Leaf","prof":"L-Shape","w":38,"d":20,"cpm":7.87,"cpf":2.40,"tags":["gold","l-shape","gallery"]},
{"id":31,"sc":"DAB/4","name":"Silver Leaf Ovaloe","desc":"66mm ovaloe silver leaf wide frame","cat":"Gold & Silver","mat":"Wood","col":"Silver","fin":"Leaf","prof":"Ovaloe","w":66,"d":22,"cpm":7.38,"cpf":2.25,"tags":["silver","leaf","wide","statement"]},
{"id":32,"sc":"0135/0001","name":"Scratched Gold Raised","desc":"35mm raised centre scratched gold","cat":"Gold & Silver","mat":"Wood","col":"Gold","fin":"Antiqued","prof":"Raised","w":35,"d":16,"cpm":6.56,"cpf":2.00,"tags":["gold","scratched","textured"]},
{"id":33,"sc":"0135/0002","name":"Scratched Silver Raised","desc":"35mm raised centre scratched silver","cat":"Gold & Silver","mat":"Wood","col":"Silver","fin":"Antiqued","prof":"Raised","w":35,"d":16,"cpm":6.56,"cpf":2.00,"tags":["silver","scratched","textured"]},
# Distressed & Rustic (7)
{"id":34,"sc":"0321/1265","name":"Gold Distressed Red","desc":"⅞\" gold distressed red panel","cat":"Distressed & Rustic","mat":"Wood","col":"Gold","fin":"Distressed","prof":"Panel","w":22,"d":14,"cpm":6.23,"cpf":1.90,"tags":["distressed","gold","red","vintage"]},
{"id":35,"sc":"0321/1268","name":"Silver Blue Distressed","desc":"⅞\" distressed silver/blue panel","cat":"Distressed & Rustic","mat":"Wood","col":"Silver","fin":"Distressed","prof":"Panel","w":22,"d":14,"cpm":6.23,"cpf":1.90,"tags":["distressed","silver","blue","vintage"]},
{"id":36,"sc":"DAVINCI/0005","name":"Dove Scoop Distressed","desc":"30mm distressed dove grey scoop","cat":"Distressed & Rustic","mat":"Wood","col":"Grey","fin":"Distressed","prof":"Scoop","w":30,"d":16,"cpm":5.74,"cpf":1.75,"tags":["distressed","grey","dove","scoop"]},
{"id":37,"sc":"SALZ/0001","name":"Black Spoon Distressed","desc":"22mm black spoon distressed finish","cat":"Distressed & Rustic","mat":"Wood","col":"Black","fin":"Distressed","prof":"Spoon","w":22,"d":12,"cpm":5.09,"cpf":1.55,"tags":["distressed","black","spoon"]},
{"id":38,"sc":"SALZ/0003","name":"White Spoon Distressed","desc":"22mm white spoon distressed finish","cat":"Distressed & Rustic","mat":"Wood","col":"White","fin":"Distressed","prof":"Spoon","w":22,"d":12,"cpm":5.09,"cpf":1.55,"tags":["distressed","white","spoon"]},
{"id":39,"sc":"PALE/0002","name":"Silver Box Distressed","desc":"50mm flat box distressed silver","cat":"Distressed & Rustic","mat":"Wood","col":"Silver","fin":"Distressed","prof":"Flat","w":50,"d":22,"cpm":9.19,"cpf":2.80,"tags":["distressed","silver","box","premium"]},
{"id":40,"sc":"YORK/0005","name":"Black Wash Scoop","desc":"26mm black wash scoop profile","cat":"Distressed & Rustic","mat":"Wood","col":"Black","fin":"Wash","prof":"Scoop","w":26,"d":14,"cpm":2.82,"cpf":0.86,"tags":["distressed","wash","black","budget"]},
# Painted & Colour (7)
{"id":41,"sc":"DISP/0003","name":"Painted White Wide","desc":"82mm painted white frame","cat":"Painted & Colour","mat":"Wood","col":"White","fin":"Paint","prof":"Flat","w":82,"d":22,"cpm":6.23,"cpf":1.90,"tags":["painted","white","wide","statement"]},
{"id":42,"sc":"DISP/0002","name":"Painted Black Wide","desc":"82mm painted black frame","cat":"Painted & Colour","mat":"Wood","col":"Black","fin":"Paint","prof":"Flat","w":82,"d":22,"cpm":6.23,"cpf":1.90,"tags":["painted","black","wide","statement"]},
{"id":43,"sc":"2935/3303","name":"Sloped Green","desc":"16mm sloped green with white back","cat":"Painted & Colour","mat":"Wood","col":"Green","fin":"Paint","prof":"Sloped","w":16,"d":10,"cpm":4.99,"cpf":1.52,"tags":["painted","green","colour","slim"]},
{"id":44,"sc":"2935/3301","name":"Sloped Charcoal","desc":"16mm sloped charcoal with white back","cat":"Painted & Colour","mat":"Wood","col":"Grey","fin":"Paint","prof":"Sloped","w":16,"d":10,"cpm":4.99,"cpf":1.52,"tags":["painted","charcoal","slim"]},
{"id":45,"sc":"COSM/0024","name":"Blue Gloss Chamford","desc":"30mm blue gloss chamford edge","cat":"Painted & Colour","mat":"Wood","col":"Blue","fin":"Gloss","prof":"Chamford","w":30,"d":14,"cpm":3.28,"cpf":1.00,"tags":["painted","blue","gloss","colour"]},
{"id":46,"sc":"COSM/0025","name":"Grey Gloss Chamford","desc":"30mm grey gloss chamford edge","cat":"Painted & Colour","mat":"Wood","col":"Grey","fin":"Gloss","prof":"Chamford","w":30,"d":14,"cpm":3.28,"cpf":1.00,"tags":["painted","grey","gloss"]},
{"id":47,"sc":"COSM/0026","name":"White Gloss Chamford","desc":"30mm white gloss chamford edge","cat":"Painted & Colour","mat":"Wood","col":"White","fin":"Gloss","prof":"Chamford","w":30,"d":14,"cpm":3.28,"cpf":1.00,"tags":["painted","white","gloss"]},
# Cushion & Scoop (7)
{"id":48,"sc":"000J/304","name":"Black Cushion","desc":"30mm stained black cushion profile","cat":"Cushion & Scoop","mat":"Wood","col":"Black","fin":"Stain","prof":"Cushion","w":30,"d":14,"cpm":2.13,"cpf":0.65,"tags":["cushion","black","classic"]},
{"id":49,"sc":"528568000","name":"White Lacquer Cushion","desc":"½\" white lacquer cushion profile","cat":"Cushion & Scoop","mat":"Wood","col":"White","fin":"Lacquer","prof":"Cushion","w":13,"d":10,"cpm":2.17,"cpf":0.66,"tags":["cushion","white","slim"]},
{"id":50,"sc":"000K/0342","name":"Oak Cushion","desc":"40mm cushion in warm oak finish","cat":"Cushion & Scoop","mat":"Wood","col":"Brown","fin":"Stain","prof":"Cushion","w":40,"d":16,"cpm":3.15,"cpf":0.96,"tags":["cushion","oak","standard"]},
{"id":51,"sc":"000K/0558","name":"Silver Scoop Wide","desc":"80mm silver scoop statement frame","cat":"Cushion & Scoop","mat":"Wood","col":"Silver","fin":"Leaf","prof":"Scoop","w":80,"d":24,"cpm":11.32,"cpf":3.45,"tags":["scoop","silver","wide","premium"]},
{"id":52,"sc":"000K/0758","name":"Natural Obeche Scoop","desc":"48mm scoop profile in obeche","cat":"Cushion & Scoop","mat":"Obeche","col":"Natural","fin":"Raw","prof":"Scoop","w":48,"d":18,"cpm":4.59,"cpf":1.40,"tags":["scoop","natural","obeche"]},
{"id":53,"sc":"YORK/0001","name":"Light Brown Wash Scoop","desc":"26mm light brown wash scoop","cat":"Cushion & Scoop","mat":"Wood","col":"Brown","fin":"Wash","prof":"Scoop","w":26,"d":14,"cpm":2.82,"cpf":0.86,"tags":["scoop","brown","wash"]},
{"id":54,"sc":"YORK/0003","name":"Pastel Pink Scoop","desc":"26mm pastel pink wash scoop","cat":"Cushion & Scoop","mat":"Wood","col":"Pink","fin":"Wash","prof":"Scoop","w":26,"d":14,"cpm":2.82,"cpf":0.86,"tags":["scoop","pink","pastel","colour"]},
# Box & Tray (5)
{"id":55,"sc":"000K/0477B","name":"Black Box Frame","desc":"30mm flat black box profile","cat":"Box & Tray","mat":"Wood","col":"Black","fin":"Paint","prof":"Box","w":30,"d":30,"cpm":4.10,"cpf":1.25,"tags":["box","black","deep"]},
{"id":56,"sc":"DISP/0001","name":"Unfinished Pine Box","desc":"45mm unfinished pine box frame","cat":"Box & Tray","mat":"Pine","col":"Natural","fin":"Raw","prof":"Box","w":45,"d":30,"cpm":1.74,"cpf":0.53,"tags":["box","pine","unfinished","budget"]},
{"id":57,"sc":"LUNA/0001","name":"Black Deep Rebate","desc":"13mm black flat deep rebate","cat":"Box & Tray","mat":"Wood","col":"Black","fin":"Paint","prof":"Flat","w":13,"d":22,"cpm":3.28,"cpf":1.00,"tags":["tray","black","deep","slim"]},
{"id":58,"sc":"LUNA/0004","name":"Light Grey Deep Rebate","desc":"13mm light grey flat deep rebate","cat":"Box & Tray","mat":"Wood","col":"Grey","fin":"Paint","prof":"Flat","w":13,"d":22,"cpm":3.28,"cpf":1.00,"tags":["tray","grey","deep","slim"]},
{"id":59,"sc":"LUNA/0008","name":"Taupe Deep Rebate","desc":"13mm taupe flat deep rebate","cat":"Box & Tray","mat":"Wood","col":"Grey","fin":"Paint","prof":"Flat","w":13,"d":22,"cpm":3.28,"cpf":1.00,"tags":["tray","taupe","deep","slim"]},
# Canvas & Floater (4)
{"id":60,"sc":"REMB/0009","name":"Black Stain Floater","desc":"84mm black stain floater frame","cat":"Canvas & Floater","mat":"Wood","col":"Black","fin":"Stain","prof":"Floater","w":84,"d":35,"cpm":11.32,"cpf":3.45,"tags":["floater","black","canvas","gallery"]},
{"id":61,"sc":"REMB/0011","name":"Brown Stain Floater","desc":"84mm brown stain floater frame","cat":"Canvas & Floater","mat":"Wood","col":"Brown","fin":"Stain","prof":"Floater","w":84,"d":35,"cpm":9.84,"cpf":3.00,"tags":["floater","brown","canvas","gallery"]},
{"id":62,"sc":"REMB/0013","name":"White Gloss Floater","desc":"84mm white gloss floater frame","cat":"Canvas & Floater","mat":"Wood","col":"White","fin":"Gloss","prof":"Floater","w":84,"d":35,"cpm":14.44,"cpf":4.40,"tags":["floater","white","canvas","premium"]},
{"id":63,"sc":"REMB/0014","name":"Natural Floater","desc":"84mm natural wood floater frame","cat":"Canvas & Floater","mat":"Wood","col":"Natural","fin":"Raw","prof":"Floater","w":84,"d":35,"cpm":9.84,"cpf":3.00,"tags":["floater","natural","canvas","gallery"]},
# Slips & Fillets (7)
{"id":64,"sc":"0006/G","name":"Plain Gold Slip","desc":"½\" plain gold slip","cat":"Slips & Fillets","mat":"Wood","col":"Gold","fin":"Gilt","prof":"Slip","w":13,"d":6,"cpm":1.84,"cpf":0.56,"tags":["slip","gold","accent"]},
{"id":65,"sc":"0006/S","name":"Plain Silver Slip","desc":"½\" plain silver slip","cat":"Slips & Fillets","mat":"Wood","col":"Silver","fin":"Gilt","prof":"Slip","w":13,"d":6,"cpm":1.84,"cpf":0.56,"tags":["slip","silver","accent"]},
{"id":66,"sc":"0007/G","name":"Wide Gold Slip","desc":"⅝\" gold slip","cat":"Slips & Fillets","mat":"Wood","col":"Gold","fin":"Gilt","prof":"Slip","w":16,"d":6,"cpm":1.84,"cpf":0.56,"tags":["slip","gold","wide"]},
{"id":67,"sc":"0007/S","name":"Wide Silver Slip","desc":"⅝\" silver slip","cat":"Slips & Fillets","mat":"Wood","col":"Silver","fin":"Gilt","prof":"Slip","w":16,"d":6,"cpm":1.44,"cpf":0.44,"tags":["slip","silver","wide"]},
{"id":68,"sc":"5017/6001","name":"Metallic Gold Fillet","desc":"16mm metallic gold slip fillet","cat":"Slips & Fillets","mat":"Wood","col":"Gold","fin":"Foil","prof":"Slip","w":16,"d":4,"cpm":0.33,"cpf":0.10,"tags":["fillet","gold","metallic","budget"]},
{"id":69,"sc":"5017/6002","name":"Metallic Silver Fillet","desc":"16mm metallic silver slip fillet","cat":"Slips & Fillets","mat":"Wood","col":"Silver","fin":"Foil","prof":"Slip","w":16,"d":4,"cpm":0.33,"cpf":0.10,"tags":["fillet","silver","metallic","budget"]},
{"id":70,"sc":"000J/0098","name":"Gold Foil Slip","desc":"10mm gold foil accent slip","cat":"Slips & Fillets","mat":"Wood","col":"Gold","fin":"Foil","prof":"Slip","w":10,"d":6,"cpm":2.17,"cpf":0.66,"tags":["slip","gold","foil","accent"]},
]

def build_product(r):
    return {
        "id": r["id"],
        "simonsCode": r["sc"],
        "name": r["name"],
        "description": r["desc"],
        "category": r["cat"],
        "material": r["mat"],
        "colour": r["col"],
        "finish": r["fin"],
        "profile": r.get("prof", "Flat"),
        "widthMm": r["w"],
        "depthMm": r["d"],
        "costPricePerMetre": round(r["cpm"], 2),
        "retailPricePerMetre": round(r["cpm"] * MARKUP, 2),
        "retailPricePerFoot": round(r["cpf"] * MARKUP, 2),
        "tags": r["tags"]
    }

catalog = [build_product(r) for r in RAW]

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"[OK] Generated {len(catalog)} products -> {OUTPUT}")

# Summary
cats = {}
for p in catalog:
    c = p["category"]
    if c not in cats: cats[c] = {"count":0,"min":999,"max":0}
    cats[c]["count"] += 1
    cats[c]["min"] = min(cats[c]["min"], p["retailPricePerMetre"])
    cats[c]["max"] = max(cats[c]["max"], p["retailPricePerMetre"])

print(f"\n{'Category':<25} {'Count':>5}  {'Price Range':>18}")
print("-" * 52)
for c, d in cats.items():
    print(f"{c:<25} {d['count']:>5}  {d['min']:.2f} - {d['max']:.2f}")
