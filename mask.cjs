const Jimp = require('jimp');

async function maskImage() {
  try {
    const image = await Jimp.read('./public/rpf-logo.jpg');
    
    // Convert to PNG compatible format (rgba)
    image.rgba(true);
    
    const size = Math.min(image.bitmap.width, image.bitmap.height);
    // The image has a slight padding in the JPG, so we multiply radius by 0.95 to tighten the circle!
    const radius = (size / 2) * 0.96; 
    const cx = image.bitmap.width / 2;
    const cy = image.bitmap.height / 2;
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance > radius) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      } else if (distance > radius - 2) {
        // Anti-aliasing edge
        const alpha = Math.max(0, 255 - (distance - (radius - 2)) * 127);
        this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha);
      }
    });
    
    await image.writeAsync('./public/rpf-logo.png');
    await image.writeAsync('./src/assets/rpf-logo.png');
    console.log('Successfully created circular transparent PNGs!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

maskImage();
