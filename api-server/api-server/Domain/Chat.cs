﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api_server.Domain
{
    public class Chat
    {
        //The unique id for the chat
        public int chat_id { get; set; }

        //The Display name of the chat
        public string chat_name { get; set; }

        //the users involved in the chat
        public List<User> users_in_chat { get; set; } = [];

        //the messages in the chat
        public List<Message> messages { get; set; } = [];
    }
}
