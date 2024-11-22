using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api_server.Domain
{
    public class User
    {
        //User's unique id
        public int id { get; set; }

        //User's name
        public string name { get; set; }


        //chats that the user is in, key is the chat id, value is the chat name
        public Dictionary<int,string> chats { get; set; } = new Dictionary<int, string>();

    }
}
