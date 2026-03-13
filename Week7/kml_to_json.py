import xmltodict
import json

# ===== 配置 =====
kml_file = 'mymap.kml'      # 你的 KML 文件名
output_file = 'treeData.json'  # 输出 JSON 文件名

# ===== 读取 KML =====
with open(kml_file, 'r', encoding='utf-8') as f:
    kml_data = f.read()

kml_dict = xmltodict.parse(kml_data)

# ===== 递归查找所有 Placemark =====
def find_placemarks(node, folder_name="Uncategorized"):
    placemarks = []
    if isinstance(node, dict):
        for k, v in node.items():
            if k == 'Placemark':
                if isinstance(v, list):
                    for pm in v:
                        pm['folder'] = folder_name
                        placemarks.append(pm)
                else:
                    v['folder'] = folder_name
                    placemarks.append(v)
            elif k in ['Folder', 'Document']:
                if isinstance(v, list):
                    for item in v:
                        placemarks.extend(find_placemarks(item, folder_name=item.get('name', folder_name)))
                else:
                    placemarks.extend(find_placemarks(v, folder_name=v.get('name', folder_name)))
    elif isinstance(node, list):
        for item in node:
            placemarks.extend(find_placemarks(item, folder_name))
    return placemarks

placemarks = find_placemarks(kml_dict)
print(f"找到 {len(placemarks)} 个 Placemark")

# ===== 构建树 =====
tree = {"name": "Home", "type": "Home", "children": []}
categories = {}

for pm in placemarks:
    category_name = pm.get('folder', 'Uncategorized')
    if category_name not in categories:
        categories[category_name] = {"name": category_name, "type": "Category", "children": []}
        tree['children'].append(categories[category_name])
    
    name = pm.get('name', 'Unknown')
    coords = pm.get('Point', {}).get('coordinates', '')  # "lng,lat,alt"
    categories[category_name]['children'].append({
        "name": name,
        "type": "Location",
        "coordinates": coords,
        "travelTime": 0,   # 可后续手动填写
        "stayTime": 0
    })

# ===== 保存 JSON =====
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(tree, f, ensure_ascii=False, indent=2)

print(f"生成完成: {output_file}")
