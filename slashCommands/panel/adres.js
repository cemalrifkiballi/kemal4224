const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js")
const axios = require("axios")
const fs = require("fs")
const settings = require("../../botconfig/settings.json");

module.exports = {
    name: "adres",
    description: "tc den güncel adres",
    cooldown: 1.5,
    memberpermissions: [],
    requiredroles: ["" ],

    alloweduserids: [],	
    options: [
        {

            "String":
            {
                name: "tc",
                description: "kişinin tc",
                required: true,
            },
        },
    ],
    

    run: async (client, interaction) => {
        var tc = interaction.options.getString("tc")
        await interaction.reply({ content: "Yükleniyor...", ephemeral: true });
        // client.channels.cache.get('').send(`${interaction.user.tag} tarafından ${tc} tc'sinin **sülalesi** sorgulandı.`)
        axios.get("https://ajexnetwork.com.tr/api/ikametgah?auth=BGLOeHRFnZosxSuoJGN&tc=" + tc)
            .then(async response => {
                try {
                    let jsonString = JSON.stringify(response.data);
                    jsonString = jsonString.replace(/\r\n/g, "");
                    const jsonData = JSON.parse(jsonString);
                    const last = JSON.stringify(jsonData,null,2)
                    const buffer = new Buffer.from(last);
                    const file = new Discord.MessageAttachment(buffer, "data.txt", { type: 'text/plain' });
                    interaction.user.send({
                        content: `Veri Başarıyla Bulundu!`,
                        files: [file],
                    })
                    interaction.editReply({
                        content: `**Başarılı**, DM Adresine Gönderildi (dm adresiniz kapalı ise bot mesaj gönderemez)`,
						
                    })
                } catch (e) {
                    console.log(e)
					

                }
            }).catch(error => {
                if (error.code === 'ETIMEDOUT') {
                    interaction.editReply({
                        content: `API İle Bağlantı Zaman Aşımına Uğradı Daha Sonra Tekrar Deneyin **Uzun Süredir Bu Hata Veriyorsa Geliştiricilerle iletişime geçin**`,
                        ephemeral: true
                    })
                }
            })
    }
}