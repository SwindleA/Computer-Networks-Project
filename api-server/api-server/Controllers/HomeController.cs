using Microsoft.AspNetCore.Mvc;
using api_server.Domain;
using Microsoft.AspNetCore.Authorization;
using api_server.Data;
using System.Text.Json;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

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


        //this is to generate a blank chat with two users for the application to work if you cleared the Chats file.
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
            chat.chat_name = "Test Convo";
            chat.chat_id = 123;
            chat.users_in_chat = [user1, user2];
            chats.Add(chat);

            FileWriter.WriteToFile("./Chats.txt", chats);

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


        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            List<User> users = FileWriter.ReadUsersFromFile("./Users.txt").Result;
            
            Console.WriteLine(users);
            return Ok(users);  // Returns a 200 OK status with the value
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

        //[AllowAnonymous]
        //[HttpGet("GetChats")]
        //public IActionResult GetChats(int id)
        //{
        //    Console.WriteLine("Get Chats");

        //    var user = GetUser(id) as User;

        //    List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
        //    var value = chats.FindAll(chat => chat.users_in_chat.Contains(user));

        //    Console.WriteLine(value);
        //    return Ok(value);  // Returns a 200 OK status with the value
        //}


        [HttpGet("UpdateChat")]
        public async Task<string> UpdateChat()
        {
            bool changed = false;
            List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
            Chat changedChat = null;


            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                Console.WriteLine("update chat watcher started");
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

                var buffer = new byte[1024 * 4];

                //read the chat id from the socket
                var receiveResult = await webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer), CancellationToken.None);

                string string_id = Encoding.UTF8.GetString(buffer).TrimEnd('\0');

                //chat id
                int id = int.Parse(string_id);

                //get the current existing version of the chat
                Chat originalChat = chats.FirstOrDefault(chat => chat.chat_id == id);

                //while the connection is established? maybe?
                while (!receiveResult.CloseStatus.HasValue)
                {
                    

                    // Specify the path to the file or directory to be watched
                    string filePath = "./Chats.txt";
                    string directoryPath = Path.GetDirectoryName(filePath);
                    string fileName = Path.GetFileName(filePath);

                    //this watches for any changes made to the Chats file. 
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
                            changedChat = chats.FirstOrDefault(chat => chat.chat_id == id);

                            if (changedChat != originalChat)
                            {
                                Console.WriteLine("chat changed");
                                // Disable the watcher to stop further events when the chat changed is the chat we are listening for
                                FileSystemWatcher watcherSource = (FileSystemWatcher)source;
                                watcherSource.EnableRaisingEvents = false;
                                changed = true;

                            }

                        };


                        // Start watching
                        watcher.EnableRaisingEvents = true;

                        //this loops keeps the watcher running until a change happens to the chat.  
                        while (!changed);
                    }
                   
                    //if the watcher is no longer watching, but the chat to return was never set.
                    if(changedChat == null) { return "BAD"; }

                    Console.WriteLine("** Returning updated chat");
                    
                    //convert the chat data structure to a byte array
                    byte[] byteArray = JsonSerializer.SerializeToUtf8Bytes(changedChat);

                    var arraySegment = new ArraySegment<byte>(byteArray);

                    //write the chat to the socket connection to the user. 
                    await webSocket.SendAsync(
                        arraySegment,
                        receiveResult.MessageType,
                        receiveResult.EndOfMessage,
                        CancellationToken.None);

                    receiveResult = await webSocket.ReceiveAsync(
                        new ArraySegment<byte>(buffer), CancellationToken.None);
                }

                await webSocket.CloseAsync(
                    receiveResult.CloseStatus.Value,
                    receiveResult.CloseStatusDescription,
                    CancellationToken.None);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }

            return "Ok";
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


            return StatusCode(500);
            
        }


        [HttpPost("CreateChat")]
        public async Task<IActionResult> CreateChat(Chat chat,int id) 
        {
            Console.WriteLine("CreateChat");
            Console.WriteLine(chat);

            //create new chat ID
            List<Chat> chats = FileWriter.ReadChatsFromFile("./Chats.txt").Result;
            int new_chat_id = -1;
            bool id_created = false;
            while (!id_created)
            {
                
                Random rnd = new Random();
                new_chat_id = rnd.Next(100, 999);

                
                Chat targetChat = chats.FirstOrDefault(chat => chat.chat_id == new_chat_id);
                if (targetChat == null)
                {
                    id_created = true;
                }
            }

            chat.chat_id = new_chat_id;

            Message intro_message = new Message();

            intro_message.message = "New chat created";

            chat.messages.Add(intro_message);

            //write chat to txt
            chats.Add(chat);

            FileWriter.WriteToFile("./Chats.txt", chats);

            //add chat to user's chat list

            List<User> users = FileWriter.ReadUsersFromFile("./Users.txt").Result;
            
            for(int j =0; j<chat.users_in_chat.Count; j++)
            {
                

                for(int i =0; i< users.Count; i++ )
                {
                    if (chat.users_in_chat[j].id == users[i].id)
                    {
                        int[] updated_chat_array = new int[users[i].chats.Count + 1];
                        users[i].chats.Add(chat.chat_id);
                    }

                }

            }
            

            FileWriter.WriteToFile("./Users.txt", users);


            return Ok(chat);
        }


    }
}
