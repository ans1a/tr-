import { logger } from "@vendetta"
import { registerCommand } from "@vendetta/commands"
import { ApplicationCommandInputType, ApplicationCommandType, ApplicationCommandOptionType } from "../../../../ApplicationCommandTypes"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Codeblock } from "@vendetta/ui/components"
import { showConfirmationAlert } from "@vendetta/ui/alerts"
import { findByProps } from "@vendetta/metro"
import { translateWithSlang } from "./patterns"

const ClydeUtils = findByProps("sendBotMessage")

export default registerCommand({
    name: "tr",
    displayName: "tr",
    description: "Traduz português para inglês com gírias naturais",
    displayDescription: "Traduz português para inglês com gírias naturais",
    applicationId: "-1",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    options: [
        {
            name: "text",
            displayName: "text",
            description: "Texto em português para traduzir",
            displayDescription: "Texto em português para traduzir",
            type: ApplicationCommandOptionType.STRING as number,
            required: true
        }
    ],
    async execute(args, ctx) {
        const [text] = args
        try {
            const translated = await translateWithSlang(text.value)
            
            return await new Promise((resolve): void => showConfirmationAlert({
                title: "Tradução",
                content: (
                    <Codeblock>
                        {translated}
                    </Codeblock>
                ),
                confirmText: "Enviar",
                onConfirm: () => resolve({ content: translated }),
                cancelText: "Cancelar"
            }))
        } catch (e) {
            logger.error(e)
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Erro na tradução. Verifique os Debug Logs.")
        }
    }
})
