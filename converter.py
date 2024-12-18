import pandas as pd

def xlsx_to_json(xlsx_file_path, json_file_path):
    try:
        # Read the XLSX file using pandas
        df = pd.read_excel(xlsx_file_path, names=['src', 'product-grid-item__info-container__name', 'price', 'old', 'ng-star-inserted'])

        # Convert the DataFrame to JSON
        df.to_json(json_file_path, orient='records')
        print(f"Successfully converted '{xlsx_file_path}' to '{json_file_path}'")
    except FileNotFoundError:
        print(f"Error: XLSX file not found at '{xlsx_file_path}'")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage (replace with your file paths):
xlsx_file_path = "pnp_data/pnp_promotion_18dec_24.xlsx"  # Your XLSX file path
json_file_path = "pnp_data/output.json"  # Desired JSON file path
xlsx_to_json(xlsx_file_path, json_file_path)