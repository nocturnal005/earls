import os
import re
from PIL import Image

premium_dir = r"C:\Users\44755\Desktop\earls works\Premium — Missing image field AND no file on disk (18 frames)"
everyday_dir = r"C:\Users\44755\Desktop\earls works\Everyday — Missing image field AND no file on disk (8 frames)"
output_dir = r"C:\Users\44755\Desktop\earls\configurator\public\mouldings"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def is_background(rgba):
    if len(rgba) == 4 and rgba[3] < 10:
        return True
    r, g, b = rgba[:3]
    if r > 240 and g > 240 and b > 240:
        return True
    return False

def find_crop_start_x(image):
    width, height = image.size
    pixels = image.load()
    y = height - 2 # Check near the bottom edge
    
    for x in range(width):
        rgba = pixels[x, y]
        if not is_background(rgba):
            return x
    return 0

def extract_code(filename):
    base = re.sub(r'\.(jpg|jpeg|png)$', '', filename, flags=re.IGNORECASE)
    match = re.search(r'[A-Z0-9]+(?:_[A-Z0-9]+)*(?:_S)?$', base, re.IGNORECASE)
    if match:
        return match.group(0) + ".jpg"
    return filename

def process_directory(directory):
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return

    for file in os.listdir(directory):
        if not file.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue

        input_path = os.path.join(directory, file)
        target_filename = extract_code(file)
        
        # Hardcoded overrides
        if file == "Antique Wood with Gold Line _000S_21.jpg": target_filename = "000S_21.jpg"
        elif file == "Brushed gold BRISTOL_09.jpg": target_filename = "BRISTOL_09.jpg"
        elif file == "Brushed gold _BRISTOL_0007.jpg": target_filename = "BRISTOL_0007.jpg"
        elif file == "Ovaloe Brushed Gold_ 5401_6018.jpg": target_filename = "5401_6018.jpg"
        elif file == "Ovaloe Brushed Silver _5403_7018.jpg": target_filename = "5403_7018.jpg"
        elif file == "distressed silver leaf_860A_3_S.jpg": target_filename = "860A_3_S.jpg"
        elif file == "reverse silver leaf_000S_926.jpg": target_filename = "000S_926.jpg"

        target_filename = re.sub(r'\.png$', '.jpg', target_filename, flags=re.IGNORECASE)
        output_path = os.path.join(output_dir, target_filename)

        print(f"Processing {file} -> {target_filename}...")

        try:
            image = Image.open(input_path).convert("RGBA")
            start_x = find_crop_start_x(image)
            
            if 0 < start_x < image.width * 0.5:
                print(f"  Cropping out cross-section at X={start_x}")
                image = image.crop((start_x, 0, image.width, image.height))
            else:
                print(f"  Could not reliably detect cross-section (StartX={start_x}). Leaving intact.")
            
            # Rotate 90 degrees CCW (which in PIL is Image.ROTATE_90)
            image = image.transpose(Image.ROTATE_90)
            
            # Convert back to RGB for saving as JPG
            image = image.convert("RGB")
            image.save(output_path, "JPEG", quality=95)
            print(f"  Saved to {output_path}")
        except Exception as e:
            print(f"  Error processing {file}: {e}")

process_directory(premium_dir)
process_directory(everyday_dir)
print("Done!")
