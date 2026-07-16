const path = require('path');
const fs = require('fs').promises; // Use fs.promises for async/await
class FileManagement {
    default_upload_path = path.join(__dirname, '/../uploads');

    async check_if_file_exist(file_name, directory = this.default_upload_path) {
        try {
            await fs.access(path.join(directory, file_name));
            return true;
        } catch (err) {
            return false;
        }
    }

    async save_file(file, directory = this.default_upload_path) {
        try {
            // Create the directory if it doesn't exist
            await fs.mkdir(directory, { recursive: true });

            // Save the file asynchronously
            await fs.writeFile(path.join(directory, file.originalname), file.buffer);
            return path.join(directory, file.originalname);
        } catch (err) {
            console.error('Error saving file:', err);
            throw new Error('Error saving file');
        }
    }

    async delete_file(file, directory = this.default_upload_path) {
        try {
            const file_path = path.join(directory, file);
            await fs.unlink(file_path);
            console.log('File deleted successfully');
        } catch (err) {
            console.error('Error deleting file:', err);
            throw new Error('Error deleting file');
        }
    }
}

module.exports = new FileManagement();
