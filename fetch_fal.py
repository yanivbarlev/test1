import requests
import os
import glob
import re
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import argparse
import fal_client
import time

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
    """Extracts keywords and context from HTML for technical article images."""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

            title = soup.title.string if soup.title else ''
            h1 = soup.h1.string if soup.h1 else ''
            
            # Try to get content/meta description for additional context
            meta_desc = ''
            meta_tag = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
            if meta_tag and 'content' in meta_tag.attrs:
                meta_desc = meta_tag['content']
                
            # Extract article type from filename or path
            file_name = os.path.basename(html_path)
            article_type = ""
            if "review" in file_name:
                article_type = "review"
            elif "comparison" in file_name:
                article_type = "comparison"
            elif "tutorial" in file_name:
                article_type = "tutorial"
            elif "guide" in file_name:
                article_type = "guide"
            
            # Prioritize H1, fallback to title
            text_source = h1 if h1 else title

            # Basic keyword extraction (remove common words, split)
            text_source = text_source.replace('- Upingi.com', '').strip()
            # Remove potential prefixes like "Placeholder:", "Review:", etc.
            text_source = re.sub(r'^\w+:\s*', '', text_source, flags=re.IGNORECASE)
            
            # Extract main keywords
            # Handle "vs" comparisons specially
            if " vs" in text_source.lower() or "vs." in text_source.lower():
                parts = re.split(r'\s+vs\.?\s+', text_source, flags=re.IGNORECASE)
                main_keywords = parts
            else:
                # Remove "vs." and split
                keywords = re.split(r'\s*:\s*|\s+', text_source)
                # Filter out short words or common terms
                common_words = {'a', 'the', 'and', 'or', 'to', 'in', 'for', 'of', 'is', 'it', 'vs'}
                main_keywords = [k for k in keywords if k.lower() not in common_words and len(k) > 2]

            # Join the most relevant keywords for search
            primary_subject = " ".join(main_keywords[:3]) # Use top 3 keywords
            
            # Create context-aware search query based on article type
            if article_type == "review":
                search_query = f"{primary_subject} technical overview"
            elif article_type == "comparison":
                search_query = f"{primary_subject} technical comparison"
            elif article_type == "tutorial":
                search_query = f"{primary_subject} technical tutorial"
            elif article_type == "guide":
                search_query = f"{primary_subject} technical guide"
            else:
                search_query = f"{primary_subject} technical concept"
                
            print(f"  -> Generated search query: '{search_query}'")
            print(f"  -> Article type detected: {article_type if article_type else 'general'}")
            return search_query

    except Exception as e:
        print(f"  -> Error parsing HTML {html_path}: {e}")
        return None

def fetch_and_save_image(keyword, save_path, fal_key):
    """Generates an image using fal.ai based on keyword and saves it."""
    if not fal_key:
        print("  -> Error: FAL_KEY not found.")
        return False

    try:
        print(f"  -> Generating image using fal.ai for '{keyword}'...")
        # Set up fal.ai client with the API key
        os.environ["FAL_KEY"] = fal_key
        
        # Submit image generation request
        handler = fal_client.submit(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": f"Create an image of {keyword}",
                "num_inference_steps": 4,
                "num_images": 1,
                "image_size": "landscape_16_9",
                "enable_safety_checker": False
            },
        )
        
        # Get the result (with a timeout)
        timeout = 60  # seconds
        start_time = time.time()
        result = None
        
        while time.time() - start_time < timeout:
            try:
                result = handler.get()
                break
            except Exception as e:
                if "is still running" in str(e):
                    print(f"  -> Waiting for image generation to complete...")
                    time.sleep(3)
                else:
                    raise e
                    
        if not result:
            print(f"  -> Timeout waiting for image generation")
            return False
            
        # Get the image URL
        image_url = result['images'][0]['url']
        print(f"  -> Generated image URL: {image_url}")
        
        # Download the image
        img_response = requests.get(image_url, stream=True, timeout=20)
        img_response.raise_for_status()

        # Ensure directory exists before saving
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, 'wb') as f:
            for chunk in img_response.iter_content(1024*8):
                f.write(chunk)
        print(f"  -> Successfully saved image to {save_path}")
        return True

    except Exception as e:
        print(f"  -> Error generating or saving image: {e}")
        return False


# --- Main Execution ---
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate images using fal.ai for HTML pages.")
    parser.add_argument("--env", default=ENV_PATH, help=f"Path to the .env file (default: {ENV_PATH})")
    parser.add_argument("--pages", default=PAGES_DIR, help=f"Directory containing HTML pages (default: {PAGES_DIR})")
    parser.add_argument("--images", default=SAVE_DIR, help=f"Directory to save downloaded images (default: {SAVE_DIR})")

    args = parser.parse_args()

    # Load API key from .env file
    print(f"Loading environment variables from: {args.env}")
    if not os.path.exists(args.env):
         print(f"Error: .env file not found at {args.env}")
         print("Please ensure the .env file exists and contains FAL_KEY=YOUR_KEY_HERE")
         exit(1)

    load_dotenv(dotenv_path=args.env)
    FAL_KEY = os.getenv("FAL_KEY")

    if not FAL_KEY:
        print(f"Error: FAL_KEY not found in {args.env}. Make sure it's set correctly.")
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
            if fetch_and_save_image(keywords, image_save_path, FAL_KEY):
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