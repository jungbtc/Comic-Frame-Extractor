
# Comic Frame Extractor (Python Script)

This is a command-line tool to automatically detect and extract individual frames from a single comic strip or manga page image.

It works by analyzing the image and identifying the "gutters" (the white space) between panels to determine where to cut.

## Requirements

- Python 3.6+

## Setup

1.  **Clone or download the script files.**
    You will need `extract_frames.py` and `requirements.txt`.

2.  **Create a virtual environment (Recommended).**
    Open your terminal or command prompt in the project directory and run:
    ```bash
    python -m venv venv
    ```
    Activate the environment:
    - On Windows: `venv\Scripts\activate`
    - On macOS/Linux: `source venv/bin/activate`

3.  **Install the necessary libraries.**
    With your virtual environment active, install the dependencies from the `requirements.txt` file:
    ```bash
    pip install -r requirements.txt
    ```

## How to Run

Place the comic image you want to process in the same directory as the script, or provide a full path to it.

Run the script from your terminal, pointing it to your image file.

### Basic Usage

```bash
python extract_frames.py your_comic_page.png
```

This will analyze `your_comic_page.png` and save the output frames into a new folder named `extracted_frames`.

### Specifying an Output Directory

You can use the `-o` or `--output` flag to specify a different folder for the results.

```bash
python extract_frames.py path/to/your/comic.jpg -o my_custom_output_folder
```

This will save the frames into `my_custom_output_folder`.
