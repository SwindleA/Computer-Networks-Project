using System.Text.Json;
using api_server.Domain;
namespace api_server.Data
{
    public class FileWriter
    {



        public static async Task WriteToFile<T>(string filePath, T obj)
        {

            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonString = JsonSerializer.Serialize(obj, options);
            await File.WriteAllTextAsync(filePath, jsonString);

        }


        public static async Task<List<Chat>> ReadChatsFromFile(string filePath)
        {
            int retryCount = 5;
            int delayMilliseconds = 4;

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"The file {filePath} does not exist.");
            }

            for (int i = 0; i < retryCount; i++)
            {
                try
                {
                    // Try to read the file and deserialize the contents
                    string jsonString = await File.ReadAllTextAsync(filePath);
                    return JsonSerializer.Deserialize<List<Chat>>(jsonString);
                }
                catch (IOException ex)
                {
                    // If an I/O exception occurs (file is being used), wait and retry
                    Console.WriteLine($"Attempt {i + 1} to read file failed. Waiting {delayMilliseconds}ms before retrying...");

                    // Check if the exception is related to the file being locked or in use
                    if (IsFileLocked(ex))
                    {
                        await Task.Delay(delayMilliseconds); // Wait before retrying
                    }
                    else
                    {
                        // If the issue is not related to file locking, rethrow the exception
                        throw;
                    }
                }
            }

            throw new IOException($"The file {filePath} could not be read after {retryCount} attempts.");
        }

        public static async Task<List<User>> ReadUsersFromFile(string filePath)
        {
            int retryCount = 5;
            int delayMilliseconds = 4;

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"The file {filePath} does not exist.");
            }

            for (int i = 0; i < retryCount; i++)
            {
                try
                {
                    // Try to read the file and deserialize the contents
                    string jsonString = await File.ReadAllTextAsync(filePath);
                    return JsonSerializer.Deserialize<List<User>>(jsonString);
                }
                catch (IOException ex)
                {
                    // If an I/O exception occurs (file is being used), wait and retry
                    Console.WriteLine($"Attempt {i + 1} to read file failed. Waiting {delayMilliseconds}ms before retrying...");

                    // Check if the exception is related to the file being locked or in use
                    if (IsFileLocked(ex))
                    {
                        await Task.Delay(delayMilliseconds); // Wait before retrying
                    }
                    else
                    {
                        // If the issue is not related to file locking, rethrow the exception
                        throw;
                    }
                }
            }

            throw new IOException($"The file {filePath} could not be read after {retryCount} attempts.");
        }


        // Helper method to check if the file is locked
        private static bool IsFileLocked(IOException ex)
        {
            int hResult = ex.HResult & 0xFFFF;
            return hResult == 32 || hResult == 33; // 32 = ERROR_SHARING_VIOLATION, 33 = ERROR_LOCK_VIOLATION
        }
    }
}
