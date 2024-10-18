using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api_server.Domain
{
    public class Message
    {   
        //the user that sent the message. 
        public User user {  get; set; }

        //the contents of the message
        public string message { get; set; }

        //time that message was sent
        public DateTime time { get; set; }
    }
}
