module.exports = async (client, thread) => {
    if(thread.joinable){
        try{
            await thread.join();
        }catch (e){
            console.log(e)
        }
    }
}
/**
 * @INFO
 * Bot Coded by nafesto#2025 | https://discord.gg/zyXDy22J78 
 */
