// You have to write a Node.js program to clear clutter inside of a directory and organize the contents of that directory into different folders

// for example, these files become:

// 1. name.jpg
// 2. name.png
// 3. this.pdf 
// 4. harry.zip
// 5. Rohan.zip
// 6. cat.jpg 
// 7. harry.pdf

// this: 
// jpg/name.jpg, jpg/cat.jpg 
// png/name.png 
// pdf/this.pdf pdf/harry.pdf
// zip/harry.zip zip/Rohan.zip

const fs = require('fs');
const path = require('path');

// Function to get all file extensions in the directory
async function getExtensions(directoryPath) {
    try {
        const files = await fs.promises.readdir(directoryPath); // It will read the directory and store them in files array
        let fileMap = new Map(); // Map to store file extensions and their corresponding files

        files.forEach(file => {
            const ext = path.extname(file); // Get the file extension using path.extname
            if (ext) {
                if (!fileMap.has(ext)) { // Check if the map already has the extension
                    // If not, create a new entry in the map
                    fileMap.set(ext, []);
                }
                fileMap.get(ext).push(file); // It will add the file to the corresponding extension array
            }
        });

        return { directoryPath, fileMap }; // Return the directory path and the map of file extensions and files
    } catch (err) {
        console.error("Error reading the directory:", err);
        return { directoryPath, fileMap: new Map() }; // Return an empty map in case of error to avoid crashing the program
    }
}

// Function to create a folder for a specific file extension
async function createDirectory(directoryPath, ext) {
    const dirPath = path.join(directoryPath, ext.substring(1)); // Removing '.' from the extension and joining them as path/ext

    try {
        await fs.promises.mkdir(dirPath, { recursive: true }); // Creating directory and using recursive: true to avoid errors if the directory already exists
        console.log(`Directory created: ${dirPath}`);
    } catch (err) {
        console.error(`Error creating directory '${dirPath}':`, err);
    }
}

// Function to move files to their respective folders
async function moveFile(directoryPath, file, ext) {
    const oldPath = path.join(directoryPath, file); // Get the old file path
    const newFolder = path.join(directoryPath, ext.substring(1)); // Get the new folder path
    const newPath = path.join(newFolder, file); // Get the new file path

    try {
        await fs.promises.rename(oldPath, newPath); // Rename (move -> cut) the file to the new path
        console.log(`Moved: ${file} -> ${newPath}`);
    } catch (err) {
        console.error(`Error moving file '${file}':`, err);
    }
}

// Function to organize files into their respective folders
async function organizeFilesByExtension(directoryPath) {
    const { fileMap } = await getExtensions(directoryPath); // Get the file map

    for (const [ext, files] of fileMap.entries()) { // Looping through the map of file extensions and files
        await createDirectory(directoryPath, ext); // Creating directory one for each extension
        for (const file of files) {
            await moveFile(directoryPath, file, ext); // Moving files to their respective folders
        }
    }
}

// This will execute function
organizeFilesByExtension("./Files/");