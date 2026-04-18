namespace SmartRent.API.Helpers
{
    /// <summary>
    /// Handles file I/O for uploaded images and documents.
    /// Files are saved under {WebRoot}/{folder}/{fileName}.
    /// </summary>
    public class FileUploadHelper
    {
        private readonly IWebHostEnvironment _env;

        private static readonly HashSet<string> _allowedImageExtensions =
            new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        private static readonly HashSet<string> _allowedDocumentExtensions =
            new(StringComparer.OrdinalIgnoreCase) { ".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png" };

        private const long MaxImageSizeBytes = 5 * 1024 * 1024;    // 5 MB
        private const long MaxDocumentSizeBytes = 10 * 1024 * 1024; // 10 MB

        public FileUploadHelper(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Saves a form file to wwwroot/{folder}/ and returns the relative URL path.
        /// </summary>
        /// <param name="file">The uploaded file.</param>
        /// <param name="folder">Relative folder under wwwroot — e.g. "uploads/properties/42"</param>
        /// <returns>Relative URL path — e.g. "/uploads/properties/42/abc123.jpg"</returns>
        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.", nameof(file));

            var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var absoluteFolder = Path.Combine(webRootPath, folder.TrimStart('/', '\\'));

            if (!Directory.Exists(absoluteFolder))
                Directory.CreateDirectory(absoluteFolder);

            var extension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
            var absoluteFilePath = Path.Combine(absoluteFolder, uniqueFileName);

            await using var stream = new FileStream(absoluteFilePath, FileMode.Create);
            await file.CopyToAsync(stream);

            // Return URL-style relative path (forward slashes)
            var relativePath = Path.Combine(folder, uniqueFileName)
                .Replace('\\', '/');

            return $"/{relativePath.TrimStart('/')}";
        }

        /// <summary>
        /// Deletes a file given its relative URL path (e.g. "/uploads/properties/1/abc.jpg").
        /// </summary>
        /// <returns>true if the file was deleted; false if it did not exist.</returns>
        public bool DeleteFile(string relativeUrlPath)
        {
            if (string.IsNullOrWhiteSpace(relativeUrlPath))
                return false;

            var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var absolutePath = Path.Combine(webRootPath, relativeUrlPath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar));

            if (!File.Exists(absolutePath))
                return false;

            File.Delete(absolutePath);
            return true;
        }

        /// <summary>
        /// Returns true when the file is a valid image (extension + size).
        /// </summary>
        public bool IsValidImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return false;

            var extension = Path.GetExtension(file.FileName);
            return _allowedImageExtensions.Contains(extension) && file.Length <= MaxImageSizeBytes;
        }

        /// <summary>
        /// Returns true when the file is a valid document (extension + size).
        /// </summary>
        public bool IsValidDocument(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return false;

            var extension = Path.GetExtension(file.FileName);
            return _allowedDocumentExtensions.Contains(extension) && file.Length <= MaxDocumentSizeBytes;
        }

        /// <summary>
        /// Convenience method — uploads a collection of images for a property
        /// and returns a list of their relative URL paths.
        /// </summary>
        /// <param name="files">Uploaded image files</param>
        /// <param name="propertyId">Property ID used to build the storage path</param>
        public async Task<List<string>> UploadPropertyImagesAsync(IEnumerable<IFormFile> files, int propertyId)
        {
            var urls = new List<string>();
            var folder = $"uploads/properties/{propertyId}";

            foreach (var file in files)
            {
                if (!IsValidImage(file))
                    throw new InvalidOperationException(
                        $"File '{file.FileName}' is not a valid image or exceeds the 5 MB size limit.");

                var url = await UploadFileAsync(file, folder);
                urls.Add(url);
            }

            return urls;
        }
    }
}
