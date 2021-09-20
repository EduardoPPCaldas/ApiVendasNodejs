import nodemailer from "nodemailer"
import handlebarsMailTemplate from "./HandleBarsMailTemplate"

interface ITemplateVariable {
  [key: string]: string | number
}

interface IParseMailTemplate {
  file: string
  variables: ITemplateVariable
}

interface IMailContact {
  name: string
  email: string
}

interface ISendMail {
  to: IMailContact
  from?: IMailContact
  templateData: IParseMailTemplate
  subject: string
}

export default class EtherealMail {
  static async sendMail({ to, from, subject, templateData }: ISendMail): Promise<void>{
    const account = await nodemailer.createTestAccount()

    const mailTemplate = new handlebarsMailTemplate()

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    })

    const message = await transporter.sendMail({
      from:{
        name: from?.name || "Eduardo Caldas",
        address: from?.email || "eduardocaldas.dev@gmail.com"
      },
      to:{
        name: to.name,
        address: to.email
      },
      subject,
      html: await mailTemplate.parse({
        file: templateData.file,
        variables: templateData.variables
      })
    })

    console.log("Message sent: %s", message.messageId)

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))

  }
}