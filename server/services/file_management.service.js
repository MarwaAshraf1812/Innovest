const path = require('path');
const fs = require('fs').promises; // Use fs.promises for async/await
class FileManagement {
    default_upload_path = path.join(__dirname, '/../uploads');

    resolve_file_path(file_name, directory = this.default_upload_path) {
        const cleanName = path.basename(file_name || '');
        return path.join(directory, cleanName);
    }

    async check_if_file_exist(file_name, directory = this.default_upload_path) {
        try {
            const fullPath = this.resolve_file_path(file_name, directory);
            await fs.access(fullPath);
            return true;
        } catch (err) {
            return false;
        }
    }

    async save_file(file, directory = this.default_upload_path) {
        try {
            // Create the directory if it doesn't exist
            await fs.mkdir(directory, { recursive: true });

            const ext = path.extname(file.originalname || '');
            const basename = path.basename(file.originalname || 'file', ext);
            const uniqueFileName = `${basename}-${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
            const filePath = path.join(directory, uniqueFileName);

            // Save the file asynchronously
            await fs.writeFile(filePath, file.buffer);
            return uniqueFileName; // Store relative filename only
        } catch (err) {
            console.error('Error saving file:', err);
            throw new Error('Error saving file');
        }
    }

    async delete_file(filePath) {
        try {
            if (filePath) {
                const fullPath = path.isAbsolute(filePath) ? filePath : this.resolve_file_path(filePath);
                await fs.unlink(fullPath);
                console.log('File deleted successfully');
            }
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    }
}

module.exports = new FileManagement();
