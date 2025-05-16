from fastapi import FastAPI, File, UploadFile # type: ignore
from fastapi.responses import FileResponse # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import os
from pdf2image import convert_from_bytes # type: ignore
from zipfile import ZipFile

app = FastAPI()

# Allow frontend access (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(pdf: UploadFile = File(...)):
    contents = await pdf.read()

    try:
        # Convert PDF to images
        images = convert_from_bytes(contents, fmt='jpeg')

        # Create output directory
        output_dir = "output"
        os.makedirs(output_dir, exist_ok=True)

        zip_path = os.path.join(output_dir, "converted.zip")

        # Save images and zip them
        with ZipFile(zip_path, 'w') as zipf:
            for i, image in enumerate(images):
                img_path = os.path.join(output_dir, f"page_{i+1}.jpg")
                image.save(img_path, "JPEG")
                zipf.write(img_path, f"page_{i+1}.jpg")
                os.remove(img_path)

        return FileResponse(zip_path, media_type="application/zip", filename="converted.zip")

    except Exception as e:
        return {"error": str(e)}
