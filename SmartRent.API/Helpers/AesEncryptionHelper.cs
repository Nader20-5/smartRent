using System.Security.Cryptography;
using System.Text;

namespace SmartRent.API.Helpers
{
    public class AesEncryptionHelper
    {
        private readonly byte[] _key;

        public AesEncryptionHelper(IConfiguration configuration)
        {
            var keyString = configuration["SecuritySettings:EncryptionKey"] 
                ?? throw new InvalidOperationException("EncryptionKey is missing from configuration.");
                
            // Ensure the key is exactly 32 bytes for AES-256
            // In a real scenario, this should be decoded from a Base64 string or stored as bytes.
            // For this project, we'll pad or truncate to ensure 32 bytes.
            var keyBytes = Encoding.UTF8.GetBytes(keyString);
            _key = new byte[32];
            Array.Copy(keyBytes, _key, Math.Min(keyBytes.Length, 32));
        }

        public async Task EncryptStreamAsync(Stream inputStream, Stream outputStream)
        {
            using var aes = Aes.Create();
            aes.Key = _key;
            aes.GenerateIV();

            // Write IV to the beginning of the output stream
            await outputStream.WriteAsync(aes.IV, 0, aes.IV.Length);

            using var cryptoStream = new CryptoStream(outputStream, aes.CreateEncryptor(), CryptoStreamMode.Write, leaveOpen: true);
            await inputStream.CopyToAsync(cryptoStream);
            await cryptoStream.FlushFinalBlockAsync();
        }

        public async Task DecryptStreamAsync(Stream inputStream, Stream outputStream)
        {
            using var aes = Aes.Create();
            aes.Key = _key;

            // Read the IV from the beginning of the input stream
            var iv = new byte[aes.BlockSize / 8];
            var bytesRead = await inputStream.ReadAsync(iv, 0, iv.Length);
            
            if (bytesRead < iv.Length)
                throw new CryptographicException("Failed to read the Initialization Vector (IV) from the stream.");

            aes.IV = iv;

            using var cryptoStream = new CryptoStream(inputStream, aes.CreateDecryptor(), CryptoStreamMode.Read, leaveOpen: true);
            await cryptoStream.CopyToAsync(outputStream);
        }
    }
}
