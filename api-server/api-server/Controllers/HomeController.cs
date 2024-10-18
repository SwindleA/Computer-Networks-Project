using Microsoft.AspNetCore.Mvc;
using api_server.Domain;
using System;
using Microsoft.AspNetCore.Authorization;
using api_server.Data;

namespace api_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private static IConfiguration _configuration;
        
        public HomeController(IConfiguration configuration) 
        {
            _configuration = configuration;

            

        }


        [HttpGet("Setup")]
        public IActionResult SetUp()
         {
            //All of the chats that exist
            List<Chat> chats = [];

           

            //All the users that exist
            List<User> users = [];
            User user1 = new User();
            user1.id = 1;
            user1.name = "User 1";
            user1.chats = [123];

            User user2 = new User();
            user2.id = 2;
            user2.name = "User 2";
            user2.chats = [123];

            users.Add(user1);
            users.Add(user2);

            FileWriter.WriteToFile("./Users.txt", users);

            Chat chat = new Chat();
            chat.chat_id = 123;
            chat.users_in_chat = [user1.id, user2.id];
            chats.Add(chat);

            FileWriter.WriteToFile("./Chats.txt", chats);

            Console.WriteLine("Here");

            return Ok();
        }

        [HttpGet("GetUser")]
        public IActionResult GetUser(int id)
        {
            List<User> users = FileWriter.ReadUsersFromFile("./Users.txt").Result;
            var value = users.FirstOrDefault(user => user.id == id);
            Console.WriteLine(value);
            return Ok(value);  // Returns a 200 OK status with the value
        }

        [AllowAnonymous]
        [HttpGet("GetChat")]
        public IActionResult GetChat(int id)
        {
            Console.WriteLine("Get Chat");


            List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
            var value = chats.FirstOrDefault(chat => chat.chat_id == id);

            Console.WriteLine(value);
            return Ok(value);  // Returns a 200 OK status with the value
        }

        [HttpGet("UpdateChat")]
        public IActionResult UpdateChat(int id)
        {
            Console.WriteLine("update chat watcher started");

            bool changed = false;
            List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
            Chat originalChat = chats.FirstOrDefault(chat => chat.chat_id == id);

            // Specify the path to the file or directory to be watched
            string filePath = "./Chats.txt";
            string directoryPath = Path.GetDirectoryName(filePath);
            string fileName = Path.GetFileName(filePath);

            using (FileSystemWatcher watcher = new FileSystemWatcher())
            {
                // Set the directory to watch
                watcher.Path = directoryPath;

                // Watch for changes in LastWrite time, which indicates file modification
                watcher.NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName;

                // Filter to only watch the specific file
                watcher.Filter = fileName;

                // Register the event handler
                watcher.Changed += (source, e) =>
                {
                    // This action is triggered when the file is changed
                    Console.WriteLine($"File '{e.FullPath}' was changed: {e.ChangeType}");

                    List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
                    Chat changedChat = chats.FirstOrDefault(chat => chat.chat_id == id);

                    if(changedChat != originalChat)
                    {
                        Console.WriteLine("chat changed");
                        // Disable the watcher to stop further events
                        FileSystemWatcher watcherSource = (FileSystemWatcher)source;
                        watcherSource.EnableRaisingEvents = false;
                        changed = true;

                    }

                };


                // Start watching
                watcher.EnableRaisingEvents = true;

                while (!changed) ;
            }

            List<Chat> chats2 = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
            Chat newChat = chats.FirstOrDefault(chat2 => chat2.chat_id == id);


            Console.WriteLine("** Returning updated chat");
            return Ok(newChat);


        }

        // Event handler when the file is changed or modified
        private static void OnChanged(object source, FileSystemEventArgs e)
        {
            // Specify your action here
            Console.WriteLine($"File '{e.FullPath}' was changed: {e.ChangeType}");
        }


        [HttpPost("SendMessage")]
        public IActionResult SendMessage(Message message,int chat_id)
        {
            Console.WriteLine("Send Message");

            Console.WriteLine(message);
            List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
            if (chats != null)
            {
                Chat targetChat = chats.FirstOrDefault(chat => chat.chat_id == chat_id);

                if (targetChat != null)
                {
                    targetChat.messages.Add(message);

                    FileWriter.WriteToFile("./Chats.txt", chats);

                    return Ok(targetChat);
                }
            }


            return Ok();
            
        }


        private void ForwardMessage(Chat targetChat)
        {


        }


    }
}
