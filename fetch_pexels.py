import requests
import os
import glob
import re
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import argparse

# --- Configuration ---
# Directory containing the HTML pages relative to the script location
PAGES_DIR = './pages'
# Directory to save images relative to the script location
SAVE_DIR = './images'
# Path to the .env file - *Adjust if script is not in the project root*
# Assuming script is run from 'C:\Users\User\Downloads\upingi v3\'
ENV_PATH = './env/.env'
# --- End Configuration ---

# --- Files to Skip ---
# List of specific HTML filenames to skip processing for images
FILES_TO_SKIP = {
    'index.html',      # Main index
    'about.html',
    'contact.html',
    'privacy.html',
    'terms.html',
    'reviews.html',    # Category index pages
    'comparisons.html',
    'tutorials.html',
    'guides.html',
    'review.html',     # Base templates (if they exist in pages dir)
    'comparison.html',
    'tutorial.html',
    'guide.html'
}
# --- End Files to Skip ---

def sanitize_filename(name):
    """Removes invalid characters for filenames."""
    # Remove non-alphanumeric characters except hyphens and underscores
    name = re.sub(r'[^\w\-]+', '_', name)
    # Replace multiple underscores/hyphens with a single one
    name = re.sub(r'[_]+', '_', name)
    name = re.sub(r'[-]+', '-', name)
    # Remove leading/trailing underscores/hyphens
    name = name.strip('_-')
    return name.lower()

def get_keywords_from_html(html_path):
    """Extracts keywords from HTML title or h1 tag."""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

            title = soup.title.string if soup.title else ''
            h1 = soup.h1.string if soup.h1 else ''

            # Prioritize H1, fallback to title
            text_source = h1 if h1 else title

            # Basic keyword extraction (remove common words, split)
            text_source = text_source.replace('- Upingi.com', '').strip()
            # Remove potential prefixes like "Placeholder:", "Review:", etc.
            text_source = re.sub(r'^\w+:\s*', '', text_source, flags=re.IGNORECASE)
            # Remove "vs." and split
            keywords = re.split(r'\s+vs\.?\s+|\s*:\s*|\s+', text_source)

            # Filter out short words or common terms if needed (optional)
            common_words = {'a', 'the', 'and', 'or', 'to', 'in', 'for', 'of', 'is', 'it', 'vs'}
            keywords = [k for k in keywords if k.lower() not in common_words and len(k) > 2]

            # Join the most relevant keywords for search
            search_query = " ".join(keywords[:3]) # Use top 3 keywords
            print(f"  -> Generated search query: '{search_query}'")
            return search_query

    except Exception as e:
        print(f"  -> Error parsing HTML {html_path}: {e}")
        return None

def fetch_and_save_image(keyword, save_path, pexels_api_key):
    """Fetches an image from Pexels based on keyword and saves it."""
    if not pexels_api_key:
        print("  -> Error: Pexels API Key not found.")
        return False

    search_url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": pexels_api_key
    }
    params = {
        "query": keyword,
        "per_page": 1,
        "orientation": "landscape"
    }

    try:
        print(f"  -> Searching Pexels for '{keyword}'...")
        response = requests.get(search_url, headers=headers, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        if not data['photos']:
            print(f"  -> No image found on Pexels for '{keyword}'")
            return False

        photo = data['photos'][0]
        image_url = photo['src']['large'] # Options: original, large2x, large, medium, small, portrait, landscape, tiny

        print(f"  -> Downloading image {photo['id']} from {image_url}...")
        img_response = requests.get(image_url, stream=True, timeout=20)
        img_response.raise_for_status()

        # Ensure directory exists before saving
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, 'wb') as f:
            for chunk in img_response.iter_content(1024*8):
                f.write(chunk)
        print(f"  -> Successfully saved image to {save_path}")
        return True

    except requests.exceptions.RequestException as e:
        print(f"  -> Error contacting Pexels API or downloading image: {e}")
        return False
    except (IOError, OSError) as e:
        print(f"  -> Error saving image {save_path}: {e}")
        return False
    except Exception as e:
         print(f"  -> An unexpected error occurred for keyword '{keyword}': {e}")
         return False


# --- Main Execution ---
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch images from Pexels for HTML pages.")
    parser.add_argument("--env", default=ENV_PATH, help=f"Path to the .env file (default: {ENV_PATH})")
    parser.add_argument("--pages", default=PAGES_DIR, help=f"Directory containing HTML pages (default: {PAGES_DIR})")
    parser.add_argument("--images", default=SAVE_DIR, help=f"Directory to save downloaded images (default: {SAVE_DIR})")

    args = parser.parse_args()

    # Load API key from .env file
    print(f"Loading environment variables from: {args.env}")
    if not os.path.exists(args.env):
         print(f"Error: .env file not found at {args.env}")
         print("Please ensure the .env file exists and contains PEXELS_API_KEY=YOUR_KEY_HERE")
         exit(1)

    load_dotenv(dotenv_path=args.env)
    PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

    if not PEXELS_API_KEY:
        print(f"Error: PEXELS_API_KEY not found in {args.env}. Make sure it's set correctly.")
        exit(1)

    # Find HTML files
    html_files = glob.glob(os.path.join(args.pages, '*.html'))

    if not html_files:
        print(f"No HTML files found in directory: {args.pages}")
        exit(0)

    print(f"\nFound {len(html_files)} HTML files in {args.pages}. Processing...\n")

    # Ensure image save directory exists
    if not os.path.exists(args.images):
        print(f"Creating image directory: {args.images}")
        try:
            os.makedirs(args.images)
        except OSError as e:
            print(f"Error creating directory {args.images}: {e}")
            exit(1)

    # Process each HTML file
    success_count = 0
    fail_count = 0
    skipped_non_content_count = 0
    skipped_existing_count = 0 # Counter for skipped existing images
    skipped_files_list = [] # Keep track of which specific non-content files were skipped

    for html_file in html_files:
        print(f"Processing: {html_file}")
        base_name = os.path.splitext(os.path.basename(html_file))[0]
        file_name_only = os.path.basename(html_file) # Get the filename e.g. 'about.html'

        # --- Skip Check for Non-Content Pages ---
        if file_name_only in FILES_TO_SKIP:
            print(f"  -> Skipping non-content page: {file_name_only}")
            skipped_non_content_count += 1
            skipped_files_list.append(file_name_only)
            print("-" * 20) # Separator
            continue
        # --- End Skip Check ---

        image_filename = sanitize_filename(base_name) + ".jpg" # e.g., slack_review.jpg
        image_save_path = os.path.join(args.images, image_filename)

        # --- Skip Check for Existing Image ---
        if os.path.exists(image_save_path):
            print(f"  -> Skipping: Image {image_filename} already exists.")
            skipped_existing_count += 1
            print("-" * 20) # Separator
            continue
        # --- End Skip Check ---

        keywords = get_keywords_from_html(html_file)
        if keywords:
            if fetch_and_save_image(keywords, image_save_path, PEXELS_API_KEY):
                success_count += 1
            else:
                fail_count += 1
        else:
            print("  -> Could not extract keywords to search for image.")
            fail_count += 1
        print("-" * 20) # Separator

    print("\n--- Summary ---")
    print(f"Successfully downloaded: {success_count}")
    print(f"Failed/Not found:      {fail_count}")
    print(f"Skipped (existing):    {skipped_existing_count}") # Use the dedicated counter
    if skipped_files_list:
        print(f"Skipped (non-content): {skipped_non_content_count} ({', '.join(skipped_files_list)})")
    print(f"Images saved to:       {os.path.abspath(args.images)}")
