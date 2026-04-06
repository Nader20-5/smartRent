namespace SmartRent.API.Helpers
{
    public class FileUploadHelper
    {
        private readonly IWebHostEnvironment _env;

        public FileUploadHelper(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public bool DeleteFile(string filePath)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public bool IsValidImage(IFormFile file)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public bool IsValidDocument(IFormFile file)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
