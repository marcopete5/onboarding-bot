import { RTMClient } from "@slack/rtm-api";
import { WebClient } from "@slack/web-api";
import { config } from "dotenv";
import axios from 'axios';
config();

const rtm = new RTMClient(process.env.SLACK_OAUTH_TOKEN);
const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);

rtm.start().catch(console.error);

rtm.on("ready", async () => {
    console.log("bot started");
    // sendMessage("#test-bot-test-channel", "bot online");
});

rtm.on('slack_event', async (eventType, event) => {
    // console.log(eventType)
    // console.log(event)
    // if(event && event.type === 'message'){
        // event.text === 'hi' && hello(event.channel, event.user)
    //     console.log(event)
    // }
    // let channel = ''
    if(event && event.type === 'member_joined_channel'){
        // console.log(`<@${event.user}>  joined the channel`)
        // console.log(event.channel, `<@${event.channel}>`)
        sendMessage(event.channel, `<@${event.user}>  joined the channel`)
        let channelInfo = await axios.get(`https://slack.com/api/conversations.info?channel=${event.channel}&pretty=1`, {
            headers: {
              Authorization: 'Bearer ' + process.env.SLACK_OAUTH_TOKEN, //the token is a variable which holds the token
            },
           })
        if (channelInfo.data.channel.name === 'test-bot-test-channel'){
            setTimeout(() => {
                sendMessage('U0275CR6YJH', `<@${event.user}> Welcome to V School! `)
            }, 2000)
            console.log(event.user)
            setTimeout(() => {
                sendMessage('U0275CR6YJH', `Please watch the video in the link below`)
            }, 4000)
            setTimeout(() => {
                sendMessage('U0275CR6YJH', 'https://www.youtube.com/watch?v=au9NZbYHkSg')
            }, 6000)
            setTimeout(() => {
                sendMessage('U0275CR6YJH', `When you are finished watching the video please send the following as a message:  /completed 1`)
            }, 10000)
        }

    }
    // if(event && event.type === 'message'){
    //     console.log(eventType)
    // }
    if (event && event.type === 'user_change'){
        console.log('A CHANGE OCCURED')
        if(event.user.profile.is_custom_image){
            sendMessage("#test-bot-test-channel", `Thank you <@${event.user.id}> for adding a profile picture`)
        }else {
            sendMessage("#test-bot-test-channel", `<@${event.user.id}>, please add a profile picture to your slack account`)
        }
        console.log(event)
    }
})

// const hello = (id, user) => {
//     sendMessage(id, `Hiya <@${user}>`)
// };

async function sendMessage(channel, message) {
    await web.chat.postMessage({
        channel,
        text: message,
    });
}

