import csv
import random

# 29 chữ cái VSL
vsl_labels = ['A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y']

with open('asl_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    header = ['label']
    for i in range(21):
        header.extend([f'x{i}', f'y{i}'])
    writer.writerow(header)
    
    for label in vsl_labels:
        for _ in range(100):
            row = [label] + [random.uniform(-1.0, 1.0) for _ in range(42)]
            writer.writerow(row)

print("✅ Đã tạo file asl_data.csv chứa dữ liệu 29 chữ cái!")