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
        public int user_id {  get; set; }

        //the contents of the message
        public string message { get; set; }

        //time that message was sent
        public string time { get; set; }

        public string date { get; set; }
    }
}
