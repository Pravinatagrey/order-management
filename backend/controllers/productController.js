const fs = require("fs");
const path = require("path");

const category = (filename) => {
    const name = path.parse(filename).name.toLowerCase();
    if(name.includes("burger")) return "Burger";
    if(name.includes("pizza")) return "Pizza";
    if(name.includes("drink")) return "Drink";
    if(name.includes("dessert")) return "Dessert";
    return "Other";
}

const nameParse = (text)=> { 
   if (!text) return "";

  // 1. Remove file extension (everything from the last dot to the end)
  const nameWithoutExt = text.substring(0, text.lastIndexOf('.')) || text;

  // 2. Replace underscores with spaces
  const nameWithSpaces = nameWithoutExt.replaceAll("_", " ");

  // 3. Capitalize the first character of every word
  return nameWithSpaces.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

exports.getImages = (req, res) => {
    const uploadDir = path.join(__dirname, "../images");

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Unable to read images" });
        }
// Define allowed image extensions
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
// Filter and map the files to include only images with their respective categories and URLs
        const images1 = files
            .filter(file =>
                imageExtensions.includes(path.extname(file).toLowerCase())
            )
            .map(file =>(
                {
                _id: path.parse(file).name,
                productId: path.parse(file).name,
                name: file,
                category: category(file),
                image: `${req.protocol}://${req.get("host")}/images/${file}`,
                rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
                reviews: Math.floor(Math.random() * 100) + 1 // Random number of reviews between 1 and 100  
            }));
            // Assigning costs based on category
            images1.map(image => {
                if(image.category === "Burger") {
                    image.cost = 12.99;
                }   
                else if(image.category === "Pizza") {
                    image.cost = 15.99;
                }
                else if(image.category === "Drink") {
                    image.cost = 2.99;
                }
                else if(image.category === "Dessert") {
                    image.cost = 6.99;
                }
                else {
                    image.cost = 9.99;
                } 
              image.name=nameParse(image.name);
            });    
        res.json(images1);
    });
};
