import requests
import os
from tqdm import tqdm
import time

# -----------------------------
# 配置参数
# -----------------------------
categories = {
    "real_craters": [
        "meteor crater",
        "impact crater Mars",
        "impact site Earth",
        "meteorite impact structure",
        "lunar crater from orbit"
    ],
    "misrecognized_circular": [
        "volcano crater from above",
        "circular irrigation field satellite",
        "open pit mine aerial view",
        "dry lake circular pattern",
        "coral atoll satellite view",
        "ring mountain formation"
    ]
}

max_pages = 3   # 每个关键词抓取页数
delay = 1       # 请求间隔
root_folder = "nasa_crater_dataset"

os.makedirs(root_folder, exist_ok=True)

# -----------------------------
# 抓取函数
# -----------------------------
def fetch_images(category, query):
    save_folder = os.path.join(root_folder, category, query.replace(" ", "_"))
    os.makedirs(save_folder, exist_ok=True)

    print(f"\n🔍 [{category}] 抓取 '{query}' 的影像...")
    image_count = 0

    for page in range(1, max_pages + 1):
        url = f"https://images-api.nasa.gov/search?q={query}&media_type=image&page={page}"
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            items = data['collection']['items']

            for item in tqdm(items, desc=f"第 {page} 页"):
                try:
                    img_url = item['links'][0]['href']
                    img_data = requests.get(img_url, timeout=10).content
                    image_count += 1
                    img_name = os.path.join(save_folder, f"img_{image_count}.jpg")
                    with open(img_name, "wb") as f:
                        f.write(img_data)
                except Exception as e:
                    print(f"❌ 下载失败: {e}")
            time.sleep(delay)
        except Exception as e:
            print(f"⚠️ 请求第 {page} 页失败: {e}")

    print(f"✅ [{category}] '{query}' 抓取完成，共 {image_count} 张图片。")

# -----------------------------
# 主程序
# -----------------------------
for category, query_list in categories.items():
    for q in query_list:
        fetch_images(category, q)

print("\n🎉 全部真实与误认陨石坑影像抓取完毕！")
print(f"📁 数据集保存在：{os.path.abspath(root_folder)}")
