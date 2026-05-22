import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path'
import * as fs  from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FileService {

    async createdFile(file: any): Promise<string>{
        try{
            const fileName = uuid.v4() + '.jpg'
            console.log(fileName)
            const filePath = path.resolve(process.cwd(), 'static');
            console.log(filePath)
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName
        } catch(e){
            console.log(e)
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
