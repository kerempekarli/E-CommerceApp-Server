const multer = require("multer");
const fs = require("fs");

// Resmi okuyup Base64 formatına dönüştürme fonksiyonu
const imageToBase64 = (imagePath) => {
  // Resmi okuma
  const imageBuffer = fs.readFileSync(imagePath);

  // Buffer'ı Base64 formatına dönüştürme
  const base64Image = imageBuffer.toString("base64");

  return base64Image;
};
const storage = multer.diskStorage({
  destination: "uploads", // Dosyaların kaydedileceği klasörü belirtin
  filename: function (req, file, cb) {
    // Unique bir dosya adı oluşturun
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

module.exports = { storage, imageToBase64 };
