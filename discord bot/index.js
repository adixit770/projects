const { Client, GatewayIntentBits } = require("discord.js");
const {configuration, OpenAIApi}=require('openai');
require('dotenv').config();
const userClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const aiconfiguration= new configuration({
    organization:process.env.openAiOrg,
    apikey:process.env.openAiKey
})

const openai=new OpenAIApi(aiconfiguration)

userClient.on("messageCreate",async (message) => {
    if(message.author.bot) return ;
    const gptResponse=await openai.createCompletion({
        model
    })
    message.reply({
        content:'hello i am your bot'
    })
});
userClient.login(process.env.TOKKEN);

