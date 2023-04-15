const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js")
const axios = require("axios")
const fs = require("fs")
const settings = require("../../botconfig/settings.json");
const { create, get, url } = require('sourcebin');

module.exports = {
    name: "vesika18",
    description: "oyuncu numarasından oyuncu bilgileri",
    cooldown: 10,
    memberpermissions: [],
    requiredroles: [
        ""// paralı pre
    ],
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
        client.channels.cache.get('').send(`${interaction.user.tag} tarafından ${tc} tc'sinin ehliyet sorgulandı.`) //logkanalid
        axios.get("https://ajexnetwork.com.tr/api/ehliyet?auth=BGLOeHRFnZosxSuoJGN&tc=" + tc)
            .then(async response => {
                var image = response.data.data.image
                const embed = new Discord.MessageEmbed().setTitle('Sonuç Yok').setImage("https://media.discordapp.net/attachments/1063758992461025351/1064595052178972734/sonucyok.jpg");
                //channel.send({ embeds: [embed], files: ['./image.png'] });
                if (response.data.data.okulnumara === null) return await interaction.followUp({ embeds: [embed], ephemeral: true });

                var data = image.replace(/^data:image\/\w+;base64,/, '');
                fs.writeFile(`./${tc}.webp`, data, { encoding: 'base64' }, function (err) {
                    if (err) return console.log(err)
                    const embed = new Discord.MessageEmbed().setDescription(`Ehliyet Vesika Sorgulama:`) .setFooter('❤️jahwex#1758').setImage(`attachment://${tc}.webp`);

                    try {
                        interaction.followUp({ embeds: [embed], files: [`./${tc}.webp`], ephemeral: true });
                        fs.unlink(`./${tc}.webp`)
                    } catch (e) {
                   
                    }


                });

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