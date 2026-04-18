import pdfminer.high_level
import sys

def main():
    if len(sys.argv) < 3:
        print("Usage: python extract.py <pdf_file> <output_file>")
        return
    
    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        text = pdfminer.high_level.extract_text(pdf_path)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Successfully extracted text to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
