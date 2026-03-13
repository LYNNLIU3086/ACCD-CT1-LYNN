from ultralytics import YOLO
import os, json

# -----------------------------
# 配置
# -----------------------------
model_path = "yolov8n.pt"  # 训练好的模型或 yolov8n.pt
image_root = "/Users/lynn/Documents/GitHub/ACCD-CT1-LYNN/MeteoriteNarrative/images"
output_json = "../web/image_data_detected.json"
output_detected_dir = "../web/detected_images"  # 保存带框图片
# -----------------------------

os.makedirs(os.path.dirname(output_json), exist_ok=True)
os.makedirs(output_detected_dir, exist_ok=True)

if not os.path.exists(image_root):
    print(f"错误：图片文件夹不存在 → {image_root}")
    exit(1)

print(f"正在扫描图片文件夹: {image_root}")

model = YOLO(model_path)
image_data = []

for root, dirs, files in os.walk(image_root):
    for f in files:
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(root, f)
            desc = f"类别: {os.path.basename(root)}"
            
            results = model.predict(path, save=True, save_dir=output_detected_dir)
            boxes = results[0].boxes.xyxy.cpu().numpy()  # shape: [num_boxes, 4]

            # 获取图片尺寸
            from PIL import Image
            w, h = Image.open(path).size

            # 标准化到 [0,1]，保存 JSON
            box_list = []
            for box in boxes:
                x1, y1, x2, y2 = box
                box_list.append({
                    "x1": x1 / w,
                    "y1": y1 / h,
                    "x2": x2 / w,
                    "y2": y2 / h
                })

            image_data.append({
                "original_path": path,
                "desc": desc,
                "count": len(boxes),
                "boxes": box_list,
                "path": f"detected_images/{os.path.basename(path)}"
            })

with open(output_json, "w") as f:
    json.dump(image_data, f, indent=2)


# 遍历图片
for root, dirs, files in os.walk(image_root):
    for f in files:
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(root, f)
            desc = f"类别: {os.path.basename(root)}"
            image_data.append({"original_path": path, "desc": desc})

if len(image_data) == 0:
    print("未找到图片，请确认 images 文件夹下有图片，后缀为 .jpg/.jpeg/.png")
    exit(1)

print(f"总共找到 {len(image_data)} 张图片，开始检测...")

# 检测并保存带框图片
for img in image_data:
    results = model.predict(img["original_path"], save=True, save_dir=output_detected_dir)
    img["count"] = len(results[0].boxes)
    # 更新路径为带框图片，相对 web/index.html
    new_name = os.path.basename(img["original_path"])
    img["path"] = f"detected_images/{new_name}"

# 保存 JSON
with open(output_json, "w") as f:
    json.dump(image_data, f, indent=2)

print(f"检测完成，总共 {len(image_data)} 张图片，JSON 保存到 {output_json}")
print(f"带检测框图片已保存到 {output_detected_dir}")
