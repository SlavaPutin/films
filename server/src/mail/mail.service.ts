import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendActivationMail(to: string, link: string) {
        try{
            await this.mailerService.sendMail({
            to,
            subject: 'Активация аккаунта на Films',
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
            });
        }   catch(e){
            throw new HttpException('Не удалось отправить письмо подтверждения, проверьте правильность почты', HttpStatus.BAD_REQUEST)
        }
    }
}