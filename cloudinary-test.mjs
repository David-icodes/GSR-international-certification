import cloudinary from "cloudinary";

// Configure Cloudinary with inline credentials
cloudinary.v2.config({
  cloud_name: "dxl9m8ibe",
  api_key: "717533298313174",
  api_secret: "DJrD9X7j4CKfG94gvzmuTqWis9M"
});

const SAMPLE_URL = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

async function main() {
  // 1. Upload a sample image
  console.log("Uploading sample image...");
  const uploadResult = await cloudinary.v2.uploader.upload(SAMPLE_URL, {
    public_id: "onboarding_sample"
  });
  console.log("Uploaded — secure URL:", uploadResult.secure_url);
  console.log("Public ID:", uploadResult.public_id);

  // 2. Get image details (width, height, format, file size in bytes)
  console.log("\nImage metadata:");
  console.log("  Width:    " + uploadResult.width + " px");
  console.log("  Height:   " + uploadResult.height + " px");
  console.log("  Format:   " + uploadResult.format);
  console.log("  Size:     " + uploadResult.bytes + " bytes");

  // 3. Generate a transformed URL with f_auto and q_auto
  //    f_auto — lets Cloudinary pick the optimal format (e.g. WebP) based on the browser
  //    q_auto — lets Cloudinary pick the optimal compression level balancing quality and file size
  const transformedUrl = cloudinary.v2.url("onboarding_sample", {
    fetch_format: "auto",  // f_auto — Cloudinary picks optimal format (e.g. WebP)
    quality: "auto",       // q_auto — Cloudinary picks optimal compression
    secure: true
  });

  console.log("\nDone! Click link below to see optimized version of the image.");
  console.log("Check the size and the format.");
  console.log("Transformed URL: " + transformedUrl);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
